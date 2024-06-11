<script setup>
import { ref, watch } from 'vue'
import SingleSeletor from './components/SingleSeletor.vue'
import MyButton from './components/MyButton.vue'
// import InfoList from './components/InfoList.vue'
import InfoTable from './components/InfoTable.vue'
import { state, SendQuestBill, SendQuestBillStatement, BuildConnection, SendQuestRoomIdList, SendCheckIn, SendCheckOut } from './socket'

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
const bill_info = ref("");
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

</script> 

<template>

  
  <div class="card">
    <div class="box">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Bill Statement
          </p>
        </header>
        <div class="card-content">
          <InfoTable :info="bill_statement_info"/>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Bill Info
          </p>
        </header>
        <div class="card-content">
          {{ bill_info }}
        </div>
      </div>
    </div>
    <article>
      <div>Checkout room:</div>
      <SingleSeletor :options="room_id_list" v-model:selected="cur_room_id"/>
    </article>

    <MyButton class="button" msg="Build Connection" @toggle-button="BuildConnection"/>
    <footer class="card-footer">
      <div class="card-footer-item">
        <MyButton class="card-footer-item button is-inverted is-primary py-0" msg="Get Bill" @toggle-button="GetBill"/>
      </div>
      <div class="card-footer-item">
        <MyButton class="card-footer-item button is-inverted is-primary py-0" msg="Get Bill Statement" @toggle-button="GetBillStatement"/>
      </div>
      <div class="card-footer-item">
        <MyButton class="card-footer-item button is-inverted is-primary py-0" msg="Check In" @toggle-button="QuestCheckIn"/>
      </div>
      <div class="card-footer-item">
        <MyButton class="card-footer-item button is-inverted is-primary py-0" msg="Check Out" @toggle-button="QuestCheckOut"/>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import "src/renderer/src/assets/bulma.css"
</style>