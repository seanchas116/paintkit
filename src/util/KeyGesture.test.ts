import { describe, it, expect } from "vitest";
import { KeyGesture } from "./KeyGesture";

describe(KeyGesture.name, () => {
  it("returns Electron accelerator", () => {
    expect(new KeyGesture(["Command"], "KeyC").toElectronAccelerator()).toBe(
      "CommandOrControl+C"
    );
  });
});
