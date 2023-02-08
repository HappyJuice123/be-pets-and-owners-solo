const fs = require("fs/promises");
const updateOwner = require("./controller");

const readOwner = (request) => {
  console.log(request);
  return fs
    .readFile(`./data/owners/${request.id}.json`, "utf-8")
    .then((ownerJSON) => {
      const owner = JSON.parse(ownerJSON);
      return owner;
    })
    .then((owner) => {
      if (owner.id === request.id) {
        return fs.writeFile(
          `./data/owners/${request.id}.json`,
          JSON.stringify(request)
        );
      }
    })
    .then(() => {
      return fs.readFile(`./data/owners/${request.id}.json`, "utf8");
    });
};

const readPets = (query) => {
  return fs
    .readdir(`${__dirname}/data/pets`)
    .then((fileNames) => {
      const allPets = fileNames.map((pet) => {
        return fs.readFile(`./data/pets/${pet}`, "utf-8");
      });
      return Promise.all(allPets);
    })
    .then((readPets) => {
      const pets = readPets.map((pet) => {
        return JSON.parse(pet);
      });

      const temperament = query.temperament;
      if (temperament) {
        const filteredPets = pets.filter((pet) => {
          return temperament === pet.temperament;
        });
        return filteredPets;
      } else {
        return pets;
      }
    });
};

module.exports = {
  readOwner,
  readPets,
};
