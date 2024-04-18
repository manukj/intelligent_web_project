exports.init = function (io) {
  io.sockets.on("connection", function (socket) {
    console.log("try");
    try {
      socket.on("create_or_join", function (plantID, userId) {
        socket.join(plantID);
        io.sockets.to(plantID).emit("joined", plantID, userId);
      });

      socket.on("chat", function (message) {
        io.sockets.to(message.plant_id).emit("chat_message", message);
      });

      socket.on("disconnect", function () {
        console.log("someone disconnected");
      });
    } catch (e) {
      console.log(e);
    }
  });
};
