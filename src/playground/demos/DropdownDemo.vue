<script setup lang="ts">
import Basic from './dropdown/Basic.vue'
import Scrollable from './dropdown/Scrollable.vue'
import CustomSlot from './dropdown/CustomSlot.vue'
import RichOptions from './dropdown/RichOptions.vue'
import Nested from './dropdown/Nested.vue'
import Recursive from './dropdown/Recursive.vue'
import Direction from './dropdown/Direction.vue'
import MegaMenu from './dropdown/MegaMenu.vue'
import Pagination from './dropdown/Pagination.vue'
import RemoteSearch from './dropdown/RemoteSearch.vue'
import StickySlots from './dropdown/StickySlots.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Dropdown</h2>
      <p class="text-gray-500">Displays a list of options for the user to pick from.</p>
    </div>

    <Basic />
    <Scrollable />
    <CustomSlot />
    <RichOptions />
    <Nested />
    <Recursive />
    <Direction />
    <MegaMenu />
    <Pagination />
    <RemoteSearch />
    <StickySlots />
  </div>
</template>
