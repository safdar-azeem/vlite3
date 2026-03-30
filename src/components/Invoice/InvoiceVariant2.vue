<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceData } from './types'
import { Price } from '../Price'
import { DateTime } from '../DateTime'
import { Barcode } from '../Barcode'
import { QRCode } from '../QRCode'
// Useful for minimal POS receipts

const props = defineProps<{
  data: InvoiceData
}>()

const d = computed(() => props.data)
</script>

<template>
  <div class="v-invoice-v2 bg-white text-gray-900 border border-gray-200 mx-auto max-w-sm sm:max-w-md print:max-w-[300px] shadow-sm font-sans tracking-tight">
    
    <div class="p-6 text-center space-y-3 pb-4">
      <div v-if="d.brandLogo" class="h-14 mx-auto mb-2">
        <img :src="d.brandLogo" :alt="d.brandName" class="h-full object-contain mx-auto grayscale" />
      </div>
      
      <div>
        <h2 v-if="d.brandName" class="text-2xl font-bold uppercase tracking-widest">{{ d.brandName }}</h2>
        
        <div v-if="d.companyInfo" class="mt-2 text-xs text-gray-500 space-y-0.5">
          <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
          <p v-if="d.companyInfo.city || d.companyInfo.state">
            {{ d.companyInfo.city }} {{ d.companyInfo.state }} {{ d.companyInfo.zip }}
          </p>
          <p v-if="d.companyInfo.phone">{{ d.companyInfo.phone }}</p>
          <p v-if="d.companyInfo.taxId">VAT: {{ d.companyInfo.taxId }}</p>
        </div>
      </div>
    </div>

    <div class="border-t border-dashed border-gray-300 mx-6"></div>

    <div class="px-6 py-4 space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-500 font-medium">Receipt #</span>
        <span class="font-semibold">{{ d.invoiceNumber }}</span>
      </div>
      <div v-if="d.issuedDate" class="flex justify-between">
        <span class="text-gray-500 font-medium">Date</span>
        <DateTime :value="d.issuedDate" format="dateTime" class="font-medium" />
      </div>
      <div v-if="d.customerInfo?.name" class="flex justify-between mt-2">
        <span class="text-gray-500 font-medium">Customer</span>
        <span class="font-semibold">{{ d.customerInfo.name }}</span>
      </div>
      <div v-if="d.status" class="flex justify-between">
        <span class="text-gray-500 font-medium">Status</span>
        <span class="uppercase font-bold tracking-widest">{{ d.status }}</span>
      </div>
    </div>

    <div class="border-t border-dashed border-gray-300 mx-6"></div>

    <!-- Items List -->
    <div class="px-6 py-4">
      <div class="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        <span>Item</span>
        <span>Amount</span>
      </div>
      
      <div class="space-y-4">
        <div v-for="(item, index) in d.items" :key="item.id || index" class="text-sm">
          <div class="flex justify-between font-medium">
            <span class="pr-2">{{ item.name }}</span>
            <Price :value="item.total" class="shrink-0" />

          </div>
          <div class="text-xs text-gray-500 flex gap-2">
            <span>{{ item.quantity }} x</span>
            <Price :value="item.price" />
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-dashed border-gray-300 mx-6"></div>

    <!-- Totals -->
    <div class="px-6 py-4 space-y-2">
      <div 
        v-for="(total, idx) in d.totals" 
        :key="idx"
        class="flex justify-between text-sm"
        :class="total.isGrandTotal ? 'mt-2 pt-2 border-t border-gray-200 text-lg font-bold' : 'font-medium text-gray-600'"
      >
        <span>{{ total.label }}</span>
        <Price :value="total.value" />
      </div>
    </div>

    <div class="border-t border-dashed border-gray-300 mx-6"></div>

    <!-- Footer Content -->
    <div class="px-6 py-6 text-center space-y-6">
      <div class="flex flex-col items-center justify-center gap-4">
        <div v-if="d.qrcode" class="p-1 bg-white border border-gray-200 rounded">
          <QRCode :text="d.qrcode" :size="96" />
        </div>
        <div v-if="d.barcode" class="scale-90 inline-block overflow-hidden">
          <Barcode :value="d.barcode" format="CODE128" :height="40" :width="1.2" :display-value="true" />
        </div>
      </div>

      <div v-if="d.notes" class="text-xs text-gray-600 whitespace-pre-wrap">
        {{ d.notes }}
      </div>
      
      <div v-if="d.footerText" class="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-4">
        {{ d.footerText }}
      </div>
    </div>

  </div>
</template>
