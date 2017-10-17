addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.addEventListener("mouseup", mouseup_canvas);
    _canvas.fps = 60;
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "dummy.png";
    _canvas.isBorder(true);
    _canvas.borderWidth = 2;

    /*
    _bitmap = new toile.Bitmap("yubi.png");
    _bitmap.alpha = 0.2;
    _bitmap.x = _canvas.width/2 - 50;
    _bitmap.y = _canvas.height/2 - 80;
    _canvas.addChild(_bitmap);
    */
    _gridStatus = "off"; //Gridの表示状態
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#ffffff");
}

mouseup_canvas = (_canvas) => {
    if (_gridStatus == "off") {
        _grid = new Grid(_canvas,17,9); //Canvasを横17,縦9に分割
        _grid.lineColor = "187,187,187"; //"204,204,204"; //初期値"0,0,0"
        _grid.lineWidth = 4; //初期値1
        _grid.in(2); //初期値2（秒）
        _grid.addEventListener("in", in_grid);
        _gridStatus = "animate"; //Gridの表示状態
    }
}

in_grid = (_grid) => {
    _gridStatus = "on"; //Gridの表示状態
    _grid.removeEventListener("in");

    _blockWidth = _canvas.width / 17;
    _blockHeight = _canvas.height / 9;

    //ボタン1の表示準備
    _button1 = new BitmapPlus("red.png", true, "255,255,255", "0,0,0",4);
    _button1.name = "button1";
    _button1.addEventListener("mouseup", mouseup_button);
    _button1.addEventListener("delete", delete_button);
    _button1.x = _blockWidth*2;
    _button1.y = _blockHeight*3;
    _canvas.addChild(_button1);
    _button1.in(1); //ボタンの表示開始（初期値1）

    //ボタン2の表示準備
    _button2 = new BitmapPlus("red.png", true, "255,255,255", "0,0,0",4);
    _button2.name = "button2";
    _button2.addEventListener("mouseup", mouseup_button);
    _button2.addEventListener("delete", delete_button);
    _button2.x = _blockWidth*7;
    _button2.y = _blockHeight*3;
    _canvas.addChild(_button2);
    _button2.in(1); //ボタンの表示開始（初期値1）

    //ボタン3の表示準備
    _button3 = new BitmapPlus("red.png", true, "255,255,255", "0,0,0",4);
    _button3.name = "button3";
    _button3.addEventListener("mouseup", mouseup_button);
    _button3.addEventListener("delete", delete_button);
    _button3.x = _blockWidth*12;
    _button3.y = _blockHeight*3;
    _canvas.addChild(_button3);
    _button3.in(1); //ボタンの表示開始（初期値1）
}

out_grid = (_grid) => {
    _gridStatus = "off";
    _grid.removeEventListener("in");
    console.log(_canvas);
}

mouseup_button = (_bitmap) => {
    switch (_bitmap.name) {
        case "button1":
            _button2.out(1);
            _button3.out(1);
            break;
        case "button2":
            _button1.out(1);
            _button3.out(1);
            break;
        case "button3":
            _button1.out(1);
            _button2.out(1);
    }
}

delete_button = (_bitmap) => {
    _canvas.deleteChild(_button1);
    _canvas.deleteChild(_button2);
    _canvas.deleteChild(_button3);
    _grid.out(); //初期値2（秒）
    _grid.addEventListener("out", out_grid);
    _gridStatus = "animate"; //Gridの表示状態
}