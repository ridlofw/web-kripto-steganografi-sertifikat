-- PERFORMANCE FIX: Add Index to Certificate Number
-- This speeds up the duplicate detection query significantly.

CREATE INDEX IF NOT EXISTS "idx_certificates_nomor_sertifikat" ON "certificates" ("nomor_sertifikat");
