<script setup>
import { ref } from 'vue'
const props = defineProps(['options'])
const model = defineModel('selected')
</script>

<template>
    <select v-model="model" multiple>
        <option v-for="option in props.options" :value="option">
            {{ option }}
        </option>
    </select>
</template>