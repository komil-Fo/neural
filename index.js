const { classify }    = require('./network');
const express         = require('express');
const cors            = require('cors');
const parseUrlencoded = require('urlencoded-request-parser');
const app             = express();
const PORT            = 3000;

app.use(cors());
app.use(parseUrlencoded());

app.get('/:query?', (req, res) => {
  const { query } = req.params;

  console.log(`Incoming request: ${ new Date().toLocaleString() }`);
  console.log(`Query: ${query}`);

  if (!query) {
    res.end('Please provide a search string.');
    return;
  }

  console.log(
    classify(query).map(
      item => Object.keys(item)[0]
    )
  );

  res.json(classify(query));
});

app.post('/', (req, res) => {
  const { title, description } = req.body;

  if (!title) throw new Error('Please provide title parameter in POST request');

  if (description) {
    // train network here...
  }

  res.json(classify(title));
});

app.listen(PORT);
