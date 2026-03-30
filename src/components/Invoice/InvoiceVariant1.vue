<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceData } from './types'
import { Price } from '../Price'
import { DateTime } from '../DateTime'
import { StatusChip } from '../StatusChip'
import { Barcode } from '../Barcode'
import { QRCode } from '../QRCode'

const props = withDefaults(
  defineProps<{
    data: InvoiceData
    /** Reduces padding, spacing, and font sizes for print-friendly output */
    compact?: boolean
  }>(),
  { compact: false },
)

const d = computed(() => props.data)
</script>

<template>
  <div class="v-invoice-v1 bg-background text-foreground rounded-xl border border-border overflow-hidden shadow-sm">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start border-b border-border bg-muted/20"
      :class="compact ? 'gap-3 p-4' : 'gap-6 p-6 sm:p-8'"
    >
      <div :class="compact ? 'space-y-2' : 'space-y-4'">
        <div v-if="d.brandLogo" :class="compact ? 'h-8' : 'h-12'">
          <img :src="d.brandLogo" :alt="d.brandName" class="h-full object-contain" />
        </div>
        <div>
          <h2 v-if="d.brandName" :class="compact ? 'text-base font-bold' : 'text-xl font-bold'">{{ d.brandName }}</h2>
          <div v-if="d.companyInfo" class="mt-1 text-muted-foreground space-y-0.5" :class="compact ? 'text-[10px]' : 'text-sm'">
            <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
            <p v-if="d.companyInfo.city || d.companyInfo.state || d.companyInfo.zip">
              {{ d.companyInfo.city }}<template v-if="d.companyInfo.city && d.companyInfo.state">, </template>{{ d.companyInfo.state }} {{ d.companyInfo.zip }}
            </p>
            <p v-if="d.companyInfo.country">{{ d.companyInfo.country }}</p>
            <p v-if="d.companyInfo.email">{{ d.companyInfo.email }}</p>
            <p v-if="d.companyInfo.phone">{{ d.companyInfo.phone }}</p>
            <p v-if="d.companyInfo.taxId">Tax ID: {{ d.companyInfo.taxId }}</p>
          </div>
        </div>
      </div>

      <div class="text-left md:text-right shrink-0" :class="compact ? 'space-y-2' : 'space-y-4'">
        <div>
          <h1
            class="font-bold tracking-tight text-primary uppercase"
            :class="compact ? 'text-xl' : 'text-3xl'"
          >
            {{ d.brandTitle || 'Invoice' }}
          </h1>
          <p class="font-medium mt-1 text-muted-foreground" :class="compact ? 'text-sm' : 'text-lg'">#{{ d.invoiceNumber }}</p>
        </div>

        <div :class="compact ? 'space-y-0.5' : 'space-y-1'">
          <StatusChip v-if="d.status" :status="d.status" class="mb-1" />
          <div v-if="d.issuedDate" class="flex md:justify-end items-center gap-2" :class="compact ? 'text-xs' : 'text-sm'">
            <span class="text-muted-foreground font-medium w-24 md:w-auto">Issued:</span>
            <DateTime :value="d.issuedDate" format="date" class="font-medium" />
          </div>
          <div v-if="d.dueDate" class="flex md:justify-end items-center gap-2" :class="compact ? 'text-xs' : 'text-sm'">
            <span class="text-muted-foreground font-medium w-24 md:w-auto">Due:</span>
            <DateTime :value="d.dueDate" format="date" class="font-medium" />
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div :class="compact ? 'p-4 space-y-4' : 'p-6 sm:p-8 space-y-8'">
      <!-- Customer Info -->
      <div v-if="d.customerInfo" :class="compact ? 'space-y-1' : 'space-y-2'">
        <h3 class="font-semibold text-muted-foreground uppercase tracking-wider" :class="compact ? 'text-[10px]' : 'text-sm'">Billed To</h3>
        <p class="font-semibold" :class="compact ? 'text-sm' : 'text-lg'">{{ d.customerInfo.name }}</p>
        <div class="text-muted-foreground space-y-0.5" :class="compact ? 'text-[10px]' : 'text-sm'">
          <p v-if="d.customerInfo.address">{{ d.customerInfo.address }}</p>
          <p v-if="d.customerInfo.city || d.customerInfo.state">
            {{ d.customerInfo.city }}<template v-if="d.customerInfo.city && d.customerInfo.state">, </template>{{ d.customerInfo.state }} {{ d.customerInfo.zip }}
          </p>
          <p v-if="d.customerInfo.country">{{ d.customerInfo.country }}</p>
          <p v-if="d.customerInfo.email">{{ d.customerInfo.email }}</p>
          <p v-if="d.customerInfo.phone">{{ d.customerInfo.phone }}</p>
          <p v-if="d.customerInfo.taxId">Tax ID: {{ d.customerInfo.taxId }}</p>
        </div>
      </div>

      <!-- Line Items -->
      <div v-if="d.items && d.items.length" class="overflow-x-auto rounded-lg border border-border">
        <table class="w-full text-left whitespace-nowrap" :class="compact ? 'text-xs' : 'text-sm'">
          <thead class="bg-muted text-muted-foreground uppercase font-semibold" :class="compact ? 'text-[10px]' : 'text-xs'">
            <tr>
              <th scope="col" :class="compact ? 'px-3 py-1.5' : 'px-6 py-3'">Description</th>
              <th scope="col" class="text-right" :class="compact ? 'px-3 py-1.5' : 'px-6 py-3'">Qty</th>
              <th scope="col" class="text-right" :class="compact ? 'px-3 py-1.5' : 'px-6 py-3'">Price</th>
              <th scope="col" class="text-right" :class="compact ? 'px-3 py-1.5' : 'px-6 py-3'">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="(item, index) in d.items" :key="item.id || index" class="hover:bg-muted/50 transition-colors">
              <td :class="compact ? 'px-3 py-1.5 white-space-normal' : 'px-6 py-4 white-space-normal'">
                <div class="font-medium text-foreground">{{ item.name }}</div>
                <div v-if="item.description && !compact" class="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {{ item.description }}
                </div>
              </td>
              <td class="text-right tabular-nums" :class="compact ? 'px-3 py-1.5' : 'px-6 py-4'">{{ item.quantity }}</td>
              <td class="text-right tabular-nums" :class="compact ? 'px-3 py-1.5' : 'px-6 py-4'"><Price :value="item.price" /></td>
              <td class="text-right tabular-nums font-medium" :class="compact ? 'px-3 py-1.5' : 'px-6 py-4'"><Price :value="item.total" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals & Extra Info -->
      <div class="flex flex-col-reverse md:flex-row justify-between" :class="compact ? 'gap-4 pt-2' : 'gap-8 pt-4'">

        <!-- Left: Codes & Notes -->
        <div class="w-full md:w-1/2" :class="compact ? 'space-y-3' : 'space-y-6'">
          <div v-if="d.notes" class="space-y-1">
            <h4 class="font-semibold text-muted-foreground uppercase tracking-wider" :class="compact ? 'text-[10px]' : 'text-sm'">Notes</h4>
            <div
              class="text-muted-foreground whitespace-pre-wrap leading-relaxed rounded-lg border border-border/50"
              :class="compact ? 'text-[10px] p-2 bg-muted/20' : 'text-sm p-4 bg-muted/30'"
            >
              {{ d.notes }}
            </div>
          </div>
          <div class="flex gap-4 items-end">
            <div v-if="d.qrcode" class="flex flex-col items-center gap-2">
              <QRCode :text="d.qrcode" :size="compact ? 56 : 80" />
            </div>
            <div v-if="d.barcode" class="flex flex-col items-start gap-2">
              <Barcode
                :value="d.barcode"
                format="CODE128"
                :height="compact ? 28 : 40"
                :width="compact ? 1.2 : 1.5"
                :display-value="true"
              />
            </div>
          </div>
        </div>

        <!-- Right: Totals -->
        <div class="w-full md:w-1/3 min-w-[220px]">
          <div
            class="rounded-lg bg-muted/20 border border-border"
            :class="compact ? 'p-3 space-y-1.5' : 'p-5 space-y-3'"
          >
            <div
              v-for="(total, idx) in d.totals"
              :key="idx"
              class="flex justify-between items-center"
              :class="[
                total.isGrandTotal
                  ? compact
                    ? 'pt-1.5 border-t border-border mt-1.5 text-sm font-bold text-foreground'
                    : 'pt-3 border-t border-border mt-3 text-base font-bold text-foreground'
                  : compact
                  ? 'text-[10px] text-muted-foreground font-medium'
                  : 'text-sm text-muted-foreground font-medium',
              ]"
            >
              <span>{{ total.label }}</span>
              <Price :value="total.value" />
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Footer -->
    <div
      v-if="d.footerText"
      class="bg-muted/40 border-t border-border text-center text-muted-foreground"
      :class="compact ? 'px-4 py-2 text-[10px]' : 'px-6 py-4 text-xs'"
    >
      {{ d.footerText }}
    </div>
  </div>
</template>

