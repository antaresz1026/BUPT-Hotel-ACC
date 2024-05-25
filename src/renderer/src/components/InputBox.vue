<script setup>
import { ref } from 'vue'
const props = defineProps(['hint_info'])
const model = defineModel('message')
</script>

<template>
    <div>{{hint_info}}: {{ model }}</div>
    <input v-model="model" placeholder="" />
</template>