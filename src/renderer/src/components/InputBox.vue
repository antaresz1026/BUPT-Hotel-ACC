<script setup>
import { ref } from 'vue'
const props = defineProps(['hint_info'])
const model = defineModel('message')
</script>

<template>
    <p>{{hint_info}}: {{ model }}</p>
    <input v-model="model" placeholder="" />
</template>