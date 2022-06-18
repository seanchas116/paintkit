import { describe, it, expect } from "vitest";
import { establishIPC, Endpoint } from "./MessageProxy";

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

describe(establishIPC.name, () => {
  it("should call method on handler", async () => {
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

    const a = establishIPC<typeof methodsA>(methodsB, endpointB);
    const b = establishIPC<typeof methodsB>(methodsA, endpointA);

    const ret = await b.decrement(2);
    expect(ret).toBe(1);
  });
});
