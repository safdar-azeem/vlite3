# @vlite3/test

A standalone, framework-agnostic testing SDK designed to provide a modular, zero-boilerplate testing architecture for applications built with `vlite3`.

This package decouples testing orchestration from application-specific business logic (like Apollo clients or authentication). It provides robust utilities to automatically render your forms, generate schema-driven mock data, simulate user interactions seamlessly through complex custom components, and optionally intercept network requests to test against a live backend API.

## Features

- **Schema-Driven Data Factory**: Automatically generates comprehensive, valid mock data using your `vlite3` form schema definitions.
- **Fluent DOM API (`VliteScreen`)**: A specialized wrapper over `@vue/test-utils` tailored specifically for `vlite3` components. It handles the nuances of interacting with complex, stylized UI widgets via deep programmatic state manipulation (`defineExpose`), completely bypassing proxy issues in production builds.
- **Network Interception & Safety Nets**: Easily hook into your application's `fetch` logic to spy on payloads and validate GraphQL/REST API responses dynamically.
- **Framework Agnostic**: Integrates cleanly into any project relying on `vlite3`, regardless of their preferred global state management, router, or API client.

## Installation

Install the package as a dev dependency alongside `vlite3`.

```bash
# with yarn
yarn add -D vlite3-test

# with npm
npm install --save-dev vlite3-test
```

> **Note:** Make sure you have `vitest` and `@vue/test-utils` installed in your project as well.

## Core Concepts

### 1. `createFormTestSuite`
The `createFormTestSuite` is the core test factory. Instead of manually mounting, locating inputs, filling them out, and triggering submits, you pass your component and schema to the test suite and let it handle the boilerplate.

### 2. `createDataFactory`
If you need custom generated data without using the full suite, the `createDataFactory` consumes a nested `vlite3` form schema and spits out an object populated with mock data (e.g. strings, formatted emails, dates, booleans, and related custom field models).

## Setting Up Your Project

To maximize reusability in your specific application, create a thin wrapper around `createFormTestSuite`. This wrapper will automatically inject your app's global context (like Apollo GraphQL providers, Vue Router, and Auth).

**`src/tests/createFormTest.ts`**
```typescript
import { createFormTestSuite } from 'vlite3-test'
import { apollo } from '@/config/apollo.config' // Your Apollo/REST client
import { authenticateTest } from './authHelper' // Your Auth setup

export function createFormTest(suiteName: string, options: any) {
  return createFormTestSuite(suiteName, {
    ...options,
    // Provide plugins your application relies on globally
    globalPlugins: [apollo],
    globalStubs: {
      RouterLink: true,
      // Add other global stubs here
    },
    // Optional: Inject your authentication logic before tests run
    onBeforeSubmit: async () => {
      await authenticateTest()
    }
  })
}
```

## Writing Tests

Once you have your wrapper, writing an integration test is effortless. Simply call the factory, providing the component, its schema, and an API endpoint to listen for.

**`ExampleForm.test.ts`**
```typescript
import { createFormTest } from './createFormTest'
import ExampleForm from '../components/ExampleForm.vue'
import { exampleSchema } from '../schema/example.schema'

createFormTest('ExampleForm.vue Integration Test', {
  component: ExampleForm,
  schema: exampleSchema,
  // The GraphQL operation or REST endpoint to intercept
  operationName: 'CreateExampleRecord',
  // Test both creation and update flows effortlessly
  flows: ['CREATE', 'UPDATE'],
  
  // Need to customize the schema-generated data?
  overrides: {
    CREATE: {
      email: 'test_user@example.com', // Override the random email
      status: 'ACTIVE'
    },
    UPDATE: {
      description: 'Updated descriptions via Integration Test'
    }
  }
})
```

## Under the Hood: `VliteScreen`
When tests are running, the SDK uses `VliteScreen` to interact with the DOM.
Because complex UI components (like Custom Selects, DatePickers, and File Uploaders) don't always use native DOM inputs, `VliteScreen` intelligently falls back to Vue's `defineExpose` API. If it can't interact with a native input natively, it programmatically injects the state using exposed internal component methods (like `setFieldValue`), guaranteeing test stability across all browsers and build types.
