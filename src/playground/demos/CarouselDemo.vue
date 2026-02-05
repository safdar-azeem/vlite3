<script setup lang="ts">
import { Carousel } from '@/components/Carousel'

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
		<section>
			<h2 class="text-xl font-semibold mb-4">1. Basic Carousel</h2>
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
		</section>

		<!-- 2. Responsive Breakpoints -->
		<section>
			<h2 class="text-xl font-semibold mb-4">
				2. Responsive Breakpoints
			</h2>
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
		</section>

		<!-- 3. Multi Pagination Types -->
		<section>
			<h2 class="text-xl font-semibold mb-4">
				3. Multi Pagination (Dots + Buttons)
			</h2>
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
		</section>

		<!-- 4. Hover Visibility Control -->
		<section>
			<h2 class="text-xl font-semibold mb-4">
				4. Hover Visibility (Buttons on Hover)
			</h2>
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
		</section>

		<!-- 5. Vertical Carousel -->
		<section>
			<h2 class="text-xl font-semibold mb-4">5. Vertical Carousel</h2>
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
		</section>
	</div>
</template>
