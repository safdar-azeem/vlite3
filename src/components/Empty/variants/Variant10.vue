<script setup lang="ts">
import Icon from '../../Icon.vue'
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
	<div class="flex w-full flex-col items-center py-12">
		<div class="flex w-full max-w-md flex-col text-left">
			<div class="mb-6 flex w-full justify-start">
				<Icon :icon="icon" class="h-12 w-12 text-foreground opacity-80" stroke-width="1.2" />
			</div>
			<h3 class="text-xl font-medium tracking-tight text-foreground">{{ title }}</h3>
			<p class="mt-2 text-sm leading-relaxed text-muted" v-html="description"></p>
			<div class="mt-8 flex justify-start" v-if="$slots.action">
				<slot name="action" />
			</div>
		</div>
	</div>
</template>
