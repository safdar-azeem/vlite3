<script setup lang="ts">
import { ref, computed } from 'vue'
import Dropdown from '@/components/Dropdown/Dropdown.vue'
import { $t } from '@/utils/i18n'
import { formatTime, formatDisplayTime } from 'v-event-calendar'

const props = defineProps<{
	event: any
	view: string
	displayTime?: string
	canEdit?: boolean
	canDelete?: boolean
}>()

const emit = defineEmits(['view', 'edit', 'delete'])

const isMenuOpen = ref(false)

const openMenu = () => {
	isMenuOpen.value = true
}

const handleClick = (e: MouseEvent) => {
	// Prevent clicking if dropdown trigger was clicked
	if ((e.target as HTMLElement).closest('.event-actions')) return
	emit('view', props.event)
}

const t = (key: string, fallback: string, args?: Record<string, any>) => {
	const res = args ? $t(key, args) : $t(key)
	return res !== key ? res : fallback
}

const txtViewDetails = computed(() => t('vlite.calendar.viewDetails', 'View Details'))
const txtEdit = computed(() => t('vlite.calendar.edit', 'Edit'))
const txtDelete = computed(() => t('vlite.calendar.delete', 'Delete'))

const dropdownOptions = computed(() => {
	const opts = [
		{
			label: txtViewDetails.value,
			value: 'view',
			icon: 'lucide:eye',
			class: 'gap-1',
		},
	]
	if (props.canEdit) {
		opts.push({
			label: txtEdit.value,
			value: 'edit',
			icon: 'lucide:edit-2',
			class: 'gap-1',
		})
	}
	if (props.canDelete) {
		opts.push({
			label: txtDelete.value,
			value: 'delete',
			icon: 'lucide:trash-2',
			class: 'gap-1',
		})
	}
	return opts
})

const handleAction = (payload: any) => {
	const action = payload.value
	if (action === 'view') emit('view', props.event)
	if (action === 'edit') emit('edit', props.event)
	if (action === 'delete') emit('delete', props.event)
}

// Format time to Apple/Google style (e.g., "5 – 6AM" or "5:30 – 6:30PM")
const formattedTime = computed(() => {
	if (!props.event?.start) return props.displayTime || ''

	try {
		// 1. Convert ISO to Local Date
		const startDate = new Date(props.event.start)
		if (isNaN(startDate.getTime())) return props.displayTime || ''

		// 2. Use library to get local HH:mm
		const startTime24 = formatTime(startDate)

		// 3. Use library to format to 12h display (e.g., "05:00 AM")
		const startDisplay = formatDisplayTime(startTime24, false)

		// Helper to remove leading zero and clean up exact hour (e.g., "05:00 AM" -> "5 AM")
		const cleanStr = (str: string) => {
			let s = str.replace(/^0/, '') // remove leading zero
			s = s.replace(':00 ', ' ') // 5:00 AM -> 5 AM
			return s
		}

		const cStart = cleanStr(startDisplay)

		if (props.event.end && props.event.end !== props.event.start) {
			const endDate = new Date(props.event.end)
			if (!isNaN(endDate.getTime())) {
				const endTime24 = formatTime(endDate)
				const endDisplay = formatDisplayTime(endTime24, false)
				const cEnd = cleanStr(endDisplay)

				const startAMPM = cStart.slice(-2)
				const endAMPM = cEnd.slice(-2)

				// If both are same AM/PM, don't repeat the first AM/PM suffix (e.g., "5 - 6AM")
				if (startAMPM === endAMPM && cStart !== cEnd) {
					return `${cStart.replace(` ${startAMPM}`, '')} – ${cEnd.replace(' ', '')}`
				} else if (cStart !== cEnd) {
					// Different periods (e.g., "11AM - 1PM")
					return `${cStart.replace(' ', '')} – ${cEnd.replace(' ', '')}`
				}
			}
		}

		return cStart.replace(' ', '') // e.g., "5AM"
	} catch (err) {
		return props.displayTime || ''
	}
})
</script>

<template>
	<div
		:class="
			view == 'month'
				? 'flex-row! justify-between p-0.5 px-0!  -text-fs-3! items-center'
				: ' -text-fs-3'
		"
		class="h-full w-full flex flex-col overflow-hidden relative group cursor-pointer"
		@click="handleClick"
		@contextmenu.prevent="openMenu">
		<div class="font-medium truncate leading-tight drop-shadow-sm pr-4">
			{{ event.title }}
		</div>

		<div
			v-if="formattedTime"
			class="opacity-90 font-medium text-[9px] truncate mt-0.5 tracking-tight drop-shadow-sm flex items-center gap-1">
			<span class="truncate">{{ formattedTime }}</span>
		</div>

		<Dropdown
			:options="dropdownOptions"
			:is-open="isMenuOpen"
			@update:is-open="isMenuOpen = $event"
			@on-select="handleAction"
			class="absolute top-1 right-1"
			position="bottom-end">
			<template #trigger>
				<button
					class="event-actions lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity p-0.5 rounded hover:bg-black/20 text-current flex items-center justify-center"
					@click.stop.prevent="isMenuOpen = !isMenuOpen">
					<span
						class="iconify w-3 h-3"
						data-icon="lucide:more-vertical"></span>
				</button>
			</template>
		</Dropdown>
	</div>
</template>
