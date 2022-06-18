import { describe, it, expect } from "vitest";
import { createMessageProxy, Endpoint } from "./MessageProxy";

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

describe(createMessageProxy.name, () => {
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

    const b = createMessageProxy<typeof methodsB, typeof methodsA>(
      methodsA,
      endpointA
    );
    const ret = await b.decrement(2);
    expect(ret).toBe(1);
  });
});
