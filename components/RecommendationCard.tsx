"use client";

type Recommendation = {
    currentSkillId: string;
    currentSkill: string;
    recommendedSkillId: string;
    recommendedSkill: string;
    category: string;
    jobId: string;
    targetRole: string;
};

type Props = {
    recommendations: Recommendation[];
};

export default function RecommendationCard({
    recommendations,
}: Props) {
    if (recommendations.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-slate-300">
                    No graph-based recommendations found.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                    Try another target role or expand your
                    skill profile.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map(
                (recommendation, index) => (
                    <div
                        key={`${recommendation.recommendedSkillId}-${index}`}
                        className="rounded-2xl border border-cyan-900/60 bg-slate-900 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs font-medium text-cyan-300">
                                {recommendation.category}
                            </span>

                            <span className="text-xs text-slate-500">
                                Recommended
                            </span>
                        </div>

                        <h3 className="mt-5 text-xl font-semibold text-white">
                            {recommendation.recommendedSkill}
                        </h3>

                        <p className="mt-3 text-sm text-slate-400">
                            Your existing{" "}
                            <span className="font-medium text-slate-200">
                                {recommendation.currentSkill}
                            </span>{" "}
                            experience connects to this skill.
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-sm">
                            <span className="rounded-lg bg-slate-800 px-3 py-2 text-slate-300">
                                {recommendation.currentSkill}
                            </span>

                            <span className="text-cyan-400">
                                →
                            </span>

                            <span className="rounded-lg bg-cyan-950 px-3 py-2 text-cyan-300">
                                {recommendation.recommendedSkill}
                            </span>
                        </div>

                        <div className="mt-5 border-t border-slate-800 pt-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                Required by target role
                            </p>

                            <p className="mt-1 text-sm text-slate-300">
                                {recommendation.targetRole}
                            </p>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}