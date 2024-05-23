<script setup>
import { ref } from 'vue';
import SingleSeletor from './components/SingleSeletor.vue'
import MyButton from './components/MyButton.vue'
// import InfoList from './components/InfoList.vue'
import InfoTable from './components/InfoTable.vue'

function BillStatement(time, money, speed) {
  this.time = time
  this.money = money
  this.speed = speed
}
const room_id_list = ref([1, 2, 3])
const bill_data = ref(new BillStatement(1, 2, 3))
const bill_statement_info = ref([bill_data, bill_data, bill_data])
let target_room_id
console.log(bill_statement_info)
</script> 

<template>
    <InfoTable :info="bill_statement_info"/>
    <article>
        <div>Checkout room:</div>
        <SingleSeletor :options="room_id_list" :selected="target_room_id"/>
    </article>
    <MyButton msg="Get Bill"/>
    <MyButton msg="Get Bill Statement"/>
</template>