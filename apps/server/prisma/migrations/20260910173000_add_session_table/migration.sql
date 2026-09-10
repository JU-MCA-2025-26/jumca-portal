-- Session store table for express-session (connect-pg-simple) + lusca CSRF.
-- Created manually because the library's bundled table.sql uses WITH (OIDS=FALSE),
-- which modern PostgreSQL (>= 12) rejects, so createTableIfMissing can never succeed.
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey'
  ) THEN
    ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
