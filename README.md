# Alliance Academy Interview Signup

A modern web application for students at Alliance Academy for Innovation (Forsyth County Schools) to sign up for TikTok video interviews.

Built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, **Framer Motion**, **Shadcn-style UI components**, and **Supabase**.

## Features

- 🎨 Dark theme with futuristic neon accents
- 🎞️ Animated logo on load (counterclockwise spin via Framer Motion)
- 📝 Multi-step interactive form (name + grade) with smooth slide transitions
- ✅ Input validation with profanity filtering
- 📋 Review page for confirming answers before submission
- 🎉 Thank-you page with confetti animation
- 🔒 Security: input sanitization, rate limiting, CORS headers, XSS prevention
- 🚫 Duplicate submission prevention (localStorage + DB uniqueness check)
- 📱 Fully responsive, mobile-first design
- ☁️ Supabase PostgreSQL for data storage

## Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set up Supabase table

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE interview_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE interview_signups ENABLE ROW LEVEL SECURITY;

-- Allow inserts from the anon key
CREATE POLICY "Allow public inserts" ON interview_signups
  FOR INSERT WITH CHECK (true);

-- Allow reads only for authenticated/admin users
CREATE POLICY "Allow read for service role" ON interview_signups
  FOR SELECT USING (auth.role() = 'service_role');
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Replace the logo

The Alliance Academy logo is at `public/alliance-logo.png`. Replace it with your own if needed.

## Deployment

This app is configured for [Vercel](https://vercel.com):

1. Push to GitHub
2. Import the repo in Vercel
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── api/submit/route.ts   # API route for form submission
│   ├── review/page.tsx        # Review answers page
│   ├── thanks/page.tsx        # Thank you page with confetti
│   ├── layout.tsx             # Root layout with dark theme
│   ├── page.tsx               # Homepage with animated logo + form
│   └── globals.css            # Global dark theme styles
├── components/
│   ├── ui/                    # Shadcn-style UI components
│   ├── interview-form.tsx     # Multi-step form controller
│   ├── form-step-name.tsx     # Name input step
│   └── form-step-grade.tsx    # Grade selection step
└── lib/
    ├── supabase.ts            # Supabase client
    ├── validation.ts          # Form validation
    ├── profanity.ts           # Profanity filter
    ├── sanitize.ts            # Input sanitization
    ├── rate-limit.ts          # Rate limiting
    ├── types.ts               # TypeScript types
    └── utils.ts               # Utility functions
```
