<script setup lang="ts">
import { Clock } from '@/components/Clock'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ClockDemo.vue?raw'
</script>

<template>
  <div class="space-y-10 max-w-5xl">
    <div>
      <h2 class="text-2xl font-bold mb-1">Clock</h2>
      <p class="text-gray-500 text-sm">
        A live, auto-updating clock component powered by <code>dayjs</code>. Displays the current
        time and date, with full control over formatting, visibility, and styling through props.
        The tick interval is fully reactive — changing it restarts the internal timer immediately.
      </p>
    </div>

    <!-- Default -->
    <DemoSection title="Default" :code="sourceCode">
      <div class="p-8 rounded-xl border border-border bg-card flex justify-center">
        <Clock />
      </div>
    </DemoSection>

    <!-- Custom Time Format (24h) -->
    <DemoSection title="Custom Time Format (24h)" :code="sourceCode">
      <div class="p-8 rounded-xl border border-border bg-card flex justify-center">
        <Clock time-format="HH:mm:ss" />
      </div>
    </DemoSection>

    <!-- Custom Date Format -->
    <DemoSection title="Custom Date Format" :code="sourceCode">
      <div class="p-8 rounded-xl border border-border bg-card flex justify-center">
        <Clock date-format="DD/MM/YYYY" />
      </div>
    </DemoSection>

    <!-- Time Only -->
    <DemoSection title="Time Only (hide date)" :code="sourceCode">
      <div class="p-8 rounded-xl border border-border bg-card flex justify-center">
        <Clock :show-date="false" />
      </div>
    </DemoSection>

    <!-- Date Only -->
    <DemoSection title="Date Only (hide time)" :code="sourceCode">
      <div class="p-8 rounded-xl border border-border bg-card flex justify-center">
        <Clock :show-time="false" />
      </div>
    </DemoSection>

    <!-- Custom Styling via Props -->
    <DemoSection title="Custom Styling via timeClass / dateClass" :code="sourceCode">
      <div class="p-8 rounded-xl border border-border bg-card flex justify-center">
        <Clock
          time-class="text-primary text-5xl font-bold"
          date-class="text-primary/60 text-base font-medium mt-2" />
      </div>
    </DemoSection>

    <!--
      Custom Tick Interval (5s refresh).
      tickInterval is reactive — the watch() in Clock.vue restarts the internal
      setInterval whenever this prop value changes, so :tick-interval="5000" is
      guaranteed to be honoured even after mount.
    -->
    <DemoSection title="Custom Tick Interval (5s refresh)" :code="sourceCode">
      <div class="p-8 rounded-xl border border-border bg-card flex justify-center">
        <Clock :tick-interval="5000" time-format="hh:mm A" date-format="MMMM D, YYYY" />
      </div>
    </DemoSection>
  </div>
</template>
