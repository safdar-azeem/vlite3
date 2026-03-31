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
    class="v-invoice-v1 bg-background text-foreground rounded-xl border border-border overflow-hidden shadow-sm"
    :style="{
      '--text-sm': compact ? '13px' : '14px',
      '--invoice-cell-px': compact ? '1rem' : '1.5rem',
      '--invoice-cell-py': compact ? '0.75rem' : '1rem',
      '--invoice-thead-bg': 'color-mix(in oklab, var(--color-muted) 50%, transparent)',
      '--invoice-tr-border': '1px solid color-mix(in oklab, var(--color-border) 60%, transparent)',
      '--invoice-tr-hover-bg': 'color-mix(in oklab, var(--color-muted) 20%, transparent)',
    }">
    <div
      class="flex flex-col md:flex-row justify-between items-start border-b border-border bg-muted/10"
      :class="compact ? 'gap-4 p-6' : 'gap-6 p-8'">
      
      <div class="flex flex-col" :class="compact ? 'space-y-3' : 'space-y-5'">
        <div v-if="d.brandLogo" :class="compact ? 'h-10' : 'h-14'">
          <img :src="d.brandLogo" :alt="d.brandName" class="h-full object-contain" />
        </div>
        <div>
          <h2 v-if="d.brandName" class="tracking-tight" :class="compact ? 'text-lg font-bold' : 'text-2xl font-bold'">
            {{ d.brandName }}
          </h2>
          <div v-if="d.companyInfo" class="mt-1.5 text-muted-foreground space-y-0.5 text-sm">
            <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
            <p v-if="d.companyInfo.city || d.companyInfo.state || d.companyInfo.zip">
              {{ d.companyInfo.city }}<template v-if="d.companyInfo.city && d.companyInfo.state">, </template>{{ d.companyInfo.state }} {{ d.companyInfo.zip }}
            </p>
            <p v-if="d.companyInfo.country">{{ d.companyInfo.country }}</p>
            <div v-if="d.companyInfo.email || d.companyInfo.phone" class="pt-1 flex flex-col gap-0.5">
              <p v-if="d.companyInfo.email">{{ d.companyInfo.email }}</p>
              <p v-if="d.companyInfo.phone">{{ d.companyInfo.phone }}</p>
            </div>
            <p v-if="d.companyInfo.taxId" class="pt-1 text-xs">Tax ID: {{ d.companyInfo.taxId }}</p>
          </div>
        </div>
      </div>

      <div class="text-left md:text-right shrink-0 flex flex-col items-start md:items-end" :class="compact ? 'space-y-3' : 'space-y-5'">
        <div>
          <h1
            class="font-extrabold tracking-tight text-primary uppercase"
            :class="compact ? 'text-2xl' : 'text-4xl'">
            {{ d.brandTitle || 'Invoice' }}
          </h1>
          <p
            class="font-semibold mt-1 text-muted-foreground tracking-wider"
            :class="compact ? 'text-sm' : 'text-base'">
            #{{ d.invoiceNumber }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-border/50 bg-background" :class="compact ? 'p-6' : 'p-8'">
      
      <div v-if="d.customerInfo" :class="compact ? 'space-y-1.5' : 'space-y-2'">
        <h3 class="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Billed To
        </h3>
        <p class="font-bold text-foreground" :class="compact ? 'text-base' : 'text-lg'">{{ d.customerInfo.name }}</p>
        <div class="text-muted-foreground space-y-0.5 text-sm">
          <p v-if="d.customerInfo.address">{{ d.customerInfo.address }}</p>
          <p v-if="d.customerInfo.city || d.customerInfo.state">
            {{ d.customerInfo.city }}<template v-if="d.customerInfo.city && d.customerInfo.state">, </template>{{ d.customerInfo.state }} {{ d.customerInfo.zip }}
          </p>
          <p v-if="d.customerInfo.country">{{ d.customerInfo.country }}</p>
          <div v-if="d.customerInfo.email || d.customerInfo.phone" class="pt-1 flex flex-col gap-0.5">
            <p v-if="d.customerInfo.email">{{ d.customerInfo.email }}</p>
            <p v-if="d.customerInfo.phone">{{ d.customerInfo.phone }}</p>
          </div>
          <p v-if="d.customerInfo.taxId" class="pt-1 text-xs">Tax ID: {{ d.customerInfo.taxId }}</p>
        </div>
      </div>
      <div v-else></div>

      <div class="flex flex-col md:items-end justify-center space-y-3">
        <div class="grid grid-cols-[100px_1fr] md:grid-cols-[auto_auto] gap-x-4 gap-y-2 text-sm items-center">
          <span v-if="d.issuedDate" class="text-muted-foreground font-medium uppercase tracking-wider text-xs md:text-right">Issued</span>
          <DateTime v-if="d.issuedDate" :value="d.issuedDate" type="date" class="font-semibold text-foreground md:text-right" />

          <span v-if="d.dueDate" class="text-muted-foreground font-medium uppercase tracking-wider text-xs md:text-right">Due</span>
          <DateTime v-if="d.dueDate" :value="d.dueDate" type="date" class="font-semibold text-foreground md:text-right" />
        </div>
        
        <div
          v-if="d.status"
          class="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mt-2 border border-current/20"
          :class="getStatusColorClass(d.status)">
          {{ d.status }}
        </div>
      </div>
    </div>

    <div :class="compact ? 'p-6 space-y-6' : 'p-8 space-y-8'">
      
      <div
        v-if="d.items && d.items.length"
        class="overflow-x-auto rounded-xl border border-border bg-background shadow-sm">
        <table class="invoice-table" :class="compact ? 'text-xs' : 'text-sm'">
          <thead class="invoice-thead">
            <tr>
              <th scope="col" class="invoice-th">Description</th>
              <th scope="col" class="invoice-th invoice-text-right">
                Qty
              </th>
              <th
                v-if="hasSize"
                scope="col"
                class="invoice-th invoice-text-right">
                Size
              </th>
              <th scope="col" class="invoice-th invoice-text-right">
                Price
              </th>
              <th
                v-if="hasDiscount"
                scope="col"
                class="invoice-th invoice-text-right">
                Discount
              </th>
              <th scope="col" class="invoice-th invoice-text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody class="invoice-tbody">
            <tr
              v-for="(item, index) in d.items"
              :key="item.id || index"
              class="invoice-tr group">
              <td class="invoice-td">
                <div class="flex items-start gap-4">
                  <div
                    v-if="item.thumbnail"
                    class="shrink-0 rounded-lg bg-muted overflow-hidden border border-border shadow-sm"
                    :class="compact ? 'w-10 h-10' : 'w-12 h-12'">
                    <img
                      :src="item.thumbnail"
                      :alt="item.name"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div class="space-y-1 min-w-0 flex-1">
                    <div class="font-semibold text-foreground text-sm whitespace-normal" :title="item.name">
                      {{ item.name }}
                    </div>
                    <div
                      v-if="item.sku"
                      class="text-[10px] uppercase tracking-widest text-muted-foreground font-medium truncate"
                      :title="item.sku">
                      SKU: {{ item.sku }}
                    </div>
                    <div
                      v-if="item.description && !compact"
                      class="text-xs text-muted-foreground line-clamp-2 max-w-[320px] whitespace-normal mt-0.5">
                      {{ item.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td
                class="invoice-td invoice-text-right tabular-nums font-medium text-sm">
                {{ item.quantity }}
              </td>
              <td
                v-if="hasSize"
                class="invoice-td invoice-text-right tabular-nums text-muted-foreground text-sm">
                {{ item.size || '-' }}
              </td>
              <td
                class="invoice-td invoice-text-right tabular-nums text-sm font-medium">
                <Price :value="item.price" />
              </td>
              <td
                v-if="hasDiscount"
                class="invoice-td invoice-text-right tabular-nums text-success font-semibold">
                <div v-if="item.discount !== undefined" class="flex flex-col items-end">
                  <Price :value="-item.discount" class="text-sm" />
                  <span v-if="item.discountLabel" class="text-[10px] uppercase tracking-wider font-bold opacity-80 mt-0.5">{{
                    item.discountLabel
                  }}</span>
                </div>
                <span v-else class="text-muted-foreground font-normal">-</span>
              </td>
              <td
                class="invoice-td invoice-text-right tabular-nums font-bold text-foreground">
                <Price :value="item.total" class="text-sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-col-reverse lg:flex-row justify-between"
        :class="compact ? 'gap-6 pt-2' : 'gap-10 pt-4'">
        
        <div class="w-full lg:w-1/2 flex flex-col" :class="compact ? 'gap-4' : 'gap-5'">
          
          <div v-if="d.notes" class="space-y-2">
            <h4 class="font-bold text-muted-foreground uppercase tracking-widest text-xs">
              Notes / Terms
            </h4>
            <div
              class="text-muted-foreground whitespace-pre-wrap leading-relaxed rounded-xl border border-border/50 text-sm"
              :class="compact ? 'p-3 bg-muted/10' : 'p-4 bg-muted/20'">
              {{ d.notes }}
            </div>
          </div>

          <div class="flex flex-row flex-wrap gap-3 items-center">
            <div v-if="d.qrcode" class="shrink-0 p-1 bg-white rounded-lg border border-border/50 shadow-sm">
              <QRCode :value="d.qrcode" :size="compact ? 48 : 56" />
            </div>
            <div v-if="d.barcode" class="shrink-0 p-1.5 bg-white rounded-lg border border-border/50 shadow-sm">
              <Barcode
                :value="d.barcode"
                format="CODE128"
                :height="compact ? 24 : 32"
                :width="compact ? 1.2 : 1.4" 
                :display-value="displayBarcodeValue" />
            </div>
          </div>
        </div>

        <div class="w-full lg:w-1/3 min-w-[260px]">
          <div
            class="rounded-xl bg-muted/10 border border-border shadow-sm"
            :class="compact ? 'p-4 space-y-2' : 'p-6 space-y-3'">
            <div
              v-for="(total, idx) in d.totals"
              :key="idx"
              class="flex justify-between items-center"
              :class="[
                total.isGrandTotal
                  ? compact
                    ? 'pt-3 border-t border-border mt-3 text-lg font-black text-foreground'
                    : 'pt-4 border-t border-border mt-4 text-xl font-black text-foreground'
                  : 'text-sm text-muted-foreground font-semibold',
              ]">
              <span :class="{'uppercase tracking-widest text-xs': total.isGrandTotal}">{{ total.label }}</span>
              <Price :value="total.value" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="d.footerText"
      class="bg-muted border-t border-border text-center text-muted-foreground font-medium uppercase tracking-widest"
      :class="compact ? 'px-6 py-3 text-[10px]' : 'px-6 py-4 text-xs'">
      {{ d.footerText }}
    </div>
  </div>
</template>
