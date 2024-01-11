import { expect, test, describe } from "vitest";
import { jsonSchemaExample, dataBaseName } from "../test-helpers.js";
import { Rutabaga } from "../index.js";

// Shared rutabaga for all suites.
const rutabaga = new Rutabaga(jsonSchemaExample, dataBaseName);

describe('post', () => {
  test("returns 402 if form data is malformed", async () => {
    const rutabaga = new Rutabaga(jsonSchemaExample, dataBaseName);

    const formData = new FormData();

    formData.append('middleName', 'John');
    formData.append('age', '21');

    const request = new Request('http://localhost:1234', {
      method: 'POST',
      body: formData
    });

    const response = await rutabaga.api.post(request);

    expect(response.status).toBe(402);
    expect(response.statusText).toBe(`The provided form data did not validate against the schema. Reason: [{"instancePath":"","schemaPath":"#/required","keyword":"required","params":{"missingProperty":"firstName"},"message":"must have required property 'firstName'"}]`);
  });

  test("returns 201 if form data is accepted and added to the database", async () => {
    const formData = new FormData();

    formData.append('firstName', 'John');
    formData.append('lastName', 'Doe');
    formData.append('age', '21');

    const request = new Request('http://localhost:1234', {
      method: 'POST',
      body: formData
    });

    const postResponse = await rutabaga.api.post(request);

    expect(postResponse.status).toBe(201);
  });
});

describe('get', () => {
  test('can get data', async () => {
    const getResponse = await rutabaga.api.get(new Request('http://localhost:1234'));
    const json = await getResponse.json();

    expect(json[0]).toStrictEqual({
      firstName: 'John',
      lastName: 'Doe',
      age: 21
    });
  })
});
