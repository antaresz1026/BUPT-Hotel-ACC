<script setup>
import { ref } from 'vue'
const props = defineProps(['hint_info'])
const model = defineModel('message')
</script>

<template>
    <div class="has-text-primary mt-1">{{hint_info}}: {{ model }}</div>
    <input class="input is-primary is-small my-1" v-model="model" placeholder="" />
</template>

<style scoped>
@import "../assets/bulma.css"
</style>