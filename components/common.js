const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const daysOfWeek = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday'
};

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

function closeInterface() {
  rl.close();
}

module.exports = {
  ask,
  rl,
  daysOfWeek,
  closeInterface
};
