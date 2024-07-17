function sum(a: number, b: number) {
  return a + b;
}

test("Adding 1 and 2 should equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("Making a request to '/' returns 'Hello World!'", async () => {
  const response = await fetch("http://localhost:3000/");
  expect(response.ok).toBeTruthy;
  expect(response.status).toBe(200);
  const data = await response.text();
  expect(data).toBe("Hello World!");
});
