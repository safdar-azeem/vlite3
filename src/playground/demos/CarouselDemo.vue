<script setup lang="ts">
import { Carousel } from '@/components/Carousel'
import DemoSection from '../DemoSection.vue'
import sourceCode from './CarouselDemo.vue?raw'

/*
 * Carousel Wrapper Demo
 * Shows various configurations of the Carousel component
 */

const images = [
	'https://picsum.photos/600/400?random=1',
	'https://picsum.photos/600/400?random=2',
	'https://picsum.photos/600/400?random=3',
	'https://picsum.photos/600/400?random=4',
	'https://picsum.photos/600/400?random=5',
]

const itemsToShowBreakpoints = {
	640: 1,
	768: 2,
	1024: 3,
}
</script>

<template>
	<div class="p-8 space-y-12">
		<h1 class="text-3xl font-bold mb-6">Carousel Wrapper Demo</h1>

		<!-- 1. Basic Carousel -->
		<DemoSection title="Basic Carousel" :code="sourceCode">
			<Carousel
				:data="images"
				pagination="dots"
				:items-to-show="1">
				<template #default="{ item }">
					<div class="h-64 w-full">
						<img
							:src="item"
							alt="Slide"
							class="w-full h-full object-cover rounded-lg" />
					</div>
				</template>
			</Carousel>
		</DemoSection>

		<!-- 2. Responsive Breakpoints -->
		<DemoSection title="Responsive Breakpoints" :code="sourceCode">
			<Carousel
				:data="images"
				:items-to-show="itemsToShowBreakpoints"
				pagination="dots"
				pagination-position="bottom-center"
				:gap="10">
				<template #default="{ item }">
					<div class="h-48 w-full">
						<img
							:src="item"
							alt="Slide"
							class="w-full h-full object-cover rounded-lg" />
					</div>
				</template>
			</Carousel>
		</DemoSection>

		<!-- 3. Multi Pagination Types -->
		<DemoSection title="Multi Pagination (Dots + Buttons)" :code="sourceCode">
			<Carousel
				:data="images"
				:pagination="['dots', 'buttons']"
				:pagination-position="['bottom-center', 'center']"
				:items-to-show="1"
				:gap="10">
				<template #default="{ item }">
					<div class="h-64 w-full">
						<img
							:src="item"
							alt="Slide"
							class="w-full h-full object-cover rounded-lg" />
					</div>
				</template>
			</Carousel>
		</DemoSection>

		<!-- 4. Hover Visibility Control -->
		<DemoSection title="Hover Visibility (Buttons on Hover)" :code="sourceCode">
			<Carousel
				:data="images"
				:pagination="['dots', 'buttons']"
				:pagination-position="['bottom-center', 'center']"
				:pagination-visibility="['always', 'hover']"
				:items-to-show="1">
				<template #default="{ item }">
					<div class="h-64 w-full">
						<img
							:src="item"
							alt="Slide"
							class="w-full h-full object-cover rounded-lg" />
					</div>
				</template>
			</Carousel>
		</DemoSection>

		<!-- 5. Vertical Carousel -->
		<DemoSection title="Vertical Carousel" :code="sourceCode">
			<Carousel
				:data="images"
				direction="vertical"
				:pagination="['dots', 'buttons']"
				:pagination-position="['center-right', 'center']"
				:pagination-visibility="['always', 'hover']"
				:items-to-show="1">
				<template #default="{ item }">
					<div
						class="h-full w-full"
						style="height: 600px">
						<img
							:src="item"
							alt="Slide"
							class="w-full h-full object-cover rounded-lg" />
					</div>
				</template>
			</Carousel>
		</DemoSection>
	</div>
</template>
