import style from './style.scss';
import { ReviewItemTile, ReviewSourceInterface } from './ReviewItemTile/ReviewItemTile';
import { develop } from '../../utils/developer';

export class ReviewTile extends HTMLElement{
    public constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    public static MakeTile = (source: ReviewSourceInterface[]): ReviewTile => {
        const tile = new ReviewTile();

        const reviews = source.map(review => ReviewItemTile.MakeTile(review));

        const container = develop('div', 'container', reviews);

        tile.shadowRoot.appendChild(container);
        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        tile.shadowRoot.appendChild(styleElement);
        return tile;
    };

}

window.customElements.define('review-tile', ReviewTile);
