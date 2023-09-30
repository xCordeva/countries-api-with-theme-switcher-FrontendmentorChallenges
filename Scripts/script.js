const dataUrl = "./data.json"
const countriesContainer = document.querySelector('.countries')
const searchBar = document.getElementById('search-bar')
const filterRegionSelector = document.querySelector('.dropdown')

const darkModeToggler = document.getElementById('dark-mode-toggler');

let matching = JSON.parse(localStorage.getItem('matching'))
export { matching };

let fuse;

const darkModeText = darkModeToggler.querySelector('.dark-mode-text')
const darkModeIcon = darkModeToggler.querySelector('.fa-regular')

// getting users choice if its dark mode apply the styles 
const userPreference = localStorage.getItem('dark-mode-preference');
if(userPreference === 'dark'){
    document.body.classList.add('dark-mode');
    darkModeText.textContent = `Light Mode`
    darkModeIcon.classList.remove('fa-moon')
    darkModeIcon.classList.add('fa-sun')
}
//applying dark mode
darkModeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // saving users choice
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if(isDarkMode){
        darkModeText.textContent = `Light Mode`
        darkModeIcon.classList.remove('fa-moon')
        darkModeIcon.classList.add('fa-sun')
    }
    else{
        darkModeText.textContent = `Dark Mode`;
        darkModeIcon.classList.add('fa-moon')
        darkModeIcon.classList.remove('fa-sun')
    }
    
    localStorage.setItem('dark-mode-preference', isDarkMode ? 'dark' : 'light');
});


function renderCountries(data){
    data.forEach((country) => {

    //an if statement to make the code works on country-details.js because matching is exported
        if(countriesContainer){
            countriesContainer.innerHTML += `
            <a href="country-details.html">
                <div class="country">
                    <img src="${country.flags.svg}" alt="flag">
                    <div class="country-content">
                        <h3>${country.name}</h3>
                        <p><span>Population: </span>${country.population.toLocaleString()}</p>
                        <p><span>Region: </span>${country.region}</p>
                        <p><span>Capital: </span>${country.capital}</p>
                    </div>
                </div>
            </a>`
        }
        
    })
}

fetch(dataUrl)
    .then(response =>{
        if(response.ok){
            return response.json()
        }
        else{
            throw new Error (`Status: ${response.status}`)
        }
    })

    .then(data =>{

        window.data = data;
        renderCountries(data)
        
        clickedOnCountry(data)

    })

.catch(error =>{
    console.error(`Errorx:`, error)
})

function clickedOnCountry(data){
    const countries = document.querySelectorAll('.country')
    let clickedCountry;
    countries.forEach((country) => {
        country.addEventListener('click', () => {
            clickedCountry = country.querySelector('h3').textContent;
            matching = localStorage.setItem('matching', JSON.stringify(data.find((country)=> country.name === clickedCountry)))
        })
    })
}


function findExactMatch(searchPhrase) {
    return data.find(country => country.name.toLowerCase() === searchPhrase);
}
// using the fuse.js library
function addFuse(data) {
    fuse = new Fuse(data, {
        keys: ['name'], // the property it searchs for
        threshold: 0.3, // the matching threshold (0.0 to 1.0)
    });
}
function filterData(searchPhrase) {
    if (!fuse) {
        addFuse(data);
    }

    // Use Fuse's search method to perform fuzzy search
    const results = fuse.search(searchPhrase);

    return results.map(result => result.item); // Return matched items from results
}

//search bar works when ENTER is clicked
//an if statement to make the code works on country-details.js because matching is exported
if(searchBar){
    searchBar.addEventListener('keydown',(event)=>{
        if(event.key === 'Enter'){
    
            const searchPhrase = searchBar.value.trim().toLowerCase();
            const exactMatch = findExactMatch(searchPhrase);
    
            // clearing the countriesContainer
            countriesContainer.innerHTML = '';
    
            //if the search phrase is exact as any country's name it only shows this country
            if (exactMatch){
                countriesContainer.innerHTML += `
                    <a href="country-details.html">
                        <div class="country">
                            <img src="${exactMatch.flag}" alt="flag">
                            <div class="country-content">
                                <h3>${exactMatch.name}</h3>
                                <p><span>Population: </span>${exactMatch.population}</p>
                                <p><span>Region: </span>${exactMatch.region}</p>
                                <p><span>Capital: </span>${exactMatch.capital}</p>
                            </div>
                        </div>
                    </a>`;
                    clickedOnCountry(data)
            }
    
            //if the search phrase is doesnt exactly match any country's name it shows every close matching country
            else{
                const fuzzyMatches = filterData(searchPhrase);
                fuzzyMatches.forEach((country) => {
                    countriesContainer.innerHTML += `
                        <a href="country-details.html">
                            <div class="country">
                                <img src="${country.flag}" alt="flag">
                                <div class="country-content">
                                    <h3>${country.name}</h3>
                                    <p><span>Population: </span>${country.population}</p>
                                    <p><span>Region: </span>${country.region}</p>
                                    <p><span>Capital: </span>${country.capital}</p>
                                </div>
                            </div>
                        </a>`;
                        clickedOnCountry(data)
                });
            }
        }
    })
}

//an if statement to make the code works on country-details.js because matching is exported
if(filterRegionSelector){
    filterRegionSelector.addEventListener('change',()=>{

        const selectedRegion = filterRegionSelector.value;
        const regionCountries = data.filter(regionCountry => regionCountry.region === selectedRegion)
    
        // clearing the countriesContainer
        countriesContainer.innerHTML = '';
        renderCountries(regionCountries)
        clickedOnCountry(regionCountries)
    })
}