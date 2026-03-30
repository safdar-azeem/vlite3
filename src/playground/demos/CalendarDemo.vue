<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import Calendar from '@/components/Calendar/Calendar.vue'
import Modal from '@/components/Modal.vue'
import { Form, type IForm } from '@/components/Form'
import Button from '@/components/Button.vue'
import { formatDate } from '@/utils'

const events = ref([
  {
    id: '1',
    title: 'Team Sync Meeting',
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(11, 30, 0, 0)).toISOString(),
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
  },
  {
    id: '2',
    title: 'Client Review',
    start: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
    backgroundColor: '#10b981',
    textColor: '#ffffff',
  },
])

const isViewModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedEvent = ref<any>(null)
const formData = ref<any>({})

const eventSchema: IForm[] = [
  {
    name: 'title',
    label: 'Event Title',
    type: 'text',
    required: true,
  },
  {
    name: 'start',
    label: 'Start Time',
    type: 'date',
    required: true,
    props: {
      mode: 'dateTime',
    },
  },
  {
    name: 'end',
    label: 'End Time',
    type: 'date',
    props: {
      mode: 'dateTime',
    },
  },
  { name: 'backgroundColor', label: 'Theme Color', type: 'color' },
]

const handleEventClick = (event: any) => {
  selectedEvent.value = event
  isViewModalOpen.value = true
}

const handleEventCreate = (payload: any) => {
  formData.value = {
    start: payload.start,
    end: payload.end || payload.start,
    backgroundColor: '#3b82f6',
  }
  isEditModalOpen.value = true
}

const handleEventEdit = (event: any) => {
  formData.value = { ...event }
  isEditModalOpen.value = true
}

const handleEventUpdate = (payload: any) => {
  const index = events.value.findIndex((e) => e.id === payload.eventId)
  if (index !== -1) {
    events.value[index] = {
      ...events.value[index],
      start: payload.start,
      end: payload.end || payload.start,
    }
  }
}

const handleEventDelete = (event: any) => {
  if (confirm('Are you sure you want to delete this event?')) {
    events.value = events.value.filter((e) => e.id !== event.id)
    isViewModalOpen.value = false
  }
}

/**
 * Handle form submit
 * Made async to simulate an API call which automatically sets the form loading state.
 * By mutating `isEditModalOpen` directly after the promise resolves, we safely
 * close the modal without colliding with the `isChildSubmitting` safety lock in `Modal.vue`.
 */
const onFormSubmit = async (payload: any) => {
  const vals = payload.values

  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 10))

  // Note: Since `id` is not in the schema, we must check `formData.value.id`
  // to differentiate between create and update operations.
  if (formData.value.id) {
    // Update existing
    const index = events.value.findIndex((e) => e.id === formData.value.id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...vals }
    }
  } else {
    // Create new
    events.value.push({
      ...vals,
      id: Date.now().toString(),
      textColor: '#ffffff',
    })
  }

  isEditModalOpen.value = false
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-10">
    <div>
      <h2 class="text-2xl font-bold mb-2">Calendar</h2>
      <p class="text-muted-foreground">
        A powerful, feature-rich Vue 3 calendar component with support for multiple views (Month,
        Week, Day), drag-and-drop functionality, event management, and real-time interactions.
      </p>
    </div>

    <DemoSection
      title="Interactive Calendar"
      code="<template>
  <Calendar
    :events='events'
    :can-add='true'
    :can-edit='true'
    :can-delete='true'
    @eventClick='handleEventClick'
    @eventCreate='handleEventCreate'
    @eventUpdate='handleEventUpdate'
    @eventEdit='handleEventEdit'
    @eventDelete='handleEventDelete'
  />

  <Modal v-model:show='isViewModalOpen' title='Event Details'>
    </Modal>

  <Modal v-model:show='isEditModalOpen' :title='formData.id ? `Edit Event` : `Add Event`'>
    <Form :schema='eventSchema' :values='formData' @onSubmit='onFormSubmit' />
  </Modal>
</template>">
      <div class="w-full h-full relative">
        <Calendar
          :events="events"
          :can-add="true"
          :can-edit="true"
          :can-delete="true"
          @eventClick="handleEventClick"
          @eventCreate="handleEventCreate"
          @eventUpdate="handleEventUpdate"
          @eventEdit="handleEventEdit"
          @eventDelete="handleEventDelete" />
      </div>
    </DemoSection>

    <Modal v-model:show="isViewModalOpen" title="Event Details" max-width="max-w-md">
      <div v-if="selectedEvent" class="space-y-4 pt-2">
        <div>
          <h3 class="text-xl font-bold text-foreground flex items-center gap-2">
            <span
              class="w-4 h-4 rounded-full"
              :style="{ backgroundColor: selectedEvent.backgroundColor || '#3b82f6' }"></span>
            {{ selectedEvent.title }}
          </h3>
        </div>
        <div class="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
          <div>
            <p class="text-xs text-muted-foreground uppercase font-semibold mb-1">Start Time</p>
            <p class="text-sm font-medium">
              {{ formatDate(selectedEvent.start, 'MMM DD, YYYY hh:mm A') }}
            </p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground uppercase font-semibold mb-1">End Time</p>
            <p class="text-sm font-medium">
              {{
                selectedEvent.end ? formatDate(selectedEvent.end, 'MMM DD, YYYY hh:mm A') : 'N/A'
              }}
            </p>
          </div>
        </div>
      </div>
      <template #footer="{ close }">
        <Button variant="outline" @click="close">Close</Button>
        <Button variant="danger" icon="lucide:trash-2" @click="handleEventDelete(selectedEvent)"
          >Delete</Button
        >
        <Button
          variant="primary"
          icon="lucide:edit"
          @click="
            () => {
              isViewModalOpen = false
              handleEventEdit(selectedEvent)
            }
          "
          >Edit Event</Button
        >
      </template>
    </Modal>

    <Modal
      v-model:show="isEditModalOpen"
      :title="formData.id ? 'Edit Event' : 'Add New Event'"
      max-width="max-w-md">
      <div class="pt-2">
        <Form :schema="eventSchema" :values="formData" @onSubmit="onFormSubmit" />
      </div>
    </Modal>
  </div>
</template>
