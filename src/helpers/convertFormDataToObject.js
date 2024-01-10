import { stringIsBoolean, stringIsNumber, stringIsDate } from "./stringIs.js";

/**
 * @param {FormData} formData
 * @return {object}
 */
export function convertFormDataToObject(formData) {
  const finalObject = {};

  for (const entry of formData.entries()) {
    const [entryKey, entryValue] = entry;

    /** @type {string | number | Boolean} */
    let value = String(entryValue);

    if (typeof value === 'string' && stringIsDate(value)) {
      value = new Date(value).toISOString();
    }

    if (typeof value === 'string' && stringIsBoolean(value)) {
      value = Boolean(value);
    }

    if (typeof value === 'string' && stringIsNumber(value)) {
      value = value.includes('.') ? parseFloat(value) : parseInt(value, 10);
    }

    finalObject[entryKey] = value;
  }

  return finalObject;
}