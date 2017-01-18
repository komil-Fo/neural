const { classify, updateData, getIncident } = require('./network');
const express                  = require('express');
const cors                     = require('cors');
const bodyParser               = require('body-parser');
const app                      = express();
const PORT                     = 3000;
const IS_MAINTENANCE_MODE      = false;

app.use(cors());
app.use(bodyParser());

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

app.post('/incidents', (req, res) => {
  console.log(req.body);

  const { title, description } = req.body;

  if (!title('Please provide title parameter in POST request');

  updateData({ title, description });
  logRequest({ title, description });

  res.json(classify(title));
});

app.listen(PORT);

function logRequest(query) {
  const { title, description } = query;

  console.log(`Incoming request: ${ new Date().toLocaleString() }`);
  console.log(`Summary: ${title}`);
}

app.get('/incidents/:subject', (req, res) => {
  const { subject } = req.params;

  console.log(subject);

  res.json(
    getIncident(subject)
  );
});
