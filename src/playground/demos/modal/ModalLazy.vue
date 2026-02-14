<script setup lang="ts">
import { ref, defineComponent, h, onMounted } from 'vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ModalLazy.vue?raw'

// A simple component defined inline to demonstrate the :body prop
const LazyModalContent = defineComponent({
  props: {
    close: { type: Function },
    itemName: { type: String, default: 'Test Item' },
  },
  setup(props) {
    onMounted(() => {
      console.log('[LazyModalContent] Mounted! This only runs when the modal opens.')
    })
    return () =>
      h('div', { class: 'space-y-4' }, [
        h(
          'p',
          { class: 'text-gray-600' },
          `This content is lazily rendered for: ${props.itemName}`
        ),
        h(
          'p',
          { class: 'text-sm text-muted-foreground' },
          'Open the browser console — the "Mounted" log only appears when this modal opens, not when the page loads.'
        ),
        h('div', { class: 'flex justify-end pt-4' }, [
          h(Button, { variant: 'outline', onClick: props.close }, () => 'Close'),
        ]),
      ])
  },
})

// Sample list to demonstrate performance benefit in iterated context
const sampleItems = [
  { id: 1, name: 'Document A' },
  { id: 2, name: 'Document B' },
  { id: 3, name: 'Document C' },
]
</script>

<template>
  <DemoSection title="Lazy Body Component" :code="sourceCode">
    <p class="text-sm text-gray-500">
      Pass a component via <code>:body</code> — it's only instantiated when the modal opens. Ideal
      for lists where each row has a modal.
    </p>

    <Modal title="Lazy Modal" :body="LazyModalContent" :body-props="{ itemName: 'Single Item' }">
      <Button>Open Lazy Modal</Button>
    </Modal>

    <div class="flex gap-2">
      <Modal
        v-for="item in sampleItems"
        :key="item.id"
        :title="`Details: ${item.name}`"
        :body="LazyModalContent"
        :itemName="item.name">
        <Button variant="outline" size="sm">{{ item.name }}</Button>
      </Modal>
    </div>
  </DemoSection>
</template>
