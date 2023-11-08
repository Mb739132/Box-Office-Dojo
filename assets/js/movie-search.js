
// Checks which method was used to search before running the appropriate function
var searchMethod = localStorage.getItem("search-use");
if (searchMethod === "search-button") {
    displayMovieSearch();
} else if (searchMethod === "genre-button") {
    displayGenreSearch();
} else {
    displayMovieAgain();
}

// Displays searched movies from a genre button
function displayGenreSearch() {
    var resultList = document.querySelector(".movie-search-result");
    // Clears any pre-existing text
    resultList.innerHTML = ""

    var genreSearchResults = JSON.parse(localStorage.getItem("genre-search")).results;

    // Runs for loop of all available data
    for (var i = 0; i < genreSearchResults.length; i++) {
        var movieId = genreSearchResults[i]
        // Checks for picture, skips movie if not available
        if (movieId.poster_path === null) {
            continue;
        }

        // Creates new element for each movie and adds a title and the movie poster
        movie = document.createElement("section")
        movie.setAttribute("class", "search-display column is-6");
        resultList.appendChild(movie);

        movieTitle = document.createElement("h3");
        movieLink = document.createElement("a");
        moviePoster = document.createElement("img");

        movieTitle.textContent = movieId.title;
        moviePoster.src = "https://image.tmdb.org/t/p/w500" + movieId.poster_path;
        moviePoster.value = movieId.id
        moviePoster.setAttribute("class", "movie-poster")

        movie.appendChild(movieTitle);
        movie.appendChild(movieLink)
        movieLink.appendChild(moviePoster);
    }

    // Uses JQuery for event delegation
    $(resultList).on("click", ".movie-poster", displayMovieDetails);
}

// Displays searched movies from search bar input
function displayMovieSearch() {
    var resultList = document.querySelector(".movie-search-result");
    // Clears any pre-existing text
    resultList.innerHTML = ""

    var movieSearchResults = JSON.parse(localStorage.getItem("movie-search"));
    console.log(movieSearchResults)
    console.log(movieSearchResults.length)

    // Runs for loop of all available data
    for (var i = 0; i < movieSearchResults.length; i++) {
        var movieId = movieSearchResults[i]
        // Checks for picture, skips movie if not available
        if (movieId.poster_path === null) {
            continue;
        }

        // Creates new element for each movie and adds a title and the movie poster
        movie = document.createElement("section")
        movie.setAttribute("class", "search-display column is-6");
        resultList.appendChild(movie);

        movieTitle = document.createElement("h3");
        movieLink = document.createElement("a");
        moviePoster = document.createElement("img");

        movieTitle.textContent = movieId.title;
        moviePoster.src = "https://image.tmdb.org/t/p/w500" + movieId.poster_path;
        moviePoster.value = movieId.id
        moviePoster.setAttribute("class", "movie-poster")

        movie.appendChild(movieTitle);
        movie.appendChild(movieLink);
        movieLink.appendChild(moviePoster);
    }

    // Uses JQuery for event delegation
    $(resultList).on("click", ".movie-poster", displayMovieDetails);
}

// Displays details of individually selected movies
function displayMovieDetails(event) {

    var resultList = document.querySelector(".movie-search-result");

    // Grabs ID for API use while it still exists
    var searchResultsId = event.target.value;
    console.log(moviePoster.value)
    // Clears any pre-existing text
    resultList.innerHTML = ""
   
    getMovieDetailsUrl = "https://api.themoviedb.org/3/movie/" + searchResultsId + "?language=en-us&region=US&api_key=f73119f46966c54d15a0614dc6b82103"
    fetch(getMovieDetailsUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        // Creates section on left for poster and title
        movie = document.createElement("section");
        movie.setAttribute("class", "search-display column is-6");
        resultList.appendChild(movie);
    
        movieTitle = document.createElement("h3");
        moviePoster = document.createElement("img");
    
        movieTitle.textContent = data.title;
        moviePoster.src = "https://image.tmdb.org/t/p/w500" + data.poster_path;
        moviePoster.setAttribute("class", "movie-poster");
        moviePoster.value = data.id
    
        movie.appendChild(movieTitle);
        movie.appendChild(moviePoster);

        // Creates section on right for movie details
        movieDetail = document.createElement("section");
        movieDetail.setAttribute("class", "search-display column is-6");
        resultList.appendChild(movieDetail);

        movieSummary = document.createElement("p");
        movieTime = document.createElement("p");
        addBtn = document.createElement("button");

        movieSummary.textContent = data.overview;
        movieTime.textContent = data.runtime + " minutes";
        
        addBtn.textContent = "+ Add to Watch List";
        addBtn.setAttribute("id", "add-button");

        movieSummary.setAttribute("color", "white");

        movieDetail.appendChild(movieSummary);
        movieDetail.appendChild(movieTime);
        movieDetail.appendChild(addBtn)

        getStreamingServices();

        // Uses JQuery for event delegation
        $(resultList).on("click", "#add-button", addToList);
        $(resultList).on("click", "#add-button", getMovieList);

        // Insert GIPHY addition below in new appended section

    })
}

// Gets streaming services for movies
function getStreamingServices() {
    var streamingServices = "https://api.themoviedb.org/3/movie/{movie_id}/watch/providers?api_key=f73119f46966c54d15a0614dc6b82103"

    streamingServices = "https://api.themoviedb.org/3/movie/" + moviePoster.value + "/watch/providers?api_key=f73119f46966c54d15a0614dc6b82103"
    fetch(streamingServices)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)

        var streamList = document.createElement("ul");
        streamList.textContent = "Streaming on:";
        movieDetail.appendChild(streamList);

        // If else required to display data due to API object
        if (data.results.US.flatrate) {
            for (var i = 0; i < data.results.US.flatrate.length; i++) {
                var streamProvider = document.createElement("li");
                streamProvider.textContent = data.results.US.flatrate[i].provider_name;
                streamList.appendChild(streamProvider);
            }
        } else if (data.results.US.rent) {
            for (var i = 0; i < data.results.US.rent.length; i++) {
                var streamProvider = document.createElement("li");
                streamProvider.textContent = data.results.US.rent[i].provider_name;
                streamList.appendChild(streamProvider);
        }
        } else {
            for (var i = 0; i < data.results.US.buy.length; i++) {
                var streamProvider = document.createElement("li");
                streamProvider.textContent = data.results.US.buy[i].provider_name;
                streamList.appendChild(streamProvider);
        }
        }
    })

}

// Adds movie to watch list
function addToList() {
    // Creates empty array for movie list
    var savedMovies = []

    savedMovies = savedMovies.concat(JSON.parse(localStorage.getItem("watch-list")));
    console.log(savedMovies)
    // Removes null element
    if (savedMovies[0] === null) {
        savedMovies.pop();
    }

    // Ensures the same movie cannot be added multiple times 
    for (i = 0; i < savedMovies.length; i++) {
        if (savedMovies[i].title === movieTitle.textContent) {
            console.log("fixed")
            return;
        }
    }

    // Creates object to hold both the name and the ID of the movie for API use
    var movie = {
        title: movieTitle.textContent,
        id: moviePoster.value
    }
    // Adds new movie to top of array
    savedMovies.unshift(movie);
  

    localStorage.setItem("watch-list", JSON.stringify(savedMovies));
}

// For searching movies again using movie list buttons
function displayMovieAgain() {
    var resultList = document.querySelector(".movie-search-result");

    // Grabs ID for API use from localStorage
    var searchResultsId = JSON.parse(localStorage.getItem("movie-search"));
    // Clears any pre-existing text
    resultList.innerHTML = ""
   
    getMovieDetailsUrl = "https://api.themoviedb.org/3/movie/" + searchResultsId + "?language=en-us&region=US&api_key=f73119f46966c54d15a0614dc6b82103"
    fetch(getMovieDetailsUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        // Creates section on left for poster and title
        movie = document.createElement("section");
        movie.setAttribute("class", "search-display column is-6");
        resultList.appendChild(movie);
    
        movieTitle = document.createElement("h3");
        moviePoster = document.createElement("img");
    
        movieTitle.textContent = data.title;
        moviePoster.src = "https://image.tmdb.org/t/p/w500" + data.poster_path;
        moviePoster.setAttribute("class", "movie-poster");
        moviePoster.value = data.id
    
        movie.appendChild(movieTitle);
        movie.appendChild(moviePoster);

        // Creates section on right for movie details
        movieDetail = document.createElement("section");
        movieDetail.setAttribute("class", "search-display column is-6");
        resultList.appendChild(movieDetail);

        movieSummary = document.createElement("p");
        movieTime = document.createElement("p");

        movieSummary.textContent = data.overview;
        movieTime.textContent = data.runtime + " minutes";
        
        movieSummary.setAttribute("color", "white");

        movieDetail.appendChild(movieSummary);
        movieDetail.appendChild(movieTime);

        getStreamingServices();

        // Uses JQuery for event delegation
        $(resultList).on("click", "#add-button", addToList);
        $(resultList).on("click", "#add-button", getMovieList);

        // Insert GIPHY addition below in new appended section

    })
    
}
