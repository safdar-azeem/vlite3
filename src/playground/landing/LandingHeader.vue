<script setup lang="ts">
import { useRouter } from 'vue-router'
import Badge from '@/components/Badge.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()

const navigateToComponents = () => {
  router.push('/components/button')
}
</script>

<template>
  <header class="landing-header">
    <div class="landing-container header-inner">
      <div class="header-left">
        <router-link to="/" class="logo-link">
          <div class="logo-mark">V</div>
          <span class="logo-text">vlite3</span>
        </router-link>
        <Badge variant="secondary" class="version-badge">v0.6.2</Badge>
      </div>
      <div class="header-right">
        <a href="https://github.com/safdar-azeem/vlite3" target="_blank" class="nav-link">
          <Icon icon="mdi:github" class="w-[18px] h-[18px]" />
          <span class="nav-link-text">GitHub</span>
        </a>
        <ThemeToggle variant="ghost" />
        <Button @click="navigateToComponents" size="sm" class="hidden sm:flex ml-2 font-medium">
          Get Started
        </Button>
      </div>
    </div>
  </header>
</template>

<style scoped>
@import './shared.css';

/* ── Header ── */
.landing-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--color-background) 80%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-foreground);
}

.logo-mark {
  width: 1.75rem;
  height: 1.75rem;
  background: var(--color-foreground);
  color: var(--color-background);
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
}

.logo-text {
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.02em;
}

.version-badge {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  padding: 0.1rem 0.5rem;
  background: var(--color-muted);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-muted-foreground);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--color-foreground);
}

@media (max-width: 640px) {
  .nav-link-text {
    display: none;
  }
}
</style>
