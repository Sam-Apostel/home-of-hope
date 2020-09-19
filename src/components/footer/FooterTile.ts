import style from './style.scss';
import { develop } from '../../utils/developer';

export class FooterTile extends HTMLElement{
    public constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    public static MakeTile = (): FooterTile => {
        const tile = new FooterTile();
        [
            develop('address', 'contact', [
                develop('b', 'title', 'Contacteer ons'),
                develop('a', 'mail', 'sam@apostel.be', {href: 'mailto:sam@apostel.be'}),
                develop('a', 'phone', '0470952272', {href: 'tel:0032470952272'}),
                develop('span', 'street', 'Dirkputstraat 172'),
                develop('span', 'city', '2850 Boom'),
                develop('span', 'country', 'Belgium'),
            ]),
            develop('div', 'legal', [
                develop('b', 'title', 'Verdere informatie'),
                develop('a', 'privacy', 'Privacy policy', {href: './legal/privacypolicy', target: '_blank'}),
                develop('a', 'terms', 'Terms and conditions', {href: './legal/termsandconditions', target: '_blank'}),
                develop('span', 'btw', 'BE0735433115'),
                develop('span', 'copyright', '© Kim-Sophie Chaidron 2020'),
            ]),
            develop('div', 'social', [
                develop('b', 'title', 'Sociale media'),
                develop('a', 'gg-instagram','@woord.voor.woord', {href: 'https://www.instagram.com/woord.voor.woord/', target: '_blank'}),
                develop('a', 'gg-instagram','@poemesparkimsy', {href: 'https://www.instagram.com/poemesparkimsy/', target: '_blank'}),
                develop('a', 'gg-facebook','Kimsy-poëzie', {href: 'https://www.facebook.com/Kimsy-poëzie-102454364905557', target: '_blank'}),
            ]),
        ].forEach(element => tile.shadowRoot.appendChild(element));
        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        tile.shadowRoot.appendChild(styleElement);
        return tile;
    };

}

window.customElements.define('footer-tile', FooterTile);
