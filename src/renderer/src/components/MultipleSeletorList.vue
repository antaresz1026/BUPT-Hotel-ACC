<script setup>
import { ref } from 'vue'
const props = defineProps(['info'])
const selected = defineModel('selected')
// const checkedNames = ref([])
// const items = [{id: "1", info: "1: 123"}, {id: "2", info: "2: 123"}, {id: "3", info: "3: 123"}]
console.log(props.info);
</script>

<template>
  <div>Checked names: {{ selected }}</div>
  <!-- <div v-for="(item, key) in items">
    <input type="checkbox" :id="key" :value="key" v-model="selected">
    <label :for="item.id">{{ item.info }}</label>
  </div> -->
  <table>
    <thead>
      <tr>
        <th></th>
        <th v-for="(value, key) in Object.values(props.info)[0]">
          {{ key }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in props.info">
        <input type="checkbox" :id="item.room_id" :value="item.room_id" v-model="selected">
        <td v-for="(value, key) in item">
          {{ value }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
