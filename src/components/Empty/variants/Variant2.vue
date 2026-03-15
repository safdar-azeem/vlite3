<script setup lang="ts">
import Icon from '../../Icon.vue'
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
	<div class="flex flex-col md:flex-row items-center gap-6 md:gap-8 p-8 md:p-10 rounded-3xl border bg-background w-full shadow-xs">
		<div class="w-16 h-16 shrink-0 rounded-2xl bg-foreground flex items-center justify-center shadow-sm">
			<Icon :icon="icon" class="w-7 h-7 text-background" />
		</div>
		<div class="flex-1 text-center md:text-left">
			<h3 class="text-xl font-bold text-foreground tracking-tight">{{ title }}</h3>
			<p class="text-sm text-muted mt-1.5 font-medium max-w-lg" v-html="description"></p>
		</div>
		<div class="shrink-0 mt-4 md:mt-0">
			<slot name="action" />
		</div>
	</div>
</template>
