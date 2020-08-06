import style from './style.scss';
import {
    InstagramFeed, NavItem, ShopTile} from './../components';

export class ContentItem extends HTMLElement {
    private _nav: Record<string, string>;
    private _root: ShadowRoot;

    static get observedAttributes(): Array<string>{
        return ['class'];
    }

    private _getHomeContent = (): HTMLDivElement => {
      const output = document.createElement('div');
      const paragraph = document.createElement('p');
      const title = document.createElement('h2');
      title.innerText = `Hoopvol thuiskomen`;
      paragraph.innerText = `Home of Hope. Een plaats waar je uitgenodigd wordt om thuis te komen. Dat in een dromerige sfeer vol met hoop. Een plaats waar ik mijn verhaal vertel en jou uitnodig om mee te komen op mijn reis.  Mijn verhaal in woorden, gedichten en schilderingen. Vertel jij jouw verhaal aan mij?`;
      output.appendChild(title);
      output.appendChild(paragraph);
      return output;
    };

    private _getAspergerContent = (): HTMLDivElement => {
        const output = document.createElement('div');
        const title = document.createElement('h3');
        const body = document.createElement('p');

        const quotes = [
            'Hopelijk beseffen mensen hoe moeilijk leven met autisme kan zijn.',
            'Structuur biedt een houvast.',
        ];

        const blockQuotes = quotes.map(quote => {
            const bq = document.createElement('blockquote');
            bq.innerText = quote;
            return bq;
        });

        title.innerText = 'Schrijfsel van een aspie in lockdown';
        body.appendChild(document.createTextNode('Mensen die lijden aan het syndroom van Asperger, of aan een vorm van autisme in het algemeen, hebben erg veel nood aan structuur. Deze structuur kan zich op verscheidene manieren aanbieden. Zo kunnen ze uitblinken in het maken van Samenvattingen, van PowerPoints, en kortom van alles wat met structuur in een opleiding te maken heeft.'));
        body.appendChild(document.createElement('br'));

        body.appendChild(document.createElement('br'));
        body.appendChild(document.createTextNode('Echter, het gaat nog veel verder dan dat. Mensen die lijden aan autisme ervaren een grote wanhoop wanneer er enigszins structuur ontbreekt in het enge begrip dat ons bestaan is. Het hebben van een structuur biedt een zekere houvast. Deze houvast zal altijd een vorm van zekerheid met zich meebrengen. Vaak kan het voelen alsof structuur de enige zekerheid is in ons vluchtige bestaan. Structuur wordt al van kleins af aan aangebracht.'));
        body.appendChild(document.createElement('br'));
        body.appendChild(blockQuotes[1]);
        body.appendChild(document.createElement('br'));
        body.appendChild(document.createTextNode('Wat zou je doen als een erg virus plots de hele wereld, alsook de jouwe, op zijn kop zet? Wat zou je doen als daardoor plots de structuur - die net zo belangrijk voor jou is - volledig in stukjes breekt? Wat zou je doen als er van de ene op de andere dag plots aan structuur ontbreekt? Ga je je leven On hold zetten en hopen dat deze bui gauw overwaait? Of ga je zelf uit deze oneindig lijkende kuil proberen te klauteren en het heft in eigen handen nemen?'));
        body.appendChild(document.createElement('br'));
        body.appendChild(document.createElement('br'));
        body.appendChild(document.createTextNode('Het kan vreselijk eng zijn om plots niet meer elke dag naar een schoolinstelling of naar je werk te hoeven gaan. Het kan vreselijk eng zijn om niet meer dagdagelijks dat bekende gezicht van je vriend(in), leerkracht of collega te zien. Uiteindelijk is het voor ons eigen goed, uit dat idee put je moed. Je probeert als aspie zo goed als mogelijk zelf je leven inrichting en structuur te geven. Je probeert zo goed als mogelijk in te spelen op deze veranderde omstandigheden. Je probeert elke dag weer zo goed als mogelijk te leven met autisme in lockdown.'));
        body.appendChild(document.createElement('br'));
        body.appendChild(blockQuotes[0]);
        body.appendChild(document.createElement('br'));
        body.appendChild(document.createTextNode('Een pretje is het alleszins niet. Zo vaak wordt autisme als een scheldwoord gebruikt. Dat doet enorm pijn. Hopelijk kan iedereen beseffen hoe moeilijk leven met autisme kan zijn. Maar vooral, hopelijk kan iedereen wat leren van de mooie aspecten van een persoon die lijdt aan autisme. Structuur. Creativiteit. Eerlijkheid. Oog voor details. En zoveel meer schuilt er achter hun façade. Geef hen een kans en leer van elkaar. De wereld is al zo’n wrede plaats. Laten we lief zijn en elkaar eindelijk accepteren.'));
        output.appendChild(title);
        output.appendChild(body);
        return output;
    };

    private _getPoemsContent = (): HTMLDivElement => {
        const output = document.createElement('div');
        output.appendChild(InstagramFeed.makeFeed('woord.voor.woord'));
        return output;
    };

    private _getArtContent = (): HTMLDivElement => {
        const output = document.createElement('div');
        const images = ['94551839_231033338111000_5024844542109548544_n.jpg', '94440204_245019886905126_6073471776774422528_n.jpg'];
        images.forEach(src => {
            const image = document.createElement('img');
            image.src = `https://tigrr.b-cdn.net/images/${src}`;
            output.appendChild(image);
        });
        return output;
    };

    private _getShopContent = (): ShopTile => {
        const source = {
            categories: [
                {
                    name: 'Wenskaarten',
                    id: 0,
                    description: '',
                    items: [
                        {
                            id: 0,
                            name: 'Dankbaar',
                            images: ['dankbaar'],
                            price: 1.40,
                            description: ''
                        },{
                            id: 1,
                            name: 'Van jou',
                            images: ['vanjou'],
                            price: 1.40,
                            description: ''
                        },{
                            id: 2,
                            name: 'Thuis',
                            images: ['thuis'],
                            price: 1.40,
                            description: ''
                        },{
                            id: 3,
                            name: 'Wolf',
                            images: ['wolf'],
                            price: 1.40,
                            description: ''
                        },{
                            id: 4,
                            name: 'Honing & vanille',
                            images: ['honingenvanille'],
                            price: 1.40,
                            description: ''
                        }
                    ]
                },{
                    name: 'Boeken',
                    id: 1,
                    description: '',
                    items: [
                        {
                            id: 0,
                            name: 'Puzzle Pieces',
                            images: ['puzzlepieces'],
                            price: 19.99,
                            description: ''
                        }
                    ]
                }
            ]
        };
        return ShopTile.MakeTile(source);
    }

    public constructor() {
        super();
        this._root = this.attachShadow({mode: 'open'});
    };

    public static makeItem = (id: string, icon: string): ContentItem => {
        const contentItem = new ContentItem();
        contentItem._nav = {icon, id};
        contentItem._build(id);
        return contentItem;
    };
    get navItem(): NavItem{
        return NavItem.makeItem(this);
    }
    get nav(): Record<string, string>{
        return this._nav;
    }

    private _build = (id: string): void => {
        this.attachMarkup();
        if(id === 'Asperger'){
            this.addContent(this._getAspergerContent());
        }else if(id === 'Poems'){
            this.addContent(this._getPoemsContent());
        }else if(id === 'Art'){
            this.addContent(this._getArtContent());
        }else if(id === 'Webshop' ){
            this.addContent(this._getShopContent());
        }else if(id === 'Home'){
            this.addContent(this._getHomeContent());
        }
    };

    private attachMarkup = (): void => {
        this._root.innerHTML += `<style>${style}</style>`;
        this._root.innerHTML += `<style class="selectedStyle">
                                    :host{
                                        display: none;
                                    }     
                                </style>`;
    };

    public addContent = (content): void => {
        this._root.appendChild(content);
    };

    public deselect = (): void => {
        this.classList.remove('selected');
    }

    public select = (): void => {
        this.classList.add('selected');
    }

    attributeChangedCallback(name, oldValue, newValue): void {
        if(newValue === 'selected') {
            this._root.querySelector('.selectedStyle').textContent = `:host{
                                                                                display:block;
                                                                              }`
        }else if(oldValue === 'selected'){
            this._root.querySelector('.selectedStyle').textContent = `:host{
                                                                                display: none;
                                                                             }`
        }
    }

}

window.customElements.define('content-item', ContentItem);
