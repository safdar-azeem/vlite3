<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '@/components/Icon.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import Button from '@/components/Button.vue'

// Core
import ButtonDemo from './demos/ButtonDemo.vue'
import ButtonGroupDemo from './demos/ButtonGroupDemo.vue'
import BadgeDemo from './demos/BadgeDemo.vue'
import ChipDemo from './demos/ChipDemo.vue'
import AvatarDemo from './demos/AvatarDemo.vue'

// Forms
import InputDemo from './demos/InputDemo.vue'
import OTPInputDemo from './demos/OTPInputDemo.vue'
import MultiSelectDemo from './demos/MultiSelectDemo.vue'
import ChoiceBoxDemo from './demos/ChoiceBoxDemo.vue'
import FilePickerDemo from './demos/FilePickerDemo.vue'
import AvatarUploaderDemo from './demos/AvatarUploaderDemo.vue'
import TextareaDemo from './demos/TextareaDemo.vue'
import CheckBoxDemo from './demos/CheckBoxDemo.vue'
import SwitchDemo from './demos/SwitchDemo.vue'
import SliderDemo from './demos/SliderDemo.vue'
import ColorPickerDemo from './demos/ColorPickerDemo.vue'
import IconPickerDemo from './demos/IconPickerDemo.vue'
import DatePickerDemo from './demos/DatePickerDemo.vue'
import FormDemo from './demos/FormDemo.vue'

// Feedback / Overlays
import AlertDemo from './demos/AlertDemo.vue'
import ModalDemo from './demos/ModalDemo.vue'
import SidePanelDemo from './demos/SidePanelDemo.vue'
import DropdownDemo from './demos/DropdownDemo.vue'
import TooltipDemo from './demos/TooltipDemo.vue'
import ToastDemo from './demos/ToastDemo.vue'

// Navigation / Data
import AccordionDemo from './demos/AccordionDemo.vue'
import NavbarDemo from './demos/NavbarDemo.vue'
import TimelineDemo from './demos/TimelineDemo.vue'
import PaginationDemo from './demos/PaginationDemo.vue'
import LabelDemo from './demos/LabelDemo.vue'
import ThemeToggleDemo from './demos/ThemeToggleDemo.vue'
import SidebarMenuDemo from './demos/SidebarMenuDemo.vue'
import WorkbookDemo from './demos/WorkbookDemo.vue'
import TabesDemo from './demos/TabesDemo.vue'
import MasonryDemo from './demos/MasonryDemo.vue'
import ColorsDemo from './demos/ColorsDemo.vue'
import PricingPlanDemo from './demos/PricingPlanDemo.vue'
import HeatmapDemo from './demos/HeatmapDemo.vue'
import FileTreeDemo from './demos/FileTreeDemo.vue'
import DataTableDemo from './demos/DataTableDemo.vue'
import CarouselDemo from './demos/CarouselDemo.vue'

const categories = [
	{
		name: 'Theme & Style',
		items: [
			{
				id: 'colors',
				label: 'Theme Colors',
				icon: 'lucide:palette',
				component: ColorsDemo,
			},
			{
				id: 'themetoggle',
				label: 'ThemeToggle',
				icon: 'lucide:sun',
				component: ThemeToggleDemo,
			},
		],
	},
	{
		name: 'Core',
		items: [
			{
				id: 'button',
				label: 'Button',
				icon: 'lucide:mouse-pointer-2',
				component: ButtonDemo,
			},
			{
				id: 'buttongroup',
				label: 'ButtonGroup',
				icon: 'lucide:git-merge',
				component: ButtonGroupDemo,
			},
			{
				id: 'badge',
				label: 'Badge',
				icon: 'lucide:tag',
				component: BadgeDemo,
			},
			{
				id: 'chip',
				label: 'Chip',
				icon: 'lucide:sticker',
				component: ChipDemo,
			},
			{
				id: 'avatar',
				label: 'Avatar',
				icon: 'lucide:user',
				component: AvatarDemo,
			},
			{
				id: 'avatar-uploader',
				label: 'Avatar Uploader',
				icon: 'lucide:camera',
				component: AvatarUploaderDemo,
			},
		],
	},
	{
		name: 'Forms',
		items: [
			{
				id: 'input',
				label: 'Input',
				icon: 'lucide:text-cursor-input',
				component: InputDemo,
			},
			{
				id: 'form',
				label: 'Form',
				icon: 'lucide:file-input',
				component: FormDemo,
			},
			{
				id: 'otpinput',
				label: 'OTP Input',
				icon: 'lucide:hash',
				component: OTPInputDemo,
			},
			{
				id: 'multiselect',
				label: 'MultiSelect',
				icon: 'lucide:list-checks',
				component: MultiSelectDemo,
			},
			{
				id: 'choicebox',
				label: 'ChoiceBox',
				icon: 'lucide:layout-grid',
				component: ChoiceBoxDemo,
			},
			{
				id: 'filepicker',
				label: 'FilePicker',
				icon: 'lucide:upload-cloud',
				component: FilePickerDemo,
			},
			{
				id: 'textarea',
				label: 'Textarea',
				icon: 'lucide:align-left',
				component: TextareaDemo,
			},
			{
				id: 'checkbox',
				label: 'CheckBox',
				icon: 'lucide:check-square',
				component: CheckBoxDemo,
			},
			{
				id: 'switch',
				label: 'Switch',
				icon: 'lucide:toggle-left',
				component: SwitchDemo,
			},
			{
				id: 'slider',
				label: 'Slider',
				icon: 'lucide:sliders-horizontal',
				component: SliderDemo,
			},
			{
				id: 'colorpicker',
				label: 'ColorPicker',
				icon: 'lucide:palette',
				component: ColorPickerDemo,
			},
			{
				id: 'iconpicker',
				label: 'IconPicker',
				icon: 'lucide:smile',
				component: IconPickerDemo,
			},
			{
				id: 'datepicker',
				label: 'DatePicker',
				icon: 'lucide:calendar',
				component: DatePickerDemo,
			},
		],
	},
	{
		name: 'Feedback & Overlays',
		items: [
			{
				id: 'alert',
				label: 'Alert',
				icon: 'lucide:alert-circle',
				component: AlertDemo,
			},
			{
				id: 'modal',
				label: 'Modal',
				icon: 'lucide:app-window',
				component: ModalDemo,
			},
			{
				id: 'sidepanel',
				label: 'SidePanel',
				icon: 'lucide:panel-right',
				component: SidePanelDemo,
			},
			{
				id: 'dropdown',
				label: 'Dropdown',
				icon: 'lucide:chevron-down-square',
				component: DropdownDemo,
			},
			{
				id: 'tooltip',
				label: 'Tooltip',
				icon: 'lucide:message-square',
				component: TooltipDemo,
			},
			{
				id: 'toast',
				label: 'Toast',
				icon: 'lucide:bell',
				component: ToastDemo,
			},
		],
	},
	{
		name: 'Navigation & Data',
		items: [
			{
				id: 'datatable',
				label: 'DataTable',
				icon: 'lucide:table-2',
				component: DataTableDemo,
			},
			{
				id: 'sidebarmenu',
				label: 'Sidebar Menu',
				icon: 'lucide:sidebar',
				component: SidebarMenuDemo,
			},
			{
				id: 'workbook',
				label: 'Workbook',
				icon: 'lucide:folder-edit',
				component: WorkbookDemo,
			},
			{
				id: 'tabes',
				label: 'Tabes (Segmented)',
				icon: 'lucide:toggle-left',
				component: TabesDemo,
			},
			{
				id: 'accordion',
				label: 'Accordion',
				icon: 'lucide:list',
				component: AccordionDemo,
			},
			{
				id: 'navbar',
				label: 'Navbar',
				icon: 'lucide:layout-template',
				component: NavbarDemo,
			},
			{
				id: 'timeline',
				label: 'Timeline',
				icon: 'lucide:clock',
				component: TimelineDemo,
			},
			{
				id: 'pagination',
				label: 'Pagination',
				icon: 'lucide:arrow-left-right',
				component: PaginationDemo,
			},
			{
				id: 'masonry',
				label: 'Masonry Grid',
				icon: 'lucide:layout-dashboard',
				component: MasonryDemo,
			},
			{
				id: 'pricing',
				label: 'Pricing Plan',
				icon: 'lucide:credit-card',
				component: PricingPlanDemo,
			},
			{
				id: 'heatmap',
				label: 'Heatmap',
				icon: 'lucide:activity',
				component: HeatmapDemo,
			},
			{
				id: 'label',
				label: 'Label',
				icon: 'lucide:type',
				component: LabelDemo,
			},
			{
				id: 'filetree',
				label: 'File Tree',
				icon: 'lucide:folder-tree',
				component: FileTreeDemo,
			},
			{
				id: 'carousel',
				label: 'Carousel',
				icon: 'lucide:gallery-horizontal',
				component: CarouselDemo,
			},
		],
	},
]

const activeTabId = ref('button')

const activeComponent = computed(() => {
	for (const cat of categories) {
		const found = cat.items.find((t) => t.id === activeTabId.value)
		if (found) return found.component
	}
	return null
})
</script>

<template>
	<div
		class="min-h-screen bg-body text-gray-900 flex flex-col md:flex-row transition-colors duration-300">
		<!-- Sidebar Navigation -->
		<aside
			class="max-md:hidden w-full md:w-64! bg-gray-50 border-r border-border flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0 overflow-y-auto">
			<div
				class="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-gray-50 z-10">
				<div
					class="flex items-center gap-2 font-bold text-xl tracking-tight">
					<div
						class="w-8 h-8 bg-primary text-primary-fg rounded-lg flex items-center justify-center">
						<Icon
							icon="lucide:box"
							class="w-5 h-5" />
					</div>
					Builto
				</div>
				<ThemeToggle />
			</div>

			<nav class="p-4 space-y-6 flex-1">
				<div
					v-for="cat in categories"
					:key="cat.name"
					class="space-y-1">
					<h4
						class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
						{{ cat.name }}
					</h4>
					<button
						v-for="item in cat.items"
						:key="item.id"
						@click="activeTabId = item.id"
						class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors"
						:class="
							activeTabId === item.id
								? 'bg-white text-primary shadow-sm ring-1 ring-border'
								: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
						">
						<Icon
							:icon="item.icon"
							class="w-4 h-4"
							:class="
								activeTabId === item.id
									? 'text-primary'
									: 'text-gray-400'
							" />
						{{ item.label }}
					</button>
				</div>
			</nav>

			<div class="p-4 border-t border-border">
				<div
					class="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
					<h4
						class="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
						Playground
					</h4>
					<p class="text-xs text-blue-700">
						Explore and test components in an isolated environment.
					</p>
				</div>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 min-w-0 overflow-y-auto h-screen">
			<div class="max-w-5xl mx-auto px-6 py-10 md:py-12">
				<!-- Header -->
				<div
					class="mb-10 pb-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1
							class="text-3xl font-bold tracking-tight text-gray-900 mb-2">
							Component Playground
						</h1>
						<p class="text-gray-500">
							A comprehensive suite of UI components built for
							speed and consistency.
						</p>
					</div>
					<div class="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							icon="lucide:github"
							>Documentation</Button
						>
						<Button
							variant="primary"
							size="sm"
							icon="lucide:download"
							>Export</Button
						>
					</div>
				</div>

				<!-- Dynamic Component View -->
				<Transition
					mode="out-in"
					enter-active-class="transition duration-200 ease-out"
					enter-from-class="opacity-0 translate-y-2"
					enter-to-class="opacity-100 translate-y-0"
					leave-active-class="transition duration-150 ease-in"
					leave-from-class="opacity-100 translate-y-0"
					leave-to-class="opacity-0 translate-y-2">
					<component :is="activeComponent" />
				</Transition>
			</div>
		</main>
	</div>
</template>
