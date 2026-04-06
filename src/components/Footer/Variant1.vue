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
  (e: 'subscribe', email: string): void
  (e: 'link-click', url: string, event: MouseEvent): void
}>()

const d = computed(() => props.data)
const l = computed(() => props.labels || {})

const newsletterEmail = defineModel<string>('newsletterEmail', { default: '' })

const hasLinkGroups = computed(() => d.value.linkGroups && d.value.linkGroups.length > 0)
const hasSocialLinks = computed(() => d.value.socialLinks && d.value.socialLinks.length > 0)
const hasLegalLinks = computed(() => d.value.legalLinks && d.value.legalLinks.length > 0)
const hasNewsletter = computed(() => !!d.value.newsletter)
const hasBrand = computed(() => d.value.brandName || d.value.brandLogo || d.value.brandDescription)
const hasBottomBar = computed(() => d.value.copyright || hasLegalLinks.value)

function handleSubscribe() {
  if (newsletterEmail.value.trim()) {
    emit('subscribe', newsletterEmail.value.trim())
  }
}

function handleLinkClick(url: string, event: MouseEvent) {
  emit('link-click', url, event)
}
</script>

<template>
  <footer
    class="v-footer v-footer-v1 w-full bg-background text-foreground"
    :class="containerClass">
    <!-- ── Top Section: Brand + Link Groups ── -->
    <div class="v-footer-top">
      <div
        class="mx-auto w-full max-w-7xl px-6 lg:px-8"
        :class="hasLinkGroups ? 'py-12 lg:py-16' : 'py-8 lg:py-10'">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <!-- Brand Column -->
          <div
            v-if="hasBrand || hasSocialLinks || hasNewsletter"
            class="flex flex-col gap-5 lg:max-w-xs shrink-0">
            <!-- Logo + Name -->
            <div v-if="d.brandLogo || d.brandName" class="flex items-center gap-3">
              <img
                v-if="d.brandLogo"
                :src="d.brandLogo"
                :alt="d.brandName || 'Brand logo'"
                class="h-8 w-8 object-contain rounded" />
              <span
                v-if="d.brandName"
                class="text-lg font-bold text-foreground tracking-tight">
                {{ d.brandName }}
              </span>
              <span
                v-if="d.badge"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">
                {{ d.badge }}
              </span>
            </div>

            <!-- Description -->
            <p
              v-if="d.brandDescription"
              class="text-sm text-muted-foreground leading-relaxed">
              {{ d.brandDescription }}
            </p>

            <!-- Newsletter (in brand column for Variant1) -->
            <div v-if="hasNewsletter" class="space-y-3 pt-1">
              <p
                v-if="d.newsletter?.title"
                class="text-sm font-semibold text-foreground">
                {{ d.newsletter.title }}
              </p>
              <p
                v-if="d.newsletter?.description"
                class="text-xs text-muted-foreground leading-relaxed">
                {{ d.newsletter.description }}
              </p>
              <form class="flex gap-2" @submit.prevent="handleSubscribe">
                <input
                  v-model="newsletterEmail"
                  type="email"
                  :placeholder="d.newsletter?.placeholder || 'Enter your email'"
                  class="flex-1 min-w-0 px-3 py-2 text-sm bg-muted border border-border rounded-lg
                         text-foreground placeholder:text-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                         transition-all" />
                <button
                  type="submit"
                  class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground
                         rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap
                         focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {{ d.newsletter?.buttonText || l.subscribe || 'Subscribe' }}
                </button>
              </form>
            </div>

            <!-- Social Links -->
            <div v-if="hasSocialLinks" class="flex items-center gap-1 pt-1">
              <a
                v-for="(social, idx) in d.socialLinks"
                :key="idx"
                :href="social.url"
                :aria-label="social.label || 'Social link'"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center w-9 h-9 rounded-lg
                       text-muted-foreground hover:text-foreground hover:bg-muted
                       transition-all duration-200"
                @click="handleLinkClick(social.url, $event)">
                <Icon :icon="social.icon" class="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

          <!-- Link Groups -->
          <div
            v-if="hasLinkGroups"
            class="flex-1 grid gap-8 sm:gap-6"
            :style="{
              gridTemplateColumns: `repeat(${Math.min(d.linkGroups!.length, 4)}, minmax(0, 1fr))`
            }">
            <div v-for="(group, gIdx) in d.linkGroups" :key="gIdx">
              <h3 class="text-sm font-semibold text-foreground mb-4 tracking-wide">
                {{ group.title }}
              </h3>
              <ul class="space-y-3">
                <li v-for="(link, lIdx) in group.links" :key="lIdx">
                  <a
                    :href="link.url"
                    :target="link.external ? '_blank' : undefined"
                    :rel="link.external ? 'noopener noreferrer' : undefined"
                    class="inline-flex items-center gap-2 text-sm text-muted-foreground
                           hover:text-foreground transition-colors duration-200"
                    @click="handleLinkClick(link.url, $event)">
                    <Icon v-if="link.icon" :icon="link.icon" class="w-3.5 h-3.5 shrink-0" />
                    <span>{{ link.label }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Bottom Bar ── -->
    <div v-if="hasBottomBar" class="v-footer-bottom border-t border-border">
      <div
        class="mx-auto w-full max-w-7xl px-6 lg:px-8 py-5
               flex flex-col sm:flex-row items-center justify-between gap-4">
        <p v-if="d.copyright" class="text-sm text-muted-foreground">
          {{ d.copyright }}
        </p>
        <div v-if="hasLegalLinks" class="flex items-center gap-x-5">
          <a
            v-for="(link, idx) in d.legalLinks"
            :key="idx"
            :href="link.url"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            @click="handleLinkClick(link.url, $event)">
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
