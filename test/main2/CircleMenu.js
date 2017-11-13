/***********************************************
 * CircleMenu Class (ver.2017-11-XXTXX:XX)
 * 
 *  <constructor>
 *      new CircleMenu(_canvas)
 * 
 *  <public method>
 *      CircleMenu.addEventListener(_event, _function)   "in" or "out"
 *      CircleMenu.in()
 *      CircleMenu.out()
 *      
 *  <event>
 *      CircleMenu.IN
 *      CircleMenu.OUT
 *
***********************************************/

class CircleMenu { //五線譜の生成
    static get IN() { return "in"; }
    static get OUT() { return "out"; }
    
    constructor(_canvas) {
        this.__canvas = _canvas;

        this._cdArray = [];
        for (let i=0; i<12; i++) {
            this.__theCD = new toile.Bitmap("tmp1.png");
            this.__theCD.name = "CD" + (i+1);
            this.__theCD.x = _canvas.width/2 - 50 + 270 * Math.cos(Math.PI/6 * i - Math.PI/2); //半径320（幅）
            this.__theCD.y = _canvas.height/2 - 50 + 270 * Math.sin(Math.PI/6 * i - Math.PI/2); //半径270（高さ）
    
            this.__changeScale(this.__theCD, 1); //Bitmap.scaleでは中心軸がずれるため
    
            this.__theCD.alpha = 0.7;
            this.__canvas.addChild(this.__theCD);
            this._cdArray.push(this.__theCD);
        }
    }

    addEventListener(_event, _function) {
        if (_event == "in") {
            this.__inHandler = _function;
        } else if (_event == "out") {
            this.__outHandler = _function;
        }
    }

    in() {
        //this.__inLoopID = setInterval(this.__inLoop, 17, this); //≒59fps
    }

    __inLoop(_this) {
        clearInterval(_this.__inLoopID);
        _this.__inLoopID = undefined;

        _this.__inHandler(_this); //INイベント発生!!!
    }

    out() {
        this.__scoreCircle1.__count = 0.5;
        this.__scoreCircle2.__count = 0.75;
        this.__scoreCircle3.__count = 1;
        this.__scoreCircle4.__count = 1.25;
        this.__scoreCircle5.__count = 1.5;

        this.__outLoopID = setInterval(this.__outLoop, 17, this); //≒59fps
    }

    __outLoop(_this) {
        // clearInterval(_this.__inLoopID);
        // _this.__inLoopID = undefined;
        // _this.delete();
        // _this.__outHandler(_this); //OUTイベント発生!!!
    }

    delete() {
        // this.__canvas.deleteChild(this.__scoreContainer);
        // this.__scoreContainer.addChild(this.__scoreCircle1);
        // this.__scoreContainer.addChild(this.__scoreCircle2);
        // this.__scoreContainer.addChild(this.__scoreCircle3);
        // this.__scoreContainer.addChild(this.__scoreCircle4);
        // this.__scoreContainer.addChild(this.__scoreCircle5);
    }

    //Bitmap.scaleでは中心軸がずれるため
    __changeScale(_bitmap, _scale, _bitmapWidth=100, _bitmapHeight=100) {
        var _bitmapWidth = 100;
        var _bitmapHeight = 100;
        _bitmap.scale = _scale;
        _bitmap.x = _bitmap.x + (_bitmapWidth - _bitmapWidth * _scale) / 2;
        _bitmap.y = _bitmap.y + (_bitmapHeight - _bitmapHeight * _scale) / 2;
    }
}