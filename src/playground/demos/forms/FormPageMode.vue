<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './FormPageMode.vue?raw'

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

const handleBack = () => {
  alert('Back navigation triggered! In a real app, this returns to the list view.')
}

const handleSubmit = (payload: IFormSubmitPayload) => {
  console.log('Form saved:', payload)
  alert('Resource successfully saved!')
}
</script>

<template>
  <DemoSection title="Full-Page Layout Mode" :code="sourceCode">
    <div class="space-y-4">
      <p class="text-sm text-gray-500">
        Enterprise applications often use a dedicated page layout for editing resources. By passing
        <code>isPage="true"</code>, the form generates a sticky top header with the title, back
        navigation, and primary actions.
      </p>

      <div
        class="border-4 border-dashed border-gray-200 rounded-xl bg-gray-50 p-4 lg:p-10 relative h-[600px] overflow-hidden flex flex-col">
        <div
          class="bg-background rounded-lg shadow-xl overflow-y-auto border border-border h-full w-full flex flex-col relative">
          <div class="flex-1 p-6">
            <Form
              :schema="employeeSchema"
              isPage
              pageTitle="Edit Enterprise Resource"
              submitText="Save Resource"
              class-name="grid-cols-2"
              @onBack="handleBack"
              @onSubmit="handleSubmit">
            </Form>
          </div>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
