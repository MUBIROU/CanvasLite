/**********************************************
 * Grid Class (ver.2017-10-17T16:00)
 * 
 *      <Public Method>
 *          addEventListener(_event, _function)
 *          in(_sec=2)
 *          out(_sec=2)
 *          create()
 *          delete()
 *          removeEventListener(_event)
 *
 *      <Public Property>
 *          lineAlpha
 *          lineColor
 *          lineWidth
 * 
 *      <Event>
 *          IN
 *          OUT
 *
**********************************************/

class Grid {
    static get IN() { return "in"; }
    static get OUT() { return "out"; }

    constructor(_canvas, _numH, _numV) {
        this.__blockNumH = _numH; //分割する数（横方向）
        this.__blockNumV = _numV; //分割する数（縦方向）
        this.__blockWidth = _canvas.width / _numH;
        this.__blockHeight = _canvas.height / _numV;

        this.__canvas = _canvas;
        this.__lineHlist = [];
        this.__lineVlist = [];
        this.__inHandler = undefined;
        this.__outHandler = undefined;

        this.__lineAlpha = 1;
        this.__lineColor = "0,0,0";
        this.__lineWidth = 1;
    }
    
    //=======================================
    // (1) ユーザによるイベントリスナーの定義
    //=======================================
    addEventListener(_event, _function) {
        switch (_event) {
            case "in":
                this.__inHandler = _function;
                break;
            case "out":
                this.__outHandler = _function;
                break;
            default: throw new Error("Grid.addEventListener()");
        }
    }

    //=============================================================
    // (2) ユーザからの「表示（アニメーション）開始」を支持を受ける
    //=============================================================
    in(_sec=2) {
        this.create();

        //横線の長さを0にする（左辺基準）
        var __lineHlistLength = this.__lineHlist.length;
        for (let i=0; i<__lineHlistLength; i++) {
            let _theObject = this.__lineHlist[i];
            _theObject.line.endX = 0;
            _theObject.count = - Math.PI/2 - i*(Math.PI/2)/__lineHlistLength;
        }

        //縦の長さを0にする（底辺基準）
        var __lineVlistLength = this.__lineVlist.length;
        for (let i=0; i<__lineVlistLength; i++) {
            let _theObject = this.__lineVlist[i];
            _theObject.line.startY = _theObject.line.endY;
            _theObject.count = Math.PI + i*(Math.PI/2)/__lineVlistLength;
        }

        //アニメーション速度（初期値2秒）
        let _lastCount = - Math.PI/2 - (__lineHlistLength-1)*(Math.PI/2)/__lineHlistLength;
        this.__speed = - _lastCount/_sec/(1000/17);

        this.__inLoopID = setInterval(this.__inLoop, 17, this); //≒58.8fps
    }

    //=====================
    // (3) Line群を生成する
    //=====================
    create() {
        //Line Horizontal
        for (let i=1; i<this.__blockNumV; i++) {
            let _theObject = new Object();
            let _theLine = new toile.Line(0, this.__blockHeight*i, this.__canvas.width, this.__blockHeight*i);
            _theLine.lineAlpha = this.__lineAlpha;
            _theLine.lineColor = this.__lineColor;
            _theLine.lineWidth = this.__lineWidth;
            _theObject.line = _theLine;
            _theObject.count = 0;
            this.__lineHlist.push(_theObject);
            this.__canvas.addChild(_theLine);
        }

        //Line Vertical
        for (let i=this.__blockNumH-1; i>0; i--) {
            let _theObject = new Object();
            let _theLine = new toile.Line(this.__blockWidth*i, 0, this.__blockWidth*i, this.__canvas.height);
            _theLine.lineAlpha = this.__lineAlpha;
            _theLine.lineColor = this.__lineColor;
            _theLine.lineWidth = this.__lineWidth;
            _theObject.line = _theLine;
            _theObject.count = 0;
            _theObject.name = "v" + i; //__inLoop()で利用
            this.__lineVlist.push(_theObject);
            this.__canvas.addChild(_theLine);
        }
    }

    //=================================================================
    // (4) Line群を左＆下から登場させる（登場完了後「in」イベント発生）
    //=================================================================
    __inLoop(_this) {
        //横線の長さを伸ばす
        _this.__lineHlist.forEach(function(_theObject) {
            _theObject.count += _this.__speed; //値が大きいと横方向に高速化（初期値約0.025）
            if (_theObject.line.endX < _this.__canvas.width - 1) {
                _theObject.line.endX = _this.__canvas.width * Math.cos(_theObject.count);
            } else {
                _theObject.line.endX = _this.__canvas.width; 
            }
        });

        //縦線の長さを伸ばす
        _this.__lineVlist.forEach(function(_theObject) {
            _theObject.count += _this.__speed; //値が大きいと縦方向に高速化（初期値約0.025）
            if (_theObject.line.startY > 1) {
                _theObject.line.startY = _this.__canvas.height - _this.__canvas.height * Math.cos(_theObject.count)
            } else {
                _theObject.line.startY = 0;
                //最後の縦の線が表示し終わったら...
                if (_theObject.name == "v" + _this.__lineVlist.length) {
                    _this.__inHandler(_this); //in()の終了イベント発生
                }
            }
        });
    }

    //======================================================================
    // (5) イベントリスナーの削除（「in」および最後に「out」イベントの削除）
    //======================================================================
    removeEventListener(_event) {
        switch (_event) {
            case "in":
                this.__inHandler = undefined;
                clearInterval(this.__inLoopID);
                break;
            case "out":
                this.__outHandler = undefined;
                clearInterval(this.__outLoopID);
                break;
            default: throw new Error("Grid.removeEventListener()");
        }
    }

    //=======================================
    // (6) Line群を消去（アニメーション）開始
    //=======================================
    out(_sec=2) {
        //横線の長さを0にする（左辺基準）
        var __lineHlistLength = this.__lineHlist.length;
        for (let i=0; i<__lineHlistLength; i++) {
            let _theObject = this.__lineHlist[i];
            _theObject.count = - i*(Math.PI/2)/__lineHlistLength;
        }

        //縦の長さを0にする（底辺基準）
        var __lineVlistLength = this.__lineVlist.length;
        for (let i=0; i<__lineVlistLength; i++) {
            let _theObject = this.__lineVlist[i];
            _theObject.count = 3*Math.PI/2 + i*(Math.PI/2)/__lineVlistLength;
        }

        //アニメーション速度（初期値2秒）
        let _lastCount = - (__lineHlistLength-1)*(Math.PI/2)/__lineHlistLength;
        this.__speed = - _lastCount/_sec/(1000/17);

        this.__outLoopID = setInterval(this.__outLoop, 17, this); //≒58.8fps
    }

    //============================================================
    // (7) Line群を右＆上へ消していく（消去後「out」イベント発生）
    //============================================================
    __outLoop(_this) {
        //横線の長さを縮める
        _this.__lineHlist.forEach(function(_theObject) {
            _theObject.count += _this.__speed; //値が大きいと横方向に高速化（初期値約0.024）
            if (_theObject.line.startX < _this.__canvas.width - 1) {
                    _theObject.line.startX = _this.__canvas.width * Math.sin(_theObject.count);
            } else {
                _theObject.line.startX = _this.__canvas.width; 
            }
        });

        //縦線の長さを縮める
        _this.__lineVlist.forEach(function(_theObject) {
            _theObject.count += _this.__speed; //値が大きいと縦方向に高速化（初期値約0.024）
            if (_theObject.line.endY > 1) {
                _theObject.line.endY = _this.__canvas.height - _this.__canvas.height * Math.sin(_theObject.count)
            } else {
                _theObject.line.endY = 0;
                //最後の縦の線が表示し終わったら...
                if (_theObject.name == "v" + _this.__lineVlist.length) {
                    _this.__outHandler(_this); //in()の終了イベント発生
                    _this.delete(); //全てのLineインスタンスを削除
                }
            }
        });
    }

    //===============================
    // (8) Line群をメモリ上からも消去
    //===============================
    delete() {
        for (let i=0; i<this.__lineHlist.length; i++) {
            this.__canvas.deleteChild(this.__lineHlist[i].line);
        }

        for (let i=0; i<this.__lineVlist.length; i++) {
            this.__canvas.deleteChild(this.__lineVlist[i].line);
        }

        this.__lineHlist = [];
        this.__lineVlist = [];
    }

    //===============
    // 公開プロパティ
    //===============
    get lineAlpha() { return this.__lineAlpha; } //初期値 1
    set lineAlpha(_newValue) {
        this.__lineAlpha = _newValue;
        for (let i=0; i<this.__lineHlist.length; i++) {
            this.__lineHlist[i].line.lineAlpha = _newValue;
        }
        for (let i=0; i<this.__lineVlist.length; i++) {
            this.__lineVlist[i].line.lineAlpha = _newValue;
        }
    }

    get lineColor() { return this.__lineColor; } //初期値 "0,0,0"
    set lineColor(_newValue) { //引数例 "255,204,0"
        this.__lineColor = _newValue;
        for (let i=0; i<this.__lineHlist.length; i++) {
            this.__lineHlist[i].line.lineColor = _newValue;
        }
        for (let i=0; i<this.__lineVlist.length; i++) {
            this.__lineVlist[i].line.lineColor = _newValue;
        }
    }

    get lineWidth() { return this.__lineWidth; } //初期値 1
    set lineWidth(_newValue) { //引数例 "255,204,0"
        this.__lineWidth = _newValue;
        for (let i=0; i<this.__lineHlist.length; i++) {
            this.__lineHlist[i].line.lineWidth = _newValue;
        }
        for (let i=0; i<this.__lineVlist.length; i++) {
            this.__lineVlist[i].line.lineWidth = _newValue;
        }
    }
}