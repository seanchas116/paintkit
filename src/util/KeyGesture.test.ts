import { KeyGesture } from "./KeyGesture";

describe(KeyGesture, () => {
  it("returns Electron accelerator", () => {
    expect(new KeyGesture(["Command"], "KeyC").toElectronAccelerator()).toBe(
      "CommandOrControl+C"
    );
  });
});
