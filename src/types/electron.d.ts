import type { FormDefinition } from './form'
import type { Submission } from './submission'

interface ElectronAPI {
  getForms(): Promise<FormDefinition[]>
  getForm(id: string): Promise<FormDefinition | null>
  saveForm(form: FormDefinition): Promise<void>
  deleteForm(id: string): Promise<void>

  getSubmissions(formId: string): Promise<Submission[]>
  getAllSubmissions(): Promise<Submission[]>
  saveSubmission(submission: Submission): Promise<void>
  deleteSubmission(id: string): Promise<void>
  checkImported(id: string): Promise<boolean>
  markImported(id: string): Promise<void>

  openFileDialog(options: any): Promise<{ canceled: boolean; filePaths: string[] }>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
