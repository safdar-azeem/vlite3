<script setup lang="ts">
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import AvatarGroup from '@/components/AvatarGroup/AvatarGroup.vue'
import Switch from '@/components/Switch.vue'
import CheckBox from '@/components/CheckBox.vue'
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue'
import Icon from '@/components/Icon.vue'
import Input from '@/components/Input.vue'
import TagInput from '@/components/TagInput/TagInput.vue'
import StatusChip from '@/components/StatusChip/StatusChip.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import Masonry from '@/components/Masonry/Masonry.vue'

import { dummyAvatarItems, dummyMasonryItems } from '../data/showcaseData'

defineProps<{
  previewType: string
}>()
</script>

<template>
  <Button v-if="previewType === 'button'" variant="primary" size="md" class="shadow-sm"
    >Action Button</Button
  >
  <div v-else-if="previewType === 'badge'" class="flex gap-2">
    <Badge variant="success" size="md">Active</Badge>
    <Badge variant="danger" size="md">Error</Badge>
  </div>
  <AvatarGroup
    v-else-if="previewType === 'avatargroup'"
    :items="dummyAvatarItems"
    :max="4"
    size="md" />
  <Switch v-else-if="previewType === 'switch'" :modelValue="true" label="Airplane Mode" />
  <CheckBox
    v-else-if="previewType === 'checkbox'"
    :modelValue="true"
    label="Accept Terms"
    size="lg" />
  <ProgressBar
    v-else-if="previewType === 'progress'"
    :modelValue="75"
    variant="primary"
    size="sm"
    class="w-full max-w-[200px]" />

  <div
    v-else-if="previewType === 'alert'"
    class="w-full max-w-[220px] px-3 py-2 text-xs bg-warning-subtle text-warning-subtle-fg border border-warning-subtle-border/20 rounded-lg flex items-start gap-2 shadow-sm">
    <Icon icon="lucide:alert-circle" class="w-4 h-4 shrink-0 mt-0.5" />
    <span class="font-medium">System update scheduled</span>
  </div>

  <Input
    v-else-if="previewType === 'input'"
    placeholder="Email address"
    icon="lucide:mail"
    class="w-full max-w-[220px] pointer-events-none" />

  <TagInput
    v-else-if="previewType === 'taginput'"
    :modelValue="['Vue', 'Tailwind']"
    placeholder="Add tag"
    class="w-full max-w-[220px] pointer-events-none" />

  <StatusChip v-else-if="previewType === 'statuschip'" status="success" size="medium" />

  <Pagination
    v-else-if="previewType === 'pagination'"
    :totalPages="5"
    :currentPage="2"
    navType="icon"
    rounded="full"
    class="scale-90 pointer-events-none" />

  <div
    v-else-if="previewType === 'dropdown'"
    class="flex flex-col items-center gap-2 w-full scale-70">
    <div
      class="px-2 py-1.5 border border-border rounded bg-background text-xs font-medium flex items-center gap-2 w-fit">
      My Project
      <Icon icon="iconamoon:arrow-down-2" class="w-4 h-4 text-muted-foreground" />
    </div>
    <div
      class="w-full max-w-[190px] bg-background border border-border rounded-xl shadow-lg overflow-hidden flex flex-col p-1 animate-in fade-in slide-in-from-top-1">
      <div class="px-2.5 py-1.5">
        <div class="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
          Workspace
        </div>
      </div>
      <div class="flex items-center gap-2.5 px-2.5 py-1.5 bg-muted rounded-lg group/item">
        <div
          class="w-5 h-5 rounded-md bg-primary/5 flex items-center justify-center border border-primary/20 shrink-0">
          <Icon icon="lucide:layout-dashboard" class="w-3 h-3 text-primary" />
        </div>
        <span class="text-xs font-bold text-foreground flex-1">Dashboard</span>
        <span class="text-[10px] text-muted-foreground font-mono">⌘D</span>
      </div>
      <div class="flex items-center gap-2.5 px-2.5 py-1.5 text-muted-foreground">
        <Icon icon="lucide:settings" class="w-4 h-4" />
        <span class="text-xs font-medium flex-1">Settings</span>
        <span class="text-[10px] text-muted-foreground/40 font-mono">⌘S</span>
      </div>
      <div class="border-t border-border/80 my-1"></div>
      <div class="flex items-center gap-2.5 px-2.5 py-1.5 text-muted-foreground">
        <Icon icon="lucide:plus-circle" class="w-4 h-4" />
        <span class="text-xs font-medium flex-1">Invite Team</span>
      </div>
      <div class="border-t border-border/80 my-1"></div>

      <div class="flex items-center gap-2.5 px-2.5 py-1.5 text-danger opacity-80">
        <Icon icon="lucide:trash-2" class="w-4 h-4" />
        <span class="text-xs font-medium flex-1">Delete Project</span>
      </div>
    </div>
  </div>

  <div v-else-if="previewType === 'radiogroup'" class="flex flex-col gap-2 w-full max-w-[160px]">
    <label class="flex items-center gap-2 text-sm text-foreground">
      <div class="w-4 h-4 rounded-full border border-primary flex items-center justify-center">
        <div class="w-2 h-2 rounded-full bg-primary"></div>
      </div>
      Option A
    </label>
    <label class="flex items-center gap-2 text-sm text-muted-foreground">
      <div class="w-4 h-4 rounded-full border border-border"></div>
      Option B
    </label>
  </div>

  <div v-else-if="previewType === 'slider'" class="w-full max-w-[200px] flex items-center gap-3">
    <span class="text-xs text-muted-foreground">0</span>
    <div class="h-2 flex-1 bg-muted rounded-full relative">
      <div class="absolute left-0 top-0 bottom-0 w-1/2 bg-primary rounded-full"></div>
      <div
        class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full shadow-sm"></div>
    </div>
    <span class="text-xs text-muted-foreground">100</span>
  </div>

  <div
    v-else-if="previewType === 'textarea'"
    class="w-full max-w-[200px] h-20 border border-border rounded-lg bg-background p-2 text-xs text-muted-foreground">
    Type your message here...
  </div>

  <div v-else-if="previewType === 'tooltip'" class="relative flex flex-col items-center">
    <div
      class="mb-2 px-2 py-1 bg-foreground text-background text-[10px] rounded shadow-sm whitespace-nowrap relative after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-foreground">
      Hover me
    </div>
    <div class="px-3 py-1.5 border border-border rounded-md text-xs font-medium bg-muted/50">
      Element
    </div>
  </div>

  <div v-else-if="previewType === 'breadcrumb'" class="flex items-center gap-2 text-xs">
    <span class="text-primary font-medium cursor-pointer">Home</span>
    <span class="text-muted-foreground">/</span>
    <span class="text-primary font-medium cursor-pointer">UI</span>
    <span class="text-muted-foreground">/</span>
    <span class="text-foreground font-medium">Grid</span>
  </div>

  <div v-else-if="previewType === 'tabs'" class="flex w-full max-w-[220px] border-b border-border">
    <div class="px-4 py-2 text-xs font-medium text-primary border-b-2 border-primary -mb-[1px]">
      Preview
    </div>
    <div class="px-4 py-2 text-xs font-medium text-muted-foreground">Code</div>
    <div class="px-4 py-2 text-xs font-medium text-muted-foreground">Props</div>
  </div>

  <div
    v-else-if="previewType === 'accordion'"
    class="w-full max-w-[220px] border border-border rounded-lg overflow-hidden bg-background shadow-sm">
    <div
      class="px-3 py-2 flex items-center justify-between border-b border-border text-sm font-medium">
      <span>Is it accessible?</span>
      <Icon icon="lucide:chevron-down" class="w-4 h-4 text-muted-foreground" />
    </div>
    <div class="px-3 py-2 text-xs text-muted-foreground bg-muted/10">
      Yes. It adheres to the WAI-ARIA design pattern.
    </div>
  </div>

  <div
    v-else-if="previewType === 'modal'"
    class="relative w-full max-w-[250px] h-28 flex items-center justify-center p-4 overflow-hidden">
    <div class="relative z-10 w-full bg-background border border-border rounded-lg p-3">
      <div class="text-xs font-bold mb-1">Confirm Action</div>
      <div class="text-[10px] text-muted-foreground mb-3">Are you sure you want to continue?</div>
      <div class="flex justify-end gap-2">
        <div class="px-2 py-1 bg-muted text-foreground text-[10px] rounded">Cancel</div>
        <div class="px-2 py-1 bg-primary text-primary-foreground text-[10px] rounded">Confirm</div>
      </div>
    </div>
  </div>

  <div
    v-else-if="previewType === 'toast'"
    class="w-full max-w-[220px] bg-background border border-border shadow-md rounded-lg p-3 flex gap-3 items-start">
    <div class="w-6 h-6 rounded-full bg-success flex items-center justify-center shrink-0">
      <Icon icon="lucide:check" class="w-3 h-3 text-success-fg" />
    </div>
    <div>
      <div class="text-xs font-bold mb-0.5">Message Sent</div>
      <div class="text-[10px] text-muted-foreground">Your email has been dispatched.</div>
    </div>
  </div>

  <div v-else-if="previewType === 'skeleton'" class="w-full max-w-[220px] flex gap-3 items-center">
    <div class="w-10 h-10 rounded-full bg-gray-250 animate-pulse shrink-0"></div>
    <div class="flex-1 space-y-2">
      <div class="h-3 bg-gray-250 rounded animate-pulse w-3/4"></div>
      <div class="h-3 bg-gray-250 rounded animate-pulse w-1/2"></div>
    </div>
  </div>

  <div
    v-else-if="previewType === 'appshell'"
    class="w-full max-w-[200px] h-24 border border-border rounded-sm bg-background flex overflow-hidden shadow-sm">
    <div class="w-12 border-r border-border flex flex-col gap-2 p-2">
      <div class="w-full h-3 bg-primary/20 rounded"></div>
      <div class="w-full h-2 bg-gray-300 rounded"></div>
      <div class="w-full h-2 bg-gray-300 rounded"></div>
    </div>
    <div class="flex-1 flex flex-col">
      <div class="h-6 border-b border-border bg-background px-2 flex items-center">
        <div class="w-10 h-1.5 bg-gray-300 rounded"></div>
      </div>
      <div class="flex-1 p-2 gap-2 flex flex-col bg-gray-100">
        <div class="w-1/2 h-2 bg-gray-300 rounded"></div>
        <div
          class="w-full h-full border border-dashed border-border/50 rounded bg-background"></div>
      </div>
    </div>
  </div>

  <div
    v-else-if="previewType === 'chart'"
    class="w-full max-w-[160px] h-24 flex items-end justify-between gap-1.5 pt-4">
    <div class="w-full bg-primary/30 rounded-t-md h-[40%]"></div>
    <div class="w-full bg-primary/60 rounded-t-md h-[70%]"></div>
    <div
      class="w-full bg-primary rounded-t-md h-[100%] shadow-[0_0_10px_rgba(var(--color-primary),0.3)]"></div>
    <div class="w-full bg-primary/50 rounded-t-md h-[60%]"></div>
    <div class="w-full bg-primary/30 rounded-t-md h-[30%]"></div>
  </div>

  <div v-else-if="previewType === 'kanban'" class="w-full max-w-[220px] flex gap-2">
    <div class="flex-1 bg-muted/20 rounded-lg p-1.5 flex flex-col gap-1.5 border border-border/50">
      <div class="h-1.5 w-10 bg-muted-foreground/30 rounded mb-0.5"></div>
      <div class="h-6 bg-background border border-border rounded-md shadow-sm"></div>
      <div class="h-6 bg-background border border-border rounded-md shadow-sm"></div>
    </div>
    <div class="flex-1 bg-muted/20 rounded-lg p-1.5 flex flex-col gap-1.5 border border-border/50">
      <div class="h-1.5 w-10 bg-muted-foreground/30 rounded mb-0.5"></div>
      <div class="h-6 bg-background border border-border rounded-md shadow-sm"></div>
    </div>
    <div
      class="flex-1 bg-muted/20 rounded-lg p-1.5 flex flex-col gap-1.5 border border-border/50 opacity-50">
      <div class="h-1.5 w-10 bg-muted-foreground/30 rounded mb-0.5"></div>
      <div class="h-6 bg-background border border-border border-dashed rounded-md"></div>
    </div>
  </div>

  <div
    v-else-if="previewType === 'invoice'"
    class="w-full max-w-[180px] bg-background border border-border rounded-lg shadow-sm p-3 flex flex-col text-[8px]">
    <div class="flex justify-between mb-2 border-b border-border pb-1.5">
      <span class="font-bold text-foreground">INVOICE</span>
      <span class="text-muted-foreground">#1024</span>
    </div>
    <div class="flex justify-between mb-1">
      <span class="text-muted-foreground">Premium Plan</span><span class="font-medium">$49</span>
    </div>
    <div class="flex justify-between mb-1">
      <span class="text-muted-foreground">Setup Fee</span><span class="font-medium">$15</span>
    </div>
    <div
      class="border-t border-border mt-1 pt-1.5 flex justify-between font-bold text-foreground text-[10px]">
      <span>Total</span><span>$64</span>
    </div>
  </div>

  <div
    v-else-if="previewType === 'form'"
    class="w-full max-w-[160px] bg-background border border-border rounded-xl shadow-sm p-3 flex flex-col gap-2.5">
    <div class="space-y-1">
      <div class="h-1.5 w-8 bg-muted-foreground/40 rounded"></div>
      <div class="h-5 bg-muted/30 border border-border rounded w-full"></div>
    </div>
    <div class="space-y-1">
      <div class="h-1.5 w-12 bg-muted-foreground/40 rounded"></div>
      <div class="h-5 bg-muted/30 border border-border rounded w-full"></div>
    </div>
    <div class="h-6 bg-primary rounded w-full mt-0.5 shadow-sm"></div>
  </div>

  <div
    v-else-if="previewType === 'chat'"
    class="w-full max-w-[200px] flex flex-col gap-2 text-[10px]">
    <div
      class="self-start bg-muted text-foreground px-2.5 py-1.5 rounded-xl rounded-tl-sm max-w-[80%] shadow-sm">
      Hello, how can I help?
    </div>
    <div
      class="self-end bg-primary text-primary-foreground px-2.5 py-1.5 rounded-xl rounded-tr-sm max-w-[80%] shadow-sm">
      I need some info about vlite3.
    </div>
    <div
      class="self-start bg-muted text-foreground px-2.5 py-1.5 rounded-xl rounded-tl-sm max-w-[80%] flex items-center gap-1 shadow-sm h-6">
      <div class="w-1 h-1 bg-muted-foreground rounded-full animate-pulse"></div>
      <div class="w-1 h-1 bg-muted-foreground rounded-full animate-pulse delay-75"></div>
      <div class="w-1 h-1 bg-muted-foreground rounded-full animate-pulse delay-150"></div>
    </div>
  </div>

  <div v-else-if="previewType === 'gantt'" class="w-full max-w-[220px]">
    <svg viewBox="0 0 220 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
      <rect x="0" y="0" width="50" height="100" fill="currentColor" fill-opacity="0.03" />
      <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" stroke-opacity="0.1" />
      <rect x="0" y="0" width="220" height="16" fill="currentColor" fill-opacity="0.03" />
      <line x1="0" y1="16" x2="220" y2="16" stroke="currentColor" stroke-opacity="0.1" />
      <rect x="58" y="5" width="20" height="3" rx="1" fill="currentColor" fill-opacity="0.15" />
      <rect x="100" y="5" width="20" height="3" rx="1" fill="currentColor" fill-opacity="0.15" />
      <rect x="142" y="5" width="20" height="3" rx="1" fill="currentColor" fill-opacity="0.15" />
      <rect x="184" y="5" width="20" height="3" rx="1" fill="currentColor" fill-opacity="0.15" />
      <line
        x1="90"
        y1="16"
        x2="90"
        y2="100"
        stroke="currentColor"
        stroke-opacity="0.05"
        stroke-dasharray="2 2" />
      <line
        x1="130"
        y1="16"
        x2="130"
        y2="100"
        stroke="currentColor"
        stroke-opacity="0.05"
        stroke-dasharray="2 2" />
      <line
        x1="170"
        y1="16"
        x2="170"
        y2="100"
        stroke="currentColor"
        stroke-opacity="0.05"
        stroke-dasharray="2 2" />
      <line x1="0" y1="36" x2="220" y2="36" stroke="currentColor" stroke-opacity="0.04" />
      <line x1="0" y1="56" x2="220" y2="56" stroke="currentColor" stroke-opacity="0.04" />
      <line x1="0" y1="76" x2="220" y2="76" stroke="currentColor" stroke-opacity="0.04" />
      <rect x="6" y="24" width="28" height="3" rx="1" fill="currentColor" fill-opacity="0.2" />
      <rect x="6" y="44" width="22" height="3" rx="1" fill="currentColor" fill-opacity="0.15" />
      <rect x="6" y="64" width="32" height="3" rx="1" fill="currentColor" fill-opacity="0.15" />
      <rect x="6" y="84" width="18" height="3" rx="1" fill="currentColor" fill-opacity="0.15" />
      <rect x="56" y="21" width="58" height="10" rx="3" fill="#6366F1" fill-opacity="0.8" />
      <rect x="56" y="21" width="38" height="10" rx="3" fill="#6366F1" />
      <rect x="80" y="41" width="52" height="10" rx="3" fill="#F59E0B" fill-opacity="0.8" />
      <rect x="80" y="41" width="30" height="10" rx="3" fill="#F59E0B" />
      <rect x="110" y="61" width="65" height="10" rx="3" fill="#10B981" fill-opacity="0.8" />
      <rect x="110" y="61" width="45" height="10" rx="3" fill="#10B981" />
      <rect
        x="183"
        y="79"
        width="9"
        height="9"
        rx="1.5"
        fill="#F59E0B"
        transform="rotate(45 187.5 83.5)" />
      <path
        d="M 114 26 L 122 26 L 122 46 L 130 46"
        stroke="currentColor"
        stroke-opacity="0.25"
        stroke-width="1"
        fill="none" />
      <path d="M 130 46 L 127 44 L 127 48 Z" fill="currentColor" fill-opacity="0.3" />
      <path
        d="M 132 46 L 142 46 L 142 66 L 150 66"
        stroke="currentColor"
        stroke-opacity="0.2"
        stroke-width="1"
        fill="none" />
      <path d="M 150 66 L 147 64 L 147 68 Z" fill="currentColor" fill-opacity="0.25" />
      <line
        x1="156"
        y1="16"
        x2="156"
        y2="100"
        stroke="#EF4444"
        stroke-width="1"
        stroke-opacity="0.4"
        stroke-dasharray="3 2" />
      <circle cx="156" cy="16" r="2" fill="#EF4444" fill-opacity="0.6" />
    </svg>
  </div>

  <div
    v-else-if="previewType === 'otpinput'"
    class="w-full max-w-[180px] flex gap-2.5 justify-center">
    <div
      class="w-11 h-12 rounded-lg border border-border bg-background shadow-sm flex items-center justify-center text-xl font-medium text-foreground">
      8
    </div>
    <div
      class="w-11 h-12 rounded-lg border border-border bg-background shadow-sm flex items-center justify-center text-xl font-medium text-foreground">
      4
    </div>
    <div
      class="w-11 h-12 rounded-lg border border-border bg-background shadow-sm flex items-center justify-center text-xl font-medium text-foreground">
      1
    </div>
    <div
      class="w-11 h-12 rounded-lg ring-2 border-primary border bg-background shadow-sm flex items-center justify-center relative">
      <div class="w-[2px] h-6 bg-primary animate-pulse rounded-full"></div>
    </div>
  </div>

  <div
    v-else-if="previewType === 'richtexteditor'"
    class="w-full max-w-[210px] bg-background border border-border rounded-xl shadow-md overflow-hidden flex flex-col">
    <div
      class="h-8 border-b border-border bg-muted/40 flex items-center px-2 gap-1.5 shadow-sm z-10">
      <Icon icon="lucide:bold" class="w-3.5 h-3.5 text-foreground" />
      <Icon icon="lucide:italic" class="w-3.5 h-3.5 text-muted-foreground" />
      <div class="w-[1px] h-4 bg-border mx-0.5"></div>
      <Icon icon="lucide:align-left" class="w-3.5 h-3.5 text-foreground" />
      <Icon icon="lucide:list" class="w-3.5 h-3.5 text-muted-foreground" />
      <div class="flex-1"></div>
    </div>
    <div class="p-3 space-y-2 bg-background h-20">
      <div class="h-2.5 bg-gray-600 rounded-full w-[65%] shadow-sm"></div>
      <div class="space-y-1.5">
        <div class="h-1.5 bg-gray-300 rounded-full w-[95%]"></div>
        <div class="h-1.5 bg-gray-300 rounded-full w-[85%]"></div>
        <div class="h-1.5 bg-gray-300 rounded-full w-[50%]"></div>
      </div>
    </div>
  </div>

  <div
    v-else-if="previewType === 'filepicker'"
    class="w-full max-w-[200px] h-24 rounded-xl border border-dashed border-primary/50 bg-primary/5 flex flex-col items-center justify-center gap-2">
    <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
      <Icon icon="lucide:upload-cloud" class="w-4 h-4" />
    </div>
    <div class="text-[10px] text-muted-foreground">Drop files here</div>
  </div>

  <div
    v-else-if="previewType === 'thumbnailselector'"
    class="w-full max-w-[200px] flex flex-col gap-2">
    <div
      class="w-full h-24 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden relative shadow-sm">
      <Icon icon="lucide:image" class="w-8 h-8 text-muted-foreground/60 stroke-[1.5]" />
    </div>
    <div class="flex gap-2 justify-between">
      <div
        class="w-12 h-10 rounded-lg border border-primary bg-muted overflow-hidden relative flex items-center justify-center shadow-sm">
        <Icon icon="lucide:image" class="w-4 h-4 text-foreground/80" />
      </div>
      <div
        class="w-12 h-10 rounded-lg border border-border bg-background overflow-hidden opacity-70 flex items-center justify-center">
        <Icon icon="lucide:image" class="w-4 h-4 text-muted-foreground/70" />
      </div>
      <div
        class="w-12 h-10 rounded-lg border border-border bg-background overflow-hidden opacity-70 flex items-center justify-center">
        <Icon icon="lucide:image" class="w-4 h-4 text-muted-foreground/70" />
      </div>
      <div
        class="w-12 h-10 rounded-lg border border-border bg-background overflow-hidden opacity-70 flex items-center justify-center">
        <Icon icon="lucide:image" class="w-4 h-4 text-muted-foreground/70" />
      </div>
    </div>
  </div>

  <div
    v-else-if="previewType === 'timeline'"
    class="w-full max-w-[180px] flex flex-col items-start gap-0 relative isolate">
    <div
      class="absolute left-3 top-2 bottom-2 w-px border-l-2 border-dashed border-border -z-10"></div>

    <div class="flex gap-2 w-full mb-3">
      <div
        class="w-6 h-6 rounded-full bg-primary text-primary-fg flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm z-10">
        1
      </div>
      <div class="flex flex-col gap-1 w-full pt-1">
        <div class="flex justify-between items-center w-full">
          <div class="h-2 bg-gray-300 rounded-sm w-8"></div>
        </div>
        <div
          class="h-10 border border-border bg-background rounded-md shadow-sm mt-0.5 p-1.5 flex gap-1.5 items-center">
          <div class="w-6 h-6 rounded bg-gray-300"></div>
          <div class="space-y-1">
            <div class="h-1.5 bg-gray-300 rounded w-12"></div>
            <div class="h-1 bg-gray-250 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-2 w-full mb-3">
      <div
        class="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm ring-4 ring-background z-10">
        2
      </div>
      <div class="flex flex-col gap-1 w-full pt-1">
        <div class="flex justify-between items-center w-full">
          <div class="h-2 bg-gray-300 rounded-sm w-12"></div>
        </div>
        <div class="h-1.5 bg-gray-250 rounded-sm w-[70%] mt-1"></div>
      </div>
    </div>

    <div class="flex gap-2 w-full">
      <div
        class="w-6 h-6 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center text-[10px] font-bold shrink-0 ring-4 ring-background z-10">
        3
      </div>
      <div class="flex flex-col gap-1 w-full pt-1">
        <div class="flex justify-between items-center w-full">
          <div class="h-2 bg-gray-300 rounded-sm w-10"></div>
        </div>
        <div class="h-1.5 bg-gray-250 rounded-sm w-[50%] mt-1"></div>
      </div>
    </div>
  </div>

  <div
    v-else-if="previewType === 'carousel'"
    class="w-full max-w-[300px] flex flex-col items-center gap-2 overflow-hidden py-1">
    <div class="relative w-full h-24 flex items-center justify-center">
      <div
        class="absolute left-[-20px] w-12 h-20 rounded-lg bg-muted border border-border opacity-60 flex items-center justify-center">
        <Icon icon="lucide:image" class="w-5 h-5 text-muted-foreground/40" />
      </div>
      <div
        class="relative w-[160px] h-24 rounded-xl bg-background border border-border shadow-sm flex flex-col items-center justify-center overflow-hidden z-10">
        <Icon icon="lucide:image" class="w-8 h-8 text-muted-foreground/50" />
        <div
          class="absolute left-1 w-5 h-5 rounded-full bg-muted flex items-center justify-center shadow-sm border border-border/80">
          <Icon icon="lucide:chevron-left" class="w-3 h-3 text-gray-600" />
        </div>
        <div
          class="absolute right-1 w-5 h-5 rounded-full bg-muted flex items-center justify-center shadow-sm border border-border/80">
          <Icon icon="lucide:chevron-right" class="w-3 h-3 text-gray-600" />
        </div>
      </div>
      <div
        class="absolute right-[-20px] w-12 h-20 rounded-lg bg-muted border border-border opacity-60 flex items-center justify-center">
        <Icon icon="lucide:image" class="w-5 h-5 text-muted-foreground/40" />
      </div>
    </div>
    <div class="flex gap-1.5 mt-0.5">
      <div class="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></div>
      <div class="w-3 h-1.5 rounded-full bg-foreground shadow-sm"></div>
      <div class="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></div>
      <div class="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></div>
    </div>
  </div>

  <div
    v-else-if="previewType === 'filetree'"
    class="w-full max-w-[200px] p-4 flex flex-col gap-2 overflow-hidden">
    <div class="flex items-center gap-2">
      <Icon icon="lucide:chevron-down" class="w-3.5 h-3.5 text-muted-foreground/50" />
      <Icon icon="lucide:folder" class="w-4.5 h-4.5 text-foreground/80" />
      <div class="h-2 bg-gray-300 rounded-full w-24"></div>
    </div>
    <div class="flex items-center gap-2 ml-4">
      <Icon icon="lucide:chevron-down" class="w-3.5 h-3.5 text-muted-foreground/50" />
      <Icon icon="lucide:folder" class="w-4.5 h-4.5 text-foreground/80" />
      <div class="h-2 bg-gray-300 rounded-full w-16"></div>
    </div>
    <div class="flex items-center gap-2 ml-6 py-1.5 px-2 bg-muted/60 rounded-lg">
      <Icon icon="lucide:chevron-down" class="w-3.5 h-3.5 text-muted-foreground/80" />
      <Icon icon="lucide:folder" class="w-4.5 h-4.5 text-foreground/90" />
      <div class="h-2 bg-gray-300 rounded-full w-20"></div>
    </div>
    <div class="flex items-center gap-2 ml-14">
      <Icon icon="lucide:file-text" class="w-4.5 h-4.5 text-muted-foreground/60" />
      <div class="h-2 bg-gray-300 rounded-full w-14"></div>
    </div>
    <div class="flex items-center gap-2 ml-4">
      <Icon icon="lucide:chevron-right" class="w-3.5 h-3.5 text-muted-foreground/50" />
      <Icon icon="lucide:folder" class="w-4.5 h-4.5 text-muted-foreground/60" />
      <div class="h-2 bg-gray-300 rounded-full w-12"></div>
    </div>
  </div>

  <div
    v-else-if="previewType === 'masonry'"
    class="w-full max-w-[240px] h-36 overflow-hidden relative group/masonry rounded-2xl">
    <Masonry :data="dummyMasonryItems" :cols="3" :gap="8" class="origin-top">
      <template #default="{ data }">
        <div
          :style="{ height: data.height + 'px' }"
          class="rounded-xl border border-white/5 transition-all duration-500 overflow-hidden relative shadow-lg shadow-black/20">
          <img
            :src="data.image"
            class="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.7]"
            alt="Masonry preview" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
      </template>
    </Masonry>
    <div
      class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-10"></div>
  </div>

  <div
    v-else-if="previewType === 'screen'"
    class="w-full max-w-[240px] h-[140px] border border-border rounded-xl bg-background shadow-md overflow-hidden flex flex-col cursor-default text-[6px]">
    
    <!-- Top Header & Toolbar -->
    <div class="px-2 pt-2 flex justify-between items-start shrink-0">
      <div class="flex flex-col gap-0.5">
        <div class="flex items-center gap-1">
          <span class="text-[8px] font-bold text-foreground">Users Directory</span>
          <Icon icon="lucide:info" class="w-2 h-2 text-muted-foreground/60" />
        </div>
        <div class="w-16 h-[2.5px] bg-muted-foreground/20 rounded mt-0.5"></div>
        <div class="w-12 h-[2.5px] bg-muted-foreground/20 rounded mt-[1px]"></div>
      </div>
      <div class="flex items-center gap-0.5 mt-0.5">
        <!-- Toolbar items -->
        <div class="flex items-center border border-border rounded-[2.5px] p-[1.5px] gap-[1px]">
           <div class="w-[7px] h-[7px] bg-muted rounded-[1px] flex items-center justify-center">
             <Icon icon="lucide:list" class="w-1.5 h-1.5 text-foreground" />
           </div>
           <div class="w-[7px] h-[7px] rounded-[1px] flex items-center justify-center">
             <Icon icon="lucide:grid" class="w-1.5 h-1.5 text-muted-foreground/60" />
           </div>
        </div>
        <!-- Search bar -->
        <div class="w-10 h-[12px] rounded-[2.5px] border border-border flex items-center px-1 ml-0.5">
          <Icon icon="lucide:search" class="w-[7px] h-[7px] text-muted-foreground/50" />
        </div>
        <!-- Add button -->
        <div class="px-1.5 h-[12px] rounded-[2.5px] bg-foreground flex items-center gap-0.5">
          <Icon icon="lucide:plus" class="w-2 h-2 text-background" />
          <span class="text-[4px] text-background font-bold tracking-wide">Add</span>
        </div>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="flex px-2 mt-2 gap-2 border-b border-border/40 shrink-0 text-muted-foreground font-medium">
      <div class="text-foreground border-b-[1.5px] border-foreground pb-0.5">All</div>
      <div class="pb-0.5">Active</div>
      <div class="pb-0.5">Inactive</div>
    </div>

    <!-- Table Header -->
    <div class="flex items-center px-2 py-1 bg-muted/20 border-b border-border/40 text-[4px] font-bold text-muted-foreground shrink-0 uppercase tracking-wider gap-1">
      <div class="w-1.5 h-1.5 rounded-[1px] border border-border shrink-0"></div>
      <div class="w-[45px] ml-1">USER</div>
      <div class="flex-1">EMAIL</div>
      <div class="w-8 text-center shrink-0">STATUS</div>
    </div>

    <!-- Table Body -->
    <div class="flex-1 overflow-hidden flex flex-col text-[5px]">
      <!-- Row 1 -->
      <div class="flex items-center px-2 py-1 border-b border-border/30 gap-1 shrink-0">
        <div class="w-1.5 h-1.5 rounded-[1px] border border-border shrink-0"></div>
        <div class="w-[45px] flex items-center gap-1.5 ml-1 shrink-0">
           <div class="w-3.5 h-3.5 rounded-full bg-gray-300 shrink-0"></div>
           <div class="w-7 h-[2.5px] bg-gray-600 rounded"></div>
        </div>
        <div class="flex-1">
           <div class="w-12 h-[2.5px] bg-gray-400 rounded"></div>
        </div>
        <div class="w-8 shrink-0 flex justify-center">
           <div class="w-6 h-[6px] bg-gray-200 text-gray-500 rounded-[2px] flex items-center justify-center font-bold text-[3px]">Active</div>
        </div>
      </div>
      <!-- Row 2 -->
      <div class="flex items-center px-2 py-1 border-b border-border/30 gap-1 shrink-0 bg-muted/10">
        <div class="w-1.5 h-1.5 rounded-[1px] border border-gray-800 shrink-0 bg-gray-800 flex items-center justify-center">
          <Icon icon="lucide:check" class="w-1 h-1 text-white" />
        </div>
        <div class="w-[45px] flex items-center gap-1.5 ml-1 shrink-0">
           <div class="w-3.5 h-3.5 rounded-full bg-gray-200 shrink-0"></div>
           <div class="w-8 h-[2.5px] bg-gray-600 rounded"></div>
        </div>
        <div class="flex-1">
           <div class="w-14 h-[2.5px] bg-gray-400 rounded"></div>
        </div>
        <div class="w-8 shrink-0 flex justify-center">
           <div class="w-6 h-[6px] bg-gray-100 text-gray-400 rounded-[2px] flex items-center justify-center font-bold text-[3px]">Pndg</div>
        </div>
      </div>
      <!-- Row 3 -->
      <div class="flex items-center px-2 py-1 gap-1 shrink-0">
        <div class="w-1.5 h-1.5 rounded-[1px] border border-border shrink-0"></div>
        <div class="w-[45px] flex items-center gap-1.5 ml-1 shrink-0">
           <div class="w-3.5 h-3.5 rounded-full bg-gray-300 shrink-0"></div>
           <div class="w-6 h-[2.5px] bg-gray-600 rounded"></div>
        </div>
        <div class="flex-1">
           <div class="w-10 h-[2.5px] bg-gray-400 rounded"></div>
        </div>
        <div class="w-8 shrink-0 flex justify-center">
           <div class="w-6 h-[6px] bg-gray-200 text-gray-500 rounded-[2px] flex items-center justify-center font-bold text-[3px]">Active</div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-else-if="previewType === 'datatable'"
    class="w-full max-w-[240px] border border-border rounded-sm shadow-sm bg-background overflow-hidden flex flex-col">
    <div class="flex items-center gap-2 bg-muted/50 border-b border-border px-2 py-1.5">
      <div class="w-2 h-2 rounded-xs bg-border/80 shrink-0"></div>
      <div class="h-1.5 bg-muted-foreground/50 rounded w-10"></div>
      <div class="h-1.5 bg-muted-foreground/50 rounded w-12 ml-auto"></div>
      <div class="h-1.5 bg-muted-foreground/50 rounded w-8"></div>
    </div>
    <div class="flex items-center gap-2 border-b border-border/50 px-2 py-1.5">
      <div class="w-2 h-2 rounded-xs bg-border shrink-0"></div>
      <div class="h-1.5 bg-foreground/70 rounded w-14"></div>
      <div class="h-1.5 bg-muted-foreground/40 rounded w-8 ml-auto"></div>
      <div class="h-1.5 bg-primary/60 rounded w-6"></div>
    </div>
    <div class="flex items-center gap-2 border-b border-border/50 px-2 py-1.5 bg-muted/40">
      <div class="w-2 h-2 rounded-xs bg-primary shrink-0 flex items-center justify-center">
        <Icon icon="lucide:check" class="w-1.5 h-1.5 text-primary-foreground" />
      </div>
      <div class="h-1.5 bg-foreground/90 rounded w-12"></div>
      <div class="h-1.5 bg-muted-foreground/40 rounded w-10 ml-auto"></div>
      <div class="h-1.5 bg-primary/60 rounded w-8"></div>
    </div>
    <div class="flex items-center gap-2 px-2 py-1.5">
      <div class="w-2 h-2 rounded-xs bg-border shrink-0"></div>
      <div class="h-1.5 bg-foreground/70 rounded w-16"></div>
      <div class="h-1.5 bg-muted-foreground/40 rounded w-6 ml-auto"></div>
      <div class="h-1.5 bg-primary/60 rounded w-10"></div>
    </div>
  </div>

  <div
    v-else-if="previewType === 'splitter'"
    class="w-full max-w-[240px] h-[140px] border border-border rounded-xl bg-background shadow-md overflow-hidden flex flex-col cursor-default">
    <!-- Top pane -->
    <div class="h-[50%] w-full flex flex-col bg-muted/5 relative overflow-hidden"></div>

    <!-- Vertical Resizer Handle (Horizontal Bar) -->
    <div class="h-1.5 w-full bg-border/40 flex items-center justify-center shrink-0">
      <div class="w-6 h-0.5 bg-muted-foreground/30 rounded-full"></div>
    </div>

    <!-- Bottom pane (Horizontal Split) -->
    <div class="flex-1 w-full flex overflow-hidden">
      <!-- Bottom Left pane -->
      <div class="w-[25%] h-full flex flex-col bg-muted/10 relative overflow-hidden"></div>

      <!-- Horizontal Resizer Handle (Vertical Bar) -->
      <div class="w-1.5 h-full bg-border/40 flex items-center justify-center shrink-0">
        <div class="h-6 w-0.5 bg-muted-foreground/30 rounded-full"></div>
      </div>

      <!-- Bottom Right pane -->
      <div class="flex-1 h-full flex flex-col bg-muted/5 relative overflow-hidden"></div>
    </div>
  </div>

  <div
    v-else
    class="text-sm font-medium text-muted-foreground border border-dashed border-border/60 rounded-lg px-4 py-2 bg-background">
    Hover to interact
  </div>
</template>
