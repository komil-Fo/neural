const fs         = require('fs');
const isExported = fs.existsSync('./classifier.json');
const natural    = require('natural');
const classifier = new natural.BayesClassifier();
const arg = process.argv[2];

// const PHRASE = `I can't logon`;
const PHRASE = arg
  ? arg
  : `internet explorer`;

if (!isExported) {
  const incidents = require('./data');
  addIncidents(incidents, classifier);
  classifier.train();

  console.log( classify(PHRASE, classifier) );

  setImmediate( () => {
    exportClassifier(classifier);
  });
}

if (isExported) {
  natural.BayesClassifier.load(
    './classifier.json',
    null,
    onClassifierLoad
  );

  function onClassifierLoad(err, classifier) {
    console.log( classify(PHRASE, classifier) );
  }
}

// --------------------------------------------------------------------------------

function classify(description, classifier) {
  return classifier.classify(description);
}

function addIncidents(incidents, classifier) {
    for (let incident of incidents) {
        const { Title: title, 'Repro Steps': description } = incident;
        classifier.addDocument(description, title);
    }
}

function exportClassifier(classifier) {
  classifier.save('classifier.json', (err, classifier) => {
    if (!err) return;
    throw new Error('Export error!');
  });
}
