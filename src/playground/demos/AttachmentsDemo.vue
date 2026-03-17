<script setup lang="ts">
import DemoSection from '../DemoSection.vue'
import { AttachmentsList } from '@/components/AttachmentsList'
import { FilePreview } from '@/components/FilePreview'

const mockAttachments = [
  {
    fileName: 'invoice-2023.pdf',
    fileSize: 1048576, // 1MB
    fileUrl:
      'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    fileName: 'company-logo.png',
    fileSize: 250000,
    fileUrl: 'https://picsum.photos/400/400',
  },
]
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-10">
    <div>
      <h2 class="text-2xl font-bold mb-2">Attachments & File Preview</h2>
      <p class="text-gray-500">
        Components for rendering lists of file attachments with secure programmatic downloading and
        inline modal file previewing.
      </p>
    </div>

    <DemoSection
      title="Attachments List Component"
      code="const mockAttachments = [
  {
    fileName: 'invoice-2023.pdf',
    fileSize: 1048576, // 1MB
    fileUrl:
      'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    fileName: 'company-logo.png',
    fileSize: 250000,
    fileUrl: 'https://picsum.photos/400/400',
  },
]
<AttachmentsList :attachments='mockAttachments' />">
      <div class="max-w-md">
        <AttachmentsList :attachments="mockAttachments" />
      </div>
    </DemoSection>

    <DemoSection
      title="Standalone File Preview"
      code="<FilePreview url='https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' name='Standalone Document.pdf' />">
      <FilePreview
        url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        name="Standalone Document.pdf" />
    </DemoSection>
  </div>
</template>
