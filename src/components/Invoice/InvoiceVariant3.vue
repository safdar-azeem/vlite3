<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceData } from './types'
import { Price } from '../Price'
import { DateTime } from '../DateTime'
import Badge from '../Badge.vue'
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
  <div
    class="v-invoice-v3 bg-card text-card-foreground border border-border shadow-sm rounded-md overflow-hidden"
    :class="compact ? 'text-xs' : 'text-sm'"
  >
    <!-- Top Bar -->
    <div
      class="bg-primary flex justify-between items-center text-primary-foreground"
      :class="compact ? 'px-4 py-2' : 'px-6 py-4'"
    >
      <div class="flex items-center gap-2">
        <span class="font-bold uppercase tracking-wider" :class="compact ? 'text-sm' : 'text-lg'">{{
          d.brandTitle || 'Invoice'
        }}</span>
        <span class="opacity-80">#{{ d.invoiceNumber }}</span>
      </div>
      <Badge
        v-if="d.status"
        variant="secondary"
        class="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-none font-bold">
        {{ d.status }}
      </Badge>
    </div>

    <div :class="compact ? 'p-3 space-y-3' : 'p-6 space-y-6'">
      <div class="grid grid-cols-1 md:grid-cols-3" :class="compact ? 'gap-3' : 'gap-6'">
        <!-- Brand Info -->
        <div>
          <div v-if="d.brandLogo" :class="compact ? 'h-6 mb-1' : 'h-8 mb-3'">
            <img :src="d.brandLogo" :alt="d.brandName" class="h-full object-contain" />
          </div>
          <h3 class="font-bold">{{ d.brandName }}</h3>
          <div v-if="d.companyInfo" class="mt-1 text-muted-foreground space-y-0.5" :class="compact ? 'text-[10px]' : 'text-xs'">
            <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
            <p v-if="d.companyInfo.city">
              {{ d.companyInfo.city }}, {{ d.companyInfo.state }} {{ d.companyInfo.zip }}
            </p>
            <p v-if="d.companyInfo.country">{{ d.companyInfo.country }}</p>
          </div>
        </div>

        <!-- Billed To -->
        <div v-if="d.customerInfo">
          <h4
            class="font-semibold text-muted-foreground uppercase tracking-wider"
            :class="compact ? 'text-[10px] mb-1' : 'text-xs mb-2'"
          >
            Billed To
          </h4>
          <p class="font-semibold">{{ d.customerInfo.name }}</p>
          <div class="mt-1 text-muted-foreground space-y-0.5" :class="compact ? 'text-[10px]' : 'text-xs'">
            <p v-if="d.customerInfo.address">{{ d.customerInfo.address }}</p>
            <p v-if="d.customerInfo.city">
              {{ d.customerInfo.city }}, {{ d.customerInfo.state }} {{ d.customerInfo.zip }}
            </p>
            <p v-if="d.customerInfo.email">{{ d.customerInfo.email }}</p>
          </div>
        </div>

        <!-- Dates & Codes -->
        <div class="flex flex-col md:items-end" :class="compact ? 'space-y-1' : 'space-y-2'">
          <div v-if="d.issuedDate" class="flex gap-2">
            <span class="text-muted-foreground font-medium" :class="compact ? 'text-[10px]' : 'text-xs'">Date:</span>
            <DateTime :value="d.issuedDate" format="date" class="font-semibold" :class="compact ? 'text-[10px]' : 'text-xs'" />
          </div>
          <div v-if="d.dueDate" class="flex gap-2">
            <span class="text-muted-foreground font-medium" :class="compact ? 'text-[10px]' : 'text-xs'">Due:</span>
            <DateTime :value="d.dueDate" format="date" class="font-semibold" :class="compact ? 'text-[10px]' : 'text-xs'" />
          </div>
          <div v-if="d.qrcode" :class="compact ? 'mt-1 text-right' : 'mt-2 text-right'">
            <QRCode :text="d.qrcode" :size="compact ? 48 : 64" />
          </div>
        </div>
      </div>

      <!-- Compact Table -->
      <div class="border border-border rounded">
        <table class="w-full text-left whitespace-nowrap">
          <thead
            class="bg-muted text-muted-foreground uppercase font-semibold border-b border-border"
            :class="compact ? 'text-[10px]' : 'text-xs'"
          >
            <tr>
              <th scope="col" :class="compact ? 'px-2 py-1' : 'px-4 py-2'">Item</th>
              <th scope="col" class="w-16 text-right" :class="compact ? 'px-2 py-1' : 'px-4 py-2 w-24'">Qty</th>
              <th scope="col" class="text-right" :class="compact ? 'px-2 py-1 w-24' : 'px-4 py-2 w-32'">Price</th>
              <th scope="col" class="text-right" :class="compact ? 'px-2 py-1 w-24' : 'px-4 py-2 w-32'">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border" :class="compact ? 'text-[10px]' : 'text-xs'">
            <tr v-for="(item, index) in d.items" :key="item.id || index" class="hover:bg-muted/30">
              <td class="font-medium" :class="compact ? 'px-2 py-1' : 'px-4 py-2'">{{ item.name }}</td>
              <td class="text-right tabular-nums" :class="compact ? 'px-2 py-1' : 'px-4 py-2'">{{ item.quantity }}</td>
              <td class="text-right tabular-nums" :class="compact ? 'px-2 py-1' : 'px-4 py-2'"><Price :value="item.price" /></td>
              <td class="text-right tabular-nums font-semibold" :class="compact ? 'px-2 py-1' : 'px-4 py-2'">
                <Price :value="item.total" />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Compact Totals -->
        <div
          class="bg-muted/30 border-t border-border flex justify-end"
          :class="compact ? 'p-2' : 'p-4'"
        >
          <div :class="compact ? 'w-full max-w-[180px] space-y-0.5 text-[10px]' : 'w-full max-w-[240px] space-y-1 text-xs'">
            <div
              v-for="(total, idx) in d.totals"
              :key="idx"
              class="flex justify-between items-center"
              :class="
                total.isGrandTotal
                  ? compact
                    ? 'pt-1 mt-1 border-t border-border font-bold text-xs text-foreground'
                    : 'pt-2 mt-2 border-t border-border font-bold text-sm text-foreground'
                  : 'text-muted-foreground font-medium'
              "
            >
              <span>{{ total.label }}</span>
              <Price :value="total.value" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="d.notes" class="text-muted-foreground border-t border-border" :class="compact ? 'text-[10px] pt-1' : 'text-xs pt-2'">
        <strong>Notes:</strong> <span class="whitespace-pre-wrap">{{ d.notes }}</span>
      </div>
      <div
        v-if="d.footerText"
        class="text-center text-muted-foreground opacity-70"
        :class="compact ? 'text-[10px]' : 'text-xs'"
      >
        {{ d.footerText }}
      </div>
    </div>
  </div>
</template>
