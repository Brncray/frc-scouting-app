import type Database from 'better-sqlite3'

export function runMigrations(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS forms (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT DEFAULT '',
      version     INTEGER DEFAULT 1,
      fields_json TEXT NOT NULL,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL,
      source      TEXT NOT NULL DEFAULT 'local'
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id           TEXT PRIMARY KEY,
      form_id      TEXT NOT NULL REFERENCES forms(id),
      match_number INTEGER,
      team_number  INTEGER,
      scout_name   TEXT DEFAULT '',
      values_json  TEXT NOT NULL,
      created_at   TEXT NOT NULL,
      exported     INTEGER DEFAULT 0,
      source       TEXT NOT NULL DEFAULT 'local'
    );

    CREATE INDEX IF NOT EXISTS idx_submissions_form ON submissions(form_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_team ON submissions(team_number);

    CREATE TABLE IF NOT EXISTS import_log (
      submission_id TEXT PRIMARY KEY,
      imported_at   TEXT NOT NULL
    );
  `)
}
