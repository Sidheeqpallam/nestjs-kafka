export class SendMessageEvent {
  constructor(
    public readonly from: string,
    public readonly to: string,
    public readonly message: string
  ) { }

  toString() {
    return JSON.stringify({
      from: this.from,
      to: this.to,
      message: this.message,
    })
  }
} 