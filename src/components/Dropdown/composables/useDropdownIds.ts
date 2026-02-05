import type { IDropdownOption, IDropdownOptions } from '@/types'

export function useDropdownIds() {
  const getMenuId = (option: IDropdownOption) => {
    if (option.key) return `nested-${option.key}`
    const cleanLabel = option.label ? option.label.replace(/\s+/g, '-').toLowerCase() : 'menu'
    return `nested-${cleanLabel}`
  }

  const getAllRecursiveIds = (options: IDropdownOptions = []): string[] => {
    const ids: string[] = []
    options.forEach((opt) => {
      if (opt.children?.length) {
        const id = getMenuId(opt)
        ids.push(`#${id}`)
        const childIds = getAllRecursiveIds(opt.children)
        ids.push(...childIds)
      }
    })
    return ids
  }

  return {
    getMenuId,
    getAllRecursiveIds,
  }
}
