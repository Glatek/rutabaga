/**
   * @param {string} str
   * @returns {boolean}
   */
export const stringIsDate = str => /^\d{4}-\d{2}-\d{2}$/.test(str);

/**
 * @param {string} str
 * @returns {boolean}
 */
export const stringIsNumber = str => /^-?\d*\.?\d+$/.test(str);

/**
 * @param {string} str
 * @returns {boolean}
 */
export const stringIsBoolean = str => /^(true|false)$/i.test(str);
