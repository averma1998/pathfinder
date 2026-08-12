import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (d:Developer)-[:HAS_SKILL]->(s:Skill)
      WHERE d.id = $developerId
      RETURN
        d.id AS id,
        d.name AS name,
        d.experience AS experience,
        d.location AS location,
        collect({
          id: s.id,
          name: s.name,
          category: s.category
        }) AS skills
      `,
      {
        developerId: id,
      }
    );

    if (result.records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Developer not found",
        },
        { status: 404 }
      );
    }

    const record = result.records[0];

    return NextResponse.json({
      success: true,
      developer: {
        id: record.get("id"),
        name: record.get("name"),
        experience: record.get("experience"),
        location: record.get("location"),
        skills: record.get("skills"),
      },
    });
  } catch (error) {
    console.error("Developer API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve developer",
      },
      { status: 503 }
    );
  } finally {
    await session.close();
  }
}