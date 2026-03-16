import { ref, computed } from 'vue'

let dropdownCount = 0

export function useDropdownIds() {
  const id = ++dropdownCount
  const dropdownId = ref(`vlite-dropdown-${id}`)
  const menuId = ref(`vlite-dropdown-menu-${id}`)
  
  const childIds = ref<Set<string>>(new Set())

  const registerChildId = (id: string) => {
    childIds.value.add(id)
  }

  const unregisterChildId = (id: string) => {
    childIds.value.delete(id)
  }

  const allChildIds = computed(() => Array.from(childIds.value))

  return {
    dropdownId,
    menuId,
    registerChildId,
    unregisterChildId,
    allChildIds
  }
}
