# JOBS — Laravel & React Job Board

A full-stack **job board** single-page application built with **Laravel 11 (PHP 8.2)** on the backend and **React 19 (TypeScript)** on the frontend. Features user registration, token-based authentication, and full CRUD management of job listings.

Fully containerized with **Docker Compose** — one command to run the entire stack.

**Demo:** https://www.youtube.com/watch?v=e2M5p7jGpPw

---

## Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Backend    | PHP 8.2, Laravel 11, Sanctum (token auth)        |
| Frontend   | React 19, TypeScript, Vite, Tailwind CSS 3       |
| Database   | PostgreSQL 15                                     |
| API Docs   | L5-Swagger (OpenAPI)                              |
| Infra      | Docker, Docker Compose                            |

---

## Project Structure

```
JOBS/
├── docker-compose.yml
├── README.md
├── LICENSE
│
├── backend/                        # Laravel 11 API
│   ├── Dockerfile
│   ├── artisan
│   ├── composer.json
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── JobController.php
│   │   │   │   └── UserController.php
│   │   │   ├── Middleware/
│   │   │   │   └── Authenticate.php
│   │   │   └── Kernel.php
│   │   ├── Models/
│   │   │   ├── Job.php
│   │   │   └── User.php
│   │   ├── Providers/
│   │   │   ├── AppServiceProvider.php
│   │   │   └── RouteServiceProvider.php
│   │   └── Services/
│   │       ├── AuthService.php
│   │       ├── JobService.php
│   │       └── UserService.php
│   ├── config/
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   ├── api.php
│   │   └── api/
│   │       ├── auth.php
│   │       ├── jobs.php
│   │       └── users.php
│   └── tests/
│
├── frontend/                       # React 19 SPA
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── Footer.tsx
│       │   ├── Hero.tsx
│       │   ├── JobListingCard.tsx
│       │   ├── JobListings.tsx
│       │   ├── Message.tsx
│       │   ├── PrivateRoute.tsx
│       │   ├── Spinner.tsx
│       │   ├── ViewAllJobsButton.tsx
│       │   └── pages/
│       │       ├── Home.tsx
│       │       ├── Login.tsx
│       │       ├── Register.tsx
│       │       ├── AddJob.tsx
│       │       ├── JobDetail.tsx
│       │       ├── UserDetail.tsx
│       │       └── static/
│       │           └── static.tsx      # About, Contact, Privacy
│       ├── constants/
│       ├── context/
│       │   └── AuthContext.tsx
│       ├── types/
│       │   └── Types.ts
│       └── utils/
│           └── validations.ts
```

---

## Architecture

### Backend — Service-Oriented Architecture

The Laravel backend is structured as an **API-only** application using the **Controller → Service → Model** pattern:

- **Controllers** — Handle HTTP requests/responses and input validation
- **Services** — Encapsulate business logic (`AuthService`, `JobService`, `UserService`)
- **Models** — Eloquent ORM entities (`User`, `Job`) with database interaction
- **Routes** — RESTful API endpoints organized into modular route files
- **Authentication** — Token-based auth via Laravel Sanctum
- **API Documentation** — Auto-generated Swagger/OpenAPI docs via L5-Swagger

### Frontend — Component-Based SPA

The React frontend is built with TypeScript and provides a responsive UI:

- **Pages** — Individual views (Home, Login, Register, Job Detail, User Profile, Add Job)
- **Components** — Reusable UI elements (Header, Footer, JobListingCard, Spinner)
- **Context** — Global authentication state via `AuthContext`
- **Routing** — Client-side navigation with React Router v6
- **Styling** — Utility-first CSS with Tailwind CSS
- **Validation** — Form input validation utilities

---

## Quick Start (Docker)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/jaroslavdusek1/JOBS-laravel-react-ts.git
cd JOBS-laravel-react-ts
```

### 2. Create the environment file

```bash
cp backend/.env.example backend/.env
```

### 3. Build and start all services

```bash
docker compose up --build
```

### 4. Run database migrations (first time only)

In a new terminal:
```bash
docker exec -it jobs-backend php artisan migrate
```

### 5. Access the application

| Service          | URL                                            |
|------------------|------------------------------------------------|
| Frontend         | [http://localhost:3000](http://localhost:3000)  |
| Backend API      | [http://localhost:8000](http://localhost:8000)  |
| Swagger API Docs | [http://localhost:8000/api/documentation](http://localhost:8000/api/documentation) |

---

## Local Development (without Docker)

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve    # → http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev          # → http://localhost:3000
```

> **Note:** For local development, update `DB_HOST` in `backend/.env` from `db` to `localhost` and ensure PostgreSQL is running locally.

---

## Docker Services

```bash
docker ps
```

```
CONTAINER ID   IMAGE           PORTS                    NAMES
af2e821a0b36   jobs-frontend   0.0.0.0:3000->3000/tcp   jobs-frontend
50004cdebd17   jobs-backend    0.0.0.0:8000->8000/tcp   jobs-backend
7d05c673f032   postgres:15     0.0.0.0:5432->5432/tcp   jobs-db
```

### Verify running services

```bash
# Linux/Mac
netstat -tuln | grep 3000
netstat -tuln | grep 8000

# Mac (alternative with lsof)
lsof -i :3000
lsof -i :8000
```

Expected output:
```
tcp        0      0 0.0.0.0:3000          0.0.0.0:*             LISTEN
tcp        0      0 0.0.0.0:8000          0.0.0.0:*             LISTEN

or

com.docke 59731   jd  185u  IPv6 0x6aeaeae6b75ab14b      0t0  TCP *:hbci (LISTEN)
com.docke 59731   jd  187u  IPv6 0x6d670f0a0a8687f0      0t0  TCP *:redwood-broker (LISTEN)
```

### Access the database

```bash
docker exec -it jobs-db psql -U postgres -d jobs
```

```sql
\dt
                 List of relations
 Schema |          Name          | Type  |  Owner
--------+------------------------+-------+----------
 public | jobs                   | table | postgres
 public | migrations             | table | postgres
 public | personal_access_tokens | table | postgres
 public | users                  | table | postgres
```

---

## API Documentation

Interactive Swagger documentation is available at [http://localhost:8000/api/documentation](http://localhost:8000/api/documentation) when the backend is running.

![Swagger API Overview](frontend/public/imgs/swagger1.png)
![Swagger API Details](frontend/public/imgs/swagger2.png)

### API Routes Overview
![API Routes](frontend/public/imgs/artisan_routes.png)

---

## Screenshots

### Home Page
![Home Page](frontend/public/imgs/homeee.png)

### Job Detail
![Job Detail](frontend/public/imgs/job_detail.png)

### Register
![Register](frontend/public/imgs/register.png)

### Login
![Login](frontend/public/imgs/loginn.png)

### User Profile
![User Profile](frontend/public/imgs/profile.png)

### Add Job
![Add Job](frontend/public/imgs/add_job.png)

---

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file.
