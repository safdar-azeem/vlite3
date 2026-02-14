/**
 * Fix script for demo files that have mismatched <section>/<DemoSection> tags.
 *
 * For files where the whole template is one <section>, we convert them to:
 * - Replace the outer <section> with a plain <div> and keep content as-is
 * - Add a single DemoSection wrapping all the content
 *
 * For files with nested sections, fix specific mismatches.
 */

const fs = require('fs')
const path = require('path')

const demosDir = path.join(__dirname, '../src/playground/demos')

// Files that need fixing: they have <section> but no matching <DemoSection> openers
// These are "whole page" demos where the outer <section> is the page wrapper
const wholePagFiles = [
  'BadgesDemo.vue',
  'ButtonsDemo.vue',
  'DisplayDemo.vue',
  'InputsDemo.vue',
  'NavigationDemo.vue',
  'OverlaysDemo.vue',
]

// Files with section tag that wasn't matched because it had different class or structure
const sectionClassFiles = [
  'DataTableDemo.vue',
  'DatePickerDemo.vue',
  'FormDemo.vue',
  'ColorsDemo.vue',
  'MasonryDemo.vue',
  'SidebarMenuDemo.vue',
  'TabesDemo.vue',
  'PricingPlanDemo.vue',
  'FileTreeDemo.vue',
  'WorkbookDemo.vue',
]

// For whole-page files: wrap the entire content in a single DemoSection
for (const file of wholePagFiles) {
  const filePath = path.join(demosDir, file)
  if (!fs.existsSync(filePath)) continue
  let content = fs.readFileSync(filePath, 'utf-8')

  // These files have pattern: <section class="space-y-X"> ... </DemoSection>
  // Fix: Replace <section ...> with <DemoSection title="Component Name" :code="sourceCode">
  // Extract title from the h2 inside
  const h2Match = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)
  let title = 'Demo'
  if (h2Match) {
    title = h2Match[1]
      .replace(/<[^>]+>/g, '')
      .trim()
      .replace(/\s+/g, ' ')
  }

  // Replace opening <section ...> with <DemoSection>
  content = content.replace(
    /<section\s+class="[^"]*">/,
    `<DemoSection title="${title}" :code="sourceCode">`
  )

  // If there's still a bare <section> (without class), wrap it too
  // But check carefully - some might be nested

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`FIXED (whole-page): ${file} -> title="${title}"`)
}

// For files with section tags that have different patterns:
// These didn't get wrapped at all because they didn't match the regex
// The </section> was wrongly replaced. Fix: revert </DemoSection> back to </section>
// where there's no matching <DemoSection opener
for (const file of sectionClassFiles) {
  const filePath = path.join(demosDir, file)
  if (!fs.existsSync(filePath)) continue
  let content = fs.readFileSync(filePath, 'utf-8')

  // Count DemoSection opens and closes
  const opens = (content.match(/<DemoSection /g) || []).length
  const closes = (content.match(/<\/DemoSection>/g) || []).length

  if (closes > opens) {
    // We have extra </DemoSection> that should be </section>
    // Revert ALL </DemoSection> to </section> first
    content = content.replace(/<\/DemoSection>/g, '</section>')

    // Now there are 0 DemoSection wrappers - we want to wrap each <section> properly
    // For these files, let's just wrap the entire content area
    // Find the first <section> and extract h2 or h3 title
    const h2Match = content.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/)
    let title = file.replace('Demo.vue', '')
    if (h2Match) {
      title = h2Match[1]
        .replace(/<[^>]+>/g, '')
        .trim()
        .replace(/\s+/g, ' ')
    }

    // Replace first <section...> with <DemoSection>
    // And last </section> with </DemoSection>
    const sectionMatch = content.match(/<section[^>]*>/)
    if (sectionMatch) {
      content = content.replace(
        sectionMatch[0],
        `<DemoSection title="${title}" :code="sourceCode">`
      )
      // Replace the last </section> with </DemoSection>
      const lastIdx = content.lastIndexOf('</section>')
      if (lastIdx !== -1) {
        content = content.substring(0, lastIdx) + '</DemoSection>' + content.substring(lastIdx + 10)
      }
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`FIXED (section-class): ${file}`)
}

// Now handle CarouselDemo.vue specially - it has multiple bare <section> tags
const carouselPath = path.join(demosDir, 'CarouselDemo.vue')
if (fs.existsSync(carouselPath)) {
  let content = fs.readFileSync(carouselPath, 'utf-8')

  // Replace bare <section> with <DemoSection ...> using the h2 text
  // Pattern: <section>\n\t\t\t<h2 class="text-xl font-semibold mb-4">Title</h2>
  content = content.replace(
    /<section>\s*\n(\s*)<h2\s+class="[^"]*">([\s\S]*?)<\/h2>/g,
    (match, indent, titleHtml) => {
      const title = titleHtml
        .replace(/<[^>]+>/g, '')
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/^\d+\.\s*/, '')
      return `<DemoSection title="${title}" :code="sourceCode">`
    }
  )

  fs.writeFileSync(carouselPath, content, 'utf-8')
  console.log('FIXED: CarouselDemo.vue')
}

// Fix HeatmapDemo - has both proper DemoSection and extra </DemoSection> from nested sections
const heatmapPath = path.join(demosDir, 'HeatmapDemo.vue')
if (fs.existsSync(heatmapPath)) {
  let content = fs.readFileSync(heatmapPath, 'utf-8')
  const opens = (content.match(/<DemoSection /g) || []).length
  const closes = (content.match(/<\/DemoSection>/g) || []).length

  if (closes > opens) {
    // Find sections that don't have matching DemoSection opener
    // Replace extra </DemoSection> back to </section>
    // Strategy: go through and only keep as many </DemoSection> as there are openers
    let count = 0
    content = content.replace(/<\/DemoSection>/g, (match) => {
      count++
      if (count <= opens) return '</DemoSection>'
      return '</section>'
    })
    fs.writeFileSync(heatmapPath, content, 'utf-8')
    console.log(`FIXED: HeatmapDemo.vue (${opens} opens, reverted ${closes - opens} extra closes)`)
  }
}

// Fix ModalDemo - has 4 DemoSection opens but 5 closes
const modalPath = path.join(demosDir, 'ModalDemo.vue')
if (fs.existsSync(modalPath)) {
  let content = fs.readFileSync(modalPath, 'utf-8')
  const opens = (content.match(/<DemoSection /g) || []).length
  const closes = (content.match(/<\/DemoSection>/g) || []).length

  if (closes > opens) {
    let count = 0
    content = content.replace(/<\/DemoSection>/g, (match) => {
      count++
      if (count <= opens) return '</DemoSection>'
      return '</section>'
    })
    fs.writeFileSync(modalPath, content, 'utf-8')
    console.log(`FIXED: ModalDemo.vue (${opens} opens, reverted ${closes - opens} extra closes)`)
  }
}

// Fix TimelineDemo - has 1 DemoSection open but 2 closes
const timelinePath = path.join(demosDir, 'TimelineDemo.vue')
if (fs.existsSync(timelinePath)) {
  let content = fs.readFileSync(timelinePath, 'utf-8')
  const opens = (content.match(/<DemoSection /g) || []).length
  const closes = (content.match(/<\/DemoSection>/g) || []).length

  if (closes > opens) {
    let count = 0
    content = content.replace(/<\/DemoSection>/g, (match) => {
      count++
      if (count <= opens) return '</DemoSection>'
      return '</section>'
    })
    fs.writeFileSync(timelinePath, content, 'utf-8')
    console.log(`FIXED: TimelineDemo.vue (${opens} opens, reverted ${closes - opens} extra closes)`)
  }
}

console.log('\nDone fixing!')
