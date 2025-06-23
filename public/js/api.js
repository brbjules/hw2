function onResponse(response) {
    return response.json();
}

function addDay(array, index, entry) {
    array[index] = [];
    array[index][0] = entry.name;
    array[index][1] = 1;
    array[index][2] = entry.date;
}

function insInArr(arr, length, start, elem) {
    for (let j = length; j > start; j--)
        arr[j] = arr[j-1];
    arr[start] = elem;
}

function getCountryCode(day, json) {
    for (const child of json)
        if (child.name === day[0])
            return child.countryCode;
}

function onHolidayJson(json) {
    let holidayArr = [];
    for (const child of json) {
        if (child === json[0])
            addDay(holidayArr, 0, child);
        else {
            for (let i = 0; i < holidayArr.length; i++) {
                if (child.name === holidayArr[i][0] && child.date === holidayArr[i][2]) {
                    holidayArr[i][1]++;
                    break;
                } else if (i + 1 === holidayArr.length) {
                    addDay(holidayArr, i + 1, child);
                    break;
                }
            }
        }
    }
    let dateArr = [];
    for (const holiday of holidayArr) {
        let date = holiday[2];
        let arrLen = dateArr.length;
        if (holiday === holidayArr[0])
            dateArr[0] = date;
        else if (arrLen === 1) {
            if (date === dateArr[0])
                continue;
            else if (date < dateArr[0]) {
                insInArr(dateArr, 2, 0, date);
            } else dateArr[1] = date;
        } else {
            if (dateArr[arrLen-1] < date)
                dateArr[arrLen] = date;
            for (let i = 0; i < arrLen; i++) {
                if (dateArr[i] === date)
                    break;
                if (i > 0 && dateArr[i-1] < date && dateArr[i] > date) {
                    insInArr(dateArr, arrLen, i, date);
                    break;
                }
            }
            if (dateArr[0] > date)
                insInArr(dateArr, arrLen, 0, date);
        }
    }
    for (const date of dateArr) {
        const view = document.querySelector('#holidays');
        const title = document.createElement('h3');
        title.textContent = date + ':';
        view.appendChild(title);
        for (const holiday of holidayArr) {
            if (holiday[2] === date) {
                let parForm = '';
                if (holiday[1] === 1)
                    parForm = getCountryCode(holiday, json);
                else parForm = holiday[1] + ' countries';
                view.appendChild(document.createElement('p'))
                    .textContent = holiday[0] + ', ' + parForm;
            }
        }
    }
}

function onHolidayErr(error) {
    let errText = document.createElement('p');
    errText.textContent = error;
    document.querySelector('#holidays').appendChild(errText);
}

fetch('https://date.nager.at/api/v3/NextPublicHolidaysWorldwide')
    .then(onResponse, onHolidayErr).then(onHolidayJson);
