<script setup lang="ts">
import ModalForm from './modal/ModalForm.vue'
import ModalBasic from './modal/ModalBasic.vue'
import ModalScrollable from './modal/ModalScrollable.vue'
import ModalLazy from './modal/ModalLazy.vue'
import ModalConfirmation from './modal/ModalConfirmation.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Modal</h2>
      <p class="text-gray-500">Dialogs that interrupt user flow for critical actions or info.</p>
    </div>

    <ModalForm />
    <ModalBasic />
    <ModalScrollable />
    <ModalLazy />
    <ModalConfirmation />
  </div>
</template>
