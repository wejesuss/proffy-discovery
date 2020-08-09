/* eslint-disable camelcase */
// eslint-disable-next-line max-len
module.exports = async function createProffys(db, { proffyValue, classValue, classScheduleValues }) {
  try {
    const insertedProffy = await db.run(`
            INSERT INTO proffys (
                name,
                avatar,
                whatsapp,
                bio
            ) VALUES (
                "${proffyValue.name}",
                "${proffyValue.avatar}",
                "${proffyValue.whatsapp}",
                "${proffyValue.bio}"
            );
        `);

    const proffy_id = insertedProffy.lastID;

    const insertedClass = await db.run(`
            INSERT INTO classes (
                subject,
                cost,
                proffy_id
            ) VALUES (
                "${classValue.subject}",
                "${classValue.cost}",
                "${proffy_id}"
            );
        `);

    const class_id = insertedClass.lastID;

    const insertAllClassScheduleValues = classScheduleValues.map((scheduleValue) => db.run(`
                INSERT INTO class_schedules (
                    weekday,
                    time_from,
                    time_to,
                    class_id
                ) VALUES (
                    "${scheduleValue.weekday}",
                    "${scheduleValue.time_from}",
                    "${scheduleValue.time_to}",
                    "${class_id}"
                );
            `));

    await Promise.all(insertAllClassScheduleValues);
  } catch (error) {
    console.error(error);
  }
};
