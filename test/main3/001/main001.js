addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.fps = 60;
    _canvas.enabledContextMenu(false);
    _canvas.cursor = "../../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true);
    _canvas.borderWidth = 2;

    _canvas.addEventListener("mousemove", mousemove_canvas);
    _canvas.enabledMouseMove(true);

    _uiList = [];
    _count = 0;
    _mouseX = 380; //100;
    _mouseY = 768/2-30;

    //HTML5
    _html5 = new toile.Bitmap("../../common/html5.png");
    _html5.x = 15;
    _html5.y = 15;
    _canvas.addChild(_html5);
    _uiList.push(_html5);

    // //「ホームに戻るボタン」関連
    // _homeButton = new toile.Bitmap("../../common/home.png");
    // _homeButton.x = _canvas.width - 64 - 15;
    // _homeButton.y = 15;
    // _canvas.addChild(_homeButton);
    // _uiList.push(_homeButton);

    //「バックボタン」関連
    _backButton = new toile.Bitmap("../../common/back.png");
    _backButton.x = _canvas.width - 64 - 15; // - 64 - 15;
    _backButton.y = 15;
    _canvas.addChild(_backButton);
    _uiList.push(_backButton);

    //「シナノロゴ」関連
    _shinanologo = new toile.Bitmap("../../common/shinanologo.png");
    _shinanologo.x = _canvas.width - 64 - 245;
    _shinanologo.y = _canvas.height -37 -10;
    _canvas.addChild(_shinanologo);
    _uiList.push(_shinanologo);

    //"50th Anniversary"
    _50th = new toile.Bitmap("../../common/50thlogo.png");
    _50th.x = _canvas.width / 2 - 165;
    _50th.y = _canvas.height - 70;
    _50th.alpha = 1; //0.8;
    _canvas.addChild(_50th);
    _uiList.push(_50th);

    //三色グラデーション
    _3colors = new toile.Bitmap("../../common/3colorsDark.png");
    _3colors.alpha = 0;
    _canvas.addChild(_3colors);
    _uiList.push(_3colors);
    _canvas.setDepthIndex(_3colors, 0);

    //300BOX
    _300box = new toile.Bitmap("300BOX.png");
    _300box.x = _canvas.width - 617;
    _300box.y = _canvas.height - 240;
    _canvas.addChild(_300box);

    _uiList.push(_300box);

    //一度全て消す
    _uiList.forEach(function(_bitmap) {
        _bitmap.alpha = 0;
    });

    _dragon = new Dragon(_canvas);

    _uiFadeInID = setInterval(_uiFadeIn, 17);
}

mousemove_canvas = (_canvas) => {
    _mouseX = _canvas.mouseX;
    _mouseY = _canvas.mouseY;
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#fefefe");
}

//============
// backボタン
//============
mouseup_backButton = (_bitmap) => {
    //console.log("back");
    //効果音
    _se1 = new toile.Sound("../../common/se1.wav");
    _se1.play();

    //_homeButton.removeEventListener("mouseup");
    _backButton.removeEventListener("mouseup");

    _uiFadeOutID = setInterval(_uiFadeOut, 17, "back");
}

//=============
// homeボタン
//=============
mouseup_homeButton = (_bitmap) => {
    //console.log("home");
    //効果音
    _se1 = new toile.Sound("../../common/se1.wav");
    _se1.play();

    //_homeButton.removeEventListener("mouseup");
    _backButton.removeEventListener("mouseup");

    _uiFadeOutID = setInterval(_uiFadeOut, 17, "home");
}

_uiFadeIn = () => {
    _uiList.forEach(function(_bitmap) {
        if (_bitmap.alpha < 1) {
            _bitmap.alpha += 0.02; //05;
        } else {
            _count ++;
            if (_count == _uiList.length) { //ul個数分繰り返されてしまう為
                clearInterval(_uiFadeInID);
                _bitmap.alpha = 1;
                //_homeButton.addEventListener("mouseup", mouseup_homeButton);
                _backButton.addEventListener("mouseup", mouseup_backButton);
                _canvas.setDepthIndex(_html5, _canvas.getDepthMax());
                _count = 0;
                //_dragon.move(_mouseX, _mouseY);
                _dragonLoopID = setInterval(_dragonLoop, 17);
            }
        }
    });
}

_dragonLoop = () => { //this == Window
    _dragon.move(_mouseX, _mouseY);
}

_uiFadeOut = (_string) => {
    _uiList.forEach(function(_bitmap) {
        if (0 < _bitmap.alpha) {
            _bitmap.alpha -= 0.01;
            _dragon.alpha -= 0.003;
        } else {
            _count ++;
            if (_count == _uiList.length) { //ul個数分繰り返されてしまう為
                _bitmap.alpha = 0;
                if (_string == "home") {
                    location.href = "../../main0/index0.html?param=true"
                } else if (_string == "back") {
                    location.href = "../../main3/index3.html"
                }
            }
        }
    });
}