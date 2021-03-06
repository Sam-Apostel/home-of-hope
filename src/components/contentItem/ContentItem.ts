import style from './style.scss';
import {
    InstagramFeed, NavItem, ShopTile} from './../components';
import {ReviewTile} from "../ReviewTile/ReviewTile";
import {ModalTile} from "../ModalTile/ModalTile";

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
    }

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
        body.appendChild(document.createTextNode('Mensen die lijden aan het syndroom van Asperger, of aan een vorm van autisme in het algemeen, hebben erg veel nood aan structuur. Deze structuur kan zich op verscheidene manieren aanbieden. Zo kunnen ze uitblinken in het maken van samenvattingen, van PowerPoints, en kortom van alles wat met structuur in een opleiding te maken heeft.'));
        body.appendChild(document.createElement('br'));

        body.appendChild(document.createElement('br'));
        body.appendChild(document.createTextNode('Echter, het gaat nog veel verder dan dat. Mensen die lijden aan autisme ervaren een grote wanhoop wanneer er enigszins structuur ontbreekt in het enge begrip dat ons bestaan is. Het hebben van een structuur biedt een zekere houvast. Deze houvast zal altijd een vorm van zekerheid met zich meebrengen. Vaak kan het voelen alsof structuur de enige zekerheid is in ons vluchtige bestaan. Structuur wordt al van kleins af aan aangebracht.'));
        body.appendChild(document.createElement('br'));
        body.appendChild(blockQuotes[1]);
        body.appendChild(document.createElement('br'));
        body.appendChild(document.createTextNode('Wat zou je doen als een erg virus plots de hele wereld, alsook de jouwe, op zijn kop zet? Wat zou je doen als daardoor plots de structuur - die net zo belangrijk voor jou is - volledig in stukjes breekt? Wat zou je doen als er van de ene op de andere dag plots aan structuur ontbreekt? Ga je je leven on hold zetten en hopen dat deze bui gauw overwaait? Of ga je zelf uit deze oneindig lijkende kuil proberen te klauteren en het heft in eigen handen nemen?'));
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
    }

    private _getPoemsContent = (): HTMLDivElement => {
        const output = document.createElement('div');
        output.appendChild(InstagramFeed.makeFeed('woord.voor.woord'));
        return output;
    }

    private _getArtContent = (): HTMLDivElement => {
        const output = document.createElement('div');
        const images = ['94551839_231033338111000_5024844542109548544_n.jpg', '94440204_245019886905126_6073471776774422528_n.jpg'];
        images.forEach(src => {
            const image = document.createElement('img');
            image.src = `/images/${src}`;
            output.appendChild(image);
        });
        return output;
    }

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
                            images: ['dankbaar', 'dankbaar'],
                            price: 1.45,
                            description: 'Deze wenskaart schreef ik voor mijn vriendje, die de wereld voor mij interpreteert.'
                        },{
                            id: 1,
                            name: 'Van jou',
                            images: ['vanjou', 'vanjou'],
                            price: 1.45,
                            description: 'Deze wenskaart schreef ik voor al de verliefde stelletjes.'
                        },{
                            id: 2,
                            name: 'Thuis',
                            images: ['thuis', 'thuis'],
                            price: 1.45,
                            description: 'Want liefde voelt als thuiskomen, wanneer je de juiste persoon vindt.'
                        },{
                            id: 3,
                            name: 'Wolf',
                            images: ['wolf', 'wolf'],
                            price: 1.45,
                            description: 'Deze wenskaart geeft steun en motivatie aan sterke personen.'
                        },{
                            id: 4,
                            name: 'Honing & vanille',
                            images: ['honingenvanille', 'honingenvanille'],
                            price: 1.45,
                            description: 'Liefde is zo zoet als honing en vanille. Voor mij is hij dat ook.'
                        },{
                            id: 5,
                            name: 'Kaartje op aanvraag',
                            images: ['mama', 'mama'],
                            price: 1.65,
                            description: 'Wil je een ander gedichtje van mij op een kaartje? Vertel me welk gedicht en ik ontwerp het speciaal voor jou!',
                            custom: true
                        }/*,{
                            id: 5,
                            name: 'Wenskaarten bundel',
                            images: ['bundle'],
                            price: 6.5,
                            type: 'bundle',
                            description: ''
                        },{
                            id: 6,
                            name: 'persoonlijke Wenskaart',
                            images: ['persoonlijk'],
                            price: 1.5,
                            type: 'personal',
                            description: ''
                        },{
                            id: 7,
                            name: 'cadeau Wenskaart',
                            images: ['persoonlijk'],
                            price: 1.5,
                            type: 'personal',
                            description: ''
                        }*/
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
                            price: 12,
                            description: 'Deze gedichtenbundel is de vrucht van mijn bestaan. Ik pende mijn gevoelens en gedachten neer voor al wie zich in mijn woorden kan vinden. Voor mijn vriend, mijn gezin en voor mijzelf.'
                        }
                    ]
                }
            ]
        };
        return ShopTile.MakeTile(source);
    }

    private _getReviewContent = (): ReviewTile => {
        const reviews = [
            {
                name: 'Sam Apostel',
                rating: 5,
                review: 'Hele mooie hoge kwaliteit kaartjes'
            },{
                name: 'Sam Apostel',
                rating: 5,
                review: 'Hele mooie hoge kwaliteit kaartjes'
            },{
                name: 'Sam Apostel',
                rating: 5,
                review: 'Hele mooie hoge kwaliteit kaartjes'
            }
        ];
        return ReviewTile.MakeTile(reviews);
    }

    public constructor() {
        super();
        this._root = this.attachShadow({mode: 'open'});
    }

    public static makeItem = (id: string, icon: string, path: string): ContentItem => {
        const contentItem = new ContentItem();
        contentItem._nav = {icon, id, path};
        contentItem._build(id);
        return contentItem;
    }

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
         //   this.addContent(this._getReviewContent());
            const modal = ModalTile.MakeTile()
            this.addContent(modal);
            this.addEventListener('openModal', (e: CustomEvent) => modal.open(e.detail));
            this.addEventListener('closeModal', () => modal.close());
        }else if(id === 'Home'){
            this.addContent(this._getHomeContent());
        }
    }

    private attachMarkup = (): void => {
        this._root.innerHTML += `<style>${style}</style>`;
    }

    public addContent = (content: HTMLElement): void => {
        this._root.appendChild(content);
    }

}

window.customElements.define('content-item', ContentItem);
