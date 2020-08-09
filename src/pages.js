const Database = require('./database/db');
const {
  convertHoursToMinutes, subjects, weekdays, clearCostOrWhatsapp, scapeFields,
} = require('./utils');
const { getAllProffys, getProffys } = require('./database/getAllProffys');
const createProffys = require('./database/createProffys');

module.exports = {
  index: (req, res) => res.render('index.html'),

  // eslint-disable-next-line consistent-return
  study: async (req, res) => {
    const filters = req.query;

    if (!filters.weekday || !filters.time || !filters.subject) {
      const proffys = await getAllProffys();
      return res.render('study.html', {
        filters, subjects, weekdays, proffys,
      });
    }

    const timeInMinutes = convertHoursToMinutes(filters.time);
    try {
      const proffys = await getProffys({ filters, timeInMinutes });

      return res.render('study.html', {
        proffys,
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
          bio: scapeFields(data.bio.replace(/(\r\n)?(\n)/g, '<br>')),
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
