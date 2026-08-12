# PathFinder Graph Data Model

## Overview

PathFinder models developer career information as a connected graph.

The graph represents developers, their skills, projects, technologies, and target jobs. Relationships between these entities are represented as typed edges.

---

## Graph Model

```text
                         ┌──────────────┐
                         │     Job      │
                         └──────┬───────┘
                                │
                             REQUIRES
                                │
                                ▼
                         ┌──────────────┐
                         │    Skill     │
                         └──────▲───────┘
                                │
                            HAS_SKILL
                                │
                                │
┌──────────────┐          ┌─────┴────────┐
│  Developer   │─────────▶│    Skill     │
└──────┬───────┘ HAS_SKILL└──────────────┘
       │
       │ WORKED_ON
       ▼
┌──────────────┐
│    Project   │
└──────┬───────┘
       │
       │ USES
       ▼
┌──────────────┐
│ Technology   │
└──────────────┘


Skill ────────────── RELATED_TO ────────────── Skill