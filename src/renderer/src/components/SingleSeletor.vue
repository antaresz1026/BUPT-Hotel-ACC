<script setup>
import { ref } from 'vue'
const props = defineProps(['options'])
const model = defineModel('selected')
</script>

<template>
    <select v-model="model">
        <option disabled value="">Please select one</option>
        <option v-for="option in options" :value="option">
            {{ option }}
        </option>
    </select>
</template>