<script setup lang="ts">
import { StatusChip } from '@/components/StatusChip'
import DemoSection from '../DemoSection.vue'
import sourceCode from './StatusChipDemo.vue?raw'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">StatusChip</h2>
      <p class="text-gray-500">
        Auto-resolves status values to the correct color, icon, and label. Handles normalization of
        formats like <code class="bg-muted px-1 rounded text-xs">in_progress</code>,
        <code class="bg-muted px-1 rounded text-xs">InProgress</code>,
        <code class="bg-muted px-1 rounded text-xs">IN-PROGRESS</code> — all map to the same chip.
      </p>
    </div>

    <DemoSection title="Payments & Finance" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <StatusChip status="paid" />
        <StatusChip status="unpaid" />
        <StatusChip status="pending" />
        <StatusChip status="partially_paid" />
        <StatusChip status="refunded" />
        <StatusChip status="overdue" />
        <StatusChip status="void" />
        <StatusChip status="cancelled" />
      </div>
    </DemoSection>

    <DemoSection title="Payment Methods" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <StatusChip status="cash" />
        <StatusChip status="check" />
        <StatusChip status="card" />
        <StatusChip status="transfer" />
      </div>
    </DemoSection>

    <DemoSection title="Orders & Fulfillment" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <StatusChip status="confirmed" />
        <StatusChip status="processing" />
        <StatusChip status="in_progress" />
        <StatusChip status="dispatched" />
        <StatusChip status="in_transit" />
        <StatusChip status="shipped" />
        <StatusChip status="delivered" />
        <StatusChip status="completed" />
        <StatusChip status="cancelled" />
        <StatusChip status="rejected" />
        <StatusChip status="scheduled" />
      </div>
    </DemoSection>

    <DemoSection title="CRM & Sales" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <StatusChip status="prospecting" />
        <StatusChip status="qualification" />
        <StatusChip status="proposal" />
        <StatusChip status="negotiation" />
        <StatusChip status="contacted" />
        <StatusChip status="qualified" />
        <StatusChip status="won" />
        <StatusChip status="lost" />
        <StatusChip status="closed_won" />
        <StatusChip status="closed_lost" />
        <StatusChip status="new" />
      </div>
    </DemoSection>

    <DemoSection title="HR & Attendance" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <StatusChip status="present" />
        <StatusChip status="absent" />
        <StatusChip status="active" />
        <StatusChip status="inactive" />
        <StatusChip status="on_hold" />
        <StatusChip status="terminated" />
        <StatusChip status="suspended" />
        <StatusChip status="pending" />
      </div>
    </DemoSection>

    <DemoSection title="Communication & Presence" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <StatusChip status="incoming" />
        <StatusChip status="outgoing" />
        <StatusChip status="missed" />
        <StatusChip status="online" />
        <StatusChip status="offline" />
        <StatusChip status="in_person" />
      </div>
    </DemoSection>

    <DemoSection title="Inventory & Stock" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <StatusChip status="in_stock" />
        <StatusChip status="low_stock" />
        <StatusChip status="out_of_stock" />
        <StatusChip status="available" />
        <StatusChip status="fulfilled" />
        <StatusChip status="archived" />
      </div>
    </DemoSection>

    <DemoSection title="Tasks & Approvals" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <StatusChip status="todo" />
        <StatusChip status="in_progress" />
        <StatusChip status="in_review" />
        <StatusChip status="approved" />
        <StatusChip status="rejected" />
        <StatusChip status="done" />
        <StatusChip status="awaiting_approval" />
        <StatusChip status="partially_approved" />
      </div>
    </DemoSection>

    <DemoSection title="Priority & Severity" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <StatusChip status="critical" />
        <StatusChip status="urgent" />
        <StatusChip status="high" />
        <StatusChip status="medium" />
        <StatusChip status="low" />
        <StatusChip status="normal" />
        <StatusChip status="minor" />
        <StatusChip status="trivial" />
      </div>
    </DemoSection>

    <DemoSection title="Status Normalization" :code="sourceCode">
      <p class="text-sm text-muted-foreground mb-3">
        All variations below resolve to the same chip:
      </p>
      <div class="flex flex-wrap gap-2">
        <StatusChip status="in_progress" />
        <StatusChip status="inprogress" />
        <StatusChip status="InProgress" />
        <StatusChip status="IN-PROGRESS" />
        <StatusChip status="In Progress" />
      </div>
    </DemoSection>

    <DemoSection title="Sizes" :code="sourceCode">
      <div class="flex flex-wrap items-center gap-2">
        <StatusChip status="active" size="small" />
        <StatusChip status="pending" size="medium" />
        <StatusChip status="cancelled" size="large" />
      </div>
    </DemoSection>

    <DemoSection title="Custom Label Override" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <StatusChip status="active" label="Live" />
        <StatusChip status="pending" label="Awaiting Review" />
        <StatusChip status="completed" label="Order Done" />
      </div>
    </DemoSection>

    <DemoSection title="Fallback for Unknown Statuses" :code="sourceCode">
      <div class="flex flex-wrap gap-2">
        <StatusChip status="some_custom_status" />
        <StatusChip status="LEGACY_CODE_42" />
        <StatusChip status="whateverstatus" />
      </div>
    </DemoSection>
  </div>
</template>
