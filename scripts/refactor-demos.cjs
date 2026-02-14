/**
 * Script to refactor all demo files to use DemoSection wrapper.
 *
 * For each demo file:
 * 1. Adds `import DemoSection from '../DemoSection.vue'`
 * 2. Adds `import sourceCode from './XxxDemo.vue?raw'`
 * 3. Replaces each <section> + <h3> with <DemoSection title="..." :code="sourceCode">
 * 4. Replaces closing </section> with </DemoSection>
 */

const fs = require('fs')
const path = require('path')

const demosDir = path.join(__dirname, '../src/playground/demos')
const files = fs.readdirSync(demosDir).filter((f) => f.endsWith('.vue'))

let modified = 0
let skipped = 0

for (const file of files) {
  const filePath = path.join(demosDir, file)
  let content = fs.readFileSync(filePath, 'utf-8')

  // Skip if already has DemoSection
  if (content.includes('DemoSection')) {
    console.log(`SKIP (already has DemoSection): ${file}`)
    skipped++
    continue
  }

  const originalContent = content

  // Step 1: Add imports to <script setup> block
  // Find the closing </script> tag to insert before it? No, we should insert after the existing imports.
  // Strategy: Insert after the last import line in the script block.

  // Find the script block
  const scriptMatch = content.match(/<script\s+setup[^>]*>([\s\S]*?)<\/script>/)
  if (!scriptMatch) {
    console.log(`SKIP (no script setup): ${file}`)
    skipped++
    continue
  }

  const scriptContent = scriptMatch[1]
  const scriptStart = content.indexOf(scriptMatch[0])
  const scriptInnerStart = scriptStart + scriptMatch[0].indexOf(scriptContent)

  // Find last import line position
  const importLines = scriptContent.split('\n')
  let lastImportLineIndex = -1
  for (let i = 0; i < importLines.length; i++) {
    const trimmed = importLines[i].trim()
    if (trimmed.startsWith('import ') || trimmed.startsWith('import{')) {
      lastImportLineIndex = i
    }
  }

  // Build new imports
  const demoSectionImport = `import DemoSection from '../DemoSection.vue'`
  const sourceCodeImport = `import sourceCode from './${file}?raw'`

  if (lastImportLineIndex >= 0) {
    // Insert after the last import
    importLines.splice(lastImportLineIndex + 1, 0, demoSectionImport, sourceCodeImport)
  } else {
    // No imports found, add at beginning of script
    importLines.unshift(demoSectionImport, sourceCodeImport)
  }

  const newScriptContent = importLines.join('\n')
  content = content.replace(scriptContent, newScriptContent)

  // Step 2: Replace <section> blocks
  // Pattern: <section class="space-y-4"> followed by <h3 ...>Title</h3>
  // Replace with <DemoSection title="Title" :code="sourceCode">
  // And </section> with </DemoSection>

  // We need to handle sections that contain <h3> tags
  // Use a regex to find section + h3 pairs and extract title text

  // Match section opening with optional extra classes
  // Then match the h3 line(s) and extract the text content
  const sectionH3Pattern =
    /<section\s+class="[^"]*">\s*\n(\s*)<h3\s+class="[^"]*"(?:\s*[^>]*)?>[\s\S]*?<\/h3>/g

  let match
  const replacements = []

  while ((match = sectionH3Pattern.exec(content)) !== null) {
    const fullMatch = match[0]
    const indent = match[1]

    // Extract the title from the h3
    // The h3 might contain icons and other elements, we want just the text
    const h3Match = fullMatch.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)
    if (!h3Match) continue

    let titleContent = h3Match[1]
    // Remove HTML tags to get plain text
    titleContent = titleContent.replace(/<[^>]+>/g, '').trim()
    // Clean up whitespace
    titleContent = titleContent.replace(/\s+/g, ' ').trim()

    // Escape quotes in title
    titleContent = titleContent.replace(/"/g, '\\"')

    const replacement = `<DemoSection title="${titleContent}" :code="sourceCode">`
    replacements.push({ from: fullMatch, to: `${replacement}` })
  }

  // Apply replacements
  for (const r of replacements) {
    content = content.replace(r.from, r.to)
  }

  // Replace </section> with </DemoSection>
  // Count how many DemoSection openings we have and replace the same number of </section>
  const demoSectionCount = (content.match(/<DemoSection /g) || []).length

  // Replace </section> tags from bottom to top
  let sectionCloseCount = 0
  // Find all </section> positions
  const closingPositions = []
  let searchFrom = 0
  while (true) {
    const idx = content.indexOf('</section>', searchFrom)
    if (idx === -1) break
    closingPositions.push(idx)
    searchFrom = idx + 10
  }

  // We need to figure out which </section> tags correspond to our DemoSection replacements
  // Simple approach: replace all </section> with </DemoSection> since we replaced all <section>
  // But some demos might have nested sections... let's be safe and just replace all
  content = content.replace(/<\/section>/g, '</DemoSection>')

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`MODIFIED: ${file} (${replacements.length} sections wrapped)`)
    modified++
  } else {
    console.log(`NO CHANGES: ${file}`)
    skipped++
  }
}

console.log(`\nDone! Modified: ${modified}, Skipped: ${skipped}`)
