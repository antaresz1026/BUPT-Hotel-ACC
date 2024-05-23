<script setup>
import { ref } from 'vue'
const props = defineProps(['info'])
</script>

<template>
    <li v-for="item in info">
        {{ item }}
    </li>
</template>