const fs = require('fs');

const path = '/Users/safdar/Projects/vlite3/src/components/Badge.vue';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "interface Props {\n  variant?: BadgeVariant | string\n  class?: string\n}",
  "interface Props {\n  variant?: BadgeVariant | string\n  size?: 'xs' | 'sm' | 'md' | 'lg'\n  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string\n  class?: string\n}"
);

content = content.replace(
  "const props = withDefaults(defineProps<Props>(), {\n  variant: 'default',\n  class: '',\n})",
  "const props = withDefaults(defineProps<Props>(), {\n  variant: 'default',\n  size: 'md',\n  rounded: 'full',\n  class: '',\n})"
);

content = content.replace(
  /const baseClasses =\n\s+'inline-flex items-center rounded-full border px-2\.5 py-0\.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'/,
`  const sizeClasses = {
    xs: 'px-1.5 py-0 text-[10px] leading-[14px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }
  const roundedClass = props.rounded === 'none' ? 'rounded-none' : \`rounded-\${props.rounded}\`
  const baseClasses =
    \`inline-flex items-center \${roundedClass} border \${sizeClasses[props.size]} font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2\``
);

fs.writeFileSync(path, content, 'utf8');
