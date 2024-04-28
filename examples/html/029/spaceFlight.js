// spaceFlight.js
addEventListener("load", load_window, false);

function load_window() {
    var _canvas = new canvaslite.Canvas("canvas_spaceFlight");
    _canvas.addEventListener("enterframe", enterframe_canvas); 	_canvas.enabledContextMenu(false);
    _canvas.enabledContextMenu(false);
    _canvas.fps = 60;

    //Birth Star
    _starArray = [];
    for (let i=0; i<1500; i++) {
        let _star = new Star();
        _canvas.addChild(_star);
        _starArray.push(_star);
    }

    //視点と投影面までの距離
    _projectDistance = 100;
}

enterframe_canvas = (_canvas) => {
    for (let _indexNum in _starArray) {
        var _star = _starArray[_indexNum];
        var _nextZ = _star.z3D - 20; //速度
        if (_nextZ <= 0) {
            _nextZ = 10000;
        }
        _star.fillAlpha = 1 - _nextZ/10000;
        _star.z3D = _nextZ;

        // 1. 透視投影変換（相似三角関係）
        var _x2D = _star.x3D * _projectDistance / _star.z3D;
        var _y2D = _star.y3D * _projectDistance / _star.z3D;

        // 2. ステージへの描画（投影面、ステージの原点のズレを補正）
        _star.centerX = _x2D + _canvas.width / 2;
        _star.centerY = _y2D + _canvas.height / 2;

        // 3. スケーリング（投影面で原寸大）
        var _scale = _projectDistance /_star.z3D;
        _star.radius = _star.originRadius * _scale;
    }

    _canvas.drawScreen("#222222");
}

class Star extends canvaslite.Circle {
  constructor() {
    super();

    this.radius = this.__originRadius = 20;
    this.isFill(true);
    var _r, _g, _b;
    _r = _g =  Math.round(200 + Math.random()*55);
    _b = Math.round(30 + Math.random()*170);
    this.fillColor = this.lineColor = _r + "," + _g + "," + _b;
    this.fillAlpha = 1.0;
    this.lineAlpha = 0;

    //3D座標空間位置
    this.__x3D = Math.random() * 3000 - 1500; //-5000〜+5000
    this.__y3D = Math.random() * 3000 - 1500;
    this.__z3D = Math.random() * 10000; //0〜10000

    return this;
  }

  get originRadius() { return this.__originRadius; }
  get x3D() { return this.__x3D; }
  get y3D() { return this.__y3D; }
  get z3D() { return this.__z3D; }
  set z3D(_newValue) { this.__z3D = _newValue; }
}