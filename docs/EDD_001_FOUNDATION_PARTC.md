# EDD_001 — Foundation
## PART C — Backend Architecture & Database

---

# 44. Backend Philosophy

The backend exists to provide a stable source of truth.

Business logic belongs inside the backend.

The frontend should never calculate:

- Companion Growth
- Companion Stage
- Mentor Assignment
- JWT Validation

The frontend only displays data.

---

# 45. Backend Stack

Runtime

Node.js

Language

TypeScript

Framework

Express

Database

Neo4j AuraDB

Authentication

JWT

Validation

Zod

Environment

dotenv

Logging

Morgan

Security

Helmet

CORS

---

# 46. Backend Folder Structure

server/

src/

config/

database/

controllers/

middleware/

routes/

services/

utils/

prompts/

types/

app.ts

index.ts

Every route must have

Controller

↓

Service

↓

Database

Controllers should NEVER contain business logic.

---

# 47. Neo4j Architecture

Neo4j is the primary database.

No SQL database should exist.

Everything revolves around relationships.

Every query begins from

(User)

This is a project rule.

---

# 48. Node Types

Exactly six node types.

(User)

(Mentor)

(Companion)

(Mission)

(FocusSession)

(Journal)

No additional nodes during MVP.

---

# 49. User Node

Properties

id

name

email

photoUrl

isGuest

college

semester

createdAt

lastLogin

Relationships

(User)-[:HAS_MENTOR]->(Mentor)

(User)-[:OWNS]->(Companion)

(User)-[:HAS_MISSION]->(Mission)

(User)-[:COMPLETED]->(FocusSession)

(User)-[:WROTE]->(Journal)

---

# 50. Mentor Node

Pre-seeded.

Never created by users.

Properties

id

name

personality

systemPrompt

welcomeMessage

avatar

Default Mentors

Ved

Kai

Ira

---

# 51. Companion Node

Properties

id

stage

growthScore

mood

createdAt

lastUpdated

Growth Score

Internal only.

Never sent to frontend.

Frontend receives

stage

mood

only.

---

# 52. Mission Node

Properties

id

title

description

deadline

status

createdAt

completedAt

Relationship

(Mission)-[:CONTAINS]->(FocusSession)

---

# 53. Focus Session

Properties

id

title

subject

plannedDuration

actualDuration

startedAt

endedAt

status

difficulty

reflectionCompleted

Relationship

(User)-[:COMPLETED]->(FocusSession)

---

# 54. Journal

Properties

id

summary

reflection

mood

generatedByAI

createdAt

Relationship

(User)-[:WROTE]->(Journal)

---

# 55. Neo4j Relationships

(User)

↓

HAS_MENTOR

↓

(Mentor)

(User)

↓

OWNS

↓

(Companion)

(User)

↓

HAS_MISSION

↓

(Mission)

(Mission)

↓

CONTAINS

↓

(FocusSession)

(User)

↓

COMPLETED

↓

(FocusSession)

(User)

↓

WROTE

↓

(Journal)

---

# 56. Database Initialization

On server startup

Connect Neo4j

↓

Verify Connection

↓

Seed Mentors

↓

Server Ready

Mentors should never be duplicated.

Seed only if missing.

---

# 57. Seed Data

Create

Ved

Kai

Ira

Only once.

Never reseed.

---

# 58. Authentication

Supported

Google Login

Guest Login

Google Flow

Receive Google Token

↓

Verify

↓

Find User

↓

Create User if missing

↓

Generate JWT

↓

Return User

Guest Flow

Generate UUID

↓

Create Guest User

↓

JWT

↓

Return Guest User

---

# 59. JWT

JWT Payload

userId

isGuest

issuedAt

expiry

Never store sensitive information.

JWT Expiry

7 Days

---

# 60. Middleware

Required

Authentication

Error Handler

Request Logger

CORS

Helmet

JSON Parser

Protected routes require JWT.

---

# 61. REST API Structure

Authentication

POST /auth/google

POST /auth/guest

GET /auth/me

Mentor

GET /mentors

POST /mentor/select

User

GET /user/profile

PATCH /user/profile

Focus

POST /focus/start

POST /focus/end

GET /focus/history

Mission

GET /missions

POST /missions

PATCH /missions/:id

Journal

POST /journal

GET /journal

Journey

GET /journey

---

# 62. API Response Standard

Success

{
success:true,
data:{}
}

Failure

{
success:false,
message:"",
errorCode:""
}

Always follow this structure.

---

# 63. Error Codes

AUTH_REQUIRED

TOKEN_INVALID

USER_NOT_FOUND

MENTOR_NOT_FOUND

MISSION_NOT_FOUND

SERVER_ERROR

DATABASE_ERROR

Never return raw errors.

---

# 64. Companion Growth Logic

Growth is deterministic.

Completed Focus Session

+ Reflection

↓

Increase Growth Score

Growth Score

↓

Stage Calculation

↓

Mood Update

↓

Return Stage

Growth score is never returned.

---

# 65. Stage Rules

Stage 1

Seed

Stage 2

Growing

Stage 3

Bloomed

Only backend calculates stage.

---

# 66. Database Driver

Create a singleton Neo4j driver.

One connection.

Shared across services.

Never reconnect per request.

---

# 67. Environment Variables

PORT

JWT_SECRET

NEO4J_URI

NEO4J_USERNAME

NEO4J_PASSWORD

GOOGLE_CLIENT_ID

Never hardcode credentials.

---

# 68. Logging

Development

Morgan

Production

Structured Logs

Never log

Passwords

JWT

Secrets

---

# 69. Validation

Every request validated using Zod.

Validation occurs before controller execution.

Invalid requests return HTTP 400.

---

# 70. Backend Acceptance Criteria

✓ Neo4j connects successfully

✓ Mentors seeded

✓ JWT generated

✓ Guest login works

✓ Google login works

✓ User creation works

✓ Companion creation works

✓ Mentor assignment works

✓ Profile update works

✓ Focus session stored

✓ Journey query returns correctly

✓ No duplicated mentors

✓ No duplicated users

✓ No TypeScript errors

---

# Claude Code Instructions

Continue the existing Express project.

Do not recreate the backend.

Use the existing folder structure.

Use service-based architecture.

Never place business logic inside controllers.

Use async/await.

Create reusable database utilities.

Write optimized Cypher queries.

Prevent duplicate node creation.

Use MERGE whenever appropriate.

Never hardcode Cypher values.

Use parameterized queries.

Return consistent API responses.

Keep the backend production-ready and easy to extend.