'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

navigator.geolocation.getCurrentPosition(
  position => {
    const { longitude, latitude } = position.coords;
    const latLong = [latitude, longitude];
    const map = L.map('map').setView(latLong, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(latLong)
      .addTo(map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();
  },
  () => {
    popupMessage('couldnt get your position');
  }
);

function popupMessage(msg) {
  const msgOverlay = document.createElement('div');
  msgOverlay.classList.add('msg-overlay');
  const msgContainer = document.createElement('div');
  msgContainer.classList.add('msg-container');
  const msgBtnClose = document.createElement('button');
  msgBtnClose.classList.add('msg-btnClose');
  msgBtnClose.textContent = 'X';

  const msgHeading = document.createElement('h2');
  msgHeading.classList.add('msg-heading');
  msgHeading.textContent = 'Error';
  const msgText = document.createElement('p');
  msgText.classList.add('msg-text');
  msgText.textContent = msg;

  msgContainer.append(msgBtnClose, msgHeading, msgText);
  msgOverlay.append(msgContainer);
  document.querySelector('body').append(msgOverlay);

  const btnClose = document.querySelector('.msg-btnClose');
  btnClose.addEventListener('click', () => {
    msgOverlay.remove();
  });
}
