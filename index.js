const express = require("express");
const fs = require("fs/promises");
const { updateOwner, fetchPets } = require("./controller");
const app = express();

const port = 9090;
app.use(express.json());

app.get("/api/owners/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile(`./data/owners/${id}.json`, "utf8").then((ownerJSON) => {
    const owner = JSON.parse(ownerJSON);
    res.status(200).send({ owner });
  });
});

app.get("/api/owners", (req, res) => {
  const allOwners = [];

  fs.readdir(`${__dirname}/data/owners`).then((ownerFiles) => {
    for (let i = 0; i < ownerFiles.length; i++) {
      fs.readFile(`./data/owners/${ownerFiles[i]}`, "utf8").then((owner) => {
        allOwners.push(JSON.parse(owner));
        if (allOwners.length === ownerFiles.length) {
          res.status(200).send(allOwners);
        }
      });
    }
  });
});

app.get("/api/owners/:id/pets", (req, res) => {
  const { id } = req.params;

  const petsToOwner = [];

  fs.readdir(`${__dirname}/data/pets`).then((petFiles) => {
    for (let i = 0; i < petFiles.length; i++) {
      fs.readFile(`./data/pets/${petFiles[i]}`, "utf8").then((petJSON) => {
        const pet = JSON.parse(petJSON);

        if (pet.owner === id) {
          petsToOwner.push(pet);
        }
        if (i === petFiles.length - 1) {
          console.log(i, petFiles.length - 1);
          console.log(petsToOwner);
          res.status(200).send(petsToOwner);
        }
      });
    }
  });
});
app.get("/api/pets", fetchPets);

app.get("/api/pets/:id", (req, res) => {
  const { id } = req.params;
  fs.readdir("./data/pets")
    .then((fileNames) => {
      const fileContent = fileNames.map((fileName) => {
        return fs.readFile(`./data/pets/${fileName}`, "utf-8");
      });
      return Promise.all(fileContent);
    })
    .then((pets) => {
      const petsParsed = pets.map((pet) => {
        return JSON.parse(pet);
      });
      return petsParsed;
    })
    .then((pets) => {
      const petFind = pets.find((pet) => {
        return pet.id === id;
      });
      res.status(200).send({ pet: petFind });
    });
});
app.patch("/api/owners/:id", updateOwner);

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
