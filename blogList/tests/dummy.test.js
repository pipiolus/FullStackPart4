const listHelper = require("../utils/list_helper");

test("dummy always return one", () => {
  const blogs = [];
  const result = listHelper.dumb(blogs);
  expect(result).toBe(1);
});
