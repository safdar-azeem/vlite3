<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceData } from './types'
import { Price } from '../Price'
import { DateTime } from '../DateTime'
import Badge from '../Badge.vue'
import { QRCode } from '../QRCode'

const props = defineProps<{
  data: InvoiceData
}>()

const d = computed(() => props.data)
</script>

<template>
  <div
    class="v-invoice-v3 bg-card text-card-foreground border border-border shadow-sm rounded-md overflow-hidden text-sm">
    <!-- Top Bar -->
    <div class="bg-primary px-6 py-4 flex justify-between items-center text-primary-foreground">
      <div class="flex items-center gap-3">
        <span class="font-bold text-lg uppercase tracking-wider">{{
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

    <div class="p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Brand Info -->
        <div>
          <div v-if="d.brandLogo" class="h-8 mb-3">
            <img :src="d.brandLogo" :alt="d.brandName" class="h-full object-contain" />
          </div>
          <h3 class="font-bold">{{ d.brandName }}</h3>
          <div v-if="d.companyInfo" class="mt-1 text-xs text-muted-foreground space-y-0.5">
            <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
            <p v-if="d.companyInfo.city">
              {{ d.companyInfo.city }}, {{ d.companyInfo.state }} {{ d.companyInfo.zip }}
            </p>
            <p v-if="d.companyInfo.country">{{ d.companyInfo.country }}</p>
          </div>
        </div>

        <!-- Billed To -->
        <div v-if="d.customerInfo">
          <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Billed To
          </h4>
          <p class="font-semibold">{{ d.customerInfo.name }}</p>
          <div class="mt-1 text-xs text-muted-foreground space-y-0.5">
            <p v-if="d.customerInfo.address">{{ d.customerInfo.address }}</p>
            <p v-if="d.customerInfo.city">
              {{ d.customerInfo.city }}, {{ d.customerInfo.state }} {{ d.customerInfo.zip }}
            </p>
            <p v-if="d.customerInfo.email">{{ d.customerInfo.email }}</p>
          </div>
        </div>

        <!-- Dates & Codes -->
        <div class="flex flex-col md:items-end space-y-2">
          <div v-if="d.issuedDate" class="flex gap-2">
            <span class="text-muted-foreground font-medium text-xs">Date:</span>
            <DateTime :value="d.issuedDate" format="date" class="font-semibold text-xs" />
          </div>
          <div v-if="d.dueDate" class="flex gap-2">
            <span class="text-muted-foreground font-medium text-xs">Due:</span>
            <DateTime :value="d.dueDate" format="date" class="font-semibold text-xs" />
          </div>
          <div v-if="d.qrcode" class="mt-2 text-right">
            <QRCode :text="d.qrcode" :size="64" />
          </div>
        </div>
      </div>

      <!-- Compact Table -->
      <div class="border border-border rounded">
        <table class="w-full text-left whitespace-nowrap">
          <thead
            class="bg-muted text-muted-foreground uppercase text-xs font-semibold border-b border-border">
            <tr>
              <th scope="col" class="px-4 py-2">Item</th>
              <th scope="col" class="px-4 py-2 w-24 text-right">Qty</th>
              <th scope="col" class="px-4 py-2 w-32 text-right">Price</th>
              <th scope="col" class="px-4 py-2 w-32 text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border text-xs">
            <tr v-for="(item, index) in d.items" :key="item.id || index" class="hover:bg-muted/30">
              <td class="px-4 py-2 font-medium">{{ item.name }}</td>
              <td class="px-4 py-2 text-right tabular-nums">{{ item.quantity }}</td>
              <td class="px-4 py-2 text-right tabular-nums"><Price :value="item.price" /></td>
              <td class="px-4 py-2 text-right tabular-nums font-semibold">
                <Price :value="item.total" />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Compact Totals -->
        <div class="bg-muted/30 border-t border-border flex justify-end p-4">
          <div class="w-full max-w-[240px] space-y-1 text-xs">
            <div
              v-for="(total, idx) in d.totals"
              :key="idx"
              class="flex justify-between items-center"
              :class="
                total.isGrandTotal
                  ? 'pt-2 mt-2 border-t border-border font-bold text-sm text-foreground'
                  : 'text-muted-foreground font-medium'
              ">
              <span>{{ total.label }}</span>
              <Price :value="total.value" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="d.notes" class="text-xs text-muted-foreground pt-2 border-t border-border">
        <strong>Notes:</strong> <span class="whitespace-pre-wrap">{{ d.notes }}</span>
      </div>
      <div v-if="d.footerText" class="text-center text-xs text-muted-foreground opacity-70">
        {{ d.footerText }}
      </div>
    </div>
  </div>
</template>
