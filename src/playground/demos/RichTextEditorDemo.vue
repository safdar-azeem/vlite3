<script setup lang="ts">
import { ref } from 'vue'
import { RichTextEditor } from '@/components/RichTextEditor'
import DemoSection from '../DemoSection.vue'
import sourceCode from './RichTextEditorDemo.vue?raw'

const value1 = ref('<p>Hello <strong>World</strong>! Start editing here.</p>')
const value2 = ref('')
const value3 = ref('<p>This content is <em>read-only</em> and <strong>cannot</strong> be edited.</p>')
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Rich Text Editor</h2>
      <p class="text-muted-foreground">
        A minimal WYSIWYG block editor built with the native browser
        <code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">contenteditable</code> API.
        Zero heavy dependencies — supports bold, italic, underline, headings, lists, blockquotes,
        links, alignment and more.
      </p>
    </div>

    <DemoSection title="Basic Usage" :code="sourceCode">
      <div class="w-full max-w-2xl">
        <RichTextEditor v-model="value1" placeholder="Start typing…" />
        <p class="mt-3 text-xs text-muted-foreground font-mono truncate">
          HTML: {{ value1 || '(empty)' }}
        </p>
      </div>
    </DemoSection>

    <DemoSection title="With Label & Error" :code="sourceCode">
      <div class="w-full max-w-2xl space-y-6">
        <RichTextEditor
          v-model="value2"
          label="Description"
          placeholder="Write a description…"
          error="This field is required" />
        <RichTextEditor
          v-model="value1"
          label="Notes"
          placeholder="Add your notes here…" />
      </div>
    </DemoSection>

    <DemoSection title="Disabled State" :code="sourceCode">
      <div class="w-full max-w-2xl">
        <RichTextEditor
          v-model="value3"
          label="Read-only Content"
          :disabled="true"
          placeholder="Disabled editor" />
      </div>
    </DemoSection>

    <DemoSection title="Custom Min-Height" :code="sourceCode">
      <div class="w-full max-w-2xl">
        <RichTextEditor
          v-model="value1"
          label="Compact Editor"
          min-height="80px"
          placeholder="Compact editor with custom height" />
      </div>
    </DemoSection>
  </div>
</template>
