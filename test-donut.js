function arcPath(cx, cy, r, startAngle, endAngle, innerR = 0) {
  const toRad = deg => (deg * Math.PI) / 180
  const s = toRad(startAngle)
  const e = toRad(endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  
  const x1 = cx + r * Math.cos(s)
  const y1 = cy + r * Math.sin(s)
  const x2 = cx + r * Math.cos(e)
  const y2 = cy + r * Math.sin(e)
  
  if (innerR <= 0) {
    return `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`
  }
  
  const ix1 = cx + innerR * Math.cos(e)
  const iy1 = cy + innerR * Math.sin(e)
  const ix2 = cx + innerR * Math.cos(s)
  const iy2 = cy + innerR * Math.sin(s)
  
  return [
    `M ${x1},${y1}`,
    `A ${r},${r} 0 ${largeArc} 1 ${x2},${y2}`,
    `L ${ix1},${iy1}`,
    `A ${innerR},${innerR} 0 ${largeArc} 0 ${ix2},${iy2}`,
    'Z'
  ].join(' ')
}

const angleStart = -90;
const pct = 0.51;
const sweep = pct * 360; // 183.6
const angleEnd = angleStart + sweep; // 93.6
const path = arcPath(140, 140, 136, angleStart, angleEnd, 84)

const fs = require('fs')
const svg = `<svg width="280" height="280" xmlns="http://www.w3.org/2000/svg">
  <path d="${path}" fill="blue" stroke="black" />
</svg>`
fs.writeFileSync('donut.svg', svg)
console.log(path)
