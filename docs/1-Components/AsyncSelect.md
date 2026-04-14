# AsyncSelect

**Import:** `import { createAsyncSelect } from 'vlite3'`

The `AsyncSelect` module provides a factory function (`createAsyncSelect`) that generates highly reusable, paginated, and searchable dropdown components powered by asynchronous queries (such as Apollo GraphQL composables).

---

## Expected Composable Structure

For `createAsyncSelect` to work correctly and automatically handle remote states, your query composable must accept specific variable structures. At a minimum, your composable should support `pagination` and `search`. To unlock the full power of dynamic dependencies in forms, it should also support `sort` and `filter`.

```ts
/**
 * __useGetCrmCustomersQuery__
 *
 * @example
 * const { result, loading, error, refetch } = useGetCrmCustomersQuery({
 * pagination: { page: 1, limit: 20 },
 * search: 'acme', // Handled automatically during user typing
 * sort: { field: 'createdAt', order: 'DESC' },
 * filter: { status: 'ACTIVE' } // Can be passed via schema props
 * });
 */
```

---

## Creating an Async Select Component

Use the factory function to generate your custom select component bound strictly to your specific data entity and query. You only need to do this once per entity type.

```ts
// src/components/Selects.ts
import { createAsyncSelect } from 'vlite3'
import { useGetCrmCustomersQuery, useGetHrmBranchesQuery } from '@/graphql'

export const SelectCustomer = createAsyncSelect({
  name: 'SelectCustomer',
  useQuery: useGetCrmCustomersQuery, // Your generated composable
  queryName: 'getCrmCustomers', // The root key in the GraphQL response
  labelKey: 'name', // Field to use as the main display label
  descriptionKey: 'email', // Optional sub-text shown below the label
  iconKey: 'profilePicture', // Optional icon or avatar URL
})
```

---

## Usage in Form Schemas

Once generated, you can pass these select components directly into your `vlite3` form schemas. The `Form` component handles value binding (`v-model`), validation, and layout automatically.

The `AsyncSelect` will independently manage:

- Remote debounced search
- Infinite scroll pagination
- Missing ID hydration (fetching the full label if the form is initialized with just an `id`)

```ts
import type { IForm } from 'vlite3'
import { SelectCustomer, SelectBranch } from '@/components/Selects'

export const orderSchema: IForm[] = [
  {
    name: 'customerId',
    label: 'Customer',
    type: SelectCustomer, // Pass the component directly, NOT a string
    required: true,
    placeholder: 'Search for a customer...',
  },
]
```

### Passing Dynamic Filters

You can pass filters dynamically based on other form values using the `props.filter` configuration.

```ts
{
  name: 'contactId',
  label: 'Primary Contact',
  type: SelectContact,
  props: {
    // Dynamically filter contacts by the currently selected customer
    filter: ({ values }) => ({ customerId: values.customerId })
  },
}
```

### Accessing Full Row Data (`updateValues`)

If you need to auto-populate other form fields based on the selected object, use the `updateValues` lifecycle hook. The `data` property provided in the argument contains the complete raw object returned from your API.

```ts
{
  name: 'customerId',
  label: 'Customer',
  type: SelectCustomer,
  updateValues: ({ values, data }) => {
    // `data` is the complete customer object selected by the user
    if (data) {
      return {
        ...values,
        // Auto-fill addresses based on the selected customer
        billingAddress: data.billingAddress ?? values.billingAddress,
        shippingAddress: data.shippingAddress ?? values.shippingAddress,
      }
    }
    return values
  }
}
```
