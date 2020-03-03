const fs = require("fs-extra");

fs.mkdir("src")
  .then(() => {
    console.log("succuss");
  })
  .catch(err => console.log(err));
