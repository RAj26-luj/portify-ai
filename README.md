# Portify AI

An AI-powered SaaS platform for building professional developer portfolios with customizable themes, analytics, media management, and AI-assisted content generation.

---

## Overview

Portify AI enables students, developers, and professionals to create modern portfolio websites without manually designing or coding them.

Users can build portfolios, manage projects, upload resumes, add media, track analytics, customize themes, and leverage AI-powered content generation to showcase their work professionally.

The platform is designed as a scalable SaaS application using modern technologies including Next.js, TypeScript, MongoDB, Prisma, Auth.js, Cloudinary, Gemini AI, and industry-standard DevOps practices.

---

## Core Features

### Authentication & Security

- User Registration
- Secure Login & Logout
- Email Verification
- Password Reset
- Protected Routes
- Role-Based Access Control (RBAC)
- Session Management

### Portfolio Builder

- Public Portfolio Pages
- Custom Username URLs
- About Section
- Education Section
- Experience Section
- Projects Section
- Skills Section
- Achievements Section
- Coding Profiles
- Social Links
- Custom Portfolio Sections

### Resume Management

- Resume Upload
- Resume Replacement
- Resume Download
- AI Resume Parsing
- AI Resume Enhancement

### Media Management

- Image Uploads
- Video Uploads
- Cloudinary Integration
- Portfolio Galleries
- Media Optimization

### Themes & Customization

- Multiple Portfolio Themes
- Theme Switching
- Custom Color Schemes
- Responsive Layouts
- Dark / Light Mode

### Analytics

- Portfolio Views
- Visitor Tracking
- Device Statistics
- Traffic Insights
- Google Analytics Integration

### Admin Panel

- User Management
- Portfolio Approvals
- Featured Users
- Platform Analytics
- Theme Management

### AI Features

- Gemini AI Integration
- Content Generation
- Resume Enhancement
- Portfolio Suggestions
- Smart Recommendations

---

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Shadcn UI
- Framer Motion

### Backend

- Next.js App Router
- Server Actions
- Route Handlers

### Database

- MongoDB Atlas
- Prisma ORM

### Authentication

- Auth.js
- Prisma Adapter

### Storage

- Cloudinary

### AI

- Google Gemini AI

### Email Services

- Nodemailer
- Gmail SMTP

### Analytics

- Google Analytics 4

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
- Husky
- Lint-Staged
- Vercel

---

## Project Structure

```text
portify-ai/
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
├── emails/
├── monitoring/
├── prisma/
├── public/
├── scripts/
├── src/
│   ├── actions/
│   ├── app/
│   ├── cache/
│   ├── components/
│   ├── config/
│   ├── constants/
│   ├── context/
│   ├── db/
│   ├── events/
│   ├── generated/
│   ├── hooks/
│   ├── jobs/
│   ├── lib/
│   ├── providers/
│   ├── repositories/
│   ├── services/
│   ├── store/
│   ├── templates/
│   ├── types/
│   ├── utils/
│   └── validators/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── Dockerfile
├── docker-compose.yml
├── jest.config.ts
├── playwright.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Architecture Overview

Portify AI follows a scalable layered architecture.

### Presentation Layer

- Next.js App Router
- React Components
- Tailwind CSS
- Shadcn UI

### Application Layer

- Server Actions
- Route Handlers
- Feature Modules

### Business Layer

- Services
- Repositories
- Domain Logic

### Data Layer

- Prisma ORM
- MongoDB Atlas

### Infrastructure Layer

- Cloudinary
- Gemini AI
- Gmail SMTP
- Docker
- GitHub Actions
- Vercel

---

## Installation

### Clone Repository

```bash
git clone https://github.com/RAj26-luj/portify-ai.git

cd portify-ai
```

### Install Dependencies

```bash
npm install
```

### Required Services

- MongoDB Atlas
- Cloudinary
- Google Gemini API
- Gmail SMTP
- Vercel

### Environment Variables

```bash
cp .env.example .env
```

Configure all required environment variables.

### Start Development Server

```bash
npm run dev
```

Application will be available at:

```text
http://localhost:3000
```

---

## Quality Checks

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Unit Tests

```bash
npm run test
```

### End-to-End Tests

```bash
npm run e2e
```

---

## CI/CD Pipeline

The project includes automated workflows for:

- Build Validation
- Lint Checks
- Automated Testing
- Deployment Automation
- Pull Request Verification

GitHub Actions are configured inside:

```text
.github/workflows/
```

---

## Deployment

### Vercel

Production deployments are automatically triggered from the `main` branch.

### Docker

```bash
docker-compose up --build
```

---

## Roadmap

### Phase 1

- Infrastructure Setup
- CI/CD Configuration
- Testing Framework

### Phase 2

- Database Architecture
- Prisma Models
- MongoDB Integration

### Phase 3

- Authentication System

### Phase 4

- Portfolio Management

### Phase 5

- Resume & Media Management

### Phase 6

- AI-Powered Features

### Phase 7

- Analytics Dashboard

### Phase 8

- Admin Approval Workflow

### Phase 9

- Production Release

---

## Status

**Current Version:** `v0.1.0-infra`

Infrastructure setup completed successfully.

### Completed

- Next.js 16 Setup
- TypeScript Configuration
- Project Architecture
- GitHub Repository Setup
- GitHub Actions Workflows
- Docker Configuration
- Jest Configuration
- Playwright Configuration
- Vercel Deployment
- Initial E2E Testing
- Repository Documentation

### Next Milestone

- Database Design
- Prisma Schema Creation
- MongoDB Atlas Integration
- Authentication System
- Portfolio CRUD Operations

---

## Contributing

Contributions, suggestions, and feature requests are welcome.

Please create an issue or submit a pull request.

---

## License

This project is licensed under the MIT License.

---

## Author

**Raj Kumar Nath Sharma**

B.Tech, Electrical Engineering  
National Institute of Technology Rourkela

- Full Stack Development
- MERN Stack
- AI Applications
- Competitive Programming

---

⭐ If you found this project useful, consider giving it a star.