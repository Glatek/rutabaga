import { convertFormDataToObject } from "../helpers/convertFormDataToObject.js";
import { schemaUrlIdToId } from "../helpers/schemaUrlIdToId.js";

const httpStatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 402,
};

export class APIRoutes {
  /** @type {import('dexie').Dexie} */
  #dataBase;

  /** @type {import('ajv').ValidateFunction} */
  #validate;

  /** @type {import('ajv/lib/types/json-schema.js').SomeJSONSchema} */
  #schema;

  /**
   *
   * @param {import('dexie').Dexie} dataBase
   * @param {import('ajv').ValidateFunction} validate
   * @param {import('ajv/lib/types/json-schema.js').SomeJSONSchema} schema
   */
  constructor(dataBase, validate, schema) {
    this.#dataBase = dataBase;
    this.#validate = validate;
    this.#schema = schema;
  }

  /**
   * @param {Request} request
   * @returns {Promise<Response>}
   */
  async get(request) {
    await this.#dataBase.open();

    const tableName = schemaUrlIdToId(this.#schema.$id ?? '');

    const objects = await this.#dataBase.table(tableName).toArray();

    return new Response(JSON.stringify(objects), {
      status: httpStatusCodes.OK
    });
  }

  /**
   * @param {Request} request
   * @returns {Promise<Response>}
   */
  async post(request) {
    const formData = await request.formData();
    const newObject = convertFormDataToObject(formData);

    if (!this.#validate(newObject)) {
      return new Response(null, {
        status: httpStatusCodes.BAD_REQUEST,
        statusText: `The provided form data did not validate against the schema. Reason: ${JSON.stringify(this.#validate.errors)}`
      });
    }

    await this.#dataBase.open();

    const tableName = schemaUrlIdToId(this.#schema.$id ?? '');

    this.#dataBase.table(tableName).add(newObject);

    return new Response(null, {
      status: httpStatusCodes.CREATED
    });
  }
}