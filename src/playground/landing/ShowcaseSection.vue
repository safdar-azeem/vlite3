<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import AvatarGroup from '@/components/AvatarGroup/AvatarGroup.vue'
import Switch from '@/components/Switch.vue'
import CheckBox from '@/components/CheckBox.vue'
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue'
import Icon from '@/components/Icon.vue'

const router = useRouter()

const allComponents = [
  { name: 'Button', desc: 'Interactive elements with various variants.', link: '/components/button', previewType: 'button' },
  { name: 'Badge', desc: 'Small status indicators for elements.', link: '/components/badge', previewType: 'badge' },
  { name: 'Avatar Group', desc: 'Stack of user avatars with overflow.', link: '/components/avatar-group', previewType: 'avatargroup' },
  { name: 'Switch', desc: 'Toggle switches for boolean states.', link: '/components/switch', previewType: 'switch' },
  { name: 'Checkbox', desc: 'Standard check controls.', link: '/components/checkbox', previewType: 'checkbox' },
  { name: 'Progress', desc: 'Visual indicators of completion.', link: '/components/progress', previewType: 'progress' },
  { name: 'Alert', desc: 'Important contextual feedback messages.', link: '/components/alert', previewType: 'alert' },
  { name: 'Dropdown', desc: 'Contextual menus and select inputs.', link: '/components/dropdown', previewType: 'dropdown' },
  { name: 'Modal', desc: 'Dialog overlays for critical interactions.', link: '/components/modal', previewType: 'modal' },
  { name: 'SidePanel', desc: 'Off-canvas slide-out panels.', link: '/components/sidepanel', previewType: 'sidepanel' },
  { name: 'Data Table', desc: 'Powerful data grids with sorting.', link: '/components/datatable', previewType: 'datatable' },
  { name: 'Charts', desc: 'Beautiful, accessible SVG charts.', link: '/components/charts', previewType: 'chart' },
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
  <section class="showcase-grid-section">
    <div class="landing-container">
      <div class="section-header animate-fade-up">
        <span class="section-eyebrow">Component Grid</span>
        <h2 class="section-title">
          A glimpse into <span class="text-primary">the ecosystem</span>
        </h2>
        <p class="section-subtitle">
          Every piece works harmoniously together to build enterprise-grade applications.
        </p>
      </div>

      <div class="bento-grid">
        <div v-for="(comp, i) in allComponents" :key="i" class="bento-card animate-fade-up" :style="{ animationDelay: `${150 + (i % 4) * 50}ms` }" @click="router.push(comp.link)">
          <div class="bento-preview">
            <Button v-if="comp.previewType === 'button'" variant="primary" size="sm">Primary</Button>
            <Badge v-else-if="comp.previewType === 'badge'" variant="success">Completed</Badge>
            <AvatarGroup v-else-if="comp.previewType === 'avatargroup'" :items="dummyAvatarItems" :max="3" size="sm" />
            <Switch v-else-if="comp.previewType === 'switch'" :modelValue="true" />
            <CheckBox v-else-if="comp.previewType === 'checkbox'" :modelValue="true" label="Agree" />
            <ProgressBar v-else-if="comp.previewType === 'progress'" :modelValue="65" variant="primary" size="sm" class="w-3/4" />
            <div v-else-if="comp.previewType === 'alert'" class="w-full px-2 text-[10px] bg-warning-subtle text-warning-subtle-fg border border-warning/20 rounded p-1.5 flex items-center gap-1.5">
              <Icon icon="lucide:alert-circle" class="w-3 h-3" /> Warning Message
            </div>
            <div v-else-if="comp.previewType === 'dropdown'" class="border border-border rounded text-[10px] px-2 py-1 bg-background flex items-center justify-between w-24">
              Select <Icon icon="lucide:chevron-down" class="w-3 h-3" />
            </div>
            <div v-else-if="comp.previewType === 'datatable'" class="w-full space-y-1 opacity-70 px-2">
              <div class="h-2 bg-muted rounded w-full"></div>
              <div class="h-2 bg-muted rounded w-5/6"></div>
              <div class="h-2 bg-muted rounded w-4/6"></div>
            </div>
            <div v-else-if="comp.previewType === 'chart'" class="flex items-end justify-center gap-1 h-8 w-full opacity-70">
              <div class="w-3 bg-primary rounded-t h-4"></div>
              <div class="w-3 bg-primary rounded-t h-7"></div>
              <div class="w-3 bg-primary rounded-t h-5"></div>
            </div>
            <Icon v-else icon="lucide:component" class="w-6 h-6 text-muted-foreground/50" />
          </div>
          <div class="bento-info">
            <h3 class="bento-title">{{ comp.name }}</h3>
            <p class="bento-desc">{{ comp.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import './shared.css';

/* ── Bento Grid Showcase ── */
.showcase-grid-section {
  padding: 5rem 0;
  background: color-mix(in srgb, var(--color-muted) 30%, transparent);
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  max-width: 1000px;
  margin: 0 auto;
}

.bento-card {
  background: var(--color-background);
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.bento-card:hover {
  border-color: color-mix(in srgb, var(--color-primary) 50%, var(--color-border));
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px color-mix(in srgb, var(--color-foreground) 5%, transparent);
}

.bento-preview {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--color-muted) 50%, transparent);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.bento-title {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: var(--color-foreground);
}

.bento-desc {
  font-size: 0.8rem;
  color: var(--color-muted-foreground);
  line-height: 1.4;
}
</style>
