import { createRouter, createWebHistory } from 'vue-router'
import Playground from '../playground/Playground.vue'

// Core
import ButtonDemo from '../playground/demos/ButtonDemo.vue'
import ButtonGroupDemo from '../playground/demos/ButtonGroupDemo.vue'
import BadgeDemo from '../playground/demos/BadgeDemo.vue'
import ChipDemo from '../playground/demos/ChipDemo.vue'
import AvatarDemo from '../playground/demos/AvatarDemo.vue'
import AvatarUploaderDemo from '../playground/demos/AvatarUploaderDemo.vue'
import AvatarGroupDemo from '../playground/demos/AvatarGroupDemo.vue'
import ProgressBarDemo from '../playground/demos/ProgressBarDemo.vue'

// Forms
import InputDemo from '../playground/demos/InputDemo.vue'
import OTPInputDemo from '../playground/demos/OTPInputDemo.vue'
import NumberInputDemo from '../playground/demos/NumberInputDemo.vue'
import MultiSelectDemo from '../playground/demos/MultiSelectDemo.vue'
import ChoiceBoxDemo from '../playground/demos/ChoiceBoxDemo.vue'
import FilePickerDemo from '../playground/demos/FilePickerDemo.vue'
import ThumbnailSelectorDemo from '../playground/demos/ThumbnailSelectorDemo.vue'
import TextareaDemo from '../playground/demos/TextareaDemo.vue'
import CheckBoxDemo from '../playground/demos/CheckBoxDemo.vue'
import SwitchDemo from '../playground/demos/SwitchDemo.vue'
import SliderDemo from '../playground/demos/SliderDemo.vue'
import ColorPickerDemo from '../playground/demos/ColorPickerDemo.vue'
import IconPickerDemo from '../playground/demos/IconPickerDemo.vue'
import DatePickerDemo from '../playground/demos/DatePickerDemo.vue'
import DateRangePickerDemo from '../playground/demos/DateRangePickerDemo.vue'
import FormDemo from '../playground/demos/FormDemo.vue'
import ChatDemo from '../playground/demos/ChatDemo.vue'

// Feedback / Overlays
import AlertDemo from '../playground/demos/AlertDemo.vue'
import ModalDemo from '../playground/demos/ModalDemo.vue'
import SidePanelDemo from '../playground/demos/SidePanelDemo.vue'
import DropdownDemo from '../playground/demos/DropdownDemo.vue'
import TooltipDemo from '../playground/demos/TooltipDemo.vue'
import ToastDemo from '../playground/demos/ToastDemo.vue'
import SpinnerDemo from '../playground/demos/SpinnerDemo.vue'
import ScrollRevealDemo from '../playground/demos/ScrollRevealDemo.vue'
import AttachmentsDemo from '../playground/demos/AttachmentsDemo.vue'

// Navigation / Data
import AccordionDemo from '../playground/demos/AccordionDemo.vue'
import NavbarDemo from '../playground/demos/NavbarDemo.vue'
import CommandPaletteDemo from '../playground/demos/CommandPaletteDemo.vue'
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
import CategoryManagerDemo from '../playground/demos/CategoryManagerDemo.vue'
import DataListDemo from '../playground/demos/DataListDemo.vue'
import ListDemo from '../playground/demos/ListDemo.vue'
import ScreenDemo from '../playground/demos/ScreenDemo.vue'
import BarcodeDemo from '../playground/demos/BarcodeDemo.vue'
import QRCodeDemo from '../playground/demos/QRCodeDemo.vue'
import StatsDemo from '../playground/demos/StatsDemo.vue'
import StatusChipDemo from '../playground/demos/StatusChipDemo.vue'
import ExportDataDemo from '../playground/demos/ExportDataDemo.vue'
import ImportDataDemo from '../playground/demos/ImportDataDemo.vue'
import PriceDemo from '../playground/demos/PriceDemo.vue'
import DateTimeDemo from '../playground/demos/DateTimeDemo.vue'
import ClockDemo from '../playground/demos/ClockDemo.vue'
import EmptyDemo from '../playground/demos/EmptyDemo.vue'
import GoogleLoginDemo from '../playground/GoogleLoginDemo.vue'
import I18nDemo from '../playground/demos/I18nDemo.vue'
import CustomFieldsDisplayDemo from '../playground/demos/CustomFieldsDisplayDemo.vue'
import InvoiceDemo from '../playground/demos/InvoiceDemo.vue'

const routes = [
  {
    path: '/',
    component: Playground,
    redirect: '/button',
    children: [
      { path: 'button', component: ButtonDemo },
      { path: 'buttongroup', component: ButtonGroupDemo },
      { path: 'badge', component: BadgeDemo },
      { path: 'chip', component: ChipDemo },
      { path: 'avatar', component: AvatarDemo },
      { path: 'avatar-uploader', component: AvatarUploaderDemo },
      { path: 'avatargroup', component: AvatarGroupDemo },
      { path: 'progressbar', component: ProgressBarDemo },
      { path: 'input', component: InputDemo },
      { path: 'otpinput', component: OTPInputDemo },
      { path: 'numberinput', component: NumberInputDemo },
      { path: 'multiselect', component: MultiSelectDemo },
      { path: 'choicebox', component: ChoiceBoxDemo },
      { path: 'filepicker', component: FilePickerDemo },
      { path: 'thumbnail-selector', component: ThumbnailSelectorDemo },
      { path: 'textarea', component: TextareaDemo },
      { path: 'checkbox', component: CheckBoxDemo },
      { path: 'switch', component: SwitchDemo },
      { path: 'slider', component: SliderDemo },
      { path: 'colorpicker', component: ColorPickerDemo },
      { path: 'iconpicker', component: IconPickerDemo },
      { path: 'datepicker', component: DatePickerDemo },
      { path: 'daterangepicker', component: DateRangePickerDemo },
      { path: 'form', component: FormDemo },
      { path: 'chat', component: ChatDemo },
      { path: 'googlelogin', component: GoogleLoginDemo },
      { path: 'alert', component: AlertDemo },
      { path: 'modal', component: ModalDemo },
      { path: 'sidepanel', component: SidePanelDemo },
      { path: 'dropdown', component: DropdownDemo },
      { path: 'tooltip', component: TooltipDemo },
      { path: 'toast', component: ToastDemo },
      { path: 'spinner', component: SpinnerDemo },
      { path: 'scroll-reveal', component: ScrollRevealDemo },
      { path: 'attachments', component: AttachmentsDemo },
      { path: 'accordion', component: AccordionDemo },
      { path: 'navbar', component: NavbarDemo },
      { path: 'commandpalette', component: CommandPaletteDemo },
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
      { path: 'categorymanager', component: CategoryManagerDemo },
      { path: 'barcode', component: BarcodeDemo },
      { path: 'qrcode', component: QRCodeDemo },
      { path: 'stats', component: StatsDemo },
      { path: 'statuschip', component: StatusChipDemo },
      { path: 'list', component: ListDemo },
      { path: 'export-data', component: ExportDataDemo },
      { path: 'import-data', component: ImportDataDemo },
      { path: 'price', component: PriceDemo },
      { path: 'datetime', component: DateTimeDemo },
      { path: 'clock', component: ClockDemo },
      { path: 'empty', component: EmptyDemo },
      { path: 'i18n', component: I18nDemo },
      { path: 'customfieldsdisplay', component: CustomFieldsDisplayDemo },
      { path: 'invoice', component: InvoiceDemo },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
