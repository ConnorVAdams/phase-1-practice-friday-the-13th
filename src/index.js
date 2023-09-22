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
const patchMovieWatched = (e) => {
    debugger
    const bool = (watchedBtn.textContent === 'watched' ? false : true)
    fetch(`${MOVIESURL}/${e.target.dataset.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({watched: bool})
    })
    .then(resp => resp.json())
};

watchedBtn.addEventListener('click', patchMovieWatched)

// ! Define populateNavBar
const populateNavBar = () => {
    fetchAllMovies()
    .then(moviesObj => renderMovieNavs(moviesObj))
    .then(() => fetchOneMovie(1))
    .then(fetchedMovie => renderMovie(fetchedMovie))
};

const createMovieNav = (movieObj) => {
    const movieNav = document.createElement('img');
    movieNav.src = movieObj.image;
    movieNav.alt = movieObj.title;
    movieNav.setAttribute('data-id', movieObj.id);
    movieNav.addEventListener('click', displayMovieFromNav)
    movieListNav.appendChild(movieNav)
};

const renderMovieNavs = (moviesObj) => {
    moviesObj.forEach(createMovieNav);
};

document.addEventListener('DOMContentLoaded', populateNavBar)

// ! Define displayMovie
const displayMovieFromNav = (e) => {
    fetchOneMovie(e.target.dataset.id)
    .then(movieObj => renderMovie(movieObj))
};

// ! Define renderMovie
const renderMovie = (movieObj) => {
    movieInfoImg.src = movieObj.image;
    movieInfoImg.alt = movieObj.title;
    movieInfoTitle.textContent = movieObj.title;
    movieInfoYear.textContent = movieObj['release_year'];
    movieInfoDesc.textContent = movieObj.description;
    watchedBtn.textContent = (movieObj.watched ? 'watched' : 'unwatched');
    watchedBtn.setAttribute('data-id', movieObj.id)
    bloodAmount.textContent = movieObj['blood_amount'];
    bloodAmount.setAttribute('data-id', movieObj.id)
};

// const changeWatchedBtn = (selectedMovieId) => {
//     const newValue = (watchedBtn.textContent === 'watched' ? )
//     patchOneMovie(selectedMovieId, 'watched', '')
//     .then(movieObj => watchedBtn.textContent = (movieObj.watched ? 'watched' : 'unwatched');)
// }