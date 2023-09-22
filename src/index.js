// Populate nav bar with all movies on page load

// ! Load first movie in list to window on page load

// ! Populate window with relevant info when a movie in nav bar is clicked

// ! Button content changes from watched/unwatched

// ! Persist information about watched/unwatched

// ! Update number of blood drops when users adds to associated form

// ! Persist information about blood drops

// ! Variables
const MOVIESURL = 'http://localhost:3000/movies';

const movieListNav = document.querySelector('#movie-list');

const movieInfoDiv = document.querySelector('#movie-info');
    const movieInfoImg = document.querySelector('#detail-image');
    const movieInfoTitle = document.querySelector('#title');
    const movieInfoYear = document.querySelector('#year-released');
    const movieInfoDesc = document.querySelector('#description');
    const watchedBtn = document.querySelector('#watched');
    const bloodAmount = document.querySelector('#amount');

const bloodForm = document.querySelector('#form');
    const amountInput = document.querySelector('#blood-amount');
    const addBloodBtn = document.querySelector('form:nth-child(3)');

let movieDisplayed = false;

// ! CRUD functions
//GET all moviesObj to populate nav bar on page load
const fetchAllMovies = () => {
    return fetch(MOVIESURL)
    .then(resp => resp.json())
};

//GET a movieObj to populate the window
//Fire on first movie on page load 
const fetchOneMovie = (selectedMovieId) => {
    return fetch(`${MOVIESURL}/${selectedMovieId}`)
    .then(resp => resp.json())
};

//PATCH blood_amount and watched depending on which value is passed in
const patchOneMovie = (selectedMovieId, propertyToBePatched, newValue) => {
    const patchData = {};
    patchData[propertyToBePatched] = newValue;
    fetch(`${MOVIESURL}/${selectedMovieId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchData)
    })
    .then(resp => resp.json())
};

// ! Define populateNavBar
const populateNavBar = () => {
    fetchAllMovies()
    .then(moviesObj => renderMovieNavs(moviesObj))
};

const createMovieNav = (movieObj) => {
    const movieNav = document.createElement('img');
    movieNav.src = movieObj.image;
    movieNav.alt = movieObj.title;
    movieNav.setAttribute('data-id', movieObj.id);
    movieNav.addEventListener('click', displayMovie)
    movieListNav.appendChild(movieNav)

};

const renderMovieNavs = (moviesObj) => {
    moviesObj.forEach(createMovieNav);
};

document.addEventListener('DOMContentLoaded', populateNavBar)

// ! Define displayMovie
const displayMovie = (e) => {
    return fetchOneMovie(e.target.dataset.id)
    .then(movieObj => {
        movieInfoImg.src = movieObj.image;
        movieInfoImg.alt = movieObj.title;
        movieInfoTitle.textContent = movieObj.title;
        movieInfoYear.textContent = movieObj['release_year'];
        movieInfoDesc.textContent = movieObj.description;
        watchedBtn.textContent = (movieObj.watched ? 'watched' : 'unwatched');
        bloodAmount.textContent = movieObj['blood_amount'];
    })
};

// const isWatched = (selectedMovieId) => {
//     return fetchOneMovie(selectedMovieId)
//     .then(movieObj => !movieObj.watched)
//     .then(bool => bool ? 'watched' : 'unwatched')
// };

// document.addEventListener('DOMContentLoaded', displayMovie())