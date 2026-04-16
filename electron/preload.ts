import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Forms
  getForms: () => ipcRenderer.invoke('db:getForms'),
  getForm: (id: string) => ipcRenderer.invoke('db:getForm', id),
  saveForm: (form: any) => ipcRenderer.invoke('db:saveForm', form),
  deleteForm: (id: string) => ipcRenderer.invoke('db:deleteForm', id),

  // Submissions
  getSubmissions: (formId: string) => ipcRenderer.invoke('db:getSubmissions', formId),
  getAllSubmissions: () => ipcRenderer.invoke('db:getAllSubmissions'),
  saveSubmission: (submission: any) => ipcRenderer.invoke('db:saveSubmission', submission),
  deleteSubmission: (id: string) => ipcRenderer.invoke('db:deleteSubmission', id),
  checkImported: (id: string) => ipcRenderer.invoke('db:checkImported', id),
  markImported: (id: string) => ipcRenderer.invoke('db:markImported', id),

  // Dialog
  openFileDialog: (options: any) => ipcRenderer.invoke('dialog:openFile', options),
  readFileAsDataUrl: (filePath: string) => ipcRenderer.invoke('file:readAsDataUrl', filePath),
})
