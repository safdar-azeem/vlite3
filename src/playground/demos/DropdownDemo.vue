<script setup lang="ts">
import DropdownBasic from './dropdown/DropdownBasic.vue'
import DropdownScrollable from './dropdown/DropdownScrollable.vue'
import DropdownVariants from './dropdown/DropdownVariants.vue'
import DropdownCustomSlot from './dropdown/CustomSlot.vue'
import DropdownRichOptions from './dropdown/RichOptions.vue'
import DropdownNested from './dropdown/Nested.vue'
import DropdownRecursive from './dropdown/Recursive.vue'
import DropdownDirection from './dropdown/Direction.vue'
import DropdownMegaMenu from './dropdown/MegaMenu.vue'
import DropdownPagination from './dropdown/Pagination.vue'
import DropdownRemoteSearch from './dropdown/RemoteSearch.vue'
import DropdownStickySlots from './dropdown/StickySlots.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Dropdown</h2>
      <p class="text-gray-500">Displays a list of options for the user to pick from.</p>
    </div>

    <DropdownBasic />
    <DropdownScrollable />
    <DropdownVariants />
    <DropdownCustomSlot />
    <DropdownRichOptions />
    <DropdownNested />
    <DropdownRecursive />
    <DropdownDirection />
    <DropdownMegaMenu />
    <DropdownPagination />
    <DropdownRemoteSearch />
    <DropdownStickySlots />
  </div>
</template>
