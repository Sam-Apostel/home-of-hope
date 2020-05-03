export class ImageTile extends HTMLElement {
    public constructor() {
        super();
        this.attachShadow({mode: 'open'});
    };

    public static makeTile = (url: string): ImageTile => {
        const tile = new ImageTile();
        const img = document.createElement('img');
        img.src = url;
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
                height: 378px;
                overflow: hidden;
            }
            img{
               min-width: 100%;
               max-height: 100%;
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

    public static makeFeed = (user: string): InstagramFeed => {
        const feed = new InstagramFeed();
        fetch(`https://www.instagram.com/${user}/?__a=1`)
            .then(r => r.json())
            .then(data => {
                data.graphql.user.edge_owner_to_timeline_media.edges.forEach(post => {
                    const urlList = post.node.edge_sidecar_to_children?.edges.map(child => child.node.display_url) ?? [post.node.display_url];
                    urlList.forEach(url => feed.addTile(ImageTile.makeTile(url)));
                });
            });
        return feed;
    };

    private addTile = (tile: ImageTile): void => {
        this.shadowRoot.appendChild(tile);
    };
}

window.customElements.define('instagram-feed', InstagramFeed);
