<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceData } from './types'
import { Price } from '../Price'
import { DateTime } from '../DateTime'
import { getStatusColorClass } from '@/utils/status'
import { Barcode } from '../Barcode'
import { QRCode } from '../QRCode'

const props = withDefaults(
  defineProps<{
    data: InvoiceData
    /** Reduces padding, spacing, and font sizes for print-friendly output */
    compact?: boolean
    /** Toggles the display of the barcode text value underneath the bars */
    displayBarcodeValue?: boolean
  }>(),
  { compact: false, displayBarcodeValue: false }
)

const d = computed(() => props.data)
const hasSize = computed(() => d.value.items.some((item) => !!item.size))
const hasDiscount = computed(() => d.value.items.some((item) => item.discount !== undefined))
</script>

<template>
  <div
    class="v-invoice-v1 bg-body text-foreground max-w-5xl mx-auto sm:border sm:border-border print:border-none print:shadow-none"
    :class="compact ? 'p-4 sm:p-6' : 'p-6 sm:p-8'"
    :style="{
      '--invoice-cell-px': compact ? '0.5rem' : '0.75rem',
      '--invoice-cell-py': compact ? '0.5rem' : '0.75rem',
      '--invoice-thead-bg': 'transparent',
      '--invoice-thead-border': '2px solid var(--color-border)',
      '--invoice-tr-border': '1px solid var(--color-border)',
      '--invoice-tr-hover-bg': 'transparent',
    }">

    <div class="flex flex-col gap-8 print:gap-6">
      <div class="flex flex-col md:flex-row justify-between items-start gap-4">
        <div class="space-y-3 flex-1">
          <div v-if="d.brandLogo" :class="compact ? 'h-10' : 'h-14'">
            <img :src="d.brandLogo" :alt="d.brandName" class="h-full object-contain print:grayscale" />
          </div>
          <h2 v-else-if="d.brandName" class="font-bold text-2xl tracking-tight text-foreground">
            {{ d.brandName }}
          </h2>
        </div>
        <div class="text-left md:text-right space-y-1">
          <h1 class="text-3xl md:text-4xl font-light uppercase tracking-widest text-foreground/80">
            {{ d.brandTitle || 'Invoice' }}
          </h1>
          <p class="text-base font-medium text-muted-foreground">
            #{{ d.invoiceNumber }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 border-y border-border py-4 print:py-3">
        <div class="flex flex-col md:flex-row gap-6">
          <div v-if="d.companyInfo" class="flex-1 space-y-1 text-sm">
            <p class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">From</p>
            <p v-if="d.companyInfo.name" class="font-bold text-foreground">{{ d.companyInfo.name }}</p>
            <div class="text-muted-foreground space-y-0.5">
              <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
              <p v-if="d.companyInfo.city || d.companyInfo.state">
                {{ d.companyInfo.city }}<template v-if="d.companyInfo.city && d.companyInfo.state">, </template>{{ d.companyInfo.state }} {{ d.companyInfo.zip }}
              </p>
              <p v-if="d.companyInfo.country">{{ d.companyInfo.country }}</p>
              <p v-if="d.companyInfo.email">{{ d.companyInfo.email }}</p>
              <p v-if="d.companyInfo.phone">{{ d.companyInfo.phone }}</p>
              <p v-if="d.companyInfo.taxId" class="pt-1 text-xs">Tax ID: {{ d.companyInfo.taxId }}</p>
            </div>
          </div>

          <div v-if="d.customerInfo" class="flex-1 space-y-1 text-sm">
            <p class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Bill To</p>
            <p v-if="d.customerInfo.name" class="font-bold text-foreground">{{ d.customerInfo.name }}</p>
            <div class="text-muted-foreground space-y-0.5">
              <p v-if="d.customerInfo.address">{{ d.customerInfo.address }}</p>
              <p v-if="d.customerInfo.city || d.customerInfo.state">
                {{ d.customerInfo.city }}<template v-if="d.customerInfo.city && d.customerInfo.state">, </template>{{ d.customerInfo.state }} {{ d.customerInfo.zip }}
              </p>
              <p v-if="d.customerInfo.country">{{ d.customerInfo.country }}</p>
              <p v-if="d.customerInfo.email">{{ d.customerInfo.email }}</p>
              <p v-if="d.customerInfo.phone">{{ d.customerInfo.phone }}</p>
              <p v-if="d.customerInfo.taxId" class="pt-1 text-xs">Tax ID: {{ d.customerInfo.taxId }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col justify-start md:items-end text-sm space-y-2">
          <div class="grid grid-cols-2 md:grid-cols-[auto_auto] gap-x-4 gap-y-1 text-left md:text-right w-full md:w-auto">
            <template v-if="d.issuedDate">
              <span class="text-muted-foreground">Issue Date</span>
              <DateTime :value="d.issuedDate" type="date" class="font-medium text-foreground" />
            </template>
            <template v-if="d.dueDate">
              <span class="text-muted-foreground">Due Date</span>
              <DateTime :value="d.dueDate" type="date" class="font-medium text-foreground" />
            </template>
            <template v-if="d.status">
              <span class="text-muted-foreground">Status</span>
              <span class="font-bold uppercase tracking-wider text-[11px]" :class="getStatusColorClass(d.status)">{{ d.status }}</span>
            </template>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="invoice-table w-full text-sm">
          <thead class="invoice-thead tracking-wider text-[10px]">
            <tr>
              <th scope="col" class="invoice-th pl-0 font-bold">Description</th>
              <th scope="col" class="invoice-th invoice-text-right font-bold">Qty</th>
              <th v-if="hasSize" scope="col" class="invoice-th invoice-text-right font-bold">Size</th>
              <th scope="col" class="invoice-th invoice-text-right font-bold">Price</th>
              <th v-if="hasDiscount" scope="col" class="invoice-th invoice-text-right font-bold">Discount</th>
              <th scope="col" class="invoice-th invoice-text-right pr-0 font-bold">Total</th>
            </tr>
          </thead>
          <tbody class="invoice-tbody">
            <tr v-for="(item, index) in d.items" :key="item.id || index" class="invoice-tr">
              <td class="invoice-td pl-0">
                <div class="flex items-start gap-3">
                  <div v-if="item.thumbnail" class="shrink-0 w-8 h-8 rounded-sm bg-muted overflow-hidden border border-border print:grayscale">
                    <img :src="item.thumbnail" :alt="item.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="space-y-0.5 min-w-0">
                    <p class="text-foreground truncate" :class="compact ? 'font-semibold' : 'text-xs font-normal'" :title="item.name">{{ item.name }}</p>
                    <p v-if="item.sku" class="text-[10px] text-muted-foreground uppercase tracking-widest truncate" :title="item.sku">SKU: {{ item.sku }}</p>
                    <p v-if="item.description && !compact" class="text-muted-foreground max-w-sm mt-1 whitespace-normal text-[11px]">
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="invoice-td invoice-text-right tabular-nums text-muted-foreground" :class="compact ? '' : 'text-xs'">{{ item.quantity }}</td>
              <td v-if="hasSize" class="invoice-td invoice-text-right tabular-nums text-muted-foreground" :class="compact ? '' : 'text-xs'">{{ item.size || '-' }}</td>
              <td class="invoice-td invoice-text-right tabular-nums text-muted-foreground" :class="compact ? '' : 'text-xs'"><Price :value="item.price" /></td>
              <td v-if="hasDiscount" class="invoice-td invoice-text-right tabular-nums text-muted-foreground" :class="compact ? '' : 'text-xs'">
                <div v-if="item.discount !== undefined" class="flex flex-col items-end">
                  <Price :value="-item.discount" />
                  <span v-if="item.discountLabel" class="text-[9px] uppercase tracking-wider opacity-80 mt-0.5">{{ item.discountLabel }}</span>
                </div>
                <span v-else>-</span>
              </td>
              <td class="invoice-td invoice-text-right tabular-nums font-medium text-foreground pr-0" :class="compact ? '' : 'text-xs'"><Price :value="item.total" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col md:flex-row justify-between items-start gap-6 pt-3">
        <div class="w-full md:w-1/2 space-y-4">
          <div v-if="d.notes" class="space-y-1">
            <h4 class="font-bold text-foreground uppercase tracking-widest text-[10px]">Notes</h4>
            <div class="text-muted-foreground whitespace-pre-wrap leading-relaxed" :class="compact ? 'text-sm' : 'text-xs'">{{ d.notes }}</div>
          </div>
          <div class="flex flex-wrap gap-4 items-center">
            <div v-if="d.qrcode" class="border border-border p-1.5 rounded-sm bg-white">
              <QRCode :value="d.qrcode" :size="56" />
            </div>
            <div v-if="d.barcode" class="border border-border p-2 rounded-sm bg-white">
              <Barcode :value="d.barcode" format="CODE128" :height="28" :width="1.2" :display-value="displayBarcodeValue" />
            </div>
          </div>
        </div>

        <div class="w-full md:w-[35%] min-w-[240px]">
          <div class="space-y-2">
            <div v-for="(total, idx) in d.totals" :key="idx" class="flex justify-between items-center" :class="[
                total.isGrandTotal ? 'pt-3 border-t-2 border-border mt-3 text-lg font-bold text-foreground' : 'text-sm text-muted-foreground'
              ]">
              <span :class="{'uppercase tracking-widest text-[11px]': total.isGrandTotal}">{{ total.label }}</span>
              <Price :value="total.value" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="d.footerText" class="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground uppercase tracking-widest">
        {{ d.footerText }}
      </div>
    </div>
  </div>
</template>
