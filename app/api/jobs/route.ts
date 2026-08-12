import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (job:Job)
      OPTIONAL MATCH (job)-[:REQUIRES]->(skill:Skill)

      WITH
        job,
        collect({
          id: skill.id,
          name: skill.name,
          category: skill.category
        }) AS skills

      RETURN
        job.id AS id,
        job.title AS title,
        job.company AS company,
        skills
      ORDER BY job.title
    `);

    const jobs = result.records.map((record) => ({
      id: record.get("id"),
      title: record.get("title"),
      company: record.get("company"),
      skills: record.get("skills"),
    }));

    return NextResponse.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Jobs API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load target roles.",
      },
      { status: 503 }
    );
  } finally {
    await session.close();
  }
}