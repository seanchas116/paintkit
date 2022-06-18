interface CallMessage {
  type: "messageProxy:call";
  method: string;
  callID: number;
  args: readonly unknown[];
}

interface ResultMessage {
  type: "messageProxy:result";
  mode: "success" | "error";
  method: string;
  callID: number;
  value: unknown;
}

interface ReadyMessage {
  type: "messageProxy:ready";
}
interface AcknowledgeMessage {
  type: "messageProxy:acknowledge";
}

type Message = CallMessage | ResultMessage | ReadyMessage | AcknowledgeMessage;

export interface Endpoint {
  addEventListener(listener: (data: any) => void): () => void;
  postMessage(data: any): void;
}

class IPCPort<THandler> {
  constructor(handler: object, endpoint: Endpoint) {
    this.handler = handler;
    this.endpoint = endpoint;

    endpoint.addEventListener((data) => {
      if (typeof data === "object" && data) {
        const message = data as Message;

        switch (message.type) {
          case "messageProxy:ready": {
            this.endpoint.postMessage({
              type: "messageProxy:acknowledge",
            });
            this.onConnected();
            break;
          }
          case "messageProxy:acknowledge": {
            this.onConnected();
            break;
          }
          case "messageProxy:call": {
            void this.handleCallMessage(message);
            break;
          }
          case "messageProxy:result": {
            const resolver = this.resolvers.get(message.callID);
            if (resolver) {
              if (message.mode === "success") {
                resolver[0](message.value);
              } else {
                resolver[1](message.value);
              }
            }
            break;
          }
        }
      }
    });

    this.sendMessage({
      type: "messageProxy:ready",
    });
  }

  private handler: object;
  private endpoint: Endpoint;
  private callID = 0;
  private resolvers = new Map<
    number,
    [(value: unknown) => void, (error: unknown) => void]
  >();

  private connected = false;
  private connectedCallbacks: (() => void)[] = [];

  private onConnected(): void {
    this.connected = true;
    this.connectedCallbacks.forEach((callback) => callback());
    this.connectedCallbacks = [];
  }

  private waitForConnected(): Promise<void> {
    if (this.connected) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.connectedCallbacks.push(resolve);
    });
  }

  private async handleCallMessage(callMessage: CallMessage): Promise<void> {
    try {
      // eslint-disable-next-line
      const value: unknown = await (this.handler as any)[callMessage.method](
        ...callMessage.args
      );

      this.sendMessage({
        type: "messageProxy:result",
        mode: "success",
        method: callMessage.method,
        callID: callMessage.callID,
        value,
      });
    } catch (error) {
      this.sendMessage({
        type: "messageProxy:result",
        mode: "error",
        method: callMessage.method,
        callID: callMessage.callID,
        value: String(error),
      });
    }
  }

  private sendMessage(message: Message): void {
    this.endpoint.postMessage(message);
  }

  getRemoteProxy<TRemoteMethods>(): TRemoteMethods {
    return new Proxy(this, {
      get(target: IPCPort<THandler>, property: string): any {
        return async (...args: any[]) => {
          await target.waitForConnected();
          const callID = target.callID++;

          return new Promise((resolve, reject) => {
            target.resolvers.set(callID, [resolve, reject]);

            target.sendMessage({
              type: "messageProxy:call",
              method: property,
              callID,
              args,
            });
          });
        };
      },
    }) as any as TRemoteMethods;
  }
}

export function setupIPC<TRemoteHandler>(
  handler: object,
  endpoint: Endpoint
): TRemoteHandler {
  return new IPCPort(handler, endpoint).getRemoteProxy<TRemoteHandler>();
}
