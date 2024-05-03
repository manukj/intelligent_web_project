exports.init = function (io) {
  let userCounts = {}; // Initialize user counts object

  io.sockets.on("connection", function (socket) {
    try {
      socket.on("create_or_join", function (plantID, userId) {
        socket.join(plantID);
        const userCountId = plantID + userId; // Unique identifier for user count
        if (!userCounts[userCountId]) {
          userCounts[userCountId] = 0;
        }
        userCounts[userCountId]++;
        console.log(
          "User joined. Total users for plantId " +
            plantID +
            ": " +
            userCounts[userCountId]
        );
        io.sockets
          .to(plantID)
          .emit("joined", plantID, userId, userCounts[userCountId]); // Pass the user count in the "joined" event
      });

      socket.on("chat", function (message) {
        io.sockets.to(message.plant_id).emit("chat_message", message);
      });

      socket.on("disconnect", function () {
        const plantID = Object.keys(socket.rooms)[1]; // Get the plantId from the socket rooms
        const userCountId = plantID + socket.id; // Unique identifier for user count
        if (userCounts[userCountId]) {
          userCounts[userCountId]--; // Decrement user count for the userCountId
          console.log(
            "User disconnected. Total users for plantId " +
              plantID +
              ": " +
              userCounts[userCountId]
          );
          io.sockets
            .to(plantID)
            .emit("left", plantID, null, userCounts[userCountId]);
        }
      });
    } catch (e) {
      console.log(e);
    }
  });
};
