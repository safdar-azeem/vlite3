<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { Empty } from '../../Empty'
import Button from '../../Button.vue'
import Modal from '../../Modal.vue'
import { $t } from '@/utils/i18n'
import type { AddBtnConfig } from '../types'

const props = defineProps<{
  emptyTitle?: string
  emptyTitleI18n?: string
  emptyDescription?: string
  emptyDescriptionI18n?: string
  emptyIcon?: string
  isFiltered: boolean
  canAdd: boolean
  addComponent?: any
  addBtn?: AddBtnConfig
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
  <Empty
    class="py-0.5!"
    :title="emptyTitle"
    :titleI18n="emptyTitleI18n"
    :description="emptyDescription"
    :descriptionI18n="emptyDescriptionI18n"
    :icon="emptyIcon">
    <template #action>
      <template v-if="!isFiltered">
        <component v-if="rawAddComponent" :is="rawAddComponent" />
        <template v-else-if="canAdd">
          <template v-if="addBtn">
            <Modal v-if="addBtn.modal" :body="rawAddModal" v-bind="addBtn.modalProps">
              <template #trigger>
                <Button
                  :icon="addBtn.icon || 'fluent:add-16-filled'"
                  variant="secondary"
                  rounded="full"
                  class="px-6!"
                  v-bind="addBtn.buttonProps">
                  {{ getAddBtnLabel }}
                </Button>
              </template>
            </Modal>
            <router-link v-else-if="addBtn.to" :to="addBtn.to" class="inline-flex">
              <Button
                :icon="addBtn.icon || 'fluent:add-16-filled'"
                variant="secondary"
                v-bind="addBtn.buttonProps">
                {{ getAddBtnLabel }}
              </Button>
            </router-link>

            <a
              v-else-if="addBtn.href"
              :href="addBtn.href"
              :target="addBtn.target"
              class="inline-flex">
              <Button
                :icon="addBtn.icon || 'lucide:plus'"
                variant="secondary"
                v-bind="addBtn.buttonProps">
                {{ getAddBtnLabel }}
              </Button>
            </a>
          </template>
        </template>
      </template>
    </template>
  </Empty>
</template>
