<script setup>
import { ref, watch } from 'vue'
import MyButton from './components/MyButton.vue'
import InfoBox from './components/InfoBox.vue'

import { state, SendSelfIntroduction, SendChangeRoomState, BuildConnection } from './socket'

// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const remote = require('@electron/remote');
const config_data = remote.getGlobal('config_data');
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
  open_state_id = setTimeout(SendChangeRoomState, update_delay, room_id.value, new RoomState(room_id.value, undefined, undefined, undefined, undefined, air_condition_state.value));
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
let temp_upper_bound = 30;
let temp_lower_bound = 16;
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
  temperature_id = setTimeout(SendChangeRoomState, update_delay, room_id.value, new RoomState(room_id.value, temperature.value));
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
  fan_speed_id = setTimeout(SendChangeRoomState, update_delay, room_id.value, new RoomState(room_id.value, undefined, fan_speed.value));
}

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

// 温度模拟  
const is_working = ref(false);
let base_temperature = 24;
const room_temperature = ref(base_temperature);
let cur_passive_amount = 1;
let cur_passive_time = 1;
let cur_active_amount = {"low": 0, "medium": 0, "high": 0};
let cur_active_time = {"low": 0, "medium": 0, "high": 0};

function Ticked() {
  if (is_working.value == false) {
    room_temperature.value += cur_active_amount[fan_speed.value] / cur_active_time[fan_speed.value];
  } else {
    let temp_dis = base_temperature - room_temperature.value;
    // 如果环境温度大于房间温度  
    if (temp_dis > 0) {
      if (temp_dis > cur_passive_amount / cur_passive_time) {
        room_temperature.value += cur_passive_amount / cur_passive_time;
      } else {
        room_temperature.value = base_temperature;
      }
    } else if (temp_dis < 0) {
      // 如果环境温度小于房间温度  
      if (-temp_dis > cur_passive_amount / cur_passive_time) {
        room_temperature.value -= cur_passive_amount / cur_passive_time;
      } else {
        room_temperature.value = base_temperature;
      }
    }
  }
  // 构建状态并发送
  SendChangeRoomState(
    room_id.value, 
    new RoomState(room_id.value, undefined, undefined, undefined, room_temperature.value)
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

let is_self_introducted = false;

// 监视接受到的报文
watch(state, async () => {
  // if (state.value.billingRuleEvents.length != 0) {
  //   // 只接受最新的计费规则
  //   billing_rules.value = state.value.billingRuleEvents.pop();
  //   state.value.billingRuleEvents.length = 0;
  // }
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
  if (state.value.connected == true && is_self_introducted == false) {
    is_self_introducted = true;
    SendSelfIntroduction("room", "");
  }
})

function TryBuildConnection() {
  BuildConnection(config_data.URL);
}

function GetConfigData() {
  billing_rules.value = config_data.billing_rules;
  temp_upper_bound = config_data.temperature_setting_upper_limit;
  temp_lower_bound = config_data.temperature_setting_lower_limit;
  room_temperature.value = config_data.inital_room_temperature;
  base_temperature = config_data.ambient_temperature;
  temperature.value = config_data.default_temperature_setting;
  fan_speed.value = config_data.default_fan_speed_setting;
  air_condition_state.value = config_data.default_open_state;
  cur_passive_amount = config_data.ambient_temperature_change_amount;
  cur_passive_time = config_data.ambient_temperature_change_time;
  cur_active_amount.low = config_data.low_temperature_change_amount;
  cur_active_time.low = config_data.low_temperature_change_time;
  cur_active_amount.medium = config_data.medium_temperature_change_amount;
  cur_active_time.medium = config_data.medium_temperature_change_time;
  cur_active_amount.high = config_data.high_temperature_change_amount;
  cur_active_time.high = config_data.high_temperature_change_time;
  room_id.value = config_data.room_id;
}

GetConfigData()
</script> 

<template>
  <div class="card">
    <div class="card-content">
      <InfoBox class="box has-text-primary has-text-centered my-1 py-2 is-family-primary is-size-5" :info="'Fan Speed: ' + fan_speed"/>
      <InfoBox class="box has-text-primary has-text-centered my-1 py-2 is-family-primary is-size-5" :info="'Temperature: ' + temperature + '℃'"/>
      <InfoBox class="box has-text-primary has-text-centered my-1 py-2 is-family-primary is-size-5" :info="'Current Cost: ' + cost"/>
      <InfoBox class="box has-text-primary has-text-centered my-1 py-2 is-family-primary is-size-5" :info="'Billing Rules: ' + billing_rules"/>
      <InfoBox class="box has-text-primary has-text-centered my-1 py-2 is-family-primary is-size-5" :info="'Air-Conditioner is ' + air_condition_state_info() + '!'"/>
      <div class="box pb-0 pt-1">
        <div class="buttons has-addons is-centered my-1">
          <MyButton class="button is-outlined is-primary column py-0 mb-0" :msg="'Turn ' + reversed_air_condition_state_info()" @toggle-button="change_air_condition_state"/>
        </div>
        <div class="buttons has-addons is-centered my-1">
          <MyButton class="button is-outlined is-primary column py-0 mb-0" msg="Decrease Temperature" @toggle-button="decrease_temperature"/>
          <MyButton class="button is-outlined is-primary column py-0 mb-0" msg="Adjust Fan Speed" @toggle-button="adjust_fan_speed"/>
          <MyButton class="button is-outlined is-primary column py-0 mb-0" msg="Increase Temperature" @toggle-button="increase_temperature"/>
        </div>
        <div class="buttons has-addons is-centered my-1">
          <MyButton class="button is-outlined is-primary column py-0" msg="Build Connection" @toggle-button="TryBuildConnection"/>
        </div>
      </div>
    </div>
    <!-- <SingleSeletor v-model:options="options"/> -->
    <!-- <MultipleSeletor v-model:options="options"/> -->
  </div>
</template>

<style scoped>
@import "src/renderer/src/assets/bulma.css"
/* .guest_room {
  background: #fff;
  margin: 2rem 2rem 4rem 2rem;
  padding: 1rem; 
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
} */
</style>