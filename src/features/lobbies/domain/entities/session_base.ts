import { randomUUID } from 'node:crypto'
import { SESSION_STATUS, SessionStatus } from '../types/session_status.js'

export default class SessionBase {
  protected _name: string
  protected _uuid: string
  protected _status: SessionStatus

  constructor() {
    this._uuid = this.generateId()
    this._status = SESSION_STATUS.OPEN
    this._name = `Lobby ${this._uuid}`
  }

  private generateId(): string {
    return randomUUID()
  }

  protected sessionIsOpen(): boolean {
    return this._status === SESSION_STATUS.OPEN
  }

  protected changeStatus(status: SessionStatus): void {
    this._status = status
  }
}
