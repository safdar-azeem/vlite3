<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceData, InvoiceLabels } from './types'
import { Price } from '../Price'
import { DateTime } from '../DateTime'
import { Barcode } from '../Barcode'
import { QRCode } from '../QRCode'
import Avatar from '../Avatar.vue'
import StatusChip from '../StatusChip/StatusChip.vue'
import InvoiceTotals from './InvoiceTotals.vue'
// Useful for minimal POS receipts

const props = withDefaults(
  defineProps<{
    data: InvoiceData
    /** Reduces padding, spacing, and font sizes for print-friendly output */
    compact?: boolean
    /** Toggles the display of the barcode text value underneath the bars */
    displayBarcodeValue?: boolean
    /** Custom text labels for static UI strings */
    labels?: InvoiceLabels
  }>(),
  { compact: false, displayBarcodeValue: false }
)

const d = computed(() => props.data)
const l = computed(() => props.labels || {})
</script>

<template>
  <div
    class="v-invoice-v2 bg-background text-foreground border border-border mx-auto print:max-w-[300px] font-sans tracking-tight"
    :style="{
      '--text-sm': compact ? '12px' : '13.5px',
      '--text-xs': compact ? '9.5px' : '10px',
    }"
    :class="compact ? 'max-w-xs' : 'max-w-sm sm:max-w-md'">
    <div class="text-center" :class="compact ? 'p-4 pb-3' : 'p-6 pb-4'">
      <div v-if="d.brandLogo" class="flex justify-center mb-2">
        <Avatar
          :src="d.brandLogo"
          :alt="d.brandName"
          :class="compact ? 'h-9 w-9' : 'h-12 w-12'"
          rounded="md" />
      </div>
      <h2
        v-if="d.brandName"
        class="font-bold uppercase tracking-widest text-foreground"
        :class="compact ? 'text-base' : 'text-xl'">
        {{ d.brandName }}
      </h2>
      <div
        v-if="d.companyInfo"
        class="text-muted-foreground space-y-0.5 mt-1"
        :class="compact ? 'text-xs' : 'text-sm'">
        <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
        <p v-if="d.companyInfo.city || d.companyInfo.state">
          {{ d.companyInfo.city }} {{ d.companyInfo.state }} {{ d.companyInfo.zip }}
        </p>
        <p v-if="d.companyInfo.phone">{{ d.companyInfo.phone }}</p>
        <p v-if="d.companyInfo.taxId">{{ l.taxId || 'VAT' }}: {{ d.companyInfo.taxId }}</p>
      </div>
    </div>

    <div class="border-t border-dashed border-border" :class="compact ? 'mx-3' : 'mx-5'"></div>

    <div :class="compact ? 'px-4 py-2.5 space-y-1 text-xs' : 'px-5 py-3.5 space-y-1.5 text-sm'">
      <div class="flex justify-between items-center">
        <span class="text-muted-foreground font-medium">{{ l.invoiceNumber || 'Receipt #' }}</span>
        <span class="font-semibold text-foreground">{{ d.invoiceNumber }}</span>
      </div>
      <div v-if="d.issuedDate" class="flex justify-between items-center">
        <span class="text-muted-foreground font-medium">{{ l.issued || 'Date' }}</span>
        <DateTime :value="d.issuedDate" type="dateTime" class="font-medium text-foreground" />
      </div>
      <div v-if="d.customerInfo?.name" class="flex justify-between items-center">
        <span class="text-muted-foreground font-medium">{{ l.billedTo || 'Customer' }}</span>
        <span class="font-semibold text-foreground">{{ d.customerInfo.name }}</span>
      </div>
      <div v-if="d.status" class="flex justify-between items-center">
        <span class="text-muted-foreground font-medium">{{ l.status || 'Status' }}</span>
        <StatusChip :status="d.status" hide-icon size="small" />
      </div>
    </div>

    <div class="border-t border-dashed border-border" :class="compact ? 'mx-3' : 'mx-5'"></div>

    <div :class="compact ? 'px-4 py-2.5' : 'px-5 py-3.5'">
      <div
        class="flex justify-between font-semibold text-muted-foreground uppercase tracking-wider mb-2"
        :class="compact ? 'text-[10px]' : 'text-xs'">
        <span>{{ l.item || 'Item' }}</span>
        <span>{{ l.total || 'Amount' }}</span>
      </div>

      <div :class="compact ? 'space-y-2.5' : 'space-y-3.5'">
        <div v-for="(item, index) in d.items" :key="item.id || index">
          <div class="flex items-start gap-2.5">
            <div
              v-if="item.thumbnail"
              class="shrink-0 overflow-hidden border border-border mt-0.5"
              :class="compact ? 'w-8 h-8 rounded' : 'w-9 h-9 rounded-md'">
              <Avatar :src="item.thumbnail" :alt="item.name" class="w-full h-full" rounded="sm" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start gap-2">
                <span
                  class="font-semibold text-foreground truncate"
                  :class="compact ? 'text-xs' : 'text-sm'"
                  :title="item.name"
                  >{{ item.name }}</span
                >
                <Price
                  :value="item.total"
                  class="shrink-0 font-bold text-foreground"
                  :class="compact ? 'text-xs' : 'text-sm'" />
              </div>
              <div
                v-if="item.sku"
                class="text-muted-foreground uppercase tracking-tight truncate mt-0.5"
                :class="compact ? 'text-[9px]' : 'text-[10px]'">
                {{ l.sku || 'SKU' }}: {{ item.sku }}
              </div>
              <div
                class="text-muted-foreground flex flex-wrap gap-x-1.5 gap-y-0.5 mt-0.5"
                :class="compact ? 'text-[10px]' : 'text-xs'">
                <span>{{ item.quantity }} x</span>
                <Price :value="item.price" />
                <span v-if="item.size" class="text-muted-foreground">· {{ item.size }}</span>
                <div
                  v-if="item.discount !== undefined"
                  class="text-success font-medium flex items-center gap-0.5">
                  <span>· Disc:</span>
                  <Price :value="-item.discount" />
                  <span v-if="item.discountLabel">({{ item.discountLabel }})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-dashed border-border" :class="compact ? 'mx-3' : 'mx-5'"></div>

    <InvoiceTotals :totals="d.totals" :compact="compact" variant="Variant2" />

    <div class="border-t border-dashed border-border" :class="compact ? 'mx-3' : 'mx-5'"></div>

    <div :class="compact ? 'px-4 py-3 text-center space-y-3' : 'px-5 py-4 text-center space-y-4'">
      <div class="flex flex-row flex-wrap items-center justify-center gap-3">
        <div v-if="d.qrcode" class="bg-white">
          <QRCode :value="d.qrcode" :size="compact ? 48 : 64" />
        </div>
        <div v-if="d.barcode" class="bg-white overflow-hidden">
          <Barcode
            :value="d.barcode"
            format="CODE128"
            :height="compact ? 24 : 32"
            :width="compact ? 1.0 : 1.2"
            :display-value="displayBarcodeValue" />
        </div>
      </div>

      <div
        v-if="d.notes"
        class="text-muted-foreground whitespace-pre-wrap"
        :class="compact ? 'text-[10px]' : 'text-xs'">
        {{ d.notes }}
      </div>

      <div
        v-if="d.footerText"
        class="text-muted-foreground font-medium uppercase tracking-widest"
        :class="compact ? 'text-[9px]' : 'text-[10px]'">
        {{ d.footerText }}
      </div>
    </div>
  </div>
</template>
