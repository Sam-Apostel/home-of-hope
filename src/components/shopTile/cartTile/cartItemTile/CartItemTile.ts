import style from './style.scss';
import { develop } from '../../../../utils/developer';
import {ShopSourceItemInterface} from '../../shopItemTile/ShopItemTile';

export class CartItemTile extends HTMLElement {
	public constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}

	connectedCallback(): void {
		this.setAmount(parseInt(this.getAttribute('amount')));
	}
	attributeChangedCallback(name, oldValue, newValue): void {
		if(name === 'amount') this.setAmount(parseInt(newValue));
	}

	public source: ShopSourceItemInterface;
	public itemId: { category: number; item: number };
	public controls: { add: (amount) => void; subtract: (amount) => void; set: (amount) => void };

	private amount = 0;
	private setAmount = (amount: number): void => {
		this.amount = amount;
		(this.shadowRoot.querySelector('.amount') as HTMLInputElement).value = amount.toString();
		(this.shadowRoot.querySelector('.totalPrice') as HTMLElement).innerText = `€${this.source.price * amount}`;
	}

	private buildItem = (): Array<HTMLElement> => {
		const product = this.source;
		const imgElem = develop('img', 'image', [], {src: product.images[0]});
		const nameElem = develop('span', 'name', product.name ?? '');
		const amountInput = develop('input', 'amount', [], {type: 'text'/* TODO: change this to number for mobile users */, value: this.amount.toString()});
		const subtractButton = develop('button', 'subtract', '-');
		const addButton = develop('button', 'add', '+');

		subtractButton.addEventListener('click',() => {
			this.controls.subtract(1);
		});
		addButton.addEventListener('click',() => {
			this.controls.add(1);
		});
		amountInput.addEventListener('change', () => {
			const val = (amountInput as HTMLInputElement).value;
			if(Number.isInteger(parseInt(val))){
				this.controls.set(parseInt(val));
			} else if(val === ''){
				this.controls.set(0);
			} else{
				this.controls.set(this.amount);
			}
		});
		const quantityInput = develop('span', 'quantityInput', [subtractButton, amountInput, addButton]);
		const totalPriceElem = develop('span','totalPrice', `€${product.price * this.amount}`);
		const priceElem = develop('span','price', `€${product.price}`);
		return [imgElem, nameElem, quantityInput, priceElem, totalPriceElem];
	}

	public static MakeTile = (source: ShopSourceItemInterface, id, controls): CartItemTile => {
		const tile = new CartItemTile();
		tile.source = source;
		tile.itemId = id;
		tile.controls = controls;
		tile.buildItem().forEach(elem => tile.shadowRoot.appendChild(elem));

		const styleElement = document.createElement('style');
		styleElement.innerHTML = style;
		tile.shadowRoot.appendChild(styleElement);


		return tile;
	}
}

window.customElements.define('cart-item-tile', CartItemTile);
