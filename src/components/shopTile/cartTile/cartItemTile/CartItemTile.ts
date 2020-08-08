import style from './style.scss';
import {asCurrency, develop, imageElement} from '../../../../utils/developer';
import { ShopSourceItemInterface } from '../../shopItemTile/ShopItemTile';
import {FontAwesomeIcon} from '../../../components';

export class CartItemTile extends HTMLElement {
	public constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}

	connectedCallback(): void {
		this.setAmount(parseInt(this.getAttribute('amount')));
	}
	attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		if(name === 'amount') this.setAmount(parseInt(newValue));
	}

	public source: ShopSourceItemInterface;
	public itemId: { category: number; item: number };
	public controls: { add: (amount) => void; subtract: (amount) => void; set: (amount) => void };

	private amount = 0;
	private setAmount = (amount: number): void => {

		(this.shadowRoot.querySelector('.amount') as HTMLInputElement).value = amount.toString();
		(this.shadowRoot.querySelector('.totalPrice') as HTMLElement).innerText = asCurrency(this.source.price * amount);
		if(this.amount !== 0 && amount === 0){
			this.shadowRoot.querySelector('.remove').classList.remove('hidden');
			this.shadowRoot.querySelector('.subtract').classList.add('hidden');
		}else if(this.amount === 0 && amount !== 0){
			this.shadowRoot.querySelector('.remove').classList.add('hidden');
			this.shadowRoot.querySelector('.subtract').classList.remove('hidden');
		}
		this.amount = amount;
	}

	private buildItem = (): Array<HTMLElement> => {
		const product = this.source;
		const imgElem = imageElement('image', product.images[0], product.name, ['420' /* TODO: optimise for 40px */], ['webp', 'jpg']);
		const nameElem = develop('span', 'name', product.name ?? '');
		const amountInput = develop('input', 'amount', [], {type: 'text'/* TODO: change this to number for mobile users */, value: this.amount.toString()});
		const subtractButton = develop('button', 'subtract', '-');
		const removeButton = develop('button', 'remove', FontAwesomeIcon.makeIcon('trash'));
		if(this.amount === 0){
			subtractButton.classList.add('hidden');
		}else{
			removeButton.classList.add('hidden');
		}
		const addButton = develop('button', 'add', '+');

		subtractButton.addEventListener('click',() => {
			this.controls.subtract(1);
		});
		removeButton.addEventListener('click',() => {
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
		const quantityInput = develop('span', 'quantityInput', [subtractButton, removeButton, amountInput, addButton]);
		const totalPriceElem = develop('span','totalPrice', asCurrency(product.price * this.amount));
		const priceElem = develop('span','price', asCurrency(product.price));
		return [imgElem, nameElem, quantityInput, priceElem, totalPriceElem];
	}

	public static MakeTile = (source: ShopSourceItemInterface, id: {category: number, item: number}, controls: {set: (number)=>void, add: (number)=>void, subtract: (number)=>void}): CartItemTile => {
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
