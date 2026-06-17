# DriveLink AI

AI-powered Driver Exchange & Logistics Marketplace connecting transport organizations with professional drivers.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion |
| Backend | Python 3.12+, FastAPI, Pydantic, SQLAlchemy |
| Database | Supabase PostgreSQL |
| AI | Gemini API |
| Maps | Google Maps API |
| Notifications | Firebase Cloud Messaging |

## Project Structure

```
DriveLink-AI/
├── frontend/     # Next.js application
├── backend/      # FastAPI application
├── database/     # Migrations, seeds, schema
├── docs/         # Architecture and feature documentation
├── assets/       # Shared design assets
└── PROJECT_RULES.md
```

## Getting Started

> Sprint 0 — scaffolding only. Dependencies are not installed yet.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Development Workflow

See [PROJECT_RULES.md](./PROJECT_RULES.md) for coding standards, module definitions, and phased development plan.

## License

MIT — see [LICENSE](./LICENSE).
