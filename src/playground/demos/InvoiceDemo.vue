<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import { Invoice } from '@/components/Invoice'
import type { InvoiceVariant, InvoiceData } from '@/components/Invoice'
import sourceCode from './InvoiceDemo.vue?raw'

// ──────────────────────────────────────────────────────────────────────────────
// Active variant selector
// ──────────────────────────────────────────────────────────────────────────────
const selectedVariant = ref<InvoiceVariant>('Variant1')

const variants: { value: InvoiceVariant; label: string; description: string }[] = [
  { value: 'Variant1', label: 'Variant 1 — Enterprise', description: 'Modern two-column with full brand header' },
  { value: 'Variant2', label: 'Variant 2 — POS Receipt', description: 'Compact thermal-print style receipt' },
  { value: 'Variant3', label: 'Variant 3 — Compact Table', description: 'E-commerce packing slip with tight layout' },
  { value: 'Variant4', label: 'Variant 4 — Bold Brand', description: 'Vibrant gradient hero header invoice' },
]

// ──────────────────────────────────────────────────────────────────────────────
// Sample data – Sales Invoice (default)
// ──────────────────────────────────────────────────────────────────────────────
const salesInvoice: InvoiceData = {
  brandTitle: 'Invoice',
  brandName: 'Acme Corp.',
  brandLogo: '',
  companyInfo: {
    name: 'Acme Corp.',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    country: 'United States',
    email: 'billing@acmecorp.com',
    phone: '+1 (555) 000-1234',
    taxId: 'US-482701234',
  },
  invoiceNumber: 'INV-2024-00143',
  status: 'Paid',
  issuedDate: new Date('2024-07-01'),
  dueDate: new Date('2024-07-31'),
  customerInfo: {
    name: 'John D. Mitchell',
    address: '1600 Pennsylvania Ave NW',
    city: 'Washington',
    state: 'DC',
    zip: '20500',
    country: 'United States',
    email: 'john.mitchell@example.com',
    phone: '+1 (555) 987-6543',
  },
  items: [
    { id: 1, name: 'Pro License — Annual', description: 'Full access to all premium features for 12 months.', quantity: 2, price: 599, total: 1198 },
    { id: 2, name: 'Onboarding & Setup', description: 'Dedicated support and configuration assistance.', quantity: 1, price: 299, total: 299 },
    { id: 3, name: 'API Enterprise Add-on', description: 'Unlimited API calls with dedicated throughput.', quantity: 1, price: 199, total: 199 },
  ],
  totals: [
    { label: 'Subtotal', value: 1696, isSubtotal: true },
    { label: 'Discount (5%)', value: -84.8, isDiscount: true },
    { label: 'Tax (GST 10%)', value: 161.12, isTax: true },
    { label: 'Grand Total', value: 1772.32, isGrandTotal: true },
  ],
  qrcode: 'https://acmecorp.com/invoice/INV-2024-00143',
  barcode: 'INV-2024-00143',
  notes: 'Payment received. Thank you for choosing Acme Corp.!\nFor questions, contact billing@acmecorp.com.',
  footerText: 'Acme Corp. · All prices in USD · Payment terms: Net 30',
}

// ──────────────────────────────────────────────────────────────────────────────
// Sample data – POS / Restaurant Receipt
// ──────────────────────────────────────────────────────────────────────────────
const posInvoice: InvoiceData = {
  brandTitle: 'Receipt',
  brandName: "Bella Vista Café",
  companyInfo: {
    name: "Bella Vista Café",
    address: '34 Sunset Blvd, Suite 12',
    city: 'Los Angeles',
    state: 'CA',
    phone: '+1 (310) 555-8899',
    taxId: 'CA-99012345',
  },
  invoiceNumber: 'RCP-000892',
  status: 'Completed',
  issuedDate: new Date(),
  customerInfo: {
    name: 'Walk-in Customer',
    email: '',
  },
  items: [
    { id: 1, name: 'Margherita Pizza (L)', quantity: 1, price: 18.5, total: 18.5 },
    { id: 2, name: 'Pasta Carbonara', quantity: 2, price: 14.0, total: 28.0 },
    { id: 3, name: 'Tiramisu', quantity: 2, price: 7.5, total: 15.0 },
    { id: 4, name: 'Sparkling Water (500ml)', quantity: 4, price: 3.0, total: 12.0 },
  ],
  totals: [
    { label: 'Subtotal', value: 73.5, isSubtotal: true },
    { label: 'Service Charge (10%)', value: 7.35, isTax: true },
    { label: 'Total', value: 80.85, isGrandTotal: true },
  ],
  qrcode: 'https://bellavistacafe.com/receipt/RCP-000892',
  barcode: 'RCP000892',
  notes: 'Thank you for dining with us! ♡',
  footerText: 'bellavistacafe.com · Open 7 days · 10am – 11pm',
}

// ──────────────────────────────────────────────────────────────────────────────
// Sample data – E-commerce / Purchase Order
// ──────────────────────────────────────────────────────────────────────────────
const ecomInvoice: InvoiceData = {
  brandTitle: 'Purchase Order',
  brandName: 'TechHub Store',
  companyInfo: {
    name: 'TechHub Online Retail',
    address: 'PO Box 4040',
    city: 'Austin',
    state: 'TX',
    zip: '73301',
    country: 'USA',
    email: 'orders@techhub.store',
    website: 'https://techhub.store',
  },
  invoiceNumber: 'PO-20240715-0028',
  status: 'Processing',
  issuedDate: new Date('2024-07-15'),
  dueDate: new Date('2024-07-22'),
  customerInfo: {
    name: 'Sarah L. Kim',
    address: '88 Tech Street, Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    country: 'United States',
    email: 'sarah.kim@email.com',
    phone: '+1 (415) 555-0190',
  },
  items: [
    { id: 1, name: 'MacBook Pro 14" M3 Pro', description: 'Space Black, 18GB RAM, 512GB SSD', quantity: 1, price: 1999, total: 1999 },
    { id: 2, name: 'Apple Magic Mouse', description: 'Space Grey - Multi-Touch Surface', quantity: 1, price: 79, total: 79 },
    { id: 3, name: 'USB-C Hub Pro 8-in-1', description: '4K HDMI, 100W PD, SD/microSD, 3xUSB-A', quantity: 2, price: 49.99, total: 99.98 },
    { id: 4, name: 'Extended Warranty', description: '3-Year AppleCare+ equivalent plan', quantity: 1, price: 299, total: 299 },
  ],
  totals: [
    { label: 'Subtotal', value: 2476.98, isSubtotal: true },
    { label: 'Shipping & Handling', value: 0 },
    { label: 'Sales Tax (8.625%)', value: 213.64, isTax: true },
    { label: 'Total Due', value: 2690.62, isGrandTotal: true },
  ],
  barcode: 'PO20240715-0028',
  qrcode: 'https://techhub.store/orders/PO-20240715-0028',
  notes: 'Expected delivery: 3–5 business days. Track your order at techhub.store/track',
  footerText: 'Returns accepted within 30 days · support@techhub.store · 1-800-TECHHUB',
}

// ──────────────────────────────────────────────────────────────────────────────
// Sample data - Service / Freelance Invoice
// ──────────────────────────────────────────────────────────────────────────────
const serviceInvoice: InvoiceData = {
  brandTitle: 'Invoice',
  brandName: 'Pixel & Code Studio',
  companyInfo: {
    name: 'Pixel & Code Studio',
    address: '12 Designer Lane',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11201',
    country: 'USA',
    email: 'hello@pixelcode.studio',
    phone: '+1 (718) 555-4747',
    taxId: 'NY-7634812',
  },
  invoiceNumber: 'SVC-2024-0088',
  status: 'Pending',
  issuedDate: new Date('2024-07-05'),
  dueDate: new Date('2024-08-05'),
  customerInfo: {
    name: 'Greenwave Digital Ltd.',
    address: '500 Corporate Park, Floor 12',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    country: 'USA',
    email: 'accounts@greenwave.io',
    phone: '+1 (312) 555-9900',
    taxId: 'IL-55001234',
  },
  items: [
    { id: 1, name: 'UI/UX Design — Mobile App', description: '32 screens, full Figma source, design system & component library included.', quantity: 1, price: 4800, total: 4800 },
    { id: 2, name: 'Frontend Development (Vue 3)', description: '6 weeks dedicated development, responsive, accessible, i18n-ready.', quantity: 1, price: 6500, total: 6500 },
    { id: 3, name: 'QA & Testing', description: 'Cross-browser & device testing. Bug reports & fixes included.', quantity: 1, price: 900, total: 900 },
    { id: 4, name: 'Project Management', description: '10 hrs/week coordination, sprint planning, Jira board management.', quantity: 6, price: 120, total: 720 },
  ],
  totals: [
    { label: 'Subtotal', value: 13920, isSubtotal: true },
    { label: 'Milestone 1 Deposit (paid)', value: -4000, isDiscount: true },
    { label: 'Tax (NY State 8.875%)', value: 1235.49, isTax: true },
    { label: 'Outstanding Balance', value: 11155.49, isGrandTotal: true },
  ],
  qrcode: 'https://pixelcode.studio/invoices/SVC-2024-0088',
  barcode: 'SVC2024-0088',
  notes: 'Payment due within 30 days of invoice date. Wire transfer or Stripe accepted.\nBank: Chase · Account: 4001-2234-56 · Routing: 021000021',
  footerText: 'pixel & code studio — crafting digital experiences with purpose',
}

// ──────────────────────────────────────────────────────────────────────────────
// Scenario selector
// ──────────────────────────────────────────────────────────────────────────────
const scenarios = [
  { label: 'Sales Invoice', value: 'sales' as const },
  { label: 'POS / Restaurant Receipt', value: 'pos' as const },
  { label: 'E-commerce / Purchase Order', value: 'ecom' as const },
  { label: 'Service / Freelance', value: 'service' as const },
]

type ScenarioKey = 'sales' | 'pos' | 'ecom' | 'service'

const selectedScenario = ref<ScenarioKey>('sales')

const scenarioDataMap: Record<ScenarioKey, InvoiceData> = {
  sales: salesInvoice,
  pos: posInvoice,
  ecom: ecomInvoice,
  service: serviceInvoice,
}

// ──────────────────────────────────────────────────────────────────────────────
// API Reference table data (moved to script to avoid template parser issues
// with double-quote characters inside inline v-for array literals)
// ──────────────────────────────────────────────────────────────────────────────
const invoicePropsFields = [
  { name: 'data', type: 'InvoiceData', default: '—', desc: 'The full invoice data object (required).' },
  { name: 'variant', type: "'Variant1' | 'Variant2' | 'Variant3' | 'Variant4'", default: "'Variant1'", desc: 'Selects the visual layout of the invoice.' },
]

const invoiceDataFields = [
  { name: 'brandLogo', type: 'string?', desc: 'URL to the brand logo image.' },
  { name: 'brandTitle', type: 'string?', desc: 'Display title e.g. Invoice, Receipt, Purchase Order.' },
  { name: 'brandName', type: 'string?', desc: 'Company / brand name.' },
  { name: 'companyInfo', type: 'InvoiceCompanyInfo?', desc: 'Issuer address, email, phone, tax ID, etc.' },
  { name: 'invoiceNumber', type: 'string', desc: 'Unique invoice / receipt identifier (required).' },
  { name: 'status', type: 'string?', desc: 'Status label e.g. Paid, Pending, Processing.' },
  { name: 'issuedDate', type: 'string | Date?', desc: 'Date the invoice was issued. Formatted via DateTime.' },
  { name: 'dueDate', type: 'string | Date?', desc: 'Payment due date. Formatted via DateTime.' },
  { name: 'customerInfo', type: 'InvoiceCustomerInfo?', desc: 'Bill-to party name, address, email, phone, tax ID.' },
  { name: 'items', type: 'InvoiceLineItem[]', desc: 'Array of line items with name, qty, price, total (required).' },
  { name: 'totals', type: 'InvoiceTotal[]', desc: 'Summary rows — subtotal, tax, discount, grand total, etc. (required).' },
  { name: 'qrcode', type: 'string?', desc: 'Content string for the embedded QR Code.' },
  { name: 'barcode', type: 'string?', desc: 'Value string for the embedded Barcode (CODE128).' },
  { name: 'notes', type: 'string?', desc: 'Additional notes or memo text for the receiver.' },
  { name: 'footerText', type: 'string?', desc: 'Small footer text, e.g. terms, website, contact info.' },
]

const invoiceTotalFields = [
  { name: 'label', type: 'string', desc: 'Display label e.g. Subtotal, Tax (10%), Discount.' },
  { name: 'value', type: 'number', desc: 'Numeric monetary value, formatted via Price component.' },
  { name: 'isGrandTotal', type: 'boolean?', desc: 'Marks this row as the grand total — rendered larger & bold with a separator line above.' },
  { name: 'isSubtotal', type: 'boolean?', desc: 'Semantic marker for the subtotal row (used for styling in some variants).' },
  { name: 'isTax', type: 'boolean?', desc: 'Semantic marker for a tax row.' },
  { name: 'isDiscount', type: 'boolean?', desc: 'Semantic marker for a discount row (use negative values for deductions).' },
]
</script>

<template>
  <div class="space-y-12 pb-20">
    <!-- Page Heading -->
    <div class="space-y-4 pb-8 border-b border-border/50">
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Invoice</h2>
      <p class="text-lg text-muted-foreground w-full max-w-[80%]">
        A flexible, fully-typed invoice component with 4 visual variants.
        Supports brand identity, customer info, line items, totals, QR codes, barcodes, notes, and a footer.
        Works seamlessly with the library's <code class="text-primary font-mono text-sm">Price</code> and
        <code class="text-primary font-mono text-sm">DateTime</code> formatters.
      </p>
    </div>

    <!-- ── Section 1: All Variants interactive preview ── -->
    <DemoSection title="Variants" :code="sourceCode">
      <div class="w-full space-y-8">
        <!-- Controls Row -->
        <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border border-border rounded-xl bg-muted/30 px-5 py-4">
          <!-- Variant Switcher -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Variant</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="v in variants"
                :key="v.value"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="
                  selectedVariant === v.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                "
                @click="selectedVariant = v.value"
              >
                {{ v.label }}
              </button>
            </div>
            <p class="text-xs text-muted-foreground mt-1 italic">
              {{ variants.find(v => v.value === selectedVariant)?.description }}
            </p>
          </div>

          <!-- Scenario Switcher -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scenario</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="s in scenarios"
                :key="s.value"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="
                  selectedScenario === s.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                "
                @click="selectedScenario = s.value"
              >
                {{ s.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Invoice Preview -->
        <div class="w-full">
          <Invoice :data="scenarioDataMap[selectedScenario]" :variant="selectedVariant" />
        </div>
      </div>
    </DemoSection>

    <!-- ── Section 2: All 4 Variants side-by-side with same data ── -->
    <DemoSection title="All Variants — Sales Invoice" :code="sourceCode">
      <div class="w-full grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div v-for="v in variants" :key="v.value" class="space-y-3">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {{ v.label.split('—')[0].trim() }}
            </span>
            <span class="text-sm text-muted-foreground">{{ v.description }}</span>
          </div>
          <Invoice :data="salesInvoice" :variant="v.value" />
        </div>
      </div>
    </DemoSection>

    <!-- ── Section 3: POS / Receipt ── -->
    <DemoSection title="POS &amp; Restaurant Receipt (Variant 2)" :code="sourceCode">
      <div class="flex justify-center w-full">
        <Invoice :data="posInvoice" variant="Variant2" />
      </div>
    </DemoSection>

    <!-- ── Section 4: E-commerce — Compact Table ── -->
    <DemoSection title="E-commerce / Purchase Order (Variant 3)" :code="sourceCode">
      <Invoice :data="ecomInvoice" variant="Variant3" />
    </DemoSection>

    <!-- ── Section 5: Service / Freelance — Bold Brand ── -->
    <DemoSection title="Service / Freelance Invoice (Variant 4)" :code="sourceCode">
      <Invoice :data="serviceInvoice" variant="Variant4" />
    </DemoSection>

    <!-- ── Section 6: API Reference ── -->
    <section class="space-y-6 pt-4">
      <h3 class="text-xl font-bold">API Reference</h3>

      <!-- InvoiceProps -->
      <div>
        <h4 class="text-base font-semibold mb-3">InvoiceProps</h4>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th class="px-5 py-3">Prop</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Default</th>
                <th class="px-5 py-3">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="field in invoicePropsFields" :key="field.name" class="hover:bg-muted/30">
                <td class="px-5 py-3 font-mono text-primary">{{ field.name }}</td>
                <td class="px-5 py-3 font-mono text-muted-foreground">{{ field.type }}</td>
                <td class="px-5 py-3 text-muted-foreground">{{ field.default }}</td>
                <td class="px-5 py-3">{{ field.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- InvoiceData -->
      <div>
        <h4 class="text-base font-semibold mb-3">InvoiceData</h4>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th class="px-5 py-3">Field</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-sm">
              <tr v-for="field in invoiceDataFields" :key="field.name" class="hover:bg-muted/30">
                <td class="px-5 py-3 font-mono text-primary">{{ field.name }}</td>
                <td class="px-5 py-3 font-mono text-muted-foreground text-xs">{{ field.type }}</td>
                <td class="px-5 py-3 text-muted-foreground">{{ field.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- InvoiceTotal -->
      <div>
        <h4 class="text-base font-semibold mb-3">InvoiceTotal</h4>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th class="px-5 py-3">Field</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-sm">
              <tr v-for="field in invoiceTotalFields" :key="field.name" class="hover:bg-muted/30">
                <td class="px-5 py-3 font-mono text-primary">{{ field.name }}</td>
                <td class="px-5 py-3 font-mono text-muted-foreground text-xs">{{ field.type }}</td>
                <td class="px-5 py-3 text-muted-foreground">{{ field.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>
