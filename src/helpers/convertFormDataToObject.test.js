import { expect, test, describe } from "vitest";
import { convertFormDataToObject } from "./convertFormDataToObject.js";

describe('convertFormDataToObject', () => {
  test("adds all entries in the FormData to an object", async () => {
    const formData = new FormData();

    formData.append('firstName', 'Jeremy');
    formData.append('lastName', 'Karlsson');

    const result = convertFormDataToObject(formData);
    const resultKeys = Object.keys(result);

    for (const key of formData.keys()) {
      expect(resultKeys.includes(key)).toBe(true);
    }
  });

  test("parses strings", async () => {
    const formData = new FormData();

    formData.append('firstName', 'Jeremy');

    const result = convertFormDataToObject(formData);

    expect(result).toStrictEqual({
      firstName: 'Jeremy',
    });
  });

  test("parses numbers", async () => {
    const formData = new FormData();

    formData.append('age', '29');

    const result = convertFormDataToObject(formData);

    expect(result).toStrictEqual({
      age: 29,
    });
  });

  test("parses floats", async () => {
    const formData = new FormData();

    formData.append('money', '23.5');

    const result = convertFormDataToObject(formData);

    expect(result).toStrictEqual({
      money: 23.5,
    });
  });

  test("parses booleans", async () => {
    const formData = new FormData();

    formData.append('alive', 'true');

    const result = convertFormDataToObject(formData);

    expect(result).toStrictEqual({
      alive: true,
    });
  });

  test("parses dates", async () => {
    const formData = new FormData();

    formData.append('dateOfBirth', '1994-11-21');

    const result = convertFormDataToObject(formData);

    expect(result).toStrictEqual({
      dateOfBirth: '1994-11-21T00:00:00.000Z'
    });
  });
});
