<script setup lang="ts">
import { Dropdown } from '@/components/Dropdown'
import ColorIro from './ColorIro.vue'
import Button from '@/components/Button.vue'
import type { TooltTipPlacement } from 'v-tooltip-lite/types'
import type { ButtonProps } from '@/types'

interface Props {
	modelValue?: string
	disabled?: boolean
	size?: 'sm' | 'md' | 'lg'
	position?: TooltTipPlacement
	btnProps?: ButtonProps
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: '#000000',
	disabled: false,
	size: 'md',
	position: 'right-start',
})

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void
	(e: 'change', value: string): void
}>()

const handleColorChange = (color: string) => {
	emit('update:modelValue', color)
	emit('change', color)
}
</script>

<template>
	<Dropdown
		:disabled="disabled"
		class="w-auto"
		:position="position"
		:offset="[0, 8]"
		:close-on-select="false">
		<template #trigger="{ isOpen }">
			<Button
				:style="{ backgroundColor: modelValue }"
				v-bind="{
					rounded: 'full',
					size: 'xs',
					icon: ' ',
					variant: 'outline',
					...(btnProps || {}),
				}" />
		</template>

		<div class="p-1.5">
			<ColorIro
				:color="modelValue"
				:show-header="false"
				:size="size"
				@update:color="handleColorChange" />
		</div>
	</Dropdown>
</template>
