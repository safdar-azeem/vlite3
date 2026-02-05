<script setup lang="ts">
import {
	ref,
	watch,
	nextTick,
	onUnmounted,
	onMounted,
	defineAsyncComponent,
	computed,
} from 'vue'
import iro from '@jaames/iro'
import { useEyeDropper } from '@vueuse/core'

const Button = defineAsyncComponent(() => import('@/components/Button.vue'))

const props = withDefaults(
	defineProps<{
		color: string
		showHeader?: boolean
		size?: 'sm' | 'md' | 'lg'
	}>(),
	{
		showHeader: true,
		size: 'md',
	},
)

const emit = defineEmits<{
	'update:color': [color: string]
	close: []
}>()

const pickerRef = ref<HTMLDivElement>()
const colorPicker = ref<any>(null)

const { isSupported, open, sRGBHex } = useEyeDropper()

const pickerWidth = computed(() => {
	switch (props.size) {
		case 'sm':
			return 140
		case 'lg':
			return 170
		case 'md':
		default:
			return 162
	}
})

const pickerHeight = {
	sm: 120,
	md: 140,
	lg: 150,
}

const initializePicker = async () => {
	if (!pickerRef.value || colorPicker.value) return

	await nextTick()

	try {
		if (colorPicker.value) {
			colorPicker.value.off('color:change')
			colorPicker.value = null
		}

		colorPicker.value = iro.ColorPicker(pickerRef.value, {
			width: pickerWidth.value,
			color: props.color,
			margin: 9,

			boxHeight: pickerHeight[props?.size], // Auto-scale or keep ratio? default is usually width.
			// Let's rely on default square-ish box unless specified.
			// But for small size, maybe we want to keep it compact.
			// iro defaults boxHeight to width if not specified.

			sliderSize: 14,
			layout: [
				{
					component: iro.ui.Box,
				},
				{
					component: iro.ui.Slider,
					options: {
						sliderType: 'hue',
					},
				},
				{
					component: iro.ui.Slider,
					options: {
						sliderType: 'saturation',
					},
				},
				{
					component: iro.ui.Slider,
					options: {
						sliderType: 'value',
					},
				},
			],
		})

		colorPicker.value.on('color:change', (color: any) => {
			emit('update:color', color.hexString)
		})
	} catch (error) {
		console.error('Failed to initialize color picker:', error)
	}
}

const destroyPicker = () => {
	if (colorPicker.value) {
		colorPicker.value.off('color:change')
		colorPicker.value = null
	}
}

watch(
	() => props.color,
	(newColor) => {
		if (
			colorPicker.value &&
			colorPicker.value.color.hexString !== newColor
		) {
			try {
				colorPicker.value.color.hexString = newColor
			} catch (error) {
				console.error('Error updating color:', error)
			}
		}
	},
)

// Re-initialize if size changes significantly?
// iro doesn't support dynamic resizing easily without re-init.
watch(
	() => props.size,
	() => {
		destroyPicker()
		initializePicker()
	},
)

watch(sRGBHex, (newColor) => {
	if (newColor) {
		emit('update:color', newColor)
		if (colorPicker.value) {
			try {
				colorPicker.value.color.hexString = newColor
			} catch (error) {
				console.error('Error updating color from eyedropper:', error)
			}
		}
	}
})

const openEyeDropper = async () => {
	try {
		await open()
	} catch (error) {
		console.error('Error opening eyedropper:', error)
	}
}

onMounted(() => {
	initializePicker()
})

onUnmounted(() => {
	destroyPicker()
})
</script>

<template>
	<div class="space-y-3">
		<div
			class="flex gap-2 mb-2.5 -text-fs-3 pr-0.5"
			v-if="showHeader">
			<Button
				icon="typcn:arrow-back"
				@click="emit('close')"
				class="flex-1 px-2 py-1 bg-background hover:bg-accent rounded text-xs border border-border transition-colors">
			</Button>
			<Button
				v-if="isSupported"
				@click="openEyeDropper"
				icon="pepicons-pop:color-picker"
				class="flex-1 px-2 py-1 bg-background hover:bg-accent rounded text-xs border border-border transition-colors"></Button>
		</div>
		<div
			ref="pickerRef"
			:class="`w-[${pickerWidth}px]`"></div>
		<Button
			v-if="isSupported && !showHeader"
			@click="openEyeDropper"
			icon="pepicons-pop:color-picker"
			variant="outline"
			size="xs"
			class="w-full"></Button>
	</div>
</template>

<style>
.IroBox {
	border-radius: 8px !important;
}
</style>
