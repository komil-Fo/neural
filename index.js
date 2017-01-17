const { classify, updateData } = require('./network');
const express                  = require('express');
const cors                     = require('cors');
const parseUrlencoded          = require('urlencoded-request-parser');
const app                      = express();
const PORT                     = 3000;
const IS_MAINTENANCE_MODE      = false;

app.use(cors());
app.use(parseUrlencoded());

app.get('/:query?', (req, res) => {
  const { query } = req.params;

  if (IS_MAINTENANCE_MODE) {
    res.end('MAINTENANCE MODE');
    // return;
  }

  if (!query) {
    res.end('Please provide a search string.');
    return;
  }

  logRequest({ title: query });

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
    updateData({ title, description });
  }

  logRequest({ title, description });

  res.json(classify(title));
});

app.listen(PORT);

function logRequest(query) {
  const { title, description } = query;

  console.log(`Incoming request: ${ new Date().toLocaleString() }`);
  console.log(`Summary: ${title}`);

  if (description) {
    console.log(`Description: ${description}`);
  }
}
