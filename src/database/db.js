const { open } = require('sqlite-async');

module.exports = open(`${__dirname}/database.sqlite`).then((db) => db.exec(`
        CREATE TABLE IF NOT EXISTS proffys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            avatar TEXT NOT NULL,
            whatsapp TEXT NOT NULL,
            bio TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject INTEGER NOT NULL,
            cost TEXT NOT NULL,
            proffy_id INTEGER
        );

        CREATE TABLE IF NOT EXISTS class_schedules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_id INTEGER,
            weekday INTEGER NOT NULL,
            time_from INTEGER NOT NULL,
            time_to INTEGER NOT NULL
        );
    `));
