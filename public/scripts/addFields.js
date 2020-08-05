const addNewScheduleButton = document.querySelector("#add-time")

addNewScheduleButton.addEventListener("click", addNewScheduleField)

function addNewScheduleField() {
    const fieldsContainer = document.querySelectorAll(".schedule-item")
    const newFieldContainer = fieldsContainer[fieldsContainer.length - 1].cloneNode(true)
    const inputs = newFieldContainer.querySelectorAll('input')
    let isNotFilled = false

    inputs.forEach(input => {
        if(input.value == "") isNotFilled = true
        input.value = ''
    })

    if(isNotFilled)
        return false

    if (fieldsContainer.length < 2) {
        const div = document.createElement('div')
        const img = document.createElement('img')

        div.classList.add('input-block' , 'trash')
        img.src = '/icons/trash.svg'
        img.alt = "Apagar campo"
        img.onclick = removeScheduleItem
        div.appendChild(img)

        newFieldContainer.appendChild(div)
    } else {
        newFieldContainer.querySelector(".input-block.trash img").onclick = removeScheduleItem
    }

    document.querySelector("fieldset#schedule-items").appendChild(newFieldContainer)
}
