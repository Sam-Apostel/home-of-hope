import style from './style.scss';
import openStyle from './open.scss';
import closedStyle from './closed.scss';
import orderStyle from './order.scss';
import emptyStyle from './empty.scss';
import { ShopSourceInterface } from '../ShopTile';
import {develop, formElement, FEValue, asCurrency} from '../../../utils/developer';
import { CartItemTile } from './cartItemTile/CartItemTile';
import {FontAwesomeIcon} from '../../components';
import api from '../../../api/api';

export class CartTile extends HTMLElement {
	public constructor() {
		super();
		this.attachShadow({mode: 'open'});
	}

	private state: 'empty'|'closed'|'open'|'order';
	private shipping: {
		name: {
			first?: string;
			last?: string;
		};
		email?: string;
		address: {
			country?: 'BE' | 'NL' | 'FR';
			city?: string;
			postal?: string;
			street?: string;
			number?: string;
			bus?: string;
		};
	};
	private comments: string;


	connectedCallback(): void {
		if(this.items.size === 0) {
			const savedAmounts = JSON.parse(localStorage.getItem('shopAmounts')) ?? [];
			savedAmounts.forEach(([id, amount]) => this.items.set(id, {amount}));
		}

		const savedState = JSON.parse(localStorage.getItem('cartState'));
		const possibleStates = [ 'empty', 'closed', 'open', 'order' ];
		if(savedState && possibleStates.indexOf(savedState)){
			this.state = savedState;
		}else{
			possibleStates.forEach( (possibleState: 'empty'|'closed'|'open'|'order') => {
				if(this.hasAttribute(possibleState)){
					this.state = possibleState;
				}
			});
		}

		const savedShipping = JSON.parse(localStorage.getItem('shipping'));
		const savedComments = JSON.parse(localStorage.getItem('comments'));
		this.shipping = {
			name: {},
			address: {
				country: 'BE'
			}
		}
		this.shipping = {...this.shipping, ...savedShipping};
		this.comments = savedComments

		this.update();
	}

	attributeChangedCallback(name: string): void {
		this.updateAttributes(name);
	}

	private updateAttributes = (name: string): void => {
		const possibleStates = [ 'empty', 'closed', 'open', 'order' ];
		if(possibleStates.includes(name)) {
			this.state = (name as  'empty' | 'closed' | 'open' | 'order');
		}
		this.update();
	}

	public add = (id: {category: number, item: number}, amount: number): void => {
		const refKey = Array.from(this.items.keys()).filter(ref =>  Object.keys(ref).every((key) =>  ref[key] === id[key]))[0] ?? id;
		const item = this.items.get(refKey) ?? {};
		this.items.set(refKey, { ...item, amount: (item.amount ?? 0) + amount });
		this.update();
	}
	public subtract = (id: {category: number, item: number}, amount: number): void => {
		const refKey = Array.from(this.items.keys()).filter(ref =>  Object.keys(ref).every((key) =>  ref[key] === id[key]))[0];
		if(this.items.get(refKey).amount - amount < 0){
			this.items.delete(refKey);
		} else{
			const item = this.items.get(refKey);
			this.items.set(refKey, { ...item, amount: item.amount - amount })
		}
		this.update();
	}
	public set = (id: {category: number, item: number}, amount: number): void => {
		const refKey = Array.from(this.items.keys()).filter(ref =>  Object.keys(ref).every((key) =>  ref[key] === id[key]))[0] ?? id;
		if(amount < 0){
			this.items.delete(refKey);
		} else this.items.set(refKey, { ...this.items.get(refKey), amount })
		this.update();
	}

	private items = new Map();
	private source = {categories:[]};

	private openCart = (e): void => {

		this.removeAttribute('closed');
		this.setAttribute('order', '');
		e.target.removeEventListener('click', this.openCart);
		this.updateAttributes('order');
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
		const inCartTotal = Array.from(this.items.values()).map(({ amount }) => amount).reduce(((tot, amount) => tot + amount), 0);
		const icon = FontAwesomeIcon.makeIcon('webshop');
		//const amount = develop('span', 'amountInCart', inCart);
		const amount = develop('span', 'amountInCart', inCart + ' artikel' + (inCart===1?'':'len') + ' / ' + inCartTotal + ' totaal' );
		const openCart = develop('button', 'openCart', [icon, amount]);
		this.shadowRoot.appendChild(openCart);

		openCart.addEventListener('click', this.openCart);

		const closedStyleElement = develop('style', '', closedStyle[0][1]);
		this.shadowRoot.appendChild(closedStyleElement);

	}
	private renderOpen = (): void => {
		const closeCartButton = develop('button', 'closeCart', 'winkelwagen sluiten');
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
		const closeCartButton = develop('button', 'closeCart', 'bestel overzicht sluiten');
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

		const firstName = formElement('text', 'given-name', '', {label: 'voornaam *', autocomplete: 'given-name', value: this.shipping.name.first}, (v=>this.shipping.name.first = v));
		const lastName = formElement('text', 'family-name', '', {label: 'achternaam *', autocomplete: 'family-name', value: this.shipping.name.last}, (v=>this.shipping.name.last = v));
		const email = formElement('text', 'email', '', {label: 'email adres *', autocomplete: 'email', value: this.shipping.email}, (v=>this.shipping.email = v));
		const options = Object.entries({'BE': 'België', 'NL': 'Nederland', 'FR': 'France'} )
			.map( ([iso3166, label]) =>
				new Option(label, iso3166)
			);
		const country = formElement('select', 'ship-country', '', {label: 'land *', autocomplete: 'shipping country', options , value: this.shipping.address.country}, (v=>this.shipping.address.country = v));
		const city = formElement('text', 'ship-city', '', {label: 'gemeente *', autocomplete: 'shipping locality', value: this.shipping.address.city}, (v=>this.shipping.address.city = v));
		const postal = formElement('text', 'ship-zip', '', {label: 'postcode *', autocomplete: 'shipping postal-code', value: this.shipping.address.postal}, (v=>this.shipping.address.postal = v));
		const street = formElement('text', 'ship-address', '', {label: 'straat *', autocomplete: 'shipping street-address', value: this.shipping.address.street}, (v=>this.shipping.address.street = v));
		const number = formElement('text', 'ship-number', '', {label: 'nummer *', autocomplete: 'shipping street-number', value: this.shipping.address.number}, (v=>this.shipping.address.number = v));
		const bus = formElement('text', 'ship-bus', '', {label: 'bus', autocomplete: 'shipping street-bus', value: this.shipping.address.bus}, (v=>this.shipping.address.bus = v));

		const commentsInput = develop('textarea', '', [],{name: 'comments', placeholder: 'Vermeld hier zeker je gewenste gedichtje indien je een kaartje op aanvraag besteld.'});
		commentsInput.addEventListener('change', ()=>{
			(v => this.comments = v)((commentsInput as HTMLTextAreaElement).value);
		});
		const commentsField = develop('label', 'comments', ['opmerkingen', commentsInput], {for: 'comments'}) as HTMLLabelElement;

		const shippingForm = develop('form', 'shipping', [firstName, lastName, email, country, city, postal, street, number, bus, commentsField] );
		this.shadowRoot.appendChild(shippingForm);
		const hasBook = Array.from(this.items.entries()).some(([{category}, {amount}]) => category === 1 && amount > 0 );
		const hasCard = Array.from(this.items.entries()).some(([{category}, {amount}]) => category === 0 && amount > 0 );
		const calculateShipping = () => {
			return (
				this.shipping.address.country === 'NL' && (
					(!hasBook &&  hasCard && 2.28) ||
					( hasBook && !hasCard && 9) ||
					( hasBook &&  hasCard && 9)
				) ||
				this.shipping.address.country === 'BE' && (
					(!hasBook &&  hasCard && 1.71) ||
					( hasBook && !hasCard && 5.9) ||
					( hasBook &&  hasCard && 5.9)
				) ||
				this.shipping.address.country === 'FR' && (
					(!hasBook &&  hasCard && 2.28) ||
					( hasBook && !hasCard && 13.5) ||
					( hasBook &&  hasCard && 13.5)
				)
			);
		}
		const price = {
			item: Array.from(this.items.entries()).map(([id, {amount}]) =>
				this.source.categories[id.category].items[id.item].price * amount
			).reduce((total, subtotal) => total + subtotal, 0),
			shipping: calculateShipping(),
			total: 0
		};
		price.total = price.item + price.shipping;

		const itemCostLabel = develop('span', 'label', 'Prijs');
		const itemCostValue = develop('span', 'value', asCurrency(price.item));
		const itemCostRow = develop('span', 'item row', [itemCostLabel, itemCostValue]);

		const shippingCostLabel = develop('span', 'label', 'Verzending');
		const shippingCostValue = develop('span', 'value', asCurrency(price.shipping, true));
		const shippingCostRow = develop('span', 'shipping row', [shippingCostLabel, shippingCostValue]);

		const totalCostLabel = develop('span', 'label', 'Totaalprijs');
		const totalCostValue = develop('span', 'value', asCurrency(price.total));
		const totalCostRow = develop('span', 'total row', [totalCostLabel, totalCostValue]);
		this.shadowRoot.appendChild(develop('div', 'totals', [itemCostRow, shippingCostRow, totalCostRow]));

		country.addEventListener('change', () => {
			price.shipping = calculateShipping();
			price.total = price.item + price.shipping;
			shippingCostValue.innerText = asCurrency(price.shipping, true);
			totalCostValue.innerText = asCurrency(price.total);
		});
		const terms = develop('span', 'terms', [
			'Wanneer u dit formulier verzend gaat u akkoord met de ',
			develop('a', '', 'Terms and conditions', {href: './legal/termsandconditions', target: '_blank'}),
		]);
		this.shadowRoot.appendChild(terms);

		const orderButton = develop('button', 'pay', 'verder naar betaling', { disabled: 'true' });
		this.shadowRoot.appendChild(orderButton);
		orderButton.addEventListener('click', (e) => {
			e.stopPropagation();
			(orderButton as HTMLButtonElement).disabled = true;
			orderButton.innerHTML = '<i class="gg-spinner-alt"></i>';

			const order = Array.from(this.items.entries())
				.map(([ {category, item}, { amount }]) => ({item: this.source.categories[category].items[item], amount}))
				.filter( ({amount}) => amount > 0)
				.map( ({item, amount}) => ({
					name: item.name,
					quantity: amount,
					price: item.price,
					imageUrl: `/images/420/jpg/${item.images[0]}.jpg`
				}));
			const address = {
				name: this.shipping.name,
				email: FEValue(email),
				street: `${this.shipping.address.street ?? ''} ${this.shipping.address.number ?? ''} ${this.shipping.address.bus ?? ''}`,
				postal: this.shipping.address.postal,
				city: this.shipping.address.city,
				country: this.shipping.address.country
			};
			const shipping = price.shipping;
			const comments = this.comments;

			api.newOrder(
				{order, address, shipping, comments},
				response => {
					if(response?.id) localStorage.setItem('orderId', response.id);
					if(response?._links?.checkout?.href) {
						(orderButton as HTMLButtonElement).disabled = false;
						orderButton.innerText = 'verder naar betaling';
						window.location = response?._links?.checkout?.href;
					} else throw response;
				},
				error => {
					alert('Spijtig genoeg is er iets misgegaan bij het aanmaken van de betaling, we lossen het zo snel mogelijk op en laten je iets weten als het probleem van de baan is.');
					api.log({endpoint: 'newOrder', error, initialData: {order, address, shipping, comments}});
					(orderButton as HTMLButtonElement).disabled = false;
					orderButton.innerText = 'verder naar betaling';
				}
			);

		})
		const toggleButton = (): void => {
			(orderButton as HTMLButtonElement).disabled = !(
				firstName.querySelector('input').value !== '' &&
				lastName.querySelector('input').value !== '' &&
				email.querySelector('input').value !== '' &&
				city.querySelector('input').value !== '' &&
				postal.querySelector('input').value !== '' &&
				street.querySelector('input').value !== '' &&
				number.querySelector('input').value !== '' &&
				Array.from(this.items.values()).filter(({ amount }) =>  amount > 0).length > 0
			);
		};
		toggleButton();
		shippingForm.addEventListener('change', ()=>{
			localStorage.setItem('shipping', JSON.stringify(this.shipping));
			toggleButton();
		});

		if (Array.from(this.items.keys()).length === 0){
			this.removeAttribute('order');
			this.setAttribute('empty', '');
			this.updateAttributes('empty');
			return;
		}
		this.shadowRoot.appendChild(develop('style', '', orderStyle[0][1]));
	}
	public empty = (): void => {
		localStorage.removeItem('shopAmounts');
		this.items = new Map();
		this.update();
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
		localStorage.setItem('cartState', JSON.stringify(this.state));
		localStorage.setItem('shipping', JSON.stringify(this.shipping));
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
