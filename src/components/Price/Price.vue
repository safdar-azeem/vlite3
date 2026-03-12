<script setup lang="ts">
import { computed } from 'vue'
import { useVLiteConfig } from '@/core'

const props = withDefaults(
	defineProps<{
		value?: number | string
		currency?: string
	}>(),
	{
		value: 0,
	},
)

const config = useVLiteConfig()

const activeCurrency = computed(() => {
	return props.currency || config?.components?.price?.currency || 'USD'
})

const formattedPrice = computed(() => {
    const numericValue = Number(props.value) || 0
	try {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: activeCurrency.value,
		}).format(numericValue)
	} catch (e) {
		return `$${numericValue.toFixed(2)}`
	}
})
</script>

<template>
	<span>{{ formattedPrice }}</span>
</template>
