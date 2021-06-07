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

let map, mapEvent;

class App {
  constructor() {}
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap(),
        popupMessage('couldnt get your position')
      );
    }
  }
  _loadMap(position) {
    const { longitude, latitude } = position.coords;
    const latLong = [latitude, longitude];
    map = L.map('map').setView(latLong, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on('click', mapE => {
      mapEvent = mapE;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  }
  _showForm() {}
  _toggleElevationField() {}
  _newWorkout() {}
}

form.addEventListener('submit', e => {
  e.preventDefault();

  //clearing input fields
  inputDistance.value =
    inputCadence.value =
    inputDuration.value =
    inputElevation.value =
      '';

  //putting pins on map
  const { latlng } = mapEvent;
  console.log(mapEvent);
  L.marker(latlng)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className:
          inputType.textContent === 'Running'
            ? 'running-popup'
            : 'cycling-popup',
      })
    )
    .setPopupContent(`bruh.<br> ${latlng} <br>Easily customizable.`)
    .openPopup();
});

inputType.addEventListener('change', () => {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});

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
