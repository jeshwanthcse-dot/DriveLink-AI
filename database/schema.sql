-- DriveLink AI — Database Schema Reference
-- Database: Supabase PostgreSQL
-- Sprint 0: Structure only. Tables will be defined in Sprint 1+.

-- ─── Tables ───────────────────────────────────────────────────────
-- drivers
-- organizations
-- delivery_requests
-- live_tracking
-- proof_of_delivery
-- driver_ratings
-- organization_ratings
-- notifications

-- ─── Relationships ────────────────────────────────────────────────
-- delivery_requests.organization_id  → organizations.id
-- delivery_requests.assigned_driver_id → drivers.id
-- live_tracking.delivery_request_id  → delivery_requests.id
-- proof_of_delivery.delivery_request_id → delivery_requests.id
-- driver_ratings.driver_id           → drivers.id
-- driver_ratings.delivery_request_id → delivery_requests.id
-- organization_ratings.organization_id → organizations.id
-- organization_ratings.delivery_request_id → delivery_requests.id
-- notifications.user_id              → drivers.id | organizations.id

-- ─── Indexes ──────────────────────────────────────────────────────
-- To be added with migrations in database/migrations/
