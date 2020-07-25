import style from './style.scss';
import { ShopSourceInterface } from '../ShopTile';
import { develop } from '../../../utils/developer';
import { CartItemTile } from './cartItemTile/CartItemTile';

export class CartTile extends HTMLElement {
	public constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}

	connectedCallback(): void {
		const savedAmounts = JSON.parse(localStorage.getItem('shopAmounts')) ?? [];
		savedAmounts.forEach( ([id, amount]) => this.items.set( id, { amount }));
		this.update();
	}

	public add = (id, amount): void => {
		const refKey = Array.from(this.items.keys()).filter(ref =>  Object.keys(ref).every((key) =>  ref[key] === id[key]))[0] ?? id;
		const item = this.items.get(refKey) ?? {};
		this.items.set(refKey, { ...item, amount: (item.amount ?? 0) + amount });
		this.update();
	}

	public subtract = (id, amount): void => {
		const refKey = Array.from(this.items.keys()).filter(ref =>  Object.keys(ref).every((key) =>  ref[key] === id[key]))[0];
		if(this.items.get(refKey).amount - amount < 0){
			this.items.delete(refKey);
		} else{
			const item = this.items.get(refKey);
			this.items.set(refKey, { ...item, amount: item.amount - amount })
		}
		this.update();
	}
	public set = (id, amount): void => {
		const refKey = Array.from(this.items.keys()).filter(ref =>  Object.keys(ref).every((key) =>  ref[key] === id[key]))[0] ?? id;
		if(amount < 0){
			this.items.delete(refKey);
		} else this.items.set(refKey, { ...this.items.get(refKey), amount })
		this.update();
	}

	private items = new Map();
	private source = {categories:[]};

	private update = (): void => {
		const items = this.shadowRoot.querySelector('.items');
		items.innerHTML = '';
		const amounts = new Map();
		Array.from(this.items.entries()).map( ([id, { element, amount }]) => {
			amounts.set(id, amount);
			if(!element) {
				element = this.buildItem(id);
				this.items.set(id, { element: element, amount: amount });
			}
			this.updateQuantity(element, amount);
			return element;
		}).forEach(element => items.appendChild(element));
		localStorage.setItem('shopAmounts', JSON.stringify(Array.from(amounts.entries())));
	}

	private updateQuantity = (element, amount): void => {
		element.setAttribute('amount', amount);
	}
	private buildItem = (id): CartItemTile => {
		const controls = {
			add: (amount: number): void => this.add(id, amount),
			subtract: (amount: number): void => this.subtract(id, amount),
			set: (amount: number): void => this.set(id, amount),
		};
		const itemSource = this.source.categories[id.category].items[id.item];
		return CartItemTile.MakeTile(itemSource, id, controls);
	}

	public static MakeTile = (source: ShopSourceInterface): CartTile => {
		const tile = new CartTile();
		tile.shadowRoot.appendChild(develop('div', 'items'));

		const styleElement = document.createElement('style');
		styleElement.innerHTML = style;
		tile.shadowRoot.appendChild(styleElement);

		tile.source = source;

		return tile;
	}

}

window.customElements.define('cart-tile', CartTile);
