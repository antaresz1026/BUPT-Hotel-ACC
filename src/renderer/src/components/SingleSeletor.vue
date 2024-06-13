<script setup>
import { ref } from 'vue'
const props = defineProps(['options'])
const model = defineModel('selected')
</script>

<template>
    <select v-model="model">
        <option disabled value="">Choose One</option>
        <option v-for="option in options" :value="option">
            {{ option }}
        </option>
    </select>
</template>