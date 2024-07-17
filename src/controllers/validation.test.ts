import { loginSchema } from "./validation";

test("Test valid username and password", async () => {
  const req = {
    body: {
      username: "Max",
      password: "Mustermann",
    },
  };
  const result = await loginSchema.safeParseAsync(req.body);

  expect(result.success).toBeTruthy();

  if (result.success) {
    const { data } = result;
    const { username, password } = data;
    expect(username).toBe("Max");
    expect(password).toBe("Mustermann");
  } else {
    fail;
  }
});
