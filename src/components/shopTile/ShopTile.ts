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

    public static MakeTile = (source: ShopSourceInterface): ShopTile => {
        const tile = new ShopTile();
        tile.cart = CartTile.MakeTile(source);

        const categories = source.categories.filter(c=>c.items.length).map(category => {
            const items = (category.items as Array<ShopSourceItemInterface>).map( item =>
                ShopItemTile.MakeTile(item,(): void => {
                    tile.cart.add({category: category.id, item: item.id}, 1);
                })
            );
            const itemContainer = develop('div', 'itemContainer', items);
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