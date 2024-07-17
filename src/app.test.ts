function sum(a: number, b: number) {
  return a + b;
}

test("Adding 1 and 2 should equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
