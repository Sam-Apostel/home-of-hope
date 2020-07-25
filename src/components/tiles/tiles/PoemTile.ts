interface poemContent{
	title?: string;
	text: string;
	author?: string;
	url?: string;
}

export class PoemTile extends HTMLElement{
	private url: string;

	constructor(){
		super();
		this.attachShadow({mode:'open'});
	}
	public static makeTile = (): TileInterface =>{
		return new PoemTile();
	};

	public addContent = (content: poemContent): void =>{
		this.setUrl(content.url);
		this.setTitle(content.title);
		this.setText(content.text);
		this.setAuthor(content.author);
	};
	private setUrl = (url: string | undefined): void => {
		this.url = url;
	};
	private setTitle = (title: string | undefined): void => {
		if(title){
			const titleElement = document.createElement('h1');
			titleElement.innerText = title;
			this.shadowRoot.appendChild(titleElement);
		}
	};
	private setText = (text: string | undefined): void => {
		const textElement = document.createElement('p');
		textElement.innerText = text;
		this.shadowRoot.appendChild(textElement);
	};
	private setAuthor = (author: string | undefined): void => {
		if(author){
			const authorElement = document.createElement('h2');
			authorElement.innerText = author;
			this.shadowRoot.appendChild(authorElement);
		}
	};
	// onclick -> this.url
}

window.customElements.define('poem-tile', PoemTile);
