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
let messageShown = false;
class Workout {
  date = new Date();
  id = Date.now().toString();

  constructor(latLng, distance, duration) {
    this.latLng = latLng; // [lat, lng]
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
  type = 'running';
  constructor(latLng, distance, duration, cadance) {
    super(latLng, distance, duration);
    this.cadance = cadance;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(latLng, distance, duration, elevationGain) {
    super(latLng, distance, duration);
    this.elevationGain = elevationGain;
  }
}

class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        errorMessage('couldnt get your position');
      });
    }
  }

  showWorkout() {
    return this.#workouts;
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
    //helper functions
    const validInput = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    // get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { latlng } = this.#mapEvent;
    let workout;
    //check if data is valid

    // if running, create running object
    if (type === 'running') {
      const cadance = +inputCadence.value;
      if (
        !validInput(distance, duration, cadance) ||
        !allPositive(distance, duration, cadance)
      )
        return errorMessage('input have to be postive number');

      workout = new Running(latlng, distance, duration, cadance);
    }

    // if cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !validInput(distance, duration, elevation) |
        !allPositive(distance, duration)
      )
        return errorMessage('input have to be postive number');

      workout = new Cycling(latlng, distance, duration, elevation);
    }

    // add new object to workout array
    this.#workouts.push(workout);

    // render workout on map as marker
    this.renderWorkoutMarker(workout);

    // render workout on list

    // hide the form && clear input fields

    //clearing input fields
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';
  }

  renderWorkoutMarker(workout) {
    L.marker(workout.latLng)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`bruh.<br> ${workout.latLng} <br>Easily customizable.`)
      .openPopup();
  }
}

const app = new App();

function errorMessage(msg) {
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

  //prevent multiple messges
  if (messageShown === true) {
    msgOverlay.remove();
  } else {
    messageShown = true;
    document.querySelector('body').append(msgOverlay);
  }

  const btnClose = document.querySelectorAll('.msg-btnClose');
  btnClose.forEach(btnCls => {
    btnCls.addEventListener('click', () => {
      msgOverlay.remove();
      messageShown = false;
    });
  });
}
