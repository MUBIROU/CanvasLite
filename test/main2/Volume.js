/***********************************************
 * Volume Class (ver.2017-12-19TXX:XX)
***********************************************/

class Volume {
    static get CHANGE() { return "change"}

    constructor(_canvas) {
        this.__canvas = _canvas;
        this.__canvas.__this = this;
        this.__mouseX = this.__mouseY = 0;
        this.__isMoveHandle = false;
        this.__changeHandler = undefined;
        this.__volume = 20;
        this.__oldVolume = 20;

        this.__objList = []
        this.__alpha = 1;

        _canvas.addEventListener("mousemove", this.mousemove_canvas);

        //=================
        // volume bar
        //=================
        this.__volumeBar = new toile.Bitmap("volumeBar.png");
        this.__volumeBar.x = 47;
        this.__volumeBar.y = 403;
        _canvas.addChild(this.__volumeBar);
        this.__objList.push(this.__volumeBar);

        //=====================
        // handle(Bitmap class)
        //=====================
        this.__handle = new toile.SpriteSheet("handle.png");
        this.__handle.addEventListener("load", this.load_handle);
        _canvas.addChild(this.__handle);
        this.__handle.x = 50 - 20;
        this.__handle.y = 685 - this.__volume*3; //520; //this.__bar.y; //  - 20;
        this.__handle.addEventListener("mousedown", this.mousedown_handle, this);
        this.__handle.addEventListener("mouseup", this.mouseup_handle);
        this.__handle.addEventListener("mouseupoutside", this.mouseup_handle);
        this.__handle.__this = this;
        this.__isMoveHandle = false;
        this.__objList.push(this.__handle);

        //=====================
        // 0-255(Text class)
        //=====================
        this.__text = new toile.Text("20");
        this.__text.x = this.__handle.x + 55;
        this.__text.y = this.__handle.y + 12 + 5;
        //this.__text.align = "center";
        //this.__text.baseline = "center";
        this.__text.addWebFont("font01", "LCDPHONE.TTF", "truetype");
        this.__text.font =  "font01";
        this.__text.size = 20;
        this.__text.color = "#ffffff";
        this.__text.alpha = 2;
        _canvas.addChild(this.__text);
        this.__objList.push(this.__text);
    }

    load_handle(_spriteSheet) {
        _spriteSheet.gotoAndStop(2);
    }

    //======================
    //イベントリスナーの定義
    //======================
    addEventListener(_event, _function) {
        if (_event == "change") {
            this.__changeHandler = _function;
        }
    }

    //==========
    // アクセサ
    //==========
    get volume() {
        return this.__volume;
    }
    set vokume(newValue) {
        this.__volume = newValue;
    }

    __timerLoop(_this) {
        var _result = undefined;

        //barの高さ200、y位置410、handleの直径50の場合
        if ((410 <= _this.__mouseY) && (_this.__mouseY <= 710)) { //範囲内の場合
            //console.log(_this.__mouseY);
            if ((637 <= _this.__mouseY) && (_this.__mouseY <= 663)) {
                _this.__handle.y = 650 - 25; //ボリューム20
            } else if ((547 <= _this.__mouseY) && (_this.__mouseY <= 573)) {
                _this.__handle.y = 560 - 25; //ボリューム50
            } else {
                _this.__handle.y = _this.__mouseY - 25;
            }

        } else if (_this.__mouseY < 410) {
            _this.__handle.y = 410 - 25;
        } else if (710 < _this.__mouseY) {
            _this.__handle.y = 710 - 25;
        }
        
        _this.__oldVolume = _this.__volume;
        _this.__volume = Math.round((685 - _this.__handle.y)/3);
        if (_this.__oldVolume != _this.__volume) {
            _this.__changeHandler(_this);
            //console.log(_this.__volume);
            _this.__text.text = _this.__volume;
        }

        switch (true) {
            case (_this.__handle.y == 710-25):
                _this.__handle.gotoAndStop(1);
                break;
            case (650 - 25 <= _this.__handle.y):
                _this.__handle.gotoAndStop(2);
                break;
            case (560 - 25 <= _this.__handle.y):
                _this.__handle.gotoAndStop(3);
                break;
            case (410 - 25 <= _this.__handle.y):
                _this.__handle.gotoAndStop(4);
                break;
        }

        _this.__text.y = _this.__handle.y + 17;
    }

    mousemove_canvas(_canvas) { //this == Canvas
        var _this = _canvas.__this;
        _this.__mouseX = _canvas.mouseX;
        _this.__mouseY = _canvas.mouseY;
        //_this.__handle.y = _this.__mouseY - 20;
    }

    mousedown_handle(_bitmap) { //this == Bitmap
        var _this = _bitmap.__this;
        var _canvas = _this.__canvas;

        _canvas.enabledMouseMove(true);
        _this.__mouseX = _canvas.mouseX;
        _this.__mouseY = _canvas.mouseY;
        _this.__isMoveHandle = true;

        _this.__timerLoopID = setInterval(_this.__timerLoop, 17, _this);
    }

    mouseup_handle(_bitmap) {
        var _this = _bitmap.__this;
        var _canvas = _this.__canvas;

        _canvas.enabledMouseMove(false);
        _this.__isMoveHandle = false;

        clearInterval(_this.__timerLoopID);
    }

    set alpha(newValue) {
        this.__alpha = newValue;
        this.__objList.forEach(function(_obj) {
            _obj.alpha = newValue;
        });
    }

    get alpha() {
        return this.__alpha;
    }
}