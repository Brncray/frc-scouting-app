import type Database from 'better-sqlite3'
import { ipcMain } from 'electron'

export function registerFormHandlers(db: Database.Database) {
  ipcMain.handle('db:getForms', () => {
    const rows = db.prepare('SELECT * FROM forms ORDER BY updated_at DESC').all() as any[]
    return rows.map(rowToForm)
  })

  ipcMain.handle('db:getForm', (_event, id: string) => {
    const row = db.prepare('SELECT * FROM forms WHERE id = ?').get(id) as any
    return row ? rowToForm(row) : null
  })

  ipcMain.handle('db:saveForm', (_event, form: any) => {
    const existing = db.prepare('SELECT id FROM forms WHERE id = ?').get(form.id)
    if (existing) {
      db.prepare(`
        UPDATE forms SET name = ?, description = ?, version = ?, fields_json = ?, updated_at = ?, source = ?
        WHERE id = ?
      `).run(form.name, form.description, form.version, JSON.stringify(form.fields), form.updatedAt, form.source, form.id)
    } else {
      db.prepare(`
        INSERT INTO forms (id, name, description, version, fields_json, created_at, updated_at, source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(form.id, form.name, form.description, form.version, JSON.stringify(form.fields), form.createdAt, form.updatedAt, form.source)
    }
  })

  ipcMain.handle('db:deleteForm', (_event, id: string) => {
    db.prepare('DELETE FROM submissions WHERE form_id = ?').run(id)
    db.prepare('DELETE FROM forms WHERE id = ?').run(id)
  })
}

function rowToForm(row: any) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    version: row.version,
    fields: JSON.parse(row.fields_json),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    source: row.source,
  }
}
