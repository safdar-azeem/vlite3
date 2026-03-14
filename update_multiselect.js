const fs = require('fs');

const path = '/Users/safdar/Projects/vlite3/src/components/MultiSelect/MultiSelect.vue';
let content = fs.readFileSync(path, 'utf8');

// Update Props interface
content = content.replace(
  "  layout?: 'default' | 'grouped'\n}",
  "  layout?: 'default' | 'grouped'\n  showControls?: boolean\n  wrap?: boolean\n  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | string\n}"
);

// Update withDefaults
content = content.replace(
  "  layout: 'default',\n})",
  "  layout: 'default',\n  showControls: true,\n  wrap: true,\n  rounded: 'md',\n})"
);

// Update triggerClasses
content = content.replace(
  /const triggerClasses = computed\(\(\) => \{\n  return \[\n    'flex items-center justify-between w-full px-3 py-1\.5 rounded-md border text-sm transition-colors cursor-pointer',\n    props\.disabled\n      \? 'opacity-50 cursor-not-allowed bg-muted'\n      : props\.variant === 'floating'\n        \? 'bg-transparent text-foreground'\n        : 'bg-background hover:bg-gray-50\/70',\n    props\.variant === 'outline' \|\| props\.variant === 'floating'\n      \? 'border-input'\n      : 'border-transparent bg-muted',\n    isOpen\.value \? 'border-primary\/20' : '',\n  \]\.join\(' '\)\n\}\)/g,
  "const triggerClasses = computed(() => {\n  const roundedClass = props.rounded === 'none' ? 'rounded-none' : `rounded-${props.rounded}`\n  const spacingClass = props.variant === 'transparent' ? 'px-2 py-0' : 'px-3 py-1.5'\n  const heightClass = props.variant === 'transparent' ? 'h-full min-h-[40px]' : 'min-h-[40px]'\n\n  return [\n    `flex items-center justify-between w-full ${spacingClass} ${heightClass} ${roundedClass} border text-sm transition-colors cursor-pointer`,\n    props.disabled\n      ? 'opacity-50 cursor-not-allowed bg-muted'\n      : props.variant === 'floating'\n        ? 'bg-transparent text-foreground'\n        : props.variant === 'transparent'\n          ? 'bg-transparent text-foreground'\n          : 'bg-background hover:bg-gray-50/70',\n    props.variant === 'outline' || props.variant === 'floating'\n      ? 'border-input'\n      : props.variant === 'transparent' ? 'border-transparent' : 'border-transparent bg-muted',\n    isOpen.value && props.variant !== 'transparent' ? 'border-primary/20' : '',\n  ].join(' ')\n})"
);

// Update the trigger wrap class
content = content.replace(
  /<div class="flex flex-wrap gap-1\.5 items-center flex-1 min-w-0 py-0\.5">/g,
  '<div class="flex gap-1.5 items-center flex-1 min-w-0" :class="[wrap ? \'flex-wrap py-0.5\' : \'flex-nowrap overflow-hidden py-1\']">'
);

// Truncate placeholder if needed
content = content.replace(
  /<span v-if="selectedOptions\.length === 0" class="text-muted-foreground pl-1">/g,
  '<span v-if="selectedOptions.length === 0" class="text-muted-foreground pl-1 truncate">'
);

// Badge styling update for +N count badge to look consistent
// Actually the existing +N badge has variant="secondary", we just remove font-normal if we want it to look the same.
content = content.replace(
  /<Badge\n\s+v-if="hiddenCount > 0"\n\s+variant="secondary"\n\s+class="font-normal text-muted-foreground">/g,
  '<Badge\n              v-if="hiddenCount > 0"\n              variant="secondary"\n              class="shrink-0">'
);

// Update the controls container to be hidden if !showControls
content = content.replace(
  /<div class="flex items-center gap-2 pl-2 shrink-0 text-muted-foreground">/g,
  '<div v-if="showControls" class="flex items-center gap-2 pl-2 shrink-0 text-muted-foreground">'
);

// Add max-w class condition to badges so they can shrink in nowarp mode
content = content.replace(
  /class="gap-1 pr-1 truncate max-w-\[150px\]">/g,
  'class="gap-1 pr-1 truncate min-w-0 shrink"'
);

content = content.replace(
  /<span class="truncate">{{ opt\.labelI18n \? \$t\(opt\.labelI18n\) : opt\.label }}<\/span>/g,
  '<span class="truncate min-w-0">{{ opt.labelI18n ? $t(opt.labelI18n) : opt.label }}</span>'
);

fs.writeFileSync(path, content, 'utf8');
