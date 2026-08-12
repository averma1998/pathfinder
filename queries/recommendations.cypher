/*
PathFinder - Skill Recommendations

Purpose:
Recommend skills that are connected to skills the developer
already knows and that are required by the target job.

Traversal:

Developer
   ↓
HAS_SKILL
   ↓
Current Skill
   ↓
RELATED_TO
   ↓
Recommended Skill
   ↑
REQUIRES
   ↑
Target Job

Parameters:
$developerId
$jobId
*/

MATCH (d:Developer {id: $developerId})
      -[:HAS_SKILL]->
      (current:Skill)

MATCH (current)
      -[:RELATED_TO]->
      (recommended:Skill)

MATCH (job:Job {id: $jobId})
      -[:REQUIRES]->
      (recommended)

WHERE NOT EXISTS {
    MATCH (d)-[:HAS_SKILL]->(recommended)
}

RETURN
    current.id AS currentSkillId,
    current.name AS currentSkill,
    recommended.id AS recommendedSkillId,
    recommended.name AS recommendedSkill,
    recommended.category AS category,
    job.id AS jobId,
    job.title AS targetRole

ORDER BY recommended.name;
