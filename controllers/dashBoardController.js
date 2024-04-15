exports.dashboardPage = async (req, res, next) => {
  res.render("dashboard/dashboard", { title: "Dashboard" });
};
