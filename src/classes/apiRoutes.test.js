import { expect, test, describe } from "vitest";
import { jsonSchemaExample, dataBaseName } from "../test-helpers.js";
import { Rutabaga } from "../index.js";

// Shared rutabaga for all suites.
const rutabaga = new Rutabaga(jsonSchemaExample, dataBaseName);

const idForPutToReplaceInPatch = 'derpherp';

describe('post', () => {
  test("returns 402 if form data is malformed", async () => {
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

    expect(json[0].firstName).toStrictEqual('John');
    expect(json[0].lastName).toStrictEqual('Doe');
    expect(json[0].age).toStrictEqual(21);
    expect(json[0].id).toBeDefined();
  })
});

describe('put', () => {
  test("returns 402 if form data is malformed", async () => {
    const formData = new FormData();

    formData.append('middleName', 'John');
    formData.append('age', '21');

    const request = new Request('http://localhost:1234', {
      method: 'PUT',
      body: formData
    });

    const response = await rutabaga.api.post(request);

    expect(response.status).toBe(402);
    expect(response.statusText).toBe(`The provided form data did not validate against the schema. Reason: [{"instancePath":"","schemaPath":"#/required","keyword":"required","params":{"missingProperty":"firstName"},"message":"must have required property 'firstName'"}]`);
  });

  test("returns 201 if form data is accepted and added to the database", async () => {
    const formData = new FormData();

    formData.append('firstName', 'Alice');
    formData.append('lastName', 'Doe');
    formData.append('age', '22');
    formData.append('id', idForPutToReplaceInPatch);

    const request = new Request('http://localhost:1234', {
      method: 'PUT',
      body: formData
    });

    const postResponse = await rutabaga.api.post(request);

    expect(postResponse.status).toBe(201);
  });
});

describe('patch', () => {
  test("returns 402 if form data is malformed", async () => {
    const formData = new FormData();

    formData.append('middleName', 'John');

    const request = new Request('http://localhost:1234', {
      method: 'PATCH',
      body: formData
    });

    const response = await rutabaga.api.post(request);

    expect(response.status).toBe(402);
    expect(response.statusText).toBe(`The provided form data did not validate against the schema. Reason: [{"instancePath":"","schemaPath":"#/required","keyword":"required","params":{"missingProperty":"age"},"message":"must have required property 'age'"}]`);
  });

  test("returns 200 if form data is accepted and added to the database", async () => {
    const formData = new FormData();

    formData.append('id', idForPutToReplaceInPatch);
    formData.append('firstName', 'Josephine');

    const request = new Request('http://localhost:1234', {
      method: 'PATCH',
      body: formData
    });

    const postResponse = await rutabaga.api.patch(request);
    const json = await postResponse.json();

    expect(postResponse.status).toBe(200);
    expect(json).toStrictEqual({
      firstName: 'Josephine',
      lastName: 'Doe',
      id: idForPutToReplaceInPatch,
      age: 22
    });
  });
});