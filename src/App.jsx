import { Header } from './components/Header'
import PokeCard from './components/PokeCard'
import { SideNav } from './components/SideNav'
import { TypeCard } from './components/TypeCard'
import './fanta.css'
import './index.css'

import { useState } from 'react'

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(0);

  const[showSideMenu, setShowSideMenu] = useState(false)

  // this should handle in such a way that it should always perform the inverse operation... Eg : if menu is closed, it should open
  function handleToggleMenu (){
    setShowSideMenu(!showSideMenu)
  }

  function closeToggleMenu() {
    setShowSideMenu(true) // it is set true but its actually false
  }

  return (
    <>
    <Header 
      handleToggleMenu={handleToggleMenu}/>
    <SideNav 
      selectedPokemon={selectedPokemon} 
      setSelectedPokemon={setSelectedPokemon}
      showSideMenu={showSideMenu} 
      closeToggleMenu={closeToggleMenu}/>
    <PokeCard 
      selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon}/>
    </> 
  )
}

export default App
