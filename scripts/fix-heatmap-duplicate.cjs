const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, '../src/playground/demos/HeatmapDemo.vue')
let content = fs.readFileSync(file, 'utf8')
let lines = content.split('\n')

console.log('Lines:', lines.length)

// Find all occurrences of "refreshData('activity')"
const matches = []
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("refreshData('activity')")) {
    matches.push(i)
  }
}

console.log(
  'Found occurrences at lines:',
  matches.map((m) => m + 1)
)

if (matches.length >= 2) {
  // The last one is the duplicate (inside the template)
  // The first one is the valid button.
  // The second/last one is the duplicate button.
  // Let's verify context: The first one should be inside a <div ... justify-between>
  // The second one is just floating?

  const duplicateLineIdx = matches[matches.length - 1] // e.g. 239

  // We want to remove the block surrounding this line.
  // It's inside a <Button> ... </Button> block.
  // Let's find the start <Button
  let startIdx = duplicateLineIdx
  while (startIdx > 0 && !lines[startIdx].trim().startsWith('<Button')) {
    startIdx--
  }

  // Check if we found it
  if (lines[startIdx].trim().startsWith('<Button')) {
    // Find the end </div>
    // It should be <Button> ... </Button> ... </div>
    // Let's find </Button> first
    let endIdx = duplicateLineIdx
    while (endIdx < lines.length && !lines[endIdx].trim().startsWith('</Button>')) {
      endIdx++
    }

    // The closing </div> should be right after </Button> ?
    // In the duplicate block, it was:
    // </Button>
    // </div>
    if (lines[endIdx].trim().startsWith('</Button>')) {
      // Check if next line is </div>
      if (lines[endIdx + 1].trim() === '</div>') {
        endIdx++ // Include the div
      }

      // Remove from startIdx to endIdx (inclusive)
      const count = endIdx - startIdx + 1
      console.log(`Removing ${count} lines from ${startIdx + 1} to ${endIdx + 1}`)

      // Verify this block is indeed duplicated
      // The PREVIOUS block (if any) should be similar?
      // Not necessary, we trust our analysis that the LAST one is duplicate.

      lines.splice(startIdx, count)

      fs.writeFileSync(file, lines.join('\n'))
      console.log('Fixed duplicate block')
    } else {
      console.log('Could not find closing </Button>')
    }
  } else {
    console.log('Could not find start <Button')
  }
} else {
  console.log('Not enough occurrences found to identify duplicate')
}
