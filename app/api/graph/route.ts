import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const developerId = searchParams.get("developerId");

  if (!developerId) {
    return NextResponse.json(
      {
        success: false,
        message: "developerId is required",
      },
      { status: 400 }
    );
  }

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (d:Developer {id: $developerId})

      OPTIONAL MATCH path1 =
        (d)-[:HAS_SKILL]->(s:Skill)

      OPTIONAL MATCH path2 =
        (d)-[:WORKED_ON]->(p:Project)
        -[:USES]->(t:Technology)

      RETURN
        d,
        collect(DISTINCT s) AS skills,
        collect(DISTINCT p) AS projects,
        collect(DISTINCT t) AS technologies
      `,
      {
        developerId,
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

    const developer = record.get("d").properties;
    const skills = record.get("skills");
    const projects = record.get("projects");
    const technologies = record.get("technologies");

    const nodes = [
      {
        id: developer.id,
        type: "developer",
        label: developer.name,
        data: developer,
      },

      ...skills
        .filter((node: any) => node)
        .map((node: any) => ({
          id: node.properties.id,
          type: "skill",
          label: node.properties.name,
          data: node.properties,
        })),

      ...projects
        .filter((node: any) => node)
        .map((node: any) => ({
          id: node.properties.id,
          type: "project",
          label: node.properties.name,
          data: node.properties,
        })),

      ...technologies
        .filter((node: any) => node)
        .map((node: any) => ({
          id: node.properties.id,
          type: "technology",
          label: node.properties.name,
          data: node.properties,
        })),
    ];

    const edgesResult = await session.run(
      `
      MATCH (d:Developer {id: $developerId})

      OPTIONAL MATCH (d)-[r1:HAS_SKILL]->(s:Skill)

      OPTIONAL MATCH (d)-[r2:WORKED_ON]->(p:Project)
      OPTIONAL MATCH (p)-[r3:USES]->(t:Technology)

      RETURN
        collect(DISTINCT {
          source: d.id,
          target: s.id,
          relationship: type(r1)
        }) AS skillEdges,

        collect(DISTINCT {
          source: d.id,
          target: p.id,
          relationship: type(r2)
        }) AS projectEdges,

        collect(DISTINCT {
          source: p.id,
          target: t.id,
          relationship: type(r3)
        }) AS technologyEdges
      `,
      {
        developerId,
      }
    );

    const edgeRecord = edgesResult.records[0];

    const skillEdges = edgeRecord.get("skillEdges");
    const projectEdges = edgeRecord.get("projectEdges");
    const technologyEdges = edgeRecord.get("technologyEdges");

    const edges = [
      ...skillEdges,
      ...projectEdges,
      ...technologyEdges,
    ]
      .filter(
        (edge: any) =>
          edge.source &&
          edge.target &&
          edge.relationship
      )
      .map((edge: any, index: number) => ({
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,
        label: edge.relationship,
        animated: false,
      }));

    return NextResponse.json({
      success: true,
      nodes,
      edges,
    });
  } catch (error) {
    console.error("Graph API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve graph",
      },
      { status: 503 }
    );
  } finally {
    await session.close();
  }
}