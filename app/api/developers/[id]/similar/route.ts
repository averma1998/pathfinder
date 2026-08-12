import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";

export async function GET(
    request: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json(
            {
                success: false,
                message: "Developer ID is required",
            },
            { status: 400 }
        );
    }

    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (developer:Developer {id: $developerId})
                  -[:HAS_SKILL]->(sharedSkill:Skill)
                  <-[:HAS_SKILL]-(similar:Developer)

            WHERE similar.id <> developer.id

            WITH
                similar,
                collect(DISTINCT sharedSkill.name) AS sharedSkills,
                count(DISTINCT sharedSkill) AS sharedSkillCount

            RETURN
                similar.id AS developerId,
                similar.name AS developerName,
                similar.location AS location,
                similar.experience AS experience,
                sharedSkills,
                sharedSkillCount

            ORDER BY sharedSkillCount DESC
            LIMIT 5
            `,
            {
                developerId: id,
            }
        );

        const developers = result.records.map(
            (record) => ({
                developerId:
                    record.get("developerId"),

                developerName:
                    record.get("developerName"),

                location:
                    record.get("location"),

                experience:
                    record.get("experience"),

                sharedSkills:
                    record.get("sharedSkills"),

                sharedSkillCount:
                    record.get(
                        "sharedSkillCount"
                    ).toNumber(),
            })
        );

        return NextResponse.json({
            success: true,
            developers,
        });
    } catch (error) {
        console.error(
            "Similar developers query failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to find similar developers",
            },
            { status: 503 }
        );
    } finally {
        await session.close();
    }
}