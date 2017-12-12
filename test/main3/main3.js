addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.fps = 60;
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true);
    _canvas.borderWidth = 2;

    _uiList = [];

    //HTML5
    _html5 = new toile.Bitmap("../common/html5.png");
    _html5.x = 15;
    _html5.y = 15;
    _canvas.addChild(_html5);
    _uiList.push(_html5);

    //「ホームに戻るボタン」関連
    _homeButton = new toile.Bitmap("../common/home.png");
    _homeButton.x = _canvas.width - 64 - 15;
    _homeButton.y = 15; //_canvas.height - 64 - 15;
    _homeButton.addEventListener("mouseup", mouseup_homeButton);
    _canvas.addChild(_homeButton);
    _uiList.push(_homeButton);

    //「シナノロゴ」関連
    _shinanologo = new toile.Bitmap("../common/shinanologo.png");
    _shinanologo.x = _canvas.width - 64 - 245;
    _shinanologo.y = _canvas.height -37 -10;
    _canvas.addChild(_shinanologo);
    _uiList.push(_shinanologo);

    //"50th Anniversary"
    _50th = new toile.Bitmap("../common/50thlogo.png");
    _50th.x = _canvas.width / 2 - 165;
    _50th.y = _canvas.height - 70;
    _50th.alpha = 1; //0.8;
    _canvas.addChild(_50th);
    _uiList.push(_50th);

    //ボタン1
    _content1 = new toile.Bitmap("content1.png");
    _content1.x = 1360/2 - 50;
    _content1.y = - 100;
    _content1.targetY = 768/2 - 80;
    _content1.elasticY = 0;
    _content1.spring = 0.06; //0.1; //値が小さいと動きが遅い
    _content1.damp = 0.9; //0.8; //値が小さいとすぐにとまる
    _content1.oldY = _content1.y;
    _canvas.addChild(_content1);
    _line1 = new toile.Line(
        _content1.x + 50,
        _content1.y,
        _content1.x + 50,
        _content1.y
    )
    _line1.lineWidth = 2;
    _line1.lineColor = "64,64,64"; //"51,51,51"; //#333
    _canvas.addChild(_line1);

    _startTimeOutID = setTimeout(startTimeOut, 500);
    //_startLoopID = setInterval(startLoop, 17, _canvas); //すぐに実行する場合

    //一度全て消す
    _uiList.forEach(function(_bitmap) {
        _bitmap.alpha = 0;
    });
    _uiFadeInID = setInterval(_uiFadeIn, 17);
}

startTimeOut = () => {
    _startLoopID = setInterval(startLoop, 17, _canvas);
}

startLoop = () => { //this == window
    c1 = _content1;
    c1.elasticY = (c1.elasticY - (c1.y - c1.targetY)*c1.spring)*c1.damp;
    let _nextY = c1.y + c1.elasticY;
    if (Math.abs(_nextY - c1.oldY) > 0.01) {
        c1.y = _nextY;
        c1.oldY = c1.y;
        _line1.endY = c1.y + 5;
    } else {
        console.log("STOP");
        clearInterval(_startLoopID);
    }
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#fefefe");
}

//============
// HOMEボタン
//============
mouseup_homeButton = (_bitmap) => {
    //効果音
    _se1 = new toile.Sound("../common/se1.wav");
    _se1.play();

    _uiFadeOutID = setInterval(_uiFadeOut, 17);
}

_uiFadeIn = () => {
    _uiList.forEach(function(_bitmap) {
        if (_bitmap.alpha < 1) {
            _bitmap.alpha += 0.02; //05;
        } else {
            clearInterval(_uiFadeInID);
            _bitmap.alpha = 1;
        }
    });
}

_uiFadeOut = () => {
    _uiList.forEach(function(_bitmap) {
        if (0 < _bitmap.alpha) {
            _bitmap.alpha -= 0.02;
        } else {
            _bitmap.alpha = 0;
            location.href = "../main0/index0.html?param=true"
        }
    });
}