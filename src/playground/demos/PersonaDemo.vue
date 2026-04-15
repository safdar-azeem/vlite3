<script setup lang="ts">
import Persona from '@/components/Persona.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './PersonaDemo.vue?raw'
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-col space-y-2 pb-6 mb-8 border-b border-border/30">
      <h2 class="text-3xl font-bold tracking-tight text-foreground">Persona</h2>
      <p class="text-base text-muted-foreground w-full max-w-[800px]">
        A visual representation of a person, combining an avatar, presence indicator, and text
        details.
      </p>
    </div>

    <div class="flex flex-col w-full gap-2">
      <DemoSection title="Basic Config" :code="sourceCode">
        <div class="flex flex-wrap items-center justify-center gap-6 w-full">
          <Persona label="Olivia Martin" secondaryLabel="Frontend Engineer" />
          <Persona label="Jackson Lee" secondaryLabel="Online" presence="online" fallback="JL" />
          <Persona label="Primary Label" secondaryLabel="Label Theme" labelTheme="primary" fallback="PL" />
        </div>
      </DemoSection>

      <DemoSection title="Presence States" :code="sourceCode">
        <div class="flex flex-wrap items-center justify-center gap-6 w-full">
          <Persona presence="online" label="Online User" fallback="OU" />
          <Persona presence="offline" label="Offline User" fallback="OF" />
          <Persona presence="busy" label="Busy User" fallback="BU" />
          <Persona presence="dnd" label="Do Not Disturb" fallback="DN" />
          <Persona presence="away" label="Away User" fallback="AW" />
        </div>
      </DemoSection>

      <DemoSection title="Sizes" :code="sourceCode">
        <div class="flex flex-wrap items-end justify-center gap-8 w-full">
          <Persona size="xs" label="Extra Small" fallback="XS" />
          <Persona size="sm" label="Small User" secondaryLabel="Available" fallback="SM" />
          <Persona size="md" label="Medium Default" secondaryLabel="Available" fallback="MD" />
          <Persona size="lg" label="Large Persona" secondaryLabel="Design Team" fallback="LG" />
        </div>
      </DemoSection>

      <DemoSection title="Hide Details" :code="sourceCode">
        <div class="flex flex-wrap items-center justify-center gap-6 w-full">
          <Persona
            label="Hidden Name"
            secondaryLabel="Should not be visible"
            hideDetails
            presence="online"
            fallback="HD" />
          <span class="text-sm text-muted-foreground">&larr; Details are hidden by prop</span>
        </div>
      </DemoSection>

      <DemoSection title="Custom Avatars via Src" :code="sourceCode">
        <div class="flex flex-wrap items-center justify-center gap-6 w-full">
          <Persona
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80"
            alt="Isabella"
            label="Safdar Azeem"
            secondaryLabel="Project Manager"
            size="lg" />
        </div>
      </DemoSection>

      <DemoSection title="Navigation Link" :code="sourceCode">
        <div class="flex flex-wrap items-center justify-center gap-6 w-full">
          <Persona
            link="/components/persona"
            label="Click Me"
            secondaryLabel="Navigates via router-link"
            presence="online" />
        </div>
      </DemoSection>
    </div>
  </div>
</template>
