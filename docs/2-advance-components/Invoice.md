# Invoice Component

**Import:** `import { Invoice } from 'vlite3'`

### Description

A versatile, full-featured invoice and receipt component for Vue 3. It supports 4 distinct visual variants ranging from enterprise-grade documents to compact POS-style thermal receipts. The component is fully typed and integrates seamlessly with `Price`, `DateTime`, `Barcode`, and `QRCode` utilities.

---

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `InvoiceData` | **Required** | The complete invoice data object (brand, customer, items, totals). |
| `variant` | `InvoiceVariant` | `'Variant1'` | selects the visual style: `'Variant1'`, `'Variant2'`, `'Variant3'`, or `'Variant4'`. |
| `compact` | `boolean` | `false` | When `true`, reduces padding, spacing, and font sizes for a print-friendly layout. |

---

### Data Models

#### `InvoiceData` Shape

| Property | Type | Description |
| :--- | :--- | :--- |
| `brandTitle` | `string?` | Display title e.g. "INVOICE", "RECEIPT", "QUOTATION". |
| `brandName` | `string?` | Legal entity or brand name issuing the document. |
| `brandLogo` | `string?` | URL to the brand's logo image. |
| `companyInfo` | `InvoiceCompanyInfo?` | Issuer's address, contact, and tax details. |
| `customerInfo` | `InvoiceCustomerInfo?` | Recipient's address, contact, and tax details. |
| `invoiceNumber` | `string` | **Required.** Unique document identifier. |
| `status` | `string?` | Current status (e.g., "Paid", "Pending", "Draft"). |
| `issuedDate` | `string \| Date?` | Date of issuance (formatted via `DateTime`). |
| `dueDate` | `string \| Date?` | Payment due date (formatted via `DateTime`). |
| `items` | `InvoiceLineItem[]` | **Required.** List of products or services provided. |
| `totals` | `InvoiceTotal[]` | **Required.** Financial summary rows (Subtotal, Tax, Total). |
| `barcode` | `string?` | Content for an embedded CODE128 barcode. |
| `qrcode` | `string?` | Content for an embedded QR code (e.g., payment link). |
| `notes` | `string?` | Additional memo or terms for the recipient. |
| `footerText` | `string?` | Legal footer or "Thank you" message. |

#### `InvoiceLineItem` Shape

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string \| number` | Unique identifier for the item. |
| `name` | `string` | **Required.** Product or service name. |
| `sku` | `string?` | Product SKU or code. |
| `thumbnail` | `string?` | URL for the item's thumbnail image. |
| `description` | `string?` | Extended details (hidden in ultra-compact views). |
| `size` | `string?` | Variation details (e.g. "Blue", "XL", "L"). |
| `quantity` | `number` | **Required.** Number of units. |
| `price` | `number` | **Required.** Unit price. |
| `discount` | `number?` | Deductible amount for this specific line item. |
| `discountLabel` | `string?` | Label for the line discount (e.g. "10% OFF"). |
| `total` | `number` | **Required.** Line total (usually `(qty * price) - discount`). |

---

### Visual Variants

| Variant | Name | Best For |
| :--- | :--- | :--- |
| `Variant1` | **Enterprise** | Formal business-to-business invoices with full branding. |
| `Variant2` | **POS Receipt** | Retail/Restaurant thermal receipts. Compact vertical layout. |
| `Variant3` | **E-commerce** | Modern packing slips or digital order confirmations. |
| `Variant4` | **Modern Hero** | Bold, vibrant design for creative agencies or modern SaaS billing. |

---

### Implementation Examples

#### 1. Standard Sales Invoice (Variant 1)

```vue
<script setup>
import { Invoice } from 'vlite3'

const invoiceData = {
  brandName: 'Acme Corp.',
  invoiceNumber: 'INV-001',
  items: [
    { name: 'SaaS Subscription', quantity: 1, price: 99, total: 99 }
  ],
  totals: [
    { label: 'Total', value: 99, isGrandTotal: true }
  ]
}
</script>

<template>
  <Invoice :data="invoiceData" variant="Variant1" />
</template>
```

#### 2. POS Thermal Receipt (Variant 2)

```vue
<template>
  <!-- Variant 2 follows a narrow vertical layout optimized for small thermal prints -->
  <Invoice :data="posData" variant="Variant2" />
</template>
```

#### 3. Professional Service with Discounts (Variant 4)

```vue
<script setup>
const serviceData = {
  brandTitle: 'Service Invoice',
  items: [
    { 
      name: 'UI Design', 
      quantity: 1, 
      price: 1500, 
      discount: 150, 
      discountLabel: 'Partner Promo', 
      total: 1350 
    }
  ],
  totals: [
    { label: 'Subtotal', value: 1500, isSubtotal: true },
    { label: 'Discount', value: -150, isDiscount: true },
    { label: 'Grand Total', value: 1350, isGrandTotal: true }
  ]
}
</script>

<template>
  <Invoice :data="serviceData" variant="Variant4" />
</template>
```

---

### Printing Best Practices

When rendering for print or PDF generation, use the `compact` prop to ensure the document fits perfectly on a single page by reducing extraneous white space.

```vue
<template>
  <Invoice :data="data" compact />
</template>
```

---

### Senior Engineer's Notes (Best Practices)

1.  **Status Colors**: The component uses `getStatusColorClass` internally. Supported statuses like "Paid", "Pending", "Overdue", and "Cancelled" will automatically receive appropriate semantic coloring (green, yellow, red, etc.).
2.  **Explicit Totals**: The component does not calculate totals automatically to allow for backend-driven precision. Ensure your `totals` array matches your line items exactly.
3.  **Adaptive Columns**: Columns like `Size` and `Discount` only appear in the table if at least one item in the `items` array contains that property. This keeps standard invoices clutter-free.
4.  **Logo Strategy**: For `Variant4` (Hero), ensure high-quality, transparent logos are used as they overlay a prominent header background.
5.  **Barcodes & QR Codes**: Use `qrcode` for "Scan to Pay" links and `barcode` for internal picking/warehouse routing references.
