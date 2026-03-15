<script setup lang="ts">
defineProps<{ title: string; description: string; icon: string }>()
</script>

<template>
	<div class="flex w-full flex-col items-center text-center text-foreground py-6">
		<div class="mb-6 space-y-1">
			<h3 class="text-4xl font-bold tracking-tight leading-none">
				{{ title.split(' ')[0] }} {{ title.split(' ')[1] || '' }}
			</h3>
			<h4 class="text-4xl font-bold tracking-tight leading-none text-muted">
				{{ title.split(' ').slice(2).join(' ') }}
			</h4>
		</div>
		
		<div class="relative my-8 flex w-full max-w-[400px] items-center h-px">
			<div class="h-full flex-1 bg-linear-to-r from-transparent via-border to-transparent"></div>
			<div class="absolute right-0 h-1.5 w-1.5 rounded-full bg-muted"></div>
		</div>

		<p class="mb-10 max-w-sm text-sm font-normal leading-relaxed text-muted" v-html="description"></p>
		
		<slot name="action" />
	</div>
</template>
