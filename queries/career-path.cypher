/*
PathFinder - Career Gap Analysis

Purpose:
Find skills required by a target job that a developer
does not currently have.

Parameters:
$developerId
$jobId
*/

MATCH (d:Developer {id: $developerId})
MATCH (j:Job {id: $jobId})

MATCH (j)-[:REQUIRES]->(required:Skill)

OPTIONAL MATCH (d)-[:HAS_SKILL]->(current:Skill)

WITH
    required,
    collect(current.id) AS currentSkillIds

WHERE NOT required.id IN currentSkillIds

RETURN
    required.id AS skillId,
    required.name AS skillName,
    required.category AS category

ORDER BY skillName;