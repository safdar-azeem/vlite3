<script setup lang="ts">
import BasicLogin from './basic/BasicLogin.vue'
import BasicContact from './basic/BasicContact.vue'
</script>

<template>
  <div class="space-y-12">
    <div>
      <h3 class="text-lg font-semibold mb-2">Login Form</h3>
      <p class="text-sm text-gray-500 mb-6">
        Simple login form with email, password, and remember me.
      </p>
      <BasicLogin />
    </div>

    <hr class="border-border" />

    <div>
      <h3 class="text-lg font-semibold mb-2">Contact Form</h3>
      <p class="text-sm text-gray-500 mb-6">
        Contact form with dropdown, textarea, and grid layout.
      </p>
      <BasicContact />
    </div>
  </div>
</template>
