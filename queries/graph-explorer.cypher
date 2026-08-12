/*
PathFinder - Career Graph Explorer

Purpose:
Return the connected career graph for a developer.

Traversal:

Developer
   ├── HAS_SKILL → Skill
   │                 │
   │                 └── RELATED_TO → Skill
   │
   └── WORKED_ON → Project
                       │
                       └── USES → Technology

Parameter:
$developerId
*/


MATCH (d:Developer {id: $developerId})

OPTIONAL MATCH
    (d)-[:HAS_SKILL]->(skill:Skill)

OPTIONAL MATCH
    (d)-[:WORKED_ON]->(project:Project)

OPTIONAL MATCH
    (project)-[:USES]->(technology:Technology)


RETURN
    d,
    collect(DISTINCT skill) AS skills,
    collect(DISTINCT project) AS projects,
    collect(DISTINCT technology) AS technologies;