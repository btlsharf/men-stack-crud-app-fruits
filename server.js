// Here is where we import modules
// We begin by loading Express
const express = require('express');
const PORT = 3000; // should be in env

const app = express();

app.listen(PORT, () => {
  console.log('Listening on port 3000');
});



