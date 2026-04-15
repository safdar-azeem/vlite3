<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()
const navigateToComponents = () => {
  router.push('/components/button')
}
</script>

<template>
  <header class="landing-header editorial-border-b">
    <div class="landing-container header-inner">
      <div class="header-left">
        <router-link to="/" class="logo">
          VLITE<span class="italic font-normal">3</span>
        </router-link>
      </div>
      <nav class="header-center hidden md:flex">
        <a href="#features" class="nav-link">Philosophy</a>
        <a href="#components" class="nav-link">Index</a>
        <a href="#code" class="nav-link">Integration</a>
      </nav>
      <div class="header-right">
        <ThemeToggle variant="ghost" class="theme-toggle rounded-none!" />
        <Button @click="navigateToComponents" size="sm" variant="outline" class="rounded-none! border-[var(--editorial-border)]! text-[var(--editorial-fg)]! bg-transparent! hover:bg-[var(--editorial-fg)]! hover:text-[var(--editorial-bg)]! font-body uppercase text-xs tracking-wider transition-colors duration-300">
          Documentation
        </Button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.landing-header {
  height: 5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--editorial-bg);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  text-decoration: none;
  color: var(--editorial-fg);
  letter-spacing: -0.02em;
}

.header-center {
  gap: 2.5rem;
}

.nav-link {
  font-family: var(--font-body);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--editorial-fg);
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--editorial-accent);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.theme-toggle {
  color: var(--editorial-fg) !important;
}
.theme-toggle:hover {
  background: transparent !important;
  color: var(--editorial-accent) !important;
}
</style>
