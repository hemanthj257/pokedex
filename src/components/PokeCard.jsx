import {useState, useEffect} from 'react';
import {getPokedexNumber, getFullPokedexNumber} from '../utils/index.js'
import { TypeCard } from './TypeCard.jsx';
import Modal from './Modal.jsx'

export default function PokeCard(props) {
    
    // state variables
    const { selectedPokemon } = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skill, setSkill] = useState(null);
    const [loadingSkill, setLoadingSkill] = useState(false);

    // pokemon data variables
    const {name, types, abilities, height, sprites, stats, moves} = data || {} 

    //filter the sprites  
    const imgList = Object.keys(sprites || {}).filter(val => {
        if(!sprites[val]) {return false}
        if(['versions', 'other'].includes(val)) {return false}
        return true
    })

    // we write a function to fetch the skill 

    //------->>>>>>>>> HERE SKILL IS MOVE <<<<<<<<<<<<<<--------------
    async function fetchPokemonMoves(move, moveURL){

        //guard close 
        if(loadingSkill || !localStorage || !moveURL) {return}

        //define cache if its not defined
        let cache = {};
        if(localStorage.getItem('pokemon-moves')){
            cache = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        // fetch movedata if its found in cache          
        if(move in cache){
            setSkill(cache[move])
            console.log('found the move in cache')
            return
        }

        //if not found in cache, fetch from the url and store it in cache
        
        try{
            setLoadingSkill(true);
            const res = await fetch(moveURL)
            const moveData = await res.json()
            console.log('Fetched move from API', moveData)

            //fetch the description from the flavor text, which is found in the object 
            const description = moveData?.flavor_text_entries?.filter(val => {
                return val.version_group.name == 'firered-leafgreen'
            })[0]?.flavor_text

            const skillData = {
                name : move,
                description
            }
            // console.log(description)
            setSkill(skillData)
            cache[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(cache)) 

        } catch (err) {
            console.log(err.message)
        } finally {
            setLoadingSkill(false)
        }
    }

    useEffect(() => {
        //if loading, exit logic
        if(loading || !localStorage) {return}

        //check for the pokemon data in cache, if not found in cache, store it
        // define the cache
        let cache = {}
        if(localStorage.getItem('pokedex')){
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }

        //check if the selected pokemon data exist
        if(selectedPokemon in cache){
            setData(cache[selectedPokemon])
            console.log('found in pokedex (localstorage)')
            return
        }
        
        //if data not found, fetch the data from api and store in cache
        async function fetchPokemonData() {
            setLoading(true)
            try{
                const baseURL = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalURL = baseURL + suffix
                const res = await fetch(finalURL)
                const pokemonData = await res.json()
                setData(pokemonData)

                console.log('fetched pokemon data')
                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch(err){
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchPokemonData()

    }, [selectedPokemon])
    
    //loading screen during the data is fetched
    if(loading || !data){
       return (
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }

    //now, actual pokeCard shit starts
    return (
        <div className='poke-card'>

            {/* code for Modal */}
            {/* we implement coditional rendering for Modal. if skill is present then modal is rendered or else not...this happens due to AND operation */}
            {skill &&
            (<Modal handleCloseModal={() => {setSkill(null)}}>
                <div>
                    <h6>Name</h6>
                    <h4 className='skill-name'>{skill.name.replace('-', ' ')}</h4>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>)}

            {/* get the pokemon index no and name */}
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>

            {/* get the pokemon type */}
            <div className='type-container'>
            {types.map((typeObj, typeIndex) => {
                return (
                    <TypeCard key={typeIndex} type={typeObj?.type?.name}/>
                )
            })}
            </div>

            {/* image */}
            <img className='default-img' src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={selectedPokemon} />

            {/* sprites */}
            <div className='img-container'>
            {imgList.map((spriteURL, spriteIndex) => {
                const imgURL = sprites[spriteURL]
                return(
                    <img key={spriteIndex} src={imgURL} alt={`
                            ${name}-img-${spriteURL}
                        `} />
                )
            })}
            </div>

            {/* Stats */}
            <h3>Stats</h3>
            <div className='stats-card'>
                {stats.map( (statObj, statIndex) => {
                    const {stat, base_stat} = statObj
                    return(
                        <div className='stat-card' key={statIndex}>
                            <p>{stat?.name.replaceAll('-', ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>

            {/* MOVES */}
            <h3>Moves</h3>
            <div className='pokemon-move-grid'>
                {moves.map( (moveObj, moveIndex) => {
                    return (
                        <button className='button-card pokemon-move'
                        key={moveIndex} onClick={ () => {
                            fetchPokemonMoves(moveObj?.move.name, moveObj?.move.url)
                        } }>
                            <p>{moveObj?.move?.name.replace( '-', ' ')}</p>
                        </button>
                    )
                })}
            </div>
        </div>
        
    )
}