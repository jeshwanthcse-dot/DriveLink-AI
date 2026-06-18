# DriveLink AI

AI-powered Driver Exchange & Logistics Marketplace connecting transport organizations with professional drivers.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion |
| Backend | Python 3.12+, FastAPI, Pydantic, SQLAlchemy |
| Database | Supabase PostgreSQL |
| AI | Gemini API |
| Maps | MapLibre GL JS, OpenStreetMap, OpenRouteService, OSRM |
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

## Maps Setup & Configuration

This project is migrated completely from Google Maps to an open-source map stack:
- **Frontend Maps**: MapLibre GL JS
- **Tile Provider**: OpenStreetMap (via CartoDB Positron/Dark Matter raster tiles)
- **Routing Engine**: OpenRouteService (primary) with automatic fallback to **OSRM Public API** (no key required)
- **Geocoder**: OpenStreetMap Nominatim API (Forward/Reverse Address Lookups)

### Installation
Ensure `maplibre-gl` is installed in the Next.js frontend project:
```bash
cd frontend
npm install maplibre-gl
```

### Environment Variables
Configure the map provider key in the backend `.env`:
```env
OPENROUTE_API_KEY=your_openroute_api_key_here
```
*Note: If `OPENROUTE_API_KEY` is empty or omitted, the backend will automatically fall back to OSRM Public Routing API.*

## Getting Started

> Sprint 16 completed.

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

