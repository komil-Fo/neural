const fs         = require('fs');
const isExported = fs.existsSync('./classifier.json');
const natural    = require('natural');
const incidents  = require('./data');
const findKey    = require('lodash/findKey');
let classifier   = new natural.BayesClassifier();

init();

// --------------------------------------------------------------------------------

function init() {
  if (!isExported) {
    addIncidents(incidents, classifier);
    classifier.train();
    exportClassifier(classifier);
  }

  if (isExported) {
    natural.BayesClassifier.load(
      './classifier.json',
      null,
      onClassifierLoad
    );

    function onClassifierLoad(err, cl) {
      if (err) throw new Error('classifier load error!');
      classifier = cl;
    }
  }

}

function classify(description) {
  return classifier
    .getClassifications(description)
    .slice(0, 5)
    .map(incident => {
      const index = findKey(
	incidents,
	{ 'Title': incident.label }
      );

      return {
	[incident.label]: incidents[index]['Repro Steps']
      };
    });
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

module.exports = {
  classify
};
