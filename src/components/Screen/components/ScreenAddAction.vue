<script setup lang="ts">
import { computed, markRaw } from 'vue'
import Button from '../../Button.vue'
import Modal from '../../Modal.vue'
import { $t } from '@/utils/i18n'
import type { AddBtnConfig } from '../types'

const props = defineProps<{
  canAdd: boolean
  addComponent?: any
  addBtn?: AddBtnConfig
  loading?: boolean
  data?: any[]
  refetch?: any
}>()

const emit = defineEmits<{
  (e: 'add'): void
}>()

const rawAddComponent = computed(() =>
  props.addComponent ? markRaw(props.addComponent as any) : undefined
)
const rawAddModal = computed(() =>
  props.addBtn?.modal ? markRaw(props.addBtn.modal as any) : undefined
)

const getAddBtnLabel = computed(() => {
  if (props.addBtn?.labelI18n) return $t(props.addBtn.labelI18n)
  if (props.addBtn?.label) return props.addBtn.label
  const res = $t('vlite.screen.addNew')
  return res !== 'vlite.screen.addNew' ? res : 'Add New'
})
</script>

<template>
  <component v-if="rawAddComponent" :is="rawAddComponent" />
  <template v-else-if="canAdd">
    <template v-if="addBtn">
      <Modal
        v-if="addBtn.modal"
        :body="rawAddModal"
        v-bind="addBtn.modalProps"
        :refetch="refetch"
        :data="data"
        triggerClass="w-full"
        :loading="loading">
        <template #trigger>
          <Button
            class="w-full"
            :icon="addBtn.icon || 'fluent:add-16-filled'"
            :variant="addBtn.variant || 'primary'"
            v-bind="addBtn.buttonProps">
            {{ getAddBtnLabel }}
          </Button>
        </template>
      </Modal>
      <router-link
        v-else-if="addBtn.to"
        :to="addBtn.to"
        class="inline-flex w-full sm:w-auto">
        <Button
          class="w-full"
          :icon="addBtn.icon || 'fluent:add-16-filled'"
          :variant="addBtn.variant || 'primary'"
          v-bind="addBtn.buttonProps">
          {{ getAddBtnLabel }}
        </Button>
      </router-link>
      <a
        v-else-if="addBtn.href"
        :href="addBtn.href"
        :target="addBtn.target"
        class="inline-flex w-full sm:w-auto">
        <Button
          class="w-full"
          :icon="addBtn.icon || 'fluent:add-16-filled'"
          :variant="addBtn.variant || 'primary'"
          v-bind="addBtn.buttonProps">
          {{ getAddBtnLabel }}
        </Button>
      </a>
      <Button
        v-else
        class="w-full sm:w-auto"
        :icon="addBtn.icon || 'fluent:add-16-filled'"
        :variant="addBtn.variant || 'primary'"
        v-bind="addBtn.buttonProps"
        @click="addBtn.onClick ? addBtn.onClick() : emit('add')">
        {{ getAddBtnLabel }}
      </Button>
    </template>
  </template>
</template>
