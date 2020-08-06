import style from './style.scss';
import { CartTile } from './cartTile/CartTile';
import { ShopItemTile, ShopSourceItemInterface } from './shopItemTile/shopItemTile';
import { develop } from '../../utils/developer';


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

    connectedCallback(): void{
        const urlAttr = location.hash.substr(1);
        if(urlAttr !== '') {
            const urlSections = urlAttr.split('?');
            if(urlSections[1]){
                if(urlSections[1].indexOf('redirect=payment') >= 0){


                    const formData = new FormData();
                    formData.append("orderId", JSON.stringify(localStorage.getItem('orderId')));

                    fetch('https://api.tigrr.be/order/open/', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json'
                        },
                        body: formData
                    })
                        .then(res=>res.json())
                        .then(res => {
                            if(res.status === 'paid'){
                                this.cart.empty();
                            }else{
                            	throw res;
                            }
                        })
                        .catch(err => {
                            const errorFormData = new FormData();
                            errorFormData.append("data", JSON.stringify(err));
                            fetch('https://api.tigrr.be/log/', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json'
                                },
                                body: errorFormData
                            })
                        });
                }
            }
        }

    }

    public static MakeTile = (source: ShopSourceInterface): ShopTile => {
        const tile = new ShopTile();
        tile.cart = CartTile.MakeTile(source);

        const categories = source.categories.filter(c=>c.items.length).map(category => {
            const items = (category.items as Array<ShopSourceItemInterface>).map( item =>
                ShopItemTile.MakeTile(item,(): void => {
                    tile.cart.add({category: category.id, item: item.id}, 1);
                })
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
