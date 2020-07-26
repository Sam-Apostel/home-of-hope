import style from './style.scss';
import {develop} from '../../../utils/developer';

export interface ShopSourceItemInterface {
	name: string;
	images: string[];
	price: number;
	description: string;
	id: number;
}

export class ShopItemTile extends HTMLElement{
	public constructor() {
		super();
		this.attachShadow({mode:'open'});
	}

	public static MakeTile = (item: ShopSourceItemInterface, addToCart: () => void, ): ShopItemTile => {
		const tile = new ShopItemTile();

		const title = develop('h3', 'itemTitle', item.name);
		const image = develop('img', 'itemImage', [], {src: item.images[0], alt: item.name});
		const price = develop('span', 'price', '€' + item.price.toFixed(2));
		const description = develop('p', 'itemDescription', item.description);
		const orderButton = develop('button', 'orderButton', 'Voeg toe aan winkelmandje');
		orderButton.addEventListener('click', addToCart);

		const styleElement = document.createElement('style');
		styleElement.innerHTML = style;

		[image, title, price, description, orderButton, styleElement].forEach(c => tile.shadowRoot.appendChild(c));
		return tile;
	}
}

window.customElements.define('shop-item-tile', ShopItemTile);
