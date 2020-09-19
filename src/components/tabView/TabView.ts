import style from './style.scss';
import {ContentItem} from "../contentItem/ContentItem";
import {NavItem} from "../navItem/NavItem";
import {FooterTile} from "../footer/FooterTile";
import {develop} from "../../utils/developer";
import {Router} from "../../utils/router";

export class TabView extends HTMLElement {
    private _root: ShadowRoot;
    private navItems: Record<string, NavItem> = {};
    private contentItems: Record<string, ContentItem> = {};
    private header: HTMLElement;
    private selected: NavItem;
    public footer: FooterTile;
    public body: HTMLElement;
    public router: {  navigate: (string) => void; listen: () => void};

    public constructor() {
        super();
        this._root = this.attachShadow({mode: 'open'});
    }

    public static makeView = (header: HTMLElement, items: Array<Record<string, string>>): TabView => {
        const view = new TabView();
        view.footer = FooterTile.MakeTile();
        view.body = develop('div', 'body', view.footer);
        view.shadowRoot.appendChild(view.body);
        view.build(header, items);

        return view;
    }

    private build = (header: HTMLElement, items: Array<Record<string, string>>): void => {
        this.header = header;
        items.forEach(item => {
            this.contentItems[item.id] = ContentItem.makeItem(item.id, item.icon, item.path);
            this.navItems[item.id] = this.contentItems[item.id].navItem;
        });
        this.buildNav();
        this.attachMarkup();
        const navigator = {
            navigate: (id) => {
                this.select(this.navItems[id]);
            }
        }
        this.router = Router(items, navigator);
    }

    private buildNav = (): void => {
        const nav = document.createElement('nav');

        this.header.classList.add('header');
        nav.appendChild(this.header);
        Object.values(this.navItems).forEach((navItem: NavItem) => {
            nav.appendChild(navItem);
            navItem.addEventListener('click', () => {
                this.router.navigate(navItem.path);
            });
        });
        this._root.appendChild(nav);
    }

    private attachMarkup = (): void => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        this._root.appendChild(styleElement)
    }

    public select = (navItem: NavItem): void => {
        this.deselect();
        this.selected = navItem;
        navItem.select();
        this.body.insertBefore(navItem.contentItem, this.footer);
    }

    public deselect = (): void => {
        if (this.selected) {
            this.selected.deselect();
            this.body.removeChild(this.selected.contentItem);
        }
    }
}


window.customElements.define('tab-view', TabView);
