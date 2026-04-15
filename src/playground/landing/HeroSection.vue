<script setup lang="ts">
import { useRouter } from 'vue-router'
import Badge from '@/components/Badge.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import Clipboard from '@/components/Clipboard.vue'

const router = useRouter()

const navigateToComponents = () => {
  router.push('/components/getting-started')
}
</script>

<template>
  <section v-once class="hero-section">
    <div class="landing-container hero-inner">
      <Badge variant="outline" class="hero-pill" v-scroll-reveal>
        <span class="hero-pill-badge">New</span>
        <span>v1.2.5 fully free & open-source</span>
        <Icon icon="lucide:arrow-right" class="w-3 h-3 ml-1" />
      </Badge>

      <h1 class="hero-title" v-scroll-reveal="{ delay: 150 }">
        Build clean interfaces <br />
        <span class="text-muted-foreground font-light">without the bloat.</span>
      </h1>

      <p class="hero-desc" v-scroll-reveal="{ delay: 300 }">
        A comprehensive, fully open-source Vue 3 component library built on Tailwind CSS v4.
        Designed for developers who value minimal aesthetics, semantic code, and blazing
        performance.
      </p>

      <div class="hero-actions" v-scroll-reveal="{ delay: 450 }">
        <Button
          @click="navigateToComponents"
          size="xl"
          class="rounded-full px-8 text-base font-medium">
          Get Started
        </Button>

        <div class="hero-cmd">
          <span class="hero-cmd-prompt">$</span>
          <span class="hero-cmd-text">npm install vlite3</span>
          <Clipboard
            text-to-copy="npm install vlite3"
            as-icon
            rounded="full"
            class="w-8 h-8 bg-background border-border shrink-0" />
        </div>
      </div>

      <div class="hero-stats" v-scroll-reveal="{ delay: 600 }">
        <div class="stat-item">
          <span class="stat-value">80+</span>
          <span class="stat-label">Components</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">100%</span>
          <span class="stat-label">Open Source</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">v4</span>
          <span class="stat-label">Tailwind CSS</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">TS</span>
          <span class="stat-label">TypeScript</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import './shared.css';

/* ── Hero Section ── */
.hero-section {
  padding: 5rem 4rem 10rem 4rem;
  text-align: center;
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
}

.hero-pill {
  margin-bottom: 2rem;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  background: color-mix(in srgb, var(--color-muted) 50%, transparent);
  border-color: color-mix(in srgb, var(--color-border) 60%, transparent);
}

.hero-pill-badge {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.75rem;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  color: var(--color-foreground);
}

.hero-desc {
  font-size: clamp(1.125rem, 2vw, 1.25rem);
  color: var(--color-muted-foreground);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2.5rem;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

@media (min-width: 640px) {
  .hero-actions {
    flex-direction: row;
    justify-content: center;
  }
}

.hero-cmd {
  display: flex;
  align-items: center;
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  padding: 0 0.5rem 0 1.25rem;
  height: 3rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  color: var(--color-foreground);
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero-cmd:hover {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 5%, var(--color-muted));
}

.hero-cmd-prompt {
  color: var(--color-muted-foreground);
  margin-right: 0.5rem;
}

.hero-cmd-text {
  margin-right: 1.5rem;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid color-mix(in srgb, var(--color-border) 40%, transparent);
  width: 100%;
  max-width: 600px;
}

@media (max-width: 640px) {
  .hero-stats {
    flex-wrap: wrap;
    gap: 1rem;
  }
  .stat-divider {
    display: none;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-foreground);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted-foreground);
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background: var(--color-border);
}
</style>
