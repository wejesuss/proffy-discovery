const Intl = require('intl');
const Database = require('./database/db');
const {
  convertHoursToMinutes, getSubject, getWeekDay, subjects, weekdays, clearCostOrWhatsapp,
} = require('./utils');
const createProffys = require('./database/createProffys');

module.exports = {
  index: (req, res) => res.render('index.html'),

  // eslint-disable-next-line consistent-return
  study: async (req, res) => {
    const filters = req.query;
    const db = await Database;

    if (!filters.weekday || !filters.time || !filters.subject) {
      return res.render('study.html', { filters, subjects, weekdays });
    }

    const timeInMinutes = convertHoursToMinutes(filters.time);

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

    try {
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
          weekday: getWeekDay(newArrayOfProffys[index].weekday),
          subject: getSubject(proffy.subject),
          cost: Intl.NumberFormat('pt-BR', {
            currency: 'BRL',
            style: 'currency',
          }).format(proffy.cost),
        };

        return newArrayOfProffys;
      }, timeFromAndTimeTo);

      return res.render('study.html', {
        proffys: newProffys,
        subjects,
        weekdays,
        filters,
      });
    } catch (error) {
      console.error(error);
    }
  },

  giveClasses: (req, res) => res.render('give-classes.html', { subjects, weekdays }),

  createClasses: async (req, res) => {
    const data = req.body;
    const isNotEmpty = Object.keys(data).length > 0;

    if (isNotEmpty) {
      try {
        const db = await Database;

        const proffyValue = {
          name: data.name,
          avatar: data.avatar,
          whatsapp: clearCostOrWhatsapp(undefined, data.whatsapp),
          bio: data.bio.replace(/(\r\n)?(\n)/g, '<br>'),
        };

        const classValue = {
          subject: +data.subject,
          cost: clearCostOrWhatsapp(data.cost),
        };

        const classScheduleValues = data.weekday.map((weekday, index) => ({
          weekday: +weekday,
          time_from: convertHoursToMinutes(data.time_from[index]),
          time_to: convertHoursToMinutes(data.time_to[index]),
        }));

        await createProffys(db, { classScheduleValues, classValue, proffyValue });

        const query = `?weekday=${data.weekday[0]}&subject=${data.subject}&time=${data.time_from[0]}`;

        return res.render('success.html', { query });
      } catch (error) {
        console.error(error);
      }
    }

    return res.render('give-classes.html', { subjects, weekdays });
  },
};
