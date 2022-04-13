import { Color } from "./Color";

describe(Color, () => {
  describe(".fromHex", () => {
    it("should create a color from a hex-like string", () => {
      expect(Color.fromHex("2").toHex8()).toEqual("#222222FF");
      expect(Color.fromHex("34").toHex8()).toEqual("#343434FF");
      expect(Color.fromHex("123").toHex8()).toEqual("#112233FF");
      expect(Color.fromHex("123456").toHex8()).toEqual("#123456FF");
      expect(Color.fromHex("12345678").toHex8()).toEqual("#12345678");
      expect(Color.fromHex("#2").toHex8()).toEqual("#222222FF");
      expect(Color.fromHex("#34").toHex8()).toEqual("#343434FF");
      expect(Color.fromHex("#123").toHex8()).toEqual("#112233FF");
      expect(Color.fromHex("#123456").toHex8()).toEqual("#123456FF");
      expect(Color.fromHex("#12345678").toHex8()).toEqual("#12345678");
    });
  });
});
