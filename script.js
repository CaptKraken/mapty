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
class Workout {
  date = new Date();
  id = Date.now().toString();

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance;
    this.duration = duration;
  }

  calcPace() {
    //min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadance) {
    super(coords, distance, duration);
    this.cadance = cadance;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
  }
}

class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        popupMessage('couldnt get your position');
      });
    }
  }
  _loadMap(position) {
    const { longitude, latitude } = position.coords;
    const latLong = [latitude, longitude];
    this.#map = L.map('map').setView(latLong, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }
  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    e.preventDefault();

    //clearing input fields
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';

    //putting pins on map
    const { latlng } = this.#mapEvent;
    L.marker(latlng)
      .addTo(this.#map)
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
  }
}

const app = new App();

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
