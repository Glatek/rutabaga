/**
 *
 * @param {string} rawSchemaId
 * @returns {string}
 */
export function schemaUrlIdToId(rawSchemaId) {
	const regex = /\/([^\/]+)\.schema\.json$/;
	const match = rawSchemaId.match(regex);

	if (match) {
		return match[1];
	}

	throw new ReferenceError(
		'Not valid schema ID. Must be URL ending with ".schema.json".',
	);
}
