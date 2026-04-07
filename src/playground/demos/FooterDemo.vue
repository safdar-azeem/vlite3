<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import { Footer } from '@/components/Footer'
import type { FooterVariant, FooterData } from '@/components/Footer'
import sourceCode from './FooterDemo.vue?raw'

// ──────────────────────────────────────────────────────────────────────────────
// Active variant selector
// ──────────────────────────────────────────────────────────────────────────────
const selectedVariant = ref<FooterVariant>('Variant1')

const variants: { value: FooterVariant; label: string; description: string }[] = [
  {
    value: 'Variant1',
    label: 'Variant 1 — Classic',
    description: 'Columnar layout with brand on left, link groups on right',
  },
  {
    value: 'Variant2',
    label: 'Variant 2 — Centered',
    description: 'Everything centered with stacked sections',
  },
  {
    value: 'Variant3',
    label: 'Variant 3 — Minimal',
    description: 'Single-line compact footer for dashboards',
  },
]

// ──────────────────────────────────────────────────────────────────────────────
// Sample data — SaaS / Product Website
// ──────────────────────────────────────────────────────────────────────────────
const saasFooter: FooterData = {
  brandName: 'Builto.com',
  brandLogo:
    'https://ph-files.imgix.net/0ecf8d00-b87b-4fdb-a497-5c98fcaa4064.avif?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=56&h=56&fit=crop&frame=1&dpr=2',
  brandDescription: 'A collection of components for your startup business or side project.',
  socialLinks: [
    { icon: 'lucide:instagram', url: 'https://instagram.com', label: 'Instagram' },
    { icon: 'lucide:facebook', url: 'https://facebook.com', label: 'Facebook' },
    { icon: 'lucide:twitter', url: 'https://twitter.com', label: 'Twitter' },
    { icon: 'lucide:linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
  ],
  linkGroups: [
    {
      title: 'Product',
      links: [
        { label: 'Overview', url: '#' },
        { label: 'Pricing', url: '#' },
        { label: 'Marketplace', url: '#' },
        { label: 'Features', url: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', url: '#' },
        { label: 'Team', url: '#' },
        { label: 'Blog', url: '#' },
        { label: 'Careers', url: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help', url: '#' },
        { label: 'Sales', url: '#' },
        { label: 'Advertise', url: '#' },
        { label: 'Privacy', url: '#' },
      ],
    },
  ],
  copyright: '© 2024 Builto.com. All rights reserved.',
  legalLinks: [
    { label: 'Terms and Conditions', url: '#' },
    { label: 'Privacy Policy', url: '#' },
  ],
}

// ──────────────────────────────────────────────────────────────────────────────
// Sample data — Open Source / Dev Tools
// ──────────────────────────────────────────────────────────────────────────────
const devToolsFooter: FooterData = {
  brandName: 'DevStack',
  brandLogo:
    'https://ph-files.imgix.net/0ecf8d00-b87b-4fdb-a497-5c98fcaa4064.avif?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=56&h=56&fit=crop&frame=1&dpr=2',
  brandDescription: 'Open source developer tools for building modern web applications.',
  badge: 'v2.1.0',
  socialLinks: [
    { icon: 'lucide:github', url: 'https://github.com', label: 'GitHub' },
    { icon: 'lucide:twitter', url: 'https://twitter.com', label: 'Twitter' },
    { icon: 'lucide:message-circle', url: 'https://discord.com', label: 'Discord' },
  ],
  linkGroups: [
    {
      title: 'Documentation',
      links: [
        { label: 'Getting Started', url: '#', icon: 'lucide:book-open' },
        { label: 'API Reference', url: '#', icon: 'lucide:code-2' },
        { label: 'Examples', url: '#', icon: 'lucide:layout-template' },
        { label: 'Changelog', url: '#', icon: 'lucide:file-text' },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'GitHub Discussions', url: '#', external: true },
        { label: 'Discord Server', url: '#', external: true },
        { label: 'Contributing', url: '#' },
        { label: 'Code of Conduct', url: '#' },
      ],
    },
    {
      title: 'More',
      links: [
        { label: 'Blog', url: '#' },
        { label: 'Releases', url: '#' },
        { label: 'Roadmap', url: '#' },
        { label: 'License', url: '#' },
      ],
    },
  ],
  newsletter: {
    title: 'Stay in the loop',
    description: 'Get notified about new releases and updates.',
    placeholder: 'you@example.com',
    buttonText: 'Subscribe',
  },
  copyright: '© 2024 DevStack. MIT License.',
  legalLinks: [
    { label: 'Privacy', url: '#' },
    { label: 'Terms', url: '#' },
    { label: 'License', url: '#' },
  ],
}

// ──────────────────────────────────────────────────────────────────────────────
// Sample data — Agency / Creative
// ──────────────────────────────────────────────────────────────────────────────
const agencyFooter: FooterData = {
  brandName: 'Pixel Studio',
  brandDescription:
    'Creative digital agency specializing in branding, web design, and interactive experiences.',
  socialLinks: [
    { icon: 'lucide:instagram', url: 'https://instagram.com', label: 'Instagram' },
    { icon: 'lucide:dribbble', url: 'https://dribbble.com', label: 'Dribbble' },
    { icon: 'lucide:twitter', url: 'https://twitter.com', label: 'Twitter' },
    { icon: 'lucide:youtube', url: 'https://youtube.com', label: 'YouTube' },
    { icon: 'lucide:linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
  ],
  linkGroups: [
    {
      title: 'Services',
      links: [
        { label: 'Branding', url: '#' },
        { label: 'Web Design', url: '#' },
        { label: 'Development', url: '#' },
        { label: 'Consulting', url: '#' },
      ],
    },
    {
      title: 'Work',
      links: [
        { label: 'Portfolio', url: '#' },
        { label: 'Case Studies', url: '#' },
        { label: 'Testimonials', url: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', url: '#' },
        { label: 'Team', url: '#' },
        { label: 'Careers', url: '#' },
        { label: 'Contact', url: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', url: '#' },
        { label: 'Terms of Service', url: '#' },
        { label: 'Cookie Policy', url: '#' },
      ],
    },
  ],
  copyright: '© 2024 Pixel Studio. All rights reserved.',
  legalLinks: [
    { label: 'Privacy', url: '#' },
    { label: 'Terms', url: '#' },
  ],
}

// ──────────────────────────────────────────────────────────────────────────────
// Sample data — Minimal Dashboard Footer
// ──────────────────────────────────────────────────────────────────────────────
const dashboardFooter: FooterData = {
  brandName: 'AppDash',
  brandLogo:
    'https://ph-files.imgix.net/0ecf8d00-b87b-4fdb-a497-5c98fcaa4064.avif?auto=compress&codec=mozjpeg&cs=strip&auto=format&w=56&h=56&fit=crop&frame=1&dpr=2',
  copyright: '© 2024 AppDash Inc.',
  socialLinks: [
    { icon: 'lucide:github', url: 'https://github.com', label: 'GitHub' },
    { icon: 'lucide:twitter', url: 'https://twitter.com', label: 'Twitter' },
  ],
  legalLinks: [
    { label: 'Terms', url: '#' },
    { label: 'Privacy', url: '#' },
    { label: 'Status', url: '#', external: true },
  ],
}

// ──────────────────────────────────────────────────────────────────────────────
// Scenario selector
// ──────────────────────────────────────────────────────────────────────────────
type ScenarioKey = 'saas' | 'devtools' | 'agency' | 'dashboard'

const scenarios = [
  { label: 'SaaS / Product', value: 'saas' as const },
  { label: 'Dev Tools / OSS', value: 'devtools' as const },
  { label: 'Agency / Creative', value: 'agency' as const },
  { label: 'Dashboard (Minimal)', value: 'dashboard' as const },
]

const selectedScenario = ref<ScenarioKey>('saas')

const scenarioDataMap: Record<ScenarioKey, FooterData> = {
  saas: saasFooter,
  devtools: devToolsFooter,
  agency: agencyFooter,
  dashboard: dashboardFooter,
}

// ──────────────────────────────────────────────────────────────────────────────
// API Reference table data
// ──────────────────────────────────────────────────────────────────────────────
const footerPropsFields = [
  {
    name: 'data',
    type: 'FooterData',
    default: '—',
    desc: 'The full footer data object (required).',
  },
  {
    name: 'variant',
    type: "'Variant1' | 'Variant2' | 'Variant3'",
    default: "'Variant1'",
    desc: 'Selects the visual layout of the footer.',
  },
  {
    name: 'labels',
    type: 'FooterLabels?',
    default: '—',
    desc: 'Custom static text overrides (e.g. replacing "Subscribe" or "Follow us").',
  },
  {
    name: 'containerClass',
    type: 'string?',
    default: '—',
    desc: 'Custom CSS class applied to the root footer element.',
  },
]

const footerDataFields = [
  { name: 'brandName', type: 'string?', desc: 'Company or brand name.' },
  { name: 'brandLogo', type: 'string?', desc: 'URL to the brand logo image.' },
  {
    name: 'brandDescription',
    type: 'string?',
    desc: 'Tagline or short description below the brand.',
  },
  {
    name: 'linkGroups',
    type: 'FooterLinkGroup[]?',
    desc: 'Column-based link groups (e.g., Product, Company, Resources).',
  },
  {
    name: 'socialLinks',
    type: 'FooterSocialLink[]?',
    desc: 'Social media icon links (rendered as icon buttons).',
  },
  {
    name: 'copyright',
    type: 'string?',
    desc: "Copyright text (e.g., '© 2024 Acme Inc.').",
  },
  {
    name: 'legalLinks',
    type: 'FooterLink[]?',
    desc: 'Legal links in the bottom bar (e.g., Terms, Privacy Policy).',
  },
  {
    name: 'newsletter',
    type: 'FooterNewsletterConfig?',
    desc: 'Optional newsletter subscription section configuration.',
  },
  {
    name: 'badge',
    type: 'string?',
    desc: 'Small badge text near brand (e.g., version number).',
  },
]

const footerLinkGroupFields = [
  { name: 'title', type: 'string', desc: "Column heading (e.g., 'Product')." },
  { name: 'links', type: 'FooterLink[]', desc: 'Array of links in this group.' },
]

const footerLinkFields = [
  { name: 'label', type: 'string', desc: 'Display text for the link.' },
  { name: 'url', type: 'string', desc: 'Full URL (href).' },
  {
    name: 'external',
    type: 'boolean?',
    desc: 'Opens in a new tab with rel="noopener noreferrer".',
  },
  { name: 'icon', type: 'string?', desc: 'Optional leading Iconify icon name.' },
]

const footerSocialLinkFields = [
  { name: 'icon', type: 'string', desc: "Iconify icon name (e.g., 'lucide:instagram')." },
  { name: 'url', type: 'string', desc: 'Full URL for the social link.' },
  { name: 'label', type: 'string?', desc: 'Accessible label for screen readers.' },
]

function handleSubscribe(email: string) {
  alert(`Newsletter subscription: ${email}`)
}
</script>

<template>
  <div class="space-y-12 pb-20">
    <div class="space-y-4 pb-8 border-b border-border/50">
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Footer</h2>
      <p class="text-lg text-muted-foreground w-full max-w-[80%]">
        A flexible, API-driven footer component with 3 visual variants. Pass a JSON data object and
        the component auto-generates brand sections, link columns, social icons, newsletters, and
        legal links. Fully customizable through props, with complete dark mode support.
      </p>
    </div>

    <DemoSection title="Variants" :code="sourceCode">
      <div class="w-full space-y-8">
        <div
          class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border border-border rounded-xl bg-muted/30 px-5 py-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >Variant</label
            >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="v in variants"
                :key="v.value"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="
                  selectedVariant === v.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                "
                @click="selectedVariant = v.value">
                {{ v.label }}
              </button>
            </div>
            <p class="text-xs text-muted-foreground mt-1 italic">
              {{ variants.find((v) => v.value === selectedVariant)?.description }}
            </p>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >Scenario</label
            >
            <div class="flex flex-wrap gap-2">
              <button
                v-for="s in scenarios"
                :key="s.value"
                class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                :class="
                  selectedScenario === s.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                "
                @click="selectedScenario = s.value">
                {{ s.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="w-full border border-border rounded-xl overflow-hidden">
          <Footer
            :data="scenarioDataMap[selectedScenario]"
            :variant="selectedVariant"
            @subscribe="handleSubscribe" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="All Variants — SaaS Footer" :code="sourceCode">
      <div class="w-full grid grid-cols-1 gap-10">
        <div v-for="v in variants" :key="v.value" class="space-y-3">
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {{ v.label.split('—')[0].trim() }}
            </span>
            <span class="text-sm text-muted-foreground">{{ v.description }}</span>
          </div>
          <div class="border border-border rounded-xl overflow-hidden">
            <Footer :data="saasFooter" :variant="v.value" />
          </div>
        </div>
      </div>
    </DemoSection>

    <DemoSection title="With Newsletter — Dev Tools" :code="sourceCode">
      <div class="w-full border border-border rounded-xl overflow-hidden">
        <Footer :data="devToolsFooter" variant="Variant1" @subscribe="handleSubscribe" />
      </div>
    </DemoSection>

    <DemoSection title="Agency Footer — Rich Content (Variant 2)" :code="sourceCode">
      <div class="w-full border border-border rounded-xl overflow-hidden">
        <Footer :data="agencyFooter" variant="Variant2" />
      </div>
    </DemoSection>

    <DemoSection title="Dashboard Footer — Minimal (Variant 3)" :code="sourceCode">
      <div class="w-full border border-border rounded-xl overflow-hidden">
        <Footer :data="dashboardFooter" variant="Variant3" />
      </div>
    </DemoSection>

    <section class="space-y-6 pt-4">
      <h3 class="text-xl font-bold">API Reference</h3>

      <div>
        <h4 class="text-base font-semibold mb-3">FooterProps</h4>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th class="px-5 py-3">Prop</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Default</th>
                <th class="px-5 py-3">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="field in footerPropsFields" :key="field.name" class="hover:bg-muted/30">
                <td class="px-5 py-3 font-mono text-primary">{{ field.name }}</td>
                <td class="px-5 py-3 font-mono text-muted-foreground">{{ field.type }}</td>
                <td class="px-5 py-3 text-muted-foreground">{{ field.default }}</td>
                <td class="px-5 py-3">{{ field.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 class="text-base font-semibold mb-3">FooterData</h4>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th class="px-5 py-3">Field</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-sm">
              <tr v-for="field in footerDataFields" :key="field.name" class="hover:bg-muted/30">
                <td class="px-5 py-3 font-mono text-primary">{{ field.name }}</td>
                <td class="px-5 py-3 font-mono text-muted-foreground text-xs">{{ field.type }}</td>
                <td class="px-5 py-3 text-muted-foreground">{{ field.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 class="text-base font-semibold mb-3">FooterLinkGroup</h4>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th class="px-5 py-3">Field</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-sm">
              <tr
                v-for="field in footerLinkGroupFields"
                :key="field.name"
                class="hover:bg-muted/30">
                <td class="px-5 py-3 font-mono text-primary">{{ field.name }}</td>
                <td class="px-5 py-3 font-mono text-muted-foreground text-xs">{{ field.type }}</td>
                <td class="px-5 py-3 text-muted-foreground">{{ field.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 class="text-base font-semibold mb-3">FooterLink</h4>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th class="px-5 py-3">Field</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-sm">
              <tr v-for="field in footerLinkFields" :key="field.name" class="hover:bg-muted/30">
                <td class="px-5 py-3 font-mono text-primary">{{ field.name }}</td>
                <td class="px-5 py-3 font-mono text-muted-foreground text-xs">{{ field.type }}</td>
                <td class="px-5 py-3 text-muted-foreground">{{ field.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 class="text-base font-semibold mb-3">FooterSocialLink</h4>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th class="px-5 py-3">Field</th>
                <th class="px-5 py-3">Type</th>
                <th class="px-5 py-3">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-sm">
              <tr
                v-for="field in footerSocialLinkFields"
                :key="field.name"
                class="hover:bg-muted/30">
                <td class="px-5 py-3 font-mono text-primary">{{ field.name }}</td>
                <td class="px-5 py-3 font-mono text-muted-foreground text-xs">{{ field.type }}</td>
                <td class="px-5 py-3 text-muted-foreground">{{ field.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>
