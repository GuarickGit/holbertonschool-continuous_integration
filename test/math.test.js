const test = require("node:test");
const assert = require("node:assert");
const { add, isEven, multiply } = require("../src/math");

test("add returns the sum of two numbers", () => {
  assert.strictEqual(add(2, 3), 5);
});

test("isEven detects even and odd numbers", () => {
  assert.strictEqual(isEven(4), true);
  assert.strictEqual(isEven(7), false);
});

test("multiply returns the product of two numbers", () => {
  assert.strictEqual(multiply(3, 4), 12);
});
