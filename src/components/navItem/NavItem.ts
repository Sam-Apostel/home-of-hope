import template from './template.html';
import style from './style.scss';
import {ContentItem} from "../contentItem/ContentItem";

export class NavItem extends HTMLElement {
    private contentItem: ContentItem;

    static get observedAttributes(): Array<string>{
        return ['class'];
    }

    public constructor() {
        super();
        this.attachShadow({mode: 'open'});
    };

    public static makeItem = (contentItem: ContentItem): NavItem => {
        const navItem = new NavItem();
        navItem.contentItem = contentItem
        navItem.build();
        return navItem;
    };

    private build = (): void => {
        this.buildTemplate(this.contentItem.nav.id, this.contentItem.nav.icon);
        this.attachMarkup();
    };

    private attachMarkup = (): void => {
        this.shadowRoot.innerHTML += `<style>${style}</style>`;
    };

    private buildTemplate = (id: string, icon: string): void => {
        this.shadowRoot.innerHTML += template.replace(
            '{id}', id
        ).replace(
            '{icon}', icon
        );
    };

    public deselect = (): void => {
        this.classList.remove('selected');
        this.contentItem.deselect();
    }

    public select = (): void => {
        this.classList.add('selected');
        this.contentItem.select();
        window.history.pushState({}, 'Home of Hope - ' + this.contentItem.nav.id, location.origin + location.pathname + '#' + this.contentItem.nav.id);
    }

    attributeChangedCallback(name, oldValue, newValue): void {
        if(newValue === 'selected' || oldValue === 'selected' ){
            this.shadowRoot.querySelector('button').classList.toggle('selected');
        }
    }

}

window.customElements.define('nav-item', NavItem);
