import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import { renderVlite } from './renderVlite'
import { createDataFactory } from './createDataFactory'
import type { FormTestSuiteOptions } from './types'

/**
 * Creates a complete integration test suite for a vlite3 form component.
 *
 * Uses `@vlite3/test` for schema-driven data generation and fluent DOM
 * interaction, combined with a generic fetch interceptor to capture
 * and validate network interactions.
 *
 * Supports both GraphQL (default) and REST API network interception.
 */
export function createFormTestSuite(suiteName: string, options: FormTestSuiteOptions) {
  describe(suiteName, () => {
    let fetchSpy: any
    let capturedRequest: any
    let capturedResponse: any

    const networkType = options.network?.type || 'graphql'
    const matchEndpoint = options.network?.endpoint || ''

    beforeAll(async () => {
      if (options.setupSuite) {
        await options.setupSuite()
      }
    })

    beforeEach(() => {
      capturedRequest = null
      capturedResponse = null

      const originalFetch = global.fetch
      fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async (input, init) => {
        const urlStr = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : (input as any).url || '')
        
        // Filter by endpoint if provided
        if (matchEndpoint && !urlStr.includes(matchEndpoint)) {
          return originalFetch(input, init)
        }

        let isMatch = false
        let parsedBody: any = null

        if (init?.body && typeof init.body === 'string') {
          try {
            parsedBody = JSON.parse(init.body)
          } catch (e) {}
        }

        if (options.network?.matchRequest) {
          isMatch = options.network.matchRequest(urlStr, init, parsedBody)
        } else {
          // Default matchers
          if (networkType === 'graphql') {
            if (parsedBody && parsedBody.query && parsedBody.query.includes('mutation')) {
              isMatch = true
              capturedRequest = parsedBody
            }
          } else {
            // REST: Check for POST, PUT, PATCH
            const method = (init?.method || '').toUpperCase()
            if (['POST', 'PUT', 'PATCH'].includes(method)) {
              isMatch = true
              capturedRequest = { url: urlStr, method, body: parsedBody }
            }
          }
        }

        if (isMatch && options.network?.matchRequest) {
           capturedRequest = { url: urlStr, method: init?.method, body: parsedBody }
        }

        const response = await originalFetch(input, init)

        if (isMatch && !capturedResponse) {
          const clonedResponse = response.clone()
          try {
            capturedResponse = await clonedResponse.json()
          } catch (e) {
             try {
                capturedResponse = await clonedResponse.text()
             } catch(e2) {}
          }
        }
        return response
      })
    })

    afterEach(() => {
      fetchSpy?.mockRestore()
    })

    const triggerFormSubmit = async (screen: any, flowName: string) => {
      await screen.triggerSubmit()

      console.log(`\n========================================================`)
      console.log(`🚀 FLOW: [${flowName}] ${suiteName}`)
      console.log(`--------------------------------------------------------`)

      if (capturedRequest) {
        console.log(`🟢 SUCCESS: Network Request Captured!`)
        const logPayload = networkType === 'graphql' ? capturedRequest.variables || capturedRequest : capturedRequest;
        console.log(`\n📦 Payload Sent to API:\n\x1b[36m${JSON.stringify(logPayload, null, 2)}\x1b[0m`)
        if (capturedResponse?.errors) {
          console.log(`\n❌ API Returned Error:\n\x1b[31m${JSON.stringify(capturedResponse.errors, null, 2)}\x1b[0m`)
        } else {
          const logResponse = networkType === 'graphql' ? capturedResponse?.data || capturedResponse : capturedResponse;
          console.log(`\n✅ API Response:\n\x1b[32m${JSON.stringify(logResponse, null, 2)}\x1b[0m`)
        }
      } else {
        console.log(`🔴 BLOCKED: No Network Request Fired.`)

        // Try direct function call on the wrapper
        const wrapper = screen.wrapper
        const formComp = wrapper.findComponent({ name: 'Form' })
        const rootVm = wrapper.vm as any

        console.log(`   [Action] Attempting direct function call...`)
        try {
          if (formComp.exists() && typeof (formComp.vm as any).handleSubmit === 'function') {
            await (formComp.vm as any).handleSubmit()
          } else if (typeof rootVm.submit === 'function') {
            await rootVm.submit()
          } else if (typeof rootVm.onSubmit === 'function') {
            await rootVm.onSubmit()
          } else if (typeof rootVm.save === 'function') {
            await rootVm.save()
          }
        } catch (e) {}

        await screen.flushAll(800)

        if (capturedRequest) {
          console.log(`🟢 SUCCESS (Via Direct Function Call): Network Request Captured!`)
          const logPayload = networkType === 'graphql' ? capturedRequest.variables || capturedRequest : capturedRequest;
          console.log(`\n📦 Payload Sent to API:\n\x1b[36m${JSON.stringify(logPayload, null, 2)}\x1b[0m`)
          if (capturedResponse?.errors) {
            console.log(`\n❌ API Returned Error:\n\x1b[31m${JSON.stringify(capturedResponse.errors, null, 2)}\x1b[0m`)
          } else {
            const logResponse = networkType === 'graphql' ? capturedResponse?.data || capturedResponse : capturedResponse;
            console.log(`\n✅ API Response:\n\x1b[32m${JSON.stringify(logResponse, null, 2)}\x1b[0m`)
          }
        } else {
          const errorElements = wrapper.findAll('.text-danger, .text-destructive, .text-red-500, [role="alert"], .error-message')
          const errorTexts = errorElements.map((e: any) => e.text()).filter((t: string) => t.trim().length > 0)

          if (errorTexts.length > 0) {
            console.log(`\n🛑 UI Validation Errors Found in DOM:\n\x1b[31m${JSON.stringify(errorTexts, null, 2)}\x1b[0m`)
          } else {
            console.log(`\n⚠️ No visible error text found in DOM. The form might be silently failing.`)
          }
        }
      }
      console.log(`========================================================\n`)
    }

    const validateResponse = () => {
      expect(capturedRequest, 'Expected a network request to be sent to the API').toBeTruthy()
      expect(capturedResponse, 'Expected an API response to be received').toBeTruthy()
      
      if (options.network?.validate) {
        options.network.validate(capturedRequest, capturedResponse)
      } else if (networkType === 'graphql') {
        expect(capturedResponse.errors, 'API should not return GraphQL errors').toBeFalsy()
      }
    }

    // ── CREATE Test ──
    if (!options.updateOnly) {
      it('Submits a CREATE flow against the REAL API', async () => {
        const { props: customProps, mocks: customMocks, ...restGlobals } = options.globalOptions || {}

        const screen = await renderVlite(options.component, {
          props: { data: {}, ...customProps },
          global: {
            ...restGlobals,
            mocks: {
              $route: { params: {}, query: {} },
              $router: { push: vi.fn(), replace: vi.fn() },
              ...customMocks,
            },
          },
        })

        console.log(`\n🤖 Auto-filling CREATE form for ${suiteName}...`)

        const mockData = createDataFactory(options.schema, {
          overrides: options.overrides,
        })

        await screen.fillForm(options.schema, mockData)
        await triggerFormSubmit(screen, 'CREATE')
        validateResponse()
      }, 25000)
    }

    // ── UPDATE Test ──
    if (options.updateData) {
      it('Submits an UPDATE flow against the REAL API', async () => {
        const { props: customProps, mocks: customMocks, ...restGlobals } = options.globalOptions || {}

        let resolvedUpdateData = options.updateData
        if (typeof options.updateData === 'function') {
          resolvedUpdateData = await options.updateData()
        }

        const routeMock = {
          params: resolvedUpdateData?.id ? { id: resolvedUpdateData.id } : {},
          query: {},
        }

        const screen = await renderVlite(options.component, {
          props: { ...customProps, data: resolvedUpdateData },
          global: {
            ...restGlobals,
            mocks: {
              $route: routeMock,
              $router: { push: vi.fn(), replace: vi.fn() },
              ...customMocks,
            },
          },
        })

        console.log(`\n🤖 Auto-filling UPDATE form for ${suiteName}...`)

        const mockData = createDataFactory(options.schema, {
          overrides: options.overrides,
        })

        await screen.fillForm(options.schema, mockData)
        await triggerFormSubmit(screen, 'UPDATE')
        validateResponse()
      }, 25000)
    }
  })
}
