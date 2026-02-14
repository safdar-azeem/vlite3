<script setup lang="ts">
import Button from '@/components/Button.vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ButtonsDemo.vue?raw'
</script>

<template>
  <DemoSection title="Buttons" :code="sourceCode">
    <div class="space-y-2">
			<h2 class="text-xl font-semibold tracking-tight">Buttons</h2>
			<p class="text-sm text-gray-500">
				Button components with various variants, sizes, and states.
			</p>
		</div>

    <div class="space-y-8">
      <!-- Variants -->
      <div class="space-y-3">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Variants</h3>
        <div class="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <!-- Semantic -->
      <div class="space-y-3">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Semantic</h3>
        <div class="space-y-3">
          <!-- Solid -->
          <div class="flex flex-wrap gap-2">
            <Button variant="info">Info</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <!-- Light -->
          <div class="flex flex-wrap gap-2">
            <Button variant="primary-light">Primary Light</Button>
            <Button variant="info-light">Info Light</Button>
            <Button variant="success-light">Success Light</Button>
            <Button variant="warning-light">Warning Light</Button>
            <Button variant="danger-light">Danger Light</Button>
          </div>
          <!-- Outline -->
           <div class="flex flex-wrap gap-2">
            <Button variant="outline-primary">Outline Primary</Button>
            <Button variant="outline-info">Outline Info</Button>
            <Button variant="outline-success">Outline Success</Button>
            <Button variant="outline-warning">Outline Warning</Button>
            <Button variant="outline-danger">Outline Danger</Button>
          </div>
        </div>
      </div>

      <!-- Sizes & States -->
      <div class="space-y-3">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Sizes & States</h3>
        <div class="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <div class="w-px h-8 bg-gray-200 mx-2"></div>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button icon="lucide:settings">Icon Only</Button>
          <Button icon="lucide:mail" icon-right="lucide:arrow-right">With Icons</Button>
					<Button rounded="full">Rounded Full</Button>
        </div>
      </div>

      <!-- Button Groups -->
      <div class="space-y-3">
         <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Button Groups</h3>
         <div class="flex flex-wrap gap-8 items-start">
            <!-- Basic Attached -->
            <div class="space-y-2">
              <label class="text-xs text-gray-400">Attached (Default)</label>
              <ButtonGroup>
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </div>

            <!-- Detached -->
            <div class="space-y-2">
               <label class="text-xs text-gray-400">Detached (Gap 2)</label>
                <ButtonGroup :attached="false">
                  <Button variant="outline">One</Button>
                  <Button variant="outline">Two</Button>
                  <Button variant="outline">Three</Button>
                </ButtonGroup>
            </div>

            <!-- Vertical -->
            <div class="space-y-2">
              <label class="text-xs text-gray-400">Vertical</label>
              <ButtonGroup direction="vertical">
                <Button variant="secondary">Top</Button>
                <Button variant="secondary">Middle</Button>
                <Button variant="secondary">Bottom</Button>
              </ButtonGroup>
            </div>
         </div>
      </div>
    </div>
  </DemoSection>
</template>
