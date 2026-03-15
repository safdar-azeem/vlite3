<script setup lang="ts">
import { ref } from 'vue'
import { Form, type IForm, type IFormSubmitPayload } from '@/components/Form'
import Icon from '@/components/Icon.vue'
import DemoSection from '../../../DemoSection.vue'
import sourceCode from './BasicContact.vue?raw'

const contactSchema: IForm[] = [
  {
    name: 'profilePicture',
    label: 'Profile Picture',
    type: 'avatarUpload',
    itemClass: 'col-span-2 mb-3',
  },
  {
    name: 'type',
    label: 'Profile Type',
    type: 'select',
    required: true,
    value: 'RECEIVING',
    options: [
      {
        label: 'Receiving (Income)',
        value: 'RECEIVING',
        description: 'Incoming revenue / sales',
      },
      {
        label: 'Giving (Expense)',
        value: 'GIVING',
        description: 'Outgoing payments / expenses',
      },
      {
        label: 'Dual (Both)',
        value: 'DUAL',
        description: 'Both receiving and giving',
      },
    ],
  },
  {
    name: 'userName',
    label: 'Username',
    type: 'text',
    required: true,
    placeholder: 'e.g. acmecorp_123',
  },
  {
    name: 'name',
    label: 'Full Name / Company Name',
    type: 'text',
    required: true,
    placeholder: 'e.g. Acme Corp',
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'e.g. billing@acme.com',
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'text',
    placeholder: 'e.g. +1 234 567 890',
  },
  {
    name: 'billingAddress',
    label: 'Billing Address',
    type: 'textarea',
    placeholder: 'Enter full billing address',
    itemClass: 'col-span-2',
  },
  {
    name: 'shippingAddress',
    label: 'Shipping Address',
    type: 'textarea',
    placeholder: 'Enter full shipping address',
    itemClass: 'col-span-2',
  },
  {
    name: 'attachments',
    label: 'Attachments',
    type: 'fileUploader',
    props: { multiple: true },
    maxFiles: 10,
    maxFileSize: 50,
    itemClass: 'col-span-2',
    returnFileObject: true,
  },
]

const submittedValues = ref<any>(null)

const item = {
  __typename: 'Customer',
  id: 'cmm5imywg0000yavlepy21jdj',
  type: 'RECEIVING',
  userName: 'customer1',
  name: 'Client',
  email: 'client@gmail.com',
  phone: '032231192',
  profilePicture: 'https://via.placeholder.com/150',
  billingAddress: 'Lorem ipsum dolor sit amet',
  shippingAddress: 'Lorem ipsum dolor sit amet',
  attachments: [
    {
      __typename: 'AttachmentFile',
      fileName: 'placeholder_thumbnail.png',
      fileUrl: 'https://via.placeholder.com/150',
      fileType: 'image/png',
      fileSize: 8815,
    },
  ],
  createdAt: '2026-02-27T23:20:57.136Z',
  updatedAt: '2026-02-28T00:01:32.755Z',
}

const handleSubmit = (payload: IFormSubmitPayload) => {
  submittedValues.value = payload.values
}
</script>

<template>
  <DemoSection title="Contact Form" :code="sourceCode">
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1 max-w-2xl">
        <Form :schema="contactSchema" :values="item" @on-submit="handleSubmit" />
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
