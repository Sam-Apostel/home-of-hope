export class ImageTile extends HTMLElement {
    public constructor() {
        super();
        this.attachShadow({mode: 'open'});
    };

    public static makeTile = (url: string): ImageTile => {
        const tile = new ImageTile();
        const img = document.createElement('img');
        img.src = url.replace('https://scontent-bru2-1.cdninstagram.com/', 'https://tigrrinsta.b-cdn.net/');
        tile.shadowRoot.appendChild(img);
        const style = document.createElement('style');
        style.innerText = `
            :host{
                margin: 10px;
                padding: 10px 10px 50px;
                background: white;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                width: 300px;
                float: left;
                overflow: hidden;
            }
            img{
               max-width:100%;
            }
            @media (max-width: 500px){
                :host{
                    margin: 10px auto;
                    width: calc(100% - 20px);
                }
            }
        `;
        tile.shadowRoot.appendChild(style);
        return tile;
    };
}

window.customElements.define('image-tile', ImageTile);

export class InstagramFeed extends HTMLElement {
    public constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }
    private url: string;
    private makeImageTile: (url) => ImageTile;

    public static makeFeed = (user: string): InstagramFeed => {
        const feed = new InstagramFeed();
        feed.makeImageTile = ImageTile.makeTile;
        feed.url = `https://www.instagram.com/${user}/?__a=1`;
        fetch(feed.url)
            .then(r => r.json())
            .then(data => {
                data.graphql.user.edge_owner_to_timeline_media.edges.forEach(post => {
                    const urlList = post.node.edge_sidecar_to_children?.edges.map(child => child.node.display_url) ?? [post.node.display_url];
                    urlList.forEach(url => feed.addTile(url));
                });
            });
        return feed;
    };

    private addTile = (url: string): void => {
        this.shadowRoot.appendChild(this.makeImageTile(url));
    };
}

window.customElements.define('instagram-feed', InstagramFeed);
