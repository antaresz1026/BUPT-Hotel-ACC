<script setup>
import { ref, watch } from 'vue'
import SingleSeletor from './components/SingleSeletor.vue'
import MyButton from './components/MyButton.vue'
// import InfoList from './components/InfoList.vue'
import InfoTable from './components/InfoTable.vue'
import { state, SendQuestBill, SendQuestBillStatement } from './socket'

// const props = defineProps(['state'])

function BillStatement(time, money, speed) {
  this.time = time;
  this.money = money;
  this.speed = speed;
}
const room_id_list = ref([1, 2, 3]);
const single_bill_statement = ref(new BillStatement(1, 2, 3));
const bill_statement_info = ref([single_bill_statement, single_bill_statement, single_bill_statement]);
let target_room_id;
const cur_room_id = ref("");
const bill_info = ref(0);
console.log(bill_statement_info);

function GetBill() {
  SendQuestBill(target_room_id);
}

function GetBillStatement() {
  SendQuestBillStatement(target_room_id);
}

// 监视接受到的报文
watch(state, async () => {
  if (state.value.replyBillEvents.length != 0) {
    bill_info.value = state.value.replyBillEvents.length.pop();
    cur_room_id.value = state.value.replyBillEvents.length.pop();
    state.value.replyBillEvents.length = 0;
  }
  if (state.value.replyBillStatementEvents.length != 0) {
    bill_statement_info.value = state.value.replyBillEvents.length.pop();
    cur_room_id.value = state.value.replyBillEvents.length.pop();
    state.value.replyBillEvents.length = 0;
  }
  if (state.value.roomIdListEvents.length != 0) {
    // 只接受最新的房间号列表
    room_id_list.value = state.value.roomIdListEvents.pop();
    state.value.roomIdListEvents.length = 0;
  }
})

</script> 

<template>
  <InfoTable :info="bill_statement_info"/>
  <article>
    <div>Checkout room:</div>
    <SingleSeletor :options="room_id_list" :selected="target_room_id"/>
  </article>
  <MyButton msg="Get Bill" @toggle-button="GetBill"/>
  <MyButton msg="Get Bill Statement" @toggle-button="GetBillStatement"/>
</template>