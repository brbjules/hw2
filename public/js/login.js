const errorDiv = document.querySelector('.error');
const formLogIn = document.forms['login'];
const formSignUp = document.forms['signup'];
const regButton = document.querySelector('.noacc a');
const returnButton = document.querySelector('.goback a');
const title = document.querySelector('.sign-up h1');

function onResponse(response) {
    return response.json();
}

function errorClear() {
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
}

function switchForms() {
    for (element of [formLogIn, formSignUp, regButton, returnButton])
        element.parentNode.classList.toggle('hidden');
    errorClear();
}

function goBack() {
    title.textContent = 'Log in';
    switchForms();
}

function signUp() {
    title.textContent = 'Sign up';
    switchForms();
}

regButton.addEventListener('click', signUp);
returnButton.addEventListener('click', goBack);

function displayErr(event, errorText) {
    let errorSpan = document.createElement('span');
    let lineBreak = document.createElement('br');
    errorSpan.textContent = errorText;
    errorDiv.appendChild(errorSpan);
    errorDiv.appendChild(lineBreak);
    errorDiv.classList.remove('hidden');
    event.preventDefault();
}

function fieldRequired(event) {
    for (field of event.currentTarget.querySelectorAll('input')) {
        let oldWarning = field.parentNode.querySelector('span');
        if (oldWarning) {
            field.classList.remove('red-border');
            oldWarning.remove();
        }
        if (field.value.length === 0) {
            let warning = document.createElement('span');
            warning.textContent = 'This field is required.';
            field.parentNode.querySelector('label').appendChild(warning);
            field.classList.add('red-border');
            event.preventDefault();
        }
    }
}

function checkIfTaken(event) {
    let field = event.currentTarget;
    let type = (field.name === 'regname') ? 'username' : 'email';
    let oldWarning = field.parentNode.querySelector('span');
    if (oldWarning)
        oldWarning.remove();
    fetch(BASE_URL + '/check_signup/' + type + '/' + encodeURIComponent(String(field.value).toLowerCase()))
        .then(onResponse).then(jsonTaken);
}

function jsonTaken(json) {
    let field = (json.type === 'username')
        ? formSignUp.regname : formSignUp.regmail;
    const statusSpan = document.createElement('span');
    if (!json.exists) {
        if ((field === formSignUp.regmail && checkEmail(field)) || field.value.length > 3) {
            let checkIcon = document.createElement('img');
            checkIcon.src = 'assets/check.png';
            statusSpan.appendChild(checkIcon);
        }
        field.dataset.inuse = 0;
    } else {
        statusSpan.textContent = (field.name === 'regname')
            ? 'This username is already in use.'
            : 'This address is already in use.';
        field.dataset.inuse = 1;
    }
    field.parentNode.querySelector('label').appendChild(statusSpan);
}



function checkEmail(mail) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(String(mail.value).toLowerCase());
}

function checkPassword(event, pwInput, pwConfirmInput) {
    if (pwInput.value !== pwConfirmInput.value)
        displayErr(event, 'The passwords do not match.');
    if (pwInput.value.length < 8)
        displayErr(event, 'Your password must be at least 8 characters long.');
}

function validateLogin(event) {
    for (field of event.currentTarget.querySelectorAll('input')) {
        if (field.value.length === 0) {
            errorClear();
            displayErr(event, 'Please insert username and password.');
        }
    }
}

function validateReg(event) {
    errorClear();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formSignUp.regname.value))
        displayErr(event, 'Your username must be between 3 and 20 characters long'
            + ' and can only include letters, numbers, and underscores.');
    if (!checkEmail(formSignUp.regmail))
        displayErr(event, 'The email address you entered isn\'t valid.');
    if (formSignUp.regmail.dataset.inuse === '1')
        displayErr(event, 'The email address you entered is already in use.');
    if (formSignUp.regname.dataset.inuse === '1')
        displayErr(event, 'The username you entered is already in use.');
    checkPassword(event, formSignUp.regpw, formSignUp.regconfirm);
    fieldRequired(event);
}

formLogIn.addEventListener('submit', validateLogin);
formSignUp.addEventListener('submit', validateReg);
formSignUp.regname.addEventListener('blur', checkIfTaken);
formSignUp.regmail.addEventListener('blur', checkIfTaken);

let pwBar = formSignUp.querySelector('#regpw');
function strengthFunc() {
    let point = 0;
    let pwVal = pwBar.value;
    if (pwVal.length >= 3) {
        let arrayTest =
            [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/, /[*]/, /[!]/, /[,]/];
        for (item of arrayTest)
            if (item.test(pwVal))
                point++;
    }
    let barDiv = formSignUp.querySelector('.strength');
    let barText = barDiv.querySelector('p');
    let barVal = point;
    if (point > 6) barVal = 6;
    barDiv.dataset.strengthVal = barVal;
    if (barVal < 3)
        barText.textContent = 'Weak';
    else if (barVal < 5)
        barText.textContent = 'Average';
    else barText.textContent = 'Strong';
}
pwBar.addEventListener('input', strengthFunc);