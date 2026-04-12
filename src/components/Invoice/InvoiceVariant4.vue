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
    class="v-invoice-v4 bg-background border border-border text-foreground overflow-hidden rounded-xl font-sans print:shadow-none print:border-none"
    :style="{
      '--invoice-cell-px': compact ? '0.75rem' : '1rem',
      '--invoice-cell-py': compact ? '0.5rem' : '0.75rem',
      '--invoice-thead-bg': 'var(--color-muted)',
      '--invoice-thead-border': '1px solid var(--color-border)',
      '--invoice-thead-color': 'var(--color-muted-foreground)',
      '--invoice-tr-border': '1px solid var(--color-border)',
      '--invoice-tr-hover-bg': 'color-mix(in oklab, var(--color-muted) 40%, transparent)',
      '--invoice-td-valign': 'middle',
    }">
    <div class="bg-gray-900 text-white" :class="compact ? 'px-5 py-4' : 'px-6 py-5 sm:px-8'">
      <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div class="flex flex-col gap-3">
          <div>
            <h1
              class="font-black tracking-tighter uppercase leading-none text-white"
              :class="compact ? 'text-3xl' : 'text-4xl'">
              {{ d.brandTitle || l.invoice || 'INVOICE' }}
            </h1>
            <div class="flex items-center gap-2.5 mt-1.5 flex-wrap">
              <span class="font-semibold opacity-80" :class="compact ? 'text-sm' : 'text-base'">
                #{{ d.invoiceNumber }}
              </span>
              <StatusChip v-if="d.status" :status="d.status" hide-icon size="small" />
            </div>
          </div>

          <div class="flex flex-wrap gap-5">
            <div v-if="d.issuedDate">
              <p
                class="font-semibold uppercase tracking-widest opacity-60"
                :class="compact ? 'text-[9px] mb-0.5' : 'text-[10px] mb-1'">
                {{ l.issued || 'Issue Date' }}
              </p>
              <DateTime
                :value="d.issuedDate"
                type="date"
                class="font-extrabold"
                :class="compact ? 'text-sm' : 'text-base'" />
            </div>
            <div v-if="d.dueDate">
              <p
                class="font-semibold uppercase tracking-widest opacity-60"
                :class="compact ? 'text-[9px] mb-0.5' : 'text-[10px] mb-1'">
                {{ l.due || 'Due Date' }}
              </p>
              <DateTime
                :value="d.dueDate"
                type="date"
                class="font-extrabold"
                :class="compact ? 'text-sm' : 'text-base'" />
            </div>
          </div>
        </div>

        <div class="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <div
            v-if="d.brandLogo"
            class="bg-white/10 rounded-lg p-2 border border-white/20"
            :class="compact ? 'h-11' : 'h-14'">
            <Avatar
              :src="d.brandLogo"
              :alt="d.brandName"
              class="h-full w-auto object-contain"
              rounded="sm" />
          </div>
          <h2
            v-if="d.brandName"
            class="font-extrabold tracking-tight opacity-90 text-white"
            :class="compact ? 'text-base' : 'text-lg'">
            {{ d.brandName }}
          </h2>
        </div>
      </div>
    </div>

    <div :class="compact ? 'p-5' : 'px-7 py-4.5'">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6" :class="d.shippingInfo ? 'md:grid-cols-3' : 'md:grid-cols-2'">
        <div v-if="d.companyInfo">
          <p
            class="font-bold text-gray-700 uppercase tracking-widest border-b border-gray-300 pb-1 inline-block mb-2"
            :class="compact ? 'text-[10px]' : 'text-[11px]'">
            {{ l.from || 'From' }}
          </p>
          <div
            class="text-muted-foreground leading-relaxed"
            :class="compact ? 'text-xs space-y-0.5' : 'text-sm space-y-1'">
            <p
              v-if="d.companyInfo.name"
              class="font-extrabold text-foreground"
              :class="compact ? 'text-sm mb-0.5' : 'text-base mb-1'">
              {{ d.companyInfo.name }}
            </p>
            <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
            <p v-if="d.companyInfo.city || d.companyInfo.state">
              {{ d.companyInfo.city
              }}<template v-if="d.companyInfo.city && d.companyInfo.state">, </template
              >{{ d.companyInfo.state }} {{ d.companyInfo.zip }}
            </p>
            <p v-if="d.companyInfo.country">{{ d.companyInfo.country }}</p>
            <div class="flex flex-col gap-0.5">
              <p v-if="d.companyInfo.email">{{ d.companyInfo.email }}</p>
              <p v-if="d.companyInfo.phone">{{ d.companyInfo.phone }}</p>
              <p v-if="d.companyInfo.website" class="text-gray-700 font-medium">
                {{ d.companyInfo.website }}
              </p>
            </div>
            <p v-if="d.companyInfo.taxId">{{ l.taxId || 'Tax ID' }}: {{ d.companyInfo.taxId }}</p>
          </div>
        </div>

        <div v-if="d.customerInfo">
          <p
            class="font-bold text-gray-700 uppercase tracking-widest border-b border-gray-300 pb-1 inline-block mb-2"
            :class="compact ? 'text-[10px]' : 'text-[11px]'">
            {{ l.billedTo || 'Billed To' }}
          </p>
          <div
            class="text-muted-foreground leading-relaxed"
            :class="compact ? 'text-xs space-y-0.5' : 'text-sm space-y-1'">
            <p
              v-if="d.customerInfo.name"
              class="font-extrabold text-foreground"
              :class="compact ? 'text-sm mb-0.5' : 'text-base mb-1'">
              {{ d.customerInfo.name }}
            </p>
            <p v-if="d.customerInfo.address">{{ d.customerInfo.address }}</p>
            <p v-if="d.customerInfo.city || d.customerInfo.state">
              {{ d.customerInfo.city
              }}<template v-if="d.customerInfo.city && d.customerInfo.state">, </template
              >{{ d.customerInfo.state }} {{ d.customerInfo.zip }}
            </p>
            <p v-if="d.customerInfo.country">{{ d.customerInfo.country }}</p>
            <div class="flex flex-col gap-0.5">
              <p v-if="d.customerInfo.email">{{ d.customerInfo.email }}</p>
              <p v-if="d.customerInfo.phone">{{ d.customerInfo.phone }}</p>
            </div>
            <p v-if="d.customerInfo.taxId" class="text-xs font-semibold">
              {{ l.taxId || 'Tax ID' }}: {{ d.customerInfo.taxId }}
            </p>
          </div>
        </div>

        <div v-if="d.shippingInfo">
          <p
            class="font-bold text-gray-700 uppercase tracking-widest border-b border-gray-300 pb-1 inline-block mb-2"
            :class="compact ? 'text-[10px]' : 'text-[11px]'">
            {{ l.shipTo || 'Ship To' }}
          </p>
          <div
            class="text-muted-foreground leading-relaxed"
            :class="compact ? 'text-xs space-y-0.5' : 'text-sm space-y-1'">
            <p
              v-if="d.shippingInfo.name"
              class="font-extrabold text-foreground"
              :class="compact ? 'text-sm mb-0.5' : 'text-base mb-1'">
              {{ d.shippingInfo.name }}
            </p>
            <p v-if="d.shippingInfo.address">{{ d.shippingInfo.address }}</p>
            <p v-if="d.shippingInfo.city || d.shippingInfo.state">
              {{ d.shippingInfo.city
              }}<template v-if="d.shippingInfo.city && d.shippingInfo.state">, </template
              >{{ d.shippingInfo.state }} {{ d.shippingInfo.zip }}
            </p>
            <p v-if="d.shippingInfo.country">{{ d.shippingInfo.country }}</p>
            <div class="flex flex-col gap-0.5">
              <p v-if="d.shippingInfo.email">{{ d.shippingInfo.email }}</p>
              <p v-if="d.shippingInfo.phone">{{ d.shippingInfo.phone }}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="border border-border rounded-lg overflow-x-auto"
        :class="compact ? 'mb-5' : 'mb-6'">
        <table class="invoice-table" :class="compact ? 'text-xs' : 'text-sm'">
          <thead class="invoice-thead uppercase" :class="compact ? 'text-[9px]' : 'text-[10px]'">
            <tr>
              <th scope="col" class="invoice-th font-bold">{{ l.item || 'Product' }}</th>
              <th scope="col" class="invoice-th invoice-text-right font-bold">
                {{ l.qty || 'Qty' }}
              </th>
              <th v-if="hasSize" scope="col" class="invoice-th invoice-text-right font-bold">
                {{ l.size || 'Size' }}
              </th>
              <th scope="col" class="invoice-th invoice-text-right font-bold">
                {{ l.price || 'Price' }}
              </th>
              <th v-if="hasDiscount" scope="col" class="invoice-th invoice-text-right font-bold">
                {{ l.discount || 'Discount' }}
              </th>
              <th scope="col" class="invoice-th invoice-text-right font-bold text-gray-900">
                {{ l.total || 'Total' }}
              </th>
            </tr>
          </thead>
          <tbody class="invoice-tbody">
            <tr v-for="(item, index) in d.items" :key="item.id || index" class="invoice-tr group">
              <td class="invoice-td">
                <div class="flex items-center gap-3">
                  <div
                    v-if="item.thumbnail"
                    class="shrink-0 overflow-hidden border border-border"
                    :class="compact ? 'w-9 h-9 rounded-md' : 'w-10 h-10 rounded-lg'">
                    <Avatar
                      :src="item.thumbnail"
                      :alt="item.name"
                      class="w-full h-full"
                      rounded="sm" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span
                      class="block truncate font-semibold text-foreground text-sm"
                      :title="item.name"
                      >{{ item.name }}</span
                    >
                    <div
                      v-if="item.sku"
                      class="text-xs uppercase tracking-widest text-muted-foreground font-medium truncate mt-0.5"
                      :title="item.sku">
                      {{ l.sku || 'SKU' }}: {{ item.sku }}
                    </div>
                    <span
                      v-if="item.description && !compact"
                      class="block text-xs text-muted-foreground line-clamp-2 max-w-md whitespace-normal mt-0.5 leading-relaxed">
                      {{ item.description }}
                    </span>
                  </div>
                </div>
              </td>
              <td
                class="invoice-td invoice-text-right tabular-nums text-muted-foreground font-semibold text-sm">
                {{ item.quantity }}
              </td>
              <td
                v-if="hasSize"
                class="invoice-td invoice-text-right tabular-nums text-muted-foreground text-sm">
                {{ item.size || '-' }}
              </td>
              <td
                class="invoice-td invoice-text-right tabular-nums text-muted-foreground font-medium">
                <Price :value="item.price" class="text-sm" />
              </td>
              <td
                v-if="hasDiscount"
                class="invoice-td invoice-text-right tabular-nums text-success font-bold">
                <div v-if="item.discount !== undefined" class="flex flex-col items-end">
                  <Price :value="-item.discount" class="text-sm" />
                  <span
                    v-if="item.discountLabel"
                    class="text-sm uppercase tracking-wider font-extrabold opacity-80 mt-0.5"
                    >{{ item.discountLabel }}</span
                  >
                </div>
                <span v-else class="text-muted-foreground font-normal">-</span>
              </td>
              <td class="invoice-td invoice-text-right tabular-nums font-bold text-foreground">
                <Price :value="item.total" class="text-sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="flex flex-col-reverse md:flex-row justify-between items-start"
        :class="compact ? 'gap-5' : 'gap-6'">
        <div class="w-full md:w-1/2 flex flex-col" :class="compact ? 'gap-3' : 'gap-4'">
          <div class="flex flex-row flex-wrap gap-2 items-center">
            <div v-if="d.qrcode" class="shrink-0 inline-block">
              <QRCode :value="d.qrcode" :size="compact ? 56 : 72" />
            </div>
            <div v-if="d.barcode" class="shrink-0 inline-block overflow-hidden">
              <Barcode
                :value="d.barcode"
                format="CODE128"
                :height="compact ? 28 : 40"
                :width="compact ? 1.3 : 1.5"
                :display-value="displayBarcodeValue" />
            </div>
          </div>

          <div v-if="d.notes">
            <h4
              class="font-bold text-muted-foreground uppercase tracking-widest mb-1.5"
              :class="compact ? 'text-[9px]' : 'text-[10px]'">
              {{ l.notes || 'Notes & Terms' }}
            </h4>
            <div
              class="text-muted-foreground leading-relaxed whitespace-pre-wrap p-3 bg-muted/30 rounded-lg border border-border"
              :class="compact ? 'text-xs max-w-xs' : 'text-xs max-w-sm'">
              {{ d.notes }}
            </div>
          </div>
        </div>

        <div class="w-full md:w-[42%] min-w-[260px]">
          <InvoiceTotals :totals="d.totals" :compact="compact" variant="Variant4" />
        </div>
      </div>
    </div>

    <div
      class="bg-gray-900 text-white flex justify-center font-bold uppercase tracking-widest"
      :class="compact ? 'py-2 px-4 text-[9px]' : 'py-2.5 px-6 text-[10px]'">
      <span v-if="d.footerText">{{ d.footerText }}</span>
      <span v-else>Thank you for your business</span>
    </div>
  </div>
</template>
