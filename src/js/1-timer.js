const startBtn = document.querySelector('[data-start]');
const datetimePicker = document.getElementById('datetime-picker');
const daysRef = document.querySelector('[data-days]');
const hoursRef = document.querySelector('[data-hours]');
const minutesRef = document.querySelector('[data-minutes]');
const secondsRef = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];
    if (!pickedDate) return;
    if (pickedDate <= new Date()) {
      iziToast.error({
        title: '',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
      userSelectedDate = null;
      return;
    }
    userSelectedDate = pickedDate;
    startBtn.disabled = false;
  },
};

flatpickr(datetimePicker, options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateDisplay({ days, hours, minutes, seconds }) {
  daysRef.textContent = addLeadingZero(days);
  hoursRef.textContent = addLeadingZero(hours);
  minutesRef.textContent = addLeadingZero(minutes);
  secondsRef.textContent = addLeadingZero(seconds);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
  datetimePicker.disabled = false;
  startBtn.disabled = true;
}

startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  datetimePicker.disabled = true;

  const diff = userSelectedDate - new Date();
  if (diff <= 0) {
    updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    stopTimer();
    return;
  }
  updateDisplay(convertMs(diff));

  timerId = setInterval(() => {
    const now = new Date();
    const delta = userSelectedDate - now;
    if (delta <= 0) {
      updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      stopTimer();
      return;
    }
    updateDisplay(convertMs(delta));
  }, 1000);
});
