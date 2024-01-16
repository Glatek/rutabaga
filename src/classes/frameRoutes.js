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
    const requiredProperties = [...(this.#schema.required || [])];
    const formElements = Object.entries(this.#schema.properties)
      .filter(([propertyName, property]) => {
        return !property.$comment || (property.$comment && !property.$comment.includes('readOnly'));
      }).map(([propertyName, property]) => {
        let inputType;

        switch (property.type) {
          case 'integer':
            inputType = 'number';
            break;
          default:
            inputType = 'text';
            break;
        }

        switch (property.format) {
          case 'date-time':
            inputType = 'date';
            break;
          default:
            break;
        }

        const attributes = [];

        attributes.push(`type="${inputType}"`);
        attributes.push(`name="${propertyName}`);

        if (requiredProperties.includes(propertyName)) {
          attributes.push('required');
        }



        return html`<input ${attributes.join(' ')} />`;
      })
      .join('');

    const body = html`<form>${formElements}</form>`;

    return new Response(body, {
      headers: new Headers({
        'content-type': 'text/html'
      }),
      status: httpStatusCodes.OK
    });
  }
}