import { expect, test, describe } from "vitest";
import { schemaUrlIdToId } from "./schemaUrlIdToId.js";

describe('schemaUrlIdToId', () => {
  test("can parse JSON schema $id", async () => {
    expect(schemaUrlIdToId('https://example.com/blog-post.schema.json')).toBe('blog-post');
  });

  test("can parse JSON schema $id", async () => {
    expect(() => schemaUrlIdToId('grl-54-ss')).toThrowError('Not valid schema ID. Must be URL ending with ".schema.json".');
  });
});
