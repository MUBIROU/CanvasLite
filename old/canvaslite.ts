/***************************
 * canvaslite.ts
 * by TypeScript
 * for HTML5 Canvas
 * alpha vesion (build 181)
 * 2014-09-17T14:25
 * © 2014 vvestvillage
***************************/

/*
=====================================================
Interface
=====================================================
*/
interface ISubject { //for Observer Pattern
    addChild(_displayObject: IObserver): void; //= addObserver()
    deleteChild(_displayObject: IObserver): void; //= deleteObserver()
    drawScreen(_color: string): void; //= notify()
}

interface IObserver {
    update(): any; //for Observer Pattern
}

module canvaslite { //Module START

/*
=====================================================
DisplayObject Class

    <Public Property>
        name: string
        regX: number
.       regY: number
        rotate: number
        rotateRadian: number
        scaleX: number
        scaleY: number
        x: number
        y: number

=====================================================
*/
export class DisplayObject {
    private _name: string;
    private _scaleX: number = 1.0;
    private _scaleY: number = 1.0;
    private _regX: number = 0;
    private _regY: number = 0;
    private _rotateRadian: number = 0;
    private _x: number = 0;
    private _y: number = 0;

    //=================
    // Public Property
    //=================
    get name(): string { return this._name; }
    set name(_name: string) { this._name = _name; }

    get regX(): number { return this._regX; }
    set regX(_regX: number) { this._regX = _regX; }

    get regY(): number { return this._regY; }
    set regY(_regY: number) { this._regY = _regY; }

    get rotate(): number { return 180 * this.rotateRadian / Math.PI; } //"Kakudo"
    set rotate(_rotate: number) { this.rotateRadian = _rotate * Math.PI / 180; }

    get rotateRadian(): number { return this._rotateRadian; } //"Radian"
    set rotateRadian(_rotateRadian: number) { this._rotateRadian = _rotateRadian; }

    get scaleX(): number { return this._scaleX; } //Default: 1.0
    set scaleX(_scaleX: number) { this._scaleX = _scaleX; } //Default: 1.0

    get scaleY(): number { return this._scaleY; } //Default: 1.0
    set scaleY(_scaleY: number) { this._scaleY = _scaleY; } //Default: 1.0

    get x(): number { return this._x; }
    set x(_x: number) { this._x = _x; }

    get y(): number { return this._y; }
    set y(_y: number) { this._y = _y; }
}

/*
=====================================================
Canvas Class

    <Public Method>
        addChild(_displayObject: IObserver): void
        addEventListener(_event: string, _function: Function): void
        deleteChild(_displayObject: IObserver): void
        drawScreen(_color: string = "#272822"): void
        enabledMouseMove(_bool: boolean): void
        getDepthElement(_depth: number): IObserver
        getDepthIndex(_displayObject: IObserver): number
        getDepthMax(): number
        removeEventListener(_event: string): void
        reload(): void
        setDepthIndex(_displayObject: IObserver, _depth: number): void
        stopEvent(): void   
 
    <Public Property>
        fps: number
        height: number (Read Only)
        width: number (Read Only)
 
    <Event>
        ENTER_FRAME
        MOUSE_DOWN
        MOUSE_MOVE
        MOUSE_UP

=====================================================
*/
export class Canvas implements ISubject { //Contener（委譲）を利用
    public static ENTER_FRAME: string = "enterframe";
    public static MOUSE_DOWN: string = "mousedown";
    public static MOUSE_UP: string = "mouseup";
    public static MOUSE_MOVE: string = "mousemove";
    private _canvas;
    private _container: Container; //委譲
    private _context2D;
    private _enabledMouseMove: boolean = false;
    private _enterframeHandler: Function;
    private _eventThrough: boolean = true;
    private _fps: number = 33; //30.3030...fps
    private _height: number;
    private _mousedownHandler: Function;
    private _mouseupHandler: Function;
    private _mousemoveHandler: Function;
    private _container_observerArray: any[];
    private _screenColor: string;
    private _timerID: number;
    private _width: number;
    
    constructor(_id_or_width: any, _height?: number) {
        if (typeof _id_or_width == "string") { //Canvas("myCanvas");
            this._canvas = document.getElementById(_id_or_width);
            this._width = this._canvas.width;
            this._height = this._canvas.height;

        } else if (typeof _id_or_width == "number") { //ex.Canvas(720,1280)
            this._canvas = document.createElement("canvas");
            this._canvas.width = this._width = _id_or_width;
            this._canvas.height = this._height = _height;
            document.body.appendChild(this._canvas);

        }       

        this._context2D = this._canvas.getContext("2d");
        this._timerID = setInterval(this.loop,this._fps);
        this._canvas.addEventListener("mousedown", this.mousedown_canvas, false);
        this._canvas.addEventListener("mouseup", this.mouseup_canvas, false);

        this._container = new Container(); //委譲
    }

    //===============
    // Public Method
    //===============
    public addChild(_displayObject: IObserver): void { //= addObserver()
        this._container.addChild(_displayObject); //委譲
    }

    public addEventListener(_event: string, _function: Function): void {
        switch (_event) {
            case "enterframe": this._enterframeHandler = _function; break;
            case "mousedown": this._mousedownHandler = _function; break;
            case "mousemove": this._mousemoveHandler = _function; break;
            default: alert("ERROR: Canvas.addEventListener()");
        }
    }

    public deleteChild(_displayObject: IObserver): void { //= deleteObserver()
        this._container.deleteChild(_displayObject); //委譲
    }

    public drawScreen(_color: string = "#ffffff"): void { //= notify() ++
        //背景色の描画。
        this._screenColor = _color;
        this._context2D.fillStyle = this._screenColor;
        this._context2D.fillRect(0, 0, this._canvas.width, this._canvas.height);

        this._container_observerArray = this._container.getObserverArray();

        for (var i in this._container_observerArray) { //this._observerArray) {
            this._context2D.save(); //保存。
            this._context2D.setTransform(1,0,0,1,0,0); //座標系のリセット（決め打ち）。

            var _observer = this._container_observerArray[i];

            //回転基準点の変更（無いと左上端が基準）。
            this._context2D.translate(_observer.x + _observer.regX, _observer.y + _observer.regY);

            this._context2D.rotate(_observer.rotateRadian); //回転。
            var _theData = _observer.update(); //Observer Pattern

            if (_theData == undefined) {
                return;
            }

            if (_theData.type != "Container") { //入れ子ではない場合…。
                this.commonAction(_theData); //描画。
                this._context2D.restore(); //復元。
            
            } else { //入れ子の場合…。
                for (var j in _observer.getObserverArray()) {
                    
                    this._context2D.save(); //保存。

                    var _childObserver = _observer.getObserverArray()[j];
                    var _theChildData = _childObserver.update();

                    //再び…回転基準点変更。
                    this._context2D.translate(_childObserver.x + _childObserver.regX - _observer.regX,
                                              _childObserver.y + _childObserver.regY - _observer.regY);

                    if (_theChildData.type != "Container") {
                        this._context2D.rotate(_childObserver.rotateRadian); //再び…回転。
                        this.commonAction(_theChildData); //描画。
                        this._context2D.restore(); //復元。
                    } else {
                        alert("ERROR: Canvas.drawScreen(): multiplex nest is impossible.");
                    }
                }
            }
            
        }

        this._context2D.restore(); //復元。
    }

    public enabledMouseMove(_bool: boolean): void {
        this._enabledMouseMove = _bool;
        if (this._enabledMouseMove) {
            this._canvas.addEventListener("mousemove", this.mousemove_canvas, false);
        } else {
            this._canvas.removeEventListener("mousemove", this.mousemove_canvas, false);
        }
    }

    public getDepthElement(_depth: number): IObserver { //The object of some depth
        return this._container.getDepthElement(_depth); //委譲
    }

    public getDepthIndex(_displayObject: IObserver): number { //The depth of some objects
        return this._container.getDepthIndex(_displayObject); //委譲
    }

    public getDepthMax(): number {
        return this._container.getDepthMax(); //委譲
    }

    public removeEventListener(_event: string): void {
        switch (_event) {
            case "enterframe": this._enterframeHandler = undefined; break;
            case "mousedown": this._mousedownHandler = undefined; break;
            case "mouseup": this._mousedownHandler = undefined; break;
            case "mousemove": this._mousemoveHandler = undefined; break;
            default: alert("ERROR: Canvas.removeEventListener()");
        }
    }

    public reload(): void { //for Debugging
        this._context2D.fillRect(-this._canvas.width/2,
                                 -this._canvas.height/2,
                                 this._canvas.width,
                                 this._canvas.height);
    }

    public setDepthIndex(_displayObject: IObserver, _depth: number): void {
        this._container.setDepthIndex(_displayObject, _depth);
    }

    public stopEvent(): void {
        this._eventThrough = false;
    }

    //================
    // Private Method
    //================
    private commonAction(_theData: any): void {
        switch(_theData.type) {
            case "Sprite": 
                this._context2D.drawImage(
                    _theData.image,
                    0,
                    0,
                    _theData.width,
                    _theData.height,
                    - _theData.regX,
                    - _theData.regY,
                    _theData.width * _theData.scaleX,
                    _theData.height * _theData.scaleY
                    );
                break;

            case "SpriteSheet": 
                this._context2D.drawImage(
                    _theData.image,
                    _theData.frameX,
                    _theData.frameY,
                    _theData.width,
                    _theData.height,
                    - _theData.regX,
                    - _theData.regY,
                    _theData.width * _theData.scaleX,
                    _theData.height * _theData.scaleY
                    );
                break;

            case "Text": 
                this._context2D.font = _theData.size * _theData.scale + "px " + _theData.font;
                this._context2D.textBaseline = _theData.baseline;
                this._context2D.textAlign = _theData.align;
                this._context2D.fillStyle = _theData.fillStyle;
                this._context2D.fillText(
                    _theData.fillText,
                    - _theData.regX,
                    - _theData.regY
                    );
                break;

            case "Video": 
                this._context2D.drawImage(
                    _theData.video,
                    0,
                    0,
                    _theData.originWidth, //ex.720
                    _theData.originHeight, //ex.1280
                    - _theData.regX,
                    - _theData.regY,
                    _theData.width * _theData.scaleX,
                    _theData.height * _theData.scaleY
                    );
                break;

            case "Line": 
                this._context2D.strokeStyle 
                = "rgba(" + _theData.lineColor + "," + _theData.lineAlpha + ")";
                this._context2D.lineWidth = _theData.lineWidth;
                this._context2D.beginPath();
                this._context2D.moveTo(- _theData.regX, - _theData.regY);
                this._context2D.lineTo(
                    - _theData.regX + _theData.endX - _theData.startX,
                    - _theData.regY + _theData.endY - _theData.startY
                    );
                this._context2D.stroke();
                break;

            case "Rect": 
                if (_theData.isFill) {
                    this._context2D.fillStyle
                    = "rgba(" + _theData.fillColor + "," + _theData.fillAlpha + ")";
                    this._context2D.fillRect(
                        - _theData.regX,
                        - _theData.regY,
                        - _theData.regX + _theData.endX - _theData.startX,
                        - _theData.regY + _theData.endY - _theData.startY
                        );
                }
                this._context2D.strokeStyle
                = "rgba(" + _theData.lineColor + "," + _theData.lineAlpha + ")";
                this._context2D.lineWidth = _theData.lineWidth;
                this._context2D.strokeRect(
                    - _theData.regX,
                    - _theData.regY,
                    _theData.endX - _theData.startX,
                    _theData.endY - _theData.startY
                    );
                break;

            default: "ERROR: Canvas.commonAction()";
        }
    }

    private loop = (): void => {
        this._enterframeHandler(this);
    }

    private mousedown_canvas = (_e: MouseEvent): void => {
        var _tempArray: any[] = this._container_observerArray.concat(); //Duplicate
        _tempArray.reverse();

        for (var i in _tempArray) {
            var _theObserver = _tempArray[i];
            if (_theObserver.hitTest != undefined) { //only Sprite & SpriteSheet
                if (_theObserver.isMouseDownHandler()) {
                    if (this._eventThrough) {
                        _theObserver.hitTest(_e.layerX, _e.layerY, this._context2D, this._screenColor);
                    } else {
                        this._eventThrough = true;
                        return;
                    }
                }
            }
        }
        if (this._eventThrough) {
            if (this._mousedownHandler != undefined) {
                this._mousedownHandler(this, _e);
            }
        }
    }

    private mouseup_canvas = (_e: MouseEvent): void => {
        var _tempArray: any[] = this._container_observerArray.concat(); //Duplicate
        _tempArray.reverse();

        for (var i in _tempArray) {
            var _theObserver = _tempArray[i];
            if (_theObserver.hitTest != undefined) { //only Sprite & SpriteSheet
                if (_theObserver.isMouseUpHandler()) {
                    if (this._eventThrough) {
                        _theObserver.hitTest(_e.layerX, _e.layerY, this._context2D, this._screenColor);
                    } else {
                        this._eventThrough = true;
                        return;
                    }
                }
            }
        }
        if (this._eventThrough) {
            if (this._mouseupHandler) {
                this._mouseupHandler(this, _e);
            }
        }
    }

    private mousemove_canvas = (_e: MouseEvent): void => {
        this._mousemoveHandler(this, _e);
    }

    //=================
    // Public Property
    //=================
    get fps(): number { return 1000/this._fps; }
    set fps(_fps: number) {
        clearInterval(this._timerID);
        this._fps = 1000/_fps;
        var _milliSec: number = Math.round(this._fps);
        this._timerID = setInterval(this.loop, _milliSec);
    }

    get height(): number { return this._height; }
    get width(): number { return this._width; }
}


/*
=====================================================
Container Class

    <Public Method>
        addChild(_displayObject: IObserver): void
        deleteChild(_displayObject: IObserver): void
        getDepthElement(_depth: number): IObserver
        getDepthIndex(_displayObject: IObserver): number
        getDepthMax(): number
        setDepthIndex(_displayObject: IObserver, _depth: number): void
 
    <Public Property>
        name: string
        regX: number
        regY: number
        rotate: number
        rotateRadian: number
        scaleX: number (≒Read Only)
        scaleY: number (≒Read Only)
        x: number
        y: number

=====================================================
*/
export class Container extends DisplayObject implements IObserver {
    private _observerArray: any[] = [];

    constructor() { super(); }

    //===============
    // Public Method
    //===============
    public addChild(_displayObject: IObserver): void { //= addObserver()
        this._observerArray.push(_displayObject);
    }

    public deleteChild(_displayObject: IObserver): void { //= deleteObserver()
        var _theNum: number = this._observerArray.indexOf(_displayObject,0);
        if (_theNum != -1) this._observerArray.splice(_theNum,1);
    }

    public getDepthElement(_depth: number): IObserver { //The object of some depth 
        return this._observerArray[_depth];
    }

    public getDepthIndex(_displayObject: IObserver): number { //The depth of some objects
        return this._observerArray.indexOf(_displayObject, 0); //When not found "-1"
    }

    public getDepthMax(): number { //The top depth
        return this._observerArray.length - 1;
    }

    public setDepthIndex(_displayObject: IObserver, _depth: number): void {
        var _targetNum: number = this.getDepthIndex(_displayObject);
        if (_targetNum == _depth) { //When depth is not changed
            return;
        } else {
            this._observerArray.splice(_targetNum,1); //Only an object is deleted
            var _deleteArray: IObserver[];
            _deleteArray = this._observerArray.splice(_depth); //delete
            this._observerArray.push(_displayObject);
            this._observerArray = this._observerArray.concat(_deleteArray);
        }
    }

    //================
    // Secret Method
    //================
    getObserverArray(): any[] { //委譲用（Canvas Classで利用）
        return this._observerArray;
    }

    update(): any { //for Observer Pattern
        return this.getData();
    }

    //================
    // Private Method
    //================
    private getData(): any {
        return { type: "Container" };
    }

    //=================
    // Public Property
    //=================
    get scaleX(): number { return 1.0; } //Override
    set scaleX(_scaleX: number) { alert("ERROR: Container.scaleX(): NOT CHANGED"); } //Override

    get scaleY(): number { return 1.0; } //Override
    set scaleY(_scaleY: number) { alert("ERROR: Container.scaleY(): NOT CHANGED"); } //Override
}

/*
=====================================================
Sprite Class

    <Public Method>
        addEventListener(_event: string, _function: Function, _isCircle: boolean=false): void
        removeEventListener(_event: string): void
 
    <Public Property>
        height: number
        image: HTMLImageElement (Read Only)
        name: string
        regX: number
        regY: number
        rotate: number
        rotateRadian: number
        scaleX: number
        scaleY: number
        width: number
        x: number
        y: number
 
    <Event>
        LOAD
        MOUSE_DOWN
        MOUSE_UP

=====================================================
*/
export class Sprite extends DisplayObject implements IObserver {
    public static LOAD: string = "load";
    public static MOUSE_DOWN: string = "mousedown";
    public static MOUSE_UP: string = "mouseup";
    private _height: number;
    private _hitTestIsCircle: boolean; //Rect: false, Circle: true
    private _image: HTMLImageElement;
    private _loadHandler: Function;
    private _mousedownHandler: Function;
    private _mouseupHandler: Function;
    private _width: number;
    private _isMouseDown: boolean = false;
    
    constructor(_path: string) {
        super();

        this._image = new Image();
        this._image.src = _path;
        this._image.addEventListener("load", this.load_image, false);
    }

    //===============
    // Public Method
    //===============
    public addEventListener(_event: string, _function: Function, _isCircle: boolean=false): void {
        switch (_event) {
            case "mousedown": this._mousedownHandler = _function; break;
            case "mouseup": this._mouseupHandler = _function; break;
            case "load": this._loadHandler = _function; break;
            default: alert("ERROR: Sprite.addEventListener()");
        }
        this._hitTestIsCircle = _isCircle;
    }

    public removeEventListener(_event: string): void {
        switch (_event) {
            case "mousedown": this._mousedownHandler = undefined; break;
            case "mouseup": this._mouseupHandler = undefined; break;
            case "load": this._loadHandler = undefined; break;
            default: alert("ERROR: canvaslite.Sprite.removeEventListener()");
        }
    }

    //===============
    // Secret Method
    //===============
    getData(): any {
        var _obj: any = {};
        _obj.type = "Sprite";
        _obj.width = this.width;
        _obj.height = this.height;
        _obj.image = this._image;
        _obj.regX = this.regX;
        _obj.regY = this.regY;
        _obj.x = this.x;
        _obj.y = this.y;
        _obj.scaleX = this.scaleX;
        _obj.scaleY = this.scaleY;
        return _obj;
    }

    hitTest(_mouseX: number, _mouseY: number, _context2D, _color: string): void {
        var _obj: any = this.getData();
        var _left: number = _obj.x;
        var _top: number = _obj.y;
        var _right: number = _left + _obj.width;
        var _bottom: number = _top + _obj.height;

        if (! this._isMouseDown) {
            if (_mouseX < _right) {
                if (_left < _mouseX) {
                    if (_top < _mouseY) {
                        if (_mouseY < _bottom) {
                            if (! this._hitTestIsCircle) { //for Rectangle
                                    var _imageData = _context2D.getImageData(_mouseX,_mouseY,1,1);
                                    var _r: number = _imageData.data[0];
                                    var _g: number = _imageData.data[1];
                                    var _b: number = _imageData.data[2];
                                    var _a: number = _imageData.data[3];

                                    var _rColor: number = parseInt(_color.substr(1,2),16); //ex.255
                                    var _gColor: number = parseInt(_color.substr(3,2),16); //ex.204
                                    var _bColor: number = parseInt(_color.substr(5,2),16); //ex.0

                                    var _theColor: number[] = [_rColor, _gColor, _bColor, 255];
                                    if ((_r != _theColor[0]) || (_g != _theColor[1]) || (_b != _theColor[2]) || (_a != _theColor[3])) {
                                        this._mousedownHandler(this);
                                        if (this._mouseupHandler != undefined) {
                                            this._isMouseDown = true;
                                        }
                                    }

                            } else { //for Circular                         
                                var _radius: number = _obj.width/2;
                                var _centerX: number = this.x + _radius;
                                var _centerY: number = this.y + _radius;
                                var _disX: number = _mouseX - _centerX;
                                var _disY: number = _mouseY - _centerY;

                                //Pythagorean theorem
                                if (Math.sqrt((_disX * _disX) + (_disY * _disY)) <= _radius) {
                                    this._mousedownHandler(this);
                                    if (this._mouseupHandler != undefined) {
                                        this._isMouseDown = true;
                                    }
                                }
                            }

                        }
                    }
                }
            }
        } else {
            this._mouseupHandler(this);
            this._isMouseDown = false;
        }
    }

    isMouseDownHandler(): boolean {
        return (this._mousedownHandler != undefined);
    }

    isMouseUpHandler(): boolean {
        return (this._mouseupHandler != undefined);
    }

    load_image = (_e: Event) => { //If "PNG" can be read...
        this.height = this._image.height;
        this.width = this._image.width;
        if (this._loadHandler != undefined) {
            this._loadHandler(this);
        }
    }

    update(): any { //for Observer Pattern
        return this.getData();
    }

    //=================
    // public Property
    //=================
    get height(): number { return this._height; }
    set height(_height: number) { this._height = _height; }

    get image(): HTMLImageElement { return this._image; }

    get width(): number { return this._width; }
    set width(_width: number) { this._width = _width; }
}

/*
=====================================================
SpriteSheet Class

    <Public Method>
        addEventListener(): void
        gotoAndPlay(_frame: number): void
        gotoAndStop(_frame: number): void
        isPlay(): boolean
        load_image = (_e: Event)
        play(): void
        removeEventListener(): void
        stop(): void
 
    <Public Property>
        currentframe: number
        height: number
        image: HTMLImageElement (Read Only)
        currentframe: number (Read Only)
        name: string
        regX: number
        regY: number
        rotate: number
        rotateRadian: number
        scaleX: number
        scaleY: number
        totalframes: number (Read Only)
        width: number
        x: number
        y: number
 
    <Event>
        LOAD
        MOUSE_DOWN
        MOUSE_UP

=====================================================
*/
export class SpriteSheet extends Sprite implements IObserver {
    private _count: number;
    private _currentframe: number = 1;
    private _framesArray: any[];
    private _isReadystatechange: boolean = false;
    private _isPlay: boolean;
    private _jsonURL: string;
    private _pngURL: string;
    private _request;
    private _state: string = "play"; //or "stop"
    private _totalframes: number;

    constructor(_path: string) {
        super(_path);
        
        if (_path.lastIndexOf(".png") != -1) {
            var _theURL: string = _path.substr(0, _path.lastIndexOf(".png"));
        } else {
            _theURL = _path;
        }

        this._pngURL = _theURL + ".png";
        this._jsonURL = _theURL + ".json";

        this.image = new Image();
        this.image.src = this._pngURL;
        this.image.addEventListener("load", this.load_image, false);
    }

    //===============
    // Public Method
    //===============
    public gotoAndPlay(_frame: number): void {
        if ((_frame <= 0) || (this._totalframes < _frame)) {
            alert("ERROR: SpriteSheetM.gotoAndPlay()");
            return;
        }
        this._currentframe = _frame;
        if (_frame != 0) {
            this._count = _frame - 1;
        } else {
            this._count = 0;
        }
        this.play();
    }

    public gotoAndStop(_frame: number): void {
        if ((_frame <= 0) || (this._totalframes < _frame)) {
            alert("ERROR: SpriteSheetM.gotoAndPlay()");
            return;
        }
        this._currentframe = _frame;
        if (_frame != 0) {
            this._count = _frame - 1;
        } else {
            this._count = 0;
        }
        this.stop();
    }

    public isPlay(): boolean {
        if (this._state == "play") {
            return true;
        } else if (this._state == "stop") {
            return false;
        }
    }

    public play(): void {
        this._state = "play";
    }

    public stop(): void {
        this._state = "stop";
    }

    //===============
    // Secret Method
    //===============
    update(): any { //Override
        if (this._state == "play") {
            this._count = (++ this._count) % this._totalframes;
            if (this._count != 0) {
                this._currentframe = this._count;
            } else {
                this._currentframe = this._totalframes;
            }
        }
        return this.getData();
    }

    //===============
    // private Method
    //===============
    getData(): any { //Override
        if (this._isReadystatechange) {
            if (this._framesArray == undefined) {
                return;
            }
            var _theFrameObj: any = this._framesArray[this._count];

            var _obj: any = {};
            _obj.type = "SpriteSheet";
            _obj.frameX = _theFrameObj.frame.x;
            _obj.frameY =_theFrameObj.frame.y;
            _obj.width = _theFrameObj.frame.w;
            _obj.height = _theFrameObj.frame.h;
            _obj.image = this.image;
            _obj.regX = this.regX;
            _obj.regY = this.regY;
            _obj.x = this.x;
            _obj.y = this.y;
            _obj.scaleX = this.scaleX;
            _obj.scaleY = this.scaleY;
            return _obj;
        }
    }

    load_image = (_e: Event) => { //If "PNG" of "SpriteSheet" can be read...
        this._request = new XMLHttpRequest();
        this._request.addEventListener("readystatechange", this.readystatechange_request, false);
        this._request.open("GET", this._jsonURL);
        this._request.send(null);
    }

    private readystatechange_request = () => { //If "JSON-Array" of "SpriteSheet" can be read...
        this._isReadystatechange = true;
        if (this._request.readyState == 4) {
            if (this._request.status == 200) {
                var _json = JSON.parse(this._request.responseText);
                this._framesArray = _json.frames;
                this._totalframes = this._framesArray.length;
                this._count = 0; //Initialization!
            }
        }
    }

    //=================
    // Public Property
    //=================
    get currentframe(): number { return this._currentframe; }

    get totalframes(): number { return this._totalframes; }
}

/*
=====================================================
Text Class

    <Public Property>
        align: string
        baseline: string
        color: string
        font: string
        name: string
        regX: number
        regY: number
        rotate: number
        rotateRadian: number
        scale: number
        scaleX: number
        scaleY: number 
        size: number
        text: string
        x: number
        y: number

=====================================================
*/
export class Text extends DisplayObject implements IObserver {
    private _align: string = "left"; //"start","center","left","right"
    private _baseline: string = "top"; //"top","middle","bottom"
    private _color: string = "0,0,0";
    private _font: string = "san-serif"; //serif,san-serif,cursive,fantasy,monospace
    private _scale: number = 1.0;
    private _size: number = 10;
    private _text: string;

    constructor(_text: string) {
        super();
        this._text = _text;
    }

    //===============
    // Secret Method
    //===============
    update(): any { //for Observer Pattern
        var _obj: any = {};
        _obj.type = "Text";
        _obj.size = this._size;
        _obj.font = this._font;
        _obj.fillStyle = "rgba(" + this._color + ",1.0)";
        _obj.fillText = this._text;
        _obj.baseline = this._baseline;
        _obj.align = this._align;
        _obj.regX = this.regX;
        _obj.regY = this.regY;
        _obj.scale = this.scale;
        return _obj;
    }

    //=================
    // Public Property
    //=================
    get align(): string { return this._align; }
    set align(_align: string) { this._align = _align; } //"start","center","left","right"

    get baseline(): string { return this._baseline; }
    set baseline(_baseline: string) { this._baseline = _baseline; } //"top","middle","bottom"

    get color(): string { return this._color; } //ex. "255,204,0"
    set color(_color: string) { //"#ffcc00"="255,204,0"
        var _rColor: number = parseInt(_color.substr(1,2), 16); //ex. 255
        var _gColor: number = parseInt(_color.substr(3,2), 16); //ex. 204
        var _bColor: number = parseInt(_color.substr(5,2), 16); //ex. 0
        this._color = _rColor + "," + _gColor + "," + _bColor;
    }

    get font(): string { return this._font; }
    set font(_font: string) { this._font = _font; } //serif,san-serif,cursive,fantasy,monospace

    get scale(): number { return this._scale; } //Default: 1.0
    set scale(_scale: number) { this._scale = _scale; } //Default: 1.0

    get scaleX(): number { return this._scale; } //Override（=Text.scale）
    set scaleX(_scaleX: number) { this._scale = _scaleX; } //Override（=Text.scale）

    get scaleY(): number { return this._scale; } //Override（=Text.scale）
    set scaleY(_scaleY: number) { this._scale = _scaleY; } //Override（=Text.scale）

    get size(): number { return this._size; }
    set size(_size: number) { this._size = _size; }

    get text(): string { return this._text; }
    set text(_text: string) { this._text = _text; }
}

/*
=====================================================
Sound Class

    <Public Method>
        addEventListener(_event: string, _function: Function): void
        fadeOut(_sec: number = 1): void
        isLoaded(): boolean
        pause(): void
        play(): void
        removeEventListener(_event: string): void
        stop(): void        

    <Public Property>
        currentTime: number
        duration: number (Read Only)
        loop: boolean
        name: string
        volume: number

    <Event>
        ENDED

=====================================================
*/
export class Sound {
    public static ENDED: string = "ended";
    private _audio: HTMLAudioElement;
    private _endedHandler: Function;
    private _fadeoutTime: number;
    private _isLoaded: boolean = false;
    private _name: string;
    private _timerID: number; //for clearInterval()
    private _volume: number;    

    constructor(_path: string) {
        this._audio = new Audio(_path);
        this._audio.loop = false;
        this._audio.autoplay = false;
        this._audio.addEventListener("ended", this.ended_audio, false);
        this._audio.addEventListener("canplaythrough", this.audioLoaded, false);
    }

    //===============
    // Public Method
    //===============
    public addEventListener(_event: string, _function: Function): void {
        switch (_event) {
            case "ended": this._endedHandler = _function; break;
            default: alert("ERROR: canvaslite.Sound.addEventListener()");
        }
    }

    public fadeOut(_sec: number = 1): void { //ex.2.5(sec)
        this._fadeoutTime = _sec;
        this._timerID = setInterval(this.faceOutLoop, 50); //20fps
    }

    public isLoaded(): boolean { //Needlessness? 
        return this._isLoaded;
    }

    public pause(): void {
        this._audio.pause();
    }

    public play(): void {
        this._audio.play();
    }

    public removeEventListener(_event: string): void {
        switch (_event) {
            case "ended": this._endedHandler = undefined; break;
            default: alert("ERROR: Sound.removeEventListener()");
        }
    }

    public stop(): void {
        this._audio.pause();
        this._audio.currentTime = 0;
        this._audio.volume = 1.0;
    }

    //================
    // Private Method
    //================
    private audioLoaded = () => {
        this._isLoaded = true;
    }

    private ended_audio = () => { //does not perform, when "loop" is "true". 
        if (this._endedHandler != undefined) {
            this._endedHandler(this);
        }
    }

    private faceOutLoop = (): void => {
        var _nextVolume: number 
        = this._audio.volume - 0.05/this._fadeoutTime;
        if (_nextVolume > 0) {
            this._audio.volume = _nextVolume;
        } else {
            this.stop();
            clearInterval(this._timerID);
        }
    }

    //=================
    // Public Property
    //=================
    get currentTime(): number { return this._audio.currentTime; }
    set currentTime(_sec: number) { this._audio.currentTime = _sec; }

    get duration(): number { return this._audio.duration; }

    get loop(): boolean { return this._audio.loop; }
    set loop(_isLoop: boolean) { this._audio.loop = _isLoop; }  

    get name(): string { return this._name; }
    set name(_name: string) { this._name = _name; }

    get volume(): number { return this._audio.volume; }
    set volume(_volume: number) { this._audio.volume = _volume; }
}

/*
=====================================================
Video Class

    <Public Method>
        isLoaded(): boolean
        pause(): void
        play(): void
        stop(): void
     
    <Public Property>
        currentTime: number
        duration: number (Read Only)
        height: number
        name: string
        regX: number
        regY: number
        rotate: number
        rotateRadian: number
        scaleX: number
        scaleY: number
        width: number
        x: number
        y: number

=====================================================
*/
export class Video extends DisplayObject implements IObserver {
    private _height: number; // = 480;
    private _isLoaded: boolean = false;
    private _originWidth: number;
    private _originHeight: number;
    private _url: string;
    private _video;
    private _width: number; // = 640;

    constructor(_path: string, _originWidth: number, _originHeight: number) {
        super();
        this._url = _path;
        this._originWidth = this.width = _originWidth;
        this._originHeight = this.height = _originHeight;
        this._video = document.createElement("video");
        this._video.src = this._url;
        this._video.loop = true;
        this._video.autoplay = true;
        this._video.addEventListener("canplaythrough", this.load_video, false);
    }

    //===============
    // Public Method
    //===============
    public isLoaded(): boolean { //Needlessness? 
        return this._isLoaded;
    }

    public pause(): void {
        this._video.pause();
    }

    public play(): void {
        this._video.play();
    }

    public stop(): void {
        this._video.pause();
        this._video.currentTime = 0;
    }

    //===============
    // Secret Method
    //===============
    update(): any { //for Observer Pattern
        var _obj: any = {};
        _obj.type = "Video";
        _obj.width = this._width;
        _obj.height = this._height;
        _obj.originWidth = this._originWidth;
        _obj.originHeight = this._originHeight;
        _obj.video = this._video;
        _obj.regX = this.regX;
        _obj.regY = this.regY;
        _obj.scaleX = this.scaleX;
        _obj.scaleY = this.scaleY;
        return _obj;
    }

    //================
    // Private Method
    //================
    private load_video = (_e: Event) => {
        this._isLoaded = true;
    }

    //=================
    // Public Property
    //=================
    get currentTime(): number { return this._video.currentTime; }
    set currentTime(_sec: number) { this._video.currentTime = _sec; }

    get duration(): number { return this._video.duration; }

    get height(): number { return this._height; }
    set height(_height: number) { this._height = _height; }

    get width(): number { return this._width; }
    set width(_width: number) { this._width = _width; }
}

/*
=====================================================
Line Class

    <Public Property>
        endX: number
        endY: number
        lineAlpha: number
        lineColor: string
        lineWidth: number
        name: string
        regX: number
        regY: number
        rotate: number
        rotateRadian: number
        scaleX: number
        scaleY: number
        x: number
        y: number

=====================================================
*/
export class Line extends DisplayObject implements IObserver {
    private _endX: number;
    private _endY: number;
    private _lineAlpha: number = 1.0;
    private _lineColor: string = "0,0,0";
    private _lineWidth: number = 1;

    constructor(_startX: number = 0, _startY: number = 0,
                _endX: number = 100, _endY: number = 100) 
    {
        super();
        this.x = _startX;
        this.y = _startY;
        this._endX = _endX;
        this._endY = _endY;
    }

    //================
    // Secret Method
    //================
    update(): any { //for Observer Pattern
        var _obj: any = {};
        _obj.type = "Line";
        _obj.startX = this.x;
        _obj.startY = this.y;
        _obj.endX = this.endX;
        _obj.endY = this.endY;
        _obj.lineWidth = this.lineWidth;
        _obj.lineColor = this.lineColor;
        _obj.lineAlpha = this.lineAlpha;
        _obj.regX = this.regX;
        _obj.regY = this.regY;
        return _obj;
    }

    //=================
    // Public Property
    //=================
    get endX(): number { return this._endX; }
    set endX(_endX: number) { this._endX = _endX; }

    get endY(): number { return this._endY; }
    set endY(_endY: number) { this._endY = _endY; }

    get lineAlpha(): number { return this._lineAlpha; }
    set lineAlpha(_alpha: number) {
        if ((_alpha < 0) || (_alpha > 1)) {
            alert("ERROR: Line.setLineAlpha()");
        } else {
            this._lineAlpha = _alpha;
        }
    }

    get lineColor(): string { return this._lineColor; }
    set lineColor(_color: string) { this._lineColor = _color; } //ex."255,204,0"
    
    get lineWidth(): number { return this._lineWidth; }
    set lineWidth(_lineWidth: number) { this._lineWidth = _lineWidth; }

    get scaleX(): number { return 1.0; } //Override
    set scaleX(_scaleX: number) { alert("ERROR: Line.scaleX(): NOT CHANGED"); } //Override

    get scaleY(): number { return 1.0; } //Override
    set scaleY(_scaleY: number) { alert("ERROR: Line.scaleY(): NOT CHANGED"); } //Override
}

/*
=====================================================
Rect Class

    <Public Property>
        endX: number
        endY: number
        fillAlpha: number
        fillColor: number
        isFill: boolean
        lineAlpha: number
        lineColor: string
        lineWidth: number
        name: string
        regX: number
        regY: number
        rotate: number
        rotateRadian: number
        scaleX: number
        scaleY: number
        x: number
        y: number

=====================================================
*/
export class Rect extends Line implements IObserver {
    private _fillAlpha: number = 1.0;
    private _fillColor: string = "255,255,255";
    private _isFill: boolean = false;

    constructor(_startX: number = 0, _startY: number = 0,
                _endX: number = 100, _endY: number = 100)
    {
        super();
        this.x = _startX;
        this.y = _startY;
        this.endX = _endX;
        this.endY = _endY;
    }

    //===============
    // Public Method
    //===============
    public isFill(_isFill: boolean): void {
        this._isFill = _isFill;
    }

    //===============
    // Secret Method
    //===============
    update(): any { //Override
        var _obj: any = {};
        _obj.type = "Rect";
        _obj.startX = this.x;
        _obj.startY = this.y;
        _obj.endX = this.endX;
        _obj.endY = this.endY;
        _obj.lineWidth = this.lineWidth;
        _obj.lineColor = this.lineColor;
        _obj.lineAlpha = this.lineAlpha;
        _obj.isFill = this._isFill;
        _obj.fillColor = this.fillColor;
        _obj.fillAlpha = this.fillAlpha;
        _obj.regX = this.regX;
        _obj.regY = this.regY;
        return _obj;
    }

    //=================
    // Public Property
    //=================
    get fillAlpha(): number { return this._fillAlpha; }
    set fillAlpha(_fillAlpha: number) { this._fillAlpha = _fillAlpha; }

    get fillColor(): string { return this._fillColor; }
    set fillColor(_fillColor: string) { this._fillColor = _fillColor; } //ex."255,204,0"
}

} //Module END
