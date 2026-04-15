<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const form = ref({
  name: '',
  email: '',
  role: '',
  department: '',
  status: 'active',
})

const roles = ['Admin', 'Developer', 'Designer', 'Manager', 'HR', 'Marketing']
const departments = ['Engineering', 'Design', 'Marketing', 'Management', 'Human Resources', 'IT']
const statuses = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
]

const submitting = ref(false)

const handleSubmit = async () => {
  if (!form.value.name || !form.value.email) return
  submitting.value = true
  await new Promise((r) => setTimeout(r, 800))
  submitting.value = false
  alert(`User "${form.value.name}" added successfully!`)
  emit('close')
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <!-- Full Name -->
    <Input
      v-model="form.name"
      label="Full Name"
      placeholder="e.g. Jane Smith"
      icon="lucide:user"
      required
    />

    <!-- Email -->
    <Input
      v-model="form.email"
      label="Email Address"
      type="email"
      placeholder="jane@company.com"
      icon="lucide:mail"
      required
    />

    <!-- Role & Department -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">Role</label>
        <select
          v-model="form.role"
          class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
        >
          <option value="" disabled>Select role…</option>
          <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-foreground">Department</label>
        <select
          v-model="form.department"
          class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
        >
          <option value="" disabled>Select dept…</option>
          <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
    </div>

    <!-- Status -->
    <div class="space-y-1.5">
      <label class="text-sm font-medium text-foreground">Status</label>
      <div class="flex gap-3">
        <label
          v-for="s in statuses"
          :key="s.value"
          class="flex items-center gap-2 cursor-pointer"
        >
          <input type="radio" :value="s.value" v-model="form.status" class="accent-primary" />
          <span class="text-sm text-foreground">{{ s.label }}</span>
        </label>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-2 border-t border-border/50">
      <Button type="button" variant="outline" @click="emit('close')">Cancel</Button>
      <Button type="submit" variant="primary" :loading="submitting" icon="lucide:user-plus">
        Add User
      </Button>
    </div>
  </form>
</template>
