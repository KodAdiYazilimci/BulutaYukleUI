export class ContextMenuItemModel {
    index: number;
    text: string;
    logo: string;
    splitted: boolean;

    public getStyleClass(): string {
        return this.splitted ? "contextMenuLine splitterBottom" : "contextMenuLine";
    }
}