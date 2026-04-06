import { shallowRef, ref, nextTick, type Ref, type ComponentPublicInstance } from 'vue'

export interface EditorContext {
  editorRef: Ref<HTMLDivElement | null>
  rootRef: Ref<HTMLDivElement | null>
  linkPopoverElRef: Ref<HTMLElement | ComponentPublicInstance | null>
  callbacks: {
    restoreSelection: () => void
    onInput: () => void
  }
}

export function useRichTextLinks(ctx: EditorContext) {
  const linkPopover = shallowRef({
    visible: false,
    x: 0,
    y: 0,
    url: '',
    isEditing: false,
  })

  let pendingLinkRange: Range | null = null
  let skipLinkAutoOpen = false

  function getAnchorAtSelection(sel?: Selection | null): HTMLAnchorElement | null {
    const s = sel ?? window.getSelection()
    if (!s || s.rangeCount === 0) return null
    const node = s.anchorNode
    const el = node instanceof Element ? node : node?.parentElement
    const a = el?.closest('a')
    return a && ctx.editorRef.value?.contains(a) ? (a as HTMLAnchorElement) : null
  }

  function checkLinkAtCursor(): void {
    if (skipLinkAutoOpen || !ctx.editorRef.value?.contains(document.activeElement)) return
    const a = getAnchorAtSelection()
    if (a) {
      const url = a.href || a.getAttribute('href') || ''
      const rect = a.getBoundingClientRect()
      openLinkPopoverBase(url, true, rect)
    } else if (linkPopover.value.visible && linkPopover.value.isEditing) {
      closeLinkPopover()
    }
  }

  function resolvePopoverPos(targetRect: DOMRect): void {
    const root = ctx.rootRef.value
    // Handle both generic HTMLElement and Vue ComponentPublicInstance
    const pop = (ctx.linkPopoverElRef.value as ComponentPublicInstance)?.$el ?? ctx.linkPopoverElRef.value
    if (!root || !pop) return

    const rootRect = root.getBoundingClientRect()
    const popRect = pop.getBoundingClientRect()

    const xLeftBorder = 8
    const xRightBorder = rootRect.width - popRect.width - 8
    const targetCenterX = (targetRect.left - rootRect.left) + (targetRect.width / 2)
    let popX = targetCenterX - (popRect.width / 2)
    popX = Math.max(xLeftBorder, Math.min(popX, xRightBorder))

    const spacing = 8
    let popY = (targetRect.bottom - rootRect.top) + spacing
    if (rootRect.top + popY + popRect.height > window.innerHeight) {
      popY = (targetRect.top - rootRect.top) - popRect.height - spacing
    }

    linkPopover.value = { ...linkPopover.value, x: popX, y: popY }
  }

  function openLinkPopoverBase(url: string, isEditing: boolean, rect: DOMRect): void {
    linkPopover.value = {
      visible: true,
      x: linkPopover.value.x,
      y: linkPopover.value.y,
      url,
      isEditing,
    }
    nextTick(() => resolvePopoverPos(rect))
  }

  function openLinkPopover(): void {
    if (linkPopover.value.visible) return
    const a = getAnchorAtSelection()
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      if (!a) return
    }

    pendingLinkRange = sel ? sel.getRangeAt(0).cloneRange() : null
    let targetRect: DOMRect
    if (a) {
      targetRect = a.getBoundingClientRect()
    } else {
      targetRect = pendingLinkRange!.getBoundingClientRect()
    }

    const initialUrl = a ? (a.href || a.getAttribute('href') || '') : ''
    openLinkPopoverBase(initialUrl, !!a, targetRect)
  }

  function applyLink(urlVal?: string): void {
    let finalUrl = (urlVal ?? linkPopover.value.url).trim()
    if (!finalUrl) {
      unlinkCurrent()
      return
    }
    // Auto-prefix http:// if no protocol and not an internal anchor/mailto
    if (!/^https?:\/\//i.test(finalUrl) && !/^(mailto:|tel:|#|\/)/i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`
    }

    const a = getAnchorAtSelection()
    if (a) {
      a.href = finalUrl
      if (!finalUrl.startsWith('#') && !finalUrl.startsWith('/')) {
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
      }
      ctx.callbacks.onInput()
    } else if (pendingLinkRange) {
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(pendingLinkRange)
      ctx.editorRef.value?.focus()
      document.execCommand('createLink', false, finalUrl)
      
      const walker = document.createTreeWalker(
        ctx.editorRef.value!,
        NodeFilter.SHOW_ELEMENT,
        { acceptNode: (n) => (n as Element).tagName === 'A' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP },
      )
      let node: Node | null
      while ((node = walker.nextNode())) {
        const aNode = node as HTMLAnchorElement
        if (aNode.href === finalUrl || aNode.getAttribute('href') === finalUrl) {
          aNode.target = '_blank'
          aNode.rel = 'noopener noreferrer'
        }
      }
      ctx.callbacks.onInput()
    }

    const sel = window.getSelection()
    sel?.collapseToEnd()

    skipLinkAutoOpen = true
    closeLinkPopover()
    setTimeout(() => { skipLinkAutoOpen = false }, 200)
  }

  function unlinkCurrent(): void {
    const a = getAnchorAtSelection()
    if (a) {
      const range = document.createRange()
      range.selectNodeContents(a)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    } else {
      ctx.callbacks.restoreSelection()
    }
    ctx.editorRef.value?.focus()
    document.execCommand('unlink', false, undefined)
    ctx.callbacks.onInput()
    closeLinkPopover()
  }

  function openLinkInTab(urlVal?: string): void {
    const url = (urlVal ?? linkPopover.value.url).trim()
    if (!url) return
    const href = url.includes('://') ? url : `https://${url}`
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  function closeLinkPopover(): void {
    if (!linkPopover.value.visible) return
    linkPopover.value = { ...linkPopover.value, visible: false }
    pendingLinkRange = null
  }

  function updateUrl(url: string) {
    linkPopover.value.url = url
  }

  return {
    linkPopover,
    checkLinkAtCursor,
    openLinkPopover,
    applyLink,
    unlinkCurrent,
    openLinkInTab,
    closeLinkPopover,
    updateUrl
  }
}
