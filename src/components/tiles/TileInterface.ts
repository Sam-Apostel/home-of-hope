interface TileInterface{
	addContent(content: any): void;
}
interface TileFactory{
	makeTile(): TileInterface;
	new ();
}

interface ViewTileInterface extends TileInterface{
	filter(type: any): void;
	addTile(tile: TileInterface): void;
	addTiles(tiles: Array<TileInterface>): void;
}
