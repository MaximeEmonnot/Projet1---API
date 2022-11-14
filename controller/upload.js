//Récupère tous les fichiers uploadés et les place dans le dossier uploads
const upload = async (req, res) => {
  for (file in req.files) {
    await req.files[file].mv("./uploads/" + req.files[file].name, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).send("Les fichiers n'ont pas pu être uplodés");
      }
    });
  }
  res
    .status(200)
    .send(Object.keys(req.files).length + " fichier(s) uploadé(s)");
};

module.exports = { upload };
