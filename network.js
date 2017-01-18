const fs         = require('fs');
const isExported = fs.existsSync('./classifier.json');
const natural    = require('natural');
const incidents  = require('./data');
const incidents2 = require('./incidents');
const findKey    = require('lodash/findKey');
let classifier   = new natural.BayesClassifier();

init();

// --------------------------------------------------------------------------------

function init() {
  if (!isExported) {
    loadData(incidents);
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

      if (incidents[index]) {
	description = incidents[index]['Repro Steps'];
      }

      return {
	[incident.label]: description,
	weight: incident.value
      };
    });
}

function addIncidents(incidents, classifier) {
  if (Array.isArray(incidents)) {
    for (let incident of incidents) {
      addIncident(incident, classifier);
    }
  } else {
    addIncident(incidents, classifier);
  }
}

function addIncident(incident, classifier) {
    if (incident.title && incident.description) {
      var { title, description } = incident;
    } else {
      var { Title: title, 'Repro Steps': description } = incident;
    }

    classifier.addDocument(description, title);
}

function exportClassifier(classifier) {
  classifier.save('classifier.json', (err, classifier) => {
    if (!err) return;
    throw new Error('Export error!');
  });
}

function loadData(incidents) {
    addIncidents(incidents, classifier);
    classifier.train();
    exportClassifier(classifier);
}

module.exports = {
  classify,
  updateData: loadData
};
