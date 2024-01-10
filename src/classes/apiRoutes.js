import { convertFormDataToObject } from "../helpers/convertFormDataToObject.js";

const httpStatusCodes = {
  CREATED: 201,
  BAD_REQUEST: 402,
};

export class APIRoutes {
  /** @type {import('dexie').Dexie} */
  #dataBase = undefined;

  /** @type {import('ajv').ValidateFunction} */
  #validate = undefined;

  /**
   *
   * @param {import('dexie').Dexie} dataBase
   * @param {import('ajv').ValidateFunction} validate
   */
  constructor(dataBase, validate) {
    this.#dataBase = dataBase;
    this.#validate = validate;
  }

  /**
     * @param {Request} request
     * @returns {Promise<Response>}
     */
  async post(request) {
    const formData = await request.formData();
    const obj = convertFormDataToObject(formData);

    if (!this.#validate(obj)) {
      return new Response(null, {
        status: httpStatusCodes.BAD_REQUEST,
        statusText: `The provided form data did not validate against the schema. Reason: ${JSON.stringify(this.#validate.errors)}`
      });
    }

    return new Response(null, {
      status: httpStatusCodes.CREATED
    });
  }
}