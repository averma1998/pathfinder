"use client";

import GraphView from "@/components/GraphView";
import { useEffect, useState } from "react";
import RecommendationCard from "@/components/RecommendationCard";
import SimilarDevelopers from "@/components/SimilarDevelopers";

type Skill = {
  id: string;
  name: string;
  category: string;
};

type Developer = {
  id: string;
  name: string;
  experience: number;
  location: string;
  skills: Skill[];
};

type Project = {
  id: string;
  name: string;
  description: string;
  technologies: {
    id: string;
    name: string;
    category: string;
  }[];
};

type Recommendation = {
  currentSkillId: string;
  currentSkill: string;
  recommendedSkillId: string;
  recommendedSkill: string;
  category: string;
  jobId: string;
  targetRole: string;
};

type CareerData = {
  developer: Developer;
  projects: Project[];
  missingSkills: Skill[];
  recommendations: Recommendation[];
};

export default function CareerPathPage() {
  const [data, setData] = useState<CareerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const developerId = params.get("developerId");
    const jobId = params.get("jobId");

    if (!developerId || !jobId) {
      setError("Developer and target role are required.");
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [
          developerResponse,
          projectResponse,
          careerResponse,
          recommendationResponse,
        ] = await Promise.all([
          fetch(`/api/developers/${developerId}`),

          fetch(`/api/developers/${developerId}/projects`),

          fetch(
            `/api/career-path?developerId=${developerId}&jobId=${jobId}`
          ),

          fetch(
            `/api/recommendations?developerId=${developerId}&jobId=${jobId}`
          ),
        ]);

        if (
          !developerResponse.ok ||
          !projectResponse.ok ||
          !careerResponse.ok ||
          !recommendationResponse.ok
        ) {
          throw new Error("Failed to load career data.");
        }

        const developerData = await developerResponse.json();
        const projectData = await projectResponse.json();
        const careerData = await careerResponse.json();
        const recommendationData =
          await recommendationResponse.json();

        setData({
          developer: developerData.developer,
          projects: projectData.projects,
          missingSkills: careerData.missingSkills,
          recommendations:
            recommendationData.recommendations,
        });
      } catch (error) {
        console.error("Career page error:", error);
        setError("Unable to load career path.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /*
   * Loading state
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">

          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

          <p className="text-slate-400">
            Analyzing your career graph...
          </p>

        </div>
      </main>
    );
  }

  /*
   * Error state
   */
  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

        <div className="w-full max-w-lg rounded-2xl border border-red-900 bg-red-950/30 p-8 text-center">

          <h1 className="text-xl font-semibold">
            Something went wrong
          </h1>

          <p className="mt-2 text-slate-400">
            {error || "Unable to load data."}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">

            <a
              href="/"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
            >
              Back to PathFinder
            </a>

          </div>

        </div>

      </main>
    );
  }

  /*
   * Main career analysis page
   */
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* =====================================================
            TOP NAVIGATION
        ====================================================== */}

        <div className="flex items-center justify-between gap-4">

          <a
            href="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to PathFinder
          </a>

          <div className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-500">
            Graph powered by CognoDB
          </div>

        </div>


        {/* =====================================================
            DEVELOPER PROFILE
        ====================================================== */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 bg-gradient-to-r from-cyan-950/40 to-slate-900 px-8 py-6">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Career Analysis
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              {data.developer.name}
            </h1>

            <p className="mt-2 text-slate-400">
              {data.developer.experience} years experience
              {" · "}
              {data.developer.location}
            </p>

          </div>

          <div className="px-8 py-6">

            <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
              Current Skills
            </p>

            <div className="flex flex-wrap gap-2">

              {data.developer.skills.map((skill) => (

                <span
                  key={skill.id}
                  className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-sm text-slate-300"
                >
                  {skill.name}
                </span>

              ))}

            </div>

          </div>

        </section>


        {/* =====================================================
            CAREER GAP
        ====================================================== */}

        <section className="mt-12">

          <div className="mb-6">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Career Gap
            </p>

            <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

              <div>

                <h2 className="text-2xl font-bold">
                  Skills to develop
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Skills required by your target role that are
                  not currently connected to your profile.
                </p>

              </div>

              <div className="rounded-full border border-amber-900/50 bg-amber-950/30 px-4 py-2 text-sm text-amber-300">
                {data.missingSkills.length}{" "}
                {data.missingSkills.length === 1
                  ? "skill"
                  : "skills"}{" "}
                missing
              </div>

            </div>

          </div>


          {/* Missing skill cards */}

          {data.missingSkills.length === 0 ? (

            <div className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">

              <p className="font-medium text-emerald-400">
                Great match!
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Your current skills cover the requirements
                of this target role.
              </p>

            </div>

          ) : (

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {data.missingSkills.map((skill) => (

                <div
                  key={skill.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-0.5 hover:border-amber-800"
                >

                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    {skill.category}
                  </div>

                  <h3 className="mt-3 text-lg font-semibold">
                    {skill.name}
                  </h3>

                  <div className="mt-4 text-sm text-amber-400">
                    Missing skill
                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* =====================================================
            GRAPH BASED RECOMMENDATIONS
        ====================================================== */}

        <section className="mt-14">

          <div className="mb-6">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Graph-Based Recommendations
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Your next best skills
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Recommendations are derived from relationships
              between your existing skills, related technologies,
              and the requirements of your target role.
            </p>

          </div>

          <RecommendationCard
            recommendations={data.recommendations}
          />

        </section>


        {/* =====================================================
            PROJECT EXPERIENCE
        ====================================================== */}

        <section className="mt-14">

          <div className="mb-6">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Experience
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Your projects
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Projects connected to your developer profile
              through the career graph.
            </p>

          </div>


          {data.projects.length === 0 ? (

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
              No projects found for this developer.
            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2">

              {data.projects.map((project) => (

                <div
                  key={project.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                >

                  <h3 className="text-xl font-semibold">
                    {project.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">

                    {project.technologies.map(
                      (technology) => (

                        <span
                          key={technology.id}
                          className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300"
                        >
                          {technology.name}
                        </span>

                      )
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* =====================================================
            SIMILAR DEVELOPERS
        ====================================================== */}

        <section className="mt-14">

          <div className="mb-6">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Graph Matching
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Developers with similar skills
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              These profiles share skills with you.
              Pathfinder finds them by traversing
              developer-skill relationships in the graph.
            </p>

          </div>

          <SimilarDevelopers
            developerId={data.developer.id}
          />

        </section>


        {/* =====================================================
            GRAPH EXPLORER
        ====================================================== */}

        <section className="mt-14">

          <div className="mb-6">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Graph Explorer
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Explore your career graph
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Explore how your developer profile connects
              to skills, projects, and technologies through
              CognoDB.
            </p>

          </div>


          {/* ACTUAL GRAPH */}

          <div className="w-full">

            <GraphView
              developerId={data.developer.id}
            />

          </div>

        </section>


        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="mt-16 border-t border-slate-900 pt-6 pb-4">

          <div className="flex flex-col justify-between gap-2 text-xs text-slate-600 sm:flex-row">

            <p>
              Pathfinder · Developer Career Intelligence
            </p>

            <p>
              Powered by CognoDB
            </p>

          </div>

        </footer>

      </div>

    </main>
  );
}