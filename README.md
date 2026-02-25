# LMS Platform

A production-ready Learning Management System built with Node.js, Express, Prisma, Next.js, and TypeScript.

---

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM + PostgreSQL
- JWT Authentication
- Multer (file uploads)
- Zod (validation)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Redux Toolkit
- React Hook Form + Zod
- Tailwind CSS
- Recharts
- React Hot Toast

---

## Project Structure
```
lms/
├── lms-backend/
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   ├── user/
│       │   ├── category/
│       │   ├── course/
│       │   ├── lesson/
│       │   ├── enrollment/
│       │   └── analytics/
│       ├── middlewares/
│       └── app.ts
└── lms-frontend/
    └── src/
        ├── app/
        │   ├── (auth)/
        │   └── (dashboard)/
        │       ├── admin/
        │       ├── instructor/
        │       └── student/
        ├── components/
        ├── store/
        ├── lib/
        ├── hooks/
        ├── types/
        └── utils/
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

---

### Backend Setup

**1. Navigate to backend:**
```bash
cd lms-backend
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create `.env` file:**
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/lms_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

**4. Run database migrations:**
```bash
npx prisma migrate dev --name init
```

**5. Generate Prisma client:**
```bash
npx prisma generate
```

**6. Start the server:**
```bash
npx ts-node-dev src/app.ts
```

Backend runs at `http://localhost:5000`

---

### Frontend Setup

**1. Navigate to frontend:**
```bash
cd lms-frontend
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create `.env.local` file:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**4. Start the dev server:**
```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---
### Testing Setup

**1. Navigate to backend:**
```bash
cd lms-backend
```

**2. Install dependencies:**
```bash
npm test
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/users` | List all users |
| PATCH  | `/api/users/:id` | Suspend/activate user |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/categories` | List categories |
| GET    | `/api/categories/:id` | Get category |
| POST   | `/api/categories` | Create category |
| PATCH  | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/courses` | List courses |
| GET    | `/api/courses/:id` | Get course |
| POST   | `/api/courses` | Create course |
| PUT    | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Archive course |

### Lessons
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/courses/:id/lessons` | Get lessons |
| POST   | `/api/courses/:id/lessons` | Create lesson |
| PUT    | `/api/courses/:id/lessons/:lessonId` | Update lesson |
| DELETE | `/api/courses/:id/lessons/:lessonId` | Delete lesson |

### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/enrollments` | Enroll in course |
| GET    | `/api/enrollments/mine` | My enrollments |
| PATCH  | `/api/enrollments/:id` | Update status |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/analytics/admin` | Admin stats |
| GET    | `/api/analytics/enrollment-growth` | Enrollment growth |
| GET    | `/api/analytics/top-courses` | Top courses |
| GET    | `/api/analytics/revenue` | Revenue per course |
| GET    | `/api/analytics/instructor` | Instructor stats |

---

## Roles

| Role | Access |
|------|--------|
| `SUPER_ADMIN` | Full access |
| `ADMIN` | Manage users, courses, categories |
| `INSTRUCTOR` | Create and manage own courses |
| `STUDENT` | Browse and enroll in courses |

---

## Features

- JWT authentication with cookie storage
- Role-based access control
- Course management with lessons
- Thumbnail upload with Multer
- Student enrollment system
- Analytics dashboard with charts
- Search and pagination on all tables
- Soft delete for courses and categories
- Toast notifications
- Error boundaries
- Page transition loader
- Responsive sidebar navigation

---

## Test Accounts

Register accounts manually at `http://localhost:3000/register` with these roles:
- **Admin** — email: proggaadmin@example.com, password: 123456
- **Instructor** — email: proggaINSTRUCTOR@example.com, password: 123456
- **Student** — email: proggarilma@example.com, password: 123456
- **Super Admin** - email: super@test.com, password: 123456

To open Prisma Studio:
```bash
cd lms-backend
npx prisma studio
```
