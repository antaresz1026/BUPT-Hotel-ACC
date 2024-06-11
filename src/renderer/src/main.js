// import './assets/main.css'
// import './assets/base.css'
// import 'milligram/dist/milligram.css'

import { createApp } from 'vue'
import { state } from './socket'
import App from './App.vue'
import GuestRoom from './GuestRoom.vue'
import CheckOut from './CheckOut.vue'
import ControlPanel from './ControlPanel.vue'

// createApp(App).mount('#app')
createApp(GuestRoom).mount('#guestroom')
// createApp(CheckOut).mount('#checkout')
// createApp(ControlPanel).mount('#controlpanel')