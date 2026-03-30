<script setup lang="ts">
import { computed } from 'vue'
import type { InvoiceData } from './types'
import { Price } from '../Price'
import { DateTime } from '../DateTime'
import { StatusChip } from '../StatusChip'
import { Barcode } from '../Barcode'

const props = defineProps<{
  data: InvoiceData
}>()

const d = computed(() => props.data)
</script>

<template>
  <div class="v-invoice-v4 bg-background border border-border/50 text-foreground overflow-hidden rounded-2xl shadow-lg font-sans">
    
    <!-- Hero Header -->
    <div class="bg-linear-to-r from-primary to-primary-hover p-8 sm:p-12 text-primary-foreground">
      <div class="flex flex-col md:flex-row justify-between gap-8 mb-8">
        <div>
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            {{ d.brandTitle || 'INVOICE' }}
          </h1>
          <p class="text-primary-foreground/80 text-xl font-medium tracking-wide">#{{ d.invoiceNumber }}</p>
        </div>
        <div class="flex flex-col md:items-end gap-2 text-right">
          <div v-if="d.brandLogo" class="h-16 bg-white/10 p-2 rounded-xl backdrop-blur-sm shadow-sm inline-block mb-2">
            <img :src="d.brandLogo" :alt="d.brandName" class="h-full object-contain filter brightness-0 invert" />
          </div>
          <h2 v-if="d.brandName" class="text-xl font-bold">{{ d.brandName }}</h2>
        </div>
      </div>
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-t border-white/20 pt-6">
        <div class="flex gap-8">
          <div v-if="d.issuedDate">
            <p class="text-primary-foreground/60 text-xs font-semibold uppercase tracking-widest mb-1">Issue Date</p>
            <DateTime :value="d.issuedDate" format="date" class="font-bold text-lg" />
          </div>
          <div v-if="d.dueDate">
            <p class="text-primary-foreground/60 text-xs font-semibold uppercase tracking-widest mb-1">Due Date</p>
            <DateTime :value="d.dueDate" format="date" class="font-bold text-lg" />
          </div>
        </div>
        <StatusChip v-if="d.status" :status="d.status" size="large" class="shadow-md bg-background text-foreground shrink-0 border-0" />
      </div>
    </div>

    <div class="p-8 sm:p-12">
      <!-- Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div v-if="d.companyInfo">
          <p class="text-xs font-bold text-primary uppercase tracking-widest mb-3">From</p>
          <div class="text-muted-foreground leading-relaxed text-sm">
            <p v-if="d.companyInfo.name" class="font-bold text-foreground text-base mb-1">{{ d.companyInfo.name }}</p>
            <p v-if="d.companyInfo.address">{{ d.companyInfo.address }}</p>
            <p v-if="d.companyInfo.city">{{ d.companyInfo.city }}, {{ d.companyInfo.state }} {{ d.companyInfo.zip }}</p>
            <p v-if="d.companyInfo.email">{{ d.companyInfo.email }}</p>
          </div>
        </div>
        
        <div v-if="d.customerInfo">
          <p class="text-xs font-bold text-primary uppercase tracking-widest mb-3">Billed To</p>
          <div class="text-muted-foreground leading-relaxed text-sm">
            <p v-if="d.customerInfo.name" class="font-bold text-foreground text-base mb-1">{{ d.customerInfo.name }}</p>
            <p v-if="d.customerInfo.address">{{ d.customerInfo.address }}</p>
            <p v-if="d.customerInfo.city">{{ d.customerInfo.city }}, {{ d.customerInfo.state }} {{ d.customerInfo.zip }}</p>
            <p v-if="d.customerInfo.email">{{ d.customerInfo.email }}</p>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="mb-10">
        <table class="w-full text-left whitespace-nowrap">
          <thead>
            <tr class="border-b-2 border-primary/20">
              <th scope="col" class="py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Description</th>
              <th scope="col" class="py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Price</th>
              <th scope="col" class="py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Qty</th>
              <th scope="col" class="py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr v-for="(item, index) in d.items" :key="item.id || index" class="group hover:bg-muted/10">
              <td class="py-5 font-medium text-foreground pr-4 white-space-normal">
                <span class="block">{{ item.name }}</span>
                <span v-if="item.description" class="text-xs text-muted-foreground font-normal mt-0.5 line-clamp-2">{{ item.description }}</span>
              </td>
              <td class="py-5 text-right tabular-nums text-muted-foreground"><Price :value="item.price" /></td>
              <td class="py-5 text-right tabular-nums text-muted-foreground font-medium">{{ item.quantity }}</td>
              <td class="py-5 text-right tabular-nums font-bold text-foreground text-base"><Price :value="item.total" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals & Barcode -->
      <div class="flex flex-col-reverse md:flex-row justify-between gap-12 items-end">
        <div class="w-full md:w-1/2 space-y-6">
          <div v-if="d.barcode" class="inline-block p-4 border border-border/50 rounded-xl bg-muted/10">
            <Barcode :value="d.barcode" format="CODE128" :height="45" :width="1.8" :display-value="true" />
          </div>
          <p v-if="d.notes" class="text-sm text-muted-foreground italic leading-relaxed max-w-sm">"{{ d.notes }}"</p>
        </div>

        <div class="w-full md:w-1/3 min-w-[280px]">
          <div class="space-y-4">
            <div 
              v-for="(total, idx) in d.totals" 
              :key="idx"
              class="flex justify-between items-center"
              :class="[
                total.isGrandTotal 
                  ? 'pt-4 border-t-2 border-primary/20 text-2xl font-black text-primary' 
                  : 'text-sm font-semibold text-muted-foreground'
              ]"
            >
              <span :class="{ 'uppercase tracking-widest text-sm': total.isGrandTotal }">{{ total.label }}</span>
              <Price :value="total.value" />
            </div>
          </div>
        </div>
      </div>
      
    </div>

    <!-- Colored Footer Strip -->
    <div class="bg-primary/5 py-4 px-8 sm:px-12 border-t border-primary/10 flex justify-center text-xs font-semibold text-primary uppercase tracking-widest">
      <span v-if="d.footerText">{{ d.footerText }}</span>
      <span v-else>Thank you for your business</span>
    </div>

  </div>
</template>
