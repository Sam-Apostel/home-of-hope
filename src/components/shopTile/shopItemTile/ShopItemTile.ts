import style from './style.scss';
import {asCurrency, develop, imageElement} from '../../../utils/developer';

export interface ShopSourceItemInterface {
	name: string;
	images: string[];
	price: number;
	description: string;
	id: number;
	custom?: boolean;
}

export class ShopItemTile extends HTMLElement{
	public constructor() {
		super();
		this.attachShadow({mode:'open'});
	}
	private modalContent;
	private openModal = () => {
		this.dispatchEvent(new CustomEvent('openModal', {detail: this.modalContent, bubbles: true, cancelable: false, composed: true}));
	};


	connectedCallback(): void {
		this.shadowRoot.addEventListener('click', this.openModal);
	}

	disconnectedCallback(): void {
		this.shadowRoot.removeEventListener('click', this.openModal);
	}



	public static MakeTile = (item: ShopSourceItemInterface, id: { category: number, item: number } ): ShopItemTile => {
		const tile = new ShopItemTile();

		const title = develop('h3', 'itemTitle', item.name);
		const image = imageElement('itemImage', item.images[0], item.name, ['420'], ['webp', 'jpg']);
		const imageAlt = develop('img','itemImage', [], {src:'https://tigrr.b-cdn.net/images/960/jpg/' + item.images[1%item.images.length] + '.jpg'});
		const price = develop('span', 'price', asCurrency(item.price));
		const description = develop('p', 'itemDescription', item.description);
		const orderButton = develop('button', 'orderButton', 'Voeg toe aan winkelmandje');
		const addToCart = (e) => {
			e.stopPropagation();
			tile.dispatchEvent(new CustomEvent('addToCart', {
				detail: {id},
				bubbles: true,
				cancelable: false,
				composed: true
			}));
		};
		orderButton.addEventListener('click', addToCart);

		const styleElement = document.createElement('style');
		styleElement.innerHTML = style;

		[image, description, price, title, orderButton, styleElement].forEach(c => tile.shadowRoot.appendChild(c));
		let duplicates;
		if(item.custom){
			duplicates = [title, price, description, orderButton].map((element) => (element as Node).cloneNode(true));
		}else{
			duplicates = [title, imageAlt, price, description, orderButton].map((element) => (element as Node).cloneNode(true));
		}
		duplicates[duplicates.length - 1].addEventListener('click', addToCart);
		tile.modalContent = develop('div', 'shopItemModal', duplicates);

		return tile;
	}
}

window.customElements.define('shop-item-tile', ShopItemTile);
