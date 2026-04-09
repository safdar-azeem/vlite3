import type { SkeletonResult, SnapshotConfig, Bone } from './types'

const DEFAULT_LEAF_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th'])

/**
 * Snapshot the exact visual layout of a rendered DOM element as skeleton bones.
 */
export function snapshotBones(
  el: Element,
  name: string = 'component',
  config?: SnapshotConfig
): SkeletonResult {
  const rootRect = el.getBoundingClientRect()
  const bones: Bone[] = []

  const leafTags = config?.leafTags
    ? new Set([...DEFAULT_LEAF_TAGS, ...config.leafTags])
    : DEFAULT_LEAF_TAGS
  const captureRoundedBorders = config?.captureRoundedBorders ?? true
  const excludeTags = config?.excludeTags ? new Set(config.excludeTags) : null
  const excludeSelectors = config?.excludeSelectors ?? null

  function parseBorderRadius(
    style: CSSStyleDeclaration,
    rect: DOMRect | null
  ): number | string | undefined {
    const tl = parseFloat(style.borderTopLeftRadius) || 0
    const tr = parseFloat(style.borderTopRightRadius) || 0
    const br = parseFloat(style.borderBottomRightRadius) || 0
    const bl = parseFloat(style.borderBottomLeftRadius) || 0

    if (tl === 0 && tr === 0 && br === 0 && bl === 0) return undefined

    // 🚀 PERFORMANCE: Use pre-calculated DOMRect instead of forcing synchronous reflow via getBoundingClientRect()
    const isSquarish = rect
      ? (() => {
          return rect.width > 0 && rect.height > 0 && Math.abs(rect.width - rect.height) < 4
        })()
      : false

    if (style.borderRadius === '50%') return '50%'

    const maxCorner = Math.max(tl, tr, br, bl)
    if (maxCorner > 9998) {
      return isSquarish ? '50%' : 9999
    }

    if (tl === tr && tr === br && br === bl) {
      return tl !== 8 ? tl : undefined
    }

    return `${tl}px ${tr}px ${br}px ${bl}px`
  }

  function walk(node: Element, computedStyle?: CSSStyleDeclaration): void {
    const style = computedStyle || window.getComputedStyle(node)
    const isHidden =
      style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0'

    // Skip hidden elements, unless it's our fixture wrapper
    if (isHidden && !node.hasAttribute('data-boneyard-fixture')) return

    const tag = node.tagName.toLowerCase()

    if (excludeTags?.has(tag)) return
    if (excludeSelectors?.some((sel) => node.matches(sel))) return

    const childNodes = Array.from(node.children)
    const childStyles: CSSStyleDeclaration[] = []
    let visibleChildCount = 0

    for (let i = 0; i < childNodes.length; i++) {
      const cs = window.getComputedStyle(childNodes[i])
      childStyles.push(cs)
      if (cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0') {
        visibleChildCount++
      }
    }

    const isMedia = tag === 'img' || tag === 'svg' || tag === 'video' || tag === 'canvas'
    const isFormEl = tag === 'input' || tag === 'button' || tag === 'textarea' || tag === 'select'
    const isLeaf = visibleChildCount === 0 || isMedia || isFormEl || leafTags.has(tag)

    const bg = style.backgroundColor
    const hasBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
    const hasBgImage = style.backgroundImage !== 'none'
    const borderTopWidth = parseFloat(style.borderTopWidth) || 0
    const hasBorder =
      captureRoundedBorders &&
      borderTopWidth > 0 &&
      style.borderTopColor !== 'rgba(0, 0, 0, 0)' &&
      style.borderTopColor !== 'transparent'
    const hasBorderRadius = (parseFloat(style.borderTopLeftRadius) || 0) > 0
    const hasVisualSurface = hasBg || hasBgImage || (hasBorder && hasBorderRadius)

    const isTableNode =
      tag === 'tr' ||
      tag === 'td' ||
      tag === 'th' ||
      tag === 'thead' ||
      tag === 'tbody' ||
      tag === 'table'

    let nodeRect: DOMRect | null = null // 🚀 PERFORMANCE: Cache bounding rect to prevent multiple reflows per node

    if (isLeaf) {
      nodeRect = node.getBoundingClientRect()
      if (nodeRect.width < 1 || nodeRect.height < 1) return
      const rw = rootRect.width

      // 🎯 IMPROVEMENT: Handle text elements by creating line-by-line bones with proper gaps
      // Exclude tables, media, forms, and elements with visual backgrounds (like badges)
      const isTextLeaf =
        !isTableNode &&
        !isMedia &&
        !isFormEl &&
        !hasVisualSurface &&
        (leafTags.has(tag) || (node.textContent?.trim().length || 0) > 0)

      if (isTextLeaf) {
        const fontSize = parseFloat(style.fontSize) || 16
        let lh = parseFloat(style.lineHeight)

        // ComputedStyle returns "normal" as a string if not set, which parses to NaN.
        if (isNaN(lh)) lh = fontSize * 1.5

        let lines = Math.round(nodeRect.height / lh)
        if (lines < 1) lines = 1

        for (let i = 0; i < lines; i++) {
          const isLastLine = i === lines - 1
          let lineW = nodeRect.width

          // Make the last line of a multi-line paragraph 70% width to mimic ragged text
          if (lines > 1 && isLastLine) {
            lineW = nodeRect.width * 0.7
          }

          // Shrink the actual bone height by 70% to create a 30% natural margin between lines
          const boneH = lh * 0.7
          const boneY = nodeRect.top - rootRect.top + i * lh + lh * 0.15
          const br = 4 // Standard small radius for text lines

          bones.push({
            x: rw > 0 ? +(((nodeRect.left - rootRect.left) / rw) * 100).toFixed(4) : 0,
            y: Math.round(boneY),
            w: rw > 0 ? +((lineW / rw) * 100).toFixed(4) : 0,
            h: Math.round(boneH),
            r: br,
          })
        }
        return
      }

      // Standard leaf (image, button, icon, table cell, etc.)
      const isSquarish =
        isMedia &&
        nodeRect.width > 0 &&
        nodeRect.height > 0 &&
        Math.abs(nodeRect.width - nodeRect.height) < 4
      const br = isTableNode ? 0 : isSquarish ? '50%' : (parseBorderRadius(style, nodeRect) ?? 8)

      bones.push({
        x: rw > 0 ? +(((nodeRect.left - rootRect.left) / rw) * 100).toFixed(4) : 0,
        y: Math.round(nodeRect.top - rootRect.top),
        w: rw > 0 ? +((nodeRect.width / rw) * 100).toFixed(4) : 0,
        h: Math.round(nodeRect.height),
        r: br,
      })
      return
    }

    if (hasVisualSurface && !node.hasAttribute('data-boneyard-fixture')) {
      nodeRect = node.getBoundingClientRect()
      if (nodeRect.width >= 1 && nodeRect.height >= 1) {
        const br = isTableNode ? 0 : (parseBorderRadius(style, nodeRect) ?? 8)
        const rw = rootRect.width
        bones.push({
          x: rw > 0 ? +(((nodeRect.left - rootRect.left) / rw) * 100).toFixed(4) : 0,
          y: Math.round(nodeRect.top - rootRect.top),
          w: rw > 0 ? +((nodeRect.width / rw) * 100).toFixed(4) : 0,
          h: Math.round(nodeRect.height),
          r: br,
          c: true,
        })
      }
    }

    for (let i = 0; i < childNodes.length; i++) {
      walk(childNodes[i], childStyles[i])
    }
  }

  for (const child of Array.from(el.children)) {
    walk(child)
  }

  return {
    name,
    viewportWidth: Math.round(rootRect.width),
    width: Math.round(rootRect.width),
    height: Math.round(rootRect.height),
    bones,
  }
}
