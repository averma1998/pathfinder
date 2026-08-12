/*
PathFinder - Similar Developers

Purpose:
Find developers who share skills with the selected developer.

This is a graph traversal:

Developer
    ↓ HAS_SKILL
Skill
    ↑ HAS_SKILL
Developer

Parameters:
$developerId
*/

MATCH (target:Developer {id: $developerId})
      -[:HAS_SKILL]->
      (shared:Skill)
      <-[:HAS_SKILL]-
      (other:Developer)

WHERE other.id <> $developerId

WITH
    other,
    collect(shared.name) AS sharedSkills,
    count(shared) AS sharedSkillCount

RETURN
    other.id AS developerId,
    other.name AS developerName,
    other.location AS location,
    other.experience AS experience,
    sharedSkills,
    sharedSkillCount

ORDER BY sharedSkillCount DESC
LIMIT 10;