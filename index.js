const { classify } = require('./network');
const express      = require('express');
const cors         = require('cors');
const app          = express();
const PORT         = 3000;

app.get('/:query?', (req, res) => {
  const { query } = req.params;

  console.log(`Incoming request: ${ new Date().toLocaleString() }`);
  console.log(`Query: ${query}`);

  if (!query) {
    res.end('Please provide a search string.');
    return;
  }

  console.log(classify(query));
  res.json(classify(query));
});

app.listen(PORT);
