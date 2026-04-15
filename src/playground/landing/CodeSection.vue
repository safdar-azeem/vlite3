<script setup lang="ts">
// Code section logic
</script>

<template>
  <section class="code-section editorial-border-b border-t" id="code">
    <div class="landing-container flex flex-col lg:flex-row">
      <div class="code-info editorial-border-r pr-8 py-16 w-full lg:w-1/3">
        <span class="section-eyebrow">Integration</span>
        <h2 class="text-5xl md:text-6xl uppercase mb-4 leading-none">Install</h2>
        <p
          class="text-sm leading-relaxed text-[color-mix(in_srgb,var(--editorial-fg)_70%,transparent)] mb-8">
          A seamless integration process. Zero configuration required for the core primitives.
          Tailwind v4 native.
        </p>
      </div>
      <div class="code-blocks py-16 pl-0 lg:pl-16 w-full lg:w-2/3">
        <div class="code-window editorial-border">
          <div class="code-header editorial-border-b flex items-center justify-between">
            <span>Terminal</span>
            <span class="text-[10px] text-[color-mix(in_srgb,var(--editorial-fg)_40%,transparent)]"
              >sh</span
            >
          </div>
          <pre><code><span class="text-[color-mix(in_srgb,var(--editorial-fg)_40%,transparent)]">$</span> npm install vlite3</code></pre>
        </div>
        <div class="code-window editorial-border mt-8">
          <div class="code-header editorial-border-b flex items-center justify-between">
            <span>main.ts</span>
            <span class="text-[10px] text-[color-mix(in_srgb,var(--editorial-fg)_40%,transparent)]"
              >typescript</span
            >
          </div>
          <pre><code><span class="text-[var(--editorial-accent)]">import</span> { createApp } <span class="text-[var(--editorial-accent)]">from</span> 'vue'
<span class="text-[var(--editorial-accent)]">import</span> App <span class="text-[var(--editorial-accent)]">from</span> './App.vue'

<span class="text-[color-mix(in_srgb,var(--editorial-fg)_40%,transparent)]">// Import tailwind & vlite styles</span>
<span class="text-[var(--editorial-accent)]">import</span> 'tailwindcss'
<span class="text-[var(--editorial-accent)]">import</span> 'vlite3/style.css'

createApp(App).mount('#app')</code></pre>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.editorial-border-r {
  border-right: 1px solid var(--editorial-border);
}
@media (max-width: 1024px) {
  .editorial-border-r {
    border-right: none;
    border-bottom: 1px solid var(--editorial-border);
  }
}
.code-window {
  background: var(--editorial-bg);
}
.code-header {
  padding: 0.75rem 1.5rem;
  font-family: var(--font-body);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--editorial-fg);
}
.code-window pre {
  padding: 1.5rem;
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  overflow-x: auto;
  color: var(--editorial-fg);
}
</style>
