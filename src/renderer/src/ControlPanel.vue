<script setup>
import { ref, watch } from 'vue'
import MultipleSeletorList from './components/MultipleSeletorList.vue'
import SingleSeletor from './components/SingleSeletor.vue'
import MyButton from './components/MyButton.vue'
import InputBox from './components/InputBox.vue'

import { state, SendChangeRoomState } from './socket'

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


// 监视接受到的报文
watch(state, async () => {
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
      let cur_state = new_state.shift();
      new_all_room_state[cur_state.room_id] = new_state;
    }
    all_room_state.value = new_all_room_state;
  }
})

// 客房状态构建函数
function RoomState(temperature, fan_speed, cost, room_temperature, is_open, is_working) {
  // if (room_id != undefined) {
  //   this.room_id = room_id;
  // }
  if (temperature != undefined) {
    RoomState.temperature = temperature;
  }
  if (fan_speed != undefined) {
    RoomState.fan_speed = fan_speed;
  }
  if (cost != undefined) {
    RoomState.cost = cost;
  }
  if (room_temperature != undefined) {
    RoomState.room_temperature = room_temperature;
  }
  if (is_open != undefined) {
    RoomState.is_open = is_open;
  }
  if (is_working != undefined) {
    RoomState.is_working = is_working;
  }
}

function CommitRoomStateChange() {
  // SendChangeRoomState(
  //                     selected_room_id, 
  //                     RoomState(temperature.value, 
  //                               selected_fan_speed.value, 
  //                               undefined, 
  //                               undefined, 
  //                               air_condition_map[selected_open_state.value]
  //                              )
  //                    );
  ResetInput();
}

function ResetInput() {
  temperature.value = undefined;
  selected_open_state.value = undefined;
  selected_fan_speed.value = undefined;
  selected_room_id.value = [];
  console.log(selected_room_id.value);
}
</script> 

<template>
  <MultipleSeletorList :info="test_info" v-model:selected="selected_room_id"/>
  <article>
    <div>Air-Conditioner State:</div>
    <SingleSeletor :options="air_condition_state" v-model:selected="selected_open_state"/>
  </article>
  <article>
    <InputBox hint_info="Temperature" v-model:message="temperature"/>
  </article>
  <article>
    <div>Fan Speed:</div>
    <SingleSeletor :options="fan_speed_name" v-model:selected="selected_fan_speed"/>
  </article>
  <article>
    <MyButton msg="Commit" @toggle-button="CommitRoomStateChange"/>
  </article>
</template>