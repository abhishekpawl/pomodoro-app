let interval;

const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0
};

const getRemainingTime = (endTime) => {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return {
        total,
        minutes,
        seconds
    };
}

const startTimer = () => {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    if (timer.mode === 'pomodoro') {
        timer.sessions++;
    }

    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    interval = setInterval(() => {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();

        total = timer.remainingTime.total;
        if (total <= 0) {
            clearInterval(interval);

            switch (timer.mode) {
                case pomodoro:
                    if (timer.sessions % timer.longBreakInterval === 0) {
                        switchMode('longBreak');
                    } else {
                        switchMode('shortBreak');
                    }
                    break;
                default:
                    break;
            }

            document.querySelector(`[data-sound="${timer.mode}"]`).play();

            if (Notification.permission === 'granted') {
                const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
                new Notification(text);
            }

            startTimer();
        }
    }, 1000);
}

const stopTimer = () => {
    clearInterval(interval);

    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
}

const updateClock = () => {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');

    min.textContent = minutes;
    sec.textContent = seconds;

    const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
    document.title = `${minutes}:${seconds} - ${text}`;

    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

const switchMode = (mode) => {
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0
    };

    document.querySelectorAll('button[data-mode]').forEach(e => e.classList.remove('active'));

    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

    document.body.style.backgroundColor = `var(--${mode})`;

    document.getElementById('js-progress').setAttribute('max', timer.remainingTime.total);

    updateClock();
}

const clickHandler = (e) => {
    /* console.log(e.target.dataset.mode); */
    const { mode } = e.target.dataset;

    if (!mode) return;

    switchMode(mode);
    stopTimer();
}

const pomodoroButton = document.querySelector('#js-pomodoro');
const shortBreakButton = document.querySelector('#js-short-break');
const longBreakButton = document.querySelector('#js-long-break');

pomodoroButton.addEventListener('click', clickHandler);
shortBreakButton.addEventListener('click', clickHandler);
longBreakButton.addEventListener('click', clickHandler);

const buttonSound = new Audio('button-sound.mp3');
const mainButton = document.querySelector('#js-btn');

mainButton.addEventListener('click', () => {
    buttonSound.play();
    const { action } = mainButton.dataset;
    if (action === 'start') {
        startTimer();
    } else {
        stopTimer();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if ('Notification' in window) {
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission().then(function(permission) {
                if (permission === 'granted') {
                    new Notification(
                        'Awesome! You will be notified at the start of each session'
                    );
                }
            });
        }
    }

    switchMode('pomodoro');
});