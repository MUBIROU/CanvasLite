/*
_param1 = location.search.match(/param1=(.*?)(&|$)/)[1];
console.log(_param1);
_param2 = location.search.match(/param2=(.*?)(&|$)/)[1];
console.log(_param2);
*/

//==========================
//作品リストとそのランダム化
//==========================
//standard
//"AS" "DAS"（VAS）"DB" "DG" "DK" "DN" "DP"

//"wide"
//"DA" "DOK" "DS"


_videoList = [ //優先させたい作品は除く
    "AS-1","AS-2","AS-3","AS-4","AS-5","AS-6","AS-7","AS-8","AS-9","AS-10","AS-16","AS-17","AS-18","AS-20",
    "DA-24",
    "DAS-1","DAS-2","DAS-3","DAS-4","DAS-5","DAS-6","DAS-7","DAS-8","DAS-9","DAS-10",
    "DB-30",
    "DK-10","DK-11","DK-12","DK-13","DK-14","DK-15","DK-16",
    "DN-50","DN-56","DN-57","DN-58","DN-62","DN-63","DN-64","DN-65","DN-66","DN-67","DN-68","DN-69","DN-70","DN-71","DN-72","DN-73","DN-75","DN-76","DN-77","DN-78","DN-79","DN-80","DN-81","DN-82","DN-83",
    "DOK-1_1","DOK-1_2","DOK-1_3","DOK-1_4","DOK-1_5","DOK-1_6",
    "DOK-2_1","DOK-2_2","DOK-2_3","DOK-2_4","DOK-2_6","DOK-2_7",
    "DP-3"
];

//任意の位置に配置する場合
_bestPosArray = [
    [698,441],[349,521],[724,324],[974,162],[453,40],[586,137],[403,360],[232,97],[218,186],[831,360],[795,223],[408,536],[974,432],[533,104],[176,313],[141,129],[280,82],[260,510],[841,52],[705,441],[1119,204],[1046,400],[193,172],[1001,438],[571,30],[499,386],[1146,251],[933,485],[88,202],[399,362],[622,205],[400,457],[488,506],[737,548],[63,352],[453,148],[310,310],[450,236],[115,424],[476,328],[496,435],[851,528],[394,191],[594,469],[42,271],[1084,357],[1032,109],[231,435],[809,185],[754,38],[268,209],[686,166],[387,94],[651,35],[488,538],[871,85],[915,69],[1121,304],[795,512],[282,354],[347,55],[881,206],[956,290],[1054,293],[182,468],[1083,148],[619,547],[973,87],[637,310],[483,194],[143,340],[381,456],[552,308]
];

randomArray = (_array) => { //作品リストをランダムにする
    _arrayCopy = _array.concat(); //複製
    _arrayNew = [];
    for (let i=0; i<_array.length; i++) { //0～80（81作品の場合）
        let _theNum = Math.floor(Math.random() * (_arrayCopy.length-1 + 1)); //整数の乱数
        let _video = _arrayCopy.splice(_theNum,1)[0];
        _arrayNew.push(_video);
    }
    return _arrayNew;
}
_videoRandamList = randomArray(_videoList);
_videoRandamList.unshift("DS-2", "DS-3"); //優先させたい作品
_videoRandamListNum = _videoRandamList.length;

//======================================
// 最初に実行（Webページの準備が完了後）
//======================================
addEventListener("load", load_window, false);
function load_window() {
    _isMove = false;
    _choiceBitmap = undefined;
    _disX = _disY = 0;
    _mouseX = _mouseY = _mouseDownX = _mouseDownY = 0;
    _clickNum = 0;
    _playMark = undefined; //Playマーク
    _changeBitmap = false; //選択した作品が前と異なるか否か

    //「Canvas」関連
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.addEventListener("mousemove", mousemove_canvas);
    _canvas.enabledMouseMove(true);
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true)
    _canvas.fps = 60;

    //「作品」の画像関連
    _bitmapArray = [];
    for (let i = 0; i < _videoRandamListNum; i++) { //79作品の場合（0,1,2...,77,78）
        let _theVideoName = _videoRandamList.pop();
        let _bitmap = new Bitmap("png/" + _theVideoName + ".png");
        _bitmap.name = _theVideoName;
        _bitmap.addEventListener("load", load_bitmap);
        //_bitmap.addEventListener("mousedown", mousedown_bitmap);
        //_bitmap.addEventListener("mouseup", mouseup_bitmap);
        //_bitmap.addEventListener("mouseupoutside", mouseup_bitmap);

        _canvas.addChild(_bitmap);

        // _bitmap.addEventListener("mousedown", mousedown_bitmap);
        // _bitmap.addEventListener("mouseup", mouseup_bitmap);
        // _bitmap.addEventListener("mouseupoutside", mouseup_bitmap);
        //_bitmap.addEventListener("load", load_bitmap);

        _bitmapArray.push(_bitmap);
    }
    _bitmapArrayCopy = _bitmapArray.concat(); //複製

    _logo = logo(_canvas, 15, 15);
}

logo = (_canvas, _x, _y) => {
    _logoContainer = new toile.Container();
    _logoContainer.x = _x;
    _logoContainer.y = _y;
    _canvas.addChild(_logoContainer);

    //"CREA"
    _text1 = new toile.Text("CREA");
    _text1.addWebFont("VV2NIGHTCLUB", "../common/VV2NIGHTCLUB.OTF", "opentype");
    _text1.font = "VV2NIGHTCLUB";
    _text1.size = 25; //80;
    _text1.x = 38 + 5; //1165; //20;//12;
    _text1.y = -3; //-1;
    _text1.color = "#222222";
    _logoContainer.addChild(_text1);

    //"TED BY"
    _text2 = new toile.Text("TED BY");
    _text2.addWebFont("VV2NIGHTCLUB", "../common/VV2NIGHTCLUB.OTF", "opentype");
    _text2.font = "VV2NIGHTCLUB";
    _text2.size = 25; //80;
    _text2.x = 113 + 5; //1165; //20;//12;
    _text2.y = -3; //-1;
    _text2.color = "#222222";
    _logoContainer.addChild(_text2);

    //"SHINANOJS"
    _text3 = new toile.Text("SHINANOJS");
    _text3.addWebFont("VV2NIGHTCLUB", "../common/VV2NIGHTCLUB.OTF", "opentype");
    _text3.font = "VV2NIGHTCLUB";
    _text3.size = 28; //80;
    _text3.x = 38 + 5; //1165; //20;//12;
    _text3.y = 20; //-1;
    _text3.color = "#222222";
    _logoContainer.addChild(_text3);

    _line = new toile.Line(38,0,215,0);
    _line.x = 38 + 5;
    _line.y = 21;
    _line.lineWidth = 1;
    _line.lineColor = "64,64,64";
    _logoContainer.addChild(_line);

    //"HTML5 logo"
    _html5 = new toile.Bitmap("../common/html5.png"); //html5.png");
    _html5.x = 0; //_canvas.width - 230;
    _html5.y = 0; //_canvas.height - 70;
    _logoContainer.addChild(_html5);

    return _logoContainer;
}

//===========================================
// 各作品の画像（.png）がロード完了したら実行
//===========================================
load_bitmap = (_bitmap) => {

    _bitmap.width = 140;
    _bitmap.height = 200;

    //ランダムに配置する場合
    // _bitmap.x = 80 + (_canvas.width - 300) * Math.random();
    // _bitmap.y = _canvas.height;
    // _bitmap.__posY = 80 + (_canvas.height - 360) * Math.random();
    // _bitmap.__disY = _bitmap.y - _bitmap.__posY;

    //任意の位置に配置する場合
    let _thePos = _bestPosArray.pop();
    _bitmap.x = _thePos[0];
    _bitmap.y = _canvas.height;
    _bitmap.__posY = _thePos[1];
    _bitmap.__disY = _bitmap.y - _bitmap.__posY;

    _bitmap.__timerID = setTimeout(callback_start, 1000*Math.random(), _bitmap);
}

//=============================================================
// 各作品をランダムに登場させるためのタイマー（各作品１回実行）
//=============================================================
callback_start = (_bitmap) => {
    _bitmap.__count = 0;
    clearTimeout(_bitmap.__timerID);
}

//=======================
//（1）全作品が下から登場
//=======================
enterframe_canvas = (_canvas) => {
    for (let i=0; i<_bitmapArrayCopy.length; i++) {
        let _bitmap = _bitmapArrayCopy[i];
        if (_bitmap.__count != undefined) {
            _bitmap.__count += 0.04;
            if (_bitmap.y > _bitmap.__posY + 1) {
                _bitmap.y = (_bitmap.__posY + _bitmap.__disY) +  _bitmap.__disY * Math.cos(_bitmap.__count);
            } else {
                _bitmap.__count = undefined; //（3）用
                _bitmap.y = _bitmap.__posY;
                _bitmapArrayCopy.splice(i,1); //登場し終えたものを_bitmapArrayCopyから削除
                if (_bitmapArrayCopy.length == 0) { //全て登場し終えたら...
                    //作品ボタンにマウスイベントリスナーの定義
                    _bitmapArray.forEach(function(_theBitmap) {
                        _theBitmap.addEventListener("mousedown", mousedown_bitmap);
                        _theBitmap.addEventListener("mouseup", mouseup_bitmap);
                        _theBitmap.addEventListener("mouseupoutside", mouseup_bitmap);
                    });

                    //changeボタンの表示
                    _depthChangeBtn = new toile.Bitmap("depthChange.png");
                    _depthChangeBtn.addEventListener("mouseup", mouseup_depthChangeBtn);
                    _depthChangeBtn.x = 15; //_canvas.width - 50;
                    _depthChangeBtn.y = _canvas.height - 64 - 15;//20;
                    //_depthChangeBtn.scale = 2;
                    _canvas.addChild(_depthChangeBtn);

                    //「ホームに戻るボタン」関連
                    _homeButton = new toile.Bitmap("../common/home.png");
                    _homeButton.x = _canvas.width - 64 - 15;
                    _homeButton.y = _canvas.height - 64 - 15;
                    _homeButton.addEventListener("mouseup", mouseup_home);
                    _canvas.addChild(_homeButton);

                    //「ホームに戻るボタン」関連
                    _helpButton = new toile.Bitmap("help.png");
                    _helpButton.x = _canvas.width - 64 - 15;
                    _helpButton.y = 15;
                    _helpButton.addEventListener("mouseup", mouseup_helpButton);
                    _canvas.addChild(_helpButton);

                    //ループ関数の変更
                    _canvas.removeEventListener("enterframe");
                    _canvas.addEventListener("enterframe", enterframe_canvas2);
                }
            }
        }
    }
    _canvas.drawScreen("#fefefe");
}

//=================================
//（2）全作品が登場後に繰り返し実行
//=================================
enterframe_canvas2 = (_canvas) => {
    if (_isMove) {
        _mouseX = _canvas.mouseX; //for Mobile
        _mouseY = _canvas.mouseY; //for Mobile
        _choiceBitmap.x = _mouseX - _disX;
        _choiceBitmap.y = _mouseY - _disY;
    }
    _canvas.drawScreen("#fefefe");
}

//===================================
// 作品のドラッグ時のカーソル位置検知
//===================================
mousemove_canvas = (_canvas) => {
    _mouseX = _canvas.mouseX;
    _mouseY = _canvas.mouseY;
}

//==============
// help用ボタン
//==============
mouseup_helpButton = (_bitmap) => {
    //DEBUG==========================
    var _result = [];
    _bitmapArray.forEach(function(_bitmap) {
        _result.push("[" + Math.round(_bitmap.x) + "," + Math.round(_bitmap.y) + "]");
    });
    document.write(_result);
    //DEBUG==========================
    //alert("XXXXXXXXXXX");
}

//=======================
// 作品の階層変更用ボタン
//=======================
mouseup_depthChangeBtn = (_bitmap) => {
    _canvas.deleteChild(_playMark);
    _clickNum = 0;

    _bitmap.removeEventListener("mouseup");
    _screenShot = _canvas.screenShot();

    _bitmapArray.forEach(function(_bitmap) {
       let _randomNum = Math.floor(Math.random() * (_canvas.getDepthMax() + 1));
       _canvas.setDepthIndex(_bitmap, _randomNum);
    });
    //_canvas.setDepthIndex(_text, 0); //_canvas.getDepthMax()); //最下位
    _canvas.setDepthIndex(_depthChangeBtn, _canvas.getDepthMax()); //最上位?????????????????????????????????????
    
    _canvas.addChild(_screenShot);
    _timerScreenShotID = setInterval(callback_screenShot, 25, _screenShot);
}

//===============================
// 作品の階層を変更（フェード）用
//===============================
callback_screenShot = (_screenShot) => {
    if (_screenShot.alpha > 0) {
        _screenShot.alpha -= 0.05;
    } else {
        clearInterval(_timerScreenShotID);
        _canvas.deleteChild(_screenShot);
        _screenShot = undefined;
        _depthChangeBtn.addEventListener("mouseup", mouseup_depthChangeBtn);
    }
}

//===================================
// 作品を押した時に実行（内部処理用）
//===================================
mousedown_bitmap = (_bitmap) => {
    if (_playMark != undefined) {
        _playMark.x = -9e9; //動いている間
    }
    
    _mouseDownX = _mouseX;
    _mouseDownY = _mouseY;

    _canvas.setDepthIndex(_bitmap, _canvas.getDepthMax());
    _canvas.stopMouseDownEvent();
    _isMove = true;

    _changeBitmap = _choiceBitmap == _bitmap;
    _choiceBitmap = _bitmap;

    _disX = _canvas.mouseX - _bitmap.x;
    _disY = _canvas.mouseY - _bitmap.y;
}

//===========================
// 作品をクリックした時に実行
//===========================
mouseup_bitmap = (_bitmap) => {
    if (_playMark != undefined) {
        _canvas.deleteChild(_playMark);
    }

    _playMark = new toile.Bitmap("play.png");
    _playMark.x = _bitmap.x + 40;
    _playMark.y = _bitmap.y + 70;
    _canvas.addChild(_playMark);

    if (_clickNum == 0) {
        _clickNum ++;
    } else if (_clickNum == 1) {
        if ((_mouseX == _mouseDownX) && (_mouseY == _mouseDownY)) {
            if (_changeBitmap) { //選択した作品が直前と同じならば...
                //選択したボタン類を消す
                //_bitmap.alpha = 0;
                _playMark.alpha = 0;
                //全てのボタン機能をOFFにする
                allButtonMouseEvent(false);
                //=========================
                // ここで再生プレーヤー生成
                //=========================
                //作品Noにより16:9か4:3か調べる
                var _videoName = _bitmap.name;
                var _tmp = _videoName.substr(0,3);
                if ((_tmp == "DA-") || 
                    (_tmp == "DOK") || 
                    (_tmp == "DS-") || 
                    (_tmp == "DAP") || 
                    (_videoName.substr(0,5) == "AS-20") ||
                    (_videoName.substr(0,5) == "AS-16"))
                {
                    var _size = "wide";
                } else {
                    _size = "standard";
                }
                _screen = new Screen(_canvas, _bitmap, _size); //standard" or "wide"
                _screen.addEventListener("close", close_screen);
                _screen.open();
            }
        }
    }

    _canvas.stopMouseUpEvent();
    _isMove = false;
}

//=========================================
// スクリーン表示時に各種ボタンを無効にする
//=========================================
allButtonMouseEvent = (_boolean) => {
    if (!_boolean) { //falseの時
        _bitmapArray.forEach(function(_bitmap) {
            _bitmap.removeEventListener("mousedown");
            _bitmap.removeEventListener("mouseup");
            _bitmap.removeEventListener("mouseupoutside");
        });
        _helpButton.removeEventListener("mouseup");
        _depthChangeBtn.removeEventListener("mouseup");
        _homeButton.removeEventListener("mouseup");
    } else { //trueの時
        _bitmapArray.forEach(function(_bitmap) {
            _bitmap.addEventListener("mousedown", mousedown_bitmap);
            _bitmap.addEventListener("mouseup", mouseup_bitmap);
            _bitmap.addEventListener("mouseupoutside", mouseup_bitmap);
        });
        _helpButton.addEventListener("mouseup", mouseup_helpButton);
        _depthChangeBtn.addEventListener("mouseup", mouseup_depthChangeBtn);
        _homeButton.addEventListener("mouseup", mouseup_home);
    }
}

close_screen = (_screen) => {
    console.log("スクリーンが閉じられました");
    
    //選択していたボタンを再表示する
    //_bitmap.alpha = 1;
    _playMark.alpha = 1;
    //全てのボタン機能をONにする
    allButtonMouseEvent(true);
}

//===================
// ホームに戻るボタン
//===================
mouseup_home = (_bitmap) => {
    //homeボタンの削除
    _homeButton.removeEventListener("mouseup");
    _canvas.deleteChild(_homeButton); //すぐ消去する場合

    //changeボタンの削除
    _depthChangeBtn.removeEventListener("mouseup");
    _canvas.deleteChild(_depthChangeBtn); //すぐ消去する場合

    //helpボタンの削除
    _helpButton.removeEventListener("mouseup");
    _canvas.deleteChild(_helpButton); //すぐ消去する場合

    //playマークの削除
    _canvas.deleteChild(_playMark); //すぐ消去する場合

    //各作品をランダムに登場させるためのタイマー設定
    _bitmapArray.forEach(function(_bitmap) {
        _bitmap.__timerID = setTimeout(callback_start, 500*Math.random(), _bitmap);
        _bitmap.__disY = _bitmap.y + 200; //カードの高さ
        //マウスイベントリスナーの削除
        _bitmap.removeEventListener("mousedown");
        _bitmap.removeEventListener("mouseup");
        _bitmap.removeEventListener("mouseupoutside");
    });

    _canvas.removeEventListener("enterframe");
    _canvas.addEventListener("enterframe", enterframe_canvas3);

    _canvas.setDepthIndex(_logo, _canvas.getDepthMax());
}

//===========================
//（3）全作品が上へ消えていく
//===========================
enterframe_canvas3 = (_canvas) => {
    for (let i=0; i<_bitmapArray.length; i++) {
        let _bitmap = _bitmapArray[i];
        if (_bitmap.__count != undefined) {
            _bitmap.__count += 0.03;
            if (_bitmap.y > -200) {
                _bitmap.y = _bitmap.y - 5;
                _bitmap.y = -200 + _bitmap.__disY * Math.cos(_bitmap.__count);
            } else {
                _bitmap.y = -200;
                _bitmapArray.splice(i,1); //登場し終えたものを_bitmapArrayCopyから削除                
                if (_bitmapArray.length == 0) { //全て登場し終えたら...
                    _canvas.removeEventListener("enterframe");

                    //ホーム（../main0/index0.html）にジャンプ
                    location.href = "../main0/index0.html?param=true"
                }
            }
        }
    }
    _canvas.drawScreen("#fefefe");
}