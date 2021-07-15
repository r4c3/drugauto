const searchBar = document.getElementById("drug")
const matches = document.getElementById("matches")

let response, drugs
async function loadJson() {
    response = await fetch("https://r4c3.github.io/drugauto/data/drugs.json")
    drugs = await response.json()
}
loadJson()

const searchDrugs = async searchText => {
    if(searchText.length === 0) {
        options = []
        matches.innerHTML = ""
    }
    
    let options = drugs.filter(drug => {
        const regex = new RegExp(`^${searchText}`, "gi")
        try {
            return drug.products[0].brand_name.match(regex)
        } catch (error) {
            
        }
    })

    options = options.slice(0, 7).sort(function(a, b){return a.products[0].brand_name.length - b.products[0].brand_name.length}).slice(0, 5)
    updateHTML(options, searchText)
}

function updateHTML(options, searchText) {

    let termIsValidIngredient = false

    for (const drug in options) {
        for (const ing in options[drug].products[0].active_ingredients) {
            if (options[drug].products[0].active_ingredients[ing].name.slice(0, 2) === searchText.toUpperCase().slice(0, 2)) {
                termIsValidIngredient = [true, options[drug].products[0].active_ingredients[ing].name]
            }
        }
    }

    if(options.length > 0) {
        let html = options.map(option => `<button class="option"><p>${option.products[0].brand_name}</p></button>`)
        
        if (termIsValidIngredient[0]) {
            html.unshift(`<button class="option"><p>${termIsValidIngredient[1]}</p></button>`)
        }
        
        html = [...new Set(html)]
        matches.innerHTML = html.join('')
    }
}

searchBar.addEventListener('input', () => searchDrugs(searchBar.value))
