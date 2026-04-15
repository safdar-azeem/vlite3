<script setup lang="ts">
// Code section logic
</script>

<template>
  <section class="code-section">
    <div class="landing-container">
      <div class="section-header animate-fade-up">
        <span class="section-eyebrow">Quick Start</span>
        <h2 class="section-title">
          Up and running in <span class="text-primary">minutes</span>
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
              <span class="code-keyword">import</span> { <span class="code-var">Button</span> } <span class="code-keyword">from</span> <span class="code-string">'vlite3'</span><br /><br />
              <span class="code-muted">&lt;</span><span class="code-var">Button</span><span class="code-muted">&gt;</span>Click Me<span class="code-muted">&lt;/</span><span class="code-var">Button</span><span class="code-muted">&gt;</span>
            </code>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import './shared.css';

/* ── Code Section ── */
.code-section {
  padding: 6rem 0;
}

.code-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .code-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.code-step {
  position: relative;
}

.code-step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.code-step-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-foreground);
}

.code-block {
  background: #0d1117;
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 1px solid color-mix(in srgb, var(--color-border) 20%, transparent);
  overflow-x: auto;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.code-block code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #c9d1d9;
}

.code-muted { color: #8b949e; }
.code-keyword { color: #ff7b72; }
.code-string { color: #a5d6ff; }
.code-var { color: #d2a8ff; }
</style>
