<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceData } from './types'
import { Price } from '../Price'
import { DateTime } from '../DateTime'
import { StatusChip } from '../StatusChip'
import { Barcode } from '../Barcode'

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
    class="v-invoice-v4 bg-background border border-border text-foreground overflow-hidden rounded-2xl shadow-lg font-sans">
    <!-- Hero Header -->
    <div class="bg-gray-100" :class="compact ? 'p-5' : 'p-8 sm:p-12'">
      <div
        class="flex flex-col md:flex-row justify-between"
        :class="compact ? 'gap-4 mb-2' : 'gap-8 mb-8'">
        <div>
          <h1
            class="font-extrabold tracking-tight"
            :class="compact ? 'text-2xl mb-1' : 'text-4xl md:text-5xl mb-2'">
            {{ d.brandTitle || 'INVOICE' }}
          </h1>
          <p
            class="text-foreground/80 font-medium tracking-wide"
            :class="compact ? 'text-sm' : 'text-xl'">
            #{{ d.invoiceNumber }}
          </p>
        </div>
        <div class="flex flex-col md:items-end gap-2 text-right">
          <div
            v-if="d.brandLogo"
            class="bg-white/10 rounded-xl backdrop-blur-sm shadow-sm inline-block"
            :class="compact ? 'h-10 p-1 mb-1' : 'h-16 p-2 mb-2'">
            <img
              :src="d.brandLogo"
              :alt="d.brandName"
              class="h-full object-contain filter brightness-0 invert" />
          </div>
          <h2 v-if="d.brandName" class="font-bold" :class="compact ? 'text-base' : 'text-xl'">
            {{ d.brandName }}
          </h2>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-t border-white/20"
        :class="compact ? 'pt-3' : 'pt-6'">
        <div :class="compact ? 'flex gap-5' : 'flex gap-8'">
          <div v-if="d.issuedDate">
            <p
              class="text-foreground/60 font-semibold uppercase tracking-widest"
              :class="compact ? 'text-[10px] mb-0.5' : 'text-xs mb-1'">
              Issue Date
            </p>
            <DateTime
              :value="d.issuedDate"
              format="date"
              class="font-bold"
              :class="compact ? 'text-sm' : 'text-lg'" />
          </div>
          <div v-if="d.dueDate">
            <p
              class="text-foreground/60 font-semibold uppercase tracking-widest"
              :class="compact ? 'text-[10px] mb-0.5' : 'text-xs mb-1'">
              Due Date
            </p>
            <DateTime
              :value="d.dueDate"
              format="date"
              class="font-bold"
              :class="compact ? 'text-sm' : 'text-lg'" />
          </div>
        </div>
        <StatusChip v-if="d.status" :status="d.status" size="small" />
      </div>
    </div>

    <div :class="compact ? 'p-5 sm:p-6' : 'p-8 sm:p-12'">
      <!-- Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2" :class="compact ? 'gap-6 mb-6' : 'gap-12 mb-12'">
        <div v-if="d.companyInfo">
          <p
            class="font-bold text-primary uppercase tracking-widest"
            :class="compact ? 'text-[10px] mb-1.5' : 'text-xs mb-3'">
            From
          </p>
          <div
            class="text-muted-foreground leading-relaxed"
            :class="compact ? 'text-xs' : 'text-sm'">
            <p
              v-if="d.companyInfo.name"
              class="font-bold text-foreground"
              :class="compact ? 'text-sm mb-0.5' : 'text-base mb-1'">
              {{ d.companyInfo.name }}
            </p>
            <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
            <p v-if="d.companyInfo.city">
              {{ d.companyInfo.city }}, {{ d.companyInfo.state }} {{ d.companyInfo.zip }}
            </p>
            <p v-if="d.companyInfo.email">{{ d.companyInfo.email }}</p>
          </div>
        </div>

        <div v-if="d.customerInfo">
          <p
            class="font-bold text-primary uppercase tracking-widest"
            :class="compact ? 'text-[10px] mb-1.5' : 'text-xs mb-3'">
            Billed To
          </p>
          <div
            class="text-muted-foreground leading-relaxed"
            :class="compact ? 'text-xs' : 'text-sm'">
            <p
              v-if="d.customerInfo.name"
              class="font-bold text-foreground"
              :class="compact ? 'text-sm mb-0.5' : 'text-base mb-1'">
              {{ d.customerInfo.name }}
            </p>
            <p v-if="d.customerInfo.address">{{ d.customerInfo.address }}</p>
            <p v-if="d.customerInfo.city">
              {{ d.customerInfo.city }}, {{ d.customerInfo.state }} {{ d.customerInfo.zip }}
            </p>
            <p v-if="d.customerInfo.email">{{ d.customerInfo.email }}</p>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div :class="compact ? 'mb-5' : 'mb-10'">
        <table class="w-full text-left whitespace-nowrap" :class="compact ? 'text-xs' : ''">
          <thead>
            <tr class="border-b-2 border-primary/20">
              <th
                scope="col"
                class="font-bold text-muted-foreground uppercase tracking-widest"
                :class="compact ? 'py-2 text-[10px]' : 'py-4 text-xs'">
                Description
              </th>
              <th
                scope="col"
                class="font-bold text-muted-foreground uppercase tracking-widest text-right"
                :class="compact ? 'py-2 text-[10px]' : 'py-4 text-xs'">
                Price
              </th>
              <th
                scope="col"
                class="font-bold text-muted-foreground uppercase tracking-widest text-right"
                :class="compact ? 'py-2 text-[10px]' : 'py-4 text-xs'">
                Qty
              </th>
              <th
                scope="col"
                class="font-bold text-muted-foreground uppercase tracking-widest text-right"
                :class="compact ? 'py-2 text-[10px]' : 'py-4 text-xs'">
                Total
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr
              v-for="(item, index) in d.items"
              :key="item.id || index"
              class="group hover:bg-muted/10">
              <td
                class="font-medium text-foreground pr-4 white-space-normal"
                :class="compact ? 'py-2' : 'py-5'">
                <span class="block">{{ item.name }}</span>
                <span
                  v-if="item.description && !compact"
                  class="text-xs text-muted-foreground font-normal mt-0.5 line-clamp-2"
                  >{{ item.description }}</span
                >
              </td>
              <td
                class="text-right tabular-nums text-muted-foreground"
                :class="compact ? 'py-2' : 'py-5'">
                <Price :value="item.price" />
              </td>
              <td
                class="text-right tabular-nums text-muted-foreground font-medium"
                :class="compact ? 'py-2' : 'py-5'">
                {{ item.quantity }}
              </td>
              <td
                class="text-right tabular-nums font-bold text-foreground"
                :class="compact ? 'py-2 text-sm' : 'py-5 text-base'">
                <Price :value="item.total" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals & Barcode -->
      <div
        class="flex flex-col-reverse md:flex-row justify-between items-end"
        :class="compact ? 'gap-6' : 'gap-12'">
        <div class="w-full md:w-1/2" :class="compact ? 'space-y-3' : 'space-y-6'">
          <div
            v-if="d.barcode"
            class="inline-block border border-border/50 rounded-xl bg-muted/10"
            :class="compact ? 'p-2' : 'p-4'">
            <Barcode
              :value="d.barcode"
              format="CODE128"
              :height="compact ? 28 : 45"
              :width="compact ? 1.4 : 1.8"
              :display-value="true" />
          </div>
          <p
            v-if="d.notes"
            class="text-muted-foreground italic leading-relaxed max-w-sm"
            :class="compact ? 'text-xs' : 'text-sm'">
            "{{ d.notes }}"
          </p>
        </div>

        <div class="w-full md:w-1/3" :class="compact ? 'min-w-[200px]' : 'min-w-[280px]'">
          <div :class="compact ? 'space-y-2' : 'space-y-4'">
            <div
              v-for="(total, idx) in d.totals"
              :key="idx"
              class="flex justify-between items-center"
              :class="[
                total.isGrandTotal
                  ? compact
                    ? 'pt-2 border-t-2 border-primary/20 text-lg font-black text-primary'
                    : 'pt-4 border-t-2 border-primary/20 text-2xl font-black text-primary'
                  : compact
                    ? 'text-xs font-semibold text-muted-foreground'
                    : 'text-sm font-semibold text-muted-foreground',
              ]">
              <span
                :class="{
                  'uppercase tracking-widest text-xs': total.isGrandTotal && !compact,
                  'uppercase tracking-wide text-[10px]': total.isGrandTotal && compact,
                }"
                >{{ total.label }}</span
              >
              <Price :value="total.value" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Colored Footer Strip -->
    <div
      class="bg-primary/5 border-t border-primary/10 flex justify-center font-semibold text-primary uppercase tracking-widest"
      :class="compact ? 'py-2 px-5 sm:px-6 text-[10px]' : 'py-4 px-8 sm:px-12 text-xs'">
      <span v-if="d.footerText">{{ d.footerText }}</span>
      <span v-else>Thank you for your business</span>
    </div>
  </div>
</template>
