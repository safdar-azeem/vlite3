/**
 * Lightweight Vue SFC syntax highlighter.
 * Converts raw Vue source code into HTML with <span> classes for styling.
 * No external dependencies — pure regex-based approach.
 */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function highlightVue(code: string): string {
  const lines = code.split('\n')

  // Helper to wrap content in a unique placeholder that won't be matched by subsequent regexes
  const wrap = (content: string, cls: string) => `___HL_START_${cls}___${content}___HL_END___`

  return (
    lines
      .map((line) => {
        let escaped = escapeHtml(line)

        // 1. Comments
        escaped = escaped.replace(/(&lt;!--.*?--&gt;)/g, wrap('$1', 'comment'))
        escaped = escaped.replace(/(\/\/.*$)/, wrap('$1', 'comment'))

        // 2. SFC block tags
        escaped = escaped.replace(
          /(&lt;\/?(?:template|script|style)(?:\s[^&]*?)?&gt;)/g,
          wrap('$1', 'sfc-tag')
        )

        // 3. HTML/Vue tags
        escaped = escaped.replace(/(&lt;\/?[A-Za-z][A-Za-z0-9.-]*)/g, wrap('$1', 'tag'))
        escaped = escaped.replace(/(\/?&gt;)/g, wrap('$1', 'tag'))

        // 4. Strings (must be before attributes to avoid matching inside strings)
        escaped = escaped.replace(/(&quot;[^&]*?&quot;)/g, wrap('$1', 'string'))
        escaped = escaped.replace(/('(?:[^'\\]|\\.)*?')/g, wrap('$1', 'string'))
        escaped = escaped.replace(/(`(?:[^`\\]|\\.)*?`)/g, wrap('$1', 'string'))

        // 5. Attributes (v-..., @..., :...)
        escaped = escaped.replace(/\b(v-[a-z:-]+|@[a-z.-]+|:[a-z.-]+)/g, wrap('$1', 'directive'))

        // 6. Normal attributes (word=...)
        // Improved regex to avoid matching inside placeholders
        escaped = escaped.replace(/\b([a-zA-Z-]+)(=)/g, (match, p1, p2) => {
          return wrap(p1, 'attr') + p2
        })

        // 7. Keywords
        escaped = escaped.replace(
          /\b(import|from|export|default|const|let|var|function|return|if|else|for|of|in|new|type|interface|async|await|ref|computed|watch|onMounted|defineComponent|defineProps|defineEmits|withDefaults)\b/g,
          wrap('$1', 'keyword')
        )

        // 8. Numbers
        escaped = escaped.replace(/\b(\d+(?:\.\d+)?)\b/g, wrap('$1', 'number'))

        return escaped
      })
      .join('\n')
      // Final pass: convert placeholders to real HTML
      .replace(/___HL_START_([a-z-]+)___/g, '<span class="hl-$1">')
      .replace(/___HL_END___/g, '</span>')
  )
}

export function extractSnippet(code: string, sectionTitle: string): string {
  // Extract script block (if any)
  const scriptMatch = code.match(/<script[\s\S]*?<\/script>/)
  const scriptContent = scriptMatch ? scriptMatch[0] : ''

  // Escape regex chars in title
  const safeTitle = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Find <DemoSection title="Title" ...>...</DemoSection>
  const regex = new RegExp(
    `<DemoSection[^>]+title=["']${safeTitle}["'][^>]*>([\\s\\S]*?)</DemoSection>`
  )
  const match = code.match(regex)

  if (match && match[1]) {
    let content = match[1]

    // De-indent
    const lines = content.split('\n')
    // Remove leading/trailing empty lines
    while (lines.length && !lines[0].trim()) lines.shift()
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop()

    if (lines.length) {
      // Find base indent from first line
      const firstLineIndentMatch = lines[0].match(/^\s*/)
      const indentLen = firstLineIndentMatch ? firstLineIndentMatch[0].length : 0

      content = lines
        .map((line) => {
          if (line.length >= indentLen) {
            return line.substring(indentLen)
          }
          return line
        })
        .join('\n')
    } else {
      content = ''
    }

    let result = ''
    if (scriptContent) result += scriptContent + '\n\n'
    result += '<template>\n' + content + '\n</template>'
    return result
  }

  return code
}
