import type Database from 'better-sqlite3'
import { ipcMain } from 'electron'

export function registerSubmissionHandlers(db: Database.Database) {
  ipcMain.handle('db:getSubmissions', (_event, formId: string) => {
    const rows = db.prepare('SELECT * FROM submissions WHERE form_id = ? ORDER BY created_at DESC').all(formId) as any[]
    return rows.map(rowToSubmission)
  })

  ipcMain.handle('db:getAllSubmissions', () => {
    const rows = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all() as any[]
    return rows.map(rowToSubmission)
  })

  ipcMain.handle('db:saveSubmission', (_event, sub: any) => {
    const existing = db.prepare('SELECT id FROM submissions WHERE id = ?').get(sub.id)
    if (existing) {
      db.prepare(`
        UPDATE submissions SET form_id = ?, match_number = ?, team_number = ?, scout_name = ?,
        values_json = ?, exported = ?, source = ? WHERE id = ?
      `).run(sub.formId, sub.matchNumber, sub.teamNumber, sub.scoutName,
        JSON.stringify(sub.values), sub.exported ? 1 : 0, sub.source, sub.id)
    } else {
      db.prepare(`
        INSERT INTO submissions (id, form_id, match_number, team_number, scout_name, values_json, created_at, exported, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(sub.id, sub.formId, sub.matchNumber, sub.teamNumber, sub.scoutName,
        JSON.stringify(sub.values), sub.createdAt, sub.exported ? 1 : 0, sub.source)
    }
  })

  ipcMain.handle('db:deleteSubmission', (_event, id: string) => {
    db.prepare('DELETE FROM submissions WHERE id = ?').run(id)
  })

  ipcMain.handle('db:checkImported', (_event, id: string) => {
    const row = db.prepare('SELECT submission_id FROM import_log WHERE submission_id = ?').get(id)
    return !!row
  })

  ipcMain.handle('db:markImported', (_event, id: string) => {
    db.prepare('INSERT OR IGNORE INTO import_log (submission_id, imported_at) VALUES (?, ?)').run(id, new Date().toISOString())
  })
}

function rowToSubmission(row: any) {
  return {
    id: row.id,
    formId: row.form_id,
    matchNumber: row.match_number,
    teamNumber: row.team_number,
    scoutName: row.scout_name,
    values: JSON.parse(row.values_json),
    createdAt: row.created_at,
    exported: row.exported === 1,
    source: row.source,
  }
}
