<script setup lang="ts">
interface Props {
  content?: string
}

withDefaults(defineProps<Props>(), {
  content: '',
})
</script>

<template>
  <div class="rte-reader">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="rte-content" v-html="content"></div>
  </div>
</template>

<style scoped>
.rte-reader {
  font-family: inherit;
  color: var(--color-foreground);
  font-size: 0.9rem;
  line-height: 1.7;
  word-break: break-word;
  overflow-wrap: break-word;
  padding: 0;
  margin: 0;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Rich-content typography
   (all !important because Tailwind preflight resets these globally)
───────────────────────────────────────────────────────────────────────────── */
.rte-reader :deep(h1) {
  display: block;
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  margin: 0.5em 0 0.2em !important;
  line-height: 1.3;
}
.rte-reader :deep(h2) {
  display: block;
  font-size: 1.2rem !important;
  font-weight: 600 !important;
  margin: 0.45em 0 0.2em !important;
  line-height: 1.35;
}
.rte-reader :deep(p) {
  display: block;
  margin: 0.2em 0 !important;
}
.rte-reader :deep(div) {
  margin: 0.1em 0;
}

.rte-reader :deep(blockquote) {
  display: block;
  border-left: 3px solid var(--color-primary);
  margin: 0.6em 0 !important;
  padding: 0.35em 1em !important;
  color: var(--color-muted-foreground);
  font-style: italic;
  background: color-mix(in oklab, var(--color-primary) 6%, transparent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

/* ── Lists ── */
.rte-reader :deep(ul) {
  display: block !important;
  list-style-type: disc !important;
  list-style-position: outside !important;
  padding-left: 1.6em !important;
  margin: 0.35em 0 !important;
}
.rte-reader :deep(ol) {
  display: block !important;
  list-style-type: decimal !important;
  list-style-position: outside !important;
  padding-left: 1.6em !important;
  margin: 0.35em 0 !important;
}
.rte-reader :deep(li) {
  display: list-item !important;
  margin: 0.15em 0 !important;
  padding-left: 0.15em;
}
.rte-reader :deep(ul ul),
.rte-reader :deep(ol ul)       { list-style-type: circle  !important; }
.rte-reader :deep(ul ul ul),
.rte-reader :deep(ol ol ul)    { list-style-type: square  !important; }
.rte-reader :deep(ol ol)       { list-style-type: lower-alpha !important; }
.rte-reader :deep(ol ol ol)    { list-style-type: lower-roman !important; }

/* ── Horizontal Rule ── */
.rte-reader :deep(hr) {
  display: block !important;
  border: 0 !important;
  border-top: 1px solid var(--color-border) !important;
  margin: 1.5em 0 !important;
}

/* ── Links ── */
.rte-reader :deep(a) {
  color: var(--color-info);
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
  transition: color 0.12s ease;
}
.rte-reader :deep(a:hover) {
  color: var(--color-info-dark, var(--color-info));
  text-decoration-thickness: 2px;
}

/* ── Code ── */
.rte-reader :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.85em;
  background: var(--color-muted);
  color: var(--color-foreground);
  padding: 0.2em 0.4em;
  border-radius: var(--radius-sm);
  border: none;
}

/* ── Images ── */
.rte-reader :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
  margin: 1em 0;
  display: block;
  box-shadow: 0 0 0 1px var(--color-border);
}

/* ── Inline formatting ── */
.rte-reader :deep(strong) { font-weight: 700 !important; }
.rte-reader :deep(b)      { font-weight: 700 !important; }
.rte-reader :deep(em)     { font-style: italic !important; }
.rte-reader :deep(i)      { font-style: italic !important; }
.rte-reader :deep(u) {
  text-decoration: underline !important;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 2px;
}
.rte-reader :deep(s),
.rte-reader :deep(strike) { text-decoration: line-through !important; }

/* ── Selection highlight ── */
.rte-reader ::selection {
  background: color-mix(in oklab, var(--color-primary) 22%, transparent);
}
</style>
