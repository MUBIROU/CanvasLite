/******************************************
 * <Public Method>
 *      
 *      
******************************************/

class BitmapButton extends Bitmap {
    constructor(_path) {
        super(_path);

        this.__rect = undefined;
        //this.alpha = 0.1;
        this.addEventListener("load", this.load_this);
    }

    load_this() {
        this.__rect = new Rect(this.x, this.y, this.x + this.width, this.y + this.height);
        this.__rect.lineWidth = 5;
        this.__rect.isFill(true);
        this.__rect.fillColor = "255,255,255";
        this.__rect.alpha = 0.8;
        this.parent.addChild(this.__rect);
    }
}