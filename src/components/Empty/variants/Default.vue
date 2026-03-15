<script setup lang="ts">
import Icon from '../../Icon.vue'
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
	<div class="flex flex-col items-center justify-center p-12 gap-5 rounded-3xl border border-dashed bg-card/50 w-full">
		<div class="w-16 h-16 rounded-full bg-muted border flex items-center justify-center">
			<Icon :icon="icon" class="w-7 h-7 text-muted" stroke-width="1.5" />
		</div>
		<div class="text-center space-y-1.5">
			<h3 class="text-lg font-semibold text-foreground tracking-tight">{{ title }}</h3>
			<p class="text-sm text-muted font-normal leading-relaxed max-w-sm mx-auto" v-html="description"></p>
		</div>
		<slot name="action" />
	</div>
</template>
