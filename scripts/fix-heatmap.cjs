const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, '../src/playground/demos/HeatmapDemo.vue')
let content = fs.readFileSync(file, 'utf8')
let lines = content.split('\n')

console.log('Total lines:', lines.length)

// 1. Remove duplicate block
// Look for the SEQUENCE: </div> (end of first block), <Button (start of duplicate)
let duplicateStart = -1
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim()
  const prevLine = lines[i - 1].trim()
  // Verify context: duplicate block starts with <Button ... refreshData('activity')
  if (
    line.startsWith('<Button') &&
    lines[i].includes("refreshData('activity')") &&
    prevLine === '</div>'
  ) {
    // This *could* be the first valid one or the duplicate.
    // The first valid one is around line 227.
    // It resides inside <div class="flex ... justify-between"> (line 226)
    // So prevLine would be <div ...> for the valid one?
    // Let's check line 226 in view_file (Step 196):
    // 226: <div class="flex items-center justify-between">
    // 227: <Button ...>
    // So for the VALID block, prevLine is <div ...>.
    // For the DUPLICATE block (start 235), prevLine is </div> (line 234).
    // PERFECT!

    duplicateStart = i
    console.log('Found duplicate block start at line', i + 1)
    break
  }
}

if (duplicateStart !== -1) {
  // Remove 8 lines: <Button ... -> </div>
  // Verify the end (duplicateStart + 7) should be </div>
  if (lines[duplicateStart + 7].trim() === '</div>') {
    lines.splice(duplicateStart, 8)
    console.log('Removed 8 lines of duplicate content')
  } else {
    console.log(
      'Warning: Expected closing </div> at line',
      duplicateStart + 8,
      'but found:',
      lines[duplicateStart + 7]
    )
    // Remove anyway? Best to be safe.
    // Let's verify what index 242 (1-based) was.
    // It was </div>.
    // 235 + 7 = 242.
    // So indices are i to i+7.
    lines.splice(duplicateStart, 8)
  }
} else {
  console.log('Duplicate block not found')
}

// 2. Fix Responsive Container
// Find <DemoSection ... title="Responsive Container" ...>
let demoIdx = -1
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('title="Responsive Container"')) {
    demoIdx = i
    break
  }
}

if (demoIdx !== -1) {
  // Look for next div
  let divIdx = demoIdx + 1
  // Check if it's the justify-between div
  if (lines[divIdx] && lines[divIdx].includes('justify-between')) {
    console.log('Found Responsive Container div at line', divIdx + 1)
    // Replace justify-between with justify-end if desired, or keep spacing?
    // Original had h3 on left. Now we have nothing on left.
    // If we keep justify-between, it pushes right.
    // Justify-between with 1 child = left aligned? No.
    // Flex behavior: 1 child -> start.
    // We want it on the right? Or full width?
    // The controls were on the right.
    // Let's use `w-full flex justify-end`?
    // Or `flex items-center gap-4` and let it be left aligned?
    // Layout: Just controls.
    // Let's just fix the missing wrapper div.

    // Match indentation
    const indent = lines[divIdx].match(/^\s*/)[0]

    // Insert <div gap-4>
    lines.splice(divIdx + 1, 0, `${indent}\t<div class="flex items-center gap-4">`)

    // We need to verify if we need to close it?
    // Original had 2 closing divs at bottom.
    // We kept both closing divs in our previous logic?
    // Line 351: </div>
    // Line 352: </div>
    // So we have 2 closers.
    // We have 1 opener (326).
    // By inserting 1 opener, we now have 2 openers.
    // Balanced!
    console.log('Inserted missing <div gap-4>')
  } else {
    console.log('Could not find expected div after Responsive Container')
  }
}

fs.writeFileSync(file, lines.join('\n'))
console.log('HeatmapDemo.vue fixed')
