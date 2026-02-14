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
        // We use a negative lookbehind or ensure we are not inside a placeholder?
        // Simple approach: The placeholders use ___HL_... which doesn't look like valid attr syntax
        escaped = escaped.replace(/\b([a-zA-Z-]+)(=)/g, (match, p1, p2) => {
          // Avoid matching inside placeholders if they look like attrs?
          // Actually, our placeholders are ___HL_START_...___
          // They don't contain =.
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
