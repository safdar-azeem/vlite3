<script setup lang="ts">
import LineChart from '@/components/Chart/LineChart.vue'
import BarChart from '@/components/Chart/BarChart.vue'
import PieChart from '@/components/Chart/PieChart.vue'
import CircleChart from '@/components/Chart/CircleChart.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ChartDemo.vue?raw'

// ─── Line Chart Data ──────────────────────────

const revenueData = [
  { label: 'Jan', value: 4200 },
  { label: 'Feb', value: 5800 },
  { label: 'Mar', value: 5200 },
  { label: 'Apr', value: 7100 },
  { label: 'May', value: 6800 },
  { label: 'Jun', value: 9400 },
  { label: 'Jul', value: 8200 },
  { label: 'Aug', value: 11200 },
  { label: 'Sep', value: 10100 },
  { label: 'Oct', value: 12800 },
  { label: 'Nov', value: 14200 },
  { label: 'Dec', value: 16400 },
]

const multiLineLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
const multiLineDatasets = [
  { label: 'Revenue', data: [4200, 5800, 5200, 7100, 6800, 9400, 8200], color: 'var(--color-chart-1)' },
  { label: 'Expenses', data: [3100, 3400, 2900, 4200, 3800, 5100, 4600], color: 'var(--color-chart-4)' },
  { label: 'Profit', data: [1100, 2400, 2300, 2900, 3000, 4300, 3600], color: 'var(--color-chart-2)' },
]

const sparkData = [
  { label: 'Mon', value: 34 },
  { label: 'Tue', value: 56 },
  { label: 'Wed', value: 44 },
  { label: 'Thu', value: 78 },
  { label: 'Fri', value: 62 },
  { label: 'Sat', value: 91 },
  { label: 'Sun', value: 85 },
]

// ─── Bar Chart Data ───────────────────────────

const monthlyBarData = [
  { label: 'Jan', value: 4200, color: 'var(--color-chart-1)' },
  { label: 'Feb', value: 5800, color: 'var(--color-chart-5)' },
  { label: 'Mar', value: 5200, color: 'var(--color-chart-2)' },
  { label: 'Apr', value: 7100, color: 'var(--color-chart-3)' },
  { label: 'May', value: 6800, color: 'var(--color-chart-4)' },
  { label: 'Jun', value: 9400, color: 'var(--color-chart-6)' },
]

const groupedBarLabels = ['Q1', 'Q2', 'Q3', 'Q4']
const groupedBarDatasets = [
  { label: 'Product A', data: [4200, 6100, 7800, 9200] },
  { label: 'Product B', data: [3100, 4800, 5200, 7100] },
  { label: 'Product C', data: [1800, 2400, 3100, 4300] },
]

const hBarData = [
  { label: 'React', value: 78 },
  { label: 'Vue', value: 65 },
  { label: 'Angular', value: 52 },
  { label: 'Svelte', value: 43 },
  { label: 'Next.js', value: 81 },
]

// ─── Pie Chart Data ───────────────────────────

const marketShareData = [
  { label: 'Desktop', value: 42 },
  { label: 'Mobile', value: 38 },
  { label: 'Tablet', value: 13 },
  { label: 'Other', value: 7 },
]

const revenueBreakdown = [
  { label: 'SaaS', value: 48200, color: 'var(--color-chart-1)' },
  { label: 'Services', value: 21400, color: 'var(--color-chart-2)' },
  { label: 'Licenses', value: 14800, color: 'var(--color-chart-3)' },
  { label: 'Support', value: 9600, color: 'var(--color-chart-5)' },
]

const trafficSources = [
  { label: 'Organic', value: 44 },
  { label: 'Direct', value: 22 },
  { label: 'Social', value: 18 },
  { label: 'Referral', value: 10 },
  { label: 'Email', value: 6 },
]
</script>

<template>
  <div class="space-y-12">

    <!-- Page Header -->
    <div class="space-y-4 pb-8 border-b border-border/50">
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Charts</h2>
      <p class="text-lg text-muted-foreground max-w-[80%]">
        Beautiful, zero-dependency SVG chart components. Fully customizable, dark mode ready,
        animated, and responsive. Includes Line, Bar, Pie/Donut, and Circle (progress ring) charts.
      </p>
    </div>

    <!-- ═══════════════════════════════════════════════
         LINE CHART
    ════════════════════════════════════════════════ -->
    <DemoSection title="Line Chart — Single Series" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Smooth bezier curve with gradient fill. Monthly revenue data.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <LineChart
            :data="revenueData"
            :height="280"
            :smooth="true"
            :fill="true"
            y-label="Revenue ($)"
            :format-value="(v) => '$' + v.toLocaleString()" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Line Chart — Multi Series" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Multiple datasets with legend, hover crosshair, and tooltip.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <LineChart
            :datasets="multiLineDatasets"
            :labels="multiLineLabels"
            :height="280"
            :fill="false"
            :show-dots="true"
            :format-value="(v) => '$' + v.toLocaleString()" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Line Chart — Variants" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-card rounded-xl border border-border p-5">
          <p class="text-xs font-medium text-muted-foreground mb-3">No Fill · Straight Lines</p>
          <LineChart :data="sparkData" :height="180" :smooth="false" :fill="false" :show-grid="false" />
        </div>
        <div class="bg-card rounded-xl border border-border p-5">
          <p class="text-xs font-medium text-muted-foreground mb-3">No Dots · Custom Colors</p>
          <LineChart
            :data="sparkData"
            :height="180"
            :show-dots="false"
            :colors="['var(--color-chart-6)', 'var(--color-chart-3)']" />
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         BAR CHART
    ════════════════════════════════════════════════ -->
    <DemoSection title="Bar Chart — Vertical" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Vertical bars with per-bar colors, animated grow-in, and tooltips.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <BarChart :data="monthlyBarData" :height="280" :bar-radius="8" show-values />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Bar Chart — Multi Series Grouped" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Grouped bars across multiple product lines with legend.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <BarChart
            :datasets="groupedBarDatasets"
            :labels="groupedBarLabels"
            :height="280"
            :bar-radius="6"
            :format-value="(v) => '$' + v.toLocaleString()" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Bar Chart — Horizontal" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">Framework popularity as a horizontal bar chart. Great for ranked data.</p>
        <div class="bg-card rounded-xl border border-border p-6">
          <BarChart
            :data="hBarData"
            :height="280"
            orientation="horizontal"
            :bar-radius="6"
            show-values
            :format-value="(v) => v + '%'" />
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         PIE CHART
    ════════════════════════════════════════════════ -->
    <DemoSection title="Pie Chart" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-card rounded-xl border border-border p-6 flex justify-center">
          <div>
            <p class="text-xs font-medium text-muted-foreground mb-4">Market Share — Slice Labels</p>
            <PieChart :data="marketShareData" :size="260" label-mode="percent" />
          </div>
        </div>
        <div class="bg-card rounded-xl border border-border p-6 flex justify-center">
          <div>
            <p class="text-xs font-medium text-muted-foreground mb-4">Traffic Sources — Legend Bottom</p>
            <PieChart
              :data="trafficSources"
              :size="240"
              label-mode="none"
              legend-position="bottom" />
          </div>
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Donut Chart" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-card rounded-xl border border-border p-6 flex justify-center">
          <div>
            <p class="text-xs font-medium text-muted-foreground mb-4">Revenue Breakdown — Center Label</p>
            <PieChart
              :data="revenueBreakdown"
              :size="280"
              :donut="true"
              :inner-radius="62"
              center-value="$94k"
              center-label="Total Revenue"
              label-mode="percent" />
          </div>
        </div>
        <div class="bg-card rounded-xl border border-border p-6 flex justify-center">
          <div>
            <p class="text-xs font-medium text-muted-foreground mb-4">Market Share — Custom Slot Center</p>
            <PieChart
              :data="marketShareData"
              :size="280"
              :donut="true"
              :inner-radius="58"
              label-mode="none">
              <template #center>
                <text x="140" y="132" text-anchor="middle" dominant-baseline="middle" font-size="28" font-weight="800" class="fill-foreground">84%</text>
                <text x="140" y="152" text-anchor="middle" dominant-baseline="middle" font-size="12" class="fill-muted-foreground">Reach</text>
              </template>
            </PieChart>
          </div>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         CIRCLE CHART
    ════════════════════════════════════════════════ -->
    <DemoSection title="Circle Chart — Colors & Sizes" :code="sourceCode">
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Animated progress ring with gradient stroke. Supports semantic colors and custom hex values.
        </p>
        <div class="bg-card rounded-xl border border-border p-8">
          <div class="flex flex-wrap gap-8 justify-center">
            <CircleChart :value="78" color="primary" label="Performance" sublabel="Last 30 days" :size="140" />
            <CircleChart :value="92" color="success" label="Uptime" sublabel="This month" :size="140" />
            <CircleChart :value="64" color="warning" label="Disk Usage" sublabel="512 GB used" :size="140" />
            <CircleChart :value="38" color="danger" label="Error Rate" sublabel="↓ 12% vs last week" :size="140" />
            <CircleChart :value="85" color="info" label="API Health" sublabel="98 endpoints" :size="140" />
            <CircleChart :value="72" color="#8b5cf6" label="Adoption" sublabel="Beta users" :size="140" />
          </div>
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Circle Chart — Sizes & Customization" :code="sourceCode">
      <div class="bg-card rounded-xl border border-border p-8">
        <div class="flex flex-wrap gap-10 justify-center items-end">
          <!-- No gradient -->
          <CircleChart :value="55" :size="100" :stroke-width="8" color="primary" :gradient="false" label="Small" />
          <!-- Custom format -->
          <CircleChart
            :value="2480"
            :max="5000"
            :size="150"
            :stroke-width="14"
            color="success"
            label="Tasks Done"
            sublabel="of 5,000 total"
            :format-value="(v) => v.toLocaleString()" />
          <!-- Square cap -->
          <CircleChart :value="90" :size="180" :stroke-width="18" color="info" line-cap="butt" label="Coverage" />
          <!-- Custom center slot -->
          <CircleChart :value="68" :size="150" :stroke-width="12" color="#f97316" :show-value="false">
            <template #center="{ percentage }">
              <div class="text-center">
                <div class="text-2xl font-black" style="color: #f97316">{{ Math.round(percentage) }}%</div>
                <div class="text-[10px] text-muted-foreground font-medium">Goals Met</div>
              </div>
            </template>
          </CircleChart>
        </div>
      </div>
    </DemoSection>

    <!-- ═══════════════════════════════════════════════
         DASHBOARD PREVIEW
    ════════════════════════════════════════════════ -->
    <DemoSection title="Dashboard Preview" :code="sourceCode">
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">All chart types combined in a typical analytics dashboard layout.</p>

        <!-- KPI Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <CircleChart :value="84" :size="60" :stroke-width="6" color="primary" :show-value="true" :animate="true" />
            <div>
              <p class="text-xs text-muted-foreground">Performance</p>
              <p class="font-bold text-foreground">Excellent</p>
            </div>
          </div>
          <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <CircleChart :value="97" :size="60" :stroke-width="6" color="success" :show-value="true" />
            <div>
              <p class="text-xs text-muted-foreground">Uptime</p>
              <p class="font-bold text-foreground">99.97%</p>
            </div>
          </div>
          <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <CircleChart :value="61" :size="60" :stroke-width="6" color="warning" :show-value="true" />
            <div>
              <p class="text-xs text-muted-foreground">Disk Usage</p>
              <p class="font-bold text-foreground">305 GB</p>
            </div>
          </div>
          <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <CircleChart :value="23" :size="60" :stroke-width="6" color="danger" :show-value="true" />
            <div>
              <p class="text-xs text-muted-foreground">Errors</p>
              <p class="font-bold text-foreground">234 today</p>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <p class="text-sm font-semibold text-foreground mb-4">Revenue Overview</p>
            <LineChart
              :datasets="multiLineDatasets"
              :labels="multiLineLabels"
              :height="220"
              :fill="true"
              :show-dots="false"
              :format-value="(v) => '$' + v.toLocaleString()" />
          </div>
          <div class="bg-card border border-border rounded-xl p-5">
            <p class="text-sm font-semibold text-foreground mb-4">Revenue Sources</p>
            <div class="flex justify-center">
              <PieChart
                :data="revenueBreakdown"
                :size="200"
                :donut="true"
                :inner-radius="58"
                center-value="$94k"
                label-mode="none"
                legend-position="bottom"
                :show-legend="false" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="bg-card border border-border rounded-xl p-5">
            <p class="text-sm font-semibold text-foreground mb-4">Monthly Sales</p>
            <BarChart :data="monthlyBarData" :height="200" :bar-radius="6" />
          </div>
          <div class="bg-card border border-border rounded-xl p-5">
            <p class="text-sm font-semibold text-foreground mb-4">Framework Popularity</p>
            <BarChart
              :data="hBarData"
              :height="200"
              orientation="horizontal"
              :bar-radius="4"
              :format-value="(v) => v + '%'" />
          </div>
        </div>
      </div>
    </DemoSection>

  </div>
</template>
