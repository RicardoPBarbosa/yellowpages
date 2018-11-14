document.addEventListener('DOMContentLoaded', function (event) {
  let map
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }
});

const showPhoneNumber = (el, number) => {
  el.querySelector('i').classList.add('rotated')
  el.innerHTML = el.innerHTML.replace('Contacto', number)
}

let currentPage = 0;
const lastPage = '{{ pages ? pages : 0 }}'
const pageNumbers = document.querySelectorAll('#resultsPagination button')
const resultsContainer = document.querySelector('.results')
let coordinates = []

const changePage = (el, nextPage) => {
  if (!el) return
  direction = ''
  if (nextPage > currentPage) direction = 'next'
  if (nextPage < currentPage) direction = 'prev'
  if (nextPage == currentPage) return
  for (let j = 0; j < pageNumbers.length; j++) {
    pageNumbers[j].classList.contains('active') ? pageNumbers[j].classList.remove('active') : ''
  }
  el.classList.add('active')
  currentPage = nextPage
  const csrf_token = document.querySelector('input[name="_csrf"]').value
  coordinates = [] // reset coordinates
  // get data
  getData(`/results/list/?page=${currentPage}`, { csrf_token })
    .then(data => {
      const results = data.results.data
      resultsContainer.innerHTML = ''
      let i = 0
      for (i; i < results.length; i++) {
        const result = results[i]
        coordinates.push(result.latitude + ', ' + result.longitude)
        let logo = 'placeholder.png'
        if (result.logo && result.logo !== 'placeholder.png') {
          logo = 'results/' + result.logo
        }
        const newElement = `
        <div class="column">
          <div class="result">
            <div class="logo" style="background-image: url(storage/uploads/${logo})"></div>
            <div class="info">
              <span class="name">
                ${result.name}
                <span class="res_number">${i + 1}</span>
              </span>
              <span class="email">${result.email}</span>
              <span class="address">${result.address} <small>|</small> ${result.postal_code}</span>
              <span class="locality">${result.locality}</span>
              <button class="button is-warning is-fullwidth" onclick="showPhoneNumber(this, '${result.phone}')"><i class="fas fa-phone"></i>&nbsp; Contacto</button>
            </div>
          </div>
        </div>
        `
        resultsContainer.innerHTML += newElement
      }
      while (i < 3) {
        const newElement = `
        <div class="column"></div>
        `
        resultsContainer.innerHTML += newElement
        i++
      }

      vectorSource.clear();
      let features = []
      let k = 0
      let splitted, coords = []
      for (let i = 0; i < coordinates.length; i++) {
        splitted = coordinates[i].split(", ")
        coords.push([parseFloat(splitted[0]), parseFloat(splitted[1])])

        iconFeature = new ol.Feature({
          geometry: new ol.geom.Point(coords[i])
        })

        if (i == 0) {
          iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              src: '/storage/point-1.png'
            }))
          })
        } else if (i == 1) {
          iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              src: '/storage/point-2.png'
            }))
          })
        } else if (i == 2) {
          iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
              anchor: [0.5, 46],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              src: '/storage/point-3.png'
            }))
          })
        }

        iconFeature.setStyle(iconStyle)

        features[k] = iconFeature
        k++
      }

      vectorSource = new ol.source.Vector({
        features: features
      })

      vectorLayer = new ol.layer.Vector({
        source: vectorSource
      })
      map.addLayer(vectorLayer)

    })
    .catch(error => {
      console.log(error)
    })
}

const getData = (url = ``, data = {}) => {
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Accept": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRF-Token": data.csrf_token
    },
  })
    .then(response => response.json());
}

if (pageNumbers.length) {
  changePage(document.querySelector('.paginate-results > button'), 1)
}

const parseCoords = (coordsArray) => {
  let splitted, coords = []
  for (let i = 0; i < coordsArray.length; i++) {
    splitted = coordsArray[i].split(", ")
    coords.push([parseFloat(splitted[0]), parseFloat(splitted[1])])
  }
  return coords
}

const searchResultsCoordinates = document.querySelectorAll('.results .result .coordinates')
if (searchResultsCoordinates.length) {
  coordinates = []
  for (let i = 0; i < searchResultsCoordinates.length; i++) {
    const element = searchResultsCoordinates[i]
    coordinates.push(element.innerHTML)
  }
}

const closeModal = (modal, html) => {
  modal.classList.remove('is-active')
  html.classList.remove('is-clipped')
}

const openModal = (id) => {
  event.preventDefault()
  const modal = document.querySelector('#feat-' + id)  // assuming you have only 1
  const html = document.querySelector('html')
  const close = document.querySelector('#feat-' + id + ' .modal-close')
  const sliderRight = document.querySelector('.slider-right')
  const sliderLeft = document.querySelector('.slider-left')
  modal.classList.add('is-active')
  html.classList.add('is-clipped')

  modal.querySelector('.modal-background').addEventListener('click', function (e) {
    closeModal(modal, html)
  })
  close.addEventListener('click', function (e) {
    closeModal(modal, html)
  })
  sliderLeft.addEventListener('click', function (e) {
    closeModal(modal, html)
  })
  sliderRight.addEventListener('click', function (e) {
    closeModal(modal, html)
  })
}