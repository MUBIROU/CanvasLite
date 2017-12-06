addEventListener("load", load_window, false);
function load_window() {
    _photoMovie = undefined;
    _videoMovie = undefined;

    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true)
    _canvas.fps = 60;

    _uiList = [];

    // _3colors = new toile.Bitmap("../common/3colors.png");
    // _canvas.addChild(_3colors);
    // _uiList.push(_3colors);

    // _uiContainer = new toile.Container();
    // _canvas.addChild(_uiContainer);

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
    //_uiContainer.addChild(_homeButton);
    _canvas.addChild(_homeButton);
    _uiList.push(_homeButton);

    //「シナノロゴ」関連
    //_shinanologo = new toile.Bitmap("../common/shinano.png");
    _shinanologo = new toile.Bitmap("../common/shinanologo.png");
    _shinanologo.x = _canvas.width - 64 - 245;
    _shinanologo.y = _canvas.height -37 -10; //10;
    //_shinanologo.alpha = 0.8;
    //_uiContainer.addChild(_shinanologo);
    _canvas.addChild(_shinanologo);
    _uiList.push(_shinanologo);

    //loopModeButton
    _loopModeButton = new toile.SpriteSheet("loopModeButton.png");
    _loopModeButton.addEventListener("load", load_loopModeButton);
    _loopModeButton.addEventListener("mouseup", mouseup_loopModeButton);
    _loopModeButton.x = _canvas.width/2 - 32;
    _loopModeButton.y = _canvas.height/2 + 85;
    //_loopModeButton.alpha = 0.9;
    //_uiContainer.addChild(_loopModeButton);
    _canvas.addChild(_loopModeButton);
    _uiList.push(_loopModeButton);

    //_logo = logo(_canvas, 15, 15);
    _html5 = new toile.Bitmap("../common/html5.png"); //html5.png");
    _html5.x = 15; //_canvas.width - 230;
    _html5.y = 15; //_canvas.height - 70;
    _canvas.addChild(_html5);
    _uiList.push(_html5);
    //_uiContainer.addChild(_html5);

    //"Music is VFR"
    _VFR = new toile.Bitmap("MusicIsVFR.png");
    _VFR.x = _canvas.width / 2 - 61;
    _VFR.y = _canvas.height - 228;
    _VFR.alpha = 1; //0.8;
    _canvas.addChild(_VFR);
    _uiList.push(_VFR);
    //_uiContainer.addChild(_VFR);

    //"50th Anniversary"
    _50th = new toile.Bitmap("../common/50thlogo.png");
    _50th.x = _canvas.width / 2 - 165;
    _50th.y = _canvas.height - 70;
    _50th.alpha = 1; //0.8;
    _canvas.addChild(_50th);
    _uiList.push(_50th);
    //_uiContainer.addChild(_50th);
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
    _spriteSheet.gotoAndStop(3);
}

mouseup_loopModeButton = (_spriteSheet) => {
    //効果音
    _se1 = new toile.Sound("../common/se1.wav");
    _se1.play();

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
    //効果音
    _se1 = new toile.Sound("../common/se1.wav");
    _se1.play();

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

    _uiFadeOutID = setInterval(_uiFadeOut, 17);
}

_uiFadeOut = () => {
    _uiList.forEach(function(_bitmap) {
        if (0 < _bitmap.alpha) {
            _bitmap.alpha -= 0.01;
        } else {
            //console.log("AAAAAAAAAAAAAAA")
            //
            //cleconsole.log(_uiFadeOutID);
            _bitmap.alpha = 0;
            //clearInterval(_uiFadeOutID);
        }
    });
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