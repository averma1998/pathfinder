import { loadEnvConfig } from "@next/env";
import neo4j from "neo4j-driver";

loadEnvConfig(process.cwd());

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  throw new Error(
    "COGNODB_URI, COGNODB_USERNAME and COGNODB_PASSWORD must be configured"
  );
}

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(username, password)
);

const developers = [
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

const skills = [
  { id: "skill-001", name: "JavaScript", category: "Programming" },
  { id: "skill-002", name: "TypeScript", category: "Programming" },
  { id: "skill-003", name: "React", category: "Frontend" },
  { id: "skill-004", name: "Next.js", category: "Frontend" },
  { id: "skill-005", name: "Node.js", category: "Backend" },
  { id: "skill-006", name: "Express", category: "Backend" },
  { id: "skill-007", name: "Python", category: "Programming" },
  { id: "skill-008", name: "C++", category: "Programming" },
  { id: "skill-009", name: "SQL", category: "Database" },
  { id: "skill-010", name: "MongoDB", category: "Database" },
  { id: "skill-011", name: "Docker", category: "DevOps" },
  { id: "skill-012", name: "Kubernetes", category: "DevOps" },
  { id: "skill-013", name: "Git", category: "Tools" },
  { id: "skill-014", name: "REST APIs", category: "Backend" },
  { id: "skill-015", name: "GraphQL", category: "Backend" },
];

const technologies = [
  { id: "tech-001", name: "Next.js", category: "Framework" },
  { id: "tech-002", name: "React", category: "Framework" },
  { id: "tech-003", name: "Node.js", category: "Runtime" },
  { id: "tech-004", name: "Express", category: "Framework" },
  { id: "tech-005", name: "MongoDB", category: "Database" },
  { id: "tech-006", name: "PostgreSQL", category: "Database" },
  { id: "tech-007", name: "Docker", category: "DevOps" },
  { id: "tech-008", name: "Kubernetes", category: "DevOps" },
  { id: "tech-009", name: "Redis", category: "Database" },
  { id: "tech-010", name: "GraphQL", category: "API" },
];

const companies = [
  {
    id: "company-001",
    name: "TechNova",
    industry: "Software",
  },
  {
    id: "company-002",
    name: "CloudWorks",
    industry: "Cloud Computing",
  },
  {
    id: "company-003",
    name: "DataSphere",
    industry: "Data & AI",
  },
  {
    id: "company-004",
    name: "FinStack",
    industry: "FinTech",
  },
];

const projects = [
  {
    id: "project-001",
    name: "E-Commerce Platform",
    description: "Scalable online shopping platform",
  },
  {
    id: "project-002",
    name: "AI Assistant",
    description: "AI-powered productivity assistant",
  },
  {
    id: "project-003",
    name: "Payment Gateway",
    description: "Secure payment processing platform",
  },
  {
    id: "project-004",
    name: "Developer Dashboard",
    description: "Analytics dashboard for engineering teams",
  },
  {
    id: "project-005",
    name: "Real-Time Chat",
    description: "Real-time communication platform",
  },
  {
    id: "project-006",
    name: "Fraud Detection System",
    description: "Transaction fraud detection platform",
  },
];

const jobs = [
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

const developerSkills = [
  ["dev-001", "skill-001"],
  ["dev-001", "skill-003"],
  ["dev-001", "skill-004"],
  ["dev-001", "skill-008"],
  ["dev-001", "skill-013"],

  ["dev-002", "skill-001"],
  ["dev-002", "skill-002"],
  ["dev-002", "skill-005"],
  ["dev-002", "skill-006"],
  ["dev-002", "skill-009"],
  ["dev-002", "skill-014"],

  ["dev-003", "skill-001"],
  ["dev-003", "skill-002"],
  ["dev-003", "skill-003"],
  ["dev-003", "skill-004"],
  ["dev-003", "skill-013"],

  ["dev-004", "skill-007"],
  ["dev-004", "skill-009"],
  ["dev-004", "skill-011"],
  ["dev-004", "skill-012"],

  ["dev-005", "skill-008"],
  ["dev-005", "skill-001"],
  ["dev-005", "skill-009"],
  ["dev-005", "skill-013"],

  ["dev-006", "skill-002"],
  ["dev-006", "skill-005"],
  ["dev-006", "skill-009"],
  ["dev-006", "skill-011"],
  ["dev-006", "skill-014"],
];

const developerProjects = [
  ["dev-001", "project-001"],
  ["dev-001", "project-002"],

  ["dev-002", "project-003"],
  ["dev-002", "project-005"],

  ["dev-003", "project-004"],
  ["dev-003", "project-002"],

  ["dev-004", "project-006"],
  ["dev-004", "project-003"],

  ["dev-005", "project-001"],
  ["dev-005", "project-004"],

  ["dev-006", "project-005"],
  ["dev-006", "project-006"],
];

const developerCompanies = [
  ["dev-001", "company-001"],
  ["dev-002", "company-002"],
  ["dev-003", "company-001"],
  ["dev-004", "company-003"],
  ["dev-005", "company-004"],
  ["dev-006", "company-002"],
];

const projectTechnologies = [
  ["project-001", "tech-001"],
  ["project-001", "tech-002"],
  ["project-001", "tech-003"],
  ["project-001", "tech-005"],

  ["project-002", "tech-001"],
  ["project-002", "tech-002"],
  ["project-002", "tech-003"],

  ["project-003", "tech-003"],
  ["project-003", "tech-004"],
  ["project-003", "tech-006"],
  ["project-003", "tech-009"],

  ["project-004", "tech-001"],
  ["project-004", "tech-002"],
  ["project-004", "tech-006"],

  ["project-005", "tech-003"],
  ["project-005", "tech-004"],
  ["project-005", "tech-009"],

  ["project-006", "tech-003"],
  ["project-006", "tech-006"],
  ["project-006", "tech-007"],
];

const skillRelationships = [
  ["skill-001", "skill-002"],
  ["skill-001", "skill-003"],
  ["skill-001", "skill-005"],
  ["skill-002", "skill-004"],
  ["skill-002", "skill-005"],
  ["skill-003", "skill-004"],
  ["skill-005", "skill-006"],
  ["skill-005", "skill-014"],
  ["skill-009", "skill-014"],
  ["skill-011", "skill-012"],
  ["skill-014", "skill-015"],
];

const jobRequirements = [
  ["job-001", "skill-005"],
  ["job-001", "skill-006"],
  ["job-001", "skill-009"],
  ["job-001", "skill-014"],

  ["job-002", "skill-001"],
  ["job-002", "skill-002"],
  ["job-002", "skill-003"],
  ["job-002", "skill-004"],

  ["job-003", "skill-002"],
  ["job-003", "skill-003"],
  ["job-003", "skill-005"],
  ["job-003", "skill-009"],

  ["job-004", "skill-011"],
  ["job-004", "skill-012"],
  ["job-004", "skill-009"],

  ["job-005", "skill-001"],
  ["job-005", "skill-013"],
];

const companyJobs = [
  ["company-001", "job-001"],
  ["company-001", "job-002"],
  ["company-002", "job-003"],
  ["company-002", "job-004"],
  ["company-003", "job-001"],
  ["company-003", "job-005"],
  ["company-004", "job-001"],
  ["company-004", "job-003"],
];

async function seed() {
  const session = driver.session();

  try {
    console.log("🌱 Starting PathFinder database seed...");

    await session.executeWrite(async (tx) => {
      for (const developer of developers) {
        await tx.run(
          `
          MERGE (d:Developer {id: $id})
          SET
            d.name = $name,
            d.experience = $experience,
            d.location = $location
          `,
          developer
        );
      }

      for (const skill of skills) {
        await tx.run(
          `
          MERGE (s:Skill {id: $id})
          SET
            s.name = $name,
            s.category = $category
          `,
          skill
        );
      }

      for (const technology of technologies) {
        await tx.run(
          `
          MERGE (t:Technology {id: $id})
          SET
            t.name = $name,
            t.category = $category
          `,
          technology
        );
      }

      for (const company of companies) {
        await tx.run(
          `
          MERGE (c:Company {id: $id})
          SET
            c.name = $name,
            c.industry = $industry
          `,
          company
        );
      }

      for (const project of projects) {
        await tx.run(
          `
          MERGE (p:Project {id: $id})
          SET
            p.name = $name,
            p.description = $description
          `,
          project
        );
      }

      for (const job of jobs) {
        await tx.run(
          `
          MERGE (j:Job {id: $id})
          SET
            j.title = $title,
            j.level = $level
          `,
          job
        );
      }

      for (const [developerId, skillId] of developerSkills) {
        await tx.run(
          `
          MATCH (d:Developer {id: $developerId})
          MATCH (s:Skill {id: $skillId})
          MERGE (d)-[:HAS_SKILL]->(s)
          `,
          { developerId, skillId }
        );
      }

      for (const [developerId, projectId] of developerProjects) {
        await tx.run(
          `
          MATCH (d:Developer {id: $developerId})
          MATCH (p:Project {id: $projectId})
          MERGE (d)-[:WORKED_ON]->(p)
          `,
          { developerId, projectId }
        );
      }

      for (const [developerId, companyId] of developerCompanies) {
        await tx.run(
          `
          MATCH (d:Developer {id: $developerId})
          MATCH (c:Company {id: $companyId})
          MERGE (d)-[:WORKED_AT]->(c)
          `,
          { developerId, companyId }
        );
      }

      for (const [projectId, technologyId] of projectTechnologies) {
        await tx.run(
          `
          MATCH (p:Project {id: $projectId})
          MATCH (t:Technology {id: $technologyId})
          MERGE (p)-[:USES]->(t)
          `,
          { projectId, technologyId }
        );
      }

      for (const [skillA, skillB] of skillRelationships) {
        await tx.run(
          `
          MATCH (a:Skill {id: $skillA})
          MATCH (b:Skill {id: $skillB})
          MERGE (a)-[:RELATED_TO]->(b)
          `,
          { skillA, skillB }
        );
      }

      for (const [jobId, skillId] of jobRequirements) {
        await tx.run(
          `
          MATCH (j:Job {id: $jobId})
          MATCH (s:Skill {id: $skillId})
          MERGE (j)-[:REQUIRES]->(s)
          `,
          { jobId, skillId }
        );
      }

      for (const [companyId, jobId] of companyJobs) {
        await tx.run(
          `
          MATCH (c:Company {id: $companyId})
          MATCH (j:Job {id: $jobId})
          MERGE (c)-[:POSTS]->(j)
          `,
          { companyId, jobId }
        );
      }
    });

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();