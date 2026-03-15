<script setup lang="ts">
import Icon from '../../Icon.vue'
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
	<div class="flex w-full flex-col items-center justify-center p-8 rounded-xl bg-background border shadow-xs max-w-md mx-auto text-center">
		<Icon :icon="icon" class="h-6 w-6 text-foreground mb-4" stroke-width="1.5" />
		<h3 class="mb-1.5 text-sm font-medium text-foreground">{{ title }}</h3>
		<p class="text-sm text-muted max-w-xs" v-html="description"></p>
		<div class="mt-6" v-if="$slots.action">
			<slot name="action" />
		</div>
	</div>
</template>
