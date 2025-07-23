import { useState } from 'react';
import {first151Pokemon, getFullPokedexNumber} from '../utils/index'

export function SideNav(props) {
    const {selectedPokemon, setSelectedPokemon, showSideMenu, closeToggleMenu} = props;
    
    //create a state variable to implement search operation in search bar
    const [searchValue, setSearchValue] = useState('')

    // initialize a filter which is wired with search bar 
    const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
        //if full pokedex number includes the current search value, return true
        if(getFullPokedexNumber(eleIndex).includes(searchValue)) {return true}

        //if pokemon name is included in current search value, return true
        if(ele.toLowerCase().includes(searchValue.toLowerCase())) {return true}

        // otherwise return false
        return false
    })

    return(
        <nav className={' ' + (!showSideMenu ? "open" : ' ')}>
            <div className={'header' + (!showSideMenu ? "open" : ' ')}>
                <button 
                    onClick={closeToggleMenu}
                    className="open-nav-button">
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className={'text-gradient'}>POKEDEX {"\u00A0"}
                    <img width="24" height="24" src="https://img.icons8.com/color/48/up-arrow.png" alt="up-arrow"/>
                    {/* <a target="_blank" href="https://icons8.com/icon/4N8mnMMAN8lV/pokedex">Pokedex</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */}
                </h1>
            </div>

            {/* wire the search state variable here */}
            <input type="text" 
                   placeholder='Search Pokemon'
                   onChange={(e) => {
                    setSearchValue(e.target.value)
                   }}
                   />
            {
            filteredPokemon.map((pokemon, pokemonIndex) => {
                const truePokedexNumner = first151Pokemon.indexOf(pokemon)
                return(
                    <button 
                    key={pokemonIndex} 
                    onClick={() => {
                        setSelectedPokemon(truePokedexNumner)
                        closeToggleMenu() // closes the menu as soon as a pokemon is selected from the list
                    }}
                    className={'nav-card ' + 
                    (pokemonIndex === selectedPokemon ? 'nav-card-selected' : '')}>
                        <p>{getFullPokedexNumber(truePokedexNumner)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })
        }
        </nav>
    )
}