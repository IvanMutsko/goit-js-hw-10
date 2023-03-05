import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputField: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputField.addEventListener(
  'input',
  debounce(() => {
    const trimValue = refs.inputField.value.trim();
    listClear();

    if (trimValue !== '') {
      fetchCountries(trimValue)
        .then(dataOfCountries => {
          if (dataOfCountries.length > 10) {
            Notiflix.Notify.info(
              'Too many matches found. Please enter a more specific name.'
            );
            return;
          }

          if (dataOfCountries.length > 1) {
            makeMarkupOfListCountries(dataOfCountries);
          }

          if (dataOfCountries.length === 1) {
            makeMarkupOfSingleCountrie(dataOfCountries);
          }
        })
        .catch(error => {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        });
    }
  }, DEBOUNCE_DELAY)
);

function makeMarkupOfListCountries(countries) {
  const markupCountries = countries
    .map(country => {
      return `<li><img src="${country.flags.svg}" alt="country flag" width="30px">${country.name.official}</li>`;
    })
    .join('');

  refs.countryList.innerHTML = markupCountries;
}

function makeMarkupOfSingleCountrie(country) {
  const markupCountry = country.map(countryInfo => {
    return `<h2><img src="${
      countryInfo.flags.svg
    }" alt="country flag" width="60px"/>${
      countryInfo.name.official
    }</h2><ul><li><h3>Capital: <span>${
      countryInfo.capital
    }</span></h3></li><li><h3>Population: <span>${
      countryInfo.population
    }</span></h3></li><li><h3>Languages: <span>${Object.values(
      countryInfo.languages
    ).join(', ')}</span></h3></li></ul>`;
  });

  refs.countryInfo.innerHTML = markupCountry;
}

function listClear() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
