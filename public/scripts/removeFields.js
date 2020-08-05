function removeScheduleItem(event) {
    const schedules = document.querySelectorAll('.schedule-item')
    const schedule = event.target.parentElement.parentElement

    if(schedules.length === 1) {
        return false
    }

    schedule.remove()
}
