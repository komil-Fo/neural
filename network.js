const fs         = require('fs');
// const isExported = fs.existsSync('./classifier.json');
const isExported = false;
const natural    = require('natural');
const _          = require('lodash');
let classifier   = new natural.BayesClassifier();
let classifierIncidents = new natural.BayesClassifier();
const incidents  = require('./Incidents').Incidents.Incident;
const problems   = require('./Problems').Problems.Problem;


init();


// --------------------------------------------------------------------------------

function init() {
  if (!isExported) {
    loadData(incidents);
  }

  // if (isExported) {
  //   natural.BayesClassifier.load(
  //     './classifier.json',
  //     null,
  //     onClassifierLoad
  //   );
  //
  //   function onClassifierLoad(err, cl) {
  //     if (err) throw new Error('classifier load error!');
  //     classifier = cl;
  //   }
  // }

}

function classify(description) {
  return classifier
    .getClassifications(description)
    .slice(0, 5)
    .map(incident => {
      const index = _.findKey(
	problems,
	{ id: incident.label }
      );

      const problem = problems[index];

      return {
	subject: problem.Subject,
	description: problem.description,
	weight: incident.value,
	solution: problem.Solution
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
      var { Subject: description, ProblemId: title, incidentId } = incident;
    }

    classifier.addDocument(description, title);
    classifierIncidents.addDocument(description, incidentId);
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
    classifierIncidents.train();
    // exportClassifier(classifier);
}

function getIncident(description) {
  return classifierIncidents
    .getClassifications(description)
    .slice(0, 5)
    .map(incident => {
      const index = _.findKey(
	incidents,
	{ incidentId: incident.label }
      );

      const incidentData = incidents[index];

      return {
	subject: incidentData.Subject,
	solution: incidentData.Solution,
	weight: incident.value
      };
    });
}

function updateData(incident) {
  const { title, description } = incident;
  classifier.addDocument(description, title);
  classifier.train();
}

module.exports = {
  classify,
  getIncident,
  updateData
};
