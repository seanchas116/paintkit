import { describe, it, expect } from "vitest";
import { setupIPC, Endpoint } from "./MessageProxy";

describe(setupIPC.name, () => {
  it("should call method on handler", async () => {
    const methodsA = {
      async increment(value: number) {
        return value + 1;
      },
    };
    const methodsB = {
      async decrement(value: number) {
        return value - 1;
      },
    };

    const endpointA: Endpoint = {
      addEventListener(handler: (data: any) => void): () => void {
        endpointB.postMessage = handler;
        return () => {};
      },
      postMessage(data: any) {},
    };

    const endpointB: Endpoint = {
      addEventListener(handler: (data: any) => void): () => void {
        endpointA.postMessage = handler;
        return () => {};
      },
      postMessage(data: any) {},
    };

    const a = setupIPC<typeof methodsA>(methodsB, endpointB);

    let aReturn = -1;
    void a.increment(2).then((value) => (aReturn = value));

    await new Promise((resolve) => setTimeout(resolve, 10));

    const b = setupIPC<typeof methodsB>(methodsA, endpointA);
    let bReturn = -1;
    void b.decrement(2).then((value) => (bReturn = value));

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(aReturn).toBe(3);
    expect(bReturn).toBe(1);
  });
});
