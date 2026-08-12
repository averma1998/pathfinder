# PathFinder

## Developer Career Intelligence using Graph Databases

PathFinder is a graph-based career intelligence application that helps developers understand their current technical profile, identify missing skills for a target role, discover developers with similar skills, and explore connections between their skills, projects, and technologies.

The application is backed by **CognoDB**, a managed graph database, and communicates with it using the official **Neo4j JavaScript driver** over the Bolt protocol.

---

## Features

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
- Loading, empty, and error states
- Realistic graph seed data

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
                    |    Next.js API       |
                    |      Routes          |
                    +----------+-----------+
                               |
                               | Cypher
                               v
                    +----------------------+
                    |   Neo4j JavaScript   |
                    |       Driver         |
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
          +-----------+-----------+
          |                       |
          v                       v
    Missing Skills        Recommendations
          |                       |
          +-----------+-----------+
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

The graph is automatically arranged using Dagre.

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

Purpose:

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

Purpose:

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

Developers are ranked based on shared skill count.

Graph Explorer Query

File:

queries/graph-explorer.cypher

Purpose:

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

Recommendations Query

File:

queries/recommendations.cypher

Purpose:

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

This keeps the database interaction safer and makes the queries easier to maintain.

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
│   │   ├── graph/
│   │   └── recommendations/
│   │
│   ├── career-path/
│   │   └── page.tsx
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── GraphView.tsx
│   ├── RecommendationCard.tsx
│   └── SimilarDevelopers.tsx
│
├── lib/
│   └── cognodb.ts
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
│   └── graph-data-model.md
│
├── public/
│
├── .env.example
├── .env.local
├── package.json
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
Security

Never commit .env.local to GitHub.

For other developers, use .env.example:

COGNODB_URI=
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=
Installation

Clone the repository:

git clone <YOUR_GITHUB_REPOSITORY_URL>
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

Then start the production server with:

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

Screenshots

Screenshots will be added before final submission.

Recommended screenshots:

1. Home / Developer Selection
docs/screenshots/home.png
2. Career Analysis
docs/screenshots/career-analysis.png
3. Skill Recommendations
docs/screenshots/recommendations.png
4. Similar Developers
docs/screenshots/similar-developers.png
5. Interactive Graph
docs/screenshots/graph-explorer.png
Hosted Demo

Demo URL: To be added before submission.

The deployed application will connect to CognoDB using environment variables configured on the hosting platform.

Screen Recording

A short screen recording will demonstrate the complete application workflow:

1. Open PathFinder
2. Select a developer
3. Select a target job
4. View developer skills
5. View missing skills
6. View skill recommendations
7. View similar developers
8. Explore the career graph
9. Click and inspect graph nodes
Assignment Requirement Checklist
Wexa Requirement	PathFinder Implementation
Graph database application	CognoDB
Official Neo4j driver	neo4j-driver
Thoughtful graph data model	Developer / Skill / Project / Technology / Job
Labeled nodes	Implemented
Typed relationships	Implemented
Realistic seed data	scripts/seed.ts
Seed script	Included
Multi-hop traversal	Recommendations / Similar Developers
Relationally awkward query	Shared-skill developer traversal
Parameterized Cypher	Implemented
Functional web application	Next.js application
Clean UI	Implemented
Loading states	Implemented
Empty states	Implemented
Error handling	Implemented
Environment variables	.env.local
Cypher query files	queries/
Data model documentation	docs/graph-data-model.md
Screenshots	To be added
Hosted demo	To be deployed
Screen recording	To be recorded
GitHub repository	To be submitted
Future Improvements

Possible future extensions include:

Skill proficiency levels
Career progression timelines
Job recommendation ranking
Learning-resource recommendations
Resume-to-graph extraction
Skill similarity scoring
Personalized learning paths
Larger real-world datasets
Historical career progression
More detailed job matching
Author

Ayush Verma

