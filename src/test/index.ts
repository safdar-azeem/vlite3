/**
 * @vlite3/test — Testing utilities for vlite3 components
 *
 * This package provides composable, framework-agnostic utilities for testing
 * vlite3 forms, components, and pages. It is a companion to the main `vlite3`
 * library and should be used as a dev dependency.
 *
 * Core exports:
 * - `createDataFactory` — Schema-driven mock data generation
 * - `renderVlite` — Fluent DOM wrapper around @vue/test-utils
 * - `extractSchemaFields` — Recursive schema field extractor
 *
 * @example
 * ```typescript
 * import { renderVlite, createDataFactory } from 'vlite3/test'
 * import { customerSchema } from '../schema/crm.schema'
 * import CrmCustomerForm from '../components/CrmCustomerForm.vue'
 *
 * it('fills and submits a form', async () => {
 *   const screen = await renderVlite(CrmCustomerForm, {
 *     props: { data: {} },
 *     global: { plugins: [apollo] },
 *   })
 *
 *   const mockData = createDataFactory(customerSchema)
 *   await screen.fillForm(customerSchema, mockData)
 *
 *   const { emittedPayload } = await screen.submitForm()
 *   expect(emittedPayload).toBeTruthy()
 * })
 * ```
 *
 * @packageDocumentation
 */

// ── Core utilities ──
export { createDataFactory } from './createDataFactory'
export { renderVlite } from './renderVlite'
export { VliteScreen } from './VliteScreen'
export { extractSchemaFields } from './extractSchemaFields'

// ── Types ──
export type {
  DataFactoryOptions,
  RenderVliteOptions,
  IVliteScreen,
} from './types'
