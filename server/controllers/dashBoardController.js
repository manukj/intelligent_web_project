exports.dashboardPage = async (req, res, next) => {
  // TODO : make Api call here to get the plant data

  const plantData = [
    {
      name: "Plant 1",
      location: "Garden",
      date: "2022-10-01",
      image:
        "https://img.freepik.com/free-psd/monstera-deliciosa-png-isolated-transparent-background_191095-11918.jpg",
    },
    {
      name: "Plant 2",
      location: "Balcony",
      date: "2022-10-02",
      image:
        "https://img.freepik.com/free-psd/monstera-deliciosa-png-isolated-transparent-background_191095-11918.jpg",
    },
    {
      name: "Plant 2",
      location: "Balcony",
      date: "2022-10-02",
      image:
        "https://img.freepik.com/free-psd/monstera-deliciosa-png-isolated-transparent-background_191095-11918.jpg",
    },
    {
      name: "Plant 2",
      location: "Balcony",
      date: "2022-10-02",
      image:
        "https://img.freepik.com/free-psd/monstera-deliciosa-png-isolated-transparent-background_191095-11918.jpg",
    },
    {
      name: "Plant 2",
      location: "Balcony",
      date: "2022-10-02",
      image:
        "https://img.freepik.com/free-psd/monstera-deliciosa-png-isolated-transparent-background_191095-11918.jpg",
    },

    {
      name: "Plant 2",
      location: "Balcony",
      date: "2022-10-02",
      image:
        "https://img.freepik.com/free-psd/monstera-deliciosa-png-isolated-transparent-background_191095-11918.jpg",
    },
    {
      name: "Plant 2",
      location: "Balcony",
      date: "2022-10-02",
      image:
        "https://img.freepik.com/free-psd/monstera-deliciosa-png-isolated-transparent-background_191095-11918.jpg",
    },
    {
      name: "Plant 2",
      location: "Balcony",
      date: "2022-10-02",
      image:
        "https://img.freepik.com/free-psd/monstera-deliciosa-png-isolated-transparent-background_191095-11918.jpg",
    },
    {
      name: "Plant 2",
      location: "Balcony",
      date: "2022-10-02",
      image:
        "https://img.freepik.com/free-psd/monstera-deliciosa-png-isolated-transparent-background_191095-11918.jpg",
    },
    {
      name: "Plant 2",
      location: "Balcony",
      date: "2022-10-02",
      image:
        "https://img.freepik.com/free-psd/monstera-deliciosa-png-isolated-transparent-background_191095-11918.jpg",
    },
    {
      name: "Plant 2",
      location: "Balcony",
      date: "2022-10-02",
      image:
        "https://img.freepik.com/free-psd/monstera-deliciosa-png-isolated-transparent-background_191095-11918.jpg",
    },
    {
      name: "Plant 2",
      location: "Balcony",
      date: "2022-10-02",
      image:
        "https://img.freepik.com/free-psd/monstera-deliciosa-png-isolated-transparent-background_191095-11918.jpg",
    },
    // Add more plant details as needed
  ];

  // Use the plantData array in your code
  res.render("dashboard/dashboard", {
    title: "Dashboard",
    plantData: plantData,
  });
};
