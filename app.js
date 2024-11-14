const limit = 20;
const totalPokemons = 151;
const apiURL = 'https://pokeapi.co/api/v2';
const pokemonListElement = document.getElementById('pokemon_list');
const prevButton = document.getElementById('prev_page');
const nextButton = document.getElementById('next_page');
const pageNumber = document.getElementById('page_number');

let page = 0;

async function getPokemons(page) {
    try {
        const offset = page * limit;
        let remainingPokemons = totalPokemons - offset;

        const actualLimit = remainingPokemons < limit ? remainingPokemons : limit;

        const response = await fetch(`${apiURL}/pokemon?limit=${actualLimit}&offset=${offset}`);
        const data = await response.json();
        const pokemonList = data.results;

        pokemonListElement.innerHTML = '';

        let count = offset + 1;
        for (const pokemon of pokemonList) {
            if (count > totalPokemons) break;

            const pokemonData = await fetch(pokemon.url);
            const pokemonDetails = await pokemonData.json();

            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>ID:</strong> ${pokemonDetails.id} <br>
                <strong>Nombre:</strong> ${pokemonDetails.name} <br>
                <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}">
            `;
            pokemonListElement.appendChild(listItem);

            count++;
        }

        prevButton.disabled = page === 0;
        nextButton.disabled = (page + 1) * limit >= totalPokemons;

    } catch (error) {
        console.error('Error al obtener Pokémon:', error);
    }
}

getPokemons(page);

nextButton.addEventListener('click', () => {
    page += 1;
    getPokemons(page);
    pageNumber.textContent = `Page ${page}`;
});

prevButton.addEventListener('click', () => {
    if (page > 0) {
        page -= 1;
        getPokemons(page);
        pageNumber.textContent = `Page ${page}`;
    }
});