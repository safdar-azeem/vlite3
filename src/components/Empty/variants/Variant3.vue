<script setup lang="ts">
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
	<div class="flex flex-col items-center text-center w-full group py-8">
		<div class="overflow-hidden mb-6">
			<h3 class="text-6xl md:text-7xl font-black tracking-tighter text-foreground uppercase leading-[0.85] transition-transform duration-700 group-hover:-translate-y-2">
				{{ title }}
			</h3>
		</div>
		<div class="h-1.5 w-16 rounded-full bg-foreground/20 mb-8 transition-all duration-500 group-hover:w-24 group-hover:bg-foreground"></div>
		<p class="text-xs text-muted font-bold tracking-[0.2em] uppercase max-w-sm mb-12" v-html="description"></p>
		<slot name="action" />
	</div>
</template>
