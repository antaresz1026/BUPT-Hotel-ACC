<script setup>
import { ref } from 'vue';
import MyButton from './components/MyButton.vue'
import InfoBox from './components/InfoBox.vue'
// import InputBox from './components/InputBox.vue'
// import SingleSeletor from './components/SingleSeletor.vue'
// import MultipleSeletor from './components/MultipleSeletor.vue'
// const options = ref(['One', 'Two', 'Three'])
// const message = ref("")
const amount = ref(0)
const billing_rules = ref("")
// 空调状态
const air_condition_state = ref(Boolean(0))
function change_air_condition_state() {
    air_condition_state.value = !air_condition_state.value
}
function air_condition_state_info() {
    if (air_condition_state.value) {
        return "On"
    } else {
        return "Off"
    }
}
function reversed_air_condition_state_info() {
    if (air_condition_state.value) {
        return "Off"
    } else {
        return "On"
    }
}
// 温度
const temperature = ref(16)
const temp_upper_bound = 30
const temp_lower_bound = 16
function increase_temperature() {
    if (temperature.value != temp_upper_bound) {
        temperature.value = temperature.value + 1
    }
}
function decrease_temperature() {
    if (temperature.value != temp_lower_bound) {
        temperature.value = temperature.value - 1
    }
}
// 风扇
const fan_speed = ref(1)
const fan_speed_name = ['low', 'medium', 'high']
function adjust_fan_speed() {
    fan_speed.value = (fan_speed.value + 1) % 3
}


// function callback() {
//     console.log(message.value)
// }
</script> 

<template>
        <div class="guest_room">
            <InfoBox class="info" :info="'Fan Speed: ' + fan_speed_name[fan_speed]"/>
            <InfoBox class="info" :info="'Temperature: ' + temperature + '℃'"/>
            <InfoBox class="info" :info="'Current Amount: ' + amount"/>
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