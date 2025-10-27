# CertAI Prep — Added Features

This iteration adds several study improvements without breaking existing flows.

What’s new
- Study set tags and search: add comma‑separated tags when creating a set and filter by title/tag on the list.
- Quiz modes: Practice, Exam, and Review (review uses your last attempt’s incorrect questions).
- Flashcards SRS: generated cards are scheduled for spaced repetition; review due cards per set.
- Dashboard: shows flashcards due today alongside existing metrics.

Key files
- src/lib/types.ts: optional fields for tags, quiz mode, and SRS data.
- src/lib/store.ts: tags update, question bank placeholder, SRS state and review scheduling, safer migrations.
- src/components/study-sets-client.tsx: tags input + search box and tag chips per set.
- src/components/quiz-client.tsx: setup form includes mode; review mode pulls incorrect questions from history.
- src/components/flashcards-client.tsx: SRS review section with Reveal/Again/Good/Easy controls.
- src/components/dashboard-client.tsx: adds “Due Today” flashcards tile.

Notes
- Data stays in localStorage via Zustand persist. SRS due time is computed locally.
- If you had existing data, a light migration ensures new containers exist.
- You can export flashcards to CSV as before.

Next ideas
- Attempt history dialog and per‑tag insights.
- Rich text for study sets and PDF/MD imports.
