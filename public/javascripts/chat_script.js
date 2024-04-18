let socket = io();

function init() {
  var form = document.getElementById("chat_form");
  var input = document.getElementById("chat_input");
  // read plant_id and user_id from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const plant_id = urlParams.get("plant_id");
  const logged_in_user_id = urlParams.get("user_id");
  // join the chat room
  joinPlantChatRoom();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
  });

  // called when someone joins the room. If it is someone else it notifies the joining of the room
  socket.on("joined", function (room, userId) {
    console.log("user " + userId + " joined Room: " + room);
    if (userId === logged_in_user_id) {
      console.log("You joined the room");
    } else {
      // notifies that someone has joined the room
      console.log("Someone joined the room");
    }
  });

  function joinPlantChatRoom() {
    console.log("Joining room");
    var roomNo = plant_id;
    var name = logged_in_user_id;
    socket.emit("create_or_join", roomNo, name);
  }
}
