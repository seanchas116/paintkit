interface CallMessage {
  type: "messageProxy:call";
  method: string;
  callID: number;
  args: readonly unknown[];
}

type ResultMessage = {
  type: "messageProxy:result";
  mode: "success" | "error";
  method: string;
  callID: number;
  value: unknown;
};

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
        const message = data as CallMessage | ResultMessage;

        if (message.type === "messageProxy:call") {
          void this.handleCallMessage(message);
        }
        if (message.type === "messageProxy:result") {
          const resolver = this.resolvers.get(message.callID);
          if (resolver) {
            if (message.mode === "success") {
              resolver[0](message.value);
            } else {
              resolver[1](message.value);
            }
          }
        }
      }
    });
  }

  private handler: object;
  private endpoint: Endpoint;
  private callID = 0;
  private resolvers = new Map<
    number,
    [(value: unknown) => void, (error: unknown) => void]
  >();

  private async handleCallMessage(callMessage: CallMessage): Promise<void> {
    try {
      // eslint-disable-next-line
      const value: unknown = await (this.handler as any)[callMessage.method](
        ...callMessage.args
      );

      this.sendResultMessage({
        type: "messageProxy:result",
        mode: "success",
        method: callMessage.method,
        callID: callMessage.callID,
        value,
      });
    } catch (error) {
      this.sendResultMessage({
        type: "messageProxy:result",
        mode: "error",
        method: callMessage.method,
        callID: callMessage.callID,
        value: String(error),
      });
    }
  }

  private sendResultMessage(resultMessage: ResultMessage): void {
    this.endpoint.postMessage(resultMessage);
  }

  private sendCallMessage(callMessage: CallMessage): void {
    this.endpoint.postMessage(callMessage);
  }

  getProxy<TRemoteMethods>(): TRemoteMethods {
    return new Proxy(this, {
      get(target: IPCPort<THandler>, property: string): any {
        return (...args: any[]) => {
          const callID = target.callID++;
          return new Promise((resolve, reject) => {
            target.resolvers.set(callID, [resolve, reject]);
            target.sendCallMessage({
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

export function establishIPC<TRemoteMethods>(
  handler: object,
  endpoint: Endpoint
): TRemoteMethods {
  return new IPCPort(handler, endpoint).getProxy<TRemoteMethods>();
}
