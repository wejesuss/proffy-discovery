const Database = require('./db');
const createProffys = require('./createProffys');

Database.then(async (db) => {
  const proffyValue = {
    name: 'Wemerson Jesus',
    avatar: 'https://github.com/wejesuss.png',
    whatsapp: '56467475464',
    bio: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. <br /> <br /> Est sint dolor enim, veritatis corporis, fugit, sunt itaque officiis nobis harum ad! Possimus.',
  };

  const classValue = {
    subject: 7,
    cost: '50',
  };

  const classScheduleValues = [
    {
      weekday: 4,
      time_from: 1380,
      time_to: 300,
    },
  ];

  // await createProffys(db, { proffyValue, classScheduleValues, classValue})

  const proffys = await db.all(`
        SELECT classes.*, proffys.*, class_schedules.*
        FROM class_schedules
        JOIN proffys ON (classes.proffy_id = proffys.id)
        JOIN classes ON (class_schedules.class_id = classes.id)
        WHERE EXISTS (
            SELECT class_schedules.*
            FROM class_schedules
            WHERE class_schedules.class_id = classes.id
            AND class_schedules.weekday = "4"
            AND (class_schedules.time_to > class_schedules.time_from
                    AND class_schedules.time_from <= "1380"
                    AND class_schedules.time_to > "1380"
                OR (class_schedules.time_to < class_schedules.time_from
                    AND class_schedules.time_from <= "1380"
                )
            )
        )
        AND classes.subject = "7"
    `);

  console.log(proffys);
});
