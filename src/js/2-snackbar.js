const form = document.querySelector('.form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const delay = Number(form.delay.value);
  const state = form.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then((delayValue) => {
      iziToast.success({
        title: '',
        message: `✅ Fulfilled promise in ${delayValue}ms`,
        position: 'topRight',
      });
    })
    .catch((delayValue) => {
      iziToast.error({
        title: '',
        message: `❌ Rejected promise in ${delayValue}ms`,
        position: 'topRight',
      });
    });

  form.reset();
});
