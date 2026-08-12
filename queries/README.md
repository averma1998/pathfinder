# PathFinder Cypher Queries

This directory contains the main Cypher queries used by PathFinder.

## Query Overview

| Query | Purpose | Graph traversal |
|---|---|---|
| career-path.cypher | Find missing skills for a target job | Developer → Skill ← Job |
| similar-developers.cypher | Find developers with overlapping skills | Developer → Skill ← Developer |
| graph-explorer.cypher | Build the developer career graph | Developer → Project → Technology |
| recommendations.cypher | Recommend connected skills | Developer → Skill → Skill ← Job |

## Parameterisation

All application queries use parameters rather than string-concatenated Cypher.

Example:

```cypher
MATCH (d:Developer {id: $developerId})