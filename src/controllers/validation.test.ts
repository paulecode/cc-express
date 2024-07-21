import { loginSchema } from "./validation";

describe("The validation works if", () => {
  it("receives a valid request", () => {
    const body = {
      username: "walter",
      password: "supersecure123!",
    };

    const result = loginSchema.safeParse(body);

    expect(result.success).toBeTruthy();
  });
  it("receives a too short username", () => {
    const body = {
      username: "wal",
      password: 123,
    };
    const result = loginSchema.safeParse(body);

    expect(result.success).toBeFalsy();

    // ensure error property is not optional in scope
    if (result.success) {
      return;
    }

    expect(result.error.errors[0].code).toBe("too_small");
    expect(result.error.errors[1].code).toBe("invalid_type");
  });
});
