/**
 * Variables
 */

let chatName = "";
let chatSocket = null;
let chatWindowUrl = window.location.href;
let chatRoomUuid = Math.random().toString(36).slice(2, 12);

/**
 *  Elements
 */

const chatElement = document.querySelector("#chat");
const chatOpenElement = document.querySelector("#chat_open");
const chatJoinElement = document.querySelector("#chat_join");
const chatIconElement = document.querySelector("#chat_icon");
const chatWelcomeElement = document.querySelector("#chat_welcome");
const chatRoomElement = document.querySelector("#chat_room");
const chatNameElement = document.querySelector("#chat_name");
const chatLogElement = document.querySelector("#chat_log");
const chatInputElement = document.querySelector("#chat_message_input");
const chatSubmitElement = document.querySelector("#chat_message_submit");

/**
 * Functions
 */

function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie != "") {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();

      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

async function joinChatRoom() {
  console.log("Join Room");

  chatName = chatNameElement.value;

  console.log(chatName);
  console.log(chatRoomUuid);

  const data = new FormData();
  data.append("name", chatName);
  data.append("url", chatWindowUrl);

  await fetch(`/api/create-room/${chatRoomUuid}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: data,
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log("data", data);
    });

  chatSocket = new WebSocket(
    `ws://${window.location.host}/ws/${chatRoomUuid}/`
  );

  chatSocket.onmessage = function (e) {
    console.log("onMessage");
  };

  chatSocket.onopen = function (e) {
    console.log("onOpen - chat socket was opened");
  };

  chatSocket.onclose = function (e) {
    console.log("onClose - chat socket was closed");
  };
}

/**
 * Event listeners
 */

chatOpenElement.onclick = function (e) {
  e.preventDefault();

  chatIconElement.classList.add("hidden");
  chatWelcomeElement.classList.remove("hidden");

  return false;
};

chatJoinElement.onclick = function (e) {
  e.preventDefault();

  chatWelcomeElement.classList.add("hidden");
  chatRoomElement.classList.remove("hidden");

  joinChatRoom();

  return false;
};
