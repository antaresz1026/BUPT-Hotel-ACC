import { ref } from "vue"
import { io } from "socket.io-client"


export const state = ref({
  connected: false,
  billingRuleEvents: [],
  tickEvents: [],
  changeRoomStateEvents: [],
  replyBillEvents: [],
  replyBillStatementEvents: [],
  replyAllRoomStateEvents: [],
  roomIdListEvents: [], 
});

export let socket;
export function BuildConnection(URL = 'http://localhost:3000') {
  console.log(URL);
  // console.log(state); 
  if (state != undefined && state.connected === true) {
    console.log("skipped!");
    return;
  }
  socket = io(URL);
  console.log(socket, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });
  let count = 0;

  socket.on("connect", () => {
    state.connected = true;
    console.log("connected...");
  });

  socket.on("disconnect", () => {
    state.connected = false;
  });

  socket.on("billing_rule", (...args) => {
    state.billingRuleEvents.push(args);
  });

  socket.on("tick", (...args) => {
    count++;
    state.tickEvents.push(count);
  });

  socket.on("change_room_state", (...args) => {
    state.changeRoomStateEvents.push(args);
  });

  socket.on("reply_bill", (...args) => {
    state.replyBillEvents.push(args);
  });

  socket.on("reply_bill_statement", (...args) => {
    state.replyBillStatementEvents.push(args);
  });

  socket.on("reply_all_room_state", (...args) => {
    state.replyAllRoomStateEvents.push(args);
  });

  socket.on("room_id_list", (...args) => {
    state.roomIdListEvents.push(args);
  });
}

export function SendSelfIntroduction(client_type, room_id) {
  socket.emit("self_introduction", client_type, room_id);
}

export function SendChangeRoomState(room_id_list, room_state) {
  socket.emit("change_room_state", room_id_list, room_state);
}

export function SendQuestBill(room_id) {
  socket.emit("quest_bill", room_id);
}

export function SendQuestBillStatement(room_id) {
  socket.emit("quest_bill_statement", room_id);
}

export function SendQuestAllRoomState() {
  socket.emit("quest_all_room_state");
}
