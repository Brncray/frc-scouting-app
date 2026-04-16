export interface Submission {
  id: string
  formId: string
  matchNumber: number | null
  teamNumber: number | null
  scoutName: string
  values: Record<string, any>
  createdAt: string
  exported: boolean
  source: 'local' | 'imported'
}
