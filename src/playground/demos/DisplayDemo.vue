<script setup lang="ts">
import { ref } from 'vue'
import Avatar from '@/components/Avatar.vue'
import Alert from '@/components/Alert.vue'
import Accordion from '@/components/Accordion/Accordion.vue'
import AccordionItem from '@/components/Accordion/AccordionItem.vue'
import AccordionTrigger from '@/components/Accordion/AccordionTrigger.vue'
import AccordionContent from '@/components/Accordion/AccordionContent.vue'
import Timeline from '@/components/Timeline.vue'
import { TimelineStep } from '@/types'
import Button from '@/components/Button.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './DisplayDemo.vue?raw'

const activeStep = ref(1)
const timelineSteps = ref<TimelineStep[]>([
  { id: 1, title: 'Drafting', icon: 'lucide:pen-tool' },
  { id: 2, title: 'Review', icon: 'lucide:eye' },
  { id: 3, title: 'Approved', icon: 'lucide:check-circle' },
  { id: 4, title: 'Published', icon: 'lucide:send' },
])
</script>

<template>
  <DemoSection title="Data Display" :code="sourceCode">
    <div class="space-y-2">
      <h2 class="text-xl font-semibold tracking-tight">Data Display</h2>
      <p class="text-sm text-gray-500">
        Components for displaying diverse types of data and states.
      </p>
    </div>

    <div class="grid gap-x-8 gap-y-12 xl:grid-cols-2">
       
       <!-- Avatars -->
       <div class="space-y-6">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Avatars</h3>
          <div class="flex items-end gap-3 flex-wrap">
             <Avatar size="xs" src="https://i.pravatar.cc/150?u=1" />
             <Avatar size="sm" src="https://i.pravatar.cc/150?u=2" />
             <Avatar size="md" src="https://i.pravatar.cc/150?u=3" />
             <Avatar size="lg" src="https://i.pravatar.cc/150?u=4" />
             <Avatar size="xl" src="https://i.pravatar.cc/150?u=5" />
             <Avatar size="2xl" src="https://i.pravatar.cc/150?u=6" />
          </div>
          <div class="flex gap-4">
             <Avatar rounded="none" fallback="Sq" />
             <Avatar rounded="md" fallback="Md" />
             <Avatar rounded="full" fallback="Fu" />
          </div>
       </div>

       <!-- Alerts -->
       <div class="space-y-6">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Alerts</h3>
          <div class="space-y-3">
             <Alert title="Information" description="New features are available." icon="lucide:info" variant="primary" />
             <Alert title="Success" description="Changes saved successfully." icon="lucide:check" variant="success" />
             <Alert title="Warning" description="Your account is pending verification." icon="lucide:alert-triangle" variant="warning" />
             <Alert title="Error" description="Unable to connect to server." icon="lucide:alert-octagon" variant="danger" />
          </div>
       </div>
    </div>

    <!-- Accordion -->
    <!-- Accordion Demo (Disabled due to API mismatch in old demo) -->
    <!-- 
    <div class="space-y-6">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Accordion</h3>
        <Accordion type="single" collapsible class="w-full border rounded-lg divide-y">
            <AccordionItem value="item-1" class="px-4 border-none">
              <AccordionTrigger>What is Builto?</AccordionTrigger>
              <AccordionContent>Builto is a modern Vue 3 component library designed for speed and flexibility.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" class="px-4 border-none">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>Yes, it follows WAI-ARIA patterns for maximum accessibility.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" class="px-4 border-none">
              <AccordionTrigger>Can I customize it?</AccordionTrigger>
              <AccordionContent>Absolutely! It's built with Tailwind CSS, making customization trivial.</AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
    -->

    <!-- Timeline -->
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Timeline</h3>
            <div class="flex gap-2">
                <Button size="sm" variant="outline" :disabled="activeStep === 0" @click="activeStep--">Prev</Button>
                <Button size="sm" variant="outline" :disabled="activeStep === timelineSteps.length" @click="activeStep++">Next</Button>
            </div>
        </div>
        
        <div class="p-6 border border-border rounded-lg bg-gray-50/30">
           <Timeline :steps="timelineSteps" :active-step="activeStep" />
        </div>
    </div>

  </DemoSection>
</template>
