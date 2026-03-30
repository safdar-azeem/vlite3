<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceData } from './types'
import { Price } from '../Price'
import { DateTime } from '../DateTime'
import { getStatusColorClass } from '@/utils/status'
import { Barcode } from '../Barcode'
import { QRCode } from '../QRCode'
// Useful for minimal POS receipts

const props = withDefaults(
  defineProps<{
    data: InvoiceData
    /** Reduces padding, spacing, and font sizes for print-friendly output */
    compact?: boolean
  }>(),
  { compact: false }
)

const d = computed(() => props.data)
</script>

<template>
  <div
    class="v-invoice-v2 bg-body text-gray-900 border border-gray-200 mx-auto print:max-w-[300px] shadow-sm font-sans tracking-tight"
    :style="{
      '--text-sm': compact ? '12px' : '13.5px',
      '--text-xs': compact ? '9.5px' : '10px',
    }"
    :class="compact ? 'max-w-xs' : 'max-w-sm sm:max-w-md'">
    <div class="text-center" :class="compact ? 'p-3 space-y-1.5 pb-2' : 'p-6 space-y-3 pb-4'">
      <div v-if="d.brandLogo" :class="compact ? 'h-8 mx-auto mb-1' : 'h-14 mx-auto mb-2'">
        <img
          :src="d.brandLogo"
          :alt="d.brandName"
          class="h-full object-contain mx-auto grayscale" />
      </div>

      <div>
        <h2
          v-if="d.brandName"
          class="font-bold uppercase tracking-widest"
          :class="compact ? 'text-base' : 'text-2xl'">
          {{ d.brandName }}
        </h2>

        <div
          v-if="d.companyInfo"
          class="text-gray-500 space-y-0.5"
          :class="compact ? 'mt-1 text-sm' : 'mt-2 text-sm'">
          <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
          <p v-if="d.companyInfo.city || d.companyInfo.state">
            {{ d.companyInfo.city }} {{ d.companyInfo.state }} {{ d.companyInfo.zip }}
          </p>
          <p v-if="d.companyInfo.phone">{{ d.companyInfo.phone }}</p>
          <p v-if="d.companyInfo.taxId">VAT: {{ d.companyInfo.taxId }}</p>
        </div>
      </div>
    </div>

    <div class="border-t border-dashed border-gray-300" :class="compact ? 'mx-3' : 'mx-6'"></div>

    <!-- Receipt metadata -->
    <div :class="compact ? 'px-3 py-2 space-y-1 text-sm' : 'px-6 py-4 space-y-1.5 text-sm'">
      <div class="flex justify-between">
        <span class="text-gray-500 font-medium">Receipt #</span>
        <span class="font-semibold">{{ d.invoiceNumber }}</span>
      </div>
      <div v-if="d.issuedDate" class="flex justify-between">
        <span class="text-gray-500 font-medium">Date</span>
        <DateTime :value="d.issuedDate" type="dateTime" class="font-medium" />
      </div>
      <div v-if="d.customerInfo?.name" class="flex justify-between mt-2">
        <span class="text-gray-500 font-medium">Customer</span>
        <span class="font-semibold">{{ d.customerInfo.name }}</span>
      </div>
      <div v-if="d.status" class="flex justify-between">
        <span class="text-gray-500 font-medium">Status</span>
        <span class="uppercase font-bold tracking-widest" :class="getStatusColorClass(d.status)">{{
          d.status
        }}</span>
      </div>
    </div>

    <div class="border-t border-dashed border-gray-300" :class="compact ? 'mx-3' : 'mx-6'"></div>

    <!-- Items List -->
    <div :class="compact ? 'px-3 py-2' : 'px-6 py-4'">
      <div
        class="flex justify-between font-semibold text-gray-500 uppercase tracking-wider"
        :class="compact ? 'text-xs! mb-1.5' : 'text-sm! mb-3'">
        <span>Item</span>
        <span>Amount</span>
      </div>

      <div :class="compact ? 'space-y-2' : 'space-y-4'">
        <div v-for="(item, index) in d.items" :key="item.id || index">
          <div class="flex items-start gap-2">
            <div
              v-if="item.thumbnail"
              class="shrink-0 w-8 h-8 rounded bg-gray-100 overflow-hidden border border-gray-200 mt-0.5">
              <img
                :src="item.thumbnail"
                :alt="item.name"
                class="w-full h-full object-cover grayscale" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between font-medium">
                <span class="truncate pr-2 text-sm!" :title="item.name">{{ item.name }}</span>
                <Price :value="item.total" class="shrink-0 font-bold text-xs" />
              </div>
              <div
                v-if="item.sku"
                class="text-xs uppercase text-gray-400 font-normal tracking-tight truncate"
                :title="item.sku">
                SKU: {{ item.sku }}
              </div>
              <div class="text-gray-500 flex flex-wrap gap-x-2 gap-y-0.5 text-xs">
                <span>{{ item.quantity }} x</span>
                <Price :value="item.price" class="text-xs" />
                <span v-if="item.size" class="text-gray-400 font-medium text-xs"
                  >| Size: {{ item.size }}</span
                >
                <div
                  v-if="item.discount !== undefined"
                  class="text-success font-medium flex items-center gap-1">
                  <span class="text-xs">| Disc:</span>
                  <Price :value="-item.discount" class="text-xs!" />
                  <span v-if="item.discountLabel" class="text-xs!">({{ item.discountLabel }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-dashed border-gray-300" :class="compact ? 'mx-3' : 'mx-6'"></div>

    <!-- Totals -->
    <div :class="compact ? 'px-3 py-2 space-y-1' : 'px-6 py-4 space-y-1'">
      <div
        v-for="(total, idx) in d.totals"
        :key="idx"
        class="flex justify-between"
        :class="
          total.isGrandTotal
            ? compact
              ? 'mt-1 pt-1 border-t border-gray-200 text-base font-bold'
              : 'mt-2 pt-2 border-t border-gray-200 text-lg font-bold'
            : compact
              ? 'font-medium text-gray-600'
              : 'font-medium text-gray-600'
        ">
        <span class="text-sm">{{ total.label }}</span>
        <Price :value="total.value" class="text-sm" />
      </div>
    </div>

    <div class="border-t border-dashed border-gray-300" :class="compact ? 'mx-3' : 'mx-6'"></div>

    <!-- Footer Content -->
    <div :class="compact ? 'px-3 py-3 text-center space-y-3' : 'px-6 py-6 text-center space-y-4'">
      <div class="flex flex-col items-center justify-center" :class="compact ? 'gap-1' : 'gap-2'">
        <div v-if="d.qrcode" class="p-1 bg-white border border-gray-200 rounded">
          <QRCode :text="d.qrcode" :size="compact ? 64 : 96" />
        </div>
        <div
          v-if="d.barcode"
          :class="
            compact ? 'inline-block overflow-hidden' : 'scale-90 inline-block overflow-hidden'
          ">
          <Barcode
            :value="d.barcode"
            format="CODE128"
            :height="compact ? 28 : 40"
            :width="compact ? 1.0 : 1.2" />
        </div>
      </div>

      <div v-if="d.notes" class="text-gray-600 whitespace-pre-wrap text-xs">
        {{ d.notes }}
      </div>

      <div v-if="d.footerText" class="text-gray-400 font-medium uppercase tracking-widest text-xs">
        {{ d.footerText }}
      </div>
    </div>
  </div>
</template>
