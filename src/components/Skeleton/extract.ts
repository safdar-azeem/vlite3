import type { SkeletonResult, SnapshotConfig, Bone } from './types'

const DEFAULT_LEAF_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th'])

/**
 * Snapshot the exact visual layout of a rendered DOM element as skeleton bones.
 */
export function snapshotBones(el: Element, name: string = 'component', config?: SnapshotConfig): SkeletonResult {
  const rootRect = el.getBoundingClientRect()
  const bones: Bone[] = []

  const leafTags = config?.leafTags ? new Set([...DEFAULT_LEAF_TAGS, ...config.leafTags]) : DEFAULT_LEAF_TAGS
  const captureRoundedBorders = config?.captureRoundedBorders ?? true
  const excludeTags = config?.excludeTags ? new Set(config.excludeTags) : null
  const excludeSelectors = config?.excludeSelectors ?? null

  function parseBorderRadius(style: CSSStyleDeclaration, node?: Element): number | string | undefined {
    const tl = parseFloat(style.borderTopLeftRadius) || 0
    const tr = parseFloat(style.borderTopRightRadius) || 0
    const br = parseFloat(style.borderBottomRightRadius) || 0
    const bl = parseFloat(style.borderBottomLeftRadius) || 0

    if (tl === 0 && tr === 0 && br === 0 && bl === 0) return undefined

    const isSquarish = node ? (() => {
      const rect = node.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0 && Math.abs(rect.width - rect.height) < 4
    })() : false

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

  function walk(node: Element): void {
    const style = window.getComputedStyle(node)
    const isHidden = style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0'
    
    // Skip hidden elements, unless it's our fixture wrapper
    if (isHidden && !node.hasAttribute('data-boneyard-fixture')) return

    const tag = node.tagName.toLowerCase()

    if (excludeTags?.has(tag)) return
    if (excludeSelectors?.some(sel => node.matches(sel))) return

    const children = Array.from(node.children).filter(child => {
      const cs = window.getComputedStyle(child)
      return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0'
    })

    const isMedia = tag === 'img' || tag === 'svg' || tag === 'video' || tag === 'canvas'
    const isFormEl = tag === 'input' || tag === 'button' || tag === 'textarea' || tag === 'select'
    const isLeaf = children.length === 0 || isMedia || isFormEl || leafTags.has(tag)

    const bg = style.backgroundColor
    const hasBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
    const hasBgImage = style.backgroundImage !== 'none'
    const borderTopWidth = parseFloat(style.borderTopWidth) || 0
    const hasBorder = captureRoundedBorders && borderTopWidth > 0 && style.borderTopColor !== 'rgba(0, 0, 0, 0)' && style.borderTopColor !== 'transparent'
    const hasBorderRadius = (parseFloat(style.borderTopLeftRadius) || 0) > 0
    const hasVisualSurface = hasBg || hasBgImage || (hasBorder && hasBorderRadius)

    const isTableNode = tag === 'tr' || tag === 'td' || tag === 'th' || tag === 'thead' || tag === 'tbody' || tag === 'table'

    if (isLeaf) {
      const rect = node.getBoundingClientRect()
      if (rect.width < 1 || rect.height < 1) return
      const rw = rootRect.width

      // 🎯 IMPROVEMENT: Handle text elements by creating line-by-line bones with proper gaps
      // Exclude tables, media, forms, and elements with visual backgrounds (like badges)
      const isTextLeaf = !isTableNode && !isMedia && !isFormEl && !hasVisualSurface && (leafTags.has(tag) || (node.textContent?.trim().length || 0) > 0)

      if (isTextLeaf) {
        const fontSize = parseFloat(style.fontSize) || 16
        let lh = parseFloat(style.lineHeight)
        
        // ComputedStyle returns "normal" as a string if not set, which parses to NaN.
        if (isNaN(lh)) lh = fontSize * 1.5

        let lines = Math.round(rect.height / lh)
        if (lines < 1) lines = 1

        for (let i = 0; i < lines; i++) {
          const isLastLine = i === lines - 1
          let lineW = rect.width
          
          // Make the last line of a multi-line paragraph 70% width to mimic ragged text
          if (lines > 1 && isLastLine) {
             lineW = rect.width * 0.7
          }

          // Shrink the actual bone height by 70% to create a 30% natural margin between lines
          const boneH = lh * 0.7
          const boneY = (rect.top - rootRect.top) + (i * lh) + (lh * 0.15)
          const br = 4 // Standard small radius for text lines

          bones.push({
            x: rw > 0 ? +((rect.left - rootRect.left) / rw * 100).toFixed(4) : 0,
            y: Math.round(boneY),
            w: rw > 0 ? +(lineW / rw * 100).toFixed(4) : 0,
            h: Math.round(boneH),
            r: br
          })
        }
        return
      }

      // Standard leaf (image, button, icon, table cell, etc.)
      const isSquarish = isMedia && rect.width > 0 && rect.height > 0 && Math.abs(rect.width - rect.height) < 4
      const br = isTableNode ? 0 : isSquarish ? '50%' : (parseBorderRadius(style, node) ?? 8)
      
      bones.push({
        x: rw > 0 ? +((rect.left - rootRect.left) / rw * 100).toFixed(4) : 0,
        y: Math.round(rect.top - rootRect.top),
        w: rw > 0 ? +((rect.width) / rw * 100).toFixed(4) : 0,
        h: Math.round(rect.height),
        r: br,
      })
      return
    }

    if (hasVisualSurface && !node.hasAttribute('data-boneyard-fixture')) {
      const rect = node.getBoundingClientRect()
      if (rect.width >= 1 && rect.height >= 1) {
        const br = isTableNode ? 0 : (parseBorderRadius(style, node) ?? 8)
        const rw = rootRect.width
        bones.push({
          x: rw > 0 ? +((rect.left - rootRect.left) / rw * 100).toFixed(4) : 0,
          y: Math.round(rect.top - rootRect.top),
          w: rw > 0 ? +((rect.width) / rw * 100).toFixed(4) : 0,
          h: Math.round(rect.height),
          r: br,
          c: true,
        })
      }
    }

    for (const child of Array.from(node.children)) {
      walk(child)
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
