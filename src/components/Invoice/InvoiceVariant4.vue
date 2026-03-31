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
    class="v-invoice-v4 bg-background border border-border text-foreground overflow-hidden shadow-xl rounded-2xl font-sans print:shadow-none print:border-none"
    :style="{
      '--invoice-cell-px': '0px',
      '--invoice-cell-py': compact ? '0.5rem' : '0.875rem',
      '--invoice-thead-bg': 'transparent',
      '--invoice-thead-border': '2px solid var(--color-border)',
      '--invoice-thead-color': 'var(--color-muted-foreground)',
      '--invoice-tr-border': '1px solid color-mix(in oklab, var(--color-border) 40%, transparent)',
      '--invoice-tr-hover-bg': 'color-mix(in oklab, var(--color-muted) 10%, transparent)',
      '--invoice-td-valign': 'top'
    }">
    
    <div class="bg-primary/5" :class="compact ? 'p-6' : 'p-8 sm:p-12'">
      <div class="flex flex-col md:flex-row justify-between items-start gap-8">
        
        <div class="flex flex-col gap-6 w-full md:w-auto">
          <div>
            <h1
              class="font-black tracking-tighter uppercase text-primary"
              :class="compact ? 'text-3xl' : 'text-4xl md:text-5xl'">
              {{ d.brandTitle || 'INVOICE' }}
            </h1>
            <div class="flex items-center gap-3 mt-1.5">
              <span class="font-bold text-muted-foreground" :class="compact ? 'text-base' : 'text-lg'">
                #{{ d.invoiceNumber }}
              </span>
              <span
                v-if="d.status"
                class="px-2.5 py-0.5 font-extrabold uppercase tracking-widest rounded-md border"
                :class="[getStatusColorClass(d.status), compact ? 'text-[9px]' : 'text-[10px]']">
                {{ d.status }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap gap-8 pt-2">
            <div v-if="d.issuedDate">
              <p
                class="font-bold uppercase tracking-widest text-muted-foreground"
                :class="compact ? 'text-[9px] mb-1' : 'text-[10px] mb-1.5'">
                Issue Date
              </p>
              <DateTime
                :value="d.issuedDate"
                type="date"
                class="font-extrabold text-foreground"
                :class="compact ? 'text-sm' : 'text-base'" />
            </div>
            <div v-if="d.dueDate">
              <p
                class="font-bold uppercase tracking-widest text-muted-foreground"
                :class="compact ? 'text-[9px] mb-1' : 'text-[10px] mb-1.5'">
                Due Date
              </p>
              <DateTime
                :value="d.dueDate"
                type="date"
                class="font-extrabold text-foreground"
                :class="compact ? 'text-sm' : 'text-base'" />
            </div>
          </div>
        </div>

        <div class="flex flex-col items-start md:items-end w-full md:w-auto">
          <div
            v-if="d.brandLogo"
            class="bg-white rounded-xl shadow-sm border border-border/50 p-2.5 mb-3"
            :class="compact ? 'h-12' : 'h-16'">
            <img
              :src="d.brandLogo"
              :alt="d.brandName"
              class="h-full w-auto object-contain" />
          </div>
          <h2 v-if="d.brandName" class="font-extrabold text-foreground tracking-tight" :class="compact ? 'text-lg' : 'text-xl'">
            {{ d.brandName }}
          </h2>
        </div>
      </div>
    </div>

    <div :class="compact ? 'p-6' : 'p-8 sm:p-12'">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div v-if="d.companyInfo">
          <p
            class="font-bold text-primary uppercase tracking-widest border-b-2 border-primary/20 inline-block"
            :class="compact ? 'text-[10px] mb-2.5 pb-1' : 'text-[11px] mb-3 pb-1'">
            From
          </p>
          <div
            class="text-muted-foreground leading-relaxed"
            :class="compact ? 'text-[13px] space-y-0.5' : 'text-sm space-y-1'">
            <p
              v-if="d.companyInfo.name"
              class="font-extrabold text-foreground"
              :class="compact ? 'text-sm mb-1' : 'text-base mb-1.5'">
              {{ d.companyInfo.name }}
            </p>
            <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
            <p v-if="d.companyInfo.city || d.companyInfo.state">
              {{ d.companyInfo.city }}<template v-if="d.companyInfo.city && d.companyInfo.state">, </template>{{ d.companyInfo.state }} {{ d.companyInfo.zip }}
            </p>
            <p v-if="d.companyInfo.country">{{ d.companyInfo.country }}</p>
            <div class="pt-2 flex flex-col gap-0.5">
              <p v-if="d.companyInfo.email">{{ d.companyInfo.email }}</p>
              <p v-if="d.companyInfo.phone">{{ d.companyInfo.phone }}</p>
              <p v-if="d.companyInfo.website" class="text-primary font-medium">{{ d.companyInfo.website }}</p>
            </div>
            <p v-if="d.companyInfo.taxId" class="pt-2 text-xs font-semibold">Tax ID: {{ d.companyInfo.taxId }}</p>
          </div>
        </div>

        <div v-if="d.customerInfo">
          <p
            class="font-bold text-primary uppercase tracking-widest border-b-2 border-primary/20 inline-block"
            :class="compact ? 'text-[10px] mb-2.5 pb-1' : 'text-[11px] mb-3 pb-1'">
            Billed To
          </p>
          <div
            class="text-muted-foreground leading-relaxed"
            :class="compact ? 'text-[13px] space-y-0.5' : 'text-sm space-y-1'">
            <p
              v-if="d.customerInfo.name"
              class="font-extrabold text-foreground"
              :class="compact ? 'text-sm mb-1' : 'text-base mb-1.5'">
              {{ d.customerInfo.name }}
            </p>
            <p v-if="d.customerInfo.address">{{ d.customerInfo.address }}</p>
            <p v-if="d.customerInfo.city || d.customerInfo.state">
              {{ d.customerInfo.city }}<template v-if="d.customerInfo.city && d.customerInfo.state">, </template>{{ d.customerInfo.state }} {{ d.customerInfo.zip }}
            </p>
            <p v-if="d.customerInfo.country">{{ d.customerInfo.country }}</p>
            <div class="pt-2 flex flex-col gap-0.5">
              <p v-if="d.customerInfo.email">{{ d.customerInfo.email }}</p>
              <p v-if="d.customerInfo.phone">{{ d.customerInfo.phone }}</p>
            </div>
            <p v-if="d.customerInfo.taxId" class="pt-2 text-xs font-semibold">Tax ID: {{ d.customerInfo.taxId }}</p>
          </div>
        </div>
      </div>

      <div :class="compact ? 'mb-8 overflow-x-auto' : 'mb-10 overflow-x-auto'">
        <table class="invoice-table" :class="compact ? 'text-xs' : 'text-sm'">
          <thead class="invoice-thead tracking-widest" :class="compact ? 'text-[9px]' : 'text-[11px]'">
            <tr>
              <th scope="col" class="invoice-th">
                Product
              </th>
              <th scope="col" class="invoice-th invoice-text-right">
                Qty
              </th>
              <th
                v-if="hasSize"
                scope="col"
                class="invoice-th invoice-text-right">
                Size
              </th>
              <th
                scope="col"
                class="invoice-th invoice-text-right">
                Price
              </th>
              <th
                v-if="hasDiscount"
                scope="col"
                class="invoice-th invoice-text-right">
                Discount
              </th>
              <th
                scope="col"
                class="invoice-th invoice-text-right text-primary">
                Total
              </th>
            </tr>
          </thead>
          <tbody class="invoice-tbody">
            <tr
              v-for="(item, index) in d.items"
              :key="item.id || index"
              class="invoice-tr group">
              <td class="invoice-td pr-4">
                <div class="flex items-start gap-4">
                  <div
                    v-if="item.thumbnail"
                    class="shrink-0 rounded-lg bg-muted overflow-hidden border border-border shadow-sm mt-0.5"
                    :class="compact ? 'w-10 h-10' : 'w-12 h-12'">
                    <img
                      :src="item.thumbnail"
                      :alt="item.name"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div class="min-w-0 flex-1 space-y-1">
                    <span
                      class="block font-bold truncate text-foreground"
                      :title="item.name"
                      >{{ item.name }}</span>
                    <div
                      v-if="item.sku"
                      class="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold truncate"
                      :title="item.sku">
                      SKU: {{ item.sku }}
                    </div>
                    <span
                      v-if="item.description && !compact"
                      class="block text-[11px] text-muted-foreground font-medium line-clamp-2 max-w-md whitespace-normal mt-1 leading-relaxed"
                      >{{ item.description }}</span>
                  </div>
                </div>
              </td>
              <td
                class="invoice-td invoice-text-right tabular-nums text-muted-foreground font-semibold">
                {{ item.quantity }}
              </td>
              <td
                v-if="hasSize"
                class="invoice-td invoice-text-right tabular-nums text-muted-foreground">
                {{ item.size || '-' }}
              </td>
              <td
                class="invoice-td invoice-text-right tabular-nums text-muted-foreground font-semibold">
                <Price :value="item.price" />
              </td>
              <td
                v-if="hasDiscount"
                class="invoice-td invoice-text-right tabular-nums text-success font-bold">
                <div v-if="item.discount !== undefined" class="flex flex-col items-end">
                  <Price :value="-item.discount" />
                  <span v-if="item.discountLabel" class="text-[9px] uppercase tracking-wider font-extrabold opacity-80 mt-1">{{
                    item.discountLabel
                  }}</span>
                </div>
                <span v-else class="text-muted-foreground font-normal">-</span>
              </td>
              <td
                class="invoice-td invoice-text-right tabular-nums font-bold text-foreground">
                <Price :value="item.total" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-col-reverse md:flex-row justify-between items-start"
        :class="compact ? 'gap-8' : 'gap-12'">
        
        <div class="w-full md:w-1/2 flex flex-col" :class="compact ? 'gap-5' : 'gap-6'">
          
          <div class="flex flex-row flex-wrap gap-4 items-center">
            <div
              v-if="d.qrcode"
              class="shrink-0 inline-block border border-border rounded-xl bg-white p-2 shadow-sm">
              <QRCode :value="d.qrcode" :size="compact ? 64 : 80" />
            </div>
            <div
              v-if="d.barcode"
              class="shrink-0 inline-block border border-border rounded-xl bg-white p-3 shadow-sm">
              <Barcode
                :value="d.barcode"
                format="CODE128"
                :height="compact ? 32 : 40"
                :width="compact ? 1.4 : 1.6" 
                :display-value="displayBarcodeValue" />
            </div>
          </div>

          <div v-if="d.notes" class="space-y-2 mt-2">
            <h4 class="font-bold text-muted-foreground uppercase tracking-widest text-[10px]">
              Notes & Terms
            </h4>
            <div
              class="text-muted-foreground leading-relaxed max-w-md whitespace-pre-wrap p-4 bg-muted/20 rounded-xl border border-border/50"
              :class="compact ? 'text-[13px]' : 'text-sm'">
              {{ d.notes }}
            </div>
          </div>
        </div>

        <div class="w-full md:w-[45%] min-w-[280px]">
          <div class="bg-muted/10 rounded-2xl border border-border/60 shadow-sm" :class="compact ? 'p-5 space-y-3' : 'p-7 space-y-4'">
            <div
              v-for="(total, idx) in d.totals"
              :key="idx"
              class="flex justify-between items-center"
              :class="[
                total.isGrandTotal
                  ? compact
                    ? 'pt-3 border-t-2 border-primary/20 text-lg font-black text-primary'
                    : 'pt-4 border-t-2 border-primary/20 text-xl font-black text-primary'
                  : compact
                    ? 'text-[13px] font-bold text-muted-foreground'
                    : 'text-sm font-bold text-muted-foreground',
              ]">
              <span
                :class="{
                  'uppercase tracking-widest text-xs': total.isGrandTotal && !compact,
                  'uppercase tracking-wide text-[11px]': total.isGrandTotal && compact,
                }"
                >{{ total.label }}</span>
              <Price :value="total.value" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-primary text-primary-foreground flex justify-center font-bold uppercase tracking-widest"
      :class="compact ? 'py-3 px-6 text-[9px]' : 'py-4 px-8 text-[11px]'">
      <span v-if="d.footerText">{{ d.footerText }}</span>
      <span v-else>Thank you for your business</span>
    </div>
  </div>
</template>
