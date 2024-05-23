<script setup>
import { ref } from 'vue'
// const props = defineProps(['options'])
const model = defineModel('selected')
const checkedNames = ref([])
const items = [{id: "1", info: "1: 123"}, {id: "2", info: "2: 123"}, {id: "3", info: "3: 123"}]
console.log(items)
</script>

<template>
    <div>Checked names: {{ model = checkedNames }}</div>
    <div v-for="(item) in items">
        <input type="checkbox" :id="item.id" :value="item.id" v-model="checkedNames">
        <label :for="item.id">{{ item.info }}</label>
    </div>
</template>