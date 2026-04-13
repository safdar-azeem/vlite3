<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceData, InvoiceLabels } from './types'
import { Price } from '../Price'
import { DateTime } from '../DateTime'
import { QRCode } from '../QRCode'
import { Barcode } from '../Barcode'
import Avatar from '../Avatar.vue'
import StatusChip from '../StatusChip/StatusChip.vue'
import InvoiceTotals from './InvoiceTotals.vue'

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
const hasSize = computed(() => d.value.items.some((item) => !!item.size))
const hasDiscount = computed(() => d.value.items.some((item) => item.discount !== undefined))
</script>

<template>
  <div
    class="v-invoice-v3 bg-background text-foreground border border-border rounded-lg overflow-hidden"
    :class="compact ? 'text-xs' : 'text-sm'"
    :style="{
      '--invoice-cell-px': compact ? '0.75rem' : '1rem',
      '--invoice-cell-py': compact ? '0.375rem' : '0.5rem',
      '--invoice-thead-bg': 'var(--color-muted)',
      '--invoice-tr-border': '1px solid var(--color-border)',
      '--invoice-tr-hover-bg': 'color-mix(in oklab, var(--color-muted) 30%, transparent)',
    }">
    <div
      class="bg-gray-900 flex justify-between items-center text-white"
      :class="compact ? 'px-5 py-2.5' : 'px-6 py-3.5'">
      <div class="flex items-center gap-3">
        <div v-if="d.brandLogo" class="shrink-0">
          <Avatar
            :src="d.brandLogo"
            :alt="d.brandName"
            :class="compact ? 'h-7 w-7' : 'h-8 w-8'"
            rounded="sm" />
        </div>
        <div class="flex flex-col leading-tight">
          <span
            v-if="d.brandName"
            class="font-bold text-white leading-tight"
            :class="compact ? 'text-sm' : 'text-base'">
            {{ d.brandName }}
          </span>
          <span
            v-if="d.brandTitle"
            class="opacity-75 font-medium"
            :class="compact ? 'text-[10px]' : 'text-xs'">
            {{ d.brandTitle }}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="opacity-80 font-medium" :class="compact ? 'text-xs' : 'text-sm'"
          >#{{ d.invoiceNumber }}</span
        >
        <StatusChip v-if="d.status" :status="d.status" hide-icon size="small" />
      </div>
    </div>

    <div :class="compact ? 'p-4 space-y-4' : 'p-5 space-y-5'">
      <div class="grid grid-cols-1 sm:grid-cols-2" :class="[d.shippingInfo ? 'md:grid-cols-4' : 'md:grid-cols-3', compact ? 'gap-3' : 'gap-5']">
        <div v-if="d.companyInfo">
          <p
            class="text-muted-foreground uppercase tracking-widest font-semibold mb-1.5"
            :class="compact ? 'text-[9px]' : 'text-[10px]'">
            {{ l.from || 'From' }}
          </p>
          <p class="font-bold text-foreground" :class="compact ? 'text-xs' : 'text-sm'">
            {{ d.companyInfo.name || d.brandName }}
          </p>
          <div class="mt-0.5 text-muted-foreground space-y-0.5 text-xs">
            <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
            <p v-if="d.companyInfo.city">
              {{ d.companyInfo.city }}, {{ d.companyInfo.state }} {{ d.companyInfo.zip }}
            </p>
            <p v-if="d.companyInfo.country">{{ d.companyInfo.country }}</p>
            <p v-if="d.companyInfo.email" class="pt-0.5">{{ d.companyInfo.email }}</p>
          </div>
        </div>

        <div v-if="d.customerInfo">
          <p
            class="text-muted-foreground uppercase tracking-widest font-semibold mb-1.5"
            :class="compact ? 'text-[9px]' : 'text-[10px]'">
            {{ l.billedTo || 'Billed To' }}
          </p>
          <p class="font-bold text-foreground" :class="compact ? 'text-xs' : 'text-sm'">
            {{ d.customerInfo.name }}
          </p>
          <div class="mt-0.5 text-muted-foreground space-y-0.5 text-xs">
            <p v-if="d.customerInfo.address">{{ d.customerInfo.address }}</p>
            <p v-if="d.customerInfo.city">
              {{ d.customerInfo.city }}, {{ d.customerInfo.state }} {{ d.customerInfo.zip }}
            </p>
            <p v-if="d.customerInfo.email">{{ d.customerInfo.email }}</p>
          </div>
        </div>

        <div v-if="d.shippingInfo">
          <p
            class="text-muted-foreground uppercase tracking-widest font-semibold mb-1.5"
            :class="compact ? 'text-[9px]' : 'text-[10px]'">
            {{ l.shipTo || 'Ship To' }}
          </p>
          <p class="font-bold text-foreground" :class="compact ? 'text-xs' : 'text-sm'">
            {{ d.shippingInfo.name }}
          </p>
          <div class="mt-0.5 text-muted-foreground space-y-0.5 text-xs">
            <p v-if="d.shippingInfo.address">{{ d.shippingInfo.address }}</p>
            <p v-if="d.shippingInfo.city">
              {{ d.shippingInfo.city }}, {{ d.shippingInfo.state }} {{ d.shippingInfo.zip }}
            </p>
            <p v-if="d.shippingInfo.country">{{ d.shippingInfo.country }}</p>
            <p v-if="d.shippingInfo.email">{{ d.shippingInfo.email }}</p>
            <p v-if="d.shippingInfo.phone">{{ d.shippingInfo.phone }}</p>
          </div>
        </div>

        <div class="flex flex-col md:items-end gap-2">
          <div v-if="d.issuedDate" class="flex gap-2 items-center">
            <span class="text-muted-foreground font-medium text-xs"
              >{{ l.issued || 'Issued' }}:</span
            >
            <DateTime
              :value="d.issuedDate"
              type="date"
              class="font-semibold text-xs text-foreground" />
          </div>
          <div v-if="d.dueDate" class="flex gap-2 items-center">
            <span class="text-muted-foreground font-medium text-xs">{{ l.due || 'Due' }}:</span>
            <DateTime
              :value="d.dueDate"
              type="date"
              class="font-semibold text-xs text-foreground" />
          </div>
          <div v-if="d.paymentMethod" class="flex gap-2 items-center">
            <span class="text-muted-foreground font-medium text-xs">{{ l.paymentMethod || 'Payment' }}:</span>
            <span class="font-semibold text-xs text-foreground">{{ d.paymentMethod }}</span>
          </div>
          <div v-if="d.shippingMethod" class="flex gap-2 items-center">
            <span class="text-muted-foreground font-medium text-xs">{{ l.shippingMethod || 'Shipping' }}:</span>
            <span class="font-semibold text-xs text-foreground">{{ d.shippingMethod }}</span>
          </div>
          <div v-if="d.qrcode || d.barcode" class="flex items-center justify-end gap-2 mt-1">
            <div v-if="d.qrcode" class="">
              <QRCode :value="d.qrcode" :size="compact ? 40 : 48" />
            </div>
            <div v-if="d.barcode" class="overflow-hidden">
              <Barcode
                :value="d.barcode"
                format="CODE128"
                :height="compact ? 20 : 26"
                :width="compact ? 1 : 1.2"
                :display-value="displayBarcodeValue" />
            </div>
          </div>
        </div>
      </div>

      <div class="border border-border rounded-md overflow-x-auto">
        <table class="invoice-table">
          <thead class="invoice-thead">
            <tr>
              <th scope="col" class="invoice-th">{{ l.item || 'Product' }}</th>
              <th
                scope="col"
                class="invoice-th invoice-text-right"
                :class="compact ? 'w-14' : 'w-20'">
                {{ l.qty || 'Qty' }}
              </th>
              <th
                v-if="hasSize"
                scope="col"
                class="invoice-th invoice-text-right"
                :class="compact ? 'w-14' : 'w-20'">
                {{ l.size || 'Size' }}
              </th>
              <th
                scope="col"
                class="invoice-th invoice-text-right"
                :class="compact ? 'w-20' : 'w-28'">
                {{ l.price || 'Price' }}
              </th>
              <th
                v-if="hasDiscount"
                scope="col"
                class="invoice-th invoice-text-right"
                :class="compact ? 'w-20' : 'w-28'">
                {{ l.discount || 'Discount' }}
              </th>
              <th
                scope="col"
                class="invoice-th invoice-text-right"
                :class="compact ? 'w-20' : 'w-28'">
                {{ l.total || 'Total' }}
              </th>
            </tr>
          </thead>
          <tbody class="invoice-tbody text-xs">
            <tr v-for="(item, index) in d.items" :key="item.id || index" class="invoice-tr group">
              <td class="invoice-td">
                <div class="flex items-center gap-2.5">
                  <div
                    v-if="item.thumbnail"
                    class="shrink-0 overflow-hidden border border-border"
                    :class="compact ? 'w-8 h-8 rounded' : 'w-9 h-9 rounded-md'">
                    <Avatar
                      :src="item.thumbnail"
                      :alt="item.name"
                      class="w-full h-full"
                      rounded="sm" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div
                      class="font-semibold text-foreground truncate"
                      :title="item.name"
                      :class="compact ? '' : 'text-[13px]'">
                      {{ item.name }}
                    </div>
                    <div
                      v-if="item.sku"
                      class="text-[9px] text-muted-foreground font-normal uppercase tracking-tight truncate"
                      :title="item.sku">
                      {{ l.sku || 'SKU' }}: {{ item.sku }}
                    </div>
                  </div>
                </div>
              </td>
              <td
                class="invoice-td invoice-text-right tabular-nums text-muted-foreground font-medium">
                {{ item.quantity }}
              </td>
              <td
                v-if="hasSize"
                class="invoice-td invoice-text-right tabular-nums text-muted-foreground">
                {{ item.size || '-' }}
              </td>
              <td class="invoice-td invoice-text-right tabular-nums text-muted-foreground">
                <Price :value="item.price" />
              </td>
              <td
                v-if="hasDiscount"
                class="invoice-td invoice-text-right tabular-nums text-success/80 font-medium">
                <div v-if="item.discount !== undefined" class="flex flex-col items-end">
                  <Price :value="-item.discount" />
                  <span v-if="item.discountLabel" class="text-[8px] uppercase font-bold">{{
                    item.discountLabel
                  }}</span>
                </div>
                <span v-else class="text-muted-foreground">-</span>
              </td>
              <td class="invoice-td invoice-text-right tabular-nums font-semibold text-foreground">
                <Price :value="item.total" />
              </td>
            </tr>
          </tbody>
        </table>

        <div
          class="bg-muted/30 border-t border-border flex justify-end"
          :class="compact ? 'p-3' : 'p-4'">
          <InvoiceTotals :totals="d.totals" :compact="compact" variant="Variant3" />
        </div>
      </div>

      <div v-if="d.notes" class="text-muted-foreground text-xs border-t border-border pt-3">
        <strong class="text-foreground">{{ l.notes || 'Notes' }}:</strong>
        <span class="whitespace-pre-wrap">{{ d.notes }}</span>
      </div>
      <div v-if="d.footerText" class="text-center text-muted-foreground opacity-70 text-xs">
        {{ d.footerText }}
      </div>
    </div>
  </div>
</template>
