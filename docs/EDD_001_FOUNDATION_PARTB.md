# EDD_001 — Foundation
## PART B — Frontend Architecture & Implementation

---

# 21. Frontend Philosophy

The frontend should feel effortless.

The application must never overwhelm the user.

Every screen should answer one question:

"What is the next best thing the user should do?"

Avoid information overload.

Avoid showing multiple equally important actions.

Guide the user naturally.

---

# 22. Frontend Architecture

The project follows Feature-Based Architecture.

app/

Only routing.

No business logic.

No API calls.

No state management.

src/

Contains all application logic.

Every feature owns its components, hooks and services.

Example

src/

features/

    auth/

    mentor/

    home/

    learn/

    focus/

    journey/

    profile/

Reusable UI belongs inside

src/components

Never duplicate UI.

---

# 23. Routing Structure

app/

_layout.tsx

index.tsx

(auth)/

login.tsx

(onboarding)/

mentor.tsx

birth.tsx

(tabs)/

_layout.tsx

home.tsx

learn.tsx

journey.tsx

profile.tsx

focus/

index.tsx

---

# 24. Navigation Rules

Splash

↓

Authentication Check

↓

Guest?

↓

Home

↓

OR

Google Login

↓

Mentor Selection

↓

Companion Birth

↓

Home

The user should never manually navigate backwards through onboarding.

Onboarding disappears forever after completion.

---

# 25. Splash Screen

Purpose

Determine authentication state.

Show branding.

Nothing else.

Layout

Centered Companion Logo

↓

Quote

↓

Loading Indicator

Quote

"Every expert was once a beginner."

↓

AVATI

Background

Solid

No gradients.

Animation

Fade In

Duration

200ms

After authentication check

Navigate automatically.

---

# 26. Login Screen

Layout

Logo

↓

Tagline

↓

Google Login Button

↓

Continue as Guest

↓

Privacy Text

Tagline

Grow with intention.

Learn with confidence.

Continue Button

Full Width

Rounded

Primary Color

Guest Button

Secondary

Outlined

No animations.

Loading

Replace button text with spinner.

---

# 27. Authentication Flow

Google Login

↓

Receive Google Token

↓

Backend Verification

↓

Receive JWT

↓

Store inside Secure Store

↓

Navigate to Mentor Selection

Guest Login

↓

Generate Local Guest ID

↓

Store Securely

↓

Skip Backend

↓

Navigate to Mentor Selection

Never store authentication inside AsyncStorage.

Use Expo Secure Store only.

---

# 28. Mentor Selection

Three Cards

Ved

Kai

Ira

Each card contains

Illustration

↓

Name

↓

Short Description

↓

Example Conversation

↓

Choose Button

Example

Ved

"Explain recursion."

↓

"Let's build intuition first..."

Kai

"I have an exam tomorrow."

↓

"Let's make a fast recovery plan."

Ira

"I feel stuck."

↓

"Growth isn't about speed."

Only one mentor may be selected.

---

# 29. Companion Birth Screen

Purpose

Create emotional attachment.

Duration

Approximately 5 seconds.

Sequence

Dark Background

↓

Small glowing seed appears

↓

Soft breathing animation

↓

Text

"Every journey begins with a single step."

↓

Seed grows slightly

↓

Fade

↓

Navigate Home

Skip Button

Hidden.

This moment should never be skipped.

---

# 30. Bottom Navigation

Exactly four tabs.

Home

Learn

Journey

Profile

Focus Session is NOT a tab.

It opens modally.

Icons

Lucide React Native

Labels always visible.

---

# 31. Home Screen

Layout Order

Companion

↓

Mentor Greeting

↓

Continue Journey

↓

Today's Mission

↓

Quick Actions

↓

Recent Activity

Quick Actions

Start Focus

Learn Something

Journal

Empty State

"Welcome.

Let's begin.

What would you like to accomplish today?"

Buttons

Create Mission

Learn Something

Start Focus Session

---

# 32. Learn Screen

Purpose

Learning.

Not chatting.

Top Section

Greeting

↓

Suggested Topics

↓

Recent Topics

↓

Mentor Conversation

↓

Suggested Questions

Conversation UI

Message Cards

Rounded

Readable

No ChatGPT appearance.

Suggestions

Appear as pills.

Example

Explain Binary Trees

↓

Practice SQL

↓

Revise OS

Input

Sticky Bottom

Send Button

Always visible.

---

# 33. Focus Session

Screen Layout

Topic

↓

Duration

↓

Start Button

Running Session

Large Timer

↓

Current Topic

↓

Pause

↓

Finish

Session Complete

Companion

↓

Reflection

↓

Difficulty

↓

Submit

Minimal UI.

Avoid distractions.

---

# 34. Journey Screen

Purpose

Visualize growth.

NOT statistics.

Timeline

Newest First.

Cards

Focus Session

Reflection

Mission Completed

Companion Growth

Mentor Letter

No charts.

No graphs.

No percentages.

---

# 35. Profile Screen

Sections

Avatar

↓

Name

↓

Mentor

↓

College

↓

Semester

↓

Settings

↓

Logout

User may change mentor here.

Profile Completion Card

Displayed only when fields are missing.

---

# 36. Shared Components

Create reusable components.

AppButton

AppCard

AppInput

AppAvatar

AppScreen

SectionHeader

LoadingSpinner

EmptyState

ErrorState

BottomSheet

Modal

Chip

MentorCard

CompanionCard

Never duplicate these.

---

# 37. State Management

Context API

Authentication

Theme

Guest Mode

React Query

Server State

Neo4j Data

Mentor

User

Journey

Never duplicate server state inside Context.

---

# 38. API Layer

All requests must pass through

services/api/client.ts

Never use fetch inside screens.

Example

services/api

auth.ts

mentor.ts

focus.ts

journey.ts

user.ts

Future AI

chat.ts

---

# 39. Theme

Single source.

constants/theme.ts

Contains

Colors

Spacing

Radius

Typography

Shadow

Animation Duration

No hardcoded colors.

---

# 40. Error Handling

Every screen requires

Loading State

Error State

Empty State

Offline State

Authentication Expired

Never display blank screens.

---

# 41. Accessibility

Touch targets

Minimum 48dp.

Support Dynamic Font Scaling.

Buttons require accessibility labels.

Avoid relying on color alone.

---

# 42. Performance

Lazy load screens.

Memoize reusable components.

Avoid unnecessary re-renders.

Images

Use Expo Image.

Companion assets should preload.

---

# 43. Frontend Acceptance Criteria

✓ Splash checks authentication

✓ Login works

✓ Guest Mode works

✓ Mentor selection persists

✓ Companion birth shown only once

✓ Bottom navigation functional

✓ Home displays correctly

✓ Learn screen ready

✓ Journey screen ready

✓ Profile screen ready

✓ Theme centralized

✓ No duplicate components

✓ No API logic inside screens

✓ No TypeScript errors

✓ Runs on Android Expo

---

# Claude Code Instructions

Continue the existing Expo project.

Never recreate the project.

Never modify package versions.

Do not change folder structure.

Do not replace Expo Router.

Do not install unnecessary dependencies.

Modify only requested files.

Prefer reusable components.

Use strict TypeScript.

Use NativeWind.

Use React Query.

Use Context API.

Write production-quality code.

Do not generate placeholder logic where implementation is already specified.

Every generated screen should feel calm, modern and premium.

The application must feel like Apple Health + Headspace + Notion, not like a gamified study application.