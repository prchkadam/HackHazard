# EDD_001 — Foundation
## Project: Avati
Version: 1.0
Status: Frozen
Authors: Team Avati

---

# 1. Project Vision

Avati is an identity-first AI learning and productivity companion.

Unlike traditional productivity applications that reward users with points, streaks or rankings, Avati visualizes personal growth through an evolving companion.

The application's goal is not to maximize productivity.

Its goal is to encourage consistency.

The user should always feel supported instead of judged.

---

# 2. Core Philosophy

Learn

↓

Reflect

↓

Grow

↓

Return

Every feature implemented in this application must reinforce this loop.

If a feature does not contribute to this cycle, it should not be implemented during the MVP.

---

# 3. Product Commandments

These rules are absolute.

1.
Never punish users.

2.
Never compare users with other users.

3.
The Companion represents the user's personal growth.

It is NOT a pet.

4.
The Mentor teaches.

The Companion feels.

5.
Growth must be visual instead of numerical.

6.
Reduce anxiety on every screen.

7.
Every screen should encourage users to come back tomorrow.

8.
Consistency is more important than perfection.

---

# 4. Target Users

Primary Audience

• College Students
• University Students
• Self Learners

Secondary Audience

• Competitive Exam Aspirants
• Lifelong Learners

---

# 5. MVP Scope

Included

✓ Authentication

✓ Guest Mode

✓ Mentor Selection

✓ Companion Birth

✓ Home

✓ Learn

✓ Focus Session

✓ Journey

✓ Profile

✓ Neo4j Integration

✓ Sarvam Integration (Phase 2)

Excluded

✗ Notifications

✗ Multiplayer

✗ Social Feed

✗ Achievements

✗ Leaderboards

✗ Friend System

✗ Premium

---

# 6. Technology Stack

Frontend

Expo SDK 57

React Native

TypeScript

Expo Router

NativeWind

React Query

React Hook Form

Zod

Axios

Expo Secure Store

Backend

Node.js

Express

TypeScript

Neo4j Driver

JWT

Database

Neo4j AuraDB

Version Control

GitHub

---

# 7. Project Structure

mobile/

    app/

    src/

        components/

        constants/

        contexts/

        features/

            auth/

            mentor/

            home/

            learn/

            focus/

            journey/

            profile/

        hooks/

        services/

        store/

        types/

        utils/

server/

    src/

        controllers/

        services/

        routes/

        middleware/

        database/

        prompts/

        utils/

docs/

shared/

---

# 8. Folder Rules

The app/ folder is ONLY for routing.

Business logic must never be placed inside app/.

All reusable components belong inside components/.

Every feature owns its own logic.

Every API request goes through services/api.

Screens should never call fetch() directly.

---

# 9. Design Language

The interface should feel

• Calm
• Clean
• Premium
• Minimal
• Hopeful

Avoid

• Glassmorphism
• Heavy gradients
• Neon effects
• Gaming aesthetics
• Cartoon UI

Inspiration

Apple Health

Linear

Notion

Headspace

---

# 10. Color Philosophy

Universal Theme

Mentors DO NOT change the application's theme.

Mentors only change

• Personality
• Avatar
• Conversation Style

The application should maintain visual consistency.

---

# 11. Typography

Primary Font

Manrope

Fallback

System Font

Weights

Regular

Medium

SemiBold

Bold

Avoid excessive font weights.

---

# 12. Spacing System

Use an 8-point grid.

Allowed values

4

8

12

16

20

24

32

40

48

64

Do not invent random spacing values.

---

# 13. Border Radius

Buttons

18

Inputs

16

Cards

24

Bottom Sheets

32

Dialogs

28

Maintain consistency throughout the application.

---

# 14. Animation Principles

Animations should communicate state.

Not decoration.

Maximum duration

250 milliseconds

Allowed

Fade

Scale

Translate

Opacity

Avoid

Bounce

Elastic

Overshoot

Complex chained animations

---

# 15. Navigation

Launch

↓

Splash

↓

Authentication Check

↓

Login OR Home

↓

Mentor Selection (First Login Only)

↓

Companion Birth

↓

Home

Bottom Navigation

Home

Learn

Journey

Profile

Focus Session is opened from Home.

It is NOT a tab.

---

# 16. Authentication

Supported

Google Login

Guest Mode

Guest mode should allow the application to function without authentication.

Users may later upgrade their Guest account into a Google account.

---

# 17. Mentor System

Three mentors exist.

Ved

Logical

Patient

Concept-focused

Kai

Energetic

Action-oriented

Motivational

Ira

Calm

Reflective

Consistency-focused

Mentors are pre-seeded into Neo4j.

Users may change mentors later.

---

# 18. Companion

The companion has no name.

It represents the user.

Visible States

Seed

Growing

Bloomed

Visible Expressions

Calm

Thinking

Waiting

Proud

Growing

Growth is visual.

Never display numerical growth.

---

# 19. Home Screen Layout

Order is fixed.

Companion

↓

Mentor Greeting

↓

Continue Journey

↓

Today's Mission

↓

Quick Actions

This hierarchy should never change.

---

# 20. Code Standards

TypeScript Strict Mode

No any

No duplicated code

Reusable components only

No inline business logic

No console.log in production

No hardcoded API URLs

Environment variables only

One responsibility per component
