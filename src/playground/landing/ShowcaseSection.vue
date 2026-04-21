<script setup lang="ts">
import { useRouter } from 'vue-router'
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

const router = useRouter()

const allComponents = [
  {
    name: 'Button',
    desc: 'Interactive elements with various variants.',
    link: '/components/button',
    previewType: 'button',
  },
  {
    name: 'Badge',
    desc: 'Small status indicators for elements.',
    link: '/components/badge',
    previewType: 'badge',
  },
  {
    name: 'Avatar Group',
    desc: 'Stack of user avatars with overflow.',
    link: '/components/avatargroup',
    previewType: 'avatargroup',
  },
  {
    name: 'Switch',
    desc: 'Toggle switches for boolean states.',
    link: '/components/switch',
    previewType: 'switch',
  },
  {
    name: 'Checkbox',
    desc: 'Standard check controls.',
    link: '/components/checkbox',
    previewType: 'checkbox',
  },
  {
    name: 'Progress',
    desc: 'Visual indicators of completion.',
    link: '/components/progressbar',
    previewType: 'progress',
  },
  {
    name: 'Alert',
    desc: 'Important contextual feedback messages.',
    link: '/components/alert',
    previewType: 'alert',
  },
  {
    name: 'Input',
    desc: 'Text input fields with icons and addons.',
    link: '/components/input',
    previewType: 'input',
  },
  {
    name: 'Tag Input',
    desc: 'Input field for managing multiple tags.',
    link: '/components/taginput',
    previewType: 'taginput',
  },
  {
    name: 'Status Chip',
    desc: 'Semantic status badges with icons.',
    link: '/components/statuschip',
    previewType: 'statuschip',
  },
  {
    name: 'Pagination',
    desc: 'Navigation for paginated content.',
    link: '/components/pagination',
    previewType: 'pagination',
  },
  {
    name: 'Dropdown',
    desc: 'Contextual menus and select inputs.',
    link: '/components/dropdown',
    previewType: 'dropdown',
  },
  {
    name: 'Radio Group',
    desc: 'Mutually exclusive selection controls.',
    link: '/components/radiogroup',
    previewType: 'radiogroup',
  },
  {
    name: 'Slider',
    desc: 'Range selection with visual feedback.',
    link: '/components/slider',
    previewType: 'slider',
  },
  {
    name: 'Textarea',
    desc: 'Multi-line text input fields.',
    link: '/components/textarea',
    previewType: 'textarea',
  },
  {
    name: 'Tooltip',
    desc: 'Contextual help text on hover.',
    link: '/components/tooltip',
    previewType: 'tooltip',
  },
  {
    name: 'Breadcrumb',
    desc: 'Hierarchical navigation trails.',
    link: '/components/breadcrumb',
    previewType: 'breadcrumb',
  },
  {
    name: 'Tabs',
    desc: 'Organize content into multiple panels.',
    link: '/components/tabs',
    previewType: 'tabs',
  },
  {
    name: 'Accordion',
    desc: 'Vertically collapsing content panels.',
    link: '/components/accordion',
    previewType: 'accordion',
  },
  {
    name: 'Modal',
    desc: 'Dialog overlays for critical actions.',
    link: '/components/modal',
    previewType: 'modal',
  },
  {
    name: 'Toast',
    desc: 'Brief, temporary notifications.',
    link: '/components/toast',
    previewType: 'toast',
  },
  // 6 Newly Added Advanced Components
  {
    name: 'App Shell',
    desc: 'Responsive dashboard layout wrappers.',
    link: '/components/appshell',
    previewType: 'appshell',
  },
  {
    name: 'Gantt Chart',
    desc: 'Interactive project scheduling with drag-and-drop.',
    link: '/components/ganttchart',
    previewType: 'gantt',
  },
  {
    name: 'Chart',
    desc: 'Data visualization and metrics.',
    link: '/components/chart',
    previewType: 'chart',
  },
  {
    name: 'Kanban',
    desc: 'Drag-and-drop task management boards.',
    link: '/components/kanban',
    previewType: 'kanban',
  },

  {
    name: 'Skeleton',
    desc: 'Placeholder loading state variants.',
    link: '/components/skeleton',
    previewType: 'skeleton',
  },
  {
    name: 'Invoice',
    desc: 'Billing and receipt presentation templates.',
    link: '/components/invoice',
    previewType: 'invoice',
  },
  {
    name: 'Form',
    desc: 'Structured data entry and validation.',
    link: '/components/form',
    previewType: 'form',
  },
  {
    name: 'Chat',
    desc: 'Conversational UI messaging bubbles.',
    link: '/components/chat',
    previewType: 'chat',
  },
  {
    name: 'OTP Input',
    desc: 'Secure one-time password entry fields.',
    link: '/components/otpinput',
    previewType: 'otpinput',
  },
  {
    name: 'Rich Text Editor',
    desc: 'Advanced WYSIWYG text editing interface.',
    link: '/components/richtexteditor',
    previewType: 'richtexteditor',
  },
  {
    name: 'File Picker',
    desc: 'Drag & drop file upload and selection.',
    link: '/components/filepicker',
    previewType: 'filepicker',
  },
  {
    name: 'Thumbnail Selector',
    desc: 'Visual media gallery and selection.',
    link: '/components/thumbnailselector',
    previewType: 'thumbnailselector',
  },
]

const dummyAvatarItems = [
  { src: 'https://i.pravatar.cc/150?u=1' },
  { src: 'https://i.pravatar.cc/150?u=2' },
  { src: 'https://i.pravatar.cc/150?u=3' },
  { src: 'https://i.pravatar.cc/150?u=4' },
  { src: 'https://i.pravatar.cc/150?u=5' },
]
</script>

<template>
  <section class="py-24 bg-muted/20 border-y border-border overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16" v-scroll-reveal>
        <span class="text-sm font-semibold text-primary uppercase tracking-wider"
          >Component Grid</span
        >
        <h2 class="mt-3 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          A glimpse into <span class="text-primary">the ecosystem</span>
        </h2>
        <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
          Every piece works harmoniously together to build enterprise-grade applications.
        </p>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        style="will-change: transform; contain: layout style">
        <div
          v-for="(comp, i) in allComponents"
          :key="i"
          v-memo="[comp.name]"
          v-scroll-reveal="{ delay: (i % 4) * 50 }"
          class="group bg-background border border-border/60 hover:border-border rounded-2xl overflow-hidden cursor-pointer flex flex-col"
          @click="router.push(comp.link)">
          <div
            class="h-40 bg-muted/30 flex items-center justify-center p-6 border-b border-border/50 relative overflow-hidden">
            <div
              class="absolute inset-0 opacity-[0.03] pointer-events-none"
              style="
                background-image: radial-gradient(#000 1px, transparent 1px);
                background-size: 10px 10px;
              "></div>

            <div class="relative z-10 w-full flex items-center justify-center">
              <Button
                v-if="comp.previewType === 'button'"
                variant="primary"
                size="md"
                class="shadow-sm"
                >Action Button</Button
              >
              <div v-else-if="comp.previewType === 'badge'" class="flex gap-2">
                <Badge variant="success" size="md">Active</Badge>
                <Badge variant="danger" size="md">Error</Badge>
              </div>
              <AvatarGroup
                v-else-if="comp.previewType === 'avatargroup'"
                :items="dummyAvatarItems"
                :max="4"
                size="md" />
              <Switch
                v-else-if="comp.previewType === 'switch'"
                :modelValue="true"
                label="Airplane Mode" />
              <CheckBox
                v-else-if="comp.previewType === 'checkbox'"
                :modelValue="true"
                label="Accept Terms"
                size="lg" />
              <ProgressBar
                v-else-if="comp.previewType === 'progress'"
                :modelValue="75"
                variant="primary"
                size="md"
                class="w-full max-w-[200px]" />

              <div
                v-else-if="comp.previewType === 'alert'"
                class="w-full max-w-[220px] px-3 py-2 text-xs bg-warning-subtle text-warning-subtle-fg border border-warning-subtle-border/20 rounded-lg flex items-start gap-2 shadow-sm">
                <Icon icon="lucide:alert-circle" class="w-4 h-4 shrink-0 mt-0.5" />
                <span class="font-medium">System update scheduled</span>
              </div>

              <Input
                v-else-if="comp.previewType === 'input'"
                placeholder="Email address"
                icon="lucide:mail"
                class="w-full max-w-[220px] pointer-events-none" />

              <TagInput
                v-else-if="comp.previewType === 'taginput'"
                :modelValue="['Vue', 'Tailwind']"
                placeholder="Add tag"
                class="w-full max-w-[220px] pointer-events-none" />

              <StatusChip
                v-else-if="comp.previewType === 'statuschip'"
                status="success"
                size="medium" />

              <Pagination
                v-else-if="comp.previewType === 'pagination'"
                :totalPages="5"
                :currentPage="2"
                navType="icon"
                rounded="full"
                class="scale-90 pointer-events-none" />

              <div
                v-else-if="comp.previewType === 'dropdown'"
                class="w-full max-w-[200px] border border-border rounded-lg bg-card shadow-sm overflow-hidden flex flex-col">
                <div
                  class="px-3 py-2 border-b border-border bg-muted/20 text-xs font-medium flex justify-between items-center">
                  Options <Icon icon="lucide:chevron-down" class="w-3 h-3" />
                </div>
                <div class="px-3 py-1.5 text-xs text-muted-foreground flex items-center gap-2">
                  <Icon icon="lucide:user" class="w-3 h-3" /> Profile
                </div>
                <div
                  class="px-3 py-1.5 text-xs text-muted-foreground flex items-center gap-2 bg-muted/40">
                  <Icon icon="lucide:settings" class="w-3 h-3" /> Settings
                </div>
              </div>

              <div
                v-else-if="comp.previewType === 'radiogroup'"
                class="flex flex-col gap-2 w-full max-w-[160px]">
                <label class="flex items-center gap-2 text-sm text-foreground">
                  <div
                    class="w-4 h-4 rounded-full border border-primary flex items-center justify-center">
                    <div class="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  Option A
                </label>
                <label class="flex items-center gap-2 text-sm text-muted-foreground">
                  <div class="w-4 h-4 rounded-full border border-border"></div>
                  Option B
                </label>
              </div>

              <div
                v-else-if="comp.previewType === 'slider'"
                class="w-full max-w-[200px] flex items-center gap-3">
                <span class="text-xs text-muted-foreground">0</span>
                <div class="h-2 flex-1 bg-muted rounded-full relative">
                  <div class="absolute left-0 top-0 bottom-0 w-1/2 bg-primary rounded-full"></div>
                  <div
                    class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full shadow-sm"></div>
                </div>
                <span class="text-xs text-muted-foreground">100</span>
              </div>

              <div
                v-else-if="comp.previewType === 'textarea'"
                class="w-full max-w-[200px] h-20 border border-border rounded-lg bg-background p-2 text-xs text-muted-foreground">
                Type your message here...
              </div>

              <div
                v-else-if="comp.previewType === 'tooltip'"
                class="relative flex flex-col items-center">
                <div
                  class="mb-2 px-2 py-1 bg-foreground text-background text-[10px] rounded shadow-sm whitespace-nowrap relative after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-foreground">
                  Hover me
                </div>
                <div
                  class="px-3 py-1.5 border border-border rounded-md text-xs font-medium bg-muted/50">
                  Element
                </div>
              </div>

              <div
                v-else-if="comp.previewType === 'breadcrumb'"
                class="flex items-center gap-2 text-xs">
                <span class="text-primary font-medium cursor-pointer">Home</span>
                <span class="text-muted-foreground">/</span>
                <span class="text-primary font-medium cursor-pointer">UI</span>
                <span class="text-muted-foreground">/</span>
                <span class="text-foreground font-medium">Grid</span>
              </div>

              <div
                v-else-if="comp.previewType === 'tabs'"
                class="flex w-full max-w-[220px] border-b border-border">
                <div
                  class="px-4 py-2 text-xs font-medium text-primary border-b-2 border-primary -mb-[1px]">
                  Preview
                </div>
                <div class="px-4 py-2 text-xs font-medium text-muted-foreground">Code</div>
                <div class="px-4 py-2 text-xs font-medium text-muted-foreground">Props</div>
              </div>

              <div
                v-else-if="comp.previewType === 'accordion'"
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
                v-else-if="comp.previewType === 'modal'"
                class="relative w-full max-w-[220px] h-28 border border-border rounded-lg bg-muted/30 flex items-center justify-center p-4 overflow-hidden">
                <div class="absolute inset-0 bg-background/50 backdrop-blur-[1px]"></div>
                <div
                  class="relative z-10 w-full bg-background border border-border shadow-lg rounded-lg p-3">
                  <div class="text-xs font-bold mb-1">Confirm Action</div>
                  <div class="text-[10px] text-muted-foreground mb-3">
                    Are you sure you want to continue?
                  </div>
                  <div class="flex justify-end gap-2">
                    <div class="px-2 py-1 bg-muted text-foreground text-[10px] rounded">Cancel</div>
                    <div class="px-2 py-1 bg-primary text-primary-foreground text-[10px] rounded">
                      Confirm
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-else-if="comp.previewType === 'toast'"
                class="w-full max-w-[220px] bg-background border border-border shadow-md rounded-lg p-3 flex gap-3 items-start">
                <div
                  class="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                  <Icon icon="lucide:check" class="w-3 h-3 text-success" />
                </div>
                <div>
                  <div class="text-xs font-bold mb-0.5">Message Sent</div>
                  <div class="text-[10px] text-muted-foreground">
                    Your email has been dispatched.
                  </div>
                </div>
              </div>

              <div
                v-else-if="comp.previewType === 'skeleton'"
                class="w-full max-w-[220px] flex gap-3 items-center">
                <div class="w-10 h-10 rounded-full bg-gray-250 animate-pulse shrink-0"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-3 bg-gray-250 rounded animate-pulse w-3/4"></div>
                  <div class="h-3 bg-gray-250 rounded animate-pulse w-1/2"></div>
                </div>
              </div>

              <div
                v-else-if="comp.previewType === 'appshell'"
                class="w-full max-w-[200px] h-24 border border-border rounded-lg bg-background flex overflow-hidden shadow-sm">
                <div class="w-12 bg-muted/30 border-r border-border flex flex-col gap-2 p-2">
                  <div class="w-full h-3 bg-primary/20 rounded"></div>
                  <div class="w-full h-2 bg-muted rounded"></div>
                  <div class="w-full h-2 bg-muted rounded"></div>
                </div>
                <div class="flex-1 flex flex-col">
                  <div class="h-6 border-b border-border bg-background px-2 flex items-center">
                    <div class="w-10 h-1.5 bg-muted rounded"></div>
                  </div>
                  <div class="flex-1 p-2 gap-2 flex flex-col bg-muted/10">
                    <div class="w-1/2 h-2 bg-muted rounded"></div>
                    <div
                      class="w-full h-full border border-dashed border-border/50 rounded bg-background"></div>
                  </div>
                </div>
              </div>

              <div
                v-else-if="comp.previewType === 'chart'"
                class="w-full max-w-[160px] h-24 flex items-end justify-between gap-1.5 pt-4">
                <div class="w-full bg-primary/30 rounded-t-md h-[40%]"></div>
                <div class="w-full bg-primary/60 rounded-t-md h-[70%]"></div>
                <div
                  class="w-full bg-primary rounded-t-md h-[100%] shadow-[0_0_10px_rgba(var(--color-primary),0.3)]"></div>
                <div class="w-full bg-primary/50 rounded-t-md h-[60%]"></div>
                <div class="w-full bg-primary/30 rounded-t-md h-[30%]"></div>
              </div>

              <div
                v-else-if="comp.previewType === 'kanban'"
                class="w-full max-w-[220px] flex gap-2">
                <div
                  class="flex-1 bg-muted/20 rounded-lg p-1.5 flex flex-col gap-1.5 border border-border/50">
                  <div class="h-1.5 w-10 bg-muted-foreground/30 rounded mb-0.5"></div>
                  <div class="h-6 bg-background border border-border rounded-md shadow-sm"></div>
                  <div class="h-6 bg-background border border-border rounded-md shadow-sm"></div>
                </div>
                <div
                  class="flex-1 bg-muted/20 rounded-lg p-1.5 flex flex-col gap-1.5 border border-border/50">
                  <div class="h-1.5 w-10 bg-muted-foreground/30 rounded mb-0.5"></div>
                  <div class="h-6 bg-background border border-border rounded-md shadow-sm"></div>
                </div>
                <div
                  class="flex-1 bg-muted/20 rounded-lg p-1.5 flex flex-col gap-1.5 border border-border/50 opacity-50">
                  <div class="h-1.5 w-10 bg-muted-foreground/30 rounded mb-0.5"></div>
                  <div
                    class="h-6 bg-background border border-border border-dashed rounded-md"></div>
                </div>
              </div>

              <div
                v-else-if="comp.previewType === 'invoice'"
                class="w-full max-w-[180px] bg-background border border-border rounded-lg shadow-sm p-3 flex flex-col text-[8px]">
                <div class="flex justify-between mb-2 border-b border-border pb-1.5">
                  <span class="font-bold text-foreground">INVOICE</span>
                  <span class="text-muted-foreground">#1024</span>
                </div>
                <div class="flex justify-between mb-1">
                  <span class="text-muted-foreground">Premium Plan</span
                  ><span class="font-medium">$49</span>
                </div>
                <div class="flex justify-between mb-1">
                  <span class="text-muted-foreground">Setup Fee</span
                  ><span class="font-medium">$15</span>
                </div>
                <div
                  class="border-t border-border mt-1 pt-1.5 flex justify-between font-bold text-foreground text-[10px]">
                  <span>Total</span><span>$64</span>
                </div>
              </div>

              <div
                v-else-if="comp.previewType === 'form'"
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
                v-else-if="comp.previewType === 'chat'"
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
                  <div
                    class="w-1 h-1 bg-muted-foreground rounded-full animate-pulse delay-75"></div>
                  <div
                    class="w-1 h-1 bg-muted-foreground rounded-full animate-pulse delay-150"></div>
                </div>
              </div>

              <div v-else-if="comp.previewType === 'gantt'" class="w-full max-w-[220px]">
                <svg
                  viewBox="0 0 220 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-full">
                  <!-- Sidebar background -->
                  <rect
                    x="0"
                    y="0"
                    width="50"
                    height="100"
                    fill="currentColor"
                    fill-opacity="0.03" />
                  <line
                    x1="50"
                    y1="0"
                    x2="50"
                    y2="100"
                    stroke="currentColor"
                    stroke-opacity="0.1" />
                  <!-- Header -->
                  <rect
                    x="0"
                    y="0"
                    width="220"
                    height="16"
                    fill="currentColor"
                    fill-opacity="0.03" />
                  <line
                    x1="0"
                    y1="16"
                    x2="220"
                    y2="16"
                    stroke="currentColor"
                    stroke-opacity="0.1" />
                  <!-- Header labels -->
                  <rect
                    x="58"
                    y="5"
                    width="20"
                    height="3"
                    rx="1"
                    fill="currentColor"
                    fill-opacity="0.15" />
                  <rect
                    x="100"
                    y="5"
                    width="20"
                    height="3"
                    rx="1"
                    fill="currentColor"
                    fill-opacity="0.15" />
                  <rect
                    x="142"
                    y="5"
                    width="20"
                    height="3"
                    rx="1"
                    fill="currentColor"
                    fill-opacity="0.15" />
                  <rect
                    x="184"
                    y="5"
                    width="20"
                    height="3"
                    rx="1"
                    fill="currentColor"
                    fill-opacity="0.15" />
                  <!-- Grid lines -->
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
                  <!-- Row lines -->
                  <line
                    x1="0"
                    y1="36"
                    x2="220"
                    y2="36"
                    stroke="currentColor"
                    stroke-opacity="0.04" />
                  <line
                    x1="0"
                    y1="56"
                    x2="220"
                    y2="56"
                    stroke="currentColor"
                    stroke-opacity="0.04" />
                  <line
                    x1="0"
                    y1="76"
                    x2="220"
                    y2="76"
                    stroke="currentColor"
                    stroke-opacity="0.04" />
                  <!-- Sidebar task names -->
                  <rect
                    x="6"
                    y="24"
                    width="28"
                    height="3"
                    rx="1"
                    fill="currentColor"
                    fill-opacity="0.2" />
                  <rect
                    x="6"
                    y="44"
                    width="22"
                    height="3"
                    rx="1"
                    fill="currentColor"
                    fill-opacity="0.15" />
                  <rect
                    x="6"
                    y="64"
                    width="32"
                    height="3"
                    rx="1"
                    fill="currentColor"
                    fill-opacity="0.15" />
                  <rect
                    x="6"
                    y="84"
                    width="18"
                    height="3"
                    rx="1"
                    fill="currentColor"
                    fill-opacity="0.15" />
                  <!-- Task bars -->
                  <rect
                    x="56"
                    y="21"
                    width="58"
                    height="10"
                    rx="3"
                    fill="#6366F1"
                    fill-opacity="0.8" />
                  <rect x="56" y="21" width="38" height="10" rx="3" fill="#6366F1" />
                  <rect
                    x="80"
                    y="41"
                    width="52"
                    height="10"
                    rx="3"
                    fill="#F59E0B"
                    fill-opacity="0.8" />
                  <rect x="80" y="41" width="30" height="10" rx="3" fill="#F59E0B" />
                  <rect
                    x="110"
                    y="61"
                    width="65"
                    height="10"
                    rx="3"
                    fill="#10B981"
                    fill-opacity="0.8" />
                  <rect x="110" y="61" width="45" height="10" rx="3" fill="#10B981" />
                  <!-- Milestone diamond -->
                  <rect
                    x="183"
                    y="79"
                    width="9"
                    height="9"
                    rx="1.5"
                    fill="#F59E0B"
                    transform="rotate(45 187.5 83.5)" />
                  <!-- Dependency connectors -->
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
                  <!-- Today marker -->
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

              <!-- OTP Input preview -->
              <div
                v-else-if="comp.previewType === 'otpinput'"
                class="w-full max-w-[180px] flex gap-2 justify-center">
                <div class="w-10 h-10 rounded-md border-2 border-primary bg-background shadow-sm flex items-center justify-center text-lg font-bold text-foreground">8</div>
                <div class="w-10 h-10 rounded-md border border-border bg-background shadow-sm flex items-center justify-center text-lg font-bold text-foreground">4</div>
                <div class="w-10 h-10 rounded-md border border-border bg-background shadow-sm flex items-center justify-center text-lg font-bold text-foreground">1</div>
                <div class="w-10 h-10 rounded-md border border-border bg-muted/20 flex items-center justify-center">
                  <div class="w-2 h-4 bg-primary/50 animate-pulse"></div>
                </div>
              </div>

              <!-- Rich Text Editor preview -->
              <div
                v-else-if="comp.previewType === 'richtexteditor'"
                class="w-full max-w-[200px] bg-background border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div class="h-7 border-b border-border bg-muted/30 flex items-center px-2 gap-1.5">
                  <div class="w-3 h-3 rounded-sm bg-muted-foreground/30"></div>
                  <div class="w-3 h-3 rounded-sm bg-muted-foreground/30"></div>
                  <div class="w-[1px] h-3 bg-border mx-0.5"></div>
                  <div class="flex-1"></div>
                  <div class="w-3 h-3 rounded-sm bg-muted-foreground/30"></div>
                </div>
                <div class="p-2 space-y-1.5 bg-background h-16">
                  <div class="h-2 bg-foreground/80 rounded w-[60%]"></div>
                  <div class="h-1.5 bg-muted-foreground/40 rounded w-[90%]"></div>
                  <div class="h-1.5 bg-muted-foreground/40 rounded w-[70%]"></div>
                </div>
              </div>

              <!-- File Picker preview -->
              <div
                v-else-if="comp.previewType === 'filepicker'"
                class="w-full max-w-[200px] h-24 rounded-xl border border-dashed border-primary/50 bg-primary/5 flex flex-col items-center justify-center gap-2 group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon icon="lucide:upload-cloud" class="w-4 h-4" />
                </div>
                <div class="text-[10px] text-muted-foreground">Drop files here</div>
              </div>

              <!-- Thumbnail Selector preview -->
              <div
                v-else-if="comp.previewType === 'thumbnailselector'"
                class="w-full max-w-[200px] flex flex-col gap-1.5">
                <div class="w-full h-16 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden relative">
                  <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                  <Icon icon="lucide:image" class="w-6 h-6 text-muted-foreground/40" />
                </div>
                <div class="flex gap-1.5 justify-between">
                  <div class="w-11 h-10 rounded border-2 border-primary bg-muted overflow-hidden relative opacity-100 flex items-center justify-center">
                    <Icon icon="lucide:image" class="w-4 h-4 text-primary/50" />
                  </div>
                  <div class="w-11 h-10 rounded border border-border bg-muted overflow-hidden opacity-60 flex items-center justify-center">
                    <Icon icon="lucide:image" class="w-4 h-4 text-muted-foreground/40" />
                  </div>
                  <div class="w-11 h-10 rounded border border-border bg-muted overflow-hidden opacity-60 flex items-center justify-center">
                    <Icon icon="lucide:image" class="w-4 h-4 text-muted-foreground/40" />
                  </div>
                  <div class="w-11 h-10 rounded border border-border bg-muted overflow-hidden opacity-60 flex items-center justify-center">
                    <span class="text-[8px] font-medium text-muted-foreground">+3</span>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="text-sm font-medium text-muted-foreground border border-dashed border-border/60 rounded-lg px-4 py-2 bg-background">
                Hover to interact
              </div>
            </div>
          </div>
          <div class="p-5 flex-1 flex flex-col">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-base font-bold text-foreground">{{ comp.name }}</h3>
              <Icon
                icon="lucide:arrow-up-right"
                class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary" />
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ comp.desc }}</p>
          </div>
        </div>
      </div>

      <div class="mt-20 text-center border-t border-border pt-12" v-scroll-reveal>
        <h3 class="text-2xl font-bold text-foreground mb-4">Ready to see more?</h3>
        <p class="text-muted-foreground mb-8 max-w-xl mx-auto">
          Explore the full collection of accessible, customizable, and beautifully designed
          components built for modern Vue applications.
        </p>
        <Button
          @click="router.push('/components')"
          size="lg"
          class="rounded-full h-12 px-8 text-base font-medium shadow-none group">
          Explore All Components
          <Icon icon="lucide:arrow-right" class="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  </section>
</template>
