_param1 = location.search.match(/param1=(.*?)(&|$)/)[1];
console.log(_param1);
_param2 = location.search.match(/param2=(.*?)(&|$)/)[1];
console.log(_param2);

addEventListener("load", load_window, false);

function load_window() {
    _isMove = false;
    _choiceBitmap = undefined;
    _disX = _disY = 0;
    _mouseX = _mouseY = 0;

    //Canvas
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.addEventListener("mousemove", mousemove_canvas);
    _canvas.enabledMouseMove(true);
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true)
    _canvas.fps = 60;

    //Bitmap
    for (let i = 0; i < 40; i++) { //52枚
        var _bitmap = new toile.Bitmap("card.png");
        _canvas.addChild(_bitmap);

        _bitmap.name = "bitmap" + i;
        _bitmap.x = 50 + (_canvas.width - 240) * Math.random();
        _bitmap.y = 50 +  (_canvas.height - 300) * Math.random();
        _bitmap.regX = 50;
        _bitmap.regY = 75;

        _bitmap.addEventListener("mousedown", mousedown_bitmap);
        _bitmap.addEventListener("mouseup", mouseup_bitmap);
        _bitmap.addEventListener("mouseupoutside", mouseup_bitmap);
        _bitmap.addEventListener("load", load_bitmap);

    }
}

load_bitmap = (_bitmap) => {
    //console.log(_bitmap.width, _bitmap.height);
    _bitmap.width = 140;
    _bitmap.height = 200;
}

enterframe_canvas = (_canvas) => {
    if (_isMove) {
        _mouseX = _canvas.mouseX; //for Mobile
        _mouseY = _canvas.mouseY; //for Mobile
        _choiceBitmap.x = _mouseX - _disX;
        _choiceBitmap.y = _mouseY - _disY;
    }
    _canvas.drawScreen();
}

mousedown_bitmap = (_bitmap) => {
    //console.log("mouseDown: " + _bitmap.name);
    _canvas.setDepthIndex(_bitmap, _canvas.getDepthMax());
    _canvas.stopMouseDownEvent();
    _isMove = true;
    _choiceBitmap = _bitmap;

    _disX = _canvas.mouseX - _bitmap.x;
    _disY = _canvas.mouseY - _bitmap.y;
}

mouseup_bitmap = (_bitmap) => {
    console.log("mouseUp: " + _bitmap.name);
    _canvas.stopMouseUpEvent();
    _isMove = false;
    _choiceBitmap = undefined;
}

mousemove_canvas = (_canvas) => {
    _mouseX = _canvas.mouseX;
    _mouseY = _canvas.mouseY;
}