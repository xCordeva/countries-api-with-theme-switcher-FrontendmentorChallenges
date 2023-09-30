import { matching } from "./script.js";
const dataUrl = "./data.json"
const detailsContainer =   document.querySelector('.container')

fetch(dataUrl)
    .then(response => {
        if (response.ok) {
            return response.json()
        } else {
            throw new Error (`Status: ${response.status}`)
        }
    })

    .then(data => {
        data.forEach(() => {

            //some countries doesnt have languages
            let languagesList;
            if(matching.languages){
                languagesList = matching.languages.map(language => language.name).join(', ');
            }
            else{
                languagesList = "Doesn't Have a Language";
            }

            //some countries doesnt have currencies
            let currenciesList;
            if(matching.currencies){
                currenciesList = matching.currencies.map(currency => currency.name).join(', ');
            }
            else{
                currenciesList = "Doesn't Have a Currency";
            }

            // getting the borders list, the list is in alpha code so i had to go through the data to get the names that matches the codes
            //some countries doesnt have borders with any country
            let bordersList;
            if(matching.borders){
                bordersList = matching.borders.map((border) => {
                    const borderCountry = data.find(country => country.alpha3Code === border);
                    return `<a href="country-details.html"><span class="border">${borderCountry.name}</span></a>`;
                }).join('');
            }
            else{
                bordersList = "Doesn't Share Any Border";
            }
            
            detailsContainer.innerHTML=`
            <div class="left-side">
                <img src="${matching.flag}" alt="flag">
            </div>
            <div class="right-side">
                <h1>${matching.name}</h1>
                <div class="country-info">

                    <div class="country-info-left">
                        <p><span>Native Name: </span> ${matching.nativeName}</p>
                        <p><span>Population: </span> ${matching.population}</p>
                        <p><span>Region: </span> ${matching.region}</p>
                        <p><span>Sub Region: </span> ${matching.subregion}</p>
                        <p><span>Capital: </span> ${matching.capital}</p>
                    </div>
                    <div class="country-info-right">
                        <p><span>Top level Domain: </span> ${matching.topLevelDomain}</p>
                        <p><span>Currencies: </span> ${currenciesList}</p>
                        <p><span>Languages: </span> ${languagesList}</p>
                    </div>

                </div>
                <div class="country-border">
                    <p><span>Border Countries: </span>
                        ${bordersList}
                    </p>
                </div>
            </div>
            
            `
            //changing the title of the page
            document.title = `${matching.name}'s Details`;

            const borderCountries = document.querySelectorAll('.border')
            let clickedBorderCountry;

            borderCountries.forEach((borderCountry) =>{

                borderCountry.addEventListener('click', () => {
                clickedBorderCountry = borderCountry.textContent;
                matching = localStorage.setItem('matching', JSON.stringify(data.find((borderCountry)=> borderCountry.name === clickedBorderCountry)))

            })
            })

        })

    })
.catch(error => {
    console.error(`Errorx:`, error)
})