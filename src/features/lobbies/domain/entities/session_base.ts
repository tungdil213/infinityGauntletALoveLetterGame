import { randomUUID } from 'node:crypto'
import { SESSION_STATUS, SessionStatus } from '../types/session_status.js'

export default class SessionBase {
  private name: string
  private uuid: string
  private status: SessionStatus

  constructor() {
    this.uuid = this.generateId()
    this.status = SESSION_STATUS.OPEN
    this.name = `Lobby ${this.uuid}`
  }

  private generateId(): string {
    return randomUUID()
  }

  protected sessionIsOpen(): boolean {
    return this.status === SESSION_STATUS.OPEN
  }

  protected changeStatus(status: SessionStatus): void {
    this.status = status
  }
}
