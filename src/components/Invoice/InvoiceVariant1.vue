<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceData } from './types'
import { Price } from '../Price'
import { DateTime } from '../DateTime'
import { StatusChip } from '../StatusChip'
import { Barcode } from '../Barcode'
import { QRCode } from '../QRCode'

const props = defineProps<{
  data: InvoiceData
}>()

const d = computed(() => props.data)
</script>

<template>
  <div class="v-invoice-v1 bg-background text-foreground rounded-xl border border-border overflow-hidden shadow-sm">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start gap-6 p-6 sm:p-8 bg-muted/20 border-b border-border">
      <div class="space-y-4">
        <div v-if="d.brandLogo" class="h-12">
          <img :src="d.brandLogo" :alt="d.brandName" class="h-full object-contain" />
        </div>
        <div>
          <h2 v-if="d.brandName" class="text-xl font-bold">{{ d.brandName }}</h2>
          <div v-if="d.companyInfo" class="mt-1 text-sm text-muted-foreground space-y-0.5">
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

      <div class="text-left md:text-right space-y-4 shrink-0">

        <div>
          <h1 class="text-3xl font-bold tracking-tight text-primary uppercase">
            {{ d.brandTitle || 'Invoice' }}
          </h1>
          <p class="text-lg font-medium mt-1 text-muted-foreground">#{{ d.invoiceNumber }}</p>
        </div>
        
        <div class="space-y-1">
          <StatusChip v-if="d.status" :status="d.status" class="mb-2" />

          
          <div v-if="d.issuedDate" class="flex md:justify-end items-center gap-2 text-sm">
            <span class="text-muted-foreground font-medium w-24 md:w-auto">Issued:</span>
            <DateTime :value="d.issuedDate" format="date" class="font-medium" />
          </div>
          <div v-if="d.dueDate" class="flex md:justify-end items-center gap-2 text-sm">
            <span class="text-muted-foreground font-medium w-24 md:w-auto">Due:</span>
            <DateTime :value="d.dueDate" format="date" class="font-medium" />
          </div>
        </div>
      </div>
    </div>

    <div class="p-6 sm:p-8 space-y-8">
      <!-- Customer Info -->
      <div v-if="d.customerInfo" class="space-y-2">
        <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Billed To</h3>
        <p class="text-lg font-semibold">{{ d.customerInfo.name }}</p>
        <div class="text-sm text-muted-foreground space-y-0.5">
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
        <table class="w-full text-sm text-left whitespace-nowrap">
          <thead class="bg-muted text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th scope="col" class="px-6 py-3">Description</th>
              <th scope="col" class="px-6 py-3 text-right">Qty</th>
              <th scope="col" class="px-6 py-3 text-right">Price</th>
              <th scope="col" class="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="(item, index) in d.items" :key="item.id || index" class="hover:bg-muted/50 transition-colors">
              <td class="px-6 py-4 white-space-normal">
                <div class="font-medium text-foreground">{{ item.name }}</div>
                <div v-if="item.description" class="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {{ item.description }}
                </div>
              </td>
              <td class="px-6 py-4 text-right tabular-nums">{{ item.quantity }}</td>
              <td class="px-6 py-4 text-right tabular-nums"><Price :value="item.price" /></td>
              <td class="px-6 py-4 text-right tabular-nums font-medium"><Price :value="item.total" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals & Extra Info -->
      <div class="flex flex-col-reverse md:flex-row justify-between gap-8 pt-4">
        
        <!-- Left: Codes & Notes -->
        <div class="w-full md:w-1/2 space-y-6">
          <div v-if="d.notes" class="space-y-1">
            <h4 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notes</h4>
            <div class="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 p-4 rounded-lg border border-border/50">
              {{ d.notes }}
            </div>
          </div>
          <div class="flex gap-6 items-end">
            <div v-if="d.qrcode" class="flex flex-col items-center gap-2">
              <QRCode :text="d.qrcode" :size="80" />
            </div>
            <div v-if="d.barcode" class="flex flex-col items-start gap-2">
              <Barcode :value="d.barcode" format="CODE128" :height="40" :width="1.5" :display-value="true" />
            </div>
          </div>
        </div>

        <!-- Right: Totals -->
        <div class="w-full md:w-1/3 min-w-[250px]">
          <div class="rounded-lg bg-muted/20 p-5 space-y-3 border border-border">
            <div 
              v-for="(total, idx) in d.totals" 
              :key="idx"
              class="flex justify-between items-center text-sm"
              :class="[
                total.isGrandTotal ? 'pt-3 border-t border-border mt-3 text-base font-bold text-foreground' : 'text-muted-foreground font-medium'
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
    <div v-if="d.footerText" class="px-6 py-4 bg-muted/40 border-t border-border text-center text-xs text-muted-foreground">
      {{ d.footerText }}
    </div>
  </div>
</template>
