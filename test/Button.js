/******************************************
 * <Public Method>
 *      
 *      
******************************************/

class Button {
    constructor(_canvas, _x=0, _y=0, _width=100, _height=100) {
        this.__canvas = _canvas;
        this.__x = _x;
        this.__y = _y;
        this.__width = _width;
        this.__height = _height;

        this.__rect = new Rect(this.__x, this.__y, this.__x + this.__width, this.__y + this.__height);
        this.__rect.lineWidth = 5;
        this.__rect.isFill(true);
        this.__rect.fillColor = "255,255,255";
        this.__rect.alpha = 0.8;
        this.__canvas.addChild(this.__rect);
    }
}