module.exports = function getSubject(subject = 0) {
    const formattedSubject = subjects[+subject - 1];

    return formattedSubject;
};

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
