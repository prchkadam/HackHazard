# EDD_001 — Foundation
## PART D — Engineering Rules, AI Constraints & Delivery Standards

---

# 71. Engineering Principles

The codebase must be maintainable.

The goal is not simply to make the application work.

The goal is to make future features easy to implement.

Every implementation should favor readability over cleverness.

If two implementations achieve the same result,
choose the simpler one.

---

# 72. Definition of Done

A feature is considered complete only if all of the following are true.

✓ UI matches the specification

✓ TypeScript has zero errors

✓ ESLint reports no critical issues

✓ Works on Android

✓ Handles loading state

✓ Handles empty state

✓ Handles error state

✓ Responsive on different screen sizes

✓ Uses reusable components

✓ Uses centralized theme

✓ API integrated

✓ No placeholder code remains

---

# 73. Git Workflow

Main Branch

main

Development Branch

develop

Feature Branch Format

feature/auth

feature/home

feature/mentor

feature/focus

feature/profile

Commit Format

feat(auth): implement Google authentication

feat(home): build dashboard

feat(mentor): add mentor selection

fix(api): resolve authentication issue

refactor(ui): reusable card component

Never commit unfinished experimental code to main.

---

# 74. Code Review Rules

Before merging any feature verify:

No duplicated components.

No duplicated API requests.

No unused imports.

No commented production code.

No console.log statements.

No hardcoded values.

No TODO left behind.

Every component has a single responsibility.

---

# 75. Performance Requirements

Cold Start

Target

< 3 seconds

Home Screen

< 1 second after authentication

Navigation

Instant

Images

Lazy loaded

Companion assets

Preloaded

API Calls

Only when necessary.

Avoid duplicate requests.

---

# 76. Accessibility

Minimum touch target

48dp

Buttons require accessibility labels.

Support Dynamic Font Scaling.

Support screen readers where possible.

Never rely on color alone to communicate meaning.

---

# 77. Offline Behaviour

Guest Mode must continue working offline.

If backend is unavailable:

Display friendly message.

Allow retry.

Never crash.

Show cached information whenever available.

---

# 78. Error Handling Standards

Every screen requires four states.

Loading

Empty

Error

Success

Never display a blank white screen.

Every error message should be written in human language.

Example

Instead of

Database Error

Display

"We're having trouble connecting right now.

Please try again."

---

# 79. Logging Standards

Development

Detailed logs

Production

Minimal logs

Never log

JWT

Passwords

Secrets

Environment variables

Database credentials

---

# 80. Security Rules

Always validate input.

Never trust frontend data.

Use parameterized Neo4j queries.

Never expose internal errors.

Use JWT authentication.

Store sensitive tokens only inside Secure Store.

Never use AsyncStorage for authentication.

---

# 81. UI Personality

Every screen should feel

Calm

Hopeful

Supportive

Focused

Modern

Never feel

Aggressive

Competitive

Corporate

Childish

Overwhelming

The interface should encourage users instead of pressuring them.

---

# 82. Animation Rules

Animations communicate emotion.

Never distract the user.

Maximum duration

250ms

Allowed

Fade

Scale

Opacity

Translate

Avoid

Bounce

Spin

Excessive motion

Companion animations should always feel alive but subtle.

---

# 83. Future Scalability

The architecture must allow future additions without restructuring.

Potential future modules

AI Memory

Achievements

Notifications

Calendar

Community

Analytics

Premium

Do not implement these during MVP.

---

# 84. Deployment Targets

Frontend

Expo

Android APK

Backend

Render

Database

Neo4j AuraDB

AI

Sarvam

Environment Variables

GitHub Secrets

Render Environment Variables

Never hardcode credentials.

---

# 85. Build Log

Every completed feature should update

docs/BUILD_LOG.md

Example

## Build Package 001

Completed

Authentication

Mentor Selection

Companion Birth

Commit

abc1234

Developer

Name

Date

---

# 86. Testing Checklist

Authentication

Google Login

Guest Login

Token Persistence

Protected Routes

Mentor

Selection

Change Mentor

Persistence

Companion

Birth

Growth Stage

Mood Update

Home

Greeting

Continue Journey

Quick Actions

Focus

Start

Pause

Finish

Reflection

Journey

Timeline

Ordering

Profile

Update Information

Logout

Backend

Neo4j Connection

JWT

API Responses

Validation

---

# 87. AI Behaviour Constraints

Claude Code must behave as a senior software engineer.

Claude must NOT

Create a new Expo project.

Replace Expo Router.

Upgrade package versions.

Replace Context API.

Introduce Redux.

Introduce Zustand.

Replace React Query.

Change folder structure.

Generate duplicate components.

Ignore the Engineering Design Document.

Generate placeholder architecture.

Invent features outside MVP.

Claude SHOULD

Respect existing architecture.

Create modular code.

Prefer composition over duplication.

Generate reusable components.

Write strict TypeScript.

Follow Expo Router conventions.

Follow React Query conventions.

Generate production-ready code.

---

# 88. Execution Protocol

Implement features in the following order.

1.

Authentication

2.

Mentor Selection

3.

Companion Birth

4.

Home

5.

Learn

6.

Focus Session

7.

Journey

8.

Profile

Never skip ahead.

Each feature should compile successfully before moving to the next.

---

# 89. Hackathon Priorities

Priority 1

Stable Demo

Priority 2

Good UX

Priority 3

Production Architecture

Priority 4

Animations

Priority 5

Extra Features

Never sacrifice stability for feature count.

---

# 90. Final Product Statement

Avati is not a productivity tracker.

It is an identity-first growth companion.

The application exists to help students become more consistent by making progress visible through reflection, mentorship and an evolving companion.

Every implementation decision should reinforce this philosophy.

If a feature does not help users learn, reflect, grow or return, it should not be included in the MVP.

---

# Claude Code Final Instructions

You are continuing an existing production-oriented Expo + Express + Neo4j project.

Do not recreate the project.

Do not modify package versions.

Do not replace the architecture.

Do not change folder hierarchy.

Follow every Engineering Design Document provided.

Implement only the requested feature while respecting all previous architecture.

Write clean, modular, reusable and production-quality TypeScript.

Assume this codebase will continue beyond the hackathon.

Optimize for maintainability, clarity and correctness over unnecessary complexity.