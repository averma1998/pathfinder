import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const developerId = searchParams.get("developerId");
  const jobId = searchParams.get("jobId");

  if (!developerId || !jobId) {
    return NextResponse.json(
      {
        success: false,
        message: "developerId and jobId are required",
      },
      { status: 400 }
    );
  }

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (d:Developer {id: $developerId})
      MATCH (j:Job {id: $jobId})
      MATCH (j)-[:REQUIRES]->(required:Skill)

      OPTIONAL MATCH (d)-[:HAS_SKILL]->(current:Skill)

      WITH
        d,
        j,
        required,
        collect(current.id) AS currentSkillIds

      WHERE NOT required.id IN currentSkillIds

      RETURN
        required.id AS skillId,
        required.name AS skill,
        required.category AS category

      ORDER BY skill
      `,
      {
        developerId,
        jobId,
      }
    );

    const missingSkills = result.records.map((record) => ({
      id: record.get("skillId"),
      name: record.get("skill"),
      category: record.get("category"),
    }));

    return NextResponse.json({
      success: true,
      developerId,
      jobId,
      missingSkills,
    });
  } catch (error) {
    console.error("Career path error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to calculate career path",
      },
      { status: 503 }
    );
  } finally {
    await session.close();
  }
}