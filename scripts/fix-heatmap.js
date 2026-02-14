const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, '../src/playground/demos/HeatmapDemo.vue')
let content = fs.readFileSync(file, 'utf8')
let lines = content.split('\n')

console.log('Original lines:', lines.length)

// 1. Remove duplicate block (lines 235-242 in the viewed file)
// We look for the pattern to be sure
let startIdx = -1
for (let i = 0; i < lines.length; i++) {
  if (
    lines[i].trim().startsWith('<Button') &&
    lines[i].includes("refreshData('activity')") &&
    lines[i - 1].trim() === '</div>' &&
    lines[i - 2].trim() === '</Button>'
  ) {
    // This looks like the duplicate block starting at 235
    // Line 234 is </div>
    // Line 233 is </Button>
    // Line 232 is Refresh
    // Line 231...
    // Wait, line 234 in view was </div>. Line 233 was </Button>.
    // Line 235 is <Button ...>
    // So lines[i-1] is </div>.
    startIdx = i
    break
  }
}

if (startIdx !== -1) {
  // Check if it's the duplicate (the one AFTER the first valid one)
  // The valid one is at 227.
  // If startIdx is > 230, it is likely the duplicate.
  if (startIdx > 230) {
    // Verify end
    // We want to remove 8 lines: Button(open), size, variant, icon, click, text, Button(close), div(close)
    lines.splice(startIdx, 8)
    console.log('Removed duplicate block at line', startIdx + 1)
  } else {
    console.log('Found block but it looks like the original one at', startIdx + 1)
  }
} else {
  console.log('Duplicate block not found by pattern')
}

// 2. Fix Responsive Container
// Find <DemoSection title="Responsive Container" ...>
let demoSectionIdx = -1
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('title="Responsive Container"')) {
    demoSectionIdx = i
    break
  }
}

if (demoSectionIdx !== -1) {
  // The next line should be the div
  let divIdx = demoSectionIdx + 1
  if (lines[divIdx].includes('<div class="flex items-center justify-between">')) {
    // Change justify-between to justify-end
    lines[divIdx] = lines[divIdx].replace('justify-between', 'justify-end')

    // Insert wrapper div with gap-4
    // Use matching indentation
    const indent = lines[divIdx].match(/^\s*/)[0]
    lines.splice(divIdx + 1, 0, `${indent}\t<div class="flex items-center gap-4">`)

    // We also need to close this div.
    // The block originally had two closing divs at the end (351, 352).
    // If we supply one opening, and there were already 2 closings?
    // Let's check the bottom of that section.
    // It ends before <p class="text-xs...
    // Find the <p> tag
    let pIdx = -1
    for (let j = divIdx; j < lines.length; j++) {
      if (lines[j].includes('<p class="text-xs text-gray-500">')) {
        pIdx = j
        break
      }
    }

    if (pIdx !== -1) {
      // Check closing divs before pIdx
      // lines[pIdx-1] is </div>
      // lines[pIdx-2] is </div>
      // ...
      // If we successfully added an opener, we should be fine?
      // The original problem was we removed <div gap-4> but kept its closer.
      // So restoring <div gap-4> should balance it.
      console.log('Fixed Responsive Container at line', divIdx + 1)
    }
  } else {
    console.log('Could not match div line after DemoSection')
  }
} else {
  console.log('Responsive Container section not found')
}

fs.writeFileSync(file, lines.join('\n'))
console.log('Done')
