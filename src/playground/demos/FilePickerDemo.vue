<script setup lang="ts">
import BasicDemo from './FilePickerDemo/BasicDemo.vue'
import InputVariantDemo from './FilePickerDemo/InputVariantDemo.vue'
import MultiSelectDemo from './FilePickerDemo/MultiSelectDemo.vue'
import FileTypesDemo from './FilePickerDemo/FileTypesDemo.vue'
import Base64Demo from './FilePickerDemo/Base64Demo.vue'
import CustomTriggerDemo from './FilePickerDemo/CustomTriggerDemo.vue'
import StatesDemo from './FilePickerDemo/StatesDemo.vue'
</script>

<template>
  <div class="space-y-2 pb-20">
    <!-- Page Header -->
    <div class="flex flex-col space-y-2 pb-6 mb-6 border-b border-border/30">
      <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <span>Components</span>
        <span class="text-muted-foreground/40">›</span>
        <span class="text-foreground">FilePicker</span>
      </div>
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">FilePicker</h2>
      <p class="text-lg text-muted-foreground max-w-[70ch]">
        A versatile file selection component with drag &amp; drop support, multi-select, file type
        restrictions, base64 output, and a fully customizable trigger slot.
      </p>
    </div>

    <!-- Demo sections — each lives in its own focused file -->
    <BasicDemo />
    <InputVariantDemo />
    <MultiSelectDemo />
    <FileTypesDemo />
    <Base64Demo />
    <CustomTriggerDemo />
    <StatesDemo />
  </div>
</template>
