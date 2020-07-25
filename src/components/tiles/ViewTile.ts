class ViewTile extends HTMLElement{
	constructor(){
		super();
		this.attachShadow({mode:'open'});
	}
	public static makeTile = ():HTMLElement =>{
		return new ViewTile();
	};


	public addContent = (content: HTMLElement): any =>{
		this.shadowRoot.appendChild(content);
	};

	public addTile = (tile: HTMLElement): any =>{
		this.shadowRoot.appendChild(tile);
	};

	public addTiles = (tiles: Array<HTMLElement>): any =>{
		tiles.forEach(tile => this.shadowRoot.appendChild(tile));
	};
}
