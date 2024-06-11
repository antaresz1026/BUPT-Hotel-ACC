<script setup>
import { ref, watch } from 'vue'
import SingleSeletor from './components/SingleSeletor.vue'
import MyButton from './components/MyButton.vue'
// import InfoList from './components/InfoList.vue'
import InfoTable from './components/InfoTable.vue'

import { state, SendQuestBill, SendQuestBillStatement, BuildConnection, SendQuestRoomIdList, SendCheckIn, SendCheckOut } from './socket'

// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const remote = require('@electron/remote');
const config_data = remote.getGlobal('config_data');



// const props = defineProps(['state'])

function BillStatement(time, money, speed) {
  this.time = time;
  this.money = money;
  this.speed = speed;
}
const room_id_list = ref([1, 2, 3]);
const single_bill_statement = ref(new BillStatement(1, 2, 3));
const bill_statement_info = ref([single_bill_statement, single_bill_statement, single_bill_statement]);
// let target_room_id;
const cur_room_id = ref("");
const bill_info = ref("null");
console.log(bill_statement_info);

function GetBill() {
  SendQuestBill(cur_room_id.value);
}

function GetBillStatement() {
  SendQuestBillStatement(cur_room_id.value);
}

function GetRoomIdList() {
  SendQuestRoomIdList();
}

function QuestCheckIn() {
  SendCheckIn(cur_room_id.value);
}

function QuestCheckOut() {
  SendCheckOut(cur_room_id.value);
}

let is_self_introducted = false;

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
  if (state.value.replyRoomIdListEvents.length != 0) {
    // 只接受最新的房间号列表
    room_id_list.value = state.value.replyRoomIdListEvents.pop();
    state.value.replyRoomIdListEvents.length = 0;
  }
  if (state.value.connected == true && is_self_introducted == false) {
    is_self_introducted = true;
    SendSelfIntroduction("checkout", "");
    GetRoomIdList();
  }
})

function TryBuildConnection() {
  BuildConnection(config_data.URL);
}

function GetConfigData() {
  // Do nothing.
}

GetConfigData()
</script> 

<template>


<div class="card">
  <div class="card-content">
    <div class="box py-2 my-1">
      <div class="content">
        Bill Statement
        <InfoTable :info="bill_statement_info"/>
      </div>
    </div>
    <div class="box py-2 my-1">
      <div class="content">
        Bill Info:
        {{ bill_info }}
      </div>
    </div>
    <div class="box py-2 my-1">
      <div class="selector block mb-1 mt-1">Target Room:</div>
      <div class="selector select block is-normal mt-1 mb-5">
        <SingleSeletor :options="room_id_list" v-model:selected="cur_room_id"/>
      </div>
    </div>
    <div class="box py-2 my-1">
      <div class="buttons has-addons is-centered my-1">
        <MyButton class="button is-outlined is-primary column py-0" msg="Get Bill" @toggle-button="GetBill"/>
        <MyButton class="button is-outlined is-primary column py-0" msg="Get Bill Statement" @toggle-button="GetBillStatement"/>
        <MyButton class="button is-outlined is-primary column py-0" msg="Check In" @toggle-button="QuestCheckIn"/>
        <MyButton class="button is-outlined is-primary column py-0" msg="Check Out" @toggle-button="QuestCheckOut"/>
        <MyButton class="button is-outlined is-primary column py-0" msg="Build Connection" @toggle-button="TryBuildConnection"/>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
@import "src/renderer/src/assets/bulma.css";

/* .selector {
  white-space: inherit;
} */
</style>