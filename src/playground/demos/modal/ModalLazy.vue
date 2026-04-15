<script setup lang="ts">
import { defineComponent, h, onMounted } from 'vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './ModalLazy.vue?raw'

// -------------------------------------------------------------------
// LazyUserDetail: defined inline to demonstrate :body prop behaviour.
// This component's setup() and onMounted() run ONLY when the modal
// opens — never on initial page load.
// -------------------------------------------------------------------
const LazyUserDetail = defineComponent({
  props: {
    close: { type: Function },
    user: {
      type: Object as () => { name: string; email: string; role: string; avatar: string },
      default: () => ({ name: 'Unknown', email: '', role: 'Viewer', avatar: 'UN' }),
    },
  },
  setup(props) {
    onMounted(() => {
      console.log('[LazyUserDetail] Mounted for:', props.user.name)
    })
    return () =>
      h('div', { class: 'space-y-4 py-1' }, [
        // Avatar + name
        h('div', { class: 'flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/40' }, [
          h('div', {
            class: 'h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-lg shrink-0'
          }, props.user.avatar),
          h('div', {}, [
            h('p', { class: 'font-semibold text-foreground' }, props.user.name),
            h('p', { class: 'text-sm text-muted-foreground' }, props.user.email),
          ]),
        ]),

        // Role badge
        h('div', { class: 'flex items-center gap-2' }, [
          h('span', { class: 'text-sm text-muted-foreground' }, 'Role:'),
          h('span', { class: 'text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary' }, props.user.role),
        ]),

        // Lazy note
        h('p', {
          class: 'text-xs text-muted-foreground border-t border-border/40 pt-3'
        }, '💡 This component only mounts when the modal opens. Check the browser console.'),

        // Close button
        h('div', { class: 'flex justify-end pt-1' }, [
          h(Button, { variant: 'outline', size: 'sm', onClick: props.close }, () => 'Close'),
        ]),
      ])
  },
})

const teamMembers = [
  { id: 1, name: 'Alex Rivera',   email: 'alex@example.com',   role: 'Admin',  avatar: 'AR' },
  { id: 2, name: 'Jamie Chen',    email: 'jamie@example.com',  role: 'Editor', avatar: 'JC' },
  { id: 3, name: 'Morgan Lee',    email: 'morgan@example.com', role: 'Viewer', avatar: 'ML' },
]
</script>

<template>
  <DemoSection title="Lazy Body Component" :code="sourceCode">
    <div class="flex flex-col items-center gap-5 w-full">
      <p class="text-sm text-muted-foreground text-center max-w-sm">
        Pass a component via
        <code class="text-xs bg-muted/60 px-1 py-0.5 rounded font-mono">:body</code> — it is only
        instantiated when the modal opens. Perfect for rows in a large list.
      </p>

      <!-- Single usage -->
      <Modal
        title="User Details"
        :body="LazyUserDetail"
        :body-props="{ user: teamMembers[0] }">
        <Button icon="lucide:eye">View Details</Button>
      </Modal>

      <!-- Iterated usage — real-world table row pattern -->
      <div class="w-full max-w-sm divide-y divide-border/40 rounded-lg border border-border/40 overflow-hidden">
        <div
          v-for="member in teamMembers"
          :key="member.id"
          class="flex items-center justify-between px-4 py-2.5 bg-background hover:bg-muted/20 transition-colors">
          <div class="flex items-center gap-3 min-w-0">
            <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              {{ member.avatar }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-foreground truncate">{{ member.name }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ member.role }}</p>
            </div>
          </div>
          <Modal
            :title="`${member.name}`"
            :body="LazyUserDetail"
            :body-props="{ user: member }">
            <Button variant="ghost" size="sm" icon="lucide:external-link" />
          </Modal>
        </div>
      </div>
    </div>
  </DemoSection>
</template>
