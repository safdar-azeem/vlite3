<script setup lang="ts">
import DemoSection from '../DemoSection.vue'
import { AttachmentsList } from '@/components/AttachmentsList'
import { FilePreview } from '@/components/FilePreview'

const mockAttachments = [
  {
    fileName: '626182816_18093985156987193_1998335512335153763_n.jpg',
    fileSize: 1048576, // 1MB
    fileUrl:
      'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    fileName: 'company-logo.png',
    fileSize: 250000,
    fileUrl:
      'https://fastly.picsum.photos/id/197/400/400.jpg?hmac=EMGJfztOncchyhxYLBig-GifHwLYkvPrZJvM_oDgYfQ',
  },
  {
    fileName: 'meeting-notes.txt',
    fileSize: 3450,
    fileUrl: '#',
  },
]
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-10">
    <div>
      <h2 class="text-2xl font-bold mb-2">Attachments & File Preview</h2>
      <p class="text-gray-500">
        Components for rendering lists of file attachments with secure programmatic downloading,
        inline modal file previewing, and multiple dynamic layouts.
      </p>
    </div>

    <DemoSection
      title="Card Variant (Detailed Previews)"
      code="<AttachmentsList :attachments='mockAttachments' variant='card' />">
      <div class="w-full">
        <AttachmentsList :attachments="mockAttachments" variant="card" />
      </div>
    </DemoSection>

    <DemoSection
      title="List Variant (Standard)"
      code="<AttachmentsList :attachments='mockAttachments' variant='list' size='md' />">
      <div class="max-w-md">
        <AttachmentsList :attachments="mockAttachments" variant="list" size="md" />
      </div>
    </DemoSection>

    <DemoSection
      title="Size Variations (List/Inline)"
      code="<AttachmentsList :attachments='mockAttachments' variant='list' size='sm' />
<AttachmentsList :attachments='mockAttachments' variant='list' size='lg' />">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-sm font-semibold mb-3 text-muted-foreground">Small (sm)</h3>
          <AttachmentsList :attachments="mockAttachments" variant="list" size="sm" />
        </div>
        <div>
          <h3 class="text-sm font-semibold mb-3 text-muted-foreground">Large (lg)</h3>
          <AttachmentsList :attachments="mockAttachments" variant="list" size="lg" />
        </div>
      </div>
    </DemoSection>

    <DemoSection
      title="Without Download / View Actions"
      code="<AttachmentsList :attachments='mockAttachments' :can-download='false' :can-view='false' />">
      <div class="max-w-md">
        <AttachmentsList :attachments="mockAttachments" :can-download="false" :can-view="false" />
      </div>
    </DemoSection>

    <DemoSection
      title="Click-to-Preview (No Eye Icon, Download in Modal Only)"
      code="<AttachmentsList :attachments='mockAttachments' variant='list' :click-to-preview='true' :show-download-in-list='false' />">
      <div class="max-w-md">
        <AttachmentsList
          :attachments="mockAttachments"
          variant="list"
          size="md"
          :click-to-preview="true"
          :show-download-in-list="false" />
      </div>
    </DemoSection>

    <DemoSection
      title="Click-to-Preview with Download Button Still in List"
      code="<AttachmentsList :attachments='mockAttachments' variant='list' :click-to-preview='true' :show-download-in-list='true' />">
      <div class="max-w-md">
        <AttachmentsList
          :attachments="mockAttachments"
          variant="list"
          size="md"
          :click-to-preview="true"
          :show-download-in-list="true" />
      </div>
    </DemoSection>

    <DemoSection
      title="Standalone File Preview"
      code="<FilePreview url='https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf' name='Standalone Document.pdf' />">
      <FilePreview
        url="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
        name="Standalone Document.pdf" />
    </DemoSection>
  </div>
</template>
