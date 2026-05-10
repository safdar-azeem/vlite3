<script setup lang="ts">
/**
 * FadeOverlay.demo.vue
 * Shows all three use cases with live controls.
 */
import { ref } from 'vue'
import FadeOverlay from '@/components/FadeOverlay.vue'

// ── Scrim controls ────────────────────────────────────────────────────────────
const scrimCoverage = ref(55)
const scrimFadeStart = ref(20)

// ── Scroll-fade controls ──────────────────────────────────────────────────────
const scrollColor = ref('#ffffff')

// ── Blur controls ─────────────────────────────────────────────────────────────
const blurAmount = ref(16)
const blurTintOpacity = ref(0)
const blurColor = ref('#000000')

const blurVariantLabel = computed(() => {
  if (blurTintOpacity.value === 0) return 'Pure vibrancy (macOS)'
  if (blurTintOpacity.value <= 0.3) return 'Frosted glass (iOS)'
  return 'Cinematic dark'
})

import { computed } from 'vue'
</script>

<template>
  <div
    style="
      font-family: 'Inter', system-ui, sans-serif;
      background: #0f0f0f;
      min-height: 100vh;
      padding: 40px 24px;
      color: #fff;
      box-sizing: border-box;
    ">
    <h1
      style="
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #666;
        margin: 0 0 40px;
      ">
      FadeOverlay · Component Demo
    </h1>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 40px;
        max-width: 1100px;
      ">
      <!-- ── 1. SCRIM ───────────────────────────────────────────────────────── -->
      <section>
        <p
          style="
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #555;
            margin: 0 0 12px;
          ">
          01 — Image scrim
        </p>

        <div
          style="
            position: relative;
            overflow: hidden;
            border-radius: 16px;
            aspect-ratio: 3/4;
            background: #111;
          ">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=85"
            alt="Mountain"
            style="width: 100%; height: 100%; object-fit: cover; display: block" />

          <FadeOverlay
            direction="bottom"
            :coverage="`${scrimCoverage}%`"
            :fadeStart="`${scrimFadeStart}%`"
            fadeEnd="100%"
            color="#000000"
            easing="smooth" />

          <!-- Card text -->
          <div
            style="
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              padding: 24px;
              z-index: 20;
              pointer-events: none;
            ">
            <p
              style="
                margin: 0 0 6px;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.6);
              ">
              Featured trail
            </p>
            <h2
              style="
                margin: 0 0 10px;
                font-size: 22px;
                font-weight: 700;
                line-height: 1.2;
                color: #fff;
              ">
              American Cordillera Trails
            </h2>
            <div style="display: flex; gap: 14px; align-items: center">
              <span style="font-size: 13px; color: rgba(255, 255, 255, 0.75)">⏱ 2 days</span>
              <span style="font-size: 13px; color: rgba(255, 255, 255, 0.75)">★ 4.8 / 5</span>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 10px">
          <label
            style="font-size: 12px; color: #666; display: flex; justify-content: space-between">
            coverage
            <span style="color: #999">{{ scrimCoverage }}%</span>
          </label>
          <input type="range" min="20" max="100" v-model="scrimCoverage" style="width: 100%" />

          <label
            style="font-size: 12px; color: #666; display: flex; justify-content: space-between">
            fadeStart
            <span style="color: #999">{{ scrimFadeStart }}%</span>
          </label>
          <input type="range" min="0" max="80" v-model="scrimFadeStart" style="width: 100%" />
        </div>

        <!-- Usage -->
        <pre
          style="
            margin-top: 20px;
            padding: 14px 16px;
            border-radius: 8px;
            background: #1a1a1a;
            border: 0.5px solid #2a2a2a;
            font-size: 11px;
            color: #888;
            overflow-x: auto;
            line-height: 1.7;
          "><code><span style="color: #555;">&lt;</span><span style="color: #a78bfa;">FadeOverlay</span>
  direction<span style="color: #555;">=</span><span style="color: #86efac;">"bottom"</span>
  coverage<span style="color: #555;">=</span><span style="color: #86efac;">"{{ scrimCoverage }}%"</span>
  fadeStart<span style="color: #555;">=</span><span style="color: #86efac;">"{{ scrimFadeStart }}%"</span>
  color<span style="color: #555;">=</span><span style="color: #86efac;">"#000000"</span>
  easing<span style="color: #555;">=</span><span style="color: #86efac;">"smooth"</span> <span style="color: #555;">/&gt;</span></code></pre>
      </section>

      <!-- ── 2. SCROLL FADE ─────────────────────────────────────────────────── -->
      <section>
        <p
          style="
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #555;
            margin: 0 0 12px;
          ">
          02 — Scroll-edge fade
        </p>

        <div
          style="
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            background: #1c1c1e;
            border: 0.5px solid #2a2a2a;
          ">
          <!-- Scrollable list -->
          <div style="height: 300px; overflow-y: auto; padding: 20px">
            <div
              v-for="i in 20"
              :key="i"
              style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 0;
                border-bottom: 0.5px solid #2a2a2a;
              ">
              <div
                style="
                  width: 36px;
                  height: 36px;
                  border-radius: 8px;
                  flex-shrink: 0;
                  background: linear-gradient(135deg, #333, #222);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 14px;
                  color: #666;
                ">
                {{ i }}
              </div>
              <div>
                <p style="margin: 0; font-size: 13px; color: #e5e5e5">Trail segment {{ i }}</p>
                <p style="margin: 0; font-size: 11px; color: #555">
                  {{ (i * 2.3).toFixed(1) }} km · {{ i * 40 + 120 }}m elevation
                </p>
              </div>
            </div>
          </div>

          <!-- Top fade -->
          <FadeOverlay direction="top" coverage="60px" color="#1c1c1e" easing="smooth" />

          <!-- Bottom fade -->
          <FadeOverlay direction="bottom" coverage="80px" color="#1c1c1e" easing="smooth" />
        </div>

        <!-- Controls -->
        <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 10px">
          <label style="font-size: 12px; color: #666"> color (match your container bg) </label>
          <input
            type="color"
            v-model="scrollColor"
            style="
              width: 48px;
              height: 28px;
              border: none;
              background: none;
              cursor: pointer;
              border-radius: 4px;
            " />
        </div>

        <pre
          style="
            margin-top: 20px;
            padding: 14px 16px;
            border-radius: 8px;
            background: #1a1a1a;
            border: 0.5px solid #2a2a2a;
            font-size: 11px;
            color: #888;
            overflow-x: auto;
            line-height: 1.7;
          "><code><span style="color: #555;">&lt;!-- top + bottom pair --&gt;</span>
<span style="color: #555;">&lt;</span><span style="color: #a78bfa;">FadeOverlay</span>
  direction<span style="color: #555;">=</span><span style="color: #86efac;">"top"</span>
  coverage<span style="color: #555;">=</span><span style="color: #86efac;">"60px"</span>
  color<span style="color: #555;">=</span><span style="color: #86efac;">"#1c1c1e"</span> <span style="color: #555;">/&gt;</span>
<span style="color: #555;">&lt;</span><span style="color: #a78bfa;">FadeOverlay</span>
  direction<span style="color: #555;">=</span><span style="color: #86efac;">"bottom"</span>
  coverage<span style="color: #555;">=</span><span style="color: #86efac;">"80px"</span>
  color<span style="color: #555;">=</span><span style="color: #86efac;">"#1c1c1e"</span> <span style="color: #555;">/&gt;</span></code></pre>
      </section>

      <!-- ── 3. BLUR ────────────────────────────────────────────────────────── -->
      <section>
        <p
          style="
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #555;
            margin: 0 0 12px;
          ">
          03 — Blur / frosted glass
          <span
            style="
              color: #444;
              font-weight: 400;
              text-transform: none;
              letter-spacing: 0;
              margin-left: 8px;
            ">
            {{ blurVariantLabel }}
          </span>
        </p>

        <div
          style="
            position: relative;
            overflow: hidden;
            border-radius: 16px;
            aspect-ratio: 3/4;
            background: #111;
          ">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700&q=85"
            alt="Forest"
            style="width: 100%; height: 100%; object-fit: cover; display: block" />

          <FadeOverlay
            direction="bottom"
            coverage="60%"
            :blur="+blurAmount"
            :tintOpacity="blurTintOpacity"
            :color="blurColor"
            easing="smooth" />

          <!-- Card text -->
          <div
            style="
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              padding: 24px;
              z-index: 20;
              pointer-events: none;
            ">
            <p
              style="
                margin: 0 0 6px;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.55);
              ">
              Nature reserve
            </p>
            <h2
              style="
                margin: 0 0 10px;
                font-size: 22px;
                font-weight: 700;
                line-height: 1.2;
                color: #fff;
              ">
              Pacific Forest Trail
            </h2>
            <div style="display: flex; gap: 14px; align-items: center">
              <span style="font-size: 13px; color: rgba(255, 255, 255, 0.7)">⏱ 4 hours</span>
              <span style="font-size: 13px; color: rgba(255, 255, 255, 0.7)">★ 4.6 / 5</span>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 10px">
          <label
            style="font-size: 12px; color: #666; display: flex; justify-content: space-between">
            blur
            <span style="color: #999">{{ blurAmount }}px</span>
          </label>
          <input type="range" min="4" max="40" v-model="blurAmount" style="width: 100%" />

          <label
            style="font-size: 12px; color: #666; display: flex; justify-content: space-between">
            tintOpacity
            <span style="color: #999">{{ blurTintOpacity }}</span>
          </label>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            v-model="blurTintOpacity"
            style="width: 100%" />

          <div style="display: flex; align-items: center; gap: 10px">
            <label style="font-size: 12px; color: #666">tint color</label>
            <input
              type="color"
              v-model="blurColor"
              style="
                width: 48px;
                height: 28px;
                border: none;
                background: none;
                cursor: pointer;
                border-radius: 4px;
              " />
          </div>
        </div>

        <pre
          style="
            margin-top: 20px;
            padding: 14px 16px;
            border-radius: 8px;
            background: #1a1a1a;
            border: 0.5px solid #2a2a2a;
            font-size: 11px;
            color: #888;
            overflow-x: auto;
            line-height: 1.7;
          "><code><span style="color: #555;">&lt;</span><span style="color: #a78bfa;">FadeOverlay</span>
  direction<span style="color: #555;">=</span><span style="color: #86efac;">"bottom"</span>
  coverage<span style="color: #555;">=</span><span style="color: #86efac;">"60%"</span>
  <span style="color: #fbbf24;">:blur</span><span style="color: #555;">=</span><span style="color: #86efac;">"{{ blurAmount }}"</span>
  <span style="color: #fbbf24;">:tintOpacity</span><span style="color: #555;">=</span><span style="color: #86efac;">"{{ blurTintOpacity }}"</span>
  color<span style="color: #555;">=</span><span style="color: #86efac;">"{{ blurColor }}"</span>
  easing<span style="color: #555;">=</span><span style="color: #86efac;">"smooth"</span> <span style="color: #555;">/&gt;</span></code></pre>
      </section>
    </div>

    <!-- ── Prop reference ────────────────────────────────────────────────────── -->
    <div style="margin-top: 60px; max-width: 1100px">
      <p
        style="
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #444;
          margin: 0 0 16px;
        ">
        Prop reference
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px">
        <thead>
          <tr style="border-bottom: 0.5px solid #2a2a2a">
            <th style="text-align: left; padding: 8px 12px; color: #555; font-weight: 500">Prop</th>
            <th style="text-align: left; padding: 8px 12px; color: #555; font-weight: 500">Type</th>
            <th style="text-align: left; padding: 8px 12px; color: #555; font-weight: 500">
              Default
            </th>
            <th style="text-align: left; padding: 8px 12px; color: #555; font-weight: 500">Mode</th>
            <th style="text-align: left; padding: 8px 12px; color: #555; font-weight: 500">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in propTable" :key="row.prop" style="border-bottom: 0.5px solid #1e1e1e">
            <td style="padding: 8px 12px; color: #a78bfa; font-family: monospace">
              {{ row.prop }}
            </td>
            <td style="padding: 8px 12px; color: #86efac; font-family: monospace">
              {{ row.type }}
            </td>
            <td style="padding: 8px 12px; color: #fbbf24; font-family: monospace">
              {{ row.default }}
            </td>
            <td style="padding: 8px 12px; color: #666">{{ row.mode }}</td>
            <td style="padding: 8px 12px; color: #555">{{ row.notes }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      propTable: [
        {
          prop: 'direction',
          type: "'top'|'bottom'|'left'|'right'",
          default: "'bottom'",
          mode: 'both',
          notes: 'Which edge the overlay anchors to',
        },
        {
          prop: 'coverage',
          type: 'string|number',
          default: "'100%'",
          mode: 'both',
          notes: 'How much of the parent to cover. Any CSS length.',
        },
        {
          prop: 'fadeStart',
          type: 'string|number',
          default: "'0%'",
          mode: 'both',
          notes: '% of coverage where transparent end begins',
        },
        {
          prop: 'fadeEnd',
          type: 'string|number',
          default: "'100%'",
          mode: 'both',
          notes: '% of coverage where opaque end finishes',
        },
        {
          prop: 'color',
          type: 'string',
          default: "'#000000'",
          mode: 'both',
          notes: 'Scrim color (scrim) or tint color (blur)',
        },
        {
          prop: 'easing',
          type: "'linear'|'smooth'",
          default: "'smooth'",
          mode: 'both',
          notes: 'smooth = 13-stop Material scrim curve',
        },
        {
          prop: 'opacity',
          type: 'string|number',
          default: '1',
          mode: 'both',
          notes: 'Overall element opacity',
        },
        {
          prop: 'zIndex',
          type: 'string|number',
          default: '10',
          mode: 'both',
          notes: 'CSS z-index',
        },
        {
          prop: 'blendMode',
          type: 'CSSBlendMode',
          default: 'undefined',
          mode: 'both',
          notes: 'CSS mix-blend-mode',
        },
        {
          prop: 'blur',
          type: 'number|string',
          default: 'undefined',
          mode: 'blur only',
          notes: 'Activates blur mode. Number = px, string = as-is',
        },
        {
          prop: 'tintOpacity',
          type: 'number',
          default: '0',
          mode: 'blur only',
          notes: '0 = pure vibrancy · 0.3 = frost · 0.6 = cinematic',
        },
      ],
    }
  },
}
</script>
