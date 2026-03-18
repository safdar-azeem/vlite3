<script setup lang="ts">
import Icon from '@/components/Icon.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ColorsDemo.vue?raw'

const semanticColors = [
  {
    title: 'Background',
    colors: [
      {
        name: 'Background',
        bg: 'bg-background',
        text: 'text-foreground',
        var: '--background',
        textVar: '--foreground',
      },
      {
        name: 'Card',
        bg: 'bg-card',
        text: 'text-card-foreground',
        var: '--card',
        textVar: '--card-foreground',
      },
      {
        name: 'Card Muted',
        bg: 'bg-card-muted',
        text: 'text-card-foreground',
        var: '--card-muted',
        textVar: '--card-foreground',
      },
      {
        name: 'Muted',
        bg: 'bg-muted',
        text: 'text-muted-foreground',
        var: '--muted',
        textVar: '--muted-foreground',
      },
    ],
  },
  {
    title: 'Actions',
    colors: [
      {
        name: 'Primary',
        bg: 'bg-primary',
        text: 'text-primary-foreground',
        var: '--primary',
        textVar: '--primary-foreground',
      },
      {
        name: 'Secondary',
        bg: 'bg-secondary',
        text: 'text-secondary-foreground',
        var: '--secondary',
        textVar: '--secondary-foreground',
      },
      {
        name: 'Accent',
        bg: 'bg-accent',
        text: 'text-accent-foreground',
        var: '--accent',
        textVar: '--accent-foreground',
      },
      {
        name: 'Destructive',
        bg: 'bg-destructive',
        text: 'text-destructive-foreground',
        var: '--destructive',
        textVar: '--destructive-foreground',
      },
    ],
  },
  {
    title: 'Status',
    colors: [
      {
        name: 'Danger',
        bg: 'bg-danger',
        text: 'text-danger-fg',
        var: '--color-danger',
        textVar: '--color-danger-fg',
      },
      {
        name: 'Warning',
        bg: 'bg-warning',
        text: 'text-warning-fg',
        var: '--color-warning',
        textVar: '--color-warning-fg',
      },
      {
        name: 'Info',
        bg: 'bg-info',
        text: 'text-info-fg',
        var: '--color-info',
        textVar: '--color-info-fg',
      },
      {
        name: 'Success',
        bg: 'bg-success',
        text: 'text-success-fg',
        var: '--color-success',
        textVar: '--color-success-fg',
      },
    ],
  },
]

const variantColors = [
  {
    name: 'Primary',
    variants: [
      {
        label: 'Light',
        bg: 'bg-primary-light',
        text: 'text-primary-fg-light',
        var: '--color-primary-light',
      },
      { label: 'Main', bg: 'bg-primary', text: 'text-primary-fg', var: '--color-primary' },
      {
        label: 'Dark',
        bg: 'bg-primary-dark',
        text: 'text-primary-fg',
        var: '--color-primary-dark',
      },
    ],
  },
  {
    name: 'Danger',
    variants: [
      {
        label: 'Light',
        bg: 'bg-danger-light',
        text: 'text-danger-fg-light',
        var: '--color-danger-light',
      },
      { label: 'Main', bg: 'bg-danger', text: 'text-danger-fg', var: '--color-danger' },
      { label: 'Dark', bg: 'bg-danger-dark', text: 'text-danger-fg', var: '--color-danger-dark' },
    ],
  },
  {
    name: 'Warning',
    variants: [
      {
        label: 'Light',
        bg: 'bg-warning-light',
        text: 'text-warning-fg-light',
        var: '--color-warning-light',
      },
      { label: 'Main', bg: 'bg-warning', text: 'text-warning-fg', var: '--color-warning' },
      {
        label: 'Dark',
        bg: 'bg-warning-dark',
        text: 'text-warning-fg',
        var: '--color-warning-dark',
      },
    ],
  },
  {
    name: 'Success',
    variants: [
      {
        label: 'Light',
        bg: 'bg-success-light',
        text: 'text-success-fg-light',
        var: '--color-success-light',
      },
      { label: 'Main', bg: 'bg-success', text: 'text-success-fg', var: '--color-success' },
      {
        label: 'Dark',
        bg: 'bg-success-dark',
        text: 'text-success-fg',
        var: '--color-success-dark',
      },
    ],
  },
  {
    name: 'Info',
    variants: [
      {
        label: 'Light',
        bg: 'bg-info-light',
        text: 'text-info-fg-light',
        var: '--color-info-light',
      },
      { label: 'Main', bg: 'bg-info', text: 'text-info-fg', var: '--color-info' },
      { label: 'Dark', bg: 'bg-info-dark', text: 'text-info-fg', var: '--color-info-dark' },
    ],
  },
]

const grayShades = [
  'bg-gray-50',
  'bg-gray-100',
  'bg-gray-150',
  'bg-gray-200',
  'bg-gray-250',
  'bg-gray-300',
  'bg-gray-400',
  'bg-gray-500',
  'bg-gray-600',
  'bg-gray-700',
  'bg-gray-800',
  'bg-gray-900',
  'bg-gray-950',
  'bg-white',
  'bg-black',
]

const themeShades = [
  {
    name: 'Blue',
    shades: ['bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900', 'bg-blue-950'],
  },
  {
    name: 'Slate',
    shades: ['bg-slate-50', 'bg-slate-100', 'bg-slate-200', 'bg-slate-300', 'bg-slate-400', 'bg-slate-500', 'bg-slate-600', 'bg-slate-700', 'bg-slate-800', 'bg-slate-900', 'bg-slate-950'],
  },
  {
    name: 'Red',
    shades: ['bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900', 'bg-red-950'],
  },
  {
    name: 'Green',
    shades: ['bg-green-50', 'bg-green-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'bg-green-900', 'bg-green-950'],
  },
  {
    name: 'Yellow',
    shades: ['bg-yellow-50', 'bg-yellow-100', 'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700', 'bg-yellow-800', 'bg-yellow-900', 'bg-yellow-950'],
  },
]

const shadows = ['shadow-sm', 'shadow', 'shadow-lg', 'shadow-xl']

const borderColors = [
  { name: 'border', var: '--border' },
  { name: 'input', var: '--input' },
]
</script>

<template>
  <div class="space-y-14">
    <div v-for="group in semanticColors" :key="group.title" class="space-y-4">
      <h2 class="text-lg font-semibold text-foreground">{{ group.title }}</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          v-for="c in group.colors"
          :key="c.name"
          :class="[c.bg, 'rounded-lg p-4 h-24 flex flex-col justify-between border border-border']">
          <div :class="[c.text, 'text-sm font-semibold']">{{ c.name }}</div>
          <div :class="[c.text, 'text-[10px] font-mono opacity-70']">
            {{ c.var }}
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <h2 class="text-lg font-semibold text-foreground">Variants</h2>
      <div v-for="group in variantColors" :key="group.name" class="space-y-3">
        <div class="text-sm font-medium text-muted-foreground">{{ group.name }}</div>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="v in group.variants"
            :key="v.label"
            :class="[v.bg, 'rounded-lg h-20 p-3 flex flex-col justify-between']">
            <span :class="[v.text, 'text-xs font-semibold']">{{ v.label }}</span>
            <span :class="[v.text, 'text-[10px] font-mono opacity-70']">{{ v.var }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-lg font-semibold text-foreground">Grays</h2>
      <div class="grid grid-cols-6 md:grid-cols-11 gap-3">
        <div v-for="g in grayShades" :key="g" class="space-y-1 text-center">
          <div :class="`${g}`" class="h-16 rounded-md border border-border"></div>
          <code class="text-[10px] font-mono text-muted-foreground">{{ g }}</code>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <h2 class="text-lg font-semibold text-foreground">Theme Shades</h2>
      <div v-for="family in themeShades" :key="family.name" class="space-y-3">
        <div class="text-sm font-medium text-muted-foreground">{{ family.name }}</div>
        <div class="grid grid-cols-6 md:grid-cols-11 gap-3">
          <div v-for="shade in family.shades" :key="shade" class="space-y-1 text-center">
            <div :class="`${shade}`" class="h-16 rounded-md border border-border"></div>
            <code class="text-[10px] font-mono text-muted-foreground">{{ shade.replace('bg-', '') }}</code>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-lg font-semibold text-foreground">Borders</h2>
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="b in borderColors"
          :key="b.name"
          class="rounded-lg p-4 bg-card border border-border space-y-2">
          <div :class="`border-4 border-${b.name}`" class="h-10 rounded-md bg-background"></div>
          <code class="text-[10px] font-mono text-muted-foreground">{{ b.var }}</code>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-lg font-semibold text-foreground">Shadows</h2>
      <div class="grid grid-cols-4 gap-20">
        <div v-for="s in shadows" :key="s" class="rounded-lg p-4 aspect-square bg-body" :class="s">
          <code class="text-[10px] font-mono text-muted-foreground">{{ s }}</code>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button class="bg-primary text-primary-foreground rounded-lg py-3 font-semibold">
        Primary
      </button>

      <div class="bg-danger-light text-danger-fg-light rounded-lg p-3 flex items-center gap-2">
        <Icon icon="lucide:alert-circle" class="w-4 h-4" />
        Error
      </div>

      <div class="bg-success text-success-fg rounded-lg p-3 flex items-center gap-2">
        <Icon icon="lucide:check-circle" class="w-4 h-4" />
        Success
      </div>

      <div class="bg-info-light text-info-fg-light rounded-lg p-3 flex items-center gap-2">
        <Icon icon="lucide:info" class="w-4 h-4" />
        Info
      </div>
    </div>
  </div>
</template>
