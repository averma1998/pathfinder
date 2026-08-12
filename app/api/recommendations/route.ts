import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const developerId =
        searchParams.get("developerId");

    const jobId =
        searchParams.get("jobId");

    if (!developerId || !jobId) {
        return NextResponse.json(
            {
                success: false,
                message:
                    "developerId and jobId are required",
            },
            { status: 400 }
        );
    }

    const session = driver.session();

    try {
        const result = await session.run(
            `
            MATCH (d:Developer {id: $developerId})
                  -[:HAS_SKILL]->(current:Skill)
                  -[:RELATED_TO]->(recommended:Skill)

            MATCH (job:Job {id: $jobId})
                  -[:REQUIRES]->(recommended)

            RETURN DISTINCT
                current.id AS currentSkillId,
                current.name AS currentSkill,
                recommended.id AS recommendedSkillId,
                recommended.name AS recommendedSkill,
                recommended.category AS category,
                job.id AS jobId,
                job.title AS targetRole

            ORDER BY currentSkill, recommendedSkill
            `,
            {
                developerId,
                jobId,
            }
        );

        const recommendations =
            result.records.map((record) => ({
                currentSkillId:
                    record.get("currentSkillId"),

                currentSkill:
                    record.get("currentSkill"),

                recommendedSkillId:
                    record.get("recommendedSkillId"),

                recommendedSkill:
                    record.get("recommendedSkill"),

                category:
                    record.get("category"),

                jobId:
                    record.get("jobId"),

                targetRole:
                    record.get("targetRole"),
            }));

        return NextResponse.json({
            success: true,
            recommendations,
        });

    } catch (error) {
        console.error(
            "Recommendation query failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to calculate career recommendations",
            },
            { status: 503 }
        );

    } finally {
        await session.close();
    }
}