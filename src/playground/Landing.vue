<script setup lang="ts">
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const navigateToComponents = () => {
  router.push('/components/button')
}

// Animated component counter
const componentCount = ref(0)
const targetCount = 80

onMounted(() => {
  let current = 0
  const step = Math.ceil(targetCount / 60)
  const interval = setInterval(() => {
    current += step
    if (current >= targetCount) {
      componentCount.value = targetCount
      clearInterval(interval)
    } else {
      componentCount.value = current
    }
  }, 30)
})

const copied = ref(false)
const copyInstall = () => {
  navigator.clipboard.writeText('npm install vlite3')
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const categories = [
  {
    title: 'Forms & Inputs',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>`,
    count: 17,
    items: ['Input', 'Textarea', 'DatePicker', 'MultiSelect', 'Switch', 'Slider', 'OTP Input', 'ColorPicker', 'Form'],
    color: 'from-blue-500/10 to-indigo-500/10',
    borderColor: 'border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Data Display',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 16l4-8 4 4 4-6"/></svg>`,
    count: 16,
    items: ['DataTable', 'DataList', 'Calendar', 'Heatmap', 'Charts', 'Timeline', 'Stats', 'Avatar'],
    color: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Navigation & Layout',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
    count: 14,
    items: ['Navbar', 'Sidebar Menu', 'Breadcrumb', 'Tabs', 'Accordion', 'Splitter', 'File Tree', 'Carousel'],
    color: 'from-violet-500/10 to-purple-500/10',
    borderColor: 'border-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    title: 'Overlays & Feedback',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9"/><path d="M12 8v4l2 2"/></svg>`,
    count: 13,
    items: ['Modal', 'SidePanel', 'Dropdown', 'Toast', 'Tooltip', 'Alert', 'Chat', 'Command Palette'],
    color: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Buttons & Actions',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 15l-2 5L9 9l11 4-5 2z"/><path d="M18.5 18.5L22 22"/></svg>`,
    count: 4,
    items: ['Button', 'Button Group', 'Badge', 'Chip'],
    color: 'from-rose-500/10 to-pink-500/10',
    borderColor: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    title: 'Tools & Utilities',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    count: 10,
    items: ['Kanban', 'Invoice', 'Pricing Plan', 'Export', 'Import', 'Barcode', 'QRCode', 'i18n'],
    color: 'from-cyan-500/10 to-sky-500/10',
    borderColor: 'border-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
]

const features = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    title: 'Clean by Default',
    desc: 'Every component is designed with minimal visual noise, ample whitespace, and purpose-driven aesthetics.',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m2 12 5.4 2.1 2.3 5.6M12 2v6.5l5 3"/><path d="m22 12-5.4-2.1-2.3-5.6"/></svg>`,
    title: 'Semantic Theming',
    desc: 'CSS variable-driven design tokens with full dark mode. Customize your entire UI with a few token swaps.',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
    title: '80+ Components',
    desc: 'From simple buttons to complex Kanbans, DataTables, and Charts — everything you need in one library.',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`,
    title: 'Global Config System',
    desc: 'Plugin-based architecture for app-wide defaults. Set form styles, upload handlers, and i18n in one place.',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.27 6.96 8.73 5.05 8.73-5.05"/><path d="M12 22.08V12"/></svg>`,
    title: 'Vue 3 + Tailwind v4',
    desc: 'Built on the latest Vue 3 Composition API and Tailwind CSS v4 for cutting-edge developer experience.',
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-4-4"/></svg>`,
    title: 'Tree-Shakeable',
    desc: 'Import only what you use. Each component is independently importable for optimal bundle size.',
  },
]
</script>

<template>
  <div class="landing-root">
    <!-- Ambient background grid -->
    <div class="grid-bg" aria-hidden="true"></div>

    <!-- Navbar -->
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
          <a
            href="https://github.com/safdar-azeem/vlite3"
            target="_blank"
            class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span class="nav-link-text">GitHub</span>
          </a>
          <ThemeToggle />
          <Button @click="navigateToComponents" size="sm" class="rounded-full px-5 font-medium">
            Explore Components
          </Button>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="landing-container hero-inner">
        <div class="hero-badge-wrapper animate-fade-up">
          <a
            href="https://github.com/safdar-azeem/vlite3"
            target="_blank"
            class="hero-announcement">
            <span class="hero-announcement-dot"></span>
            <span>Open Source — Star us on GitHub</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>

        <h1 class="hero-title animate-fade-up delay-1">
          Build stunning interfaces
          <br />
          <span class="hero-title-accent">with fewer decisions.</span>
        </h1>

        <p class="hero-subtitle animate-fade-up delay-2">
          A minimalistic, production-ready Vue 3 UI library with {{ componentCount }}+ beautifully crafted
          components. Built on Tailwind CSS v4. Designed for clarity, speed, and joy.
        </p>

        <div class="hero-actions animate-fade-up delay-3">
          <Button @click="navigateToComponents" size="lg"
            class="rounded-full h-12 px-8 text-base font-medium shadow-lg hover:-translate-y-0.5 transition-all">
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>

          <button class="install-btn" @click="copyInstall">
            <span class="install-prefix">$</span>
            <span class="install-command">npm install vlite3</span>
            <span class="install-copy">
              <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="text-success">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
          </button>
        </div>

        <!-- Stats row -->
        <div class="hero-stats animate-fade-up delay-4">
          <div class="stat-item">
            <span class="stat-value">{{ componentCount }}+</span>
            <span class="stat-label">Components</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">7</span>
            <span class="stat-label">Categories</span>
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

    <!-- Features Grid -->
    <section class="features-section">
      <div class="landing-container">
        <div class="section-header animate-fade-up">
          <span class="section-eyebrow">Why vlite3</span>
          <h2 class="section-title">
            Crafted for developers who value
            <span class="text-primary">simplicity</span>
          </h2>
          <p class="section-subtitle">
            Every pixel is intentional. Every API is ergonomic. Built for teams that ship fast.
          </p>
        </div>

        <div class="features-grid">
          <div v-for="(feature, i) in features" :key="i" class="feature-card animate-fade-up"
            :style="{ animationDelay: `${150 + i * 80}ms` }">
            <div class="feature-icon" v-html="feature.icon"></div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Component Categories -->
    <section class="categories-section">
      <div class="landing-container">
        <div class="section-header animate-fade-up">
          <span class="section-eyebrow">Component Library</span>
          <h2 class="section-title">
            Everything you need,
            <span class="text-primary">nothing you don't</span>
          </h2>
          <p class="section-subtitle">
            From basic inputs to complex data grids and kanban boards — all with a consistent, clean API.
          </p>
        </div>

        <div class="categories-grid">
          <div v-for="(cat, i) in categories" :key="i" class="category-card animate-fade-up"
            :style="{ animationDelay: `${200 + i * 80}ms` }">
            <div class="category-header">
              <div class="category-icon" :class="cat.iconColor" v-html="cat.icon"></div>
              <div>
                <h3 class="category-title">{{ cat.title }}</h3>
                <span class="category-count">{{ cat.count }} components</span>
              </div>
            </div>
            <div class="category-items">
              <span v-for="item in cat.items" :key="item" class="category-tag">{{ item }}</span>
              <span v-if="cat.count > cat.items.length" class="category-tag category-tag-more">
                +{{ cat.count - cat.items.length }} more
              </span>
            </div>
          </div>
        </div>

        <div class="categories-cta animate-fade-up">
          <Button @click="navigateToComponents" size="lg"
            class="rounded-full h-12 px-10 text-base font-medium shadow-md">
            Browse All Components
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </section>

    <!-- Code Preview Section -->
    <section class="code-section">
      <div class="landing-container">
        <div class="section-header animate-fade-up">
          <span class="section-eyebrow">Quick Start</span>
          <h2 class="section-title">
            Up and running in
            <span class="text-primary">minutes</span>
          </h2>
        </div>

        <div class="code-grid animate-fade-up">
          <div class="code-step">
            <div class="code-step-number">1</div>
            <h3 class="code-step-title">Install</h3>
            <div class="code-block">
              <code><span class="code-muted">$</span> npm install vlite3</code>
            </div>
          </div>
          <div class="code-step">
            <div class="code-step-number">2</div>
            <h3 class="code-step-title">Configure Tailwind</h3>
            <div class="code-block">
              <code>
                <span class="code-keyword">@import</span> <span class="code-string">'tailwindcss'</span>;<br />
                <span class="code-keyword">@import</span> <span class="code-string">'vlite3/style.css'</span>;
              </code>
            </div>
          </div>
          <div class="code-step">
            <div class="code-step-number">3</div>
            <h3 class="code-step-title">Use Components</h3>
            <div class="code-block">
              <code>
                <span class="code-keyword">import</span> { <span class="code-var">Button</span> } <span
                  class="code-keyword">from</span> <span class="code-string">'vlite3'</span><br /><br />
                <span class="code-muted">&lt;</span><span class="code-var">Button</span><span
                  class="code-muted">&gt;</span>Click Me<span class="code-muted">&lt;/</span><span
                  class="code-var">Button</span><span class="code-muted">&gt;</span>
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="landing-container footer-inner">
        <div class="footer-left">
          <div class="logo-link">
            <div class="logo-mark">V</div>
            <span class="logo-text">vlite3</span>
          </div>
          <p class="footer-desc">
            A lightweight, minimalistic Vue 3 UI component library built with Tailwind CSS v4.
          </p>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <h4 class="footer-col-title">Resources</h4>
            <router-link to="/components/button" class="footer-link">Documentation</router-link>
            <router-link to="/components/button" class="footer-link">Components</router-link>
            <a href="https://github.com/safdar-azeem/vlite3" target="_blank" class="footer-link">GitHub</a>
          </div>
          <div class="footer-col">
            <h4 class="footer-col-title">Community</h4>
            <a href="https://github.com/safdar-azeem/vlite3/issues" target="_blank"
              class="footer-link">Issues</a>
            <a href="https://github.com/safdar-azeem/vlite3/discussions" target="_blank"
              class="footer-link">Discussions</a>
            <a href="https://www.npmjs.com/package/vlite3" target="_blank" class="footer-link">NPM Package</a>
          </div>
        </div>
      </div>
      <div class="landing-container footer-bottom">
        <p class="footer-copy">
          Built with
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
            class="inline-block text-danger mx-1 -mt-0.5">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          by <a href="https://github.com/safdar-azeem" target="_blank" class="footer-author">Safdar Azeem</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ====================================
   Landing Page — Premium UI Library
   ==================================== */

/* Root */
.landing-root {
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* Subtle grid background */
.grid-bg {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(to right, var(--color-border) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-border) 1px, transparent 1px);
  background-size: 80px 80px;
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
  mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 30%, transparent 80%);
}

/* Container */
.landing-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ====== Header ====== */
.landing-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: color-mix(in srgb, var(--color-background) 80%, transparent);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  color: inherit;
}

.logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: -0.02em;
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.03em;
}

.version-badge {
  font-size: 0.7rem !important;
  padding: 0.15rem 0.5rem !important;
  opacity: 0.7;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border-radius: 8px;
  color: var(--color-muted-foreground);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s, background 0.2s;
}

.nav-link:hover {
  color: var(--color-foreground);
  background: var(--color-muted);
}

.nav-link-text {
  display: none;
}

@media (min-width: 640px) {
  .nav-link-text {
    display: inline;
  }
}

/* ====== Hero ====== */
.hero-section {
  position: relative;
  padding: 6rem 0 4rem;
  text-align: center;
}

.hero-glow {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-primary) 0%, transparent 70%);
  opacity: 0.04;
  pointer-events: none;
  filter: blur(80px);
}

.hero-inner {
  position: relative;
  z-index: 1;
}

.hero-badge-wrapper {
  margin-bottom: 2rem;
}

.hero-announcement {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 1rem 0.375rem 0.625rem;
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-muted-foreground);
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s ease;
}

.hero-announcement:hover {
  background: var(--color-accent);
  color: var(--color-foreground);
  border-color: color-mix(in srgb, var(--color-border) 100%, transparent);
}

.hero-announcement-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.25rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: var(--color-foreground);
}

.hero-title-accent {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-muted-foreground) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--color-muted-foreground);
  max-width: 640px;
  margin: 0 auto 2.5rem;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Install button */
.install-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1.25rem;
  height: 48px;
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-foreground);
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Mono', monospace;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.install-btn:hover {
  background: var(--color-accent);
  border-color: color-mix(in srgb, var(--color-border) 100%, transparent);
}

.install-prefix {
  color: var(--color-muted-foreground);
  opacity: 0.5;
}

.install-command {
  color: var(--color-foreground);
}

.install-copy {
  color: var(--color-muted-foreground);
  display: flex;
  align-items: center;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.install-btn:hover .install-copy {
  opacity: 1;
}

/* Stats */
.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 4rem;
  padding-top: 2.5rem;
  border-top: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-foreground);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
  opacity: 0.5;
}

/* ====== Sections Common ====== */
.features-section,
.categories-section,
.code-section {
  padding: 5rem 0;
  position: relative;
  z-index: 1;
}

.categories-section {
  background: var(--color-muted);
  border-top: 1px solid color-mix(in srgb, var(--color-border) 40%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 40%, transparent);
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.0625rem;
  color: var(--color-muted-foreground);
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;
}

/* ====== Features Grid ====== */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  padding: 1.75rem;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  transition: all 0.3s ease;
  cursor: default;
}

.feature-card:hover {
  border-color: color-mix(in srgb, var(--color-primary) 30%, var(--color-border));
  transform: translateY(-2px);
  box-shadow: 0 8px 32px -8px color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1rem;
  font-weight: 650;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
}

.feature-desc {
  font-size: 0.875rem;
  color: var(--color-muted-foreground);
  line-height: 1.65;
}

/* ====== Categories Grid ====== */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

@media (max-width: 900px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}

.category-card {
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: color-mix(in srgb, var(--color-primary) 25%, var(--color-border));
  transform: translateY(-2px);
  box-shadow: 0 8px 32px -8px color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-title {
  font-size: 0.9375rem;
  font-weight: 650;
  letter-spacing: -0.01em;
}

.category-count {
  font-size: 0.75rem;
  color: var(--color-muted-foreground);
}

.category-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  background: var(--color-muted);
  color: var(--color-muted-foreground);
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s;
}

.category-tag-more {
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-muted));
  font-weight: 600;
}

.categories-cta {
  text-align: center;
  margin-top: 3rem;
}

/* ====== Code Section ====== */
.code-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 800px) {
  .code-grid {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
  }
}

.code-step {
  text-align: left;
}

.code-step-number {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.code-step-title {
  font-size: 1rem;
  font-weight: 650;
  margin-bottom: 0.75rem;
}

.code-block {
  padding: 1.25rem;
  border-radius: 12px;
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Mono', monospace;
  font-size: 0.8125rem;
  line-height: 1.75;
  overflow-x: auto;
}

.code-keyword {
  color: var(--color-primary);
}

.code-string {
  color: var(--color-success);
}

.code-var {
  color: var(--color-info, #3b82f6);
}

.code-muted {
  color: var(--color-muted-foreground);
  opacity: 0.6;
}

/* ====== Footer ====== */
.landing-footer {
  border-top: 1px solid var(--color-border);
  padding: 4rem 0 0;
  position: relative;
  z-index: 1;
  background: var(--color-background);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  padding-bottom: 3rem;
}

@media (max-width: 640px) {
  .footer-inner {
    flex-direction: column;
    gap: 2rem;
  }
}

.footer-left {
  max-width: 320px;
}

.footer-desc {
  font-size: 0.875rem;
  color: var(--color-muted-foreground);
  line-height: 1.65;
  margin-top: 1rem;
}

.footer-links {
  display: flex;
  gap: 4rem;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.footer-col-title {
  font-size: 0.8125rem;
  font-weight: 650;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-foreground);
  margin-bottom: 0.25rem;
}

.footer-link {
  font-size: 0.875rem;
  color: var(--color-muted-foreground);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--color-foreground);
}

.footer-bottom {
  border-top: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
  padding: 1.5rem 0;
}

.footer-copy {
  font-size: 0.8125rem;
  color: var(--color-muted-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-author {
  color: var(--color-foreground);
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
}

.footer-author:hover {
  text-decoration: underline;
}

/* ====== Animations ====== */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  opacity: 0;
  animation: fade-up 0.7s ease-out forwards;
}

.delay-1 { animation-delay: 100ms; }
.delay-2 { animation-delay: 200ms; }
.delay-3 { animation-delay: 300ms; }
.delay-4 { animation-delay: 450ms; }

/* ====== Responsive ====== */
@media (max-width: 640px) {
  .hero-section {
    padding: 4rem 0 3rem;
  }

  .hero-stats {
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .stat-divider:nth-child(4) {
    display: none;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .features-section,
  .categories-section,
  .code-section {
    padding: 3.5rem 0;
  }

  .footer-links {
    gap: 2rem;
  }
}
</style>
