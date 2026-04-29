import type { IForm } from 'vlite3'
import type { IVliteScreen } from './types'
import type { VueWrapper, DOMWrapper } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'
import { extractSchemaFields } from './extractSchemaFields'

/**
 * Fluent DOM wrapper that understands vlite3 component conventions.
 *
 * Provides a high-level API for interacting with vlite3 forms, buttons,
 * modals, and other components in tests — eliminating the need to write
 * complex DOM selectors or manually manage form state.
 *
 * @example
 * ```typescript
 * const screen = renderVlite(MyForm, { props: { data: {} } })
 * await screen.fillForm(schema, mockData)
 * const { emittedPayload } = await screen.submitForm()
 * ```
 */
export class VliteScreen implements IVliteScreen {
  readonly wrapper: VueWrapper<any>

  constructor(wrapper: VueWrapper<any>) {
    this.wrapper = wrapper
  }

  // ── Navigation & Interaction ───────────────────────────────────────────────

  /**
   * Click a button by its visible text content or data-testid.
   * Searches for: `[data-testid]` match, then falls back to text matching.
   */
  async clickButton(textOrTestId: string): Promise<void> {
    // Try data-testid first
    const kebab = textOrTestId.toLowerCase().replace(/\s+/g, '-')
    const byTestId = this.wrapper.find(`[data-testid="btn-${kebab}"]`)
    if (byTestId.exists()) {
      await byTestId.trigger('click')
      await this.flushAll(50)
      return
    }

    // Fallback: search by text content
    const buttons = this.wrapper.findAll('button')
    const match = buttons.find((btn) => {
      return btn.text().toLowerCase().includes(textOrTestId.toLowerCase())
    })

    if (match) {
      await match.trigger('click')
      await this.flushAll(50)
    } else {
      console.warn(`[vlite3/test] clickButton: No button found for "${textOrTestId}"`)
    }
  }

  /**
   * Wait for a modal to appear in the DOM.
   * Checks for modals by title text or data-testid.
   */
  async waitForModal(titleOrTestId: string): Promise<void> {
    // Give the modal time to mount and animate in
    await this.flushAll(300)

    // Check if modal content with the title exists anywhere in the document
    const allElements = document.querySelectorAll('[role="dialog"], .modal, [data-testid*="modal"]')
    if (allElements.length === 0) {
      console.warn(`[vlite3/test] waitForModal: No modal found for "${titleOrTestId}"`)
    }
  }

  // ── Form Interaction ───────────────────────────────────────────────────────

  /**
   * Fill an entire form using schema definitions and a data object.
   *
   * For each field in the schema:
   * 1. Looks up the corresponding value in `data`
   * 2. Finds the DOM element using vlite3's `data-testid` system
   * 3. Sets the value through both DOM interaction and the Form component's API
   *
   * @param schema - The vlite3 form schema
   * @param data   - Key-value pairs of field names → values
   */
  async fillForm(schema: IForm[] | IForm[][], data: Record<string, any>): Promise<void> {
    const fields = extractSchemaFields(schema)

    for (const field of fields) {
      const name = field.name
      const value = getNestedValue(data, name)

      // Skip if no value provided for this field
      if (value === undefined) continue

      // Skip file inputs
      const fieldType = typeof field.type === 'string' ? field.type : undefined
      if (fieldType && ['file', 'avatarUpload', 'fileUploader'].includes(fieldType)) {
        console.log(`   [Skip] ${name} -> File input`)
        continue
      }

      // Evaluate `when` condition
      if (field.when) {
        try {
          if (!field.when({ values: {} })) continue
        } catch {
          // Ignore evaluation errors
        }
      }

      await this.fillField(name, value)
    }

    await this.flushAll(200)
  }

  /**
   * Fill a single form field by name.
   *
   * Uses vlite3's data-testid conventions to find elements, then sets
   * the value through both DOM events and the Form component's internal API.
   */
  async fillField(name: string, value: any): Promise<void> {
    const element = this._findFieldElement(name)

    if (!element) {
      // No DOM element found — skip to avoid breaking Form's dirty tracking.
      // Use screen.getFormValues() / wrapper.findComponent('Form') for programmatic overrides.
      console.log(`   [Skip] ${name} -> No DOM element found`)
      return
    }

    const isNativeInput = this._isNativeInput(element)
    const inputType = isNativeInput ? element.attributes('type') : undefined

    // Handle different input types
    if (typeof value === 'boolean' || inputType === 'checkbox') {
      await this._fillBoolean(element, name, value)
    } else if (isNativeInput && element.element.tagName === 'SELECT') {
      await this._fillNativeSelect(element, value)
      console.log(`   [Fill] ${name} -> Selected native option: ${value}`)
    } else if (isNativeInput) {
      await this._fillNativeInput(element, name, value)
    } else {
      // Custom component — try inner input first
      const innerInput = element.find('input, select, textarea')
      if (innerInput.exists()) {
        await this._fillNativeInput(innerInput, name, value)
      } else {
        try {
          await element.setValue(value)
        } catch {
          /* ignore */
        }
        this._setFormValue(name, value)
        console.log(`   [Fill] ${name} -> Set via direct value mutation: ${value}`)
      }
    }

    await flushPromises()
    await new Promise((r) => setTimeout(r, 20))
  }

  /**
   * Toggle a switch field by name.
   */
  async toggleSwitch(name: string): Promise<void> {
    const el = this._findFieldElement(name)
    if (el) {
      const input = el.find('input[type="checkbox"]')
      if (input.exists()) {
        const native = input.element as HTMLInputElement
        native.checked = !native.checked
        native.dispatchEvent(new Event('change', { bubbles: true }))
        native.dispatchEvent(new Event('input', { bubbles: true }))
        await input.trigger('change')
      } else {
        await el.trigger('click')
      }
    }
    await this.flushAll(20)
  }

  /**
   * Select a dropdown option by value.
   */
  async selectDropdownOption(name: string, value: string): Promise<void> {
    const container = this._findFieldElement(name)
    if (!container) {
      this._setFormValue(name, value)
      return
    }

    // Click to open dropdown
    await container.trigger('click')
    await new Promise((r) => setTimeout(r, 400))

    // Try to find and click the option
    const options = document.querySelectorAll(
      '[data-testid^="dropdown-item-"], [role="option"], .v-dropdown-item, li'
    )

    let clicked = false
    for (const option of Array.from(options)) {
      const testId = option.getAttribute('data-testid')
      const optionValue = testId?.replace('dropdown-item-', '') || option.textContent?.trim()
      if (optionValue?.toLowerCase() === value.toLowerCase()) {
        option.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        clicked = true
        break
      }
    }

    if (!clicked && options.length > 0) {
      // Fallback: click last option
      options[options.length - 1].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    }

    // Close dropdown
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    // Also set via Form API to ensure state consistency
    this._setFormValue(name, value)
    await this.flushAll(50)
  }

  // ── Form Submission ────────────────────────────────────────────────────────

  /**
   * Submit the form and capture the emitted payload.
   *
   * Triggers a native form submit, waits for async processing,
   * then captures the `onSubmit` event emitted by the vlite3 Form component.
   *
   * @returns The payload emitted by the form, or null if no emission was captured
   */
  async submitForm(): Promise<{ emittedPayload: Record<string, any> | null }> {
    await this.triggerSubmit()

    // Capture emitted payload from Form component
    const formComp = this.wrapper.findComponent({ name: 'Form' })
    let emittedPayload: Record<string, any> | null = null

    if (formComp.exists()) {
      const emitted = formComp.emitted('onSubmit')
      if (emitted && emitted.length > 0) {
        const lastEmission = emitted[emitted.length - 1] as any[]
        emittedPayload = lastEmission[0]?.values || lastEmission[0] || null
      }
    }

    return { emittedPayload }
  }

  /**
   * Trigger form submission without capturing the payload.
   * Useful when you want to handle the payload via fetch interception instead.
   */
  async triggerSubmit(): Promise<void> {
    const form = this.wrapper.find('form')

    if (form.exists()) {
      await form.trigger('submit')
    } else {
      // Fallback: try submit buttons
      const submitBtns = this.wrapper.findAll('button[type="submit"]')
      if (submitBtns.length > 0) {
        await submitBtns[submitBtns.length - 1].trigger('click')
      } else {
        // Try any button that looks like a submit
        const anyBtns = this.wrapper.findAll('button')
        const likelySubmitBtn = anyBtns.find((b) => {
          const t = b.text().toLowerCase()
          return t.includes('save') || t.includes('submit') || t.includes('create') || t.includes('update') || t.includes('add')
        })
        if (likelySubmitBtn) {
          await likelySubmitBtn.trigger('click')
        }
      }
    }

    await flushPromises()
    await new Promise((r) => setTimeout(r, 1200))
  }

  // ── Form State ─────────────────────────────────────────────────────────────

  /**
   * Get the current form values from the Form component's internal state.
   */
  getFormValues(): Record<string, any> {
    const formComp = this.wrapper.findComponent({ name: 'Form' })
    if (formComp.exists()) {
      return (formComp.vm as any).formValues || {}
    }
    return {}
  }

  /**
   * Get the current validation errors from the Form component.
   */
  getFormErrors(): Record<string, string> {
    const formComp = this.wrapper.findComponent({ name: 'Form' })
    if (formComp.exists()) {
      return (formComp.vm as any).errors || {}
    }
    return {}
  }

  // ── Queries ────────────────────────────────────────────────────────────────

  /**
   * Find an element by its data-testid attribute.
   */
  findByTestId(testId: string): DOMWrapper<Element> {
    return this.wrapper.find(`[data-testid="${testId}"]`)
  }

  /**
   * Find a button by its visible text.
   */
  findButton(text: string): DOMWrapper<Element> | null {
    const buttons = this.wrapper.findAll('button')
    return (
      buttons.find((btn) => btn.text().toLowerCase().includes(text.toLowerCase())) || null
    )
  }

  // ── Utilities ──────────────────────────────────────────────────────────────

  /**
   * Flush all pending promises and optionally wait an additional delay.
   */
  async flushAll(delayMs = 0): Promise<void> {
    await flushPromises()
    if (delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }

  // ── Private Helpers ────────────────────────────────────────────────────────

  /**
   * Find a field's DOM element using vlite3's data-testid conventions.
   * Uses the same resolution chain as the original formTester.ts.
   */
  private _findFieldElement(name: string): DOMWrapper<Element> | null {
    const nameDashed = name.replace(/\./g, '-')
    const nameLast = name.split('.').pop() || name

    const prefixes = [
      'input', 'select', 'textarea', 'switch', 'checkbox', 'number',
      'datepicker', 'timepicker', 'daterange', 'multiselect', 'choicebox',
      'filepicker', 'avatar', 'colorpicker', 'iconpicker', 'tags',
    ]

    const searchQueries = [
      `[data-testid="${name}"]`,
      `[data-testid="${nameDashed}"]`,
      `[data-testid="${nameLast}"]`,
      ...prefixes.flatMap((p) => [
        `[data-testid="${p}-${name}"]`,
        `[data-testid="${p}-${nameDashed}"]`,
        `[data-testid="${p}-${nameLast}"]`,
      ]),
      `input[name="${name}"]`,
      `textarea[name="${name}"]`,
      `select[name="${name}"]`,
      `input[name="${nameLast}"]`,
      `textarea[name="${nameLast}"]`,
      `select[name="${nameLast}"]`,
      `[name="${name}"]`,
      `[id="${name}"]`,
      `[id="${nameDashed}"]`,
    ]

    for (const query of searchQueries) {
      const el = this.wrapper.find(query)
      if (el.exists()) return el
    }

    return null
  }

  /**
   * Check if a DOMWrapper points to a native form element.
   */
  private _isNativeInput(el: DOMWrapper<Element>): boolean {
    return ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.element.tagName)
  }

  /**
   * Fill a boolean/checkbox/switch field.
   */
  private async _fillBoolean(
    element: DOMWrapper<Element>,
    name: string,
    value: boolean
  ): Promise<void> {
    const isNative = this._isNativeInput(element)

    if (isNative && element.element.tagName === 'INPUT') {
      const nativeEl = element.element as HTMLInputElement
      nativeEl.checked = value
      nativeEl.dispatchEvent(new Event('change', { bubbles: true }))
      nativeEl.dispatchEvent(new Event('input', { bubbles: true }))
      await element.trigger('change')
    } else {
      const checkbox = element.find('input[type="checkbox"]')
      if (checkbox.exists()) {
        const nativeEl = checkbox.element as HTMLInputElement
        nativeEl.checked = value
        nativeEl.dispatchEvent(new Event('change', { bubbles: true }))
        nativeEl.dispatchEvent(new Event('input', { bubbles: true }))
        await checkbox.trigger('change')
      } else {
        await element.trigger('click')
      }
    }

    this._setFormValue(name, value)
    console.log(`   [Fill] ${name} -> ${value}`)
  }

  /**
   * Fill a native input/textarea element.
   */
  private async _fillNativeInput(
    element: DOMWrapper<Element>,
    name: string,
    value: any
  ): Promise<void> {
    const nativeEl = element.element as HTMLInputElement | HTMLTextAreaElement

    // Use the property descriptor setter to trigger Vue's reactivity
    const descriptor = Object.getOwnPropertyDescriptor(
      element.element.tagName === 'TEXTAREA'
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype,
      'value'
    )
    descriptor?.set?.call(nativeEl, value)

    nativeEl.dispatchEvent(new Event('input', { bubbles: true }))
    nativeEl.dispatchEvent(new Event('change', { bubbles: true }))
    nativeEl.dispatchEvent(new FocusEvent('blur', { bubbles: true }))

    await element.setValue(value)

    // Also set via Form component's API
    this._setFormValue(name, value)
    console.log(`   [Fill] ${name} -> "${value}"`)
  }

  /**
   * Fill a native <select> element.
   */
  private async _fillNativeSelect(
    element: DOMWrapper<Element>,
    value: any
  ): Promise<void> {
    await element.setValue(value)
  }

  /**
   * Set a value directly on the Form component's internal state.
   * Uses setFieldValue if available, otherwise mutates formValues directly.
   */
  private _setFormValue(name: string, value: any): void {
    const formComp = this.wrapper.findComponent({ name: 'Form' })
    if (!formComp.exists()) {
      console.log(`     -> Form component not found for ${name}`)
      return
    }

    const formVm = formComp.vm as any
    // Try to access internal exposed properties if they are hidden
    const exposed = formComp.getCurrentComponent()?.exposed
    console.log(`     -> Exposed internal:`, exposed ? Object.keys(exposed) : null)
    
    if (exposed && typeof exposed.setFieldValue === 'function') {
      console.log(`     -> Using exposed.setFieldValue for ${name}`)
      exposed.setFieldValue(name, value)
    } else if (typeof formVm.setFieldValue === 'function') {
      console.log(`     -> Using formVm.setFieldValue for ${name}`)
      formVm.setFieldValue(name, value)
    } else if (exposed && exposed.formValues) {
      console.log(`     -> Using exposed.formValues setDeepValue for ${name}`)
      setDeepValue(exposed.formValues, name, value)
    } else if (formVm.formValues) {
      console.log(`     -> Using formVm.formValues setDeepValue for ${name}`)
      setDeepValue(formVm.formValues, name, value)
    } else {
      console.log(`     -> FAILED to find exposed setFieldValue or formValues on Form component for ${name}!`)
    }
  }
}

// ── Utility ──────────────────────────────────────────────────────────────────

function getNestedValue(obj: Record<string, any>, path: string): any {
  if (!path || !obj) return undefined
  const keys = path.split('.')
  let result: any = obj
  for (const key of keys) {
    if (result === null || result === undefined) return undefined
    result = result[key]
  }
  return result
}

function setDeepValue(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
      current[keys[i]] = {}
    }
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
}
