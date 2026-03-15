<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../../DemoSection.vue'
import sourceCode from './BasicLogin.vue?raw'
const employeeSchema: IForm[][] = [
  [
    // Basic Info
    {
      name: 'avatar',
      type: 'avatarUpload',
      labelI18n: 'common.words.avatar',
      label: 'Avatar',
      itemClass: 'col-span-2',
    },
    {
      name: 'employeeId',
      type: 'text',
      labelI18n: 'hrm.employeeId',
      label: 'Employee ID',
      required: true,
    },
    {
      name: 'employeeName',
      type: 'text',
      labelI18n: 'hrm.employeeName',
      label: 'Employee Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      labelI18n: 'common.words.email',
      label: 'Email',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      labelI18n: 'common.words.phone',
      label: 'Phone Number',
    },
    {
      name: 'mobileNumber',
      type: 'text',
      labelI18n: 'common.words.mobile',
      label: 'Mobile Number',
    },
    {
      name: 'dateOfHire',
      type: 'date',
      labelI18n: 'hrm.dateOfHire',
      label: 'Date of Hire',
    },
    {
      name: 'gender',
      type: 'select',
      labelI18n: 'hrm.gender',
      label: 'Gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'maritalStatus',
      type: 'select',
      labelI18n: 'hrm.maritalStatus',
      label: 'Marital Status',
      options: [
        { label: 'Single', value: 'single' },
        { label: 'Married', value: 'married' },
        { label: 'Divorced', value: 'divorced' },
        { label: 'Widowed', value: 'widowed' },
      ],
    },
  ],
  [
    // Employment Details
    {
      name: 'status',
      type: 'select',
      labelI18n: 'common.words.status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Resigned', value: 'resigned' },
        { label: 'Laid Off', value: 'laidOff' },
        { label: 'Terminated', value: 'terminated' },
        { label: 'On Notice Period', value: 'onNoticePeriod' },
      ],
    },
    {
      name: 'employmentType',
      type: 'select',
      labelI18n: 'hrm.employmentType',
      label: 'Employment Type',
      options: [
        { label: 'Full Time', value: 'fullTime' },
        { label: 'Part Time', value: 'partTime' },
        { label: 'Contract', value: 'onContract' },
        { label: 'Internship', value: 'internship' },
        { label: 'Trainee', value: 'trainee' },
      ],
    },
    {
      name: 'branchId',
      type: 'text',
      labelI18n: 'common.words.branch',
      label: 'Branch',
    },
    {
      name: 'departmentId',
      type: 'text',
      labelI18n: 'common.words.department',
      label: 'Department',
    },
    {
      name: 'positionId',
      type: 'text',
      labelI18n: 'hrm.position',
      label: 'Position',
    },
    {
      name: 'shiftId',
      type: 'text',
      labelI18n: 'hrm.shift',
      label: 'Shift',
    },
    {
      name: 'noticePeriodDate',
      type: 'date',
      labelI18n: 'hrm.noticePeriodDate',
      label: 'Notice Period Date',
    },
    {
      name: 'probationEndDate',
      type: 'date',
      labelI18n: 'hrm.probationEndDate',
      label: 'Probation End Date',
    },
  ],
  [
    // Salary Details
    {
      name: 'basicPay',
      type: 'password',
      labelI18n: 'hrm.basicPay',
      label: 'Basic Pay',
    },
    {
      name: 'allowances',
      type: 'customFields',
      labelI18n: 'hrm.allowances',
      label: 'Allowances',
      itemClass: 'col-span-2',
      props: {
        headers: ['Allowance', 'Value', 'Type'],
        schema: [
          {
            name: 'allowanceId',
            type: 'text',
            required: true,
          },
          { name: 'value', type: 'number', required: true },
          {
            name: 'valueType',
            type: 'select',
            required: true,
            options: [
              { label: 'Fixed', value: 'fixed' },
              { label: 'Percentage', value: 'percentage' },
            ],
          },
        ],
      },
    },
    {
      name: 'deductions',
      type: 'customFields',
      labelI18n: 'hrm.deductions',
      label: 'Deductions',
      itemClass: 'col-span-2',
      props: {
        headers: ['Deduction', 'Value', 'Type'],
        schema: [
          {
            name: 'deductionId',
            type: 'text',
            required: true,
          },
          { name: 'value', type: 'number', required: true },
          {
            name: 'valueType',
            type: 'select',
            required: true,
            options: [
              { label: 'Fixed', value: 'fixed' },
              { label: 'Percentage', value: 'percentage' },
            ],
          },
        ],
      },
    },
  ],
  [
    // Identification
    {
      name: 'identification.dateOfBirth',
      type: 'date',
      labelI18n: 'hrm.dateOfBirth',
      label: 'Date of Birth',
    },
    {
      name: 'identification.socialSecurityNumber',
      type: 'password',
      labelI18n: 'hrm.ssn',
      label: 'SSN',
    },
  ],
  [
    // Bank Details
    {
      name: 'bankDetails.bankName',
      type: 'text',
      labelI18n: 'hrm.bankName',
      label: 'Bank Name',
    },
    {
      name: 'bankDetails.accountTitle',
      type: 'password',
      labelI18n: 'hrm.accountTitle',
      label: 'Account Title',
    },
    {
      name: 'bankDetails.accountNumber',
      type: 'password',
      labelI18n: 'hrm.accountNumber',
      label: 'Account Number',
    },
    {
      name: 'bankDetails.accountIBAN',
      type: 'password',
      labelI18n: 'hrm.iban',
      label: 'IBAN',
    },
  ],
  [
    // Location
    {
      name: 'location.address',
      type: 'textarea',
      labelI18n: 'common.words.address',
      label: 'Address',
      itemClass: 'col-span-2',
    },
    {
      name: 'location.city',
      type: 'text',
      labelI18n: 'common.words.city',
      label: 'City',
    },
    {
      name: 'location.state',
      type: 'text',
      labelI18n: 'common.words.state',
      label: 'State',
    },
    {
      name: 'location.zipCode',
      type: 'text',
      labelI18n: 'common.words.zipCode',
      label: 'Zip Code',
    },
    {
      name: 'location.country',
      type: 'text',
      labelI18n: 'common.words.country',
      label: 'Country',
    },
  ],
  [
    // Emergency Contacts
    {
      name: 'emergencyContacts.name',
      type: 'text',
      labelI18n: 'common.words.name',
      label: 'Name',
    },
    {
      name: 'emergencyContacts.relationship',
      type: 'text',
      labelI18n: 'hrm.relationship',
      label: 'Relationship',
    },
    {
      name: 'emergencyContacts.phone',
      type: 'text',
      labelI18n: 'common.words.phone',
      label: 'Phone',
    },
  ],
]

const submittedValues = ref<any>(null)

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <DemoSection title="Login Form" :code="sourceCode">
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1 max-w-md">
        <Form :schema="employeeSchema" submitText="Sign In" @onSubmit="handleSubmit" />
      </div>
      <!-- Inline Submitted Values -->
      <div v-if="submittedValues" class="flex-1 max-w-md">
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 h-full">
          <div class="flex items-center gap-2 mb-3">
            <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-600" />
            <h4 class="font-semibold text-green-800">Submitted Values</h4>
          </div>
          <div class="bg-white rounded border border-green-200 p-3 overflow-auto max-h-60">
            <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{
              JSON.stringify(submittedValues, null, 2)
            }}</pre>
          </div>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
