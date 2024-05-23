<script setup>
import { ref } from 'vue';
import MultipleSeletorList from './components/MultipleSeletorList.vue'
import SingleSeletor from './components/SingleSeletor.vue'
import MyButton from './components/MyButton.vue'
import InputBox from './components/InputBox.vue'

const fan_speed_name = ['low', 'medium', 'high']
const air_condition_state = ['off', 'on']
const temperature = ref();
</script> 

<template>
    <MultipleSeletorList/>
    <article>
        <div>Air-Conditioner State:</div>
        <SingleSeletor :options="air_condition_state"/>
    </article>
    <article>
        <InputBox hint_info="Temperature" :message="temperature"/>
    </article>
    <article>
        <div>Fan Speed:</div>
        <SingleSeletor :options="fan_speed_name"/>
    </article>
    <article>
        <MyButton msg="Commit"/>
    </article>
</template>