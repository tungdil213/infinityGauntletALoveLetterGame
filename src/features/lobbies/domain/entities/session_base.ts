import { randomUUID } from 'node:crypto'
import { SESSION_STATUS, SessionStatus } from '../types/session_status.js'

export default class SessionBase {
  private _name: string
  private _uuid: string
  private _status: SessionStatus

  constructor() {
    this._uuid = this.generateId()
    this._status = SESSION_STATUS.OPEN
    this._name = `Lobby ${this._uuid}`
  }

  private generateId(): string {
    return randomUUID()
  }

  get name(): string {
    return this._name
  }

  get uuid(): string {
    return this._uuid
  }

  get status(): SessionStatus {
    return this._status
  }

  protected sessionIsOpen(): boolean {
    return this._status === SESSION_STATUS.OPEN
  }

  protected changeStatus(status: SessionStatus): void {
    this._status = status
  }
}
