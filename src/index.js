const express = require('express');
const nunjucks = require('nunjucks');

const { convertHoursToMinutes, getSubject, getWeekDay } = require('./utils');

const app = express();

const proffys = [
    {
        name: 'Wemerson Jesus',
        avatar: 'https://github.com/wejesuss.png',
        whatsapp: '56467475464',
        bio:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. <br /> <br /> Est sint dolor enim, veritatis corporis, fugit, sunt itaque officiis nobis harum ad! Possimus.',
        subject: 'Química',
        cost: '80,00',
        weekday: [1, 3, 4],
        time_from: [720],
        time_to: [1200],
    },
    {
        name: 'Wemerson Jesus',
        avatar: 'https://github.com/wejesuss.png',
        whatsapp: '56467475464',
        bio:
            'Lorem ipsum dolor sit, amet consectetur adipisicing elit. <br /> <br /> Est sint dolor enim, veritatis corporis, fugit, sunt itaque officiis nobis harum ad! Possimus.',
        subject: 'Química',
        cost: '80,00',
        weekday: [1, 3, 4],
        time_from: [720],
        time_to: [1200],
    },
];

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

app.use(express.static('public'));
nunjucks.configure('src/views', {
    express: app,
    autoescape: false,
    noCache: true,
});

app.get('/', (req, res) => {
    return res.render('index.html');
});

app.get('/study', (req, res) => {
    const filters = req.query;

    let invalidParams = false;
    let atLeastOneParamHasAValidValue = false;
    let atLeastOneParamHasNotAValidValue = false;
    Object.keys(filters).forEach((key) => {
        const isArray = Array.isArray(filters[key]);

        if ((isArray && filters[key][0]) || filters[key])
            atLeastOneParamHasAValidValue = true;

        if ((isArray && !filters[key][0]) || !filters[key])
            atLeastOneParamHasNotAValidValue = true;

        if (atLeastOneParamHasAValidValue && atLeastOneParamHasNotAValidValue) {
            invalidParams = true;
        }
    });

    if (invalidParams) {
        return res.status(400).json({
            error:
                'Expected three parameters to filter proffys or without any parameters',
        });
    }

    return res.render('study.html', {
        proffys,
        subjects,
        weekdays,
        filters,
    });
});

app.get('/give-classes', (req, res) => {
    const data = req.query;
    const isNotEmpty = Object.keys(data).length > 0;

    if (isNotEmpty) {
        proffys.push({
            ...data,
            bio: data.bio.replace(/(\r\n)?(\n)/g, '<br>'),
            cost: +data.cost + ',00',
            subject: getSubject(data.subject),
            weekday: data.weekday.map(getWeekDay),
            time_from: data.time_from.map(convertHoursToMinutes),
            time_to: data.time_to.map(convertHoursToMinutes),
        });

        return res.redirect('/study');
    }

    return res.render('give-classes.html', { subjects, weekdays });
});

app.listen(5000);
