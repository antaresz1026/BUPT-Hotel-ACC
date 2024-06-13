<script setup>
import { ref } from 'vue'
const props = defineProps(['info'])
</script>

<template>
  <div class="table-container">
    <table class="table is-striped is-hoverable is-fullwidth">
      <thead>
        <tr>
          <th v-for="(value, key) in props.info[0]._value">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in props.info">
          <td v-for="(value, key) in item._value">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@import "../assets/bulma.css"
</style>