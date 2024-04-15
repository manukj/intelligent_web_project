exports.chatPage = async (req, res, next) => {
  res.render("chat/chat", { title: "This is Chat Page" });
};
