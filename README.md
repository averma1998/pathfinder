# PathFinder

## Developer Career Intelligence using Graph Databases

PathFinder is a graph-based career intelligence application that helps developers understand their current technical profile, identify missing skills for a target role, discover developers with similar skills, and explore connections between their skills, projects, and technologies.

The application is backed by **CognoDB**, a managed graph database, and communicates with it using the official **Neo4j JavaScript driver** over the Bolt protocol.

---

## Live Demo

**Hosted Application:**  
https://pathfinder-nine-sigma.vercel.app

**GitHub Repository:**  
https://github.com/averma1998/pathfinder

---

# Features

- Developer profile analysis
- Target-role skill gap analysis
- Graph-based skill recommendations
- Similar developer discovery
- Interactive career graph visualization
- Developer → Skill relationships
- Developer → Project relationships
- Project → Technology relationships
- Job → Skill relationships
- Skill → Skill relationships
- Multi-hop graph traversal
- Parameterized Cypher queries
- Loading states
- Empty states
- Error handling
- Realistic graph seed data
- Interactive graph node inspection

---

# Why a Graph Database?

PathFinder focuses on questions where relationships between entities are more important than individual records.

For example:

- Which developers have skills similar to me?
- Which skills am I missing for a target job?
- Which projects demonstrate my technical experience?
- Which technologies are connected to my projects?
- Which skills are related to skills I already know?
- Which developers share multiple skills with me?
- Which skills should I learn next for a particular role?

These questions require traversing relationships across multiple entities.

A relational database could represent the same information using tables such as:

```text
Developers
DeveloperSkills
Skills
Projects
ProjectTechnologies
Technologies
Jobs
JobSkills
SkillRelationships

However, relationship-heavy queries would require multiple joins across these tables.

PathFinder represents these connections directly as a graph:

Developer
    |
    | HAS_SKILL
    v
  Skill
    |
    | RELATED_TO
    v
  Skill


Developer
    |
    | WORKED_ON
    v
  Project
    |
    | USES
    v
Technology


Job
    |
    | REQUIRES
    v
  Skill

This makes graph traversal a natural operation.

For example, finding developers with similar skills can be represented as:

Developer A
    |
    | HAS_SKILL
    v
  Skill
    ^
    | HAS_SKILL
    |
Developer B

PathFinder therefore uses a graph database because the core application questions depend on relationships between developers, skills, projects, technologies, and jobs rather than isolated records.

Graph Data Model

PathFinder uses five primary node types:

Developer
Skill
Project
Technology
Job

The primary relationship types are:

Developer  --HAS_SKILL-->   Skill

Developer  --WORKED_ON-->   Project

Project    --USES-->        Technology

Job        --REQUIRES-->    Skill

Skill      --RELATED_TO-->  Skill
Graph Structure
                         +-------------+
                         |     Job     |
                         +------+------+
                                |
                             REQUIRES
                                |
                                v
                         +-------------+
                         |    Skill    |
                         +------+------+
                                ^
                                |
                            HAS_SKILL
                                |
                         +------+------+
                         |  Developer  |
                         +------+------+
                                |
                            WORKED_ON
                                |
                                v
                         +-------------+
                         |   Project   |
                         +------+------+
                                |
                               USES
                                |
                                v
                         +-------------+
                         | Technology  |
                         +-------------+


Skill ---------------- RELATED_TO ----------------> Skill

A detailed description of the graph model is available in:

docs/graph-data-model.md
Node Types
Developer

Represents a developer profile.

Example properties:

id
name
experience
location

Example:

(:Developer {
    id: "dev-001",
    name: "Developer Name",
    experience: 2,
    location: "Bhopal"
})
Skill

Represents a technical skill possessed by a developer or required by a job.

Example properties:

id
name
category
Project

Represents a project associated with a developer.

Example properties:

id
name
description
Technology

Represents a technology used by a project.

Example properties:

id
name
category
Job

Represents a target career role.

Example properties:

id
title
Relationship Types
HAS_SKILL

Connects a developer with a skill.

(Developer)-[:HAS_SKILL]->(Skill)

Example:

Developer → HAS_SKILL → React
WORKED_ON

Connects a developer with a project.

(Developer)-[:WORKED_ON]->(Project)
USES

Connects a project with a technology.

(Project)-[:USES]->(Technology)
REQUIRES

Connects a job with a required skill.

(Job)-[:REQUIRES]->(Skill)
RELATED_TO

Connects related technical skills.

(Skill)-[:RELATED_TO]->(Skill)

This relationship is used by PathFinder to discover potential next skills based on the developer's existing skills.

Multi-Hop Graph Traversal

PathFinder uses multi-hop graph traversal to generate career insights.

For example, the recommendation flow can traverse:

Developer
    |
    | HAS_SKILL
    v
Current Skill
    |
    | RELATED_TO
    v
Recommended Skill
    ^
    |
    | REQUIRES
    |
Target Job

Another example is finding similar developers:

Developer A
    |
    | HAS_SKILL
    v
  Skill
    ^
    | HAS_SKILL
    |
Developer B

These traversals demonstrate why the graph model is useful for the application's core functionality.

Application Architecture
                    +----------------------+
                    |       Browser        |
                    |   Next.js Frontend   |
                    +----------+-----------+
                               |
                               | HTTP
                               v
                    +----------------------+
                    |     Next.js API      |
                    |       Routes         |
                    +----------+-----------+
                               |
                               | Cypher
                               v
                    +----------------------+
                    |   Neo4j JavaScript   |
                    |       Driver        |
                    +----------+-----------+
                               |
                               | Bolt
                               v
                    +----------------------+
                    |       CognoDB        |
                    |    Graph Database    |
                    +----------------------+
Technology Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
React Flow
Backend
Next.js App Router
Next.js API Routes
TypeScript
Neo4j JavaScript Driver
Database
CognoDB
openCypher
Bolt protocol
Development
Node.js
npm
Git
GitHub
Vercel
Application Flow

A typical PathFinder workflow is:

                    PathFinder
                        |
                        v
                Select Developer
                        |
                        v
                 Select Target Job
                        |
                        v
                  Career Analysis
                        |
             +----------+----------+
             |                     |
             v                     v
       Missing Skills       Recommendations
             |                     |
             +----------+----------+
                        |
                        v
                Similar Developers
                        |
                        v
                Interactive Graph
Main Features
1. Developer Profile

The application displays a developer's:

Name
Experience
Location
Current technical skills

The skills are retrieved from the graph database.

2. Career Gap Analysis

PathFinder compares:

Developer's current skills
           VS
Target job's required skills

The difference produces the developer's missing skills.

Conceptually:

Developer
    |
    +---- Current Skills


Target Job
    |
    +---- Required Skills

Required Skills - Current Skills
              |
              v
        Missing Skills
3. Skill Recommendations

PathFinder identifies skills that can be useful next steps based on:

Existing developer skills
Related skills
Target job requirements

The graph traversal is:

Developer
    |
    v
Current Skill
    |
    | RELATED_TO
    v
Recommended Skill
    ^
    |
    | REQUIRES
    |
Target Job
4. Similar Developers

PathFinder finds developers who share skills with the selected developer.

For example:

Developer A
    |
    +---- JavaScript
    +---- React
    +---- Next.js


Developer B
    |
    +---- JavaScript
    +---- React
    +---- Next.js

Developers can be ranked based on the number of shared skills.

5. Interactive Career Graph

The graph explorer visualizes the developer's connected career information using React Flow.

The graph can contain:

Developer
    |
    +---- Skills
    |
    +---- Projects
              |
              +---- Technologies

Users can interact with the graph by:

Panning
Zooming
Dragging nodes
Selecting nodes
Inspecting relationships
Viewing connected node information
Cypher Queries

The main Cypher queries are stored in:

queries/

Current query files:

queries/
├── career-path.cypher
├── similar-developers.cypher
├── graph-explorer.cypher
├── recommendations.cypher
└── README.md
Career Path Query

File:

queries/career-path.cypher
Purpose

Find skills required by a target job that are not currently connected to the developer.

Conceptually:

Job
 |
 | REQUIRES
 v
Required Skill


Developer
 |
 | HAS_SKILL
 v
Current Skill

The query compares these sets to identify missing skills.

Similar Developers Query

File:

queries/similar-developers.cypher
Purpose

Find developers who share skills with the selected developer.

Traversal:

Developer
    |
    | HAS_SKILL
    v
  Skill
    ^
    | HAS_SKILL
    |
Developer

Developers are ranked based on their shared skill count.

Graph Explorer Query

File:

queries/graph-explorer.cypher
Purpose

Retrieve the connected career graph for a developer.

The graph includes:

Developer
    |
    +---- Skill
    |
    +---- Project
              |
              +---- Technology

The result is transformed into nodes and relationships for the React Flow graph visualization.

The UI also supports selecting a node to inspect its connected relationships.

Recommendations Query

File:

queries/recommendations.cypher
Purpose

Recommend skills that are connected to a developer's current skills and are relevant to the target job.

Traversal:

Developer
    |
    | HAS_SKILL
    v
Current Skill
    |
    | RELATED_TO
    v
Recommended Skill
    ^
    |
    | REQUIRES
    |
Target Job
Parameterized Cypher

PathFinder uses parameterized Cypher queries through the official Neo4j JavaScript driver.

Example:

const result = await session.run(
  `
  MATCH (d:Developer {id: $developerId})
  RETURN d
  `,
  {
    developerId,
  }
);

User-controlled values are passed as query parameters instead of being concatenated into Cypher strings.

This keeps database interaction safer and makes the queries easier to maintain.

Seed Data

The repository contains a database seed script:

scripts/seed.ts

The seed script creates realistic sample data for:

Developers
Skills
Projects
Technologies
Jobs
Graph relationships

The dataset is intentionally kept small enough to run comfortably on the CognoDB free tier while still demonstrating meaningful graph traversal.

Project Structure
pathfinder/
│
├── app/
│   ├── api/
│   │   ├── career-path/
│   │   ├── developers/
│   │   │   └── [id]/
│   │   ├── graph/
│   │   ├── health/
│   │   ├── jobs/
│   │   └── recommendations/
│   │
│   ├── career-path/
│   │   └── page.tsx
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── global.css
│
├── components/
│   ├── GraphView.tsx
│   ├── RecommendationCard.tsx
│   ├── SimilarDevelopers.tsx
│   ├── DeveloperProfile.tsx
│   ├── DeveloperSelector.tsx
│   ├── DeveloperSearch.tsx
│   ├── JobSelector.tsx
│   ├── CareerAnalysis.tsx
│   ├── CareerPath.tsx
│   ├── ProjectCard.tsx
│   ├── SkillCard.tsx
│   └── LoadingState.tsx
│
├── lib/
│   ├── cognodb.ts
│   └── queries.ts
│
├── scripts/
│   └── seed.ts
│
├── queries/
│   ├── career-path.cypher
│   ├── similar-developers.cypher
│   ├── graph-explorer.cypher
│   ├── recommendations.cypher
│   └── README.md
│
├── docs/
│   ├── graph-data-model.md
│   └── screenshots/
│       ├── homepage.png
│       ├── career_analysis.png
│       ├── recommendations.png
│       ├── similar_developers.png
│       ├── graph_explorer.png
│       └── graph_explorer_nodes.png
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
Getting Started
Prerequisites

Install:

Node.js 20 or later
npm
Git

You also need a CognoDB Cloud account and a CognoDB instance.

CognoDB Setup
1. Create an Account

Create a CognoDB account at:

https://console.cognodb.com/signup

2. Create a Free Instance

From the CognoDB console:

Create a new database instance.
Select the free c0 tier.
Select a region.
Wait for the instance to provision.
3. Save Connection Details

CognoDB provides a connection URI similar to:

bolt+s://<instance-id>.databases.cognodb.cloud

The username is:

cognodb

Save the generated password when the instance is created.

Environment Variables

Create:

.env.local

Add:

COGNODB_URI=bolt+s://your-instance-id.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your-password

For other developers, use .env.example:

COGNODB_URI=
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=
Installation

Clone the repository:

git clone https://github.com/averma1998/pathfinder.git
cd pathfinder

Install dependencies:

npm install
Seed the Database

After configuring .env.local:

npm run seed

The seed script connects to CognoDB and creates the sample graph.

Run the Application

Start the development server:

npm run dev

Open:

http://localhost:3000
Production Build

Before deployment, verify that the project builds successfully:

npm run build

The production build currently completes successfully.

Start the production server with:

npm start
Error Handling

PathFinder handles common application states.

Loading State

Loading indicators are displayed while API and graph data are being retrieved.

Empty State

If graph data is unavailable, the application displays a clear empty-state message.

Error State

If an API request or database request fails, the application displays a user-friendly error message instead of exposing raw database errors.

Security

Database credentials are loaded through environment variables.

No CognoDB credentials are stored directly in the source code.

The .env.local file must never be committed to GitHub.

Cypher queries use parameters rather than string concatenation.

The repository contains .env.example as a safe template for configuring the application.

Screenshots
1. PathFinder Homepage

The homepage allows users to select a developer profile and a target career role.

2. Career Analysis

The career analysis view displays the developer profile and identifies skills that are missing for the selected target role.

3. Graph-Based Recommendations

PathFinder provides graph-based recommendations for skills that can help the developer progress toward the selected target role.

4. Similar Developers

The application identifies developers who share skills with the selected developer and displays the shared skills.

5. Interactive Career Graph

The graph explorer visualizes the developer's relationships with skills, projects, and technologies.

6. Graph Node Inspection

Users can select a graph node to inspect its details, node ID, relationship types, and connected nodes.

Hosted Demo

The application is deployed using Vercel.

Live Demo:

https://pathfinder-nine-sigma.vercel.app

The deployed application connects to CognoDB using environment variables configured in the hosting environment.