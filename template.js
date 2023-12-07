function showPokemonList(resultsContainer, pokemonDetails, speciesDetails) {
    const type1Color = typeColors[pokemonDetails.types[0].type.name];
    const type2Color = pokemonDetails.types[1] ? typeColors[pokemonDetails.types[1].type.name] : '';
  
    resultsContainer.innerHTML += /* HTML */ `
        <div class="pokemonList" data-chart-id="${pokemonDetails.name}" onclick="showDetails(this, '${pokemonDetails.name}')">
            <div class="pokemonContainer">
                <img src="${pokemonDetails.sprites['other']['official-artwork']['front_default']}"/>
            </div>
  
            <div class="pokemonContainerText">
                <div>
                    <div class="name">${capitalizeFirstLetter(pokemonDetails.name)}</div>
                    <div class="nr">Nr. ${pokemonDetails.game_indices['14']['game_index']}</div>
                </div>
                <div>
                    <div class="type1" style="background-color: ${type1Color};">${pokemonDetails.types['0']['type']['name'].toUpperCase()}</div>
                    ${pokemonDetails.types[1] ? `<div class="type2" style="background-color: ${type2Color || ''};">${pokemonDetails.types[1].type.name.toUpperCase()}
                    </div>` : ''}
                </div>
            </div>
  
            <div class="pokemonContainerText pokemonContainerText2 hide">
                <div>
                    <div class="height">Height: ${(pokemonDetails.height / 10).toFixed(1)}m</div>
                </div>
                <div>
                    <div class="weight">Weight: ${(pokemonDetails.weight / 10).toFixed(1)}kg</div>
                </div>
            </div>
  
            <div class="description description2 hide">${speciesDetails.flavor_text_entries['14']['flavor_text']}</div>
  
        </div>
        
        <canvas id='myChart-${pokemonDetails.name}' style='display: none; width: auto;' class="chartCanvas"></canvas>`;

renderChart(pokemonDetails.stats, pokemonDetails);


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}


function renderChart(stats, pokemonDetails) {
    const canvasId = `myChart-${pokemonDetails.name || 'undefined'}`;
    const canvas = document.getElementById(canvasId);

    destroyExistingChart(canvasId);
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: stats.map(stat => stat.stat.name),
            datasets: [{
                label: 'Base Stats',
                data: stats.map(stat => stat.base_stat),
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 2,
            }]
        },
        options: {
    scales: {
        r: { 
            min: 0,
            max: 200,
            stepSize: 50,
            pointLabels: {
                color: 'black'
            },
            ticks: {
                font: {
                    color: 'black'
                }
            },
            grid: {
                color: 'black'
            }
        }
    },
    elements: {
        line: {
            borderColor: 'black',
            borderWidth: 3
        },
        point: {
            backgroundColor: 'black',
            borderColor: 'black',
            borderWidth: 2
        }
    },
            responsive: false,
            maintainAspectRatio: false,
        }
    });

    canvas.addEventListener('click', function () {
        const openPokemonDetails = document.querySelector('.pokemonList2');
        if (openPokemonDetails) {
            showDetails(openPokemonDetails, openPokemonDetails.dataset.chartId);
        }
    });
}


function destroyExistingChart(canvasId) {
    const existingChart = Chart.getChart(canvasId);

    if (existingChart) {
        existingChart.destroy();
    }
}


function showDetails(clickedElement, pokemonName) {
    let elementsToToggle = clickedElement.querySelectorAll('.hide');
  
    elementsToToggle.forEach(function (element) {
      if (element.style.visibility === 'hidden' || element.style.visibility === '') {
        element.style.visibility = 'visible';
      } else {
        element.style.visibility = 'hidden';
      }
    });
  
    const chartCanvas = document.getElementById(`myChart-${pokemonName}`);
    if (chartCanvas) {
      chartCanvas.style.display = chartCanvas.style.display === 'none' ? 'block' : 'none';
  
      if (chartCanvas.style.display === 'block') {
        const pokemon = pokemonData.find((p) => p.details.name === pokemonName);
        if (pokemon) {
          renderChart(pokemon.details.stats, pokemon.details, pokemon);
        }
      }
    }

    const darkBackground = document.getElementById('darkBackground');
    if (darkBackground) {

        const allElementsVisible = Array.from(elementsToToggle).every(element => element.style.visibility === 'visible');

        darkBackground.style.display = allElementsVisible ? 'block' : 'none';

        document.body.style.overflow = allElementsVisible ? 'hidden' : 'auto';
    }

    clickedElement.classList.toggle('pokemonList');
    clickedElement.classList.toggle('pokemonList2');
}

document.addEventListener('DOMContentLoaded', function () {
    const darkBackground = document.getElementById('darkBackground');

    if (darkBackground) {
        darkBackground.addEventListener('click', function () {
            const openPokemonDetails = document.querySelector('.pokemonList2');
            if (openPokemonDetails) {
                showDetails(openPokemonDetails, openPokemonDetails.dataset.chartId);
            }
        });
    }
});