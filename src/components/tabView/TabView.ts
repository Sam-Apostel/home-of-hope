import style from './style.scss';
import {ContentItem} from "../contentItem/ContentItem";
import {NavItem} from "../navItem/NavItem";

export class TabView extends HTMLElement {
    private _root: ShadowRoot;
    private navItems: Record<string, NavItem> = {};
    private contentItems: Record<string, ContentItem> = {};
    private header: HTMLElement;

    public constructor() {
        super();
        this._root = this.attachShadow({mode: 'open'});
    };

    public static makeView = (header: HTMLElement, items: Array<Record<string, string>>): TabView => {
        const view = new TabView();
        view.build(header, items);
        return view;
    };

    private build = (header: HTMLElement, items: Array<Record<string, string>>): void => {
        this.header = header;
        items.forEach(item => {
            this.contentItems[item.id] = ContentItem.makeItem(item.id, item.icon);
            this.navItems[item.id] = this.contentItems[item.id].navItem;
        });
        this.buildNav();
        this.buildContent();
        this.attachMarkup();

        const urlAttr = location.hash.substr(1);
        if(urlAttr !== ''){
            const urlSections = urlAttr.split('?');
            this.navItems[urlSections[0]].select(urlSections[1]);
        }else {
            this.navItems[items[4].id].select();
        }
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
        this._root.appendChild(nav);
    };

    private buildContent = (): void => {
        Object.values(this.contentItems).forEach((contentItem: ContentItem) => this._root.appendChild(contentItem));
    };

    private attachMarkup = (): void => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        this._root.appendChild(styleElement)
    };

    public deselect = (): void => {
        Object.values(this.navItems).forEach( (navItem: NavItem) => navItem.deselect());
    }
}


window.customElements.define('tab-view', TabView);
