const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  steel: "#B8B8D0",
  dragon: "#7038F8",
  dark: "#705848",
  fairy: "#EE99AC",
};

let pokemonData = [];
audioInitialized = false;

let offset = 0;
const limit = 12;
let isLoading = false;
let lastScrollPosition = 0;


async function loadPokemon() {
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);
  const responseAsJson = await response.json();
  const results = responseAsJson["results"];

  for (let i = 0; i < results.length; i++) {
    const pokemon = results[i];
    const pokemonDetails = await loadPokemonDetails(pokemon.url);
    const speciesResponse = await fetch(pokemonDetails.species.url);
    const speciesDetails = await speciesResponse.json();

    pokemonData.push({
      details: pokemonDetails,
      speciesDetails: speciesDetails,
      chartData: generateChartData(pokemonDetails.stats, pokemonDetails),
    });
  }

  renderResults(results);
  offset += limit;
  isLoading = false;

  setTimeout(() => {
    overlay.style.display = "none";
  }, 2400);
}


window.onscroll = function () {
  let buffer = 100;

  let currentScrollPosition = window.scrollY;

  if (!isLoading && currentScrollPosition > lastScrollPosition && 
      (window.innerHeight + currentScrollPosition + buffer) >= document.body.offsetHeight) {
    isLoading = true;
    loadMorePokemon();
  }

  lastScrollPosition = currentScrollPosition;
};


async function loadMorePokemon() {
  await loadPokemon();
}


async function loadPokemonDetails(url) {
  let response = await fetch(url);
  let pokemonDetails = await response.json();
  return {
    ...pokemonDetails,
    stats: pokemonDetails.stats,
  };
}


function generateChartData(stats, pokemonDetails) {
  return {
    labels: stats.map((stat) => stat.stat.name),
    datasets: [
      {
        label: 'Base Stats',
        data: stats.map((stat) => stat.base_stat),
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 4,
      },
    ],
  };
}


async function renderResults(results) {
  const resultsContainer = document.getElementById("resultsContainer");

  for (let i = 0; i < results.length; i++) {
    const pokemon = results[i];
    const pokemonDetails = await loadPokemonDetails(pokemon.url);
    const speciesResponse = await fetch(pokemonDetails.species.url);
    const speciesDetails = await speciesResponse.json();

    showPokemonList(resultsContainer, pokemonDetails, speciesDetails);
    renderChart(pokemonDetails.stats, pokemonDetails);
  }
}


function handleInput() {
  const inputValue = document.getElementById("input").value.toLowerCase();
  const pokemonContainers = document.querySelectorAll(".pokemonList");

  pokemonContainers.forEach((container) => {
    const pokemonName = container
      .querySelector(".name")
      .innerText.toLowerCase();

    if (pokemonName.startsWith(inputValue)) {
      container.style.display = "flex";
    } else {
      container.style.display = "none";
    }
  });
}


function scrollUp() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}


function toggleMusic() {
  const buttonMusic = document.getElementById("buttonMusic");

  if (!audioInitialized) {
    AUDIO = new Audio("audio/music.mp3");
    audioInitialized = true;
  }

  if (AUDIO.paused) {
    AUDIO.play();
    buttonMusic.src = "icon/musicOn.png";
  } else {
    AUDIO.pause();
    buttonMusic.src = "icon/musicOff.png";
  }
}