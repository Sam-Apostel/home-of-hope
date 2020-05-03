import template from './template.html';
import style from './style.scss';
import {InstagramFeed} from "../instagramTile/InstagramTile";

export class ContentItem extends HTMLElement {
    private root: ShadowRoot;

    static get observedAttributes(): Array<string>{
        return ['class'];
    }

    private getAspergerContent = (): HTMLDivElement => {
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

    private getPoemsContent = (): HTMLDivElement => {
        const output = document.createElement('div');
        output.appendChild(InstagramFeed.makeFeed('woord.voor.woord'));
        return output;
    };

    private getArtContent = (): HTMLDivElement => {
        const output = document.createElement('div');
        const images = ['94551839_231033338111000_5024844542109548544_n.jpg', '94440204_245019886905126_6073471776774422528_n.jpg'];
        images.forEach(src => {
            const image = document.createElement('img');
            image.src = `images/${src}`;
            output.appendChild(image);
        });
        return output;
    };

    public constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
    };

    public build = (id: string): void => {
        this.buildTemplate(id);
        this.attachMarkup();
        if(id === 'Asperger'){
            this.addContent(this.getAspergerContent());
        }else if(id === 'Poems'){
            this.addContent(this.getPoemsContent());
        }else if(id === 'Art'){
            this.addContent(this.getArtContent());
        }
    };

    private attachMarkup = (): void => {
        this.root.innerHTML += `<style>${style}</style>`;
        this.root.innerHTML += `<style class="selectedStyle">
                                    :host{
                                        display: none;
                                    }     
                                </style>`;
    };

    private buildTemplate = (id: string): void => {
        this.root.innerHTML += template.replace("{title}", id);
    };

    public addContent = (content): void => {
        this.root.appendChild(content);
    };

    public deselect = (): void => {
        this.classList.remove('selected');
    }

    public select = (): void => {
        this.classList.add('selected');
    }

    attributeChangedCallback(name, oldValue, newValue): void {
        if(newValue === 'selected') {
            this.root.querySelector('.selectedStyle').textContent = `:host{
                                                                                display:block;
                                                                              }`
        }else if(oldValue === 'selected'){
            this.root.querySelector('.selectedStyle').textContent = `:host{
                                                                                display: none;
                                                                              }`
        }
    }

}

window.customElements.define('content-item', ContentItem);
