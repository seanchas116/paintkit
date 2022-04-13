export class ThrottleQueue {
  private next?: () => Promise<void>;
  private isRunning = false;

  public enqueue(fn: () => Promise<void>): void {
    this.next = fn;
    this.process();
  }

  public process(): void {
    if (this.isRunning) {
      return;
    }
    const next = this.next;
    this.next = undefined;
    if (!next) {
      return;
    }
    this.isRunning = true;
    next().finally(() => {
      this.isRunning = false;
      this.process();
    });
  }
}
