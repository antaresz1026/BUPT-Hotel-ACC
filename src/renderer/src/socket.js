import { ref } from "vue"
import { io } from "socket.io-client"



export const state = ref({
  connected: false,
  // billingRuleEvents: [],
  tickEvents: [],
  changeRoomStateEvents: [],
  replyBillEvents: [],
  replyBillStatementEvents: [],
  replyAllRoomStateEvents: [],
  replyRoomIdListEvents: [], 
});

export let socket;
export function BuildConnection(URL = 'https://www.antaresz.cc:42133') {

  console.log(URL);
  // console.log(state); 
  if (state != undefined && state.connected === true) {
    console.log("skipped!");
    return;
  }
  socket = io(URL, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });
  console.log(socket);
  // , {
  //   withCredentials: true,
  //   extraHeaders: {
  //     "my-custom-header": "abcd"
  //   }
  // }
  let count = 0;

  socket.on("connect", () => {
    state.connected = true;
    console.log("Connected...");
  });

  socket.on("disconnect", () => {
    state.connected = false;
    console.log("Disconnected...");
  });

  // // billing_rule被弃用
  // socket.on("billing_rule", (...args) => {
  //   state.billingRuleEvents.push(args);
  // });

  socket.on("tick", (...args) => {
    count++;
    state.tickEvents.push(count);
    console.log("Ticked: ", count);
  });

  socket.on("change_room_state", (...args) => {
    state.changeRoomStateEvents.push(args);
    console.log("Get room state: ", args);
  });

  socket.on("reply_bill", (...args) => {
    state.replyBillEvents.push(args);
    console.log("Get bill reply: ", args);
  });

  socket.on("reply_bill_statement", (...args) => {
    state.replyBillStatementEvents.push(args);
    console.log("Get bill statement reply: ", args);
  });

  socket.on("reply_all_room_state", (...args) => {
    state.replyAllRoomStateEvents.push(args);
    console.log("Get all room state reply: ", args);
  });

  socket.on("reply_room_id_list", (...args) => {
    state.replyRoomIdListEvents.push(args);
    console.log("Get room id list reply: ", args);
  });
}

export function SendSelfIntroduction(client_type, room_id) {
  socket.emit("self_introduction", client_type, room_id);
  console.log("emit self_introduction: ", client_type, " ", room_id);
}

export function SendChangeRoomState(room_id, room_state) {
  socket.emit("change_room_state", room_id, room_state);
  console.log("emit change_room_state: ", room_id, " ", room_state);
}

export function SendCheckIn(room_id) {
  socket.emit("check_in", room_id);
  console.log("emit check_in: ", room_id);
}

export function SendQuestBill(room_id) {
  socket.emit("quest_bill", room_id);
  console.log("emit quest_bill: ", room_id);
}

export function SendCheckOut(room_id) {
  socket.emit("check_out", room_id);
  console.log("emit check_out: ", room_id);
}

export function SendQuestBillStatement(room_id) {
  socket.emit("quest_bill_statement", room_id);
  console.log("emit quest_bill_statement: ", room_id);
}

export function SendQuestAllRoomState() {
  socket.emit("quest_all_room_state");
  console.log("emit quest_all_room_state");
}

export function SendQuestRoomIdList() {
  socket.emit("quest_room_id_list");
  console.log("emit quest_room_id_list");
}
