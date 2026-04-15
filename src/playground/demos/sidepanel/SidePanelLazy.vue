<script setup lang="ts">
import { defineComponent, h, onMounted, ref } from 'vue'
import SidePanel from '@/components/SidePanel.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './SidePanelLazy.vue?raw'

// -------------------------------------------------------------------
// LazyProjectDetail: only mounts when its panel opens.
// This is the canonical :body pattern — ideal for list rows where
// each item has its own panel with expensive setup logic.
// -------------------------------------------------------------------
const LazyProjectDetail = defineComponent({
  props: {
    close:   { type: Function },
    project: {
      type: Object as () => { name: string; status: string; progress: number; desc: string; tag: string },
      default: () => ({ name: 'Project', status: 'Active', progress: 60, desc: '', tag: '' }),
    },
  },
  setup(props) {
    onMounted(() => {
      console.log('[LazyProjectDetail] Mounted for:', props.project.name)
    })

    const statusColor: Record<string, string> = {
      Active:    'bg-emerald-100 text-emerald-700',
      Review:    'bg-amber-100 text-amber-700',
      Completed: 'bg-blue-100 text-blue-700',
    }

    return () =>
      h('div', { class: 'space-y-5 py-1' }, [
        // Status + tag
        h('div', { class: 'flex items-center gap-2' }, [
          h('span', {
            class: `text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[props.project.status] ?? 'bg-muted text-muted-foreground'}`
          }, props.project.status),
          h('span', { class: 'text-xs text-muted-foreground' }, props.project.tag),
        ]),

        // Description
        h('p', { class: 'text-sm text-muted-foreground leading-relaxed' }, props.project.desc),

        // Progress bar
        h('div', { class: 'space-y-1.5' }, [
          h('div', { class: 'flex justify-between text-xs text-muted-foreground' }, [
            h('span', {}, 'Progress'),
            h('span', {}, `${props.project.progress}%`),
          ]),
          h('div', { class: 'h-2 w-full rounded-full bg-muted/30 overflow-hidden' }, [
            h('div', {
              class: 'h-full rounded-full bg-primary transition-all',
              style: { width: `${props.project.progress}%` },
            }),
          ]),
        ]),

        // Lazy mount note
        h('p', { class: 'text-xs text-muted-foreground border-t border-border/40 pt-3' },
          '💡 This component only mounts when the panel opens — check your browser console.'),

        // Actions
        h('div', { class: 'flex gap-2' }, [
          h(Button, { variant: 'outline', size: 'sm', class: 'flex-1', onClick: props.close }, () => 'Close'),
          h(Button, { size: 'sm', class: 'flex-1' }, () => 'Open Project'),
        ]),
      ])
  },
})

const projects = [
  { id: 1, name: 'Brand Redesign',    status: 'Active',    progress: 72, tag: '#design',     desc: 'Full visual identity overhaul including logo, colour palette, and typography guidelines.' },
  { id: 2, name: 'API v3 Migration',  status: 'Review',    progress: 45, tag: '#engineering', desc: 'Incrementally migrating all REST endpoints to the new versioned API with backward compatibility.' },
  { id: 3, name: 'Q2 Marketing Push', status: 'Completed', progress: 100, tag: '#marketing',  desc: 'Campaign targeting 3 new markets with A/B tested landing pages and email drip sequences.' },
]
</script>

<template>
  <DemoSection title="Lazy Body Component" :code="sourceCode">
    <div class="flex flex-col items-center gap-5 w-full">
      <p class="text-sm text-muted-foreground text-center max-w-sm">
        Pass a component via
        <code class="text-xs bg-muted/60 px-1 py-0.5 rounded font-mono">:body</code> — it is only
        instantiated when the panel opens. Ideal for project/user lists.
      </p>

      <!-- Single -->
      <SidePanel
        title="Project Details"
        :body="LazyProjectDetail"
        :body-props="{ project: projects[0] }">
        <Button icon="lucide:layout-dashboard">Open Details Panel</Button>
      </SidePanel>

      <!-- Iterated usage — table-row pattern -->
      <div class="w-full max-w-sm divide-y divide-border/40 rounded-lg border border-border/40 overflow-hidden">
        <div
          v-for="project in projects"
          :key="project.id"
          class="flex items-center justify-between px-4 py-3 bg-background hover:bg-muted/20 transition-colors">
          <div class="flex-1 min-w-0 pr-3">
            <p class="text-sm font-medium text-foreground truncate">{{ project.name }}</p>
            <div class="flex items-center gap-2 mt-0.5">
              <div class="h-1.5 w-20 rounded-full bg-muted/30 overflow-hidden">
                <div class="h-full rounded-full bg-primary" :style="{ width: `${project.progress}%` }" />
              </div>
              <span class="text-xs text-muted-foreground">{{ project.progress }}%</span>
            </div>
          </div>
          <SidePanel
            :title="project.name"
            :body="LazyProjectDetail"
            :body-props="{ project }">
            <Button variant="ghost" size="sm" icon="lucide:panel-right" />
          </SidePanel>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
