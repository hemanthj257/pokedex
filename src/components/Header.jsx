export function Header(props) {
    const {handleToggleMenu} = props;

    return(
        <header>
            <button onClick={handleToggleMenu} className="open-nav-button">
                <i className="fa-solid fa-bars"></i>
            </button>
            <h1 className={'text-gradient'}>POKEDEX {"\u00A0"}
                    <img width="24" height="24" src="https://img.icons8.com/color/48/up-arrow.png" alt="up-arrow"/>
                    {/* <a target="_blank" href="https://icons8.com/icon/4N8mnMMAN8lV/pokedex">Pokedex</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */}
                </h1>
        </header>
    )
}