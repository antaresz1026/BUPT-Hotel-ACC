<script setup>
import { ref, watch } from 'vue'
import MultipleSeletorList from './components/MultipleSeletorList.vue'
import SingleSeletor from './components/SingleSeletor.vue'
import MyButton from './components/MyButton.vue'
import InputBox from './components/InputBox.vue'

import { state, SendChangeRoomState, BuildConnection, SendSelfIntroduction, SendQuestAllRoomState } from './socket'

// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const remote = require('@electron/remote');
const config_data = remote.getGlobal('config_data');



// const props = defineProps(['state'])

const fan_speed_name = ['low', 'medium', 'high']
const air_condition_state = ['off', 'on']
const temperature = ref();
const all_room_state = ref({});

const selected_room_id = ref([]);
const selected_fan_speed = ref();
const selected_open_state = ref();
const air_condition_map = {"off": false, "on": true};
const test_info = ref({"1": {room_id: "1", temperature: 1}, "2": {room_id: "2", temperature: 2}, "3": {room_id: "3", temperature: 3}});

function GetAllRoomState() {
  SendQuestAllRoomState();
}

let is_self_introducted = false;

// 监视接受到的报文
watch(state, async () => {
  console.log(state);
  if (state.value.changeRoomStateEvents.length != 0) {
    // 定位修改目标  
    // 修改指定值
    while (state.value.changeRoomStateEvents.length != 0) {
      let cur_state = state.value.changeRoomStateEvents.shift();
      if (all_room_state.value.hasOwn(cur_state.room_id)) {
        if (cur_state.hasOwn('temperature')) {
          all_room_state.value[cur_state.room_id].temperature = cur_state.temperature;
        }
        if (cur_state.hasOwn('fan_speed')) {
          all_room_state.value[cur_state.room_id].fan_speed = cur_state.fan_speed;
        }
        if (cur_state.hasOwn('cost')) {
          all_room_state.value[cur_state.room_id].cost = cur_state.cost;
        }
        if (cur_state.hasOwn('is_open')) {
          all_room_state.value[cur_state.room_id].is_open = cur_state.is_open;
        }
        if (cur_state.hasOwn('is_working')) {
          all_room_state.value[cur_state.room_id].is_working = cur_state.is_working;
        }
      }
    }
  }
  if (state.value.replyAllRoomStateEvents.length != 0) {
    // 循环遍历每个数组元素  
    // 向被显示的数据对象添加对应的成员
    let new_states = state.value.replyAllRoomStateEvents.pop();
    let new_all_room_state = {}
    state.value.replyAllRoomStateEvents.length = 0;
    while (new_states.length != 0) {
      let cur_state = new_states.shift();
      new_all_room_state[cur_state.room_id] = cur_state;
    }
    all_room_state.value = new_all_room_state;
  }
  if (state.value.connected == true && is_self_introducted == false) {
    is_self_introducted = true;
    SendSelfIntroduction("control", "");
    GetAllRoomState();
  }
})

// 客房状态构建函数
function RoomState(room_id, temperature, fan_speed, cost, room_temperature, is_open, is_working) {
  if (room_id != undefined) {
    this.room_id = room_id;
  }
  if (temperature != undefined) {
    // console.log(temperature);
    this.temperature = temperature;
  }
  if (fan_speed != undefined) {
    this.fan_speed = fan_speed;
  }
  if (cost != undefined) {
    this.cost = cost;
  }
  if (room_temperature != undefined) {
    this.room_temperature = room_temperature;
  }
  if (is_open != undefined) {
    this.is_open = is_open;
  }
  if (is_working != undefined) {
    this.is_working = is_working;
  }
}

function CommitRoomStateChange() {
  for (let index = 0; index < selected_room_id.value.length; index++) {
    const element = selected_room_id.value[index];
    SendChangeRoomState(
      element, 
      new RoomState(
        element,
        temperature.value, 
        selected_fan_speed.value, 
        undefined, 
        undefined, 
        air_condition_map[selected_open_state.value]
      )
    );
  }
  ResetInput();
}

function ResetInput() {
  temperature.value = undefined;
  selected_open_state.value = undefined;
  selected_fan_speed.value = undefined;
  selected_room_id.value = [];
}

function TryBuildConnection() {
  BuildConnection(config_data.URL);
}

function GetConfigData() {
  // Do nothing.
}

GetConfigData()
</script> 

<template>
  <div class="card has-background-primary-light">
    <div class="card-content">
      <div class="box py-2 my-1">
        <MultipleSeletorList :info="test_info" v-model:selected="selected_room_id"/>
      </div>
      <div class="box py-2 my-1">
        <div class="has-text-primary">
          Air-Conditioner State:
        </div>
        <div class="select is-small is-primary my-1">
          <SingleSeletor :options="air_condition_state" v-model:selected="selected_open_state"/>
        </div>
        <InputBox hint_info="Temperature" v-model:message="temperature"/>
        <div class="has-text-primary mt-1">
          Fan Speed:
        </div>
        <div class="select is-small is-primary my-1">
          <SingleSeletor :options="fan_speed_name" v-model:selected="selected_fan_speed"/>
        </div>
      </div>
      <div class="box py-2 my-1">
        <div class="buttons has-addons is-centered my-1">
            <MyButton class="button is-outlined is-primary column py-0" msg="Commit" @toggle-button="CommitRoomStateChange"/>
            <MyButton class="button is-outlined is-primary column py-0" msg="Build Connection" @toggle-button="TryBuildConnection"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "./assets/bulma.css"
</style>