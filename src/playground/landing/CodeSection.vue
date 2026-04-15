<script setup lang="ts">
// Code section logic
</script>

<template>
  <section class="border-y border-border bg-background" id="code">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row">
      <div class="lg:border-r border-border pr-8 py-16 w-full lg:w-1/3 px-6 lg:px-8 lg:pr-12">
        <span class="text-sm font-semibold text-primary uppercase tracking-wider">Integration</span>
        <h2 class="text-4xl md:text-5xl font-bold uppercase mt-3 mb-6 text-foreground tracking-tight">Install</h2>
        <p class="text-base leading-relaxed text-muted-foreground mb-8">
          A seamless integration process. Zero configuration required for the core primitives. Tailwind v4 native.
        </p>
      </div>

      <div class="py-16 px-6 lg:px-12 w-full lg:w-2/3 bg-muted/10">
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center justify-between bg-muted/30">
            <span class="text-xs font-semibold text-foreground uppercase tracking-widest">Terminal</span>
            <span class="text-[10px] text-muted-foreground uppercase">sh</span>
          </div>
          <pre class="p-6 overflow-x-auto text-sm font-mono text-foreground leading-relaxed"><code class="flex items-center gap-3"><span class="text-muted-foreground select-none">$</span> npm install vlite3</code></pre>
        </div>

        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden mt-8">
          <div class="border-b border-border px-4 py-3 flex items-center justify-between bg-muted/30">
            <span class="text-xs font-semibold text-foreground uppercase tracking-widest">main.ts</span>
            <span class="text-[10px] text-muted-foreground uppercase">typescript</span>
          </div>
          <pre class="p-6 overflow-x-auto text-sm font-mono text-foreground leading-relaxed"><code><span class="text-primary">import</span> { createApp } <span class="text-primary">from</span> 'vue'
<span class="text-primary">import</span> App <span class="text-primary">from</span> './App.vue'

<span class="text-muted-foreground">// Import tailwind & vlite styles</span>
<span class="text-primary">import</span> 'tailwindcss'
<span class="text-primary">import</span> 'vlite3/style.css'

createApp(App).mount('#app')</code></pre>
        </div>
      </div>
    </div>
  </section>
</template>
