<script setup lang="ts">
import { computed } from 'vue'
import { useVLiteConfig } from '@/core'

const props = withDefaults(
	defineProps<{
		value?: number | string
		currency?: string
		format?: 'standard' | 'compact'
	}>(),
	{
		value: 0,
	},
)

const config = useVLiteConfig()

const activeCurrency = computed(() => {
	return props.currency || config?.components?.price?.currency || 'USD'
})

const activeFormat = computed(() => {
	return props.format || config?.components?.price?.format || 'standard'
})

const formattedPrice = computed(() => {
    const numericValue = Number(props.value) || 0
	try {
        const options: Intl.NumberFormatOptions = {
			style: 'currency',
			currency: activeCurrency.value,
		}
        if (activeFormat.value === 'compact') {
            options.notation = 'compact'
            options.compactDisplay = 'short'
        }
		return new Intl.NumberFormat('en-US', options).format(numericValue)
	} catch (e) {
		return `$${numericValue.toFixed(2)}`
	}
})
</script>

<template>
	<span>{{ formattedPrice }}</span>
</template>
