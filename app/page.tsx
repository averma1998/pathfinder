"use client";

import { useState } from "react";

type Developer = {
  id: string;
  name: string;
  experience: number;
  location: string;
};

type Job = {
  id: string;
  title: string;
  level: string;
};

const developers: Developer[] = [
  {
    id: "dev-001",
    name: "Ayush Verma",
    experience: 2,
    location: "Bhopal",
  },
  {
    id: "dev-002",
    name: "Rahul Sharma",
    experience: 4,
    location: "Bangalore",
  },
  {
    id: "dev-003",
    name: "Priya Singh",
    experience: 3,
    location: "Pune",
  },
  {
    id: "dev-004",
    name: "Neha Gupta",
    experience: 5,
    location: "Hyderabad",
  },
  {
    id: "dev-005",
    name: "Arjun Mehta",
    experience: 2,
    location: "Delhi",
  },
  {
    id: "dev-006",
    name: "Riya Patel",
    experience: 6,
    location: "Mumbai",
  },
];

const jobs: Job[] = [
  {
    id: "job-001",
    title: "Backend Engineer",
    level: "Mid",
  },
  {
    id: "job-002",
    title: "Frontend Engineer",
    level: "Mid",
  },
  {
    id: "job-003",
    title: "Full Stack Engineer",
    level: "Mid",
  },
  {
    id: "job-004",
    title: "DevOps Engineer",
    level: "Mid",
  },
  {
    id: "job-005",
    title: "Software Engineer",
    level: "Entry",
  },
];

export default function Home() {
  const [developerId, setDeveloperId] = useState("dev-001");
  const [jobId, setJobId] = useState("job-001");

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Header */}

        <header className="mb-16">
          <div className="mb-3 text-sm font-medium text-cyan-400">
            PATHFINDER
          </div>

          <h1 className="max-w-3xl text-5xl font-bold tracking-tight">
            Find the skills that connect you to your next role.
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-slate-400">
            Explore the relationships between your skills, projects,
            technologies and career opportunities using a graph database.
          </p>
        </header>

        {/* Selection */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="text-xl font-semibold">
            Build your career path
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Choose your profile and the role you want to target.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            {/* Developer */}

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Your profile
              </label>

              <select
                value={developerId}
                onChange={(e) => setDeveloperId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              >
                {developers.map((developer) => (
                  <option
                    key={developer.id}
                    value={developer.id}
                  >
                    {developer.name} — {developer.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Job */}

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Target role
              </label>

              <select
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
              >
                {jobs.map((job) => (
                  <option
                    key={job.id}
                    value={job.id}
                  >
                    {job.title} — {job.level}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <button
            onClick={() => {
              window.location.href =
                `/career-path?developerId=${developerId}&jobId=${jobId}`;
            }}
            className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Analyze my career path →
          </button>

        </section>

        {/* Explanation */}

        <section className="mt-16 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 p-6">
            <div className="text-2xl">◈</div>
            <h3 className="mt-4 font-semibold">
              Skills
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Understand the skills you already have.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 p-6">
            <div className="text-2xl">↗</div>
            <h3 className="mt-4 font-semibold">
              Connections
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Discover relationships between skills,
              projects and technologies.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 p-6">
            <div className="text-2xl">◎</div>
            <h3 className="mt-4 font-semibold">
              Career path
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Identify the skills that can move you
              toward your target role.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}