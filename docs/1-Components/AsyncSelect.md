# AsyncSelect (Async Dropdowns)

**Import:** `import { createAsyncSelect } from 'vlite3'`

Welcome to `AsyncSelect`! If you have a dropdown that needs to load data from your database (like a list of thousands of Customers or Products), standard dropdowns will slow down your app.

`AsyncSelect` solves this by creating a smart dropdown that automatically handles:

- **Pagination:** Only loads a few items at a time (infinite scroll).
- **Search:** Searches your database instantly as the user types.
- **Hydration:** Automatically fetches the correct display name if your form is initialized with just an ID.

---

## 🛠️ Step 1: Prepare Your Data Source (GraphQL Composable)

Before creating the select component, you need a GraphQL query composable. `AsyncSelect` expects your composable to accept `pagination` and `search` variables to work automatically.

Here is an example of what your generated composable should look like to be compatible:

```ts
/**
 * __useGetCrmCustomersQuery__
 *
 * @example
 * const { result, loading, error, refetch } = useGetCrmCustomersQuery({
 * pagination: { page: 1, limit: 20 },
 * search: 'John', // AsyncSelect updates this automatically when the user types
 * sort: { field: 'createdAt', order: 'DESC' },
 * filter: { status: 'ACTIVE' } // You can pass dynamic filters later
 * });
 */
```

---

## 🏗️ Step 2: Create Your Reusable Component

Instead of writing complex logic every time you need a Customer dropdown, you create it **once** using the `createAsyncSelect` factory.

Create a file (e.g., `Selects.ts`) and define your dropdowns:

```ts
// src/components/Selects.ts
import { createAsyncSelect } from 'vlite3'
import { useGetCrmCustomersQuery } from '@/graphql'

export const SelectCustomer = createAsyncSelect({
  name: 'SelectCustomer', // The name for Vue DevTools
  useQuery: useGetCrmCustomersQuery, // Your generated GraphQL hook
  queryName: 'getCrmCustomers', // The exact root key returned by your GraphQL response
  labelKey: 'name', // Which database field to show as the main text
  descriptionKey: 'email', // (Optional) Smaller text to display below the name
  iconKey: 'profilePicture', // (Optional) Avatar URL or icon string
})
```

🎉 That's it! You now have a fully functional `<SelectCustomer />` component that you can reuse anywhere in your project.

---

## 🚀 Step 3: Define Your Form Schema

You can now drop `SelectCustomer` directly into any `vlite3` Form Schema. The form will handle saving the selected `id` automatically!

**What happens here?** When the user selects "John Doe" from the dropdown, your form values will automatically update to `{ customerId: "123-abc" }`.

---

## 🖥️ Step 4: Rendering the Form & Initial Values

Now that you have your schema, pass it to the `vlite3` `<Form>` component.

If you are editing an existing record, pass the initial data to the `:values` prop. `AsyncSelect` will detect the ID (e.g., `customerId: "123-abc"`) and automatically fetch the user's name in the background so the dropdown doesn't just show a raw ID!

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vlite3'
import { SelectCustomer } from '@/components/Selects'

export const orderSchema: IForm[] = [
  {
    name: 'customerId', // This key gets saved to your form values
    label: 'Select a Customer',
    type: SelectCustomer, // 👈 Pass your new component directly here!
    required: true,
    placeholder: 'Search customers...',
  },
]
// Example: Data fetched from your API when editing an order
const initialData = ref({
  id: 'order_999',
  customerId: '123-abc', // AsyncSelect will hydrate this automatically!
})

const handleSubmit = async (payload: any) => {
  console.log('Form submitted with values:', payload.values)
  // Example output: { customerId: '123-abc', branchIds: [...] }
}
</script>

<template>
  <Form
    :schema="orderSchema"
    :values="initialData"
    submit-text="Save Order"
    @on-submit="handleSubmit" />
</template>
```

---

## 💡 Advanced Features

### 1. Selecting Multiple Items

Want to select multiple customers? Just add `multiple: true` to the props. This will turn the component into a `MultiSelect` and save an array of IDs (e.g., `['id_1', 'id_2']`).

```ts
{
  name: 'customerId',
  label: 'Select a Customer',
  type: SelectCustomer,
  props: {
    multiple: true,
  }
}
```

### 2. Dynamic Filtering (Dependent Dropdowns)

Sometimes you only want to show Contacts that belong to the selected Customer. You can pass a reactive filter using `props.filter`!

```ts
{
  name: 'contactId',
  label: 'Primary Contact',
  type: SelectContact,
  // Watch the form values and automatically filter contacts by the chosen customerId
  props: {
    filter: ({ values }) => ({ customerId: values.customerId })
  },
}
```

### 3. Auto-filling other form fields

If picking a customer should automatically fill in their billing address, use the `updateValues` hook. The `data` parameter gives you the **full database record** of the selected item.

```ts
{
  name: 'customerId',
  label: 'Customer',
  type: SelectCustomer,
  updateValues: ({ values, data }) => {
    // 'data' holds the complete customer object returned from the API
    if (data) {
      return {
        ...values,
        // Auto-fill the billing address field based on the selected customer
        billingAddress: data.billingAddress ?? values.billingAddress,
        shippingAddress: data.shippingAddress ?? values.shippingAddress,
      }
    }
    return values
  }
}
```
