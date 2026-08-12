"use client";

import { useEffect, useState } from "react";

type SimilarDeveloper = {
  developerId: string;
  developerName: string;
  location: string;
  experience: number;
  sharedSkills: string[];
  sharedSkillCount: number;
};

type Props = {
  developerId: string;
};

export default function SimilarDevelopers({
  developerId,
}: Props) {
  const [developers, setDevelopers] = useState<
    SimilarDeveloper[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSimilarDevelopers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/developers/${developerId}/similar`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load similar developers"
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message ||
              "Unable to load similar developers"
          );
        }

        setDevelopers(data.developers);
      } catch (error) {
        console.error(
          "Similar developers error:",
          error
        );

        setError(
          "Unable to load similar developers."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSimilarDevelopers();
  }, [developerId]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="h-5 w-40 rounded bg-slate-800" />

            <div className="mt-3 h-4 w-56 rounded bg-slate-800" />

            <div className="mt-6 flex gap-2">
              <div className="h-6 w-20 rounded bg-slate-800" />
              <div className="h-6 w-24 rounded bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-900 bg-red-950/20 p-6">
        <p className="text-sm text-red-400">
          {error}
        </p>
      </div>
    );
  }

  if (developers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="font-medium text-slate-300">
          No similar developers found.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          More developer profiles will improve
          similarity matching.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {developers.map((developer) => (
        <div
          key={developer.developerId}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-700"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {developer.developerName}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {developer.location} ·{" "}
                {developer.experience} years experience
              </p>
            </div>

            <div className="shrink-0 rounded-full bg-cyan-950 px-3 py-1 text-xs font-medium text-cyan-300">
              {developer.sharedSkillCount} shared
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
              Shared skills
            </p>

            <div className="flex flex-wrap gap-2">
              {developer.sharedSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}