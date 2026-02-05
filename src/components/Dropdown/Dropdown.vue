<script setup lang="ts">
import ToolTip from 'v-tooltip-lite'
import 'v-tooltip-lite/style.css'
import { computed, ref, watch, reactive, toRefs } from 'vue'
import type { IDropdownOptions, IDropdownOption } from '@/types/styles'
import type { TooltTipPlacement } from 'v-tooltip-lite/types'
import DropdownMenu from './DropdownMenu.vue'
import DropdownTrigger from './DropdownTrigger.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import { useDropdownIds } from './composables/useDropdownIds'
import { useDropdownSelection } from './composables/useDropdownSelection'

const props = withDefaults(
	defineProps<{
		selected?: any
		modelValue?: any
		className?: string
		emptyMessage?: string
		position?: TooltTipPlacement
		closeOnSelect?: boolean
		toggleSelection?: boolean
		options?: IDropdownOptions
		canCloseOutside?: boolean
		caret?: boolean
		offset?: [number, number]
		isOpen?: boolean
		teleport?: boolean
		selectedIndex?: number | null
		maxHeight?: string
		width?: string
		ignoreClickOutside?: string[]
		menuId?: string
		nestedPosition?: TooltTipPlacement
		nestedOffset?: [number, number]
		showSelectedLabel?: boolean
		selectable?: boolean
		doubleConfirmation?: boolean
		layout?: 'default' | 'grouped'
		columns?: number | string
		// Pagination & Search
		loading?: boolean
		hasMore?: boolean
		searchable?: boolean
		remote?: boolean
	}>(),
	{
		canCloseOutside: true,
		closeOnSelect: true,
		toggleSelection: true,
		position: 'bottom-end',
		emptyMessage: 'No options found',
		offset: () => [0, 8],
		isOpen: undefined,
		teleport: true,
		selectedIndex: null,
		maxHeight: '300px',
		showSelectedLabel: true,
		selectable: true,
		doubleConfirmation: false,
		layout: 'default',
		columns: 3,
		loading: false,
		hasMore: false,
		searchable: true,
		remote: false,
	},
)

const emit = defineEmits<{
	(e: 'onSelect', payload: { value: any; data?: any }): void
	(e: 'update:modelValue', value: any): void
	(e: 'onOpen'): void
	(e: 'onClose'): void
	(e: 'update:isOpen', value: boolean): void
	// new events
	(e: 'load-more'): void
	(e: 'search', query: string): void
}>()

const showConfirmation = ref(false)
const pendingOption = ref<IDropdownOption | null>(null)
const confirmationConfig = ref<{
	title: string
	description: string
	confirmText: string
	cancelText: string
	variant: 'danger' | 'primary' | 'warning' | 'success' | 'info'
}>({
	title: 'Confirm Selection',
	description: 'Are you sure you want to select this option?',
	confirmText: 'Confirm',
	cancelText: 'Cancel',
	variant: 'primary',
})

// Internal State for Open/Close
// We need this because if no v-model:isOpen is passed, we still need to force close logic.
const internalIsOpen = ref(props.isOpen || false)

watch(
	() => props.isOpen,
	(val) => {
		if (val !== undefined) {
			internalIsOpen.value = val
		}
	},
)

const handleVisibilityChange = (val: boolean) => {
	internalIsOpen.value = val
	emit('update:isOpen', val)
	if (val) emit('onOpen')
	else emit('onClose')
}

// Internal Options Caching Logic
const internalOptions = ref<IDropdownOptions>([])

watch(
	() => props.options,
	(newVal) => {
		if (!newVal) return

		if (props.remote) {
			// Merge logic: Add new options to internalOptions if not already present
			const newOptions = [...internalOptions.value]
			newVal.forEach((opt) => {
				const exists = newOptions.some((existing) => {
					// Unique check: Value or Label
					if (
						existing.value !== undefined &&
						opt.value !== undefined
					) {
						// Check for object value equality if necessary, but typically value is primitive or has ID
						// For complex objects, simple equality might trigger dupes. Assuming primitive or stable ref.
						// If value is object, maybe check key?
						if (
							typeof existing.value === 'object' &&
							existing.key &&
							opt.key
						) {
							return (
								existing.key === opt.key &&
								existing.value[existing.key] ===
									opt.value[opt.key]
							)
						}
						return existing.value === opt.value
					}
					return existing.label === opt.label
				})

				if (!exists) {
					newOptions.push(opt)
				}
			})
			internalOptions.value = newOptions
		} else {
			internalOptions.value = newVal
		}
	},
	{ immediate: true, deep: true },
)

const { getAllRecursiveIds } = useDropdownIds()

// useDropdownSelection needs ALL options to resolve labels correctly, especially for cached items not in current props.options
// We construct a reactive props proxy to inject internalOptions
const selectionProps = reactive({
	...toRefs(props),
	options: internalOptions,
})

const { currentValue, selectedLabel, selectOption } = useDropdownSelection(
	selectionProps as any, // Cast to any to satisfy strict prop types if needed, or define interface
	emit,
)

const finalIgnoreClickOutside = computed(() => {
	const propsList = props.ignoreClickOutside || []
	// Use internalOptions to include cached recursive IDs
	const recursiveIds = getAllRecursiveIds(internalOptions.value)
	return [...new Set([...propsList, ...recursiveIds])]
})

const handleOptionSelect = (
	option: import('@/types/styles').IDropdownOption,
) => {
	// Check if double confirmation is enabled globally or per-option
	const needsConfirmation = props.doubleConfirmation || !!option.confirmation

	if (needsConfirmation) {
		pendingOption.value = option

		// Configure Modal
		if (typeof option.confirmation === 'object') {
			confirmationConfig.value = {
				title: option.confirmation.title || 'Confirm Selection',
				description:
					option.confirmation.description ||
					'Are you sure you want to select this option?',
				confirmText: option.confirmation.confirmText || 'Confirm',
				cancelText: option.confirmation.cancelText || 'Cancel',
				variant: option.confirmation.variant || 'primary',
			}
		} else {
			// Default / Global
			confirmationConfig.value = {
				title: 'Confirm Selection',
				description: `Are you sure you want to select "${option.label}"?`,
				confirmText: 'Confirm',
				cancelText: 'Cancel',
				variant: 'primary',
			}
		}

		showConfirmation.value = true
		// Close dropdown immediately? Or wait?
		// Requirement: "Visually state should only change after confirmation" implies we wait.
		// So we don't close until confirm? Or we close dropdown to show modal?
		// Modal usually overlays everything. Better to close dropdown to reduce clutter,
		// but if we cancel, users might expect dropdown to stay open?
		// Let's close dropdown to properly focus on modal.
		handleClose()
	} else {
		performSelection(option)
		if (props.closeOnSelect) {
			handleClose()
		}
	}
}

const performSelection = (option: import('@/types/styles').IDropdownOption) => {
	selectOption(option)
}

const confirmSelection = () => {
	if (pendingOption.value) {
		performSelection(pendingOption.value)
		pendingOption.value = null
		showConfirmation.value = false
	}
}

const cancelSelection = () => {
	pendingOption.value = null
	showConfirmation.value = false
}

const handleClose = () => {
	handleVisibilityChange(false)
}
</script>

<template>
	<div class="relative inline-block text-left">
		<ToolTip
			content=""
			trigger="click"
			:arrow="false"
			:teleport="teleport"
			:offset="offset"
			:placement="position"
			:isOpen="internalIsOpen"
			:menuId="menuId"
			:ignoreClickOutside="finalIgnoreClickOutside"
			class="w-full"
			:className="'dropdown ' + (className || '')"
			@onShow="$emit('onOpen')"
			@onHide="$emit('onClose')"
			@update:isOpen="handleVisibilityChange"
			triggerClass="w-full"
			:styles="{ padding: '0' }">
			<template #trigger="{ isOpen }">
				<slot
					name="trigger"
					v-bind="{ selectedLabel, isOpen }">
					<DropdownTrigger
						:selected-label="selectedLabel"
						:is-open="isOpen"
						class="w-full" />
				</slot>
			</template>

			<template #default>
				<slot />

				<DropdownMenu
					v-if="
						options?.length ||
						internalOptions.length ||
						$slots.menu ||
						$slots.item ||
						remote ||
						searchable
					"
					:options="options"
					:cachedOptions="internalOptions"
					:class="className"
					:selected="currentValue"
					:selectedIndex="selectedIndex"
					:maxHeight="maxHeight"
					:nestedPosition="nestedPosition"
					:nestedOffset="nestedOffset"
					:selectable="selectable"
					:layout="layout"
					:columns="columns"
					:loading="loading"
					:hasMore="hasMore"
					:searchable="searchable"
					:remote="remote"
					@select="handleOptionSelect"
					@close="handleClose"
					@load-more="$emit('load-more')"
					@search="(q) => $emit('search', q)">
					<template #menu>
						<slot name="menu" />
					</template>
					<template #item="slotProps">
						<slot
							name="item"
							v-bind="slotProps" />
					</template>
					<template
						#header
						v-if="$slots.header">
						<slot name="header" />
					</template>
					<template
						#footer
						v-if="$slots.footer">
						<slot name="footer" />
					</template>
				</DropdownMenu>
			</template>
		</ToolTip>

		<ConfirmationModal
			:show="showConfirmation"
			:title="confirmationConfig.title"
			:description="confirmationConfig.description"
			:confirm-text="confirmationConfig.confirmText"
			:cancel-text="confirmationConfig.cancelText"
			:variant="confirmationConfig.variant"
			@confirm="confirmSelection"
			@cancel="cancelSelection" />
	</div>
</template>
