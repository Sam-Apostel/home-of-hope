import style from './style.scss';
import openStyle from './open.scss';
import closedStyle from './closed.scss';
import orderStyle from './order.scss';
import emptyStyle from './empty.scss';
import { ShopSourceInterface } from '../ShopTile';
import { develop, formElement } from '../../../utils/developer';
import { CartItemTile } from './cartItemTile/CartItemTile';
import {FontAwesomeIcon} from '../../components';

export class CartTile extends HTMLElement {
	public constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}

	private state: 'empty'|'closed'|'open'|'order';

	connectedCallback(): void {
		const savedAmounts = JSON.parse(localStorage.getItem('shopAmounts')) ?? [];
		savedAmounts.forEach( ([id, amount]) => this.items.set( id, { amount }));

		const possibleStates = [ 'empty', 'closed', 'open', 'order' ];
		possibleStates.forEach( (possibleState: 'empty'|'closed'|'open'|'order') => {
			if(this.hasAttribute(possibleState)){
				this.state = possibleState;
			}
		});

		this.update();
	}

	attributeChangedCallback(name): void {
		this.updateAttributes(name);
	}

	private updateAttributes = (name): void => {
		const possibleStates = [ 'empty', 'closed', 'open', 'order' ];
		possibleStates.forEach( (possibleState: 'empty'|'closed'|'open'|'order' ) => {
			if( name === possibleState){
				this.state = possibleState;
			}
		});
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

	private openCart = (): void => {
		this.removeAttribute('closed');
		this.setAttribute('open', '');
		this.removeEventListener('click', this.openCart);
		this.updateAttributes('open');
	}

	private renderEmpty = (): void => {
		if (Array.from(this.items.keys()).length !== 0){
			this.removeAttribute('empty');
			this.setAttribute('closed', '');
			this.updateAttributes('closed');
			return;
		}
		const emptyStyleElement = develop('style', '', emptyStyle[0][1]);
		this.shadowRoot.appendChild(emptyStyleElement);
	}
	private renderClosed = (): void => {
		if (Array.from(this.items.keys()).length === 0){
			this.removeAttribute('closed');
			this.setAttribute('empty', '');
			this.updateAttributes('empty');
			return;
		}

		const inCart = Array.from(this.items.values()).map(({ amount }) => amount).filter(amount => amount > 0).length;
		this.shadowRoot.appendChild(FontAwesomeIcon.makeIcon('webshop'));
		this.shadowRoot.appendChild(develop('span', 'amountInCart', inCart));

		this.addEventListener('click', this.openCart);

		const closedStyleElement = develop('style', '', closedStyle[0][1]);
		this.shadowRoot.appendChild(closedStyleElement);

	}
	private renderOpen = (): void => {
		const closeCartButton = develop('button', 'closeCart', 'x');
		closeCartButton.addEventListener('click', (e) => {
			e.stopPropagation();
			this.removeAttribute('open');
			this.setAttribute('closed', '');
			this.updateAttributes('closed');
		})
		this.shadowRoot.appendChild(closeCartButton);
		const isCheckOutDisabled = {disabled: ''};
		Array.from(this.items.entries()).map( ([id, { element, amount }]) => {
			if( amount > 0) delete isCheckOutDisabled.disabled;
			if(!element) {
				element = this.buildItem(id);
				this.items.set(id, { element: element, amount: amount });
			}
			this.updateQuantity(element, amount);
			return element;
		}).forEach(element => this.shadowRoot.appendChild(element));
		const checkOutButton = develop('button', 'checkout', 'bestel', { ...isCheckOutDisabled });
		this.shadowRoot.appendChild(checkOutButton);
		checkOutButton.addEventListener('click', (e) => {
			e.stopPropagation();
			this.removeAttribute('open');
			this.setAttribute('order', '');
			this.updateAttributes('order');
		})
		this.shadowRoot.appendChild(develop('style', '', openStyle[0][1]));

		if (Array.from(this.items.keys()).length === 0){
			this.removeAttribute('open');
			this.setAttribute('empty', '');
			this.updateAttributes('empty');
		}
	}
	private renderOrder = (): void => {
		const closeCartButton = develop('button', 'closeCart', 'x');
		closeCartButton.addEventListener('click', (e) => {
			e.stopPropagation();
			this.removeAttribute('order');
			this.setAttribute('closed', '');
			this.updateAttributes('closed');
		})
		this.shadowRoot.appendChild(closeCartButton);
		const items = Array.from(this.items.entries()).map( ([id, { element, amount }]) => {
			if(!element) {
				element = this.buildItem(id);
				this.items.set(id, { element, amount });
			}
			this.updateQuantity(element, amount);
			return element;
		});
		this.shadowRoot.appendChild(develop('div', 'items', items));

		const name = formElement('text', 'name', '', 'name', 'name');
		const email = formElement('text', 'email', '', 'email', 'email');
		const country = formElement('text', 'ship-country', '', 'country', 'shipping country', );
		const city = formElement('text', 'ship-city', '', 'city', 'shipping locality');
		const postal = formElement('text', 'ship-zip', '', 'postal code', 'shipping postal-code');
		const street = formElement('text', 'ship-address', '', 'street', 'shipping street-address');
		const message = formElement('text', 'message', '', 'message');
		const shippingForm = develop('form', 'shipping', [name, email, country, city, postal, street, message] );
		this.shadowRoot.appendChild(shippingForm);

		const price = {
			item: Array.from(this.items.entries()).map(([id, {amount}]) =>
				this.source.categories[id.category].items[id.item].price * amount
			).reduce((acc, val) => acc+=val, 0),
			shipping: ([...country.childNodes][1] as HTMLInputElement).value === 'Belgium' ? 1.71: 2.28,
			total: 0
		};
		price.total = price.item + price.shipping;

		const itemCostLabel = develop('span', 'label', 'Prijs');
		const itemCostValue = develop('span', 'value', `€${price.item.toFixed(2)}`);
		const itemCostRow = develop('span', 'item row', [itemCostLabel, itemCostValue]);

		const shippingCostLabel = develop('span', 'label', 'Verzending');
		const shippingCostValue = develop('span', 'value', `€${price.shipping.toFixed(2)}`);
		const shippingCostRow = develop('span', 'shipping row', [shippingCostLabel, shippingCostValue]);

		const totalCostLabel = develop('span', 'label', 'Totaalprijs');
		const totalCostValue = develop('span', 'value', `€${price.total.toFixed(2)}`);
		const totalCostRow = develop('span', 'total row', [totalCostLabel, totalCostValue]);
		this.shadowRoot.appendChild(develop('div', 'totals', [itemCostRow, shippingCostRow, totalCostRow]));

		country.addEventListener('change', () => {
			price.shipping = ([...country.childNodes][1] as HTMLInputElement).value === 'Belgium' ? 1.71: 2.28;
			price.total = price.item + price.shipping;
			shippingCostValue.innerText = `€${price.shipping.toFixed(2)}`;
			totalCostValue.innerText = `€${price.total.toFixed(2)}`;
		});

		const order = {};
		const orderButton = develop('button', 'pay', 'betaal', { disabled: '' });
		this.shadowRoot.appendChild(orderButton);
		orderButton.addEventListener('click', (e) => {
			e.stopPropagation();
			console.log('order', order);
		})

		if (Array.from(this.items.keys()).length === 0){
			this.removeAttribute('order');
			this.setAttribute('empty', '');
			this.updateAttributes('empty');
			return;
		}
		this.shadowRoot.appendChild(develop('style', '', orderStyle[0][1]));
	}

	private update = (): void => {
		this.shadowRoot.innerHTML = '';
		const styleElement = develop('style', '', style[0][1]);
		this.shadowRoot.appendChild(styleElement);

		switch(this.state){
			case 'empty':
				this.renderEmpty();
				break;
			case 'closed':
				this.renderClosed()
				break;
			case 'open':
				this.renderOpen();
				break;
			case 'order':
				this.renderOrder();
				break;
			default:
				break;
		}

		const amountsArray = Array.from(this.items.entries()).map( ([id, { amount }]) => {
			return [id, amount];
		})
		localStorage.setItem('shopAmounts', JSON.stringify(amountsArray));
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

		tile.source = source;
		tile.setAttribute('order', '');

		return tile;
	}

}

window.customElements.define('cart-tile', CartTile);
