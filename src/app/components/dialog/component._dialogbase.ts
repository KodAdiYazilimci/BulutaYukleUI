export class BaseDialog {

    constructor() {

    }

    public marginLeft: string = "30%";
    public marginTop: string = "5%";
    public mouseDowned: boolean = false;

    public mouseDown(event: any) {
        this.mouseDowned = true;
    }
    public mouseMove(event: any) {
        if (this.mouseDowned == true) {
            this.marginLeft = event.pageX + "px";
            this.marginTop = event.pageY + "px";
        }
    }
    public mouseUp(event: any) {
        this.mouseDowned = false;
    }
}