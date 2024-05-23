<script setup>
import { ref } from 'vue'
const props = defineProps(['msg'])
</script>

<template>
    <button @click="$emit('toggleButton')">
        {{ props.msg }}
    </button>
</template>