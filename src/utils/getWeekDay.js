module.exports = function getWeekDay(day = 0) {
    const formattedWeekDay = weekdays[+day];

    return formattedWeekDay;
};

const weekdays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
];
