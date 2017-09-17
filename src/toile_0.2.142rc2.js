/***************************************************************************
 * toile.js (ver.0.2 build 142 RC2)
 * 2017-09-17T10:02
 * © 2017 Takashi Nishimura
 ***************************************************************************/

if (toile != window) { //名前空間を省略可能にするために
    var toile = {}; //namescape(省略をしない前提であればconstにします)
}

/***************************************************************************
 * Canvas Class
 *
 *	<Public Method>
 * 		addChild(_superDisplay)
 * 		addEventListener(_event, _function)
 * 		deleteChild(_superDisplay)
 * 		drawScreen(_color="#ffffff")
 * 		enabledContextMenu(_bool)
 * 		enabledMouseMove(_bool)
 * 		exitFullscreen()
 * 		getDepthElement(_depth)
 * 		getDepthIndex(_superDisplay)
 * 		getDepthMax()
 * 		isBorder()
 * 		isFitWindow(_boolean)
 * 		removeEventListener(_event)
 * 		reload()
 * 		requestFullscreen()
 * 		screenShot(_startX=0, _startY=0, _endX=undefined, _endY=undefined)
 * 		setDepthIndex(_superDisplay, _depth)
 * 		stopMouseDownEvent()
 * 		stopMouseUpEvent()
 *
 * 	<Public Property>
 * 		borderColor
 * 		borderWidth
 * 		context2D
 * 		correctFPS
 * 		cursor
 * 		fps
 * 		height
 * 		mouseX
 * 		mouseY
 * 		perspective
 * 		rotateX
 * 		rotateY
 * 		width
 *
 * 	<Event>
 * 		ENTER_FRAME
 * 		KEY_DOWN
 * 		KEY_UP
 * 		MOUSE_DOWN
 * 		MOUSE_MOVE
 * 		MOUSE_UP
 *
 ***************************************************************************/

toile.AbstractCanvas =
    class AbstractCanvas { //for observer pattern
        addChild(_superDisplay) {
            throw new Error("must be implemented in the subclass");
        }
        deleteChild(_superDisplay) {
            throw new Error("must be implemented in the subclass");
        }
        drawScreen(_color) {
            throw new Error("must be implemented in the subclass");
        }
    };

toile.Canvas =
    class Canvas extends toile.AbstractCanvas { //Contener（委譲）を利用
        //static constant
        static get ENTER_FRAME() { return "enterframe"; }
        static get KEY_DOWN() { return "keydown"; }
        static get KEY_UP() { return "keyup"; }
        static get MOUSE_DOWN() { return "mousedown"; }
        static get MOUSE_MOVE() { return "mousemove"; }
        static get MOUSE_UP() { return "mouseup"; }

        constructor(_id_or_width, _height = undefined) {
            super();

            //private variables (There are defaults)
            this.__canvasScale = 1;
            this.__cursor = "default";
            this.__enabledMouseMove = false;
            this.__mouseDownEventThrough = true;
            this.__mouseUpEventThrough = true;
            this.__millisecPerFrame = Math.round(1000 / 30); //30.3030…fps（フレームレートの設定）
            this.__mouseX = this.__mouseY = 0;
            this.__perspective = 5000; //1000～10000
            this.__rotateX = 0;
            this.__rotateY = 0;

            //private variables（初期値無）
            this.__canvas = undefined;
            this.__container = undefined; //委譲
            this.__context2D = undefined;
            this.__enterframeHandler = undefined;
            this.__height = undefined;
            this.__mouseDownHandler = undefined;
            this.__mouseUpHandler = undefined;
            this.__mousemoveHandler = undefined;
            this.__container_observerArray = undefined;
            this.__screenColor = undefined;
            this.__timerID = undefined;
            this.__width = undefined;

            //引数から代入
            if (typeof _id_or_width == "string") { //Canvas("myCanvas");
                this.__canvas = document.getElementById(_id_or_width);
                this.__width = this.__canvas.width;
                this.__height = this.__canvas.height;
            } else if (typeof _id_or_width == "number") { //ex.Canvas(550,400)
                this.__canvas = document.createElement("canvas");
                this.__canvas.width = this.__width = _id_or_width;
                this.__canvas.height = this.__height = _height;
                document.body.appendChild(this.__canvas);
            }

            //イベントハンドラメソッド内でthis＝Canvasオブジェクトを取得するため
            this.__mousedown_canvas = (_e) => { this.__mousedown_canvas_method(_e); };
            this.__mouseup_canvas = (_e) => { this.__mouseup_canvas_method(_e); };
            this.__mousemove_canvas = (_e) => { this.__mousemove_canvas_method(_e); };
            this.__keydown_document = (_e) => { this.__keydown_document_method(_e); };
            this.__keyup_document = (_e) => { this.__keyup_document_method(_e); };
            this.__resize_window = (_e) => { this.__resize_window_method(_e); }; //for Canvas.isFitWindow()

            this.__context2D = this.__canvas.getContext("2d"); //create Context2D object

            this.__timerID = setInterval(this.__loop, this.__millisecPerFrame, this); //第3引数を利用

            if (!("ontouchstart" in window) || (navigator.platform.indexOf("Win") != -1)) { //for Linux/Mac/Windows
                this.__canvas.addEventListener("mousedown", this.__mousedown_canvas, false);
                this.__canvas.addEventListener("mouseup", this.__mouseup_canvas, false);
            } else { //for Mobile
                this.__canvas.addEventListener("touchstart", this.__mousedown_canvas, false);
                this.__canvas.addEventListener("touchend", this.__mouseup_canvas, false);
            }

            this.__container = new toile.Container(); //委譲
            this.__container.__name = "root";
        }

        //===============
        // public method
        //===============
        addChild(_superDisplay) { //= addObserver()
            if (_superDisplay instanceof toile.SpriteSheet) { //for SpriteSheet
                var _spriteSheet = _superDisplay;
                if (_spriteSheet.fps == undefined) { //SpriteSheet.fpsが未設定の場合…
                    _spriteSheet.fps = this.fps; //SpriteSheet.fpsをCanvas.fpsと同じにする
                } else {
                    _spriteSheet.fps = _spriteSheet.fps; //SpriteSheet.fps()を実行したい為
                }
            }
            this.__container.addChild(_superDisplay); //委譲
        }

        addEventListener(_event, _function) {
            switch (_event) {
                case "enterframe":
                    this.__enterframeHandler = _function;
                    break;
                case "keydown":
                    document.addEventListener("keydown", this.__keydown_document);
                    this.__keydownHandler = _function;
                    break;
                case "keyup":
                    document.addEventListener("keyup", this.__keyup_document);
                    this.__keyupHandler = _function;
                    break;
                case "mousedown":
                    this.__mouseDownHandler = _function;
                    break;
                case "mousemove":
                    this.__mousemoveHandler = _function;
                    break;
                case "mouseup":
                    this.__mouseUpHandler = _function;
                    break;
                default:
                    throw new Error("Canvas.addEventListener()");
            }
        }

        deleteChild(_superDisplay) { //= deleteObserver()
            this.__container.deleteChild(_superDisplay); //委譲
        }

        drawScreen(_color = "#ffffff") { //= notify() ++
            //背景色の描画
            this.__screenColor = _color;
            this.__context2D.fillStyle = this.__screenColor;
            this.__context2D.fillRect(0, 0, this.__canvas.width, this.__canvas.height);
            this.__container_observerArray = this.__container.getObserverArray();

            for (let i in this.__container_observerArray) {
                this.__context2D.save(); //保存
                this.__context2D.setTransform(1, 0, 0, 1, 0, 0); //座標系のリセット（決め打ち）
                var _observer = this.__container_observerArray[i];

                //回転基準点の変更（無いと左上端が基準）
                this.__context2D.translate(_observer.x + _observer.regX, _observer.y + _observer.regY);
                this.__context2D.rotate(_observer.rotateRadian); //回転

                var _theData = _observer.update(); //Observer Pattern

                if (_theData == undefined) { return; }

                //Containerか否かで処理を分ける
                if (_theData.type != "Container") { //Containerの入れ子ではない場合…
                    this.__commonObserverAction(_observer, _theData); //描画
                } else { //Containerの入れ子の場合…
                    var _containerAlpha = _observer.alpha;
                    this.__commonContainerAction(_observer, _containerAlpha);
                }
                this.__context2D.restore(); //復元
            }

            this.__context2D.restore(); //復元
        }

        enabledContextMenu(_bool) {
            this.__canvas.oncontextmenu = function() {
                return _bool;
            }
        }

        enabledMouseMove(_bool) {
            this.__enabledMouseMove = _bool;
            if (this.__enabledMouseMove) {
                if (this.__mousemoveHandler == undefined) {
                    throw new Error('Please define "mousemove" eventlistener');
                }

                if (!("ontouchstart" in window) || (navigator.platform.indexOf("Win") != -1)) { //for Linux/Mac/Windows
                    this.__canvas.addEventListener("mousemove", this.__mousemove_canvas, false);
                } else { //for Mobile
                    this.__canvas.addEventListener("touchmove", this.__mousemove_canvas, false);
                }

            } else {
                this.__canvas.removeEventListener("mousemove", this.__mousemove_canvas, false);
                this.__canvas.removeEventListener("touchmove", this.__mousemove_canvas, false);
            }
        }

        exitFullscreen() {
            if (document.webkitCancelFullScreen) { //Chorome, Safari
                document.webkitCancelFullScreen();
            } else if (document.mozCancelFullScreen) { //Firefox
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) { //Internet Explorer 11+
                document.msExitFullscreen();
            } else if (document.cancelFullScreen) { //Gecko
                document.cancelFullScreen();
            } else if (document.exitFullscreen) { // HTML5 Fullscreen
                document.exitFullscreen();
            }
        }

        getDepthElement(_depth) { //The object of some depth
            return this.__container.getDepthElement(_depth); //委譲
        }

        getDepthIndex(_superDisplay) { //The depth of some objects
            return this.__container.getDepthIndex(_superDisplay); //委譲
        }

        getDepthMax() {
            return this.__container.getDepthMax(); //委譲
        }

        isFitWindow(_boolean) {
            if (_boolean) {
                window.addEventListener("resize", this.__resize_window);

                //Canvasを画面全域に配置
                this.__canvas.style.display = "block";
                this.__canvas.style.position = "absolute";
                this.__canvas.style.top = "0px";
                this.__canvas.style.left = "0px";

                //拡大率
                var _scaleX = window.innerWidth / this.__width;
                var _scaleY = window.innerHeight / this.__height;
                this.__canvasScale = Math.min(_scaleX, _scaleY);

                //縦横どちらかにフィット
                var _scaleX = window.innerWidth / this.__width;
                var _scaleY = window.innerHeight / this.__height;
                if (_scaleX < _scaleY) {
                    this.__canvas.style.width = "100%";
                    this.__canvas.style.height = "";
                } else {
                    this.__canvas.style.width = "";
                    this.__canvas.style.height = "100%";
                }

            } else {
                window.removeEventListener("resize", this.__resize_window);

                this.__canvasScale = 1;
                var _scaleX = window.innerWidth / this.__width;
                var _scaleY = window.innerHeight / this.__height;
                if (_scaleX < _scaleY) {
                    this.__canvas.style.width = this.width + "px";
                } else {
                    this.__canvas.style.height = this.height + "px";
                }
            }
        }

        isBorder(_boolean) {
            if (_boolean) {
                this.__canvas.style.border = "solid 1px #000000";
            } else {
                this.__canvas.style.border = "none";
            }
        }

        removeEventListener(_event) {
            switch (_event) {
                case "enterframe":
                    this.__enterframeHandler = undefined;
                    break;
                case "keydown":
                    document.removeEventListener("keydown", this.__keydown_document);
                    this.__keydownHandler = undefined;
                    break;
                case "keyup":
                    document.removeEventListener("keyup", this.__keyup_document);
                    this.__keyupHandler = undefined;
                    break;
                case "mousedown":
                    this.__mouseDownHandler = undefined;
                    break;
                case "mouseup":
                    this.__mouseUpHandler = undefined;
                    break;
                case "mousemove":
                    this.__mousemoveHandler = undefined;
                    break;
                default:
                    throw new Error("Canvas.removeEventListener()");
            }
        }

        reload() { //for Debugging
            this.__context2D.fillRect(-this.__canvas.width / 2, -this.__canvas.height / 2,
                this.__canvas.width,
                this.__canvas.height
            );
        }

        requestFullscreen() {
            var _target = this.__canvas;
            if (_target.webkitRequestFullscreen) { //Chorome, Safari
                _target.webkitRequestFullscreen();
            } else if (_target.mozRequestFullScreen) { //Firefox
                _target.mozRequestFullScreen();
            } else if (_target.msRequestFullscreen) { //Internet Explorer 11+
                _target.msRequestFullscreen();
            } else if (_target.requestFullscreen) { // HTML5 Fullscreen API仕様
                _target.requestFullscreen();
            } else {
                alert("NOT SUPPORT FULLSCREEN MODE");
                return;
            }
        }

        screenShot(_startX = 0, _startY = 0, _endX = undefined, _endY = undefined, _type = "jpeg") {
            if ((_type != "png") && (_type != "jpeg")) {
                throw new Error('only "jpeg" or "png"');
            }
            var _dataURL = _canvas.__canvas.toDataURL("imgage/" + _type);
            return new toile.Bitmap(_dataURL, _startX, _startY, _endX, _endY);
        }

        setDepthIndex(_superDisplay, _depth) {
            this.__container.setDepthIndex(_superDisplay, _depth);
        }

        stopMouseDownEvent() {
            this.__mouseDownEventThrough = false;
        }

        stopMouseUpEvent() {
            this.__mouseUpEventThrough = false;
        }

        //================
        // private method
        //================
        __commonContainerAction(_observer, _containerAlpha) {
            for (let i in _observer.getObserverArray()) {
                this.__context2D.save(); //保存

                var _childObserver = _observer.getObserverArray()[i];
                var _theChildData = _childObserver.update();

                //再び回転基準点変更
                this.__context2D.translate(
                    _childObserver.x + _childObserver.regX - _observer.regX,
                    _childObserver.y + _childObserver.regY - _observer.regY
                );

                if (_theChildData.type != "Container") {
                    //再び回転
                    this.__context2D.rotate(_childObserver.rotateRadian);
                    this.__commonObserverAction(_childObserver, _theChildData, _containerAlpha); //描画
                    this.__context2D.restore(); //復元

                } else { //Containerの場合…
                    this.__context2D.rotate(_childObserver.rotateRadian);
                    _containerAlpha = _childObserver.alpha * _containerAlpha;
                    this.__commonContainerAction(_childObserver, _containerAlpha); //再帰呼出し
                    this.__context2D.restore(); //復元
                }
            }
        }

        __commonObserverAction(_observer, _theData, _containerAlpha = 1) {
            this.__context2D.globalAlpha = _observer.alpha * _containerAlpha;
            switch (_theData.type) {
                case "Bitmap":
                    this.__context2D.drawImage(
                        _theData.image, //元イメージ
                        _theData.startX, //元イメージをcanavsにコピーする開始点としての元イメージ中の「ソース位置」
                        _theData.startY, //同上
                        _theData.width, //上記の「ソース位置」を基準点とする矩形領域の幅
                        _theData.height, //同高さ
                        -_theData.regX, //上記の矩形領域をコピーするcanvas中の位置
                        -_theData.regY, //同上
                        _theData.width * _theData.scaleX, //イメージの伸縮後の新たな幅
                        _theData.height * _theData.scaleY //同高さ
                    );
                    break;

                case "SpriteSheet":
                    this.__context2D.drawImage(
                        _theData.image, //元イメージ
                        _theData.frameX, //元イメージをcanavsにコピーする開始点としての元イメージ中の「ソース位置」
                        _theData.frameY, //同上
                        _theData.width, //上記の「ソース位置」を基準点とする矩形領域の幅
                        _theData.height, //同高さ
                        -_theData.regX, //上記の矩形領域をコピーするcanvas中の位置
                        -_theData.regY, //同上
                        _theData.width * _theData.scaleX, //イメージの伸縮後の新たな幅
                        _theData.height * _theData.scaleY //同高さ
                    );
                    break;

                case "Text":
                    this.__context2D.font = _theData.size + "px " + _theData.font; //フォントのサイズと種類
                    this.__context2D.textBaseline = _theData.baseline; //垂直方向の位置合わせ
                    this.__context2D.textAlign = _theData.align; //水平方向の位置合わせ
                    this.__context2D.fillStyle = _theData.fillStyle; //テキストの色
                    this.__context2D.fillText(
                        _theData.fillText, //表示したいテキスト
                        -_theData.regX, //テキストのx座標
                        -_theData.regY //テキストのy座標
                    );
                    break;

                case "Video":
                    this.__context2D.drawImage(
                        _theData.video,
                        0,
                        0,
                        _theData.originWidth, //ex.720
                        _theData.originHeight, //ex.1280
                        -_theData.regX, -_theData.regY,
                        _theData.width,
                        _theData.height
                    );
                    break;

                case "Line":
                    this.__context2D.strokeStyle = "rgba(" + _theData.lineColor + "," + _theData.lineAlpha + ")";
                    this.__context2D.lineWidth = _theData.lineWidth;
                    this.__context2D.beginPath();
                    this.__context2D.moveTo(-_theData.regX, -_theData.regY);
                    this.__context2D.lineTo(-_theData.regX + _theData.endX - _theData.startX, -_theData.regY + _theData.endY - _theData.startY);
                    this.__context2D.stroke();
                    break;

                case "Rect":
                    if (_theData.isFill) {
                        this.__context2D.fillStyle = "rgba(" + _theData.fillColor + "," + _theData.fillAlpha + ")";
                        this.__context2D.fillRect(-_theData.regX, -_theData.regY,
                            _theData.endX - _theData.startX,
                            _theData.endY - _theData.startY
                        );
                    }
                    this.__context2D.strokeStyle = "rgba(" + _theData.lineColor + "," + _theData.lineAlpha + ")";
                    this.__context2D.lineWidth = _theData.lineWidth;
                    this.__context2D.strokeRect(-_theData.regX, -_theData.regY,
                        _theData.endX - _theData.startX,
                        _theData.endY - _theData.startY
                    );
                    break;

                case "Circle":
                    this.__context2D.beginPath();
                    this.__context2D.strokeStyle = "rgba(" + _theData.lineColor + "," + _theData.lineAlpha + ")";
                    this.__context2D.lineWidth = _theData.lineWidth;
                    this.__context2D.arc(
                        _theData.x,
                        _theData.y,
                        _theData.radius,
                        (Math.PI / 180) * 0,
                        (Math.PI / 180) * 360,
                        false
                    );
                    if (_theData.isFill) {
                        this.__context2D.fillStyle = "rgba(" + _theData.fillColor + "," + _theData.fillAlpha + ")";
                        this.__context2D.fill();
                    }
                    this.__context2D.stroke();
                    break;

                default:
                    "ERROR: Canvas.__commonObserverAction()";
            }
        }

        __loop(_canvas) {
            _canvas.__enterframeHandler(_canvas);
        }

        //this＝Canvasオブジェクトとする為
        __keydown_document_method(_e) {
            this.__keydownHandler(this, _e);
        }
        __keyup_document_method(_e) {
            this.__keyupHandler(this, _e);
        }

        //this＝Canvasオブジェクトとする為
        __mousedown_canvas_method(_e) { //_e: JavaScript.MouseEvent
            //ブラウザによっては「MouseEvent.offset○」?
            this.__mouseX = _e.layerX / this.__canvasScale;
            this.__mouseY = _e.layerY / this.__canvasScale;

            //Duplicate
            var _tempArray = this.__container_observerArray.concat();
            _tempArray.reverse();

            for (var i in _tempArray) {
                var _theObserver = _tempArray[i];

                //only Bitmap & SpriteSheet
                if (_theObserver.mouseHitTest != undefined) {
                    _theObserver.mouseHitTest(
                        _e.layerX / this.__canvasScale,
                        _e.layerY / this.__canvasScale,
                        this.__context2D,
                        this.__screenColor,
                        "mousedown"
                    );
                }

                if (!this.__mouseDownEventThrough) { //最低でも1回は上記を実行
                    this.__mouseDownEventThrough = true;
                    break;
                }
            }

            if (this.__mouseDownEventThrough) {
                if (this.__mouseDownHandler != undefined) {
                    this.__mouseDownHandler(this, _e);
                }
            }
        }

        //this＝Canvasオブジェクトとする為
        __mouseup_canvas_method(_e) {
            //ブラウザによっては「MouseEvent.offset○」?
            this.__mouseX = _e.layerX / this.__canvasScale;
            this.__mouseY = _e.layerY / this.__canvasScale;

            //Duplicate
            var _tempArray = this.__container_observerArray.concat();
            _tempArray.reverse();

            for (var i in _tempArray) {
                var _theObserver = _tempArray[i];

                //only Bitmap & SpriteSheet
                if (_theObserver.mouseHitTest != undefined) {
                    _theObserver.mouseHitTest(
                        _e.layerX / this.__canvasScale,
                        _e.layerY / this.__canvasScale,
                        this.__context2D,
                        this.__screenColor,
                        "mouseup"
                    );
                }

                if (!this.__mouseUpEventThrough) { //最低でも1回は上記を実行
                    this.__mouseUpEventThrough = true;
                    break;
                }
            }

            if (this.__mouseUpEventThrough) {
                if (this.__mouseUpHandler != undefined) {
                    this.__mouseUpHandler(this, _e);
                }
            }
        }

        //this＝Canvasオブジェクトとする為
        __mousemove_canvas_method(_mouseEvent) {
            //ブラウザによっては「MouseEvent.offset○」?
            this.__mouseX = _mouseEvent.layerX / this.__canvasScale;
            this.__mouseY = _mouseEvent.layerY / this.__canvasScale;
            this.__mousemoveHandler(this, _mouseEvent);
        }

        __resize_window_method(_event) {
            this.isFitWindow(true);
        }

        //==================================
        // public variables (setter/getter)
        //==================================
        get borderColor() { return this.__canvas.style.borderColor; } //ex. "rgb(0, 0, 0)"
        set borderColor(_newValue) { //ex. "rgb(255, 0, 0)" or "#ff0000"
            this.__canvas.style.borderColor = _newValue;
        }

        get borderWidth() { return this.__canvas.style.borderWidth; } //ex. "1px"
        set borderWidth(_newValue) { //ex. 3
            this.__canvas.style.borderWidth = _newValue + "px";
        }

        get context2D() {
            return this.__context2D;
        }
        set context2D(_newValue) {
            throw new Error("context2D can't be changed");
        }

        get correctFPS() {
            return 1000 / this.__millisecPerFrame;
        }
        set correctFPS(_newValue) {
            throw new Error("correctFPS can't be changed");
        }

        get cursor() {
            return this.__cursor;
        }
        set cursor(_newValue) {
            if ((_newValue.lastIndexOf(".png") != -1) || (_newValue.lastIndexOf(".jpg") != -1)) {
                this.__canvas.style.cursor = "url('" + _newValue + "'),text";
            } else if (_newValue == "default") { //必要に応じて今後"pointer"等にも対応予定
                this.__canvas.style.cursor = "default";
            } else if (_newValue == "wait") {
                this.__canvas.style.cursor = "wait";
            }
        }

        get fps() { return Math.round(1000 / this.__millisecPerFrame); }
        set fps(_fps) {
            clearInterval(this.__timerID);
            this.__millisecPerFrame = Math.round(1000 / _fps);
            this.__timerID = setInterval(this.__loop, this.__millisecPerFrame, this);
        }

        get height() { return this.__height; }
        set height(_newValue) { throw new Error("height can't be changed"); }

        get width() { return this.__width; }
        set width(_newValue) { throw new Error("width can't be changed"); }

        get mouseX() { return this.__mouseX; }
        set mouseX(_newValue) { throw new Error("mouseX can't be changed"); }

        get mouseY() { return this.__mouseY; }
        set mouseY(_newValue) { throw new Error("mouseY can't be changed"); }

        get perspective() { return this.__perspective; }
        set perspective(_newValue) {
            this.__perspective = _newValue;
        }

        get rotateX() { return this.__rotateX; }
        set rotateX(_newValue) { //ex. 1000～10000
            this.__rotateX = _newValue;
            this.__canvas.style.transform 
            = "perspective(" + this.__perspective + "px)" + " rotateX(" + _newValue + "deg)";
        }

        get rotateY() { return this.__rotateY; }
        set rotateY(_newValue) { //ex. 1000～10000
            this.__rotateY = _newValue;
            this.__canvas.style.transform 
            = "perspective(" + this.__perspective + "px)" + " rotateY(" + _newValue + "deg)";
        }
    };


/***************************************************************************
 * SuperDisplay Class
 *
 *	<Public Method>
 * 		hitTest(_target)
 * 		hitTestCircle(_target)
 *
 * 	<Public Property>
 * 		alpha
 * 		globalX
 * 		globalY
 * 		name
 * 		parent
 * 		regX
 * 		regY
 * 		rotate
 * 		rotateRadian
 * 		x
 * 		y
 *
 ***************************************************************************/

toile.SuperDisplay =
    class SuperDisplay { //super class
        constructor() {
            //private variables (There are defaults)
            this.__alpha = 1;
            this.__parent = null;
            this.__regX = 0;
            this.__regY = 0;
            this.__rotateRadian = 0;
            this.__x = 0;
            this.__y = 0;

            //private variables（初期値無）
            this.__name = undefined;
        }

        //===============
        // public method
        //===============
        hitTest(_target) { //Bitmap,Line,Rect,SpriteSheet,Videoに対応
            //for this
            if (!(this instanceof toile.Circle)) { //thisがCircle以外（Bitmap,SpriteSheet）の場合…
                var _this_Top = this.__y;
                var _this_Bottom = _this_Top + this.__height;
                var _this_Left = this.__x;
                var _this_Right = _this_Left + this.__width;
            } else { //when this is Circle...
                _this_Top = this.__centerY - this.__radius;
                _this_Bottom = this.__centerY + this.__radius;
                _this_Left = this.__centerX - this.__radius;
                _this_Right = this.__centerX + this.__radius;
            }

            //for target
            if (!(_target instanceof toile.Circle)) { //_targetがCircle以外（Bitmap,SpriteSheet）の場合…
                var _target_Top = _target.y;
                var _target_Bottom = _target_Top + _target.height;
                var _target_Left = _target.x;
                var _target_Right = _target_Left + _target.width;
            } else { //when _target is Circle...
                var _target_Top = _target.__centerY - _target.__radius;
                _target_Bottom = _target.__centerY + _target.__radius;
                _target_Left = _target.__centerX - _target.__radius;
                _target_Right = _target.__centerX + _target.__radius;
            }

            //common
            if ((_this_Top <= _target_Bottom) && (_this_Bottom >= _target_Top)) {
                if ((_this_Right >= _target_Left) && (_this_Left <= _target_Right)) {
                    return true;
                }
            }

            return false;
        }

        hitTestCircle(_target) {
            //for this
            if (!(this instanceof toile.Circle)) { //thisがCircle以外（Bitmap,SpriteSheet）の場合…
                var _thisRadius = this.width * this.scaleX / 2;
                var _thisX = this.__x + _thisRadius;
                var _thisY = this.__y + _thisRadius;
            } else { //when this is Circle...
                _thisRadius = this.__radius;
                _thisX = this.__centerX;
                _thisY = this.__centerY;
            }

            //for _target
            if (!(_target instanceof toile.Circle)) { //_targetがCircle以外（Bitmap,SpriteSheet）の場合…
                var _targetRadius = _target.width / 2;
                var _targetX = _target.x + _targetRadius;
                var _targetY = _target.y + _targetRadius;

            } else { //when _target is Circle...
                _targetRadius = _target.radius;
                _targetX = _target.centerX;
                _targetY = _target.centerY;
            }

            //common
            var _disX = _thisX - _targetX;
            var _disY = _thisY - _targetY;
            var _dis = Math.sqrt(_disX * _disX + _disY * _disY);
            if (_dis < (_thisRadius + _targetRadius)) {
                return true;
            }

            return false;
        }

        //=================
        // internal method
        //=================
        setParent(_container) {
            this.__parent = _container;
        }

        //==================================
        // public variables (setter/getter)
        //==================================
        get alpha() { return this.__alpha; }
        set alpha(_newValue) {
            if (_newValue < 0) _newValue = 0;
            if (_newValue > 1) _newValue = 1;
            this.__alpha = _newValue;
        }

        get globalX() {
            if (this.__parent.name == "root") return this.__x;

            var _this = this;
            var _displayArray = [this];

            while (_this.parent.name != "root") {
                _this = _this.parent;
                _displayArray.push(_this);
            }

            _displayArray.reverse();
            var _display0 = _displayArray[0];

            var _totalKakudo = 0;
            var _theGlobalX = 0;

            for (let i in _displayArray) {
                let _theDisplay1 = _displayArray[i];
                if (Number(i) + 1 >= _displayArray.length) {
                    return _theGlobalX + _display0.x;
                }
                let _theDisplay2 = _displayArray[Number(i) + 1];
                _theGlobalX += this.__getGlobalX(_theDisplay2, _totalKakudo) - _theDisplay1.x;
                _totalKakudo += _theDisplay1.rotate;
            }
        }
        set globalX(_newValue) {
            throw new Error("globalX can't be changed");
        }

        get globalY() {
            if (this.__parent.name == "root") return this.__y;

            var _this = this;
            var _displayArray = [this];

            while (_this.parent.name != "root") {
                _this = _this.parent;
                _displayArray.push(_this);
            }

            _displayArray.reverse();
            var _display0 = _displayArray[0];

            var _totalKakudo = 0;
            var _theGlobalY = 0;

            for (let i in _displayArray) {
                let _theDisplay1 = _displayArray[i];
                if (Number(i) + 1 >= _displayArray.length) {
                    return _theGlobalY + _display0.y;
                }
                let _theDisplay2 = _displayArray[Number(i) + 1];
                _theGlobalY += this.__getGlobalY(_theDisplay2, _totalKakudo) - _theDisplay1.y;
                _totalKakudo += _theDisplay1.rotate;
            }
        }
        set globalY(_newValue) {
            throw new Error("globalY can't be changed");
        }

        get name() { return this.__name; }
        set name(_newValue) { this.__name = _newValue; }

        //please refer to SuperDisplay.setParent()
        get parent() { return this.__parent; }
        set parent(_newValue) { throw new Error("parent can't be changed"); }

        get regX() { return this.__regX; }
        set regX(_newValue) { this.__regX = _newValue; }

        get regY() { return this.__regY; }
        set regY(_newValue) { this.__regY = _newValue; }

        get rotate() { return 180 * this.rotateRadian / Math.PI; } //"Kakudo"
        set rotate(_newValue) { this.rotateRadian = _newValue * Math.PI / 180; }

        get rotateRadian() { return this.__rotateRadian; } //"Radian"
        set rotateRadian(_newValue) { this.__rotateRadian = _newValue; }

        get x() { return this.__x; }
        set x(_newValue) { this.__x = _newValue; }

        get y() { return this.__y; }
        set y(_newValue) { this.__y = _newValue; }

        //================
        // private method
        //================
        __getGlobalX(_this, _totalKakudo = 0) {
            var _disX = _this.parent.regX - _this.x - _this.__regX; //for Circle class
            var _disY = _this.parent.regY - _this.y - _this.__regY; //for Circle class
            var _dis = Math.sqrt(_disX * _disX + _disY * _disY);
            var _kakudo = 180 * Math.atan2(_disY, _disX) / Math.PI;
            _kakudo = _kakudo + _this.parent.rotate + _totalKakudo;
            var _tmpX = _dis * Math.cos(Math.PI * _kakudo / 180);
            return _this.parent.x + _this.parent.regX - _tmpX - _this.__regX; //for Circle class
        }

        __getGlobalY(_this, _totalKakudo = 0) {
            var _disX = _this.parent.regX - _this.x - _this.__regX; //for Circle class
            var _disY = _this.parent.regY - _this.y - _this.__regY; //for Circle class
            var _dis = Math.sqrt(_disX * _disX + _disY * _disY);
            var _kakudo = 180 * Math.atan2(_disY, _disX) / Math.PI;
            _kakudo = _kakudo + _this.parent.rotate + _totalKakudo;
            var _tmpY = _dis * Math.sin(Math.PI * _kakudo / 180);
            return _this.parent.y + _this.parent.regY - _tmpY - _this.__regY; //for Circle class
        }
    };


/***************************************************************************
 * Container Class
 *
 * 	<Public Method>
 * 		addChild(_superDisplay)
 * 		deleteChild(_superDisplay)
 * 		getDepthElement(_depth)
 * 		getDepthIndex(_superDisplay)
 * 		getDepthMax()
 * 		setDepthIndex(_superDisplay, _depth)
 *
 *	<Public Property>
 * 		alpha
 * 		globalX
 * 		globalY
 *		name
 * 		parent
 * 		regX
 * 		regY
 * 		rotate
 * 		rotateRadian
 * 		x
 * 		y
 *
 ***************************************************************************/

toile.Container =
    class Container extends toile.SuperDisplay { //observer pattern
        constructor() {
            super();
            this.__observerArray = [];
        }

        //===============
        // public method
        //===============
        addChild(_superDisplay) { //= addObserver()
            if (_superDisplay == undefined) {
                throw new Error("Container.addChild()");
            }
            this.__observerArray.push(_superDisplay);
            _superDisplay.setParent(this);
        }

        deleteChild(_superDisplay) { //= deleteObserver()
            var _theNum = this.__observerArray.indexOf(_superDisplay, 0);
            if (_theNum != -1) this.__observerArray.splice(_theNum, 1);
        }

        getDepthElement(_depth) { //the object of some depth
            return this.__observerArray[_depth];
        }

        getDepthIndex(_superDisplay) { //the depth of some objects
            return this.__observerArray.indexOf(_superDisplay, 0); //When not found "-1"
        }

        getDepthMax() { //the top depth
            return this.__observerArray.length - 1;
        }

        hitTest(_target) { //override
            throw new Error("hitTest() can't be used");
        }

        hitTestCircle(_target) { //override
            throw new Error("hitTestCircle() can't be used");
        }

        setDepthIndex(_superDisplay, _depth) {
            var _targetNum = this.getDepthIndex(_superDisplay);
            if (_targetNum == _depth) { //when depth is not changed
                return;
            } else {
                this.__observerArray.splice(_targetNum, 1); //1つだけ削除
                var _deleteArray = this.__observerArray.splice(_depth); //delete
                this.__observerArray.push(_superDisplay);
                this.__observerArray = this.__observerArray.concat(_deleteArray);
            }
        }

        //================
        // internal method
        //================
        getObserverArray() { //委譲用（Canvas Classで利用）
            return this.__observerArray;
        }

        update() { //for observer pattern
            return this.__getData();
        }

        hitTest(_target) { //override
            throw new Error("Container.hitTest() can't be used");
        }

        hitTestCircle(_target) { //override
            throw new Error("Container.hitTestCircle() can't be used");
        }

        //================
        // private method
        //================
        __getData() {
            return { type: "Container" };
        }

        //==================================
        // public variables (setter/getter)
        //==================================
        //Override
        get name() { return this.__name; }
        set name(_newValue) {
            if (_newValue == "root") throw new Error('"root" can not be used');
            this.__name = _newValue;
        }

        //Override
        get scaleX() { throw new Error("Container.scaleX(): can't be used"); }
        set scaleX(_scaleX) { throw new Error("Container.scaleX(): not changed"); }

        //Override
        get scaleY() { throw new Error("Container.scaleY(): can't be used"); }
        set scaleY(_scaleY) { throw new Error("Container.scaleY(): not changed"); }
    };


/***************************************************************************
 * Bitmap class
 *
 * 	<Public Method>
 * 		addEventListener(_event, _function, _isCircle=false)
 * 		hitTest(_target)
 * 		hitTestCircle(_target)
 * 		removeEventListener(_event)
 *
 * 	<Public Property>
 * 		alpha
 * 		globalX
 * 		globalY
 * 		height
 * 		image
 * 		name
 * 		parent
 * 		regX
 * 		regY
 * 		rotate
 * 		rotateRadian
 * 		scale
 * 		scaleX
 * 		scaleY
 * 		width
 * 		x
 * 		y
 *
 * 	<Event>
 * 		LOAD
 * 		MOUSE_DOWN
 * 		MOUSE_UP
 * 		MOUSE_UP_OUTSIDE
 *
 ***************************************************************************/

toile.Bitmap =
    class Bitmap extends toile.SuperDisplay { //observer pattern
        // static constant
        static get LOAD() { return "load"; }
        static get MOUSE_DOWN() { return "mousedown"; }
        static get MOUSE_UP() { return "mouseup"; }
        static get MOUSE_UP_OUTSIDE() { return "mouseupoutside"; }

        constructor(_path, _startX = 0, _startY = 0, _endX = undefined, _endY = undefined) {
            super();

            //private variables (There are defaults)
            this.__isMouseDown = false;
            this.__isHitOutsideArea = false;
            this.__isChoice = false;
            this.__scale = 1;
            this.__scaleX = 1;
            this.__scaleY = 1;
            this.__startX = _startX;
            this.__startY = _startY;
            this.__endX = _endX;
            this.__endY = _endY;

            //private variables
            this.__height = undefined;
            this.__mouseHitTestIsCircle = undefined; //Rect: false, Circle: true
            this.__image = undefined;
            this.__loadHandler = undefined;
            this.__mouseDownHandler = undefined;
            this.__mouseUpHandler = undefined;
            this.__originWidth = undefined;
            this.__originHeight = undefined;
            this.__width = undefined;

            //イベントハンドラメソッド内でthis＝Bitmapオブジェクトを取得するため
            this.__load_image = (_e) => { this.__load_image_method(_e); };

            //create Image object
            this.__image = new Image();
            this.__image.src = _path;
            this.__image.addEventListener("load", this.__load_image, false);
        }

        //===============
        // public method
        //===============
        addEventListener(_event, _function, _isCircle = false) {
            switch (_event) {
                case "mousedown":
                    this.__mouseDownHandler = _function;
                    break;
                case "mouseup":
                    this.__mouseUpHandler = _function;
                    break;
                case "mouseupoutside":
                    this.__mouseUpOutsideHandler = _function;
                    break;
                case "load":
                    this.__loadHandler = _function;
                    break;
                default:
                    throw new Error("Bitmap.addEventListener()");
            }
            this.__mouseHitTestIsCircle = _isCircle;
        }

        removeEventListener(_event) {
            switch (_event) {
                case "mousedown":
                    this.__mouseDownHandler = undefined;
                    break;
                case "mouseup":
                    this.__mouseUpHandler = undefined;
                    break;
                case "mouseupoutside":
                    this.__mouseUpOutsideHandler = undefined;
                    break;
                case "load":
                    this.__loadHandler = undefined;
                    break;
                default:
                    throw new Error("Bitmap.removeEventListener()");
            }
        }

        //=================
        // internal method
        //=================
        getData() {
            var _obj = {};
            _obj.type = "Bitmap";
            _obj.width = this.__originWidth;
            _obj.height = this.__originHeight;
            _obj.image = this.__image;
            _obj.regX = this.regX;
            _obj.regY = this.regY;
            _obj.x = this.x;
            _obj.y = this.y;
            _obj.scaleX = this.scaleX;
            _obj.scaleY = this.scaleY;
            _obj.startX = this.__startX;
            _obj.startY = this.__startY;
            return _obj;
        }

        mouseHitTest(_mouseX, _mouseY, _context2D, _color, _event) {
            // Bitmap/SpriteSheet情報を取得
            var _obj = this.getData();
            var _left = _obj.x;
            var _top = _obj.y;
            var _right = _left + _obj.width * this.scaleX;
            var _bottom = _top + _obj.height * this.scaleY;

            //================================================================
            // ①マウスカーソルの位置がBitmap/SpriteSheetの矩形「内」の場合…
            //================================================================
            if ((_mouseX < _right) && (_left < _mouseX) && (_top < _mouseY) && (_mouseY < _bottom)) {
                //Bitmap/SpriteSheetのうちCanvasの背景色と同じ領域はヒット領域から除外する為
                var _imageData = _context2D.getImageData(_mouseX, _mouseY, 1, 1);
                var _r = _imageData.data[0];
                var _g = _imageData.data[1];
                var _b = _imageData.data[2];
                var _a = _imageData.data[3];
                var _rColor = parseInt(_color.substr(1, 2), 16); //ex.255
                var _gColor = parseInt(_color.substr(3, 2), 16); //ex.204
                var _bColor = parseInt(_color.substr(5, 2), 16); //ex.0
                var _theColor = [_rColor, _gColor, _bColor, 255];

                //-----------------------------------
                //（1）ヒット領域が「長方形」の場合…
                //-----------------------------------
                if (!this.__mouseHitTestIsCircle) {

                    //Bitmap/SpriteSheetのうちTranceparent（透明）領域以外のところをヒットした場合…
                    if ((_r != _theColor[0]) || (_g != _theColor[1]) || (_b != _theColor[2]) || (_a != _theColor[3])) {
                        this.__commonHit(_event); //領域内でヒット（mousedown）

                    } else {
                        if (this.__isChoice) {
                            if (this.__mouseUpOutsideHandler != undefined) {
                                this.__mouseUpOutsideHandler(this);
                                this.__isChoice = false;
                            }
                        }
                    }

                //---------------------------------
                //（2）ヒット領域が「正円」の場合…
                //---------------------------------
                } else { //if (this.__mouseHitTestIsCircle) {...

                    if ((_r != _theColor[0]) || (_g != _theColor[1]) || (_b != _theColor[2]) || (_a != _theColor[3])) {
                        var _radius = _obj.width * this.scaleX / 2;
                        var _centerX = this.x + _radius;
                        var _centerY = this.y + _radius;
                        var _disX = _mouseX - _centerX;
                        var _disY = _mouseY - _centerY;
    
                        // Bitmap/SpriteSheetのうち、円形をヒットした場合…
                        if (Math.sqrt((_disX * _disX) + (_disY * _disY)) <= _radius) { //ピタゴラス（三平方）の定理
                            this.__commonHit(_event); //領域内でヒット（mousedown）
                        } else {
                            if (this.__isChoice) {
                                if (this.__mouseUpOutsideHandler != undefined) {
                                    this.__mouseUpOutsideHandler(this);
                                    this.__isChoice = false;
                                }
                            }
                            this.__commonHitOutsideArea(); //領域外でヒット
                        }

                    } else {
                        if (this.__isChoice) {
                            if (this.__mouseUpOutsideHandler != undefined) {
                                this.__mouseUpOutsideHandler(this);
                                this.__isChoice = false;
                            }
                        }
                        this.__commonHitOutsideArea(); //領域外でヒット
                    }
                }

                //================================================================
                // ②マウスカーソルの位置がBitmap/SpriteSheetの矩形「外」の場合…
                //================================================================
            } else {
                if (_event == "mousedown") {
                    this.__commonHitOutsideArea(); //領域外でヒット
                } else if (_event == "mouseup") {
                    if (this.__isMouseDown) {
                        if (this.__isHitOutsideArea) {
                            if (this.__mouseUpHandler != undefined) {
                                this.__mouseUpHandler(this);
                            }
                            this.__isMouseDown = false;
                        }
                    } else {
                        if (this.__isChoice) {
                            if (this.__mouseUpOutsideHandler != undefined) {
                                this.__mouseUpOutsideHandler(this);
                                this.__isChoice = false;
                            }
                        }
                    }
                }
            }
        }

        update() { //for observer pattern
            return this.getData();
        }

        //================
        // private method
        //================
        __commonHit(_event) { //_event: "mousedown", "mouseup", "mouseupoutside"
            switch (_event) {
                case "mousedown":
                    if (this.__mouseDownHandler != undefined) {
                        this.__mouseDownHandler(this);
                    }
                    this.__isChoice = true;
                    this.__isMouseDown = false;
                    break;

                case "mouseup":
                    if (this.__isChoice) {
                        if (this.__mouseUpHandler != undefined) {
                            this.__isChoice = false;
                            this.__mouseUpHandler(this);
                        }
                    }
                    break;
            }
        }

        //領域外でヒット
        __commonHitOutsideArea() {
            if (!this.__isMouseDown) {
                this.__isHitOutsideArea = true;
                this.__isChoice = false;
            } else {
                this.__isMouseDown = false;
            }
        }

        isMouseDownHandler() {
            return (this.__mouseDownHandler != undefined);
        }

        isMouseUpHandler() {
            return (this.__mouseUpHandler != undefined);
        }

        //this＝Bitmapオブジェクトとする為
        __load_image_method(_e) { //if .png or .jpg can be read...
            if (this.__endX < _e.currentTarget.width) {
                this.__originWidth = this.__endX - this.__startX;
                this.__width = this.__endX - this.__startX;
            } else {
                this.__originWidth = this.__width = _e.currentTarget.width - this.__startX;
            }

            if (this.__endY < _e.currentTarget.height) {
                this.__originHeight = this.__endY - this.__startY;
                this.__height = this.__endY - this.__startY;
            } else {
                this.__originHeight = this.__height = _e.currentTarget.height - this.__startY;
            }

            if (this.__loadHandler != undefined) {
                this.__loadHandler(this); //this = Bitmap object
            }
        }

        //==================================
        // public variables (setter/getter)
        //==================================
        get height() { return this.__height; }
        set height(_newValue) {
            this.__height = _newValue;
            this.__scale = null;
            this.__scaleY = _newValue / this.__originHeight;
        }

        get image() { return this.__image; }

        get scale() { return this.__scale; }
        set scale(_newValue) {
            this.__width = this.__originWidth * _newValue;
            this.__height = this.__originHeight * _newValue;
            this.__scale = _newValue;
            this.__scaleX = _newValue;
            this.__scaleY = _newValue;
        }

        get scaleX() { return this.__scaleX; }
        set scaleX(_newValue) {
            this.__width = this.__originWidth * _newValue;
            this.__scaleX = _newValue;
            this.__scale = null;
        }

        get scaleY() { return this.__scaleY; }
        set scaleY(_newValue) {
            this.__height = this.__originHeight * _newValue;
            this.__scaleY = _newValue;
            this.__scale = null
        }

        get width() { return this.__width; }
        set width(_newValue) {
            this.__width = _newValue;
            this.__scale = null;
            this.__scaleX = _newValue / this.__originWidth;
        }
    };


/***************************************************************************
 * Circle Class
 *
 *	<Public Method>
 * 		hitTest(_target)
 * 		hitTestCircle(_target)
 * 		isFill(_boolean)
 *
 *	<Public Property>
 * 		alpha
 * 		centerX
 * 		centerY
 *		globalX
 * 		globalY
 * 		fillAlpha
 * 		fillColor
 * 		lineAlpha
 * 		lineColor
 * 		lineWidth
 * 		name
 * 		parent
 * 		radius
 * 		scale
 * 		x
 * 		y
 *
 ***************************************************************************/

toile.Circle =
    class Circle extends toile.SuperDisplay { //observer pattern
        constructor(_x = 0, _y = 0, _radius = 100) {
            super();

            //arguments is substituted.
            this.__x = _x;
            this.__y = _y;
            this.__radius = _radius;
            this.__centerX = _x + _radius;
            this.__centerY = _y + _radius;

            //private variables (There are defaults)
            this.__lineAlpha = 1;
            this.__lineColor = "0,0,0";
            this.__lineWidth = 1;
            this.__fillAlpha = 1;
            this.__fillColor = "255,255,255";
            this.__isFill = false;
            this.__scale = 1;
        }

        //===============
        // public method
        //===============
        isFill(_boolean) {
            this.__isFill = _boolean;
        }

        //=================
        // internal method
        //=================
        update() { //override
            var _obj = {};
            _obj.type = "Circle";
            _obj.x = this.__x + this.__radius;
            _obj.y = this.__y + this.__radius;
            _obj.lineAlpha = this.__lineAlpha;
            _obj.lineColor = this.__lineColor;
            _obj.lineWidth = this.__lineWidth;
            _obj.fillAlpha = this.__fillAlpha;
            _obj.fillColor = this.__fillColor;
            _obj.isFill = this.__isFill;
            _obj.radius = this.__radius;
            return _obj;
        }

        //==================================
        // public variables (setter/getter)
        //==================================
        get centerX() { return this.__centerX; }
        set centerX(_newValue) {
            this.__centerX = _newValue;
            this.__x = this.__centerX - this.__radius;
        }

        get centerY() { return this.__centerY; }
        set centerY(_newValue) {
            this.__centerY = _newValue;
            this.__y = this.__centerY - this.__radius;
        }

        get fillAlpha() { return this.__fillAlpha; }
        set fillAlpha(_newValue) {
            this.__fillAlpha = _newValue;
            if (this.__fillAlpha < 0) {
                this.__fillAlpha = 0;
            } else if (this.__fillAlpha > 1) {
                this.__fillAlpha = 1;
            }
        }

        get fillColor() { return this.__fillColor; }
        set fillColor(_newValue) { this.__fillColor = _newValue; } //ex."255,204,0"

        get lineAlpha() { return this.__lineAlpha; }
        set lineAlpha(_newValue) {
            this.__lineAlpha = _newValue;
            if (this.__lineAlpha < 0) {
                this.__lineAlpha = 0;
            } else if (this.__lineAlpha > 1) {
                this.__lineAlpha = 1;
            }
        }

        get lineColor() { return this.__lineColor; }
        set lineColor(_newValue) { this.__lineColor = _newValue; } //ex."255,204,0"

        get lineWidth() { return this.__lineWidth; }
        set lineWidth(_newValue) {
            if (_newValue < 1) _newValue = 1;
            this.__lineWidth = _newValue;
        }

        get radius() { return this.__radius; }
        set radius(_newValue) {
            this.__radius = _newValue;
            this.__scale = 1;
        }

        set regX(_newValue) { throw new Error("Circle.regX can't be used"); } //override
        set regY(_newValue) { throw new Error("Circle.regX can't be used"); } //override

        set rotate(_newValue) { throw new Error("rotate can't be changed"); } //override
        set rotateRadian(_newValue) { throw new Error("rotateRadian can't be changed"); } //override

        get scale() { return this.__scale; } //Default: 1
        set scale(_newValue) { //Default: 1
            this.__radius = this.__radius * (_newValue / this.__scale);
            this.__lineWidth = this.__lineWidth * (_newValue / this.__scale);
            this.__scale = _newValue;
        }

        get scaleX() { throw new Error("Circle.scaleX can't be used"); }
        set scaleX(_newValue) { throw new Error("Circle.scaleX can't be used"); }

        get scaleY() { throw new Error("Circle.scaleY can't be used") }
        set scaleY(_newValue) { throw new Error("Circle.scaleY can't be used"); }

        get x() { return this.__x; } //override
        set x(_newValue) { //override
            this.__x = _newValue;
            this.__centerX = this.__x + this.radius;
        }

        get y() { return this.__y; } //override
        set y(_newValue) { //override
            this.__y = _newValue;
            this.__centerY = this.__y + this.radius;
        }
    };

/***************************************************************************
 * Line Class
 *
 *	<Public Method>
 * 		hitTest(_target)
 *
 * 	<Public Property>
 * 		alpha
 * 		endX
 * 		endY
 * 		globalX
 * 		globalY
 * 		height
 * 		lineAlpha
 * 		lineColor
 * 		lineWidth
 * 		name
 * 		parent
 * 		regX
 * 		regY
 * 		rotate
 * 		rotateRadian
 * 		scale
 * 		startX
 * 		startY
 * 		width
 * 		x
 * 		y
 *
 ***************************************************************************/

toile.Line =
    class Line extends toile.SuperDisplay { //observer pattern
        constructor(_startX = 0, _startY = 0, _endX = 100, _endY = 100) {
            super();

            //arguments is substituted.
            this.__startX = _startX;
            this.__startY = _startY;

            this.__x = _startX;
            this.__y = _startY;

            this.__endX = _endX;
            this.__endY = _endY;

            this.__width = _endX - _startX;
            this.__height = _endY - _startY;

            //private variables (There are defaults)
            this.__lineAlpha = 1;
            this.__lineColor = "0,0,0";
            this.__lineWidth = 1;
            this.__scale = 1;
        }

        //==========================
        // public method (override)
        //==========================
        hitTestCircle(_target) { //override
            throw new Error("Line.hitTestCircle() can't be used");
        }

        //=================
        // internal method
        //=================
        update() { //for observer pattern
            var _obj = {};
            _obj.type = "Line";
            _obj.startX = this.__x;
            _obj.startY = this.__y;
            _obj.endX = this.__endX;
            _obj.endY = this.__endY;
            _obj.lineWidth = this.__lineWidth;
            _obj.lineColor = this.__lineColor;
            _obj.lineAlpha = this.__lineAlpha;
            _obj.regX = this.__regX;
            _obj.regY = this.__regY;
            return _obj;
        }

        //==================================
        // public variables (setter/getter)
        //==================================
        get endX() { return this.__endX; }
        set endX(_newValue) {
            this.__endX = _newValue;
            this.__width = this.__endX - this.__startX;
            this.__scale = null;
        }

        get endY() { return this.__endY; }
        set endY(_newValue) {
            this.__endY = _newValue;
            this.__height = this.__endY - this.__startY;
            this.__scale = null;
        }

        get height() { return this.__height; }
        set height(_newValue) {
            this.__endY = this.__startY + _newValue;
            this.__height = _newValue;
            this.__scaleY = _newValue / this.__originHeight;
            this.__scale = null;
        }

        get lineAlpha() { return this.__lineAlpha; }
        set lineAlpha(_newValue) {
            this.__lineAlpha = _newValue;
            if (this.__lineAlpha < 0) {
                this.__lineAlpha = 0;
            } else if (this.__lineAlpha > 1) {
                this.__lineAlpha = 1;
            }
        }

        get lineColor() { return this.__lineColor; }
        set lineColor(_newValue) { this.__lineColor = _newValue; } //ex."255,204,0"

        get lineWidth() { return this.__lineWidth; }
        set lineWidth(_newValue) { this.__lineWidth = _newValue; }

        get scale() { return this.__scale; } //Default: 1
        set scale(_newValue) { //Default: 1
            this.__endX = (this.__endX - this.__startX) * (_newValue / this.__scale) + this.__x;
            this.__endY = (this.__endY - this.__startY) * (_newValue / this.__scale) + this.__y;
            this.__width = this.__endX - this.__startX;
            this.__height = this.__endY - this.__startY;
            this.__lineWidth = this.__lineWidth * (_newValue / this.__scale);
            this.__scale = _newValue;
        }

        get scaleX() { throw new Error("Line.scaleX() can't be used"); } //override
        set scaleX(_newValue) { throw new Error("Line.scaleX() can't be used"); } //override

        get scaleY() { throw new Error("Line.scaleY() can't be used"); } //override
        set scaleY(_newValue) { throw new Error("Line.scaleY() can't be used"); } //override

        get startX() { return this.__startX; }
        set startX(_newValue) {
            this.__x = _newValue;
            this.__startX = _newValue;
            this.__width = this.__endX - this.__startX;
            this.__scale = null;
        }

        get startY() { return this.__startY; }
        set startY(_newValue) {
            this.__y = _newValue;
            this.__startY = _newValue;
            this.__height = this.__endY - this.__startY;
            this.__scale = null;
        }

        get width() { return this.__width; }
        set width(_newValue) {
            this.__endX = this.__startX + _newValue;
            this.__width = _newValue;
            this.__scaleX = _newValue / this.__originWidth;
            this.__scale = null;
        }

        get x() { return this.__x; } //override
        set x(_newValue) { //override
            this.__x = _newValue;
            this.__startX = _newValue;
            this.__endX = this.__startX + this.__width;
        }

        get y() { return this.__y; } //override
        set y(_newValue) { //override
            this.__y = _newValue;
            this.__startY = _newValue;
            this.__endY = this.__startY + this.__height;
        }
    };


/***************************************************************************
 * Rect Class
 *
 *	<Public Method>
 * 		hitTest(_target)
 *		isFill(_boolean)
 *
 * 	<Public Property>
 * 		alpha
 *		endX
 * 		endY
 * 		fillAlpha
 * 		fillColor
 * 		globalX
 * 		globalY
 * 		height
 * 		lineAlpha
 * 		lineColor
 * 		lineWidth
 * 		name
 * 		parent
 * 		regX
 * 		regY
 * 		rotate
 * 		rotateRadian
 * 		scale
 * 		startX
 * 		startY
 * 		width
 * 		x
 * 		y
 *
 ***************************************************************************/

toile.Rect =
    class Rect extends toile.Line { //observer pattern
        constructor(_startX = 0, _startY = 0, _endX = 100, _endY = 100) {
            super();

            //arguments is substituted
            this.__startX = _startX;
            this.__startY = _startY;

            this.__x = _startX;
            this.__y = _startY;

            this.__endX = _endX;
            this.__endY = _endY;

            this.__width = _endX - _startX;
            this.__height = _endY - _startY;

            //private variables (There are defaults)
            this.__fillAlpha = 1;
            this.__fillColor = "255,255,255";
            this.__isFill = false;
        }

        //===============
        // public method
        //===============
        isFill(_boolean) {
            this.__isFill = _boolean;
        }

        //==================================
        // public variables (setter/getter)
        //==================================
        get fillAlpha() { return this.__fillAlpha; }
        set fillAlpha(_newValue) {
            this.__fillAlpha = _newValue;
            if (this.__fillAlpha < 0) {
                this.__fillAlpha = 0;
            } else if (this.__fillAlpha > 1) {
                this.__fillAlpha = 1;
            }
        }

        get fillColor() { return this.__fillColor; }
        set fillColor(_newValue) { this.__fillColor = _newValue; } //ex."255,204,0"

        //=================
        // internal method
        //=================
        update() { //override
            var _obj = {};
            _obj.type = "Rect";
            _obj.startX = this.__x;
            _obj.startY = this.__y;
            _obj.endX = this.__endX;
            _obj.endY = this.__endY;
            _obj.lineWidth = this.__lineWidth;
            _obj.lineColor = this.__lineColor;
            _obj.lineAlpha = this.__lineAlpha;
            _obj.isFill = this.__isFill;
            _obj.fillColor = this.__fillColor;
            _obj.fillAlpha = this.__fillAlpha;
            _obj.regX = this.__regX;
            _obj.regY = this.__regY;
            return _obj;
        }
    };


/***************************************************************************
 * SpriteSheet Class
 *
 * 	<Public Method>
 * 		addEventListener(_event, _function, _isCircle=false)
 * 		gotoAndPlay(_frame)
 * 		gotoAndStop(_frame)
 * 		hitTest(_target)
 * 		hitTestCircle(_target)
 * 		isPlay()
 * 		play()
 * 		removeEventListener(_event)
 * 		stop()
 *
 * 	<Public Property>
 * 		alpha
 * 		currentframe
 * 		fps
 * 		globalX
 * 		globalY
 * 		height
 * 		image
 * 		name
 * 		parent
 * 		regX
 * 		regY
 * 		rotate
 * 		rotateRadian
 * 		scale
 * 		scaleX
 * 		scaleY
 * 		totalframes
 * 		width
 * 		x
 * 		y
 *
 * 	<Event>
 * 		LOAD
 * 		MOUSE_DOWN
 * 		MOUSE_UP
 * 		MOUSE_UP_OUTSIDE
 *
 ***************************************************************************/

toile.SpriteSheet =
    class SpriteSheet extends toile.Bitmap { //observer pattern
        constructor(_path, _jsonPath = "") {
            super(_path);

            //private variables (There are defaults)
            this.__currentframe = 1;
            this.__isReadystatechange = false;
            this.__isReloadPermitted = true; //fps依存
            this.__state = "play"; //or "stop"
            this.__isLoaded = false; //__readystatechange_request_methodを1度だけにしたい為

            //private variables（初期値無）
            this.__count = undefined;
            this.__framesArray = undefined;
            this.__imageURL = undefined;
            this.__jsonURL = undefined;
            this.__isPlay = undefined;
            this.__millisecPerFrame = undefined;
            this.__request = undefined;
            this.__timerID = undefined; //for clearInterval()
            this.__totalframes = undefined;

            this.__imageURL = _path;
            if (_jsonPath == "") {
                if (_path.lastIndexOf(".png") != -1) { //xx.pngの場合…
                    this.__jsonURL = _path.substr(0, _path.lastIndexOf(".png")) + ".json";
                } else if (_path.lastIndexOf(".jpg") != -1) { //xx.jpgの場合…
                    this.__jsonURL = _path.substr(0, _path.lastIndexOf(".jpg")) + ".json";
                } else {
                    throw new Error("Only .png or .jpg is being supported");
                }
            } else {
                this.__jsonURL = _jsonPath;
            }

            //イベントハンドラメソッド内でthis＝Bitmapオブジェクトを取得するため
            this.__load_image = (_e) => { this.__load_image_method(_e); };

            //create Image object
            this.__image = new Image();
            this.__image.src = this.__imageURL;
            this.__image.addEventListener("load", this.__load_image, false);
        }

        //===============
        // public method
        //===============
        gotoAndPlay(_frame) {
            if ((_frame <= 0) || (this.__totalframes < _frame)) {
                throw new Error("SpriteSheet.gotoAndPlay()");
            }
            this.__currentframe = _frame;
            if (_frame != 0) {
                this.__count = _frame - 1;
            } else {
                this.__count = 0;
            }
            this.play();
        }

        gotoAndStop(_frame) {
            if ((_frame <= 0) || (this.__totalframes < _frame)) {
                throw new Error("SpriteSheetM.gotoAndPlay()");
            }
            this.__currentframe = _frame;
            if (_frame != 0) {
                this.__count = _frame - 1;
            } else {
                this.__count = 0;
            }
            this.stop();
        }

        isPlay() {
            if (this.__state == "play") {
                return true;
            } else if (this.__state == "stop") {
                return false;
            }
        }

        play() { this.__state = "play"; }

        stop() { this.__state = "stop"; }

        //=================
        // internal method
        //=================
        update() { //override
            //必ずCanvas.fpsの回数分実行される（SpriteSheet.fpsに依存しない）
            if (this.__isReloadPermitted) {
                if (this.__state == "play") {
                    this.__count = (++this.__count) % this.__totalframes;
                    if (this.__count != 0) {
                        this.__currentframe = this.__count + 1;
                    } else {
                        this.__currentframe = 1;
                    }
                }
                this.__isReloadPermitted = false;
            }
            return this.getData();
        }

        getData() { //override
            if (this.__isReadystatechange) {
                if (this.__framesArray == undefined) {
                    return;
                }
                var _theFrameObj = this.__framesArray[this.__count];
                var _obj = {};
                _obj.type = "SpriteSheet";
                _obj.frameX = _theFrameObj.frame.x;
                _obj.frameY = _theFrameObj.frame.y;
                _obj.width = this.__originWidth = this.__width = _theFrameObj.frame.w; //フレームの幅
                _obj.height = this.__originHeight = this.__height = _theFrameObj.frame.h; //フレームの高さ
                _obj.image = this.__image;
                _obj.regX = this.regX;
                _obj.regY = this.regY;
                _obj.x = this.x;
                _obj.y = this.y;
                _obj.scaleX = this.scaleX;
                _obj.scaleY = this.scaleY;
                return _obj;
            }
        }

        //================
        // private method
        //================
        //this＝Bitmapオブジェクトとする為
        __load_image_method(_e) { //If .png or .jpg can be read...
            this.__request = new XMLHttpRequest();

            //イベントハンドラメ内でthis＝Bitmapオブジェクトを取得するため
            this.__readystatechange_request = () => { this.__readystatechange_request_method(); };
            this.__request.addEventListener("readystatechange", this.__readystatechange_request, false);
            this.__request.open("GET", this.__jsonURL);
            this.__request.send(null);
        }

        __loop(_spriteSheet) {
            //SpriteSheet.fpsの数だけ実行される
            _spriteSheet.__isReloadPermitted = true;
        }

        //If "JSON-Array" of "SpriteSheet" can be read...
        __readystatechange_request_method() {
            this.__isReadystatechange = true;
            if (this.__request.readyState == 4) {
                if (this.__request.status == 200) {
                    if (!this.__isLoaded) { //何故か4回、以下の処理を実行してしまうので…
                        var _json = JSON.parse(this.__request.responseText);
                        this.__framesArray = _json.frames;
                        this.__totalframes = this.__framesArray.length;
                        this.__count = 0; //Initialization!

                        if (this.__loadHandler != undefined) {
                            this.getData(); //これが無いと"LOAD"時にwidth等の値が取得できない
                            this.__loadHandler(this); //this = Bitmap object
                        }

                        this.__isLoaded = true;
                    }
                }
            }
        }

        //==================================
        // public variables (setter/getter)
        //==================================
        get currentframe() { return this.__currentframe; }
        set currentframe(_newValue) {
            throw new Error("currentframe can't be changed");
        }

        get fps() {
            return Math.round(1000 / this.__millisecPerFrame);
        }
        set fps(_fps) {
            clearInterval(this.__timerID);
            this.__millisecPerFrame = Math.round(1000 / _fps); //10fpsの場合、100（millsec）
            this.__timerID = setInterval(this.__loop, this.__millisecPerFrame, this);
        }

        get totalframes() { return this.__totalframes; }
        set totalframes(_newValue) {
            throw new Error("totalframes can't be changed");
        }
    };


/***************************************************************************
 * Text Class
 *
 *	<Public Method>
 * 		addWebFont()
 *
 * 	<Public Property>
 * 		align
 * 		alpha
 * 		baseline
 * 		color
 * 		font
 * 		globalX
 * 		globalY
 * 		name
 * 		parent
 * 		regX
 * 		regY
 * 		rotate
 * 		rotateRadian
 * 		scale
 * 		size
 * 		text
 * 		x
 * 		y
 *
 ***************************************************************************/

toile.Text =
    class Text extends toile.SuperDisplay { //observer pattern
        constructor(_text) {
            super();

            //private variables（引数より代入）
            this.__text = _text;

            //private variables (There are defaults)
            this.__align = "left"; //"start","center","left","right"
            this.__baseline = "top"; //"top","middle","bottom"
            this.__color = "0,0,0";
            this.__font = "san-serif"; //serif,san-serif,cursive,fantasy,monospace
            this.__scale = 1;
            this.__size = 10;
        }

        //===============
        // public method
        //===============
        //_url: .ttf .otf .eot
        //_type(option): "truetype", "opentype", "embedded-opentype"
        addWebFont(_fontName, _url, _type = "") {
            var _style = document.createElement("style"); //<style></style>を生成
            _style.appendChild(document.createTextNode('@font-face {font-family: "' + _fontName + '"; src: url("' + _url + '"); format("' + _type + '");}')); //@font-face規則を記述する
            document.head.appendChild(_style); //<head></head>内に上記の<style></style>を挿入
        }

        hitTest(_target) { //override
            throw new Error("Text.hitTest() can't be used");
        }

        hitTestCircle(_target) { //override
            throw new Error("Text.hitTestCircle() can't be used");
        }


        //=================
        // internal method
        //=================
        update() { //for observer pattern
            var _obj = {};
            _obj.type = "Text";
            _obj.size = this.__size;
            _obj.font = this.__font;
            _obj.fillStyle = "rgba(" + this.__color + ",1)";
            _obj.fillText = this.__text;
            _obj.baseline = this.__baseline;
            _obj.align = this.__align;
            _obj.regX = this.regX;
            _obj.regY = this.regY;
            _obj.scale = this.scale;
            return _obj;
        }

        //==================================
        // public variables (setter/getter)
        //==================================
        //"start","center","left","right"
        get align() { return this.__align; }
        set align(_newValue) { this.__align = _newValue; }

        //"top","middle","bottom"
        get baseline() { return this.__baseline; }
        set baseline(_newValue) { this.__baseline = _newValue; }

        get color() { return this.__color; } //ex. "255,204,0"
        set color(_newValue) { //"#ffcc00"="255,204,0"
            var _rColor = parseInt(_newValue.substr(1, 2), 16); //ex. 255
            var _gColor = parseInt(_newValue.substr(3, 2), 16); //ex. 204
            var _bColor = parseInt(_newValue.substr(5, 2), 16); //ex. 0
            this.__color = _rColor + "," + _gColor + "," + _bColor;
        }

        //serif,san-serif,cursive,fantasy,monospace
        get font() { return this.__font; }
        set font(_newValue) { this.__font = _newValue; }

        get scale() { return this.__scale; } //Default: 1
        set scale(_newValue) { //Default: 1
            this.__size = this.__size * (_newValue / this.__scale);
            this.__scale = _newValue;
        }

        get scaleX() { throw new Error("Text.scaleX() can't be used"); } //override
        set scaleX(_newValue) { throw new Error("Text.scaleX() can't be used"); } //override

        get scaleY() { throw new Error("Text.scaleY() can't be used"); } //override
        set scaleY(_newValue) { throw new Error("Text.scaleY() can't be used"); } //override

        get size() { return this.__size; }
        set size(_newValue) {
            this.__size = _newValue;
            this.__scale = 1; //Scale Reset
        }

        get text() { return this.__text; }
        set text(_newValue) { this.__text = _newValue; }
    };


/***************************************************************************
 * Video Class
 *
 * 	<Public Method>
 * 		hitTest()
 * 		isLoaded()
 * 		isLoop()
 * 		pause()
 * 		play()
 * 		stop()
 *
 * 	<Public Property>
 * 		alpha
 * 		currentTime
 * 		duration
 * 		globalX
 * 		globalY
 * 		height
 * 		name
 * 		parent
 * 		regX
 * 		regY
 * 		rotate
 * 		rotateRadian
 * 		scale
 * 		width
 * 		x
 * 		y
 *
 ***************************************************************************/

toile.Video =
    class Video extends toile.SuperDisplay { //observer pattern
        constructor(_path, _originWidth, _originHeight) {
            super();

            //private variables（引数より代入）
            this.__url = _path;
            this.__originWidth = this.__width = _originWidth;
            this.__originHeight = this.__height = _originHeight;
            this.__scale = this.__width / this.__originWidth;

            //private variables (There are defaults)
            this.__isLoaded = false;

            //private variables（初期値無）
            this.__video = undefined;

            // create video object
            this.__video = document.createElement("video");
            this.__video.src = this.__url;
            this.__video.loop = false;
            this.__video.autoplay = true;
        }

        //===============
        // public method
        //===============
        hitTestCircle(_target) { //override
            throw new Error("Video.hitTestCircle() can't be used");
        }

        isLoaded() {
            return this.__video.duration > 0;
        }

        isLoop(_bool) {
            this.__video.loop = _bool;
        }

        pause() { this.__video.pause(); }

        play() { this.__video.play(); }

        stop() {
            this.__video.pause();
            this.__video.currentTime = 0;
        }

        //=================
        // internal method
        //=================
        update() { //for Observer Pattern
            var _obj = {};
            _obj.type = "Video";
            _obj.width = this.__width;
            _obj.height = this.__height;
            _obj.originWidth = this.__originWidth;
            _obj.originHeight = this.__originHeight;
            _obj.video = this.__video;
            _obj.regX = this.regX;
            _obj.regY = this.regY;
            _obj.scale = this.scale;
            return _obj;
        }

        //==================================
        // public variables (setter/getter)
        //==================================
        get currentTime() { return this.__video.currentTime; }
        set currentTime(_sec) { this.__video.currentTime = _sec; }

        get duration() { return this.__video.duration; }
        set duration(_newValue) {
            throw new Error("duration can't be changed");
        }

        //get height() { return this.__height; }
        get height() { return this.__height; }
        set height(_newValue) {
            this.__height = _newValue;
            this.__scale = null;
        }

        get scale() { return this.__scale; }
        set scale(_newValue) {
            this.__width = this.__originWidth * _newValue;
            this.__height = this.__originHeight * _newValue;
            this.__scale = _newValue;
        }

        get scaleX() { throw new Error("Video.scaleX() can't be used"); } //override
        set scaleX(_newValue) { throw new Error("Video.scaleX() can't be used"); } //override

        get scaleY() { throw new Error("Video.scaleY() can't be used"); } //override
        set scaleY(_newValue) { throw new Error("Video.scaleY() can't be used"); } //override

        get width() { return this.__width; }
        set width(_newValue) {
            this.__width = _newValue;
            this.__scale = null;
        }
    };


/***************************************************************************
 * Sound Class
 *
 * 	<Public Method>
 * 		fadeOut(_sec = 1)
 * 		isLoaded()
 * 		isPaused()
 * 		pause()
 * 		play()
 * 		stop()
 *
 * 	<Public Property>
 * 		currentTime
 * 		duration
 * 		loop
 * 		name
 * 		volume
 *
 ***************************************************************************/

toile.Sound =
    class Sound {
        constructor(_path) {
            //private variables (There are defaults)
            this.__isLoaded = false;

            //private variables（初期値無）
            this.__audio = undefined;
            this.__endedHandler = undefined;
            this.__fadeoutTime = undefined;
            this.__name = undefined;
            this.__timerID = undefined; //for clearInterval()
            this.__volume = undefined;
            this.__audio = undefined;

            //Audioオブジェクトの生成
            this.__audio = new Audio(_path);
            this.__audio.loop = false;
            this.__audio.autoplay = false;
        }

        //===============
        // public method
        //===============
        fadeOut(_sec = 1) { //ex.2.5(sec)
            clearInterval(this.__timerID);
            this.__fadeoutTime = _sec;
            this.__timerID = setInterval(this.__faceOutLoop, 50, this); //20fps
        }

        isLoaded() {
            return this.__audio.duration > 0;
        }

        isPaused() {
            return this.__audio.paused;
        }

        pause() {
            this.__audio.pause();
        }

        play() {
            this.__audio.play();
        }

        removeEventListener(_event) {
            switch (_event) {
                case "ended":
                    this.__endedHandler = undefined;
                    break;
                default:
                    throw new Error("Sound.removeEventListener()");
            }
        }

        stop() {
            this.__audio.pause();
            this.__audio.currentTime = 0;
            this.__audio.volume = 1;
        }

        //================
        // private method
        //================
        __faceOutLoop(_this) {
            var _nextVolume = _this.__audio.volume - 0.05 / _this.__fadeoutTime;
            if (_nextVolume > 0) {
                _this.__audio.volume = _nextVolume;
            } else {
                _this.stop();
                clearInterval(_this.__timerID);
            }
        }

        //==================================
        // public variables (setter/getter)
        //==================================
        get currentTime() { return this.__audio.currentTime; }
        set currentTime(_newValue) { this.__audio.currentTime = _newValue; }

        get duration() { return this.__audio.duration; }

        get loop() { return this.__audio.loop; }
        set loop(_isLoop) { this.__audio.loop = _isLoop; }

        get name() { return this.__name; }
        set name(_newValue) { this.__name = _newValue; }

        get volume() { return this.__audio.volume; }
        set volume(_newValue) {
            if (_newValue < 0) _newValue = 0;
            if (_newValue > 1) _newValue = 1;
            this.__audio.volume = _newValue;
        }
    };