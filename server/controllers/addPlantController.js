exports.addAPlantPage = async (req, res, next) => {
  res.render("add_plant/add_plant", { title: "Add A Plant" });
};
