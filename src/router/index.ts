import { createRouter, createWebHistory } from 'vue-router'
import Playground from '../playground/Playground.vue'

// Core
import ButtonDemo from '../playground/demos/ButtonDemo.vue'
import ButtonGroupDemo from '../playground/demos/ButtonGroupDemo.vue'
import BadgeDemo from '../playground/demos/BadgeDemo.vue'
import ChipDemo from '../playground/demos/ChipDemo.vue'
import AvatarDemo from '../playground/demos/AvatarDemo.vue'
import AvatarUploaderDemo from '../playground/demos/AvatarUploaderDemo.vue'
import ProgressBarDemo from '../playground/demos/ProgressBarDemo.vue'

// Forms
import InputDemo from '../playground/demos/InputDemo.vue'
import OTPInputDemo from '../playground/demos/OTPInputDemo.vue'
import NumberInputDemo from '../playground/demos/NumberInputDemo.vue'
import MultiSelectDemo from '../playground/demos/MultiSelectDemo.vue'
import ChoiceBoxDemo from '../playground/demos/ChoiceBoxDemo.vue'
import FilePickerDemo from '../playground/demos/FilePickerDemo.vue'
import TextareaDemo from '../playground/demos/TextareaDemo.vue'
import CheckBoxDemo from '../playground/demos/CheckBoxDemo.vue'
import SwitchDemo from '../playground/demos/SwitchDemo.vue'
import SliderDemo from '../playground/demos/SliderDemo.vue'
import ColorPickerDemo from '../playground/demos/ColorPickerDemo.vue'
import IconPickerDemo from '../playground/demos/IconPickerDemo.vue'
import DatePickerDemo from '../playground/demos/DatePickerDemo.vue'
import FormDemo from '../playground/demos/FormDemo.vue'

// Feedback / Overlays
import AlertDemo from '../playground/demos/AlertDemo.vue'
import ModalDemo from '../playground/demos/ModalDemo.vue'
import SidePanelDemo from '../playground/demos/SidePanelDemo.vue'
import DropdownDemo from '../playground/demos/DropdownDemo.vue'
import TooltipDemo from '../playground/demos/TooltipDemo.vue'
import ToastDemo from '../playground/demos/ToastDemo.vue'
import SpinnerDemo from '../playground/demos/SpinnerDemo.vue'
import ScrollRevealDemo from '../playground/demos/ScrollRevealDemo.vue'

// Navigation / Data
import AccordionDemo from '../playground/demos/AccordionDemo.vue'
import NavbarDemo from '../playground/demos/NavbarDemo.vue'
import TimelineDemo from '../playground/demos/TimelineDemo.vue'
import PaginationDemo from '../playground/demos/PaginationDemo.vue'
import LabelDemo from '../playground/demos/LabelDemo.vue'
import ThemeToggleDemo from '../playground/demos/ThemeToggleDemo.vue'
import SidebarMenuDemo from '../playground/demos/SidebarMenuDemo.vue'
import WorkbookDemo from '../playground/demos/WorkbookDemo.vue'
import TabesDemo from '../playground/demos/TabesDemo.vue'
import MasonryDemo from '../playground/demos/MasonryDemo.vue'
import ColorsDemo from '../playground/demos/ColorsDemo.vue'
import PricingPlanDemo from '../playground/demos/PricingPlanDemo.vue'
import HeatmapDemo from '../playground/demos/HeatmapDemo.vue'
import FileTreeDemo from '../playground/demos/FileTreeDemo.vue'
import DataTableDemo from '../playground/demos/DataTableDemo.vue'
import CarouselDemo from '../playground/demos/CarouselDemo.vue'
import KanbanDemo from '../playground/demos/KanbanDemo.vue'
import DataListDemo from '../playground/demos/DataListDemo.vue'
import ScreenDemo from '../playground/demos/ScreenDemo.vue'

import GoogleLoginDemo from '../playground/GoogleLoginDemo.vue'

const routes = [
  {
    path: '/',
    component: Playground,
    redirect: '/button',
    children: [
      // Core
      { path: 'button', component: ButtonDemo },
      { path: 'buttongroup', component: ButtonGroupDemo },
      { path: 'badge', component: BadgeDemo },
      { path: 'chip', component: ChipDemo },
      { path: 'avatar', component: AvatarDemo },
      { path: 'avatar-uploader', component: AvatarUploaderDemo },
      { path: 'progressbar', component: ProgressBarDemo },

      // Forms
      { path: 'input', component: InputDemo },
      { path: 'otpinput', component: OTPInputDemo },
      { path: 'numberinput', component: NumberInputDemo },
      { path: 'multiselect', component: MultiSelectDemo },
      { path: 'choicebox', component: ChoiceBoxDemo },
      { path: 'filepicker', component: FilePickerDemo },
      { path: 'textarea', component: TextareaDemo },
      { path: 'checkbox', component: CheckBoxDemo },
      { path: 'switch', component: SwitchDemo },
      { path: 'slider', component: SliderDemo },
      { path: 'colorpicker', component: ColorPickerDemo },
      { path: 'iconpicker', component: IconPickerDemo },
      { path: 'datepicker', component: DatePickerDemo },
      { path: 'form', component: FormDemo },
      { path: 'googlelogin', component: GoogleLoginDemo },

      // Feedback / Overlays
      { path: 'alert', component: AlertDemo },
      { path: 'modal', component: ModalDemo },
      { path: 'sidepanel', component: SidePanelDemo },
      { path: 'dropdown', component: DropdownDemo },
      { path: 'tooltip', component: TooltipDemo },
      { path: 'toast', component: ToastDemo },
      { path: 'spinner', component: SpinnerDemo },
      { path: 'scroll-reveal', component: ScrollRevealDemo },

      // Navigation / Data
      { path: 'accordion', component: AccordionDemo },
      { path: 'navbar', component: NavbarDemo },
      { path: 'timeline', component: TimelineDemo },
      { path: 'pagination', component: PaginationDemo },
      { path: 'label', component: LabelDemo },
      { path: 'themetoggle', component: ThemeToggleDemo },
      { path: 'sidebarmenu', component: SidebarMenuDemo },
      { path: 'workbook', component: WorkbookDemo },
      { path: 'tabes', component: TabesDemo },
      { path: 'masonry', component: MasonryDemo },
      { path: 'colors', component: ColorsDemo },
      { path: 'pricing', component: PricingPlanDemo },
      { path: 'heatmap', component: HeatmapDemo },
      { path: 'filetree', component: FileTreeDemo },
      { path: 'datatable', component: DataTableDemo },
      { path: 'datalist', component: DataListDemo },
      { path: 'screen', component: ScreenDemo },
      { path: 'carousel', component: CarouselDemo },
      { path: 'kanban', component: KanbanDemo },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
