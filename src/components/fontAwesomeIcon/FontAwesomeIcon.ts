import style from './style.scss';
import {homeIcon, bookOpen, penFancy, guitar, graduationCap, palette, handHoldingHeart, puzzlePiece, shoppingBag} from './icons/bundle';

export class FontAwesomeIcon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML += `<style>${style}</style>`;

    }
    connectedCallback(): void{
        if (this.hasAttribute('home'))
            this.shadowRoot.innerHTML += homeIcon;
        if (this.hasAttribute('book-open'))
            this.shadowRoot.innerHTML += bookOpen;
        if (this.hasAttribute('pen-fancy'))
            this.shadowRoot.innerHTML += penFancy;
        if (this.hasAttribute('guitar'))
            this.shadowRoot.innerHTML += guitar;
        if (this.hasAttribute('graduation-cap'))
            this.shadowRoot.innerHTML += graduationCap;
        if (this.hasAttribute('palette'))
            this.shadowRoot.innerHTML += palette;
        if (this.hasAttribute('hand-holding-heart'))
            this.shadowRoot.innerHTML += handHoldingHeart;
        if (this.hasAttribute('puzzle-piece'))
            this.shadowRoot.innerHTML += puzzlePiece;
        if (this.hasAttribute('shopping-bag'))
            this.shadowRoot.innerHTML += shoppingBag;
    }

    public static makeIcon = (type: string): FontAwesomeIcon => {
        const icon = new FontAwesomeIcon();
        icon[type] = true;
        return icon;
    };

    set home(value) {
        if (Boolean(value))
            this.setAttribute('home', '');
        else
            this.removeAttribute('home');
    }

    set stories(value) {
        if (Boolean(value))
            this.setAttribute('book-open', '');
        else
            this.removeAttribute('book-open');
    }

    set poems(value) {
        if (Boolean(value))
            this.setAttribute('pen-fancy', '');
        else
            this.removeAttribute('pen-fancy');
    }

    set music(value) {
        if (Boolean(value))
            this.setAttribute('guitar', '');
        else
            this.removeAttribute('guitar');
    }

    set research(value) {
        if (Boolean(value))
            this.setAttribute('graduation-cap', '');
        else
            this.removeAttribute('graduation-cap');
    }

    set art(value) {
        if (Boolean(value))
            this.setAttribute('palette', '');
        else
            this.removeAttribute('palette');
    }

    set interpreting(value) {
        if (Boolean(value))
            this.setAttribute('hand-holding-heart', '');
        else
            this.removeAttribute('hand-holding-heart');
    }

    set asperger(value) {
        if (Boolean(value))
            this.setAttribute('puzzle-piece', '');
        else
            this.removeAttribute('puzzle-piece');
    }

    set webshop(value) {
        if (Boolean(value))
            this.setAttribute('shopping-bag', '');
        else
            this.removeAttribute('shopping-bag');
    }

}

window.customElements.define('font-awesome-icon', FontAwesomeIcon);
