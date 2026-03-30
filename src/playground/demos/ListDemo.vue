<script setup lang="ts">
import { ref } from 'vue'
import { List } from '@/components/List'
import type { ListField } from '@/components/List'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ListDemo.vue?raw'

// ── Sample data ────────────────────────────────────────────────────────────
const customer = {
  name: 'Olivia Bennett',
  email: 'olivia.bennett@example.com',
  phoneNumber: '+1 (555) 234-5678',
  mobileNumber: '+1 (555) 876-5432',
  status: 'yes',
  industry: 'Technology',
  createdAt: '2023-04-15T09:30:00Z',
  totalAmount: 128450.75,
  amountPaid: 98200.0,
  amountRemaining: 30250.75,
  isWalkIn: false,
  allowLogin: true,
  twoFactorEnabled: true,
  objective: 'Looking to streamline internal  workflows and improve procurement visibility.',
  ssn: '123-45-6789',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia',
  location: {
    address: '221B Baker Street, Apt 4',
    city: 'San Francisco',
    state: 'California',
    zipCode: '94105',
    country: 'United States',
  },
}

const employee = {
  employeId: 'EMP-00421',
  name: 'Marcus Rivera',
  email: 'marcus.rivera@company.com',
  phoneNumber: '+1 (555) 111-2233',
  status: 'active',
  employmentType: 'Full-Time',
  gender: 'Male',
  dateOfHire: '2021-07-01T00:00:00Z',
  basicPay: 85000,
  bankDetails: {
    bankName: 'Chase Bank',
    accountNumber: '****4782',
    accountTitle: 'Marcus Rivera',
    accountIBAN: 'US99CHASE0000004782',
  },
}

const product = {
  sku: 'PRD-9021-BLK',
  name: 'Mechanical Keyboard Pro X',
  category: 'Electronics',
  price: 249.99,
  stock: 142,
  status: 'active',
  weight: 1.2,
  createdAt: '2024-01-20T08:00:00Z',
  description: 'Premium mechanical keyboard with RGB backlighting and hot-swappable switches.',
  dimensions: '440mm x 135mm x 40mm',
  rating: 4.7,
}

// ── Field schemas ───────────────────────────────────────────────────────────

const customerFields: ListField[] = [
  { key: 'name', title: 'Full Name', icon: 'lucide:user' },
  { key: 'totalAmount', title: 'Email', icon: 'lucide:mail', type: 'price' },
  { key: 'phoneNumber', title: 'Phone', isSensitive: true },
  { key: 'mobileNumber', title: 'Mobile', isSensitive: true },
  { key: 'status', title: 'Status', addStatusColor: true },
  { key: 'industry', title: 'Industry' },
  { key: 'createdAt', title: 'Member Since', type: 'date' },
  { key: 'isWalkIn', title: 'Walk-In', format: (v) => (v ? 'Yes' : 'No') },
  { key: 'allowLogin', title: 'Allow Login', format: (v) => (v ? 'Yes' : 'No') },
  {
    key: 'twoFactorEnabled',
    title: '2FA Enabled',
    format: (v) => (v ? 'Enabled' : 'Disabled'),
    addStatusColor: true,
  },
  { key: 'objective', title: 'Objective', lineByLine: true },
]

const locationFields: ListField[] = [
  { key: 'location.address', title: 'Address', lineByLine: true, icon: 'lucide:map-pin' },
  { key: 'location.city', title: 'City' },
  { key: 'location.state', title: 'State' },
  { key: 'location.zipCode', title: 'ZIP Code' },
  { key: 'location.country', title: 'Country' },
]

const employeeFields: ListField[] = [
  { key: 'employeId', title: 'Employee ID', icon: 'lucide:badge' },
  { key: 'email', title: 'Email', icon: 'lucide:mail' },
  { key: 'phoneNumber', title: 'Phone', isSensitive: true },
  { key: 'status', title: 'Status', addStatusColor: true },
  { key: 'employmentType', title: 'Employment Type' },
  { key: 'gender', title: 'Gender' },
  { key: 'dateOfHire', title: 'Date of Hire', type: 'date' },
  { key: 'basicPay', title: 'Basic Pay', type: 'price', isSensitive: true },
  { key: 'bankDetails.bankName', title: 'Bank', isSensitive: true },
  { key: 'bankDetails.accountNumber', title: 'Account No.', isSensitive: true },
  { key: 'bankDetails.accountTitle', title: 'Account Title', isSensitive: true },
  { key: 'bankDetails.accountIBAN', title: 'IBAN', isSensitive: true },
]

const productFields: ListField[] = [
  { key: 'sku', title: 'SKU', icon: 'lucide:barcode' },
  { key: 'category', title: 'Category' },
  { key: 'price', title: 'Price', type: 'price' },
  { key: 'stock', title: 'Stock', type: 'number' },
  { key: 'weight', title: 'Weight (kg)', type: 'number' },
  { key: 'rating', title: 'Rating', format: (v) => `${v} / 5.0` },
  { key: 'status', title: 'Status', addStatusColor: true },
  { key: 'createdAt', title: 'Created', type: 'date' },
  { key: 'dimensions', title: 'Dimensions', lineByLine: true },
  { key: 'description', title: 'Description', lineByLine: true },
]

// ── Conditional/when demo ────────────────────────────────────────────────────
const conditionalData = ref({
  name: 'Sarah Connor',
  role: 'admin',
  adminCode: 'ADM-9823',
  lastLogin: '2025-03-01T14:22:00Z',
  isVerified: true,
  notes: '',
})

const conditionalFields: ListField[] = [
  { key: 'name', title: 'Name' },
  { key: 'role', title: 'Role', addStatusColor: true },
  { key: 'adminCode', title: 'Admin Code', whenTrue: true, isSensitive: true },
  { key: 'lastLogin', title: 'Last Login', type: 'dateTime' },
  {
    key: 'isVerified',
    title: 'Verified',
    format: (v) => (v ? 'Verified' : 'Not Verified'),
    addStatusColor: true,
  },
  {
    key: 'notes',
    title: 'Notes',
    when: (v) => !!v,
    lineByLine: true,
  },
]

// ── Stacked variant demo data ────────────────────────────────────────────────
const personalInfo = {
  gender: 'Female',
  dateOfBirth: '1996-03-05T00:00:00Z',
  identifyCode: '3234611342',
  hometown: 'Hai Duong city',
  nationality: 'Vietnam',
  religion: 'None',
  language: 'Vietnamese, English',
  maritalStatus: 'Single',
  permanentAddress: '5. Nguyen Chi Thanh Street, Tan Binh Ward, Hai Duong',
  currentAddress: '29. Nguyen Ngoc Doan Street, Dong Da District, Ha Noi',
}

const personalInfoFields: ListField[] = [
  { key: 'gender', title: 'Gender' },
  { key: 'dateOfBirth', title: 'Date of birth', type: 'date' },
  { key: 'identifyCode', title: 'Identify code' },
  { key: 'hometown', title: 'Hometown' },
  { key: 'nationality', title: 'Nationality' },
  { key: 'religion', title: 'Religion' },
  { key: 'language', title: 'Language' },
  { key: 'maritalStatus', title: 'Marital status' },
  { key: 'permanentAddress', title: 'Permanent address' },
  { key: 'currentAddress', title: 'Current address' },
]

const accountInfo = {
  bankAccount: '02520613401',
  accountName: 'Nguyen Thi Minh Hang',
  bank: 'TPBank Duy Tan',
  taxCode: '8456120546',
  insuranceCode: '8456120546',
}

const accountInfoFields: ListField[] = [
  { key: 'bankAccount', title: 'Bank account' },
  { key: 'accountName', title: 'Account name' },
  { key: 'bank', title: 'Bank' },
  { key: 'taxCode', title: 'Tax code' },
  { key: 'insuranceCode', title: 'Insurance code' },
]

// ── Loading demo ─────────────────────────────────────────────────────────────
const isLoading = ref(true)
setTimeout(() => {
  isLoading.value = false
}, 2500)
</script>

<template>
  <div class="space-y-10 max-w-5xl">
    <div>
      <h2 class="text-2xl font-bold mb-1">List</h2>
      <p class="text-gray-500 text-sm">
        Schema-driven key-value information display component. Supports dot-notation paths, multiple
        columns, variants, sensitive masking, conditional fields, custom formatters, slot overrides,
        and loading skeletons.
      </p>
    </div>

    <!-- ── Customer Details (2-col default) ─────────────────── -->
    <DemoSection title="Customer Details (2 columns, default variant)" :code="sourceCode">
      <div class="space-y-4">
        <List
          :fields="customerFields"
          :data="customer"
          title="Customer Information"
          title-icon="lucide:user-circle"
          :columns="2" />
        <List
          :fields="locationFields"
          :data="customer"
          title="Location"
          title-icon="lucide:map-pin"
          :columns="2" />
      </div>
    </DemoSection>

    <!-- ── Employee (card variant) ───────────────────────────── -->
    <DemoSection title="Employee Details (card variant, sensitive fields)" :code="sourceCode">
      <List
        :fields="employeeFields"
        :data="employee"
        title="Employee Profile"
        title-icon="lucide:briefcase"
        variant="card"
        :columns="2" />
    </DemoSection>

    <!-- ── Stacked Variant — Personal & Account Info ───────── -->
    <DemoSection title="Stacked Variant (label on top, value below)" :code="sourceCode">
      <div class="space-y-4">
        <List
          :fields="personalInfoFields"
          :data="personalInfo"
          title="Personal information"
          title-icon="lucide:user"
          variant="stacked"
          :show-colon="false"
          :columns="2" />
        <List
          :fields="accountInfoFields"
          :data="accountInfo"
          title="Account information"
          title-icon="lucide:landmark"
          variant="stacked"
          :show-colon="false"
          :columns="3" />
      </div>
    </DemoSection>

    <!-- ── Product (striped, 1-col) ─────────────────────────── -->
    <DemoSection title="Product Info (striped, single column)" :code="sourceCode">
      <div class="max-w-lg">
        <List
          :fields="productFields"
          :data="product"
          title="Product Details"
          title-icon="lucide:package"
          variant="striped"
          :columns="1" />
      </div>
    </DemoSection>

    <!-- ── Variants showcase ─────────────────────────────────── -->
    <DemoSection title="Variants" :code="sourceCode">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            default
          </p>
          <List
            :fields="productFields.slice(0, 4)"
            :data="product"
            variant="default"
            :columns="1" />
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            card
          </p>
          <List :fields="productFields.slice(0, 4)" :data="product" variant="card" :columns="1" />
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            striped
          </p>
          <List
            :fields="productFields.slice(0, 4)"
            :data="product"
            variant="striped"
            :columns="1" />
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            compact
          </p>
          <List
            :fields="productFields.slice(0, 4)"
            :data="product"
            variant="compact"
            :columns="1" />
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            minimal
          </p>
          <List
            :fields="productFields.slice(0, 4)"
            :data="product"
            variant="minimal"
            :columns="1" />
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            bordered-rows
          </p>
          <List
            :fields="productFields.slice(0, 4)"
            :data="product"
            variant="bordered-rows"
            :columns="1" />
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            stacked
          </p>
          <List
            :fields="productFields.slice(0, 4)"
            :data="product"
            variant="stacked"
            :show-colon="false"
            :columns="2" />
        </div>
      </div>
    </DemoSection>

    <!-- ── Conditional fields (when / whenTrue) ──────────────── -->
    <DemoSection title="Conditional Fields (when / whenTrue)" :code="sourceCode">
      <div class="max-w-lg space-y-3">
        <p class="text-xs text-muted-foreground">
          <code>adminCode</code> uses <code>whenTrue</code> (only shows if value is truthy).
          <code>notes</code> uses <code>when</code> (custom function). Notes is empty so it's
          hidden.
        </p>
        <List
          :fields="conditionalFields"
          :data="conditionalData"
          title="User Account"
          :columns="1" />
      </div>
    </DemoSection>

    <!-- ── Custom slot override ───────────────────────────────── -->
    <DemoSection title="Custom Slot Override" :code="sourceCode">
      <div class="max-w-lg">
        <List :fields="customerFields.slice(0, 5)" :data="customer" title="Slot Demo" :columns="1">
          <!-- Override the 'status' field rendering -->
          <template #status="{ value }">
            <span
              class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
              :class="
                value === 'active'
                  ? 'bg-success-light text-success-dark'
                  : 'bg-danger-light text-danger-dark'
              ">
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="value === 'active' ? 'bg-success' : 'bg-danger'" />
              {{ value }}
            </span>
          </template>
        </List>
      </div>
    </DemoSection>

    <!-- ── Loading skeleton ───────────────────────────────────── -->
    <DemoSection title="Loading Skeleton" :code="sourceCode">
      <div class="max-w-lg space-y-2">
        <p class="text-xs text-muted-foreground">Auto-dismisses after 2.5s</p>
        <List
          :fields="customerFields.slice(0, 6)"
          :data="customer"
          title="Loading..."
          :loading="isLoading"
          :skeleton-rows="6"
          :columns="2" />
      </div>
    </DemoSection>

    <!-- ── No colon, no title ─────────────────────────────────── -->
    <DemoSection title="No Colon, No Title, 1 Column" :code="sourceCode">
      <div class="max-w-sm">
        <List
          :fields="productFields.slice(0, 5)"
          :data="product"
          :columns="1"
          :show-colon="false"
          variant="minimal" />
      </div>
    </DemoSection>
  </div>
</template>
