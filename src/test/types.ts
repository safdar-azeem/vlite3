import type { IForm } from '../components/Form/types'
import type { Component } from 'vue'
import type { VueWrapper, DOMWrapper } from '@vue/test-utils'

// ─── Data Factory ──────────────────────────────────────────────────────────────

export interface DataFactoryOptions {
  /** Override specific fields — these take priority over auto-generated values */
  overrides?: Record<string, any>
  /** Unique suffix for generated strings (auto-generated if not provided) */
  uniqueId?: string
  /** Whether to evaluate `when` conditions (default: false — generate all fields) */
  evaluateConditions?: boolean
  /** Form values context for evaluating `when` conditions */
  valuesContext?: Record<string, any>
}

// ─── Render Options ────────────────────────────────────────────────────────────

export interface RenderVliteOptions {
  /** Props to pass to the component */
  props?: Record<string, any>
  /** Global mount options (plugins, mocks, stubs, etc.) */
  global?: Record<string, any>
  /** Delay in ms after mount before returning (default: 250) */
  mountDelay?: number
}

// ─── VliteScreen ───────────────────────────────────────────────────────────────

export interface IVliteScreen {
  /** The underlying @vue/test-utils wrapper */
  readonly wrapper: VueWrapper<any>

  // ── Navigation & Interaction ──
  clickButton(textOrTestId: string): Promise<void>
  waitForModal(titleOrTestId: string): Promise<void>

  // ── Form Interaction ──
  fillForm(schema: IForm[] | IForm[][], data: Record<string, any>): Promise<void>
  fillField(name: string, value: any): Promise<void>
  toggleSwitch(name: string): Promise<void>
  selectDropdownOption(name: string, value: string): Promise<void>

  // ── Form Submission ──
  submitForm(): Promise<{ emittedPayload: Record<string, any> | null }>
  triggerSubmit(): Promise<void>

  // ── Form State ──
  getFormValues(): Record<string, any>
  getFormErrors(): Record<string, string>

  // ── Queries ──
  findByTestId(testId: string): DOMWrapper<Element>
  findButton(text: string): DOMWrapper<Element> | null

  // ── Utilities ──
  flushAll(delayMs?: number): Promise<void>
}
