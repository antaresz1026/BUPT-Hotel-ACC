<script setup>
import { ref, computed} from 'vue'
const props = defineProps(['info'])
const selected = defineModel('selected')
// const checkedNames = ref([])
// const items = [{id: "1", info: "1: 123"}, {id: "2", info: "2: 123"}, {id: "3", info: "3: 123"}]
console.log(props.info);

// const isSelected = computed((item) => ({
//   'is-selected': item != undefined && item.hasOwn(room_id) && selected.value.indexOf(item.room_id) != -1
// }))

const isSelected = computed(() => {
  return (item) => {
    if (item && selected.value.includes(item.room_id)) { 
      return 'is-selected';
    }
  };
});

</script>

<template>
  <div class="has-text-primary">Checked names: {{ selected }}</div>
  <!-- <div v-for="(item, key) in items">
    <input type="checkbox" :id="key" :value="key" v-model="selected">
    <label :for="item.id">{{ item.info }}</label>
  </div> -->
  <table class="table is-striped is-hoverable is-fullwidth">
    <thead>
      <tr>
        <th></th>
        <th v-for="(value, key) in Object.values(props.info)[0]">
          {{ key }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in props.info" :class="isSelected(item)">
        <td>
          <input type="checkbox" :id="item.room_id" :value="item.room_id" v-model="selected">
        </td>
        <td v-for="(value, key) in item">
          {{ value }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
@import "src/renderer/src/assets/bulma.css"
</style>