<script setup lang="ts">
import { computed } from 'vue'
import type { FooterData, FooterLabels } from './types'
import Icon from '../Icon.vue'
import Input from '../Input.vue'
import Button from '../Button.vue'

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
    class="v-footer v-footer-v2 w-full bg-background text-foreground"
    :class="containerClass">
    <div class="mx-auto w-full max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
      <!-- ── Centered Brand Section ── -->
      <div v-if="hasBrand" class="text-center mb-10">
        <!-- Logo + Name -->
        <div
          v-if="d.brandLogo || d.brandName"
          class="flex items-center justify-center gap-3 mb-3">
          <img
            v-if="d.brandLogo"
            :src="d.brandLogo"
            :alt="d.brandName || 'Brand logo'"
            class="h-10 w-10 object-contain rounded" />
          <span
            v-if="d.brandName"
            class="text-xl font-bold text-foreground tracking-tight">
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
          class="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          {{ d.brandDescription }}
        </p>
      </div>

      <!-- ── Newsletter (centered) ── -->
      <div v-if="hasNewsletter" class="max-w-md mx-auto text-center mb-10">
        <p
          v-if="d.newsletter?.title"
          class="text-sm font-semibold text-foreground mb-1">
          {{ d.newsletter.title }}
        </p>
        <p
          v-if="d.newsletter?.description"
          class="text-xs text-muted-foreground leading-relaxed mb-3">
          {{ d.newsletter.description }}
        </p>
        <form class="flex gap-2 w-full" @submit.prevent="handleSubscribe">
          <Input
            v-model="newsletterEmail"
            type="email"
            :placeholder="d.newsletter?.placeholder || 'Enter your email'"
            class="flex-1 min-w-0"
            input-class="bg-muted border-border focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            rounded="lg"
          />
          <Button
            type="submit"
            variant="primary"
            rounded="lg"
            class="whitespace-nowrap"
          >
            {{ d.newsletter?.buttonText || l.subscribe || 'Subscribe' }}
          </Button>
        </form>
      </div>

      <!-- ── Link Groups (horizontal, centered cluster) ── -->
      <div
        v-if="hasLinkGroups"
        class="flex flex-wrap justify-center gap-10 sm:gap-16 md:gap-20 lg:gap-24 mb-12 w-full mx-auto"
      >
        <div v-for="(group, gIdx) in d.linkGroups" :key="gIdx" class="flex flex-col items-center sm:items-start text-center sm:text-left min-w-[140px]">
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

      <!-- ── Social Links (centered) ── -->
      <div v-if="hasSocialLinks" class="flex items-center justify-center gap-1 mb-8">
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

    <!-- ── Bottom Bar ── -->
    <div v-if="hasBottomBar" class="v-footer-bottom border-t border-border/50">
      <div
        class="mx-auto w-full max-w-7xl px-6 lg:px-8 py-6
               flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-4 text-center">
        <p v-if="d.copyright" class="text-sm text-muted-foreground">
          {{ d.copyright }}
        </p>
        <span
          v-if="d.copyright && hasLegalLinks"
          class="hidden sm:inline text-muted/30">|</span>
        <div v-if="hasLegalLinks" class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
