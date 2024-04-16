exports.chatPage = async (req, res, next) => {
  res.render("chat", { title: "This is Chat Page" });
};
