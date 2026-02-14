<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/Input.vue'
import Textarea from '@/components/Textarea.vue'
import Switch from '@/components/Switch.vue'
import CheckBox from '@/components/CheckBox.vue'
import ColorPicker from '@/components/ColorPicker/ColorPicker.vue'
import Label from '@/components/Label.vue'
import Slider from '@/components/Slider.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './InputsDemo.vue?raw'

const inputValue = ref('')
const lazyValue = ref('')
const passwordValue = ref('')
const switchValue = ref(false)
const checkValue = ref(false)
const colorValue = ref('#4f46e5')
const textareaValue = ref('')
const sliderValue = ref(50)
const sliderRangeValue = ref(75)
const sliderBipolarValue = ref(0)
</script>

<template>
  <DemoSection title="Forms & Inputs" :code="sourceCode">
     <div class="space-y-2">
      <h2 class="text-xl font-semibold tracking-tight">Forms & Inputs</h2>
      <p class="text-sm text-gray-500">
        Input fields, toggles, sliders, and other form controls.
      </p>
    </div>

    <!-- Inputs Grid -->
    <div class="grid gap-x-8 gap-y-12 xl:grid-cols-2">
      <!-- Standard Inputs -->
      <div class="space-y-6">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Text Inputs</h3>
        
        <div class="space-y-4">
           <!-- Variants Row -->
           <div class="grid gap-4 sm:grid-cols-2">
              <Input label="Outline (Default)" placeholder="Outline variant" variant="outline" />
              <Input label="Solid" placeholder="Solid variant" variant="solid" />
           </div>
           
           <div class="grid gap-4 sm:grid-cols-2">
              <Input label="Outline Bottom" placeholder="Border bottom only" variant="outline-b" />
              <Input label="Transparent" placeholder="No border" variant="transparent" />
           </div>

           <!-- Sizes -->
           <div class="grid gap-4 sm:grid-cols-3 items-end">
              <Input label="Small" placeholder="sm" size="sm" />
              <Input label="Medium" placeholder="md" size="md" />
              <Input label="Large" placeholder="lg" size="lg" />
           </div>
           
           <!-- States -->
           <div class="grid gap-4 sm:grid-cols-2">
              <Input label="Disabled" placeholder="Cannot type..." disabled />
              <Input label="Error State" placeholder="Invalid input..." error="This field is required" model-value="Wrong value" />
           </div>
        </div>
      </div>

     <!-- Enhanced Inputs -->
      <div class="space-y-6">
         <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Enhanced Inputs</h3>
         <div class="space-y-4">
            <Input label="With Icon" icon="lucide:user" placeholder="Username" />
            <Input label="With Right Icon" icon-right="lucide:mail" placeholder="Email address" />
            <Input label="Loading State" loading placeholder="Validating..." />
            <Input label="Password" type="password" placeholder="Enter password" v-model="passwordValue" />
            
            <div class="grid gap-4 sm:grid-cols-2">
              <Input label="Website" addon-left="https://" placeholder="example.com" />
              <Input label="Price" addon-left="$" addon-right=".00" placeholder="0.00" />
            </div>
         </div>
      </div>
    </div>

    <!-- Interactive Controls -->
    <div class="grid gap-x-8 gap-y-12 md:grid-cols-2">
       <!-- Toggles & Checks -->
       <div class="space-y-6">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Selection Controls</h3>
          <div class="space-y-6 p-6 border border-border rounded-lg bg-gray-50/50">
             <div class="flex items-center justify-between">
                <div>
                   <Label class="text-base">Push Notifications</Label>
                   <p class="text-xs text-gray-500">Receive updates instantly</p>
                </div>
                <Switch v-model="switchValue" />
             </div>
             
             <div class="flex items-center gap-3">
                <CheckBox v-model:checked="checkValue" id="terms" />
                <Label for="terms" class="cursor-pointer">I accept the terms and conditions</Label>
             </div>

             <div class="flex flex-col gap-2 pt-2">
                <Label>Accent Color</Label>
                <ColorPicker v-model="colorValue" />
             </div>
          </div>
       </div>

       <!-- Sliders -->
       <div class="space-y-6">
           <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Sliders</h3>
           <div class="space-y-8 p-6 border border-border rounded-lg bg-gray-50/50">
              <Slider label="Volume" icon="lucide:volume-2" v-model="sliderValue" />
              <Slider label="Range (50-200)" :min="50" :max="200" v-model="sliderRangeValue" />
              <Slider label="Balance (-50 to 50)" :min="-50" :max="50" v-model="sliderBipolarValue" />
           </div>
       </div>
    </div>
    
    <!-- Textarea -->
    <div class="space-y-2">
       <Label>Feedback</Label>
       <Textarea placeholder="Share your thoughts..." v-model="textareaValue" :rows="4" />
    </div>

  </DemoSection>
</template>
