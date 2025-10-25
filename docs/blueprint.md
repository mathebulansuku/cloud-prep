# **App Name**: CertAI Prep

## Core Features:

- AI Quiz Generation (KG-RAG): Generate diverse quiz questions (MCQs, True/False, etc.) grounded in user-uploaded study materials, leveraging Knowledge Graph-enhanced RAG for conceptual coherence.  User specifies question types, count, difficulty.
- Adaptive Feedback and Assessment: Automatically evaluate answers and provide detailed, actionable feedback, explaining each answer option and identifying misconceptions.  Tracks progress and performance.
- AI Flashcard Generation: Transforms study materials into digital flashcards, optimized for active recall and spaced repetition. The LLM acts as a tool to synthesize the input material and prepare concise flashcards.
- Content Ingestion: Accepts study materials in various formats: notes, textbooks (PDFs), URLs, images (OCR). Preprocesses content and creates vector embeddings.
- Conversational Memory: Maintains context across multiple queries using Conversation Buffer Memory for fluid interaction. Implements chat history re-usage.
- User Progress Dashboard: Visually displays progress, completion status, and performance metrics, helping users identify areas for improvement. Includes progress against uploaded source materials, and performance metrics, question by question, over time.
- Export flashcards: Provide options to export generated content in formats compatible with Learning Management Systems (LMS), such as Aiken, CSV, or QTI

## Style Guidelines:

- Primary color: Saturated blue (#4285F4) to evoke trust, clarity, and intelligence, crucial for an educational application.
- Background color: Light blue (#E3F2FD), a very desaturated tint of the primary color, creating a calm and focused environment.
- Accent color: Green (#34A853), analogous to blue, used for positive feedback, correct answers, and progress indicators.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines, and 'Inter' (sans-serif) for body text. This combination offers a modern and readable experience suitable for technical content.
- Code font: 'Source Code Pro' for displaying code snippets within study materials.
- Use clean, modern icons to represent different certification domains, question types, and progress indicators. Consistent style throughout.
- A clear, intuitive layout with well-defined sections for content ingestion, quiz/flashcard generation, and progress tracking. Mobile-responsive design.