const subjects = [
  'Artes',
  'Biologia',
  'Ciências',
  'Educação Física',
  'Física',
  'Geografia',
  'História',
  'Matemática',
  'Português',
  'Química',
];

const weekdays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

function convertHoursToMinutes(time = '') {
  // eslint-disable-next-line prefer-const
  let [hours = 0, minutes = 0] = time.split(':').map(Number);
  if (hours === 0) hours = 24;

  const timeInMinutes = hours * 60 + minutes;

  return timeInMinutes;
}

function getWeekDay(day = 0) {
  if (day < 0) day = 0;
  const formattedWeekDay = weekdays[+day];

  return formattedWeekDay;
}

function getSubject(subject = 1) {
  if (subject < 1) subject = 1;
  const formattedSubject = subjects[+subject - 1];

  return formattedSubject;
}

function clearCostOrWhatsapp(cost, whatsapp) {
  if (cost) {
    cost = Number(cost.replace(/\D/g, '')) / 100;
    return cost;
  }

  if (whatsapp) {
    whatsapp = whatsapp.replace(/\D/g, '');
    return whatsapp;
  }

  throw new Error('cost and whatsapp was not informed');
}

function scapeFields(fieldValue) {
  const doubleQuotesFrom = /["]/g;
  const doubleQuotesTo = '%&--&%';
  const commaFrom = /[,]/g;
  const commaTo = '%@--@%';
  const semiColonFrom = /[;]/g;
  const semiColonTo = '%#--#%';

  return fieldValue.replace(doubleQuotesFrom, doubleQuotesTo)
    .replace(commaFrom, commaTo)
    .replace(semiColonFrom, semiColonTo);
}

function revertScapedFields(fieldValue) {
  const doubleQuotesTo = '"';
  const doubleQuotesFrom = /(%&--&%)/g;
  const commaTo = ',';
  const commaFrom = /(%@--@%)/g;
  const semiColonTo = ';';
  const semiColonFrom = /(%#--#%)/g;

  return fieldValue.replace(doubleQuotesFrom, doubleQuotesTo)
    .replace(commaFrom, commaTo)
    .replace(semiColonFrom, semiColonTo);
}

module.exports = {
  convertHoursToMinutes,
  getWeekDay,
  getSubject,
  weekdays,
  subjects,
  clearCostOrWhatsapp,
  scapeFields,
  revertScapedFields,
};
