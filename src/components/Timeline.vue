<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import type { TimelineStep, TimelineDirection, TimelineTextPosition } from '@/types'

interface Props {
	steps: TimelineStep[]
	activeStep?: number
	direction?: TimelineDirection
	textPosition?: TimelineTextPosition
	clickable?: boolean
	class?: string
}

const props = withDefaults(defineProps<Props>(), {
	activeStep: 0,
	direction: 'horizontal',
	textPosition: 'bottom',
	clickable: false,
	class: '',
})

const emit = defineEmits<{
	(e: 'step-click', step: TimelineStep, index: number): void
}>()

const getStepStatus = (index: number, step: TimelineStep) => {
	if (step.status) return step.status
	if (index < props.activeStep) return 'completed'
	if (index === props.activeStep) return 'current'
	return 'upcoming'
}

const isVertical = computed(() => props.direction === 'vertical')

// Calculate progress percentage for global horizontal bar (Text Bottom Mode)
const progressPercentage = computed(() => {
	if (props.steps.length <= 1) return 0
	const effectiveStep = Math.min(props.activeStep, props.steps.length - 1)
	return (effectiveStep / (props.steps.length - 1)) * 100
})
</script>

<template>
	<nav
		:aria-label="'Progress'"
		:class="['w-full', props.class]">
		<ol
			role="list"
			:class="[
				'relative flex',
				// Vertical
				isVertical ? 'flex-col space-y-0' : '',

				// Horizontal: Bottom Text (Default) -> Justify Between
				!isVertical && textPosition === 'bottom'
					? 'flex-row w-full justify-between items-center'
					: '',

				// Horizontal: Right Text -> Standard Flex
				!isVertical && textPosition === 'right'
					? 'flex-row w-full'
					: '',
			]">
			<!-- Global Horizontal Line (Text Bottom Mode ONLY) -->
			<div
				v-if="!isVertical && textPosition === 'bottom'"
				class="absolute top-4 left-4 right-4 h-0.5 bg-border"
				aria-hidden="true">
				<div
					class="h-full bg-primary transition-all duration-300 ease-in-out"
					:style="{ width: `${progressPercentage}%` }"></div>
			</div>

			<!-- Mobile Global Line (Force for small screens even if 'right') -->
			<div
				v-if="!isVertical && textPosition === 'right'"
				class="absolute top-4 left-4 right-4 h-0.5 bg-border block sm:hidden"
				aria-hidden="true">
				<div
					class="h-full bg-primary transition-all duration-300 ease-in-out"
					:style="{ width: `${progressPercentage}%` }"></div>
			</div>

			<li
				v-for="(step, index) in steps"
				:key="step.id"
				@click="clickable ? emit('step-click', step, index) : null"
				:class="[
					'relative',
					clickable ? 'cursor-pointer' : '',

					// Vertical
					isVertical ? 'w-full pb-10 last:pb-0' : '',

					// Horizontal Bottom: Fixed Width Icon Anchor
					!isVertical && textPosition === 'bottom'
						? 'flex-none w-8'
						: '',

					// Horizontal Right: Flex-1 to spread out (Desktop), Mobile acts as fixed width
					!isVertical && textPosition === 'right'
						? 'flex-1 last:flex-none'
						: '',
				]">
				<!-- Vertical Line (Desktop Only when Vertical) -->
				<div
					v-if="isVertical && index !== steps.length - 1"
					class="hidden sm:block absolute top-4 left-4 -ml-px h-full w-0.5 bg-border"
					:class="{ 'bg-primary': index < activeStep }"
					aria-hidden="true"></div>

				<div
					:class="[
						'group relative flex',

						// Vertical Layout
						isVertical
							? 'flex-col items-center text-center sm:flex-row sm:items-start sm:text-left'
							: '',

						// Horizontal Bottom or Mobile Default
						!isVertical && textPosition === 'bottom'
							? 'flex-col items-center justify-center'
							: '',

						// Horizontal Right (Desktop) -> Row with gap
						// Mobile -> Fallback to Col (Icon Only effectively)
						!isVertical && textPosition === 'right'
							? 'flex-col items-center sm:flex-row sm:items-center sm:gap-2 w-full' // w-full needed for flex line growth
							: '',
					]">
					<!-- Icon Circle -->
					<span
						class="flex h-9 w-9 items-center justify-center shrink-0 bg-background z-10"
						aria-hidden="true">
						<!-- Completed Step -->
						<span
							v-if="getStepStatus(index, step) === 'completed'"
							class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary-dark transition-colors">
							<Icon
								icon="lucide:check"
								class="h-5 w-5 text-primary-foreground" />
						</span>

						<!-- Current Step -->
						<span
							v-else-if="getStepStatus(index, step) === 'current'"
							class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background">
							<Icon
								v-if="step.icon"
								:icon="step.icon"
								class="h-4 w-4 text-primary" />
							<span
								v-else
								class="h-2.5 w-2.5 rounded-full bg-primary" />
						</span>

						<!-- Upcoming Step -->
						<span
							v-else
							class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background group-hover:border-muted-foreground transition-colors">
							<Icon
								v-if="step.icon"
								:icon="step.icon"
								class="h-4 w-4 text-muted-foreground" />
							<span
								v-else
								class="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-muted" />
						</span>
					</span>

					<!-- Content -->
					<span
						:class="[
							'min-w-[max-content] flex-col',
							'hidden sm:flex', // Hide on mobile (Icon Only rule)

							// Vertical: Margin Left
							isVertical ? 'sm:ml-4 sm:pt-1.5' : '',

							// Horizontal Bottom: Absolute Below
							!isVertical && textPosition === 'bottom'
								? 'absolute top-10 text-center'
								: '',

							// Horizontal Bottom Alignment specific
							!isVertical &&
							textPosition === 'bottom' &&
							index === 0
								? 'left-0 text-left items-start'
								: '',
							!isVertical &&
							textPosition === 'bottom' &&
							index === steps.length - 1
								? 'right-0 text-right items-end'
								: '',
							!isVertical &&
							textPosition === 'bottom' &&
							index > 0 &&
							index < steps.length - 1
								? 'left-1/2 -translate-x-1/2 items-center'
								: '',

							// Horizontal Right: No absolute, just flow
							!isVertical && textPosition === 'right' ? '' : '',
						]">
						<slot
							name="content"
							:step="step"
							:index="index">
							<span
								class="text-sm font-medium leading-tight"
								:class="
									getStepStatus(index, step) === 'upcoming'
										? 'text-muted-foreground'
										: 'text-primary'
								"
								>{{ step.title }}</span
							>
							<span
								v-if="step.description"
								class="text-xs text-muted-foreground mt-1"
								>{{ step.description }}</span
							>
						</slot>
					</span>

					<!-- Horizontal Right Mode Line (Flex) -->
					<!-- Placed AFTER content to prevent overlap -->
					<div
						v-if="
							!isVertical &&
							textPosition === 'right' &&
							index !== steps.length - 1
						"
						class="hidden sm:block flex-1 h-0.5 bg-border ml-2"
						aria-hidden="true">
						<!-- Colored portion -->
						<div
							class="h-full bg-primary transition-all duration-300"
							:class="
								index < activeStep ? 'w-full' : 'w-0'
							"></div>
					</div>
				</div>
			</li>
		</ol>
	</nav>
</template>
