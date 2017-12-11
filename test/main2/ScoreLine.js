/***********************************************
 * ScoreLine Class (ver.2017-11-XXTXX:XX)
 * 
 *  <constructor>
 *      new ScoreLine(_canvas)
 * 
 *  <public method>
 *      ScoreLine.addEventListener(_event, _function)   "in" or "out"
 *      ScoreLine.in()
 *      ScoreLine.out()
 *      
 *  <event>
 *      ScoreLine.IN
 *      ScoreLine.OUT
 *
***********************************************/

class ScoreLine { //五線譜の生成
    static get IN() { return "in"; }
    static get OUT() { return "out"; }
    
    constructor(_canvas) {
        this.__canvas = _canvas;

        this.__adjustY = -23;

        this.__inHandler = undefined;
        this.__outHandler = undefined;

        this.__lineAlpha = 0.3;

        //Container
        this.__scoreContainer = new toile.Container();
        this.__scoreContainer.x = this.__canvas.width/2;
        this.__scoreContainer.y = this.__canvas.height/2;
        this.__canvas.addChild(this.__scoreContainer);

        //Line1
        this.__scoreCircle1 = new toile.Circle(0,0,258);
        this.__scoreCircle1.x = -258;
        this.__scoreCircle1.y = -258 + this.__adjustY;
        this.__scoreCircle1.lineWidth = 2;
        this.__scoreCircle1.alpha = 0;
        this.__scoreCircle1.__count = 0;
        this.__scoreContainer.addChild(this.__scoreCircle1);

        //Line2
        this.__scoreCircle2 = new toile.Circle(0,0,264);
        this.__scoreCircle2.x = -264;
        this.__scoreCircle2.y = -264 + this.__adjustY;
        this.__scoreCircle2.lineWidth = 2;
        this.__scoreCircle2.alpha = 0;
        this.__scoreCircle2.__count = -0.25;
        this.__scoreContainer.addChild(this.__scoreCircle2);

        //Line3
        this.__scoreCircle3 = new toile.Circle(0,0,270);
        this.__scoreCircle3.x = -270;
        this.__scoreCircle3.y = -270 + this.__adjustY;
        this.__scoreCircle3.lineWidth = 2;
        this.__scoreCircle3.alpha = 0;
        this.__scoreCircle3.__count = -0.5;
        this.__scoreContainer.addChild(this.__scoreCircle3);

        //Line4
        this.__scoreCircle4 = new toile.Circle(0,0,276);
        this.__scoreCircle4.x = -276;
        this.__scoreCircle4.y = -276 + this.__adjustY;
        this.__scoreCircle4.lineWidth = 2;
        this.__scoreCircle4.alpha = 0;
        this.__scoreCircle4.__count = -0.75;
        this.__scoreContainer.addChild(this.__scoreCircle4);

        //Line5
        this.__scoreCircle5 = new toile.Circle(0,0,282);
        this.__scoreCircle5.x = -282;
        this.__scoreCircle5.y = -282 + this.__adjustY;
        this.__scoreCircle5.lineWidth = 2;
        this.__scoreCircle5.alpha = 0;
        this.__scoreCircle5.__count = -1;
        this.__scoreContainer.addChild(this.__scoreCircle5);
    }

    addEventListener(_event, _function) {
        if (_event == "in") {
            this.__inHandler = _function;
        } else if (_event == "out") {
            this.__outHandler = _function;
        }
    }

    removeEventListener(_event) {
        if (_event == "in") {
            this.__inHandler = undefined;
        } else if (_event == "out") {
            this.__outHandler = undefined;
        }
    }

    in() {
        this.__inLoopID = setInterval(this.__inLoop, 17, this); //≒59fps
    }

    __inLoop(_this) {
        let _speed = 0.03;
        let _alpha = _this.__lineAlpha;
        _this.__scoreCircle1.__count += _speed;
        _this.__scoreCircle2.__count += _speed;
        _this.__scoreCircle3.__count += _speed;
        _this.__scoreCircle4.__count += _speed;
        _this.__scoreCircle5.__count += _speed;
        
        if (_this.__scoreCircle5.__count < _alpha) {
            if (_this.__scoreCircle1.alpha < _alpha) _this.__scoreCircle1.alpha = _this.__scoreCircle1.__count;
            if (_this.__scoreCircle2.alpha < _alpha) _this.__scoreCircle2.alpha = _this.__scoreCircle2.__count;
            if (_this.__scoreCircle3.alpha < _alpha) _this.__scoreCircle3.alpha = _this.__scoreCircle3.__count;
            if (_this.__scoreCircle4.alpha < _alpha) _this.__scoreCircle4.alpha = _this.__scoreCircle4.__count;
            if (_this.__scoreCircle5.alpha < _alpha) _this.__scoreCircle5.alpha = _this.__scoreCircle5.__count;
        } else {
            _this.__scoreCircle1.alpha = _alpha;
            _this.__scoreCircle2.alpha = _alpha;
            _this.__scoreCircle3.alpha = _alpha;
            _this.__scoreCircle4.alpha = _alpha;
            _this.__scoreCircle5.alpha = _alpha;

            clearInterval(_this.__inLoopID);
            _this.__inLoopID = undefined;

            if (_this.__inHandler != undefined) {
                _this.__inHandler(_this); //INイベント発生!!!
            }
        }
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
        _this.__scoreCircle1.__count -= 0.03;
        _this.__scoreCircle2.__count -= 0.03;
        _this.__scoreCircle3.__count -= 0.03;
        _this.__scoreCircle4.__count -= 0.03;
        _this.__scoreCircle5.__count -= 0.03;

        if (_this.__scoreCircle5.__count > 0) {
            if (_this.__scoreCircle1.alpha > 0) _this.__scoreCircle1.alpha = _this.__scoreCircle1.__count;
            if (_this.__scoreCircle2.alpha > 0) _this.__scoreCircle2.alpha = _this.__scoreCircle2.__count;
            if (_this.__scoreCircle3.alpha > 0) _this.__scoreCircle3.alpha = _this.__scoreCircle3.__count;
            if (_this.__scoreCircle4.alpha > 0) _this.__scoreCircle4.alpha = _this.__scoreCircle4.__count;
            if (_this.__scoreCircle5.alpha > 0) _this.__scoreCircle5.alpha = _this.__scoreCircle5.__count;
        } else {
            _this.__scoreCircle1.alpha = 0;
            _this.__scoreCircle2.alpha = 0;
            _this.__scoreCircle3.alpha = 0;
            _this.__scoreCircle4.alpha = 0;
            _this.__scoreCircle5.alpha = 0;

            clearInterval(_this.__inLoopID);
            _this.__inLoopID = undefined;
            _this.delete();
            
            if (_this.__outHandler != undefined) {
                _this.__outHandler(_this); //OUTイベント発生!!!
            }
        }
    }

    delete() {
        this.__canvas.deleteChild(this.__scoreContainer);
        this.__scoreContainer.addChild(this.__scoreCircle1);
        this.__scoreContainer.addChild(this.__scoreCircle2);
        this.__scoreContainer.addChild(this.__scoreCircle3);
        this.__scoreContainer.addChild(this.__scoreCircle4);
        this.__scoreContainer.addChild(this.__scoreCircle5);
    }
}