interface CallMessage {
  type: "messageProxy:call";
  method: string;
  args: readonly unknown[];
}

type ResultMessage =
  | {
      type: "messageProxy:success";
      method: string;
      value: unknown;
    }
  | {
      type: "messageProxy:error";
      method: string;
      value: string;
    };

export interface Endpoint {
  addEventListener(listener: (data: any) => void): () => void;
  postMessage(data: any): void;
}

class MessageProxy<THandler> {
  constructor(handler: THandler, endpoint: Endpoint) {
    this.handler = handler;
    this.endpoint = endpoint;

    endpoint.addEventListener((data) => {
      if (
        typeof data === "object" &&
        data &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        data.type === "messageProxy:call"
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        void this.handleCallMessage(data);
      }
    });
  }

  private handler: THandler;
  private endpoint: Endpoint;

  private async handleCallMessage(callMessage: CallMessage): Promise<void> {
    // eslint-disable-next-line
    const value: unknown = await (this.handler as any)[callMessage.method](
      ...callMessage.args
    );

    this.sendResultMessage({
      type: "messageProxy:success",
      method: callMessage.method,
      value,
    });
  }

  private sendResultMessage(resultMessage: ResultMessage): void {
    this.endpoint.postMessage(resultMessage);
  }

  private sendCallMessage(callMessage: CallMessage): void {
    this.endpoint.postMessage(callMessage);
  }

  getProxy<T>(): T {
    return new Proxy(this, {
      get(target: MessageProxy<THandler>, property: string): any {
        return (...args: any[]) => {
          return new Promise((resolve, reject) => {
            target.sendCallMessage({
              type: "messageProxy:call",
              method: property,
              args: [],
            });

            // TODO: resolve
          });
        };
      },
    }) as any as T;
  }
}

export function createMessageProxy<TAPI, THandler>(
  handler: THandler,
  endpoint: Endpoint
): TAPI {
  return new MessageProxy(handler, endpoint).getProxy<TAPI>();
}
