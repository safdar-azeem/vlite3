<script setup lang="ts">
import { ref, computed } from 'vue'
import VEventCalendar from 'v-event-calendar'
import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import { $t } from '@/utils/i18n'
import 'v-event-calendar/style.css'
import CalendarEventItem from './CalendarEventItem.vue'

const props = defineProps<{
	events: any[]
	loading?: boolean
	canAdd?: boolean
	canEdit?: boolean
	canDelete?: boolean
}>()

const emit = defineEmits([
	'eventClick',
	'eventCreate',
	'eventUpdate',
	'eventEdit',
	'eventDelete',
	'dateChange',
	'dayClick',
])

const calendarRef = ref()
const currentView = ref<any>('month')

const setView = (view: string) => {
	currentView.value = view
	calendarRef.value?.setView(view)
}

const goToToday = () => calendarRef.value?.goToToday()
const goToPrev = () => calendarRef.value?.goToPrevious()
const goToNext = () => calendarRef.value?.goToNext()

const t = (key: string, fallback: string, args?: Record<string, any>) => {
	const res = args ? $t(key, args) : $t(key)
	return res !== key ? res : fallback
}

const txtMonth = computed(() => t('vlite.calendar.month', 'Month'))
const txtWeek = computed(() => t('vlite.calendar.week', 'Week'))
const txtDay = computed(() => t('vlite.calendar.day', 'Day'))
const txtToday = computed(() => t('vlite.calendar.today', 'Today'))
</script>

<template>
	<div
		class="h-[calc(100vh-1px)] v-calendar mt-2 bg-body border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
		<VEventCalendar
			ref="calendarRef"
			:events="events"
			:initial-view="currentView"
			:allow-event-creation="canAdd"
			:allow-event-editing="canEdit"
			@event-click="($event: any) => emit('eventClick', $event)"
			@event-create="
				(d: any, s: any, e: any) => emit('eventCreate', { date: d, start: s, end: e })
			"
			@event-update="
				(id: any, s: any, e: any) =>
					emit('eventUpdate', { eventId: id, start: s, end: e })
			"
			@date-change="(val: any) => emit('dateChange', val)"
			@day-click="(val: any) => emit('dayClick', val)"
			class="flex-1 min-h-0">
			<template #header="{ currentTitle }">
				<div
					class="flex items-center justify-between p-4 border-b border-border bg-white dark:bg-background">
					<div class="flex items-center gap-2">
						<ButtonGroup>
							<Button
								:variant="
									currentView === 'month'
										? 'primary'
										: 'outline'
								"
								size="sm"
								@click="setView('month')"
								>{{ txtMonth }}</Button
							>
							<Button
								:variant="
									currentView === 'week'
										? 'primary'
										: 'outline'
								"
								size="sm"
								@click="setView('week')"
								>{{ txtWeek }}</Button
							>
							<Button
								:variant="
									currentView === 'date'
										? 'primary'
										: 'outline'
								"
								size="sm"
								@click="setView('date')"
								>{{ txtDay }}</Button
							>
						</ButtonGroup>
					</div>
					<h2 class="text-lg font-bold text-foreground">
						{{ currentTitle }}
					</h2>
					<div class="flex items-center gap-2">
						<ButtonGroup>
							<Button
								variant="outline"
								size="sm"
								icon="lucide:chevron-left"
								@click="goToPrev" />
							<Button
								variant="outline"
								size="sm"
								@click="goToToday"
								>{{ txtToday }}</Button
							>
							<Button
								variant="outline"
								size="sm"
								icon="lucide:chevron-right"
								@click="goToNext" />
						</ButtonGroup>
					</div>
				</div>
			</template>
			<template #event="{ event, view, displayTime }">
				<CalendarEventItem
					:event="event"
					:view="view"
					:displayTime="displayTime"
					:can-edit="canEdit"
					:can-delete="canDelete"
					@view="emit('eventClick', $event)"
					@edit="emit('eventEdit', $event)"
					@delete="emit('eventDelete', $event)" />
			</template>
		</VEventCalendar>
	</div>
</template>

<style scoped>
/* Override v-event-calendar theme properties to match vlite3 design system */
:deep(.calendar-view) {
	--calendar-primary-color: var(--color-primary);
	--calendar-bg-color: transparent !important;
	--calendar-border-color: var(--color-border);
	--calendar-text-color: var(--color-foreground);
	--calendar-hover-color: var(--color-accent);
}
</style>
