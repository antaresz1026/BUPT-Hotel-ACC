<script setup>
import { ref } from 'vue'
const props = defineProps(['info'])
</script>

<template>
    <article>
        {{ props.info }}
    </article>
</template>