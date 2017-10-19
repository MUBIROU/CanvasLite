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

    _gridStatus = "off"; //Gridの表示状態

    // _spriteSheetButton1 = new SpriteSheetPlus("spriteSheetButton1.png");
    // _spriteSheetButton1.scale = 1;
    // _spriteSheetButton1.x = _spriteSheetButton1.y = 100;
    // _spriteSheetButton1.fps = 5;
    // _canvas.addChild(_spriteSheetButton1);

    //===============
    // Gridの表示準備
    //===============
    _grid = new Grid(_canvas,17,9); //Canvasを横17,縦9に分割
    _grid.lineColor = "187,187,187"; //"204,204,204"; //初期値"0,0,0"
    _grid.lineWidth = 4; //初期値1
    _grid.addEventListener("in", in_grid);

    //================================
    // SpriteSheetPlusボタンの表示準備
    //================================
    _blockWidth = _canvas.width / 17;
    _blockHeight = _canvas.height / 9;
    
    _button1 = new SpriteSheetPlus("spriteSheetButton1.png", true, "255,255,255", "0,0,0",4);
    _button1.name = "button1";
    _button1.x = _blockWidth*2;
    _button1.y = _blockHeight*3;
    _canvas.addChild(_button1);

    _button2 = new SpriteSheetPlus("spriteSheetButton1.png", true, "255,255,255", "0,0,0",4);
    _button2.name = "button2";
    _button2.x = _blockWidth*7;
    _button2.y = _blockHeight*3;
    _canvas.addChild(_button2);

    _button3 = new SpriteSheetPlus("spriteSheetButton1.png", true, "255,255,255", "0,0,0",4);
    _button3.name = "button3";
    _button3.x = _blockWidth*12;
    _button3.y = _blockHeight*3;
    _canvas.addChild(_button3);
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#ffffff");
}

mouseup_canvas = (_canvas) => {
    if (_gridStatus == "off") {
        _grid.in(2); //初期値2（秒）
        _gridStatus = "animate"; //Gridの表示状態

        //ボタンの表示開始
        _button1._timerID = setTimeout(callback_button_in, 650, _button1);
        _button2._timerID = setTimeout(callback_button_in, 980, _button2);
        _button3._timerID = setTimeout(callback_button_in, 1290, _button3);
    }
}

in_grid = (_grid) => {
    _gridStatus = "on"; //Gridの表示状態
    _grid.removeEventListener("in");
}

mouseup_button = (_button) => {
    _grid._timerID = setTimeout(callback_grid_out, 1520);

    switch (_button.name) {
        case "button1":
            _button2._timerID = setTimeout(callback_button_out, 300, _button2);
            _button3._timerID = setTimeout(callback_button_out, 600, _button3);
            _lastButton = _button3;
            break;
        case "button2":
            _button1._timerID = setTimeout(callback_button_out, 600, _button1);
            _button3._timerID = setTimeout(callback_button_out, 600, _button3);
            _lastButton = _button3;
            break;
        case "button3":
            _button1._timerID = setTimeout(callback_button_out, 600, _button1);
            _button2._timerID = setTimeout(callback_button_out, 300, _button2);
            _lastButton = _button1;
    }
}

delete_button = (_button) => {
    _canvas.deleteChild(_button);
}

callback_button_in = (_button) => {
    _button.in(1);
    _button.addEventListener("mouseup", mouseup_button); //?
    _button.addEventListener("delete", delete_button); //?
    clearTimeout(_button._timerID);
}

callback_button_out = (_button) => {
    _button.out(1);
    clearTimeout(_button._timerID);
}

callback_grid_out = () => {
    _grid.out(1); //初期値2（秒）
    _grid.addEventListener("out", out_grid);
    _gridStatus = "animate"; //Gridの表示状態
}

out_grid = (_grid) => {
    _gridStatus = "off";
    _grid.removeEventListener("in");
    
    //location.href = "index2.html";
}