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
      MATCH (d:Developer)-[:WORKED_ON]->(p:Project)
            -[:USES]->(t:Technology)
      WHERE d.id = $developerId
      RETURN
        p.id AS projectId,
        p.name AS project,
        p.description AS description,
        collect({
          id: t.id,
          name: t.name,
          category: t.category
        }) AS technologies
      ORDER BY p.name
      `,
      {
        developerId: id,
      }
    );

    const projects = result.records.map((record) => ({
      id: record.get("projectId"),
      name: record.get("project"),
      description: record.get("description"),
      technologies: record.get("technologies"),
    }));

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Projects API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve projects",
      },
      { status: 503 }
    );
  } finally {
    await session.close();
  }
}