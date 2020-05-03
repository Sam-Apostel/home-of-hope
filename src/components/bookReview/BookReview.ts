import template from './template.html';
import style from './style.scss';

export class BookReview extends HTMLElement {
    private root: ShadowRoot;

    public constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
    };

    public build = (header: Record<string, string>, body: string): void => {
        this.attachMarkup(this.buildTemplate(header, body));
    };

    private attachMarkup = (content: string): void => {
        this.root.innerHTML = content + `<style>${style}</style>`;
    };

    private buildTemplate = (header: Record<string,string>, body: string): string => {
        const {age, author, awards, genre, published, publisher, rating, title} = header;
        return template.replace(
            "{title}", title
        ).replace(
            '{author}', author
        ).replace(
            '{published}', published
        ).replace(
            '{publisher}', publisher
        ).replace(
            '{genre}', genre
        ).replace(
            '{age}', age
        ).replace(
            '{awards}', awards
        ).replace(
            '{rating}', rating
        ).replace(
            '{body}', body
        );
    };

    public addContent = (content): void => {
        this.root.appendChild(content);
    };

}

window.customElements.define('book-review', BookReview);
