<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Dropdown from '@/components/Dropdown/Dropdown.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './InputDemo.vue?raw'

const searchVal = ref('')
const copyVal = ref('npm install vlite3')
const emailVal = ref('')
const passwordVal = ref('')
const urlVal = ref('')
const priceVal = ref('')
const selectedProtocol = ref('https://')
const protocols = [
  { label: 'https://', value: 'https://' },
  { label: 'http://', value: 'http://' },
]

// Login form demo
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')
const loginLoading = ref(false)

const handleLogin = () => {
  loginError.value = ''
  if (!loginEmail.value || !loginPassword.value) {
    loginError.value = 'Please fill in all fields.'
    return
  }
  loginLoading.value = true
  setTimeout(() => {
    loginLoading.value = false
    alert(`Logged in as ${loginEmail.value}`)
  }, 1500)
}

// Profile form demo
const profileName = ref('Jane Smith')
const profileUsername = ref('janesmith')
const profileBio = ref('')
const profileWebsite = ref('')
</script>

<template>
  <div class="space-y-2 pb-20">
    <!-- Page Header -->
    <div class="flex flex-col space-y-2 pb-6 mb-6 border-b border-border/30">
      <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <span>Components</span>
        <span class="text-muted-foreground/40">›</span>
        <span class="text-foreground">Input</span>
      </div>
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Input</h2>
      <p class="text-lg text-muted-foreground max-w-[70ch]">
        A foundational text input component with support for labels, icons, addons, validation states,
        floating labels, password toggle, and a clear button. Handles every real-world form use case.
      </p>
    </div>

    <!-- ── Variants ───────────────────────────────────────────── -->
    <DemoSection title="Variants" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
        <Input label="Outline (Default)" placeholder="Start typing…" variant="outline" />
        <Input label="Solid" placeholder="Start typing…" variant="solid" />
        <Input label="Bottom Border" placeholder="Start typing…" variant="outline-b" />
        <Input label="Transparent" placeholder="Start typing…" variant="transparent" />
      </div>
    </DemoSection>

    <!-- ── Floating Label ─────────────────────────────────────── -->
    <DemoSection title="Floating Label" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
        <Input
          v-model="emailVal"
          label="Email Address"
          variant="floating"
          type="email"
          placeholder="you@example.com"
        />
        <Input
          v-model="passwordVal"
          label="Password"
          variant="floating"
          type="password"
        />
        <Input
          v-model="urlVal"
          label="Website URL"
          variant="floating"
          icon="lucide:globe"
        />
        <Input
          v-model="priceVal"
          label="Monthly Budget"
          variant="floating"
          type="number"
          addon-left="$"
        />
      </div>
    </DemoSection>

    <!-- ── Sizes ──────────────────────────────────────────────── -->
    <DemoSection title="Sizes" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 items-end w-full max-w-2xl">
        <Input label="Small" size="sm" placeholder="sm — compact" />
        <Input label="Medium" size="md" placeholder="md — default" />
        <Input label="Large" size="lg" placeholder="lg — roomy" />
      </div>
    </DemoSection>

    <!-- ── States ─────────────────────────────────────────────── -->
    <DemoSection title="States" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
        <Input label="Default" placeholder="Type something…" />
        <Input label="Disabled" disabled placeholder="Cannot interact" />
        <Input
          label="Error State"
          error="This field is required."
          placeholder="Invalid input"
        />
        <Input label="Loading / Validating" loading placeholder="Checking availability…" />
        <Input
          label="With Left Icon"
          icon="lucide:mail"
          placeholder="jon@example.com"
        />
        <Input
          label="With Right Icon"
          icon-right="lucide:calendar"
          placeholder="Pick a date…"
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
        />
        <Input
          label="Read-only"
          readonly
          model-value="This cannot be changed"
        />
      </div>
    </DemoSection>

    <!-- ── Label Positioning ──────────────────────────────────── -->
    <DemoSection title="Label Positioning" :code="sourceCode">
      <div class="space-y-5 w-full max-w-lg">
        <Input label="Top Label" label-position="top" placeholder="Default — top aligned" />
        <Input label="Left Label" label-position="left" placeholder="Label beside the input" />
        <Input label="Right Label" label-position="right" placeholder="Label on the right" />
      </div>
    </DemoSection>

    <!-- ── Input Groups & Addons ──────────────────────────────── -->
    <DemoSection title="Input Groups & Addons" :code="sourceCode">
      <div class="space-y-5 w-full max-w-2xl">
        <!-- Search with button -->
        <Input v-model="searchVal" placeholder="Search anything…" label="Search">
          <template #addon-right>
            <Button variant="primary" icon="lucide:search">Search</Button>
          </template>
        </Input>

        <!-- Protocol dropdown + URL -->
        <Input placeholder="example.com" label="Website URL">
          <template #addon-left>
            <Dropdown v-model="selectedProtocol" :options="protocols" class="w-24">
              <template #trigger="{ selectedLabel }">
                <Button variant="outline">{{ selectedLabel }}</Button>
              </template>
            </Dropdown>
          </template>
        </Input>

        <!-- Package install command + copy -->
        <Input v-model="copyVal" readonly label="Install Command">
          <template #addon-left>
            <Button variant="outline" size="sm" class="px-3">npm</Button>
          </template>
          <template #addon-right>
            <Button variant="outline" icon="lucide:copy">Copy</Button>
          </template>
        </Input>

        <!-- Static text addons -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Amount" addon-left="$" addon-right="USD" placeholder="0.00" type="number" />
          <Input label="Email" addon-right="@company.com" placeholder="username" />
        </div>
      </div>
    </DemoSection>

    <!-- ── Textarea ───────────────────────────────────────────── -->
    <DemoSection title="Textarea" :code="sourceCode">
      <div class="space-y-5 w-full max-w-2xl">
        <Input
          label="Description"
          type="textarea"
          placeholder="Write something here…"
          :rows="4"
        />
        <Input
          label="Bio (floating)"
          type="textarea"
          variant="floating"
          :rows="3"
        />
      </div>
    </DemoSection>

    <!-- ── Real-world: Login Form ─────────────────────────────── -->
    <DemoSection title="Real-world: Login Form" :code="sourceCode" align="center">
      <div class="w-full max-w-sm">
        <div class="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6">
          <div class="text-center space-y-1">
            <h3 class="text-xl font-bold text-foreground">Welcome back</h3>
            <p class="text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          <form class="space-y-4" @submit.prevent="handleLogin">
            <Input
              v-model="loginEmail"
              label="Email"
              type="email"
              placeholder="you@company.com"
              icon="lucide:mail"
              :error="loginError && !loginEmail ? 'Email is required' : ''"
            />
            <Input
              v-model="loginPassword"
              label="Password"
              type="password"
              placeholder="••••••••"
              :error="loginError && !loginPassword ? 'Password is required' : ''"
            />

            <p v-if="loginError && loginEmail && loginPassword" class="text-sm text-destructive">
              {{ loginError }}
            </p>

            <Button
              type="submit"
              variant="primary"
              class="w-full justify-center"
              :loading="loginLoading"
            >
              Sign In
            </Button>
          </form>

          <p class="text-center text-sm text-muted-foreground">
            No account?
            <a href="#" class="text-primary hover:underline font-medium">Create one</a>
          </p>
        </div>
      </div>
    </DemoSection>

    <!-- ── Real-world: Profile Form ───────────────────────────── -->
    <DemoSection title="Real-world: Profile Form" :code="sourceCode" align="stretch">
      <div class="w-full max-w-2xl space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input v-model="profileName" label="Full Name" icon="lucide:user" placeholder="Jane Smith" />
          <Input
            v-model="profileUsername"
            label="Username"
            addon-left="@"
            placeholder="janesmith"
          />
        </div>
        <Input
          v-model="profileBio"
          label="Bio"
          type="textarea"
          placeholder="Tell us a little about yourself…"
          :rows="3"
        />
        <Input
          v-model="profileWebsite"
          label="Website"
          icon="lucide:globe"
          placeholder="https://yoursite.com"
        />
        <div class="flex justify-end gap-3 pt-2 border-t border-border/50">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary" icon="lucide:check">Save Profile</Button>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
