<script setup lang="ts">
import { defineComponent, h, onMounted } from 'vue'
import SidePanel from '@/components/SidePanel.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './SidePanelLazy.vue?raw'

// A simple component defined inline to demonstrate the :body prop
const LazySidePanelContent = defineComponent({
  props: {
    close: { type: Function },
    itemName: { type: String, default: 'Test Item' },
  },
  setup(props) {
    onMounted(() => {
      console.log('[LazySidePanelContent] Mounted! This only runs when the panel opens.')
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
          'The component is only created when the panel opens — great for lists!'
        ),
        h('div', { class: 'flex justify-end pt-4' }, [
          h(Button, { variant: 'outline', onClick: props.close }, () => 'Close Panel'),
        ]),
      ])
  },
})

const sampleItems = [
  { id: 1, name: 'User A' },
  { id: 2, name: 'User B' },
  { id: 3, name: 'User C' },
]
</script>

<template>
  <DemoSection title="Lazy Body Component" :code="sourceCode">
    <p class="text-sm text-gray-500">
      Pass a component via <code>:body</code> — it's only instantiated when the panel opens.
    </p>

    <!-- Single usage -->
    <SidePanel
      title="Lazy Panel"
      :body="LazySidePanelContent"
      :body-props="{ itemName: 'Single Item' }">
      <Button>Open Lazy Panel</Button>
    </SidePanel>

    <!-- Iterated usage -->
    <div class="flex gap-2">
      <SidePanel
        v-for="item in sampleItems"
        :key="item.id"
        :title="`Details: ${item.name}`"
        :body="LazySidePanelContent"
        :body-props="{ itemName: item.name }">
        <Button variant="outline" size="sm">{{ item.name }}</Button>
      </SidePanel>
    </div>
  </DemoSection>
</template>
