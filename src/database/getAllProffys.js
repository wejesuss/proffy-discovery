const Intl = require('intl');
const Database = require('./db');
const {
  subjects, getWeekDay, getSubject, convertHoursToMinutes, revertScapedFields,
} = require('../utils/index');

async function getProffys({ filters, timeInMinutes }) {
  const db = await Database;

  const query = `
    SELECT classes.*, proffys.*
    FROM classes
    JOIN proffys ON (classes.proffy_id = proffys.id)
    WHERE EXISTS (
        SELECT class_schedules.*
        FROM class_schedules
        WHERE class_schedules.class_id = classes.id
        AND class_schedules.weekday = "${filters.weekday}"
        AND (class_schedules.time_to > class_schedules.time_from
                AND class_schedules.time_from <= "${timeInMinutes}"
                AND class_schedules.time_to > "${timeInMinutes}"
            OR (class_schedules.time_to < class_schedules.time_from
                AND class_schedules.time_from <= "${timeInMinutes}"
            )
        )
    )
    AND classes.subject = "${filters.subject}"
`;

  const proffys = await db.all(query);
  const timeFromAndTimeToPromise = proffys.map(async (proffy) => {
    const schedule = await db.all(`
            SELECT class_schedules.*
            FROM class_schedules
            JOIN classes ON (class_schedules.class_id = classes.id)
            WHERE classes.id = ${proffy.id}
            AND (class_schedules.time_to > class_schedules.time_from
                    AND class_schedules.time_from <= "${timeInMinutes}"
                    AND class_schedules.time_to > "${timeInMinutes}"
                OR (class_schedules.time_to < class_schedules.time_from
                    AND class_schedules.time_from <= "${timeInMinutes}"
                )
            )
            AND class_schedules.weekday = "${filters.weekday}"
        `);

    return schedule[0];
  });

  const timeFromAndTimeTo = await Promise.all(timeFromAndTimeToPromise);
  const newProffys = proffys.reduce((newArrayOfProffys, proffy, index) => {
    newArrayOfProffys[index] = {
      ...proffy,
      ...newArrayOfProffys[index],
      bio: revertScapedFields(proffy.bio),
      weekday: getWeekDay(newArrayOfProffys[index].weekday),
      subject: getSubject(proffy.subject),
      cost: Intl.NumberFormat('pt-BR', {
        currency: 'BRL',
        style: 'currency',
      }).format(proffy.cost),
      time_from: (newArrayOfProffys[index].time_from / 60).toString().split('.').map((time, position) => {
        time = Number(time);
        if (position > 0) time /= 10;
        if (position > 0) time *= 60;
        if (time < 10) time = `0${time}`;
        return time;
      }).join(':')
        .slice(0, 5),
      time_to: (newArrayOfProffys[index].time_to / 60).toString().split('.').map((time, position) => {
        time = Number(time);
        if (position > 0) time /= 10;
        if (position > 0) time *= 60;
        if (time < 10) time = `0${time}`;
        return time;
      }).join(':')
        .slice(0, 5),
    };

    return newArrayOfProffys;
  }, timeFromAndTimeTo);

  return newProffys;
}

async function getAllProffys() {
  const today = new Date(Date.now());
  const weekday = today.getDay();
  const timeInMinutes = convertHoursToMinutes(`${today.getHours()}:${today.getMinutes()}`);

  const proffysPromise = subjects.map(async (_, index) => {
    const filters = {
      subject: index + 1,
      weekday,
    };

    const newProffys = await getProffys({ filters, timeInMinutes });
    return newProffys;
  });

  let proffys = await Promise.all(proffysPromise);
  [proffys] = proffys.filter((proffy) => proffy.length > 0);

  return proffys;
}

module.exports = {
  getAllProffys,
  getProffys,
};
