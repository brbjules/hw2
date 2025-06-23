const linkChoice = document.querySelector('#linkchoice');
const textChoice = document.querySelector('#textchoice');
const errorDiv = document.querySelector('.error');
const formLink = document.forms['link'];
const formText = document.forms['text'];
const postDesc = formText.desc;

function formSwitch(event) {
    let inactive = (linkChoice !== event.currentTarget)
        ? linkChoice : textChoice;
    event.currentTarget.dataset.select = '1';
    event.currentTarget.removeEventListener('click', formSwitch);
    inactive.dataset.select = '0';
    inactive.addEventListener('click', formSwitch);
    for (form of [formText, formLink])
        form.parentNode.classList.toggle('hidden');
    for (note of document.querySelectorAll('.note'))
        note.classList.toggle('hidden');
}

function displayErr(event, errorText) {
    let errorSpan = document.createElement('span');
    let lineBreak = document.createElement('br');
    errorSpan.textContent = errorText;
    errorDiv.appendChild(errorSpan);
    errorDiv.appendChild(lineBreak);
    errorDiv.classList.remove('hidden');
    event.preventDefault();
}

function lenCheck(event) {
    const max = (event.currentTarget === postDesc) ? 2000 : 300;
    const counter = event.currentTarget.parentNode.querySelector('.count');
    let chars = event.currentTarget.value.length;
    if (chars > max)
        counter.dataset.val = '2';
    else if (chars > max * 0.9)
        counter.dataset.val = '1';
    else counter.dataset.val = '0';
    counter.textContent = chars + '/' + max;
}

function checkEmptyField(inputFields) {
    for (field of inputFields)
        if (field.parentNode.querySelector('strong') && field.value.length === 0)
            return true;
    return false;
}

function validate(event) {
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
    let allFields = event.currentTarget.querySelectorAll('input, textarea');
    if (checkEmptyField(allFields))
        displayErr(event, 'Please fill out all required fields.');
    for (field of allFields) {
        let counter = field.parentNode.querySelector('.count');
        if (counter && counter.dataset.val === '2') {
            displayErr(event, 'The text you entered exceeds the character limit.');
            break;
        }
    }
    for (urlField of event.currentTarget.querySelectorAll('#linkurl, #texturl'))
        if (!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,24}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/
            .test(urlField.value) && urlField.value.length > 0)
            displayErr(event, 'The URL you entered is invalid. Please try again.')
}

if (textPostRedirect) {
    textChoice.dataset.select = '1';
    linkChoice.dataset.select = '0';
    for (form of [formText, formLink])
        form.parentNode.classList.toggle('hidden');
    for (note of document.querySelectorAll('.note'))
        note.classList.toggle('hidden');
    linkChoice.addEventListener('click', formSwitch);
} else textChoice.addEventListener('click', formSwitch);
formLink.linktitle.addEventListener('input', lenCheck);
formText.posttitle.addEventListener('input', lenCheck);
postDesc.addEventListener('input', lenCheck);
for (form of [formText, formLink])
    form.addEventListener('submit', validate);