<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'

const copied = ref<string | null>(null)

const stylesCode = `@import 'tailwindcss';\n@import 'vlite3/style.css';`
const usageCode = `<script setup>\nimport { Button } from 'vlite3'\n</s` + `cript>\n\n<template>\n  <Button variant="primary">Click Me</Button>\n</t` + `emplate>`

const copyContent = (text: string, id: string) => {
  navigator.clipboard.writeText(text)
  copied.value = id
  setTimeout(() => { copied.value = null }, 2000)
}
</script>

<template>
  <div class="max-w-4xl mx-auto pb-20 pt-8 px-4 sm:px-6">
    <div class="mb-12 animate-fade-up">
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
        Getting Started
      </h1>
      <p class="text-muted-foreground text-lg sm:text-xl max-w-2xl leading-relaxed">
        A comprehensive guide to installing, configuring, and using vlite3 in your Vue projects.
      </p>
    </div>

    <!-- Installation -->
    <section class="mb-14 animate-fade-up delay-1">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
        <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon icon="lucide:package" class="w-5 h-5" />
        </div>
        Installation
      </h2>
      <p class="text-muted-foreground mb-6 leading-relaxed">
        vlite3 is available as an npm package. You can use any modern package manager to install it along with its dependencies.
      </p>

      <div class="bg-card border border-border shadow-sm rounded-xl overflow-hidden relative group">
        <div class="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b border-border/50">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-border"></span>
            <span class="w-3 h-3 rounded-full bg-border"></span>
            <span class="w-3 h-3 rounded-full bg-border"></span>
          </div>
          <span class="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Terminal</span>
        </div>
        <div class="p-5 flex items-start justify-between relative">
          <code class="text-sm sm:text-base font-mono text-foreground font-medium select-all">npm install vlite3</code>
          <button @click="copyContent('npm install vlite3', 'install')" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-all hover:scale-110 p-2 rounded-md hover:bg-muted/80" aria-label="Copy code">
            <Icon :icon="copied === 'install' ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" :class="{ 'text-success': copied === 'install' }" />
          </button>
        </div>
      </div>
    </section>

    <!-- Setup & Configuration -->
    <section class="mb-14 animate-fade-up delay-2">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
        <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon icon="lucide:settings" class="w-5 h-5" />
        </div>
        Setup & Configuration
      </h2>
      <p class="text-muted-foreground mb-6 leading-relaxed">
        Since vlite3 relies on Tailwind CSS v4, you need to import its specific styles and ensure your project is properly configured.
      </p>

      <div class="space-y-8 pl-4 border-l-2 border-primary/20">
        <div class="relative">
          <div class="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background"></div>
          <h3 class="text-lg font-semibold mb-3 text-foreground">1. Import Styles</h3>
          <p class="text-sm text-muted-foreground mb-4 leading-relaxed">Add the vlite3 styles to your main CSS file (e.g., <code>src/style.css</code> or <code>src/assets/main.css</code>):</p>
          <div class="bg-card border border-border shadow-sm rounded-xl p-5 relative group overflow-hidden">
             <button @click="copyContent(stylesCode, 'styles')" class="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-all p-2 rounded-md hover:bg-muted/80 z-10" aria-label="Copy CSS">
              <Icon :icon="copied === 'styles' ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" :class="{ 'text-success': copied === 'styles' }" />
            </button>
            <pre class="text-sm font-mono text-foreground overflow-x-auto m-0"><code class="language-css"><span class="text-muted-foreground">/* Import Tailwind v4 core */</span>
<span class="text-primary/80">@import</span> <span class="text-green-500/90">'tailwindcss'</span>;

<span class="text-muted-foreground">/* Import vlite3 styles */</span>
<span class="text-primary/80">@import</span> <span class="text-green-500/90">'vlite3/style.css'</span>;</code></pre>
          </div>
        </div>

        <div class="relative">
          <div class="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background"></div>
          <h3 class="text-lg font-semibold mb-3 text-foreground">2. Component Usage</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">You can import components directly where you need them. No global plugin installation is required, allowing for better tree-shaking and smaller bundle sizes.</p>
        </div>
      </div>
    </section>

    <!-- Basic Usage -->
    <section class="mb-14 animate-fade-up delay-3">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
        <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon icon="lucide:code" class="w-5 h-5" />
        </div>
        Basic Usage
      </h2>
      <p class="text-muted-foreground mb-6 leading-relaxed">
        Once installed and configured, you can start using vlite3 components in your Vue SFCs (Single File Components).
      </p>
      
      <div class="bg-card border border-border shadow-sm rounded-xl overflow-hidden relative group">
        <div class="flex items-center px-4 py-2.5 bg-muted/50 border-b border-border/50 gap-2">
          <Icon icon="lucide:file-code" class="w-4 h-4 text-muted-foreground" />
          <span class="text-xs font-semibold text-muted-foreground">App.vue</span>
        </div>
        <div class="p-5 relative">
          <button @click="copyContent(usageCode, 'usage')" class="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-all p-2 rounded-md hover:bg-muted/80 z-10" aria-label="Copy Vue code">
            <Icon :icon="copied === 'usage' ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" :class="{ 'text-success': copied === 'usage' }" />
          </button>
          <pre class="text-sm font-mono text-foreground overflow-x-auto m-0"><code><span class="text-primary/70">&lt;script setup&gt;</span>
<span class="text-purple-500">import</span> { Button } <span class="text-purple-500">from</span> <span class="text-green-500/90">'vlite3'</span>
<span class="text-primary/70">&lt;/script&gt;</span>

<span class="text-primary/70">&lt;template&gt;</span>
  &lt;<span class="text-blue-500/90">Button</span> <span class="text-purple-400">variant</span>=<span class="text-green-500/90">"primary"</span>&gt;Click Me&lt;/<span class="text-blue-500/90">Button</span>&gt;
<span class="text-primary/70">&lt;/template&gt;</span></code></pre>
        </div>
      </div>
    </section>
    
    <!-- What's Next? -->
    <section class="animate-fade-up delay-4 bg-muted/30 border border-border/60 rounded-2xl p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between shadow-sm">
      <div class="mb-6 sm:mb-0 sm:mr-8">
        <h2 class="text-2xl font-bold mb-3 flex items-center justify-center sm:justify-start gap-2 text-foreground">
          <Icon icon="lucide:compass" class="text-primary w-6 h-6" />
          What's Next?
        </h2>
        <p class="text-muted-foreground text-sm max-w-lg leading-relaxed">
          Explore the components sidebar to see all available UI elements, check their interactive demos, and copy the code snippets you need.
        </p>
      </div>
      <router-link to="/components/button" class="shrink-0">
        <Button size="lg" class="rounded-full shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform font-semibold w-full sm:w-auto">
          Explore Components
          <Icon icon="lucide:arrow-right" class="w-4 h-4 ml-2" />
        </Button>
      </router-link>
    </section>
  </div>
</template>

<style scoped>
.animate-fade-up {
  opacity: 0;
  animation: fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.delay-1 { animation-delay: 100ms; }
.delay-2 { animation-delay: 200ms; }
.delay-3 { animation-delay: 300ms; }
.delay-4 { animation-delay: 400ms; }

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Syntax highlighting custom touches */
code {
  font-variant-ligatures: none;
}
</style>
