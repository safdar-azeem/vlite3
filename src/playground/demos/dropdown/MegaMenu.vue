<script setup lang="ts">
import { ref } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './MegaMenu.vue?raw'

const val1 = ref('1')

const megaMenuOptions = [
  {
    label: 'Electronics',
    icon: 'lucide:cpu',
    children: [
      { label: 'Computers', value: 'computers' },
      { label: 'Phones', value: 'phones' },
      { label: 'Tablets', value: 'tablets' },
      {
        label: 'Accessories',
        value: 'acc',
        children: [
          { label: 'Chargers', value: 'chargers' },
          { label: 'Cases', value: 'cases' },
        ],
      },
    ],
  },
  {
    label: 'Clothing',
    icon: 'lucide:shirt',
    children: [
      { label: 'Men', value: 'men' },
      { label: 'Women', value: 'women' },
      { label: 'Kids', value: 'kids' },
      { label: 'Shoes', value: 'shoes' },
    ],
  },
  {
    label: 'Home & Garden',
    icon: 'lucide:home',
    children: [
      { label: 'Furniture', value: 'furniture' },
      { label: 'Kitchen', value: 'kitchen' },
      { label: 'Lighting', value: 'lighting' },
      { label: 'Decor', value: 'decor' },
    ],
  },
]
</script>

<template>
  <DemoSection title="Mega Menu (Grouped Layout)" :code="sourceCode">
    <p class="text-sm text-gray-500 mb-4">
      Displays a flattened, grouped view suitable for navigational menus. using
      <code>layout="grouped"</code>.
    </p>

    <Dropdown
      :options="megaMenuOptions"
      layout="grouped"
      closeOnSelect
      :columns="3"
      :searchable="false"
      width="w-[600px]"
      :selected="val1"
      @on-select="(opt) => (val1 = opt.value)">
      <template #trigger>
        <Button variant="outline" icon-right="lucide:chevron-down" class="w-48 justify-between">
          Shop Categories
        </Button>
      </template>
    </Dropdown>
  </DemoSection>
</template>
