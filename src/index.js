// ! Variables
const MOVIESURL = 'http://localhost:3000/movies';

const movieListNav = document.querySelector('#movie-list');

const movieInfoImg = document.querySelector('#detail-image');
const movieInfoTitle = document.querySelector('#title');
const movieInfoYear = document.querySelector('#year-released');
const movieInfoDesc = document.querySelector('#description');
const watchedBtn = document.querySelector('#watched');
const bloodAmount = document.querySelector('#amount');

const bloodForm = document.querySelector('#blood-form');
    const addBloodBtn = document.querySelector('#blood-form > input[type=submit]:nth-child(3)');
    const inputBlood = document.querySelector('#blood-amount');

// ! CRUD functions
// ! GET all moviesObj to populate nav bar on page load
const fetchAllMovies = () => {
    return fetch(MOVIESURL)
    .then(resp => {
        if (!resp.ok) {
            throw resp;
        } else {
            return resp.json()
        }})
        .catch(error => alert('Failed to fetch data.'))
};

// ! GET a movieObj to populate the window
//Fire on first movie on page load 
const fetchOneMovie = (selectedMovieId) => {
    return fetch(`${MOVIESURL}/${selectedMovieId}`)
    .then(resp => {
        if (!resp.ok) {
            throw resp;
        } else {
            return resp.json();
        }})
        .catch(error => alert('Failed to fetch data.'))
};

// ! Toggle watched and unwatched
//PATCH watched depending on which value is passed in
const patchMovieWatched = (e) => {
    const bool = (watchedBtn.textContent === 'watched' ? false : true)
    fetch(`${MOVIESURL}/${e.target.dataset.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({watched: bool})
    })
    .then(resp => {
        if (!resp.ok) {
            throw resp;
        } else {
        return resp.json()
        }
    })
    .catch(error => alert('Failed to fetch data.'))
    .then(() => toggleWatched())
};

const toggleWatched = () => {
    watchedBtn.textContent = watchedBtn.textContent === 'unwatched' ? 'watched' : 'unwatched';
};

watchedBtn.addEventListener('click', patchMovieWatched)

// ! Update blood count
//PATCH watched depending on which value is passed in
const patchBloodCount = (e) => {
    const patchAmount = handleSubmit(e)
    if (patchAmount) {
    fetch(`${MOVIESURL}/${bloodAmount.dataset.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'blood_amount': patchAmount})
    })
    .then(resp => {
        if (!resp.ok) {
            throw resp;
        } else {
            return resp.json()
        }
    })
    .catch(error => alert('Failed to fetch data.'))
    .then(() => updateBlood())
    } else {
        alert('Please only enter numbers.');
    }
};

// ! Define handleSubmit
const handleSubmit = (e) => {
    e.preventDefault();
    const newAmount = (parseInt((inputBlood.value.replace(',', ''))) + (parseInt(bloodAmount.textContent)));
    if (isNaN(newAmount)) {
        return;
    } else {
        bloodForm.reset();
        return newAmount;
    }
};

// ! Define updateBlood
const updateBlood = () => {
    fetchOneMovie(bloodAmount.dataset.id)
    .then(movieObj => bloodAmount.textContent = movieObj['blood_amount'])
};

bloodForm.addEventListener('submit', patchBloodCount);

// ! Populate and render functions
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

document.addEventListener('DOMContentLoaded', populateNavBar);