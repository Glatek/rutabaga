const httpStatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 402,
};

export class FrameRoutes {
  /** @type {import('dexie').Dexie} */
  #dataBase;

  /** @type {import('ajv/lib/types/json-schema.js').SomeJSONSchema} */
  #schema;

  /**
   *
   * @param {import('dexie').Dexie} dataBase
   * @param {import('ajv/lib/types/json-schema.js').SomeJSONSchema} schema
   */
  constructor(dataBase, schema) {
    this.#dataBase = dataBase;
    this.#schema = schema;
  }

  /**
   * @param {Request} request
   * @returns {Promise<Response>}
   */
  async get(request) {
    const html = String.raw;
    const body = html`
      <form>

      </form>
    `;

    return new Response(body, {
      headers: new Headers({
        'content-type': 'text/html'
      }),
      status: httpStatusCodes.OK
    });
  }
}