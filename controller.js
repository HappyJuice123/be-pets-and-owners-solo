const { readOwner, readPets } = require("./models");

const updateOwner = (req, res) => {
  console.log(req.body);
  const request = req.body;

  readOwner(request).then((updatedOwner) => {
    res.status(201).send(JSON.parse(updatedOwner));
  });
};

const fetchPets = (req, res) => {
  const query = req.query;
  console.log(query);
  readPets(query).then((pets) => {
    res.status(200).send({ pets });
  });
};

module.exports = {
  updateOwner,
  fetchPets,
};
