import style from './style.scss';
import { develop } from '../../utils/developer';

export class ModalTile extends HTMLElement{
    public constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    private container: HTMLDivElement;

    public static MakeTile = (): ModalTile => {
        const tile = new ModalTile();
        tile.container = develop('div', 'container') as HTMLDivElement;
        tile.shadowRoot.appendChild(tile.container);
        tile.container.addEventListener('click', () => {tile.close()});

        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        tile.shadowRoot.appendChild(styleElement);
        return tile;
    };

    public open = (detail: HTMLElement): void => {
        this.container.innerHTML = '';
        this.container.appendChild(detail);
        this.classList.add('open');
    };

    public close = (): void => {
        this.container.innerHTML = '';
        this.classList.remove('open');
    }
}

window.customElements.define('modal-tile', ModalTile);
