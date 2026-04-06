<script setup lang="ts">
import { computed } from 'vue'
import type { FooterData, FooterLabels } from './types'
import Icon from '../Icon.vue'

const props = withDefaults(
  defineProps<{
    data: FooterData
    labels?: FooterLabels
    containerClass?: string | any[] | Record<string, boolean>
  }>(),
  {}
)

const emit = defineEmits<{
  (e: 'link-click', url: string, event: MouseEvent): void
}>()

const d = computed(() => props.data)

const hasSocialLinks = computed(() => d.value.socialLinks && d.value.socialLinks.length > 0)
const hasLegalLinks = computed(() => d.value.legalLinks && d.value.legalLinks.length > 0)

function handleLinkClick(url: string, event: MouseEvent) {
  emit('link-click', url, event)
}
</script>

<template>
  <footer
    class="v-footer v-footer-v3 w-full bg-background text-foreground"
    :class="containerClass">
    <div class="mx-auto w-full max-w-7xl px-6 lg:px-8">
      <div
        class="py-6 flex flex-col md:flex-row flex-wrap items-center justify-between gap-6
               border-t border-border/50">
        <!-- Left: Logo + Copyright -->
        <div class="flex flex-col sm:flex-row items-center gap-3 min-w-0 text-center sm:text-left shrink-0">
          <div class="flex items-center gap-3">
            <img
              v-if="d.brandLogo"
              :src="d.brandLogo"
              :alt="d.brandName || 'Brand logo'"
              class="h-6 w-6 object-contain rounded shrink-0" />
            <span
              v-if="d.brandName"
              class="text-sm font-semibold text-foreground whitespace-nowrap">
              {{ d.brandName }}
            </span>
          </div>
          <span
            v-if="(d.brandLogo || d.brandName) && d.copyright"
            class="text-muted/30 hidden sm:inline">|</span>
          <p v-if="d.copyright" class="text-sm text-muted-foreground whitespace-nowrap">
            {{ d.copyright }}
          </p>
        </div>

        <!-- Center/Right: Legal Links -->
        <div v-if="hasLegalLinks" class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a
            v-for="(link, idx) in d.legalLinks"
            :key="idx"
            :href="link.url"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 whitespace-nowrap"
            @click="handleLinkClick(link.url, $event)">
            {{ link.label }}
          </a>
        </div>
        
        <!-- Right: Social Links -->
        <div v-if="hasSocialLinks" class="flex items-center gap-1 shrink-0">
          <a
            v-for="(social, idx) in d.socialLinks"
            :key="idx"
            :href="social.url"
            :aria-label="social.label || 'Social link'"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center w-8 h-8 rounded-lg
                   text-muted-foreground hover:text-foreground hover:bg-muted
                   transition-all duration-200"
            @click="handleLinkClick(social.url, $event)">
            <Icon :icon="social.icon" class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
