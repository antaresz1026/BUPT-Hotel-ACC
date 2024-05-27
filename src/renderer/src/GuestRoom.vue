<script setup>
import { ref, watch } from 'vue'
import MyButton from './components/MyButton.vue'
import InfoBox from './components/InfoBox.vue'
import { state, SendSelfIntroduction, SendChangeRoomState } from './socket'
// import InputBox from './components/InputBox.vue'
// import SingleSeletor from './components/SingleSeletor.vue'
// import MultipleSeletor from './components/MultipleSeletor.vue'
// const props = defineProps(['state']);
// const options = ref(['One', 'Two', 'Three'])
// const message = ref("")

// 更新延迟 
const update_delay = 3000;
// 房间号
const room_id = ref("1");
// 金额
const cost = ref(0);
// 计费规则
const billing_rules = ref("");
// 空调状态
const air_condition_state = ref(Boolean(0));
function change_air_condition_state() {
  air_condition_state.value = !air_condition_state.value;
  UpdateOpenState();
}

let open_state_id;
function UpdateOpenState() {
  clearTimeout(open_state_id);
  open_state_id = setTimeout(SendChangeRoomState, update_delay, [room_id.value], RoomState(undefined, undefined, undefined, undefined, air_condition_state.value));
}

function air_condition_state_info() {
  if (air_condition_state.value) {
    return "On";
  } else {
    return "Off";
  }
}
function reversed_air_condition_state_info() {
  if (air_condition_state.value) {
    return "Off";
  } else {
    return "On";
  }
}

// 温度和温度限制
const temperature = ref(16);
const temp_upper_bound = 30;
const temp_lower_bound = 16;
function increase_temperature() {
  if (temperature.value != temp_upper_bound) {
    temperature.value = temperature.value + 1;
  }
  UpdateTemperature();
}
function decrease_temperature() {
  if (temperature.value != temp_lower_bound) {
    temperature.value = temperature.value - 1;
  }
  UpdateTemperature();
}

let temperature_id;
function UpdateTemperature() {
  clearTimeout(temperature_id);
  temperature_id = setTimeout(SendChangeRoomState, update_delay, [room_id.value], RoomState(temperature.value));
}

// 风速
const fan_speed = ref('low');
function adjust_fan_speed() {
  if (fan_speed.value == 'low') {
    fan_speed.value = 'medium'
  } else if (fan_speed.value == 'medium') {
    fan_speed.value = 'high'
  } else if (fan_speed.value == 'high') {
    fan_speed.value = 'low'
  }
  UpdateFanSpeed();
}

let fan_speed_id;
function UpdateFanSpeed() {
  clearTimeout(fan_speed_id);
  fan_speed_id = setTimeout(SendChangeRoomState, update_delay, [room_id.value], RoomState(undefined, fan_speed.value));
}

// 客房状态构建函数
function RoomState(temperature, fan_speed, cost, room_temperature, is_open, is_working) {
  // if (room_id != undefined) {
  //   this.room_id = room_id;
  // }
  if (temperature != undefined) {
    // console.log(temperature);
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

// 温度模拟  
const is_working = ref(false);
const base_temperature = 24;
const room_temperature = ref(base_temperature);
const passive_amount = 1;
const passive_time = 1;
const active_amount = 1;
const active_time = 1;

function Ticked() {
  if (is_working.value == false) {
    room_temperature.value += active_amount / active_time;
  } else {
    let temp_dis = base_temperature - room_temperature.value;
    // 如果环境温度大于房间温度  
    if (temp_dis > 0) {
      if (temp_dis > passive_amount / passive_time) {
        room_temperature.value += passive_amount / passive_time;
      } else {
        room_temperature.value = base_temperature;
      }
    } else if (temp_dis < 0) {
      // 如果环境温度小于房间温度  
      if (-temp_dis > passive_amount / passive_time) {
        room_temperature.value -= passive_amount / passive_time;
      } else {
        room_temperature.value = base_temperature;
      }
    }
  }
  // 构建状态并发送
  SendChangeRoomState(
    [room_id.value], 
    RoomState(room_temperature=room_temperature.value)
  );
}

// 客房状态修改函数  
function ChangeRoomState(room_state) {
  if (room_state.hasOwn('temperature')) {
    temperature.value = room_state.temperature;
  }
  if (room_state.hasOwn('fan_speed')) {
    fan_speed.value = room_state.fan_speed;
  }
  if (room_state.hasOwn('cost')) {
    cost.value = room_state.cost;
  }
  if (room_state.hasOwn('is_open')) {
    air_condition_state.value = room_state.is_open;
  }
  if (room_state.hasOwn('is_working')) {
    is_working.value = room_state.is_working;
  }
}

// 监视接受到的报文
watch(state, async () => {
  if (state.value.billingRuleEvents.length != 0) {
    // 只接受最新的计费规则
    billing_rules.value = state.value.billingRuleEvents.pop();
    state.value.billingRuleEvents.length = 0;
  }
  if (state.value.tickEvents != 0) {
    while (state.value.tickEvents.length != 0) {
      state.value.tickEvents.shift();
      Ticked();
    }
  }
  if (state.value.changeRoomStateEvents.length != 0) {
    while (state.value.changeRoomStateEvents.length != 0) {
      ChangeRoomState(state.value.changeRoomStateEvents.shift());
    }
  }
})



// function callback() {
//     console.log(message.value)
// }
</script> 

<template>
  <div class="guest_room">
    <InfoBox class="info" :info="'Fan Speed: ' + fan_speed"/>
    <InfoBox class="info" :info="'Temperature: ' + temperature + '℃'"/>
    <InfoBox class="info" :info="'Current Cost: ' + cost"/>
    <InfoBox class="info" :info="'Billing Rules: ' + billing_rules"/>
    <InfoBox class="info" :info="'Air-Conditioner is ' + air_condition_state_info() + '!'"/>
    <span>
      <MyButton class="button" :msg="'Turn ' + reversed_air_condition_state_info()" @toggle-button="change_air_condition_state"/>
      <MyButton class="button" msg="Decrease Temperature" @toggle-button="decrease_temperature"/>
      <MyButton class="button" msg="Adjust Fan Speed" @toggle-button="adjust_fan_speed"/>
      <MyButton class="button" msg="Increase Temperature" @toggle-button="increase_temperature"/>
    </span>
    <!-- <SingleSeletor v-model:options="options"/> -->
    <!-- <MultipleSeletor v-model:options="options"/> -->
  </div>
</template>

<style scoped>
.guest_room {
  background: #fff;
  margin: 2rem 2rem 4rem 2rem;
  padding: 1rem;
  /* padding-top: 0; */
  position: relative;
  box-shadow:
    0 2px 4px 0 rgba(0, 0, 0, 0.2),
    0 2.5rem 5rem 0 rgba(0, 0, 0, 0.1);
}
.button {
  padding: 0.8rem 1rem 0.7rem;
  width: 25%;
  border: 0.2rem solid #4d4d4d;
  cursor: pointer;
  text-transform: capitalize;
}
.info {
  padding: 0.8rem 1rem 0.7rem;
  border: 0.2rem solid #4d4d4d;
  text-align: center;
}
</style>