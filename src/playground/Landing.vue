<script setup lang="ts">
import Footer from '@/components/Footer/Footer.vue'
import { footerData } from './landing/data/footerData'
import './landing/shared.css'

import LandingHeader from './landing/LandingHeader.vue'
import HeroSection from './landing/HeroSection.vue'
import ShowcaseSection from './landing/ShowcaseSection.vue'
import FeaturesSection from './landing/FeaturesSection.vue'
import CategoriesSection from './landing/CategoriesSection.vue'
import CodeSection from './landing/CodeSection.vue'
</script>

<template>
  <div class="landing-root">
    <div v-once class="grid-bg" aria-hidden="true"></div>

    <LandingHeader />

    <main class="landing-main">
      <HeroSection />
      <ShowcaseSection />
      <FeaturesSection />
      <CategoriesSection />
    </main>
    <CodeSection />

    <Footer :data="footerData" variant="Variant1" />
  </div>
</template>

<style scoped>
/* ====================================
   Landing Page — Premium UI Library
   ==================================== */

/* Root */
.landing-root {
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  overflow-x: hidden;
  position: relative;
}

/* Ambient Background */
.grid-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(
      to right,
      color-mix(in srgb, var(--color-border) 40%, transparent) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-border) 40%, transparent) 1px,
      transparent 1px
    );
  background-size: 4rem 4rem;
  mask-image: linear-gradient(to bottom, black 0%, transparent 60%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 60%);
  opacity: 0.5;
}
</style>
