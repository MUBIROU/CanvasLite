addEventListener("load", load_window, false);
function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true)
    _canvas.fps = 60;

    _photoMovie = undefined;
    _videoMovie = undefined;

    //五線譜の生成
    _scoreLine = new ScoreLine(_canvas);
    _scoreLine.addEventListener("in", in_scoreLine);
    _scoreLine.addEventListener("out", out_scoreLine);
    _scoreLine.in();

    //「ホームに戻るボタン」関連
    _homeButton = new toile.Bitmap("../common/home.png");
    _homeButton.x = _canvas.width - 64 - 15;
    _homeButton.y = 15; //_canvas.height - 64 - 15;
    _homeButton.addEventListener("mouseup", mouseup_homeButton);
    _canvas.addChild(_homeButton);

    //「シナノロゴ」関連
    //_shinanologo = new toile.Bitmap("../common/shinano.png");
    _shinanologo = new toile.Bitmap("../common/shinanologo.png");
    _shinanologo.x = _canvas.width - 64 - 245;
    _shinanologo.y = _canvas.height -37 -10; //10;
    //_shinanologo.alpha = 0.8;
    _canvas.addChild(_shinanologo);

    //loopModeButton
    _loopModeButton = new toile.SpriteSheet("loopModeButton.png");
    _loopModeButton.gotoAndStop(3);
    _loopModeButton.addEventListener("load", load_loopModeButton);
    _loopModeButton.addEventListener("mouseup", mouseup_loopModeButton);
    _loopModeButton.x = _canvas.width/2 - 32;
    _loopModeButton.y = _canvas.height/2 + 85;
    //_loopModeButton.alpha = 0.9;
    _canvas.addChild(_loopModeButton);

    //_logo = logo(_canvas, 15, 15);
    _html5 = new toile.Bitmap("../common/html5.png"); //html5.png");
    _html5.x = 15; //_canvas.width - 230;
    _html5.y = 15; //_canvas.height - 70;
    _canvas.addChild(_html5);

    //"Music is VFR"
    _text4 = new toile.Text("Music is VFR");
    _text4.addWebFont("VV2NIGHTCLUB", "../common/VV2NIGHTCLUB.OTF", "opentype");
    _text4.font = "VV2NIGHTCLUB";
    _text4.color = "#222222"; //"#ffffff";
    _text4.size = 16; //80;
    _text4.align = "center"
    _text4.baseline = "middle";
    _text4.alpha = 0.3;
    _text4.x = _canvas.width/2;
    _text4.y = _canvas.height/2 + 167;
    _canvas.addChild(_text4);

    //"50th Anniversary"
    _50th = new toile.Bitmap("../common/50thlogo.png");
    _50th.x = _canvas.width / 2 - 165;
    _50th.y = _canvas.height - 70;
    _50th.alpha = 1; //0.8;
    _canvas.addChild(_50th);
}

in_scoreLine = (_scoreLine) => {
    _circleMenu = new CircleMenu(_canvas);
    _circleMenu.addEventListener("in", in_circleMenu)
    _circleMenu.addEventListener("out", out_circleMenu);
}

enterframe_canvas = (_canvas) => {
    //console.log(_video.x);
    _canvas.drawScreen("#fefefe");
}

load_loopModeButton = (_spriteSheet) => {
    _spriteSheet.gotoAndStop(2);
}

mouseup_loopModeButton = (_spriteSheet) => {
    var _nextframe = _spriteSheet.currentframe + 1;
    if (_spriteSheet.totalframes < _nextframe) {
        _nextframe = 1;
    }
    switch (_nextframe) {
        case 1: _circleMenu.loopMode = "none"; break;
        case 2: _circleMenu.loopMode = "one"; break;
        case 3: _circleMenu.loopMode = "all"; break;
        case 4: _circleMenu.loopMode = "random"; break;
        default: throw new Error("main2:mouseup_loopModeButton()");
    }
    _spriteSheet.gotoAndStop(_nextframe);
}

//============
// HOMEボタン
//============
mouseup_homeButton = (_bitmap) => {
    //ホーム（../main0/index0.html）にジャンプ
    //location.href = "../main0/index0.html?param=true"
    _scoreLine.out(); //DEBUG
    _circleMenu.out();

    if (_photoMovie != undefined) {
        _photoMovie.end();
    }
     
    if (_videoMovie != undefined) {
        _videoMovie.end();
    }
}

//=====================
// HOMEボタンの後処理
//=====================
timerHomeButton = () => {
    //console.log("timerHomeButton");
}

out_scoreLine = (_scoreLine) => {
    //console.log("scoreline");
    //location.href = "../main0/index0.html?param=true"
}

in_circleMenu = (_circleMenu) => {
    _videoMovie = new VideoMovie(_canvas);
    _videoMovie.addEventListener("end", end_videoMovie);
    _videoMovie.start();
}

end_videoMovie = (_videoMovie) => {
    location.href = "../main0/index0.html?param=true"
}

out_circleMenu = (_circleMenu) => {
    //console.log("circlemenu");
    //location.href = "../main0/index0.html?param=true"
    //location.href = "index2.html"
}