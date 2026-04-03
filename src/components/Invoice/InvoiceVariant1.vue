<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceData, InvoiceLabels } from './types'
import { Price } from '../Price'
import { DateTime } from '../DateTime'
import { getStatusColorClass } from '@/utils/status'
import { Barcode } from '../Barcode'
import { QRCode } from '../QRCode'
import Avatar from '../Avatar.vue'
import StatusChip from '../StatusChip/StatusChip.vue'

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
    class="v-invoice-v1 bg-background text-foreground border border-border rounded-sm"
    :style="{
      '--text-sm': compact ? '12.5px' : '13.5px',
      '--invoice-cell-px': compact ? '0.875rem' : '1.25rem',
      '--invoice-cell-py': compact ? '0.625rem' : '0.875rem',
      '--invoice-thead-bg': 'var(--color-muted)',
      '--invoice-tr-border': '1px solid var(--color-border)',
      '--invoice-tr-hover-bg': 'color-mix(in oklab, var(--color-muted) 40%, transparent)',
    }">
    <div class="border-b border-border" :class="compact ? 'px-5 py-3' : 'px-6 pt-5 pb-3.5'">
      <div class="flex items-center justify-between gap-3">
        <div class="shrink-0">
          <div :class="compact ? 'h-10 w-10' : 'h-13 w-13'">
            <Avatar
              :src="d.brandLogo"
              :alt="d.brandName"
              class="h-full w-auto object-contain"
              rounded="md" />
          </div>
        </div>

        <div class="flex-1 min-w-0" :class="compact ? 'space-y-0.5' : 'space-y-1'">
          <p
            v-if="d.brandName"
            class="font-bold text-foreground leading-tight truncate"
            :class="compact ? 'text-base' : 'text-lg'">
            {{ d.brandName }}
          </p>
          <p
            v-if="d.brandTitle"
            class="text-muted-foreground font-medium truncate"
            :class="compact ? 'text-xs' : 'text-sm'">
            {{ d.brandTitle }}
          </p>
        </div>

        <div class="text-right shrink-0" :class="compact ? 'space-y-2' : 'space-y-3'">
          <div>
            <h1
              class="font-black tracking-tight text-foreground uppercase"
              :class="compact ? 'text-2xl' : 'text-3xl'">
              {{ l.invoice || 'Invoice' }}
            </h1>
            <p
              class="text-muted-foreground font-medium mt-0.5"
              :class="compact ? 'text-xs' : 'text-sm'">
              #{{ d.invoiceNumber }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4 text-xs" :class="compact ? 'mt-2' : 'mt-4'">
        <div
          v-if="d.issuedDate"
          class="flex items-center gap-3 border-r-[1.5px] pr-3 border-gray-300">
          <span class="text-muted-foreground uppercase tracking-wider font-medium"> {{ l.issued || 'Issued' }} </span>
          <DateTime
            :value="d.issuedDate"
            type="date"
            class="font-semibold text-foreground tabular-nums" />
        </div>
        <div v-if="d.dueDate" class="flex items-center gap-3 border-r-[1.5px] pr-3 border-gray-250">
          <span class="text-muted-foreground uppercase tracking-wider font-medium"> {{ l.due || 'Due' }} </span>
          <DateTime
            :value="d.dueDate"
            type="date"
            class="font-semibold text-foreground tabular-nums" />
        </div>
        <StatusChip v-if="d.status" :status="d.status" hide-icon size="small" />
      </div>
    </div>

    <div
      v-if="d.companyInfo || d.customerInfo"
      class="border-b border-border"
      :class="compact ? 'px-5 py-4' : 'px-6 pt-4 pb-5'">
      <div class="grid grid-cols-2 gap-8">
        <div v-if="d.companyInfo">
          <p
            class="text-muted-foreground uppercase tracking-widest font-semibold mb-2"
            :class="compact ? 'text-[9px]' : 'text-[10px]'">
            {{ l.from || 'From' }}
          </p>
          <p
            v-if="d.brandName"
            class="font-bold text-foreground"
            :class="compact ? 'text-sm' : 'text-base'">
            {{ d.brandName }}
          </p>
          <div
            class="text-muted-foreground leading-snug mt-1"
            :class="compact ? 'text-xs space-y-0.5' : 'text-sm space-y-0.5'">
            <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
            <p v-if="d.companyInfo.city || d.companyInfo.state || d.companyInfo.zip">
              {{ d.companyInfo.city
              }}<template v-if="d.companyInfo.city && d.companyInfo.state">, </template
              >{{ d.companyInfo.state }} {{ d.companyInfo.zip }}
            </p>
            <p v-if="d.companyInfo.country">{{ d.companyInfo.country }}</p>
            <p v-if="d.companyInfo.email" class="pt-0.5">{{ d.companyInfo.email }}</p>
            <p v-if="d.companyInfo.phone">{{ d.companyInfo.phone }}</p>
            <p v-if="d.companyInfo.taxId" class="pt-0.5">{{ l.taxId || 'Tax ID' }}: {{ d.companyInfo.taxId }}</p>
          </div>
        </div>

        <div v-if="d.customerInfo">
          <p
            class="text-muted-foreground uppercase tracking-widest font-semibold mb-2"
            :class="compact ? 'text-[9px]' : 'text-[10px]'">
            {{ l.billedTo || 'Billed To' }}
          </p>
          <p class="font-bold text-foreground" :class="compact ? 'text-sm' : 'text-base'">
            {{ d.customerInfo.name }}
          </p>
          <div
            class="text-muted-foreground leading-snug mt-1"
            :class="compact ? 'text-xs space-y-0.5' : 'text-sm space-y-0.5'">
            <p v-if="d.customerInfo.address">{{ d.customerInfo.address }}</p>
            <p v-if="d.customerInfo.city || d.customerInfo.state">
              {{ d.customerInfo.city
              }}<template v-if="d.customerInfo.city && d.customerInfo.state">, </template
              >{{ d.customerInfo.state }} {{ d.customerInfo.zip }}
            </p>
            <p v-if="d.customerInfo.country">{{ d.customerInfo.country }}</p>
            <p v-if="d.customerInfo.email" class="pt-0.5">{{ d.customerInfo.email }}</p>
            <p v-if="d.customerInfo.phone">{{ d.customerInfo.phone }}</p>
            <p v-if="d.customerInfo.taxId" class="pt-0.5">{{ l.taxId || 'Tax ID' }}: {{ d.customerInfo.taxId }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="d.items && d.items.length" class="border-b border-border overflow-x-auto">
      <table class="invoice-table" :class="compact ? 'text-xs' : 'text-sm'">
        <thead class="invoice-thead">
          <tr>
            <th scope="col" class="invoice-th">{{ l.item || 'Description' }}</th>
            <th scope="col" class="invoice-th invoice-text-right">{{ l.qty || 'Qty' }}</th>
            <th v-if="hasSize" scope="col" class="invoice-th invoice-text-right">{{ l.size || 'Size' }}</th>
            <th scope="col" class="invoice-th invoice-text-right">{{ l.price || 'Unit Price' }}</th>
            <th v-if="hasDiscount" scope="col" class="invoice-th invoice-text-right">{{ l.discount || 'Discount' }}</th>
            <th scope="col" class="invoice-th invoice-text-right">{{ l.total || 'Total' }}</th>
          </tr>
        </thead>
        <tbody class="invoice-tbody">
          <tr v-for="(item, index) in d.items" :key="item.id || index" class="invoice-tr group">
            <td class="invoice-td">
              <div class="flex items-start gap-3">
                <div
                  v-if="item.thumbnail"
                  class="shrink-0 overflow-hidden"
                  :class="compact ? 'w-9 h-9' : 'w-10 h-10'">
                  <Avatar
                    :src="item.thumbnail"
                    :alt="item.name"
                    class="w-full h-full ronded!"
                    rounded="md" />
                </div>
                <div class="min-w-0 flex-1">
                  <p
                    class="font-semibold text-foreground whitespace-normal text-sm"
                    :title="item.name">
                    {{ item.name }}
                  </p>
                  <p
                    v-if="item.sku"
                    class="text-muted-foreground uppercase tracking-wider font-medium mt-0.5 text-xs">
                    {{ l.sku || 'SKU' }}: {{ item.sku }}
                  </p>
                  <p
                    v-if="item.description && !compact"
                    class="text-muted-foreground mt-0.5 whitespace-normal max-w-xs text-xs leading-snug">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </td>
            <td class="invoice-td invoice-text-right tabular-nums font-medium text-sm">
              {{ item.quantity }}
            </td>
            <td
              v-if="hasSize"
              class="invoice-td invoice-text-right tabular-nums text-muted-foreground">
              {{ item.size || '—' }}
            </td>
            <td class="invoice-td invoice-text-right tabular-nums">
              <Price :value="item.price" class="text-sm" />
            </td>
            <td
              v-if="hasDiscount"
              class="invoice-td invoice-text-right tabular-nums text-success font-semibold">
              <div v-if="item.discount !== undefined" class="flex flex-col items-end gap-0.5">
                <Price :value="-item.discount" class="text-sm" />
                <span
                  v-if="item.discountLabel"
                  class="uppercase tracking-wider font-bold text-muted-foreground"
                  :class="compact ? 'text-[8px]' : 'text-[9px]'">
                  {{ item.discountLabel }}
                </span>
              </div>
              <span v-else class="text-muted-foreground font-normal">—</span>
            </td>
            <td class="invoice-td invoice-text-right tabular-nums font-bold text-foreground">
              <Price :value="item.total" class="text-sm" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div :class="compact ? 'p-6' : 'p-8'">
      <div
        class="flex flex-col-reverse lg:flex-row justify-between"
        :class="compact ? 'gap-6' : 'gap-8'">
        <div class="w-full lg:w-1/2 flex flex-col" :class="compact ? 'gap-4' : 'gap-5'">
          <div v-if="d.notes">
            <p
              class="text-muted-foreground uppercase tracking-widest font-semibold mb-2"
              :class="compact ? 'text-[9px]' : 'text-[10px]'">
              {{ l.notes || 'Notes' }}
            </p>
            <p
              class="text-muted-foreground whitespace-pre-wrap leading-relaxed"
              :class="compact ? 'text-xs' : 'text-sm'">
              {{ d.notes }}
            </p>
          </div>

          <div v-if="d.qrcode || d.barcode" class="flex flex-row flex-wrap gap-3 items-center">
            <div v-if="d.qrcode" class="shrink-0 p-1 bg-white border border-border">
              <QRCode :value="d.qrcode" :size="compact ? 48 : 56" />
            </div>
            <div v-if="d.barcode" class="shrink-0 p-1.5 bg-white border border-border">
              <Barcode
                :value="d.barcode"
                format="CODE128"
                :height="compact ? 24 : 30"
                :width="compact ? 1.2 : 1.4"
                :display-value="displayBarcodeValue" />
            </div>
          </div>
        </div>

        <div class="w-full lg:w-2/5 min-w-[220px]">
          <div :class="compact ? 'space-y-1.5' : 'space-y-2'">
            <div
              v-for="(total, idx) in d.totals"
              :key="idx"
              class="flex justify-between items-center"
              :class="[
                total.isGrandTotal
                  ? [
                      'border-t border-border font-black text-foreground',
                      compact ? 'pt-2 mt-1 text-base' : 'pt-3 mt-2 text-lg',
                    ]
                  : ['text-muted-foreground font-medium', compact ? 'text-xs' : 'text-sm'],
              ]">
              <span :class="total.isGrandTotal ? 'uppercase tracking-widest text-xs' : ''">
                {{ total.label }}
              </span>
              <Price :value="total.value" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="d.footerText"
      class="border-t border-border text-center text-muted-foreground font-medium uppercase tracking-widest"
      :class="compact ? 'px-6 py-3 text-[9px]' : 'px-6 py-4 text-[10px]'">
      {{ d.footerText }}
    </div>
  </div>
</template>
