import style from './style.scss';
import { CartTile } from './cartTile/CartTile';
import { ShopItemTile, ShopSourceItemInterface } from './shopItemTile/ShopItemTile';
import { develop } from '../../utils/developer';
import api from '../../api/api';


interface ShopSourceCategoryInterface {
    name: string;
    id: number;
    description: string;
    items: ShopSourceItemInterface[];
}

export interface ShopSourceInterface {
    categories: ShopSourceCategoryInterface[];
}
export class ShopTile extends HTMLElement{
    public constructor(){
        super();
        this.attachShadow({mode:'open'});
    }
    private cart;

    private addToCartListener = (
        ((e: CustomEvent) => {
            this.cart.add(e.detail.id, 1);
        }) as EventListener
    );

    connectedCallback(): void{
        const urlAttr = location.hash.substr(1);
        if(urlAttr !== '') {
            const urlSections = urlAttr.split('?');
            if(urlSections[1]){
                if(urlSections[1].indexOf('redirect=payment') >= 0 && localStorage.getItem('orderId')){
                    api.orderStatus(
                        {orderId: localStorage.getItem('orderId')},
                        res => {
                            if(res.status === 'paid'){
                                alert('betaling van order ' + localStorage.getItem('orderId') + ' was successvol.')
                                this.cart.empty();
                                localStorage.clear();
                            }else{
                                alert('betaling van order ' + localStorage.getItem('orderId') + ' is niet gelukt.')
                                throw res;
                            }
                        }
                    );
                }
            }
        }

        this.addEventListener('addToCart', this.addToCartListener);
    }

    disconnectedCallback(): void {
        this.removeEventListener('addToCart', this.addToCartListener);
    }

    public static MakeTile = (source: ShopSourceInterface): ShopTile => {
        const tile = new ShopTile();
        tile.cart = CartTile.MakeTile(source);

        const categories = source.categories.filter(c=>c.items.length).map(category => {
            const items = (category.items as Array<ShopSourceItemInterface>).map( item =>
                ShopItemTile.MakeTile(item,{category: category.id, item: item.id})
            );
            const itemContainer = develop('div', `itemContainer ${category.name}`, items);
            const title = develop('h2', 'categoryTitle', category.name);
            const description = develop('p', 'categoryDescription', category.description);
            return develop('div', 'category', [title, description, itemContainer]);
        });

        const container = develop('div', 'container', categories);

        tile.shadowRoot.appendChild(container);
        tile.shadowRoot.appendChild(tile.cart);
        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        tile.shadowRoot.appendChild(styleElement);
        return tile;
    };

}

window.customElements.define('shop-tile', ShopTile);
