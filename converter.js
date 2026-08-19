const ethMonths = [
    "1 - መስከረም", "2 - ጥቅምት", "3 - ህዳር",
    "4 - ታህሳስ", "5 - ጥር", "6 - የካቲት",
    "7 - መጋቢት", "8 - ሚያዚያ", "9 - ግንቦት",
    "10 - ሰኔ", "11 - ሐምሌ", "12 - ነሐሴ", "13 - ጳጉሜ"
];

const gregMonths = [
    "1 - January", "2 - February", "3 - March", "4 - April",
    "5 - May", "6 - June", "7 - July", "8 - August",
    "9 - September", "10 - October", "11 - November", "12 - December"
];

let currentDirection = 'ethToGreg';

function setDirection(dir) {
    currentDirection = dir;
    document.getElementById('btnEthToGreg').classList.toggle('active', dir === 'ethToGreg');
    document.getElementById('btnGregToEth').classList.toggle('active', dir === 'gregToEth');
    populateMonths();
    document.getElementById('output-result').innerText = "enter date above and click convert";
}

function populateMonths() {
    const select = document.getElementById('month');
    select.innerHTML = '';
    const months = (currentDirection === 'ethToGreg') ? ethMonths : gregMonths;

    months.forEach((m, idx) => {
        const opt = document.createElement('option');
        opt.value = idx + 1;
        opt.textContent = m;
        select.appendChild(opt);
    });
}

function ethToJDN(year, month, day) {
    return 1724220 + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day;
}

function jdnToGreg(jdn) {
    let l = jdn + 68569;
    let n = Math.floor((4 * l) / 146097);
    l = l - Math.floor((146097 * n + 3) / 4);
    let i = Math.floor((4000 * (l + 1)) / 1461001);
    l = l - Math.floor((1461 * i) / 4) + 31;
    let j = Math.floor((80 * l) / 2447);
    let day = l - Math.floor((2447 * j) / 80);
    l = Math.floor(j / 11);
    let month = j + 2 - 12 * l;
    let year = 100 * (n - 49) + i + l;
    return { year, month, day };
}

function gregToJDN(year, month, day) {
    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function jdnToEth(jdn) {
    let r = jdn - 1724220;
    let year = Math.floor((4 * r) / 1461);
    while (ethToJDN(year + 1, 1, 1) <= jdn) year++;
    while (ethToJDN(year, 1, 1) > jdn) year--;
    let dayOfYear = jdn - ethToJDN(year, 1, 1) + 1;
    let month = Math.floor((dayOfYear - 1) / 30) + 1;
    let day = ((dayOfYear - 1) % 30) + 1;
    return { year, month, day };
}

function convert() {
    const day = parseInt(document.getElementById('day').value);
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);
    const output = document.getElementById('output-result');

    if (!day || !month || !year) {
        output.innerText = "Please enter day, month, and year.";
        return;
    }

    if (currentDirection === 'ethToGreg') {
        if (month === 13) {
            const isLeap = (year % 4 === 3);
            const maxPagume = isLeap ? 6 : 5;
            if (day > maxPagume) {
                output.innerText = `Error: Pagume in ${year} E.C. only has ${maxPagume} days.`;
                return;
            }
        } else if (day > 30) {
            output.innerText = "Error: Ethiopian months 1-12 have maximum 30 days.";
            return;
        }

        const jdn = ethToJDN(year, month, day);
        const res = jdnToGreg(jdn);
        const monthName = gregMonths[res.month - 1].split('-')[1].trim();
        output.innerText = `${res.day} ${monthName} ${res.year} (Gregorian)`;
    } else {
        if (day > 31) {
            output.innerText = "Error: Days cannot exceed 31.";
            return;
        }

        const jdn = gregToJDN(year, month, day);
        const res = jdnToEth(jdn);
        const monthName = ethMonths[res.month - 1].split('-')[1].trim();
        output.innerText = `${res.day} ${monthName} ${res.year} E.C. (Ethiopian)`;
    }
}

function setTodayDate() {
    const today = new Date();
    let gDay = today.getDate();
    let gMonth = today.getMonth() + 1;
    let gYear = today.getFullYear();

    if (currentDirection === 'gregToEth') {
        document.getElementById('day').value = gDay;
        document.getElementById('month').value = gMonth;
        document.getElementById('year').value = gYear;
    } else {
        let jdn = gregToJDN(gYear, gMonth, gDay);
        let eth = jdnToEth(jdn);
        document.getElementById('day').value = eth.day;
        document.getElementById('month').value = eth.month;
        document.getElementById('year').value = eth.year;
    }
    convert();
}

populateMonths();