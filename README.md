# Portify AI

AI-powered SaaS portfolio builder that transforms resumes into professional, customizable portfolio websites.

## Overview

Portify AI helps students, developers, and professionals create modern portfolio websites without manually designing or coding them.

Users can build portfolios, manage projects, upload resumes, add media, track analytics, customize themes, and use AI-assisted content generation.

The platform is designed as a scalable SaaS application using Next.js, TypeScript, MongoDB, Prisma, Auth.js, Cloudinary, Gemini AI, and modern DevOps practices.

---

## Core Features

### Authentication
- User registration
- Login and logout
- Email verification
- Password reset
- Protected routes
- Role-based access control

### Portfolio Builder
- Public portfolio pages
- Custom username URLs
- About section
- Education section
- Experience section
- Projects section
- Skills section
- Achievements section
- Coding profiles
- Social links
- Custom sections

### Resume Management
- Resume upload
- Resume replacement
- Resume download
- AI-assisted resume parsing

### Media Management
- Image uploads
- Video uploads
- Cloudinary integration
- Portfolio galleries

### Themes & Customization
- Multiple portfolio themes
- Theme switching
- Color customization
- Responsive layouts

### Analytics
- Portfolio views
- Visitor tracking
- Device statistics
- Geographic insights
- Traffic analytics

### Admin Panel
- User management
- Portfolio approvals
- Featured users
- Platform analytics
- Theme management
- Content moderation

### AI Features
- Gemini integration
- AI content generation
- Resume enhancement
- Portfolio suggestions

---

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion

### Backend
- Next.js App Router
- Server Actions
- REST APIs

### Database
- MongoDB Atlas
- Prisma ORM

### Authentication
- Auth.js
- Prisma Adapter
- JWT

### Storage
- Cloudinary
- UploadThing

### AI
- Google Gemini

### Email
- Resend

### State Management
- Zustand

### Validation
- Zod
- React Hook Form

### Testing
- Jest
- React Testing Library
- Playwright

### DevOps
- Docker
- GitHub Actions
- CI/CD Pipelines

---

## Project Structure

src/
├── app/
├── actions/
├── components/
├── services/
├── repositories/
├── hooks/
├── store/
├── providers/
├── validators/
├── types/
├── config/
└── lib/

---

## Installation

bash git clone https://github.com/RAj26-luj/portify-ai.git cd portify-ai  npm install 

Create environment variables:

bash cp .env.example .env 

Run development server:

bash npm run dev 

---

## Quality Checks

bash npm run build npm run lint npm run test npm run e2e 

---

## Roadmap

### Phase 1
- Infrastructure setup
- CI/CD
- Testing framework

### Phase 2
- Database architecture
- Prisma models
- MongoDB integration

### Phase 3
- Authentication system

### Phase 4
- Portfolio CRUD

### Phase 5
- Resume & Media management

### Phase 6
- AI-powered features

### Phase 7
- Analytics dashboard

### Phase 8
- Admin approval workflow

### Phase 9
- Production deployment

---

## Status

Current Version: v0.1.0-infra

Infrastructure phase completed successfully.

---

## License

MIT License

---

## Author

Raj Kumar Nath Sharma

NIT Rourkela — Electrical Engineering

Full Stack Developer | MERN Stack | AI Applications | Competitive Programmer