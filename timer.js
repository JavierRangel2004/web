let h = 0;
let m = 0;
let s = 0;
let timerInterval;

function startTimer() {
    updateDisplay();
    timerInterval = setInterval(function() {
        setTime('s', '-');
        if (s === 59) {
            setTime('m', '-');
            if (m === 59) {
                setTime('h', '-');
            }
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    h = 0;
    m = 0;
    s = 0;
    updateDisplay();
}

function setTime(timeType, op) {
    switch (timeType) {
        case 'h':
            if (op === '+') {
                h++;
                if (h > 23) {
                    h = 0;
                }
            } else {
                h--;
                if (h < 0) {
                    h = 23;
                }
            }
            break;
        case 'm':
            if (op === '+') {
                m++;
                if (m > 59) {
                    m = 0;
                    h++;
                }
            } else {
                m--;
                if (m < 0) {
                    m = 59;
                    h--;
                }
            }
            break;
        case 's':
            if (op === '+') {
                s++;
                if (s > 59) {
                    s = 0;
                    m++;
                }
            } else {
                s--;
                if (s < 0) {
                    s = 59;
                    m--;
                }
            }
            break;
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('h').innerHTML = h < 10 ? '0' + h : h;
    document.getElementById('m').innerHTML = m < 10 ? '0' + m : m;
    document.getElementById('s').innerHTML = s < 10 ? '0' + s : s;
}
