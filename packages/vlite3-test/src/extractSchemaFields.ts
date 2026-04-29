import type { IForm } from 'vlite3'

/**
 * Recursively extracts all individual field definitions from a complex
 * nested vlite3 schema structure.
 *
 * Handles:
 * - Flat arrays: `IForm[]`
 * - Grouped arrays: `IForm[][]`
 * - Nested structures: `fields`, `children`, `tabs`, `steps`, `schema`
 *
 * @param schema - Any level of a vlite3 schema hierarchy
 * @returns A flat list of all individual field definitions
 */
export function extractSchemaFields(schema: any): IForm[] {
  let fields: IForm[] = []

  if (Array.isArray(schema)) {
    for (const item of schema) {
      fields = fields.concat(extractSchemaFields(item))
    }
  } else if (schema && typeof schema === 'object') {
    // If it has a `name`, it's a field definition
    if (schema.name) fields.push(schema)

    // Recurse into known nesting keys
    if (schema.fields) fields = fields.concat(extractSchemaFields(schema.fields))
    if (schema.children) fields = fields.concat(extractSchemaFields(schema.children))
    if (schema.tabs) fields = fields.concat(extractSchemaFields(schema.tabs))
    if (schema.steps) fields = fields.concat(extractSchemaFields(schema.steps))
    if (schema.schema) fields = fields.concat(extractSchemaFields(schema.schema))
  }

  return fields
}
