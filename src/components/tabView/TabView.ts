import style from './style.scss';
import {ContentItem} from "../contentItem/ContentItem";
import {NavItem} from "../navItem/NavItem";

export class TabView extends HTMLElement {
    private root: ShadowRoot;
    private navItems: Record<string, NavItem> = {};
    private contentItems: Record<string, ContentItem> = {};
    private header: HTMLElement;

    public constructor() {
        super();
        this.attachShadow({mode: 'open'});

    };

    public build = (header: HTMLElement, items: Record<string, string>): void => {
        this.header = header;
        Object.keys(items).forEach(key => {
            const contentItem = new ContentItem();
            const navItem = new NavItem();
            navItem.build(key, items[key], contentItem);
            contentItem.build(key);
            this.navItems[key] = navItem;
            this.contentItems[key] = contentItem;
        });
        this.buildNav();
        this.buildContent();
        this.attachMarkup();

    };

    private buildNav = (): void => {
        const nav = document.createElement('nav');

        this.header.classList.add('header');
        nav.appendChild(this.header);
        Object.values(this.navItems).forEach((navItem: NavItem) => {
            nav.appendChild(navItem);
            navItem.addEventListener('click',()=>{
                this.deselect();
                navItem.select();
            } );
        });
        const navFooter = document.createElement('div');
        navFooter.innerHTML = '<div>© Kim-Sophie Chaidron 2020</div>';
        nav.appendChild(navFooter);
        this.shadowRoot.appendChild(nav);
    };

    private buildContent = (): void => {
        Object.values(this.contentItems).forEach((contentItem: ContentItem) => this.shadowRoot.appendChild(contentItem));
    };

    private attachMarkup = (): void => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        this.shadowRoot.appendChild(styleElement)
    };

    public deselect = (): void => {
        Object.values(this.navItems).forEach( (navItem: NavItem) => navItem.deselect());
    }
}


window.customElements.define('tab-view', TabView);
