import style from './style.scss';
import {develop} from '../../../utils/developer';

export interface ReviewSourceInterface {
	name: string;
	rating: number;
	review: string;
}

export class ReviewItemTile extends HTMLElement{
	public constructor() {
		super();
		this.attachShadow({mode:'open'});
	}

	public static MakeTile = (item: ReviewSourceInterface): ReviewItemTile => {
		const tile = new ReviewItemTile();

		const title = develop('h3', 'itemTitle', item.name);
		const review = develop('p', 'itemDescription', item.review);


		const styleElement = document.createElement('style');
		styleElement.innerHTML = style;

		[review, title, styleElement].forEach(c => tile.shadowRoot.appendChild(c));
		return tile;
	}
}

window.customElements.define('review-item-tile', ReviewItemTile);
