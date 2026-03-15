<script setup lang="ts">
import Icon from '../../Icon.vue'
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
	<div class="grid w-full max-w-4xl grid-cols-1 items-center gap-10 border-l-[3px] border-border py-4 pl-8 md:grid-cols-2 md:gap-16 md:pl-16">
		<div class="space-y-6">
			<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50">
				<Icon :icon="icon" class="h-5 w-5 text-foreground" />
			</div>
			<h3 class="text-4xl md:text-5xl font-black uppercase italic leading-[0.9] tracking-tighter text-foreground">
				{{ title }}
			</h3>
		</div>
		<div class="flex flex-col items-start">
			<p class="mb-8 text-base md:text-lg font-light leading-relaxed text-muted" v-html="description"></p>
			<slot name="action" />
		</div>
	</div>
</template>
