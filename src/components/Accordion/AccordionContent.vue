<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})

const beforeEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = '0'
}

const enter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = element.scrollHeight + 'px'
}

const afterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
}

const beforeLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = element.scrollHeight + 'px'
}

const leave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = '0'
}
</script>

<template>
  <Transition
    name="accordion"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave">
    <div class="overflow-hidden text-sm transition-all duration-300 ease-in-out">
      <div :class="['pb-4', props.class]">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: height 0.3s ease-in-out;
}
</style>
