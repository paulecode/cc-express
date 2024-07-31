import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  doesHashMatchPassword,
  generateToken,
  hashPassword,
} from "./authService";

describe("The service works if, ", () => {
  describe("the generateToken function...", () => {
    it("...receives a payload and returns a token", () => {
      const payload = "1";

      const token = generateToken(payload);

      expect(token).toBeDefined();

      const secret = process.env.JWT_SECRET || "testSecret";

      const { sub } = jwt.verify(token, secret);

      expect(sub).toBe("1");
    });
  });
  describe("the hashPassword function...", () => {
    it("the password does not match the hash", async () => {
      const password = "123";

      const hash = await hashPassword(password);

      expect(hash).not.toEqual(password);
    });
    it("generates two different hashes for the same string", async () => {
      const password1 = "123";
      const password2 = "123";

      const hash1 = await hashPassword(password1);
      const hash2 = await hashPassword(password2);

      expect(hash1).not.toEqual(hash2);
    });
    describe("the doesHashMatchPassword function... ", () => {
      it("...", async () => {
        const password = "123";

        const hash = await bcrypt.hash(password, 10);

        const hashMatchesPassword: boolean = await doesHashMatchPassword(
          hash,
          password,
        );

        expect(hashMatchesPassword).toBe(true);
      });
    });
  });
});
