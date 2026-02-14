<script setup lang="ts">
import GroupPersonal from './grouped/GroupPersonal.vue'
import GroupAddress from './grouped/GroupAddress.vue'
import GroupPreferences from './grouped/GroupPreferences.vue'
</script>

<template>
  <div class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold mb-2">Grouped Forms</h3>
      <p class="text-sm text-gray-500 mb-6">
        Multiple form sections handled independently or together.
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GroupPersonal />
        <GroupAddress />
        <GroupPreferences />
      </div>
    </div>
  </div>
</template>
