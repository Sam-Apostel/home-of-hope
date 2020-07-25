export const Tile: TileFactory = class Tile extends HTMLElement implements TileInterface{
	constructor(){
		super();
		this.attachShadow({mode:'open'});
	}
	public static makeTile = (): TileInterface =>{
		return new Tile();
	};
	public addContent = (content: HTMLElement): void =>{
		this.shadowRoot.appendChild(content)
	};
}

window.customElements.define('tile', Tile);
