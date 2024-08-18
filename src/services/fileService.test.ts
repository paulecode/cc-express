import { generateFileKey } from "./fileService";

describe("The file service works if", () => {
  describe("the key generator works if", () => {
    it("returns a string", () => {
      const key = generateFileKey("testFilename", "midi", "v0", 2);

      expect(key).toBe("midi/v0/2/testFilename");
    });
  });
});
