# Reference Manual （リファレンスマニュアル）
Version 0.2 Build 141 RC1 対応  
© 2017 Takashi Nishimura

### <b>INDEX</b>（クラス一覧）
* [Bitmap class](#Bitmap): 画像を表示するためのクラス
* [Canvas class](#Canvas): 表示オブジェクトの頂点となるクラス
* [Circle class](#Circle): 正円を描くためのクラス
* [Container class](#Container): 表示オブジェクトのネストを作るためのクラス
* [Line class](#Line): 線を描くためのクラス
* [Rect class](#Rect): 長方形を描くためのクラス
* [Sound class](#Sound): 音を再生するためのクラス
* [SpriteSheet class](#SpriteSheet): SpriteSheetアニメーションを制御するためのクラス
* [Text class](#Text): 文字を表示するためのクラス
* [Video class](#Video): ビデオファイルを再生するためのクラス

***

<a name="Bitmap"></a>
# Bitmap class

### Inheritance（継承）
Bitmap -> SuperDisplay

### Methods（メソッド）

* [Bitmap.addEventListener()](#BitmapaddEventListener): 指定したイベントのリスナーを追加する
* [Bitmap.hitTest()](#BitmaphitTest): 指定したオブジェクトと重なっているか（矩形）
* [Bitmap.hitTestCircle()](#BitmaphitTestCircle): 指定したオブジェクトと重なっているか（円形）
* [Bitmap.removeEventListener()](#BitmapremoveEventListener): 指定したイベントのイベントリスナーを解除

### Properties（プロパティ）

* [Bitmap.alpha](#Bitmapalpha): 不透明度
* [Bitmap.globalX](#BitmapglobalX): グローバル水平座標位置
* [Bitmap.globalY](#BitmapglobalY): グローバル垂直座標位置
* [Bitmap.height](#Bitmapheight): PNG/JPEGファイルの高さ (読み取り専用)
* [Bitmap.image](#Bitmapimage): JavaScriptのImageオブジェクト（読み取り専用）
* [Bitmap.name](#Bitmapname): Bitmapインスタンスのインスタンス名
* [Bitmap.parent](#Bitmapparent): Bitmapが配置されているのコンテナを参照
* [Bitmap.regX](#BitmapregX): 回転させる際の中心座標（水平座標）
* [Bitmap.regY](#BitmapregY): 回転させる際の中心座標（垂直座標）
* [Bitmap.rotate](#Bitmaprotate): 回転角度（単位は度）
* [Bitmap.rotateRadian](#BitmaprotateRadian): 回転角度（単位はラジアン）
* [Bitmap.scale](#Bitmapscale): 拡大･縮小率
* [Bitmap.scaleX](#BitmapscaleX): 水平方向の拡大･縮小率
* [Bitmap.scaleY](#BitmapscaleY): 垂直方向の拡大･縮小率
* [Bitmap.width](#Bitmapwidth): PNG/JPEGファイルの横幅 (読み取り専用)
* [Bitmap.x](#Bitmapx): 水平座標位置
* [Bitmap.y](#Bitmapy): 垂直座標位置

### Events（イベント）

* [Bitmap.LOAD](#BitmapLOAD): PNGファイルがロードされたら
* [Bitmap.MOUSE_DOWN](#BitmapMOUSE_DOWN): Bitmapインスタンスをマウスダウンしたら
* [Bitmap.MOUSE_UP](#BitmapMOUSE_UP): Bitmapインスタンスをマウスダウン後にマウスボタンを離したら
* [Bitmap.MOUSE_UP_OUTSIDE](#BitmapMOUSE_UP_OUTSIDE): マウスダウン後に外でマウスボタンを離したら

### Constructor（コンストラクタ）
new toile.Bitmap(arg1 [,arg2,arg3,arg4,arg5])

### Arguments（引数）
arg1: PNG/JPEGファイルのパス（URL）を文字列で指定。  
arg2: 元画像中の表示させたい水平座標の開始位置。省略可能（初期値は0）。  
arg3: 元画像中の表示させたい垂直座標の開始位置。省略可能（初期値は0）。  
arg4: 元画像中の表示させたい水平座標の終了位置。省略可能。  
arg5: 元画像中の表示させたい垂直座標の終了位置。省略可能。

### Description（説明）
HTML Canvas上に画像（PNG/JPEG）を表示するためのクラス。  
指定したPNG/JPEGファイルを使った、Bitmapクラスを生成します。  
第2～5引数を使って、クロップ（トリミング）することも可能。  
toile.jsを読み込む前、\<head>タグ内などに
```
<script>var toile = window;</script>
```
と記述すると「名前空間」を省いた参照方法、new Bitmap(... といった記述が可能です。  
但しその場合、同じクラス名が他にも存在する場合、コンフリクトを起こしますので注意が必要です。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _bitmap = new toile.Bitmap("sample.jpg");
	_canvas.addChild(_bitmap);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

<a name="BitmapaddEventListener"></a>
# Bitmap.addEventListener()

### Syntax（構文）
bitmapObject.addEventListener(arg1, arg2, arg3)

### Arguments（引数）
arg1: "mousedown"、"mouseup"、"mouseupoutside"、"load" の何れか。   
Bitmap.MOUSE_DOWN、Bitmap.MOUSE_UP、Bitmap.MOUSE_UP_OUTSIDE、Bitmap.LOADでも可。  

arg2: イベントが発生した際に呼び出す関数。

arg3: オプション。衝突判定（ヒットテスト）を正円で行う場合はtrueに設定。初期値はfalse。 

### Returns（戻り値）
なし。

### Description（説明）
メソッド。指定したイベントのリスナーを加える。  
衝突判定（ヒットテスト）のエリアは、初期値は矩形。  
但し canvasObject.drawScreen() の引数で指定した色（初期値 #ffffff ）や透明の部分は含まれません。  
第3引数を true にした場合の衝突判定エリアは、正円になります。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _bitmap = new toile.Bitmap("sample.jpg");
	_bitmap.addEventListener("mousedown", mousedown_bitmap);
	_canvas.addChild(_bitmap);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mousedown_bitmap = (_bitmap) => {
	console.log(_bitmap); //=> Bitmapオブジェクト
}
```

### See Also（参照）
Bitmap.removeEventListener()、Bitmap.MOUSE_DOWN、Bitmap.MOUSE_UP, Bitmap.MOUSE_UP_OUTSIDE、Bitmap.LOAD  

<a name="Bitmapalpha"></a>
# Bitmap.alpha

### Syntax（構文）
bitmapObject.alpha

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
ビットマップの不透明度（0〜1.0）。初期値は1。  
0に設定すると完全に透明に、1で完全に不透明（全く透けていない）になります。

### Example（例）
```
var _bitmap = new toile.Bitmap("sample.jpg");
_bitmap.alpha = 0.5;
```

<a name="BitmapglobalX"></a>
# Bitmap.globalX

### Syntax（構文）
bitmapObject.globalX

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「水平」位置（ピクセル）。  
ネストしたContainer内にBitmapを配置し、各Containerの角度（rotate）や回転させる際の中心座標（regX、regY）を変更した場合などでも取得が可能です。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container(); //ビットマップを収めるコンテナ
	_container.x = 100;
	_container.y = 100;
	_canvas.addChild(_container);

	var _bitmap = new toile.Bitmap("sample.png");
	_bitmap.x = 50;
	_bitmap.y = 50;
	_container.addChild(_bitmap); //コンテナにビットマップを収める

	console.log(_bitmap.globalX, _bitmap.globalY); //=> 150 150
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Bitmap.globalY、Containerクラス、Container.rotate、Container.regX、Container.regY


<a name="BitmapglobalY"></a>
# Bitmap.globalY

### Syntax（構文）
bitmapObject.globalY

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「垂直」位置（ピクセル）。  
その他は、Bitmap.globalXと同じです。


<a name="Bitmapheight"></a>
# Bitmap.height

### Syntax（構文）
bitmapObject.height

### Description（説明）
プロパティ。ビットマップ（Bitmapインスタンス）の高さ。  
Bitmap.heightの値を変更すると、Bitmap.scaleYの値は元画像の高さに対する比率になります。  
Bitmap.heightの値を変更すると、Bitmap.scaleの値はnullになります。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _bitmap = new toile.Bitmap("sample.png");
	_bitmap.addEventListener("load", load_bitmap);
	_canvas.addChild(_bitmap);
	console.log(_bitmap.width, _bitmap.height);
	//=> nudefined nudefined（ロード終えていない）
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

function load_bitmap(_bitmap) {
	console.log(_bitmap.width, _bitmap.height);
}
```

### See Also（参照）
Bitmap.width、Bitmap.scaleY、Bitmap.scale


<a name="BitmaphitTest"></a>
# Bitmap.hitTest()

### Syntax（構文）
bitmapObject.hitTest(arg)

### Arguments（引数）
arg: ビットマップとの衝突を調べる表示オブジェクト（矩形）。

### Returns（戻り値）
「矩形同士」の衝突判定の結果を示すブール値。

### Description（説明）
メソッド。SuperDisplayクラスからの継承。  
指定した表示オブジェクトと交差（矩形領域）しているかを調べます。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousemove", mousemove_canvas);
	_canvas.enabledMouseMove(true);

	_bitmap1 = new toile.Bitmap("sample.jpg");
	_canvas.addChild(this._bitmap1);

	_bitmap2 = new toile.Bitmap("sample.png");
	_canvas.addChild(this._bitmap2);

    _mouseX = _mouseY = 0;
}

enterframe_canvas = (_canvas) => {
	_bitmap2.x = _mouseX;
	_bitmap2.y = _mouseY;
	if (_bitmap2.hitTest(_bitmap1)) {
		console.log("接触しています");
	}
	_canvas.drawScreen("#cccccc");
}

mousemove_canvas = (_canvas) => {
	_mouseX = _canvas.mouseX;
	_mouseY = _canvas.mouseY;
}
```

### See Also（参照）
Bitmap.hitTestCircle()


<a name="BitmaphitTestCircle"></a>
# Bitmap.hitTestCircle()

### Syntax（構文）
bitmapObject.hitTestCircle(arg)

### Arguments（引数）
arg: ビットマップとの衝突を調べる表示オブジェクト（正円形）。

### Returns（戻り値）
「正円形」同士の衝突判定の結果を示すブール値。

### Description（説明）
メソッド。SuperDisplayクラスからの継承。  
指定した表示オブジェクトと交差（正円形領域）しているかを調べます。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousemove", mousemove_canvas);
	_canvas.enabledMouseMove(true);

	_bitmap1 = new toile.Bitmap("circle.png");
	_canvas.addChild(this._bitmap1);

	_bitmap2 = new toile.Bitmap("circle.png");
	_canvas.addChild(this._bitmap2);

    _mouseX = _mouseY = 0;
}

enterframe_canvas = (_canvas) => {
	_bitmap2.x = _mouseX;
	_bitmap2.y = _mouseY;
	if (_bitmap2.hitTestCircle(_bitmap1)) {
		console.log("接触しています");
	}
	_canvas.drawScreen("#cccccc");
}

mousemove_canvas = (_canvas) => {
	_mouseX = _canvas.mouseX;
	_mouseY = _canvas.mouseY;
}
```

### See Also（参照）
Bitmap.hitTest()


<a name="Bitmapimage"></a>
# Bitmap.image

### Syntax（構文）
bitmapObject.image

### Description（説明）
プロパティ（読み取り専用）。  
HTML Canvas対応のJavaScriptとして予め用意されている、Imageオブジェクトが返ります。  
そのプロパティ「src」によって、画像のURLを取得/変更することも可能です。

### Example（例）
```
var _bitmap = new toile.Bitmap("sample.jpg");
console.log(_bitmap.image); //=> <img src="sample.jpg">
console.log(_bitmap.image.src); //=> "http://xxx/sample.jpg"
```

<a name="BitmapLOAD"></a>
# Bitmap.LOAD

### Syntax（構文）
Bitmap.LOAD

### Description（説明）
クラス変数。  
指定したPNG/JPEGファイルがロードされたら実行したい...という場合に使用します。  
Bitmap.addEventListener()でイベントを指定する際に使用します。  
toile.Bitmap.LOADの代わりに、文字列で"load"と指定しても同じ処理が行われます。  
ロードが完了しないと取得できないwidth、heightの値を調べる際などに利用します。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _bitmap = new toile.Bitmap("sample.jpg");
	console.log(_bitmap.width, _bitmap.height); //=> NaN NaN（ロード完了前なので取得不可）
	_bitmap.addEventListener(toile.Bitmap.LOAD, load_bitmap);
	//_bitmap.addEventListener("load", load_bitmap); //上記と同じ処理をします
	_canvas.addChild(_bitmap);
}

function load_bitmap(_bitmap) {
	console.log(_bitmap.width, _bitmap.height); //=> 320 320（ロード完了済の為取得可能）
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Bitmap.addEventListener()


<a name="BitmapMOUSE_DOWN"></a>
# Bitmap.MOUSE_DOWN

### Syntax（構文）
Bitmap.MOUSE_DOWN

### Description（説明）
クラス変数。  
toile.Bitmap.MOUSE_DOWN の代わりに、文字列で "mousedown" と指定しても同じ処理が行われます。  
Bitmapインスタンスをマウスダウンしたら実行したい...という場合に使用します。  
Bitmap.addEventListener()でイベントを指定する際に使用します。  
その場合、第3引数をtrueにすると、正円形で衝突判定を行い、falsae（省略可）にすると矩形で衝突判定を行います。  
また、第3引数をfalseにした場合、canvasObject.drawScreen()の引数で指定する色と同じ色の箇所は、衝突判定でfalse扱いとなり、ボタンとして反応しませんので、少しでも異なる色にするなど工夫して下さい。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _bitmap = new toile.Bitmap("circle.png"); //正円形のボタンが描かれた画像
	_bitmap.addEventListener(toile.Bitmap.MOUSE_DOWN, mousedown_bitmap, true);
	//_bitmap.addEventListener("mousedown", mousedown_bitmap, true); //上記と同じ処理
	_canvas.addChild(_bitmap);
}

mousedown_bitmap = (_bitmap) => {
	console.log("ボタンが押されました");
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Bitmap.addEventListener()、Bitmap.MOUSE_UP


<a name="BitmapMOUSE_UP"></a>
# Bitmap.MOUSE_UP

### Syntax（構文）
Bitmap.MOUSE_UP

### Description（説明）
クラス変数。  
toile.Bitmap.MOUSE_UPの代わりに、文字列で"mouseup"と指定しても同じ処理が行われます。  
Bitmapインスタンスをマウスダウン後、同じBitmapインスタンス上でマウスボタンを離した場合に実行したい...といった時に使用します。  
マウスダウン後に、同じBitmapインスタンス「外」の上でマウスボタンを離した場合は、ボタンとして反応しません（Bitmap.MOUSE_UP_OUTSIDEを参照）。  
Bitmap.addEventListener()でイベントを指定する際に使用します。  
その場合、第3引数をtrueにすると、正円形で衝突判定を行い、falsae（省略可）にすると矩形で衝突判定を行います。  
また、第3引数をfalseにした場合、canvasObject.drawScreen()の引数で指定する色と同じ色の箇所は、衝突判定でfalse扱いとなり、ボタンとして反応しませんので、少しでも異なる色にするなど工夫して下さい。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _bitmap = new toile.Bitmap("circle.png"); //正円形のボタンが描かれた画像
	_bitmap.addEventListener(toile.Bitmap.MOUSE_UP, mouseup_bitmap, true);
	//_bitmap.addEventListener("mouseup", mouseup_bitmap, true); //上記と同じ処理
	_canvas.addChild(_bitmap);
}

mouseup_bitmap = (_bitmap) => {
	console.log("ボタンをクリックしました");
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Bitmap.addEventListener()、Bitmap.MOUSE_DOWN、Bitmpa_MOUSE_UP_OUTSIDE


<a name="BitmapMOUSE_UP_OUTSIDE"></a>
# Bitmap.MOUSE_UP_OUTSIDE

### Syntax（構文）
Bitmap.MOUSE_UP_OUTSIDE

### Description（説明）
クラス変数。  
toile.Bitmap.MOUSE_UP_OUTSIDEの代わりに、文字列で"mouseupoutside"と指定しても同処理が行われます。  
Bitmapインスタンスをマウスダウン後、同じBitmapインスタンスの「外」でマウスボタンを離した場合に実行したい...といった時に使用します。  
Bitmap.addEventListener()でイベントを指定する際に使用します。  
その際、第3引数をfalseにした場合、canvasObject.drawScreen()の引数で指定する色と同じ色の箇所は、衝突判定でfalse扱いとなり、ボタンとして反応しませんので、少しでも異なる色にするなど工夫して下さい。  
Bitmapインスタンスをドラッグ＆ドロップしたい場合、Bitmapインスタンスの最端を選択して処理を行おうとすると、Bitmap.MOUSE_UPを検知できないという問題が生じる場合があります（高速にドラッグした場合など）。  
そういった場合に、Bitmap.MOUSE_UP_OUTSIDEを使って問題を回避します。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_isMove = false;
	_disX = _disY = 0;

	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousemove", mousemove_canvas);
	_canvas.enabledMouseMove(true);

	_bitmap = new toile.Bitmap("circle.png"); //正円形のボタンが描かれた画像
	_bitmap.addEventListener("mousedown", mousedown_bitmap);
	_bitmap.addEventListener("mouseup", mouseup_bitmap);
	_bitmap.addEventListener(toile.Bitmap.MOUSE_UP_OUTSIDE, mouseup_bitmap);
	//_bitmap.addEventListener("mouseupoutside", mouseup_bitmap); //上記と同じ処理
	_canvas.addChild(window._bitmap);

}

enterframe_canvas = (_canvas) => {
	if (_isMove) {
		_bitmap.x = _mouseX - _disX;
		_bitmap.y = _mouseY - _disY;
	}
	_canvas.drawScreen();
}

mousedown_bitmap = (_bitmap) => {
	_isMove = true;
	_disX = _canvas.mouseX - _bitmap.x;
	_disY = _canvas.mouseY - _bitmap.y;
}

mouseup_bitmap = (_bitmap) => {
	_isMove = false;
	console.log("ドラッグ＆ドロップ完了");
}

mousemove_canvas = (_canvas) => {
	_mouseX = _canvas.mouseX;
	_mouseY = _canvas.mouseY;
}
```

### See Also（参照）
Bitmap.addEventListener()、Bitmap.MOUSE_DOWN、Bitmpa_MOUSE_UP、Canvas.MOUSE_MOVE


<a name="Bitmapname"></a>
# Bitmap.name

### Syntax（構文）
bitmapObject.name

### Description（説明）
SuperDisplayクラスから継承するプロパティ。
Bitmapインスタンスのインスタンス名。初期値はundefined。

### Example（例）
```
var _background = new toile.Bitmap("sample.jpg");
_background.name = "background";
console.log(_background.name); //->"background"
```

<a name="Bitmapparent"></a>
# Bitmap.parent

### Syntax（構文）
bitmapObject.parent

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読み取り専用）。  
Bitmapが配置されているのコンテナを参照。  
最下層は"root"。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container01 = new toile.Container();
	_container01.name = "container01";
	_canvas.addChild(_container01);

	var _bitmap01 = new toile.Bitmap("sample.jpg");
	_bitmap01.name = "bitmap01";
	_container01.addChild(_bitmap01);

	console.log(_bitmap01.parent.name); //=> "container01"
	console.log(_bitmap01.parent.parent.name); //=> "root"
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}
```

### See Also（参照）
Containerクラス

<a name="BitmapregX"></a>
# Bitmap.regX

### Syntax（構文）
bitmapObject.regX

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転させる際の中心座標（水平座標）。  
初期値は0。

### Example（例）
```
var _bitmap = new toile.Bitmap("sample.jpg");
_bitmap.regX = 25;
_bitmap.regY = 25;
_bitmap.rotate = 45;
```

### See Also（参照）
Bitmap.regY、Bitmap.rotate、Bitmap.rotateRadian


<a name="BitmapregY"></a>
# Bitmap.regY

### Syntax（構文）
bitmapObject.regY

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転させる際の中心座標（垂直座標）。  
初期値は0。

### Example（例）
```
var _bitmap = new toile.Bitmap("sample.jpg");
_bitmap.regX = 25;
_bitmap.regY = 25;
_bitmap.rotate = 45;
```

### See Also（参照）
Bitmap.regX、Bitmap.rotate、Bitmap.rotateRadian


<a name="BitmapremoveEventListener"></a>
# Bitmap.removeEventListener()

### Syntax（構文）
bitmapObject.removeEventListener(arg)

### Arguments（引数）
arg: "mousedown"、"mouseup"、"mouseupoutside"、"load" の何れか。  
Bitmap.MOUSE_DOWN、Bitmap.MOUSE_UP、Bitmap.MOUSE_UP_OUTSIDE、Bitmap.LOADでも可。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。指定したイベントのリスナーを解除します。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _bitmap = new toile.Bitmap("sample.jpg");
	_bitmap.addEventListener("mousedown", mousedown_bitmap);
	_canvas.addChild(_bitmap);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}

mousedown_bitmap = (_bitmap) => {
	console.log("ここは一度しか実行されません");
	_bitmap.removeEventListener("mousedown");
}
```

### See Also（参照）
Bitmap.addEventListener()
Bitmap.MOUSE_DOWN、Bitmap.MOUSE_UP、Bitmap.MOUSE_UP_OUTSIDE、Bitmap.LOAD


<a name="Bitmaprotate"></a>
# Bitmap.rotate

### Syntax（構文）
bitmapObject.rotate

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転角度（単位は度）。初期値は0。

### Example（例）
```
var _bitmap = new toile.Bitmap("sample.jpg");
_bitmap.regX = 25;
_bitmap.regY = 25;
_bitmap.rotate = 45;
```

### See Also（参照）
Bitmap.regX、Bitmap.regY、Bitmap.rotateRadian


<a name="BitmaprotateRadian"></a>
# Bitmap.rotateRadian

### Syntax（構文）
bitmapObject.rotateRadian

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転角度（単位はラジアン）。初期値は0。

### Example（例）
```
var _bitmap = new toile.Bitmap("sample.jpg");
_bitmap.rotateRadian = Math.PI/4;
console.log(_bitmap.rotate); //=> 45（度）
console.log(_bitmap.rotateRadian); //=> 0.7853981633974483（ラジアン）
```

### See Also（参照）
Bitmap.regX、Bitmap.regY、Bitmap.rotate


<a name="Bitmapscale"></a>
# Bitmap.scale

### Syntax（構文）
bitmapObject.scaleX

### Description（説明）
プロパティ。拡大･縮小率。  
基準点はBitmap.xおよびBitmap.y。  
Bitmap.widthおよびBitmap.heightの値も変動します。  
Bitmap.scaleを変更するとBitmap.scaleX、Bitmap.scaleYの値も同じになります。  
Bitmap.scaleを変更するとBitmap.scaleXも同じ値になります。

### Example（例）
```
var _bitmap = new toile.Bitmap("sample.jpg");
_bitmap.scale = 2; //水平垂直方向ともに2倍にする
```

### See Also（参照）
Bitmap.scale、Bitmap.scaleY


<a name="BitmapscaleX"></a>
# Bitmap.scaleX

### Syntax（構文）
bitmapObject.scaleX

### Description（説明）
プロパティ。水平方向の拡大･縮小率。  
基準点はBitmap.xおよびBitmap.y。  
Bitmap.widthの値も変動します。初期値は1。  
Bitmap.scaleを変更するとBitmap.scaleXも同じ値になります。  
Bitmap.scaleXの値を変更するとBitmap.scaleの値はnullになります。

### Example（例）
```
var _bitmap = new toile.Bitmap("sample.jpg");
_bitmap.scaleX = 2; //水平方向のみ2倍に拡大
```

### See Also（参照）
Bitmap.scale、Bitmap.scaleY


<a name="BitmapscaleY"></a>
# Bitmap.scaleY

### Syntax（構文）
bitmapObject.scaleY

### Description（説明）
プロパティ。垂直方向の拡大･縮小率。  
基準点はBitmap.xおよびBitmap.y。  
Bitmap.heightの値も変動します。初期値は1。  
Bitmap.scaleを変更するとBitmap.scaleYも同じ値になります。  
Bitmap.scaleYの値を変更するとBitmap.scaleの値はnullになります。

### Example（例）
```
var _bitmap = new toile.Bitmap("sample.jpg");
_bitmap.scaleY = 2; //垂直方向のみ2倍に拡大。
```

### See Also（参照）
Bitmap.scale、Bitmap.scaleX


<a name="Bitmapwidth"></a>
# Bitmap.width

### Syntax（構文）
bitmapObject.width

### Description（説明）
プロパティ。ビットマップ（Bitmapインスタンス）の横幅。  
Bitmap.widthの値を変更すると、Bitmap.scaleXの値は元画像の横幅に対する比率になります。  
Bitmap.widthの値を変更すると、Bitmap.scaleの値はnullになります。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _bitmap = new toile.Bitmap("sample.png");
	_bitmap.addEventListener("load", load_bitmap);
	_canvas.addChild(_bitmap);
	console.log(_bitmap.width, _bitmap.height);
	//=> nudefined nudefined（ロード終えていない）
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

function load_bitmap(_bitmap) {
	console.log(_bitmap.width, _bitmap.height);
}
```

### See Also（参照）
Bitmap.height、Bitmap.scaleX、Bitmap.scale


<a name="Bitmapx"></a>
# Bitmap.x

### Syntax（構文）
bitmapObject.x

### Description（説明）
SuperDisplayクラスから継承するプロパティ。
水平座標位置（単位はピクセル）。

### Example（例）
```
var _bitmap = new toile.Bitmap("sample.jpg");
_bitmap.x = 10;
```

### See Also（参照）
Bitmap.y


<a name="Bitmapy"></a>
# Bitmap.y

### Syntax（構文）
bitmapObject.y

### Description（説明）
SuperDisplayクラスから継承するプロパティ。
垂直座標位置（単位はピクセル）。

### Example（例）
```
var _bitmap = new toile.Bitmap("sample.jpg");
_bitmap.y = 10;
```

### See Also（参照）
Bitmap.x


<a name="Canvas"></a>
# Canvas class

### Inheritance（継承）
なし。

### Methods（メソッド）

* [Canvas.addChild()](#CanvasaddChild): Canvas上に表示オブジェクトを配置
* [Canvas.addEventListener()](#CanvasaddEventListener): 指定したイベントのリスナーを追加する
* [Canvas.deleteChild()](#CanvasdeleteChild): Canvas上の表示オブジェクトを削除
* [Canvas.drawScreen()](#CanvasdrawScreen): Canvasの画面描画を更新
* [Canvas.enabledContextMenu()](#CanvasenabledContextMenu): Canvas上で右クリックの処理を有効にするか否か
* [Canvas.enabledMouseMove()](#CanvasenabledMouseMove): mousemove（touchmove）を有効にする
* [Canvas.exitFullscreen()](#CanvasexitFullscreen): Canvasの全画面表示を解除する
* [Canvas.getDepthElement()](#CanvasgetDepthElement): 任意の深度の表示オブジェクトを調べる
* [Canvas.getDepthIndex()](#CanvasgetDepthIndex): 任意の表示オブジェクトの深度を調べる
* [Canvas.getDepthMax()](#CanvasgetDepthMax): 最上位層の深度を調べる
* [Canvas.isBorder()](#CanvasisBorder): Canvasの外枠を有効にするか否か
* [Canvas.isFitWindow()](#CanvasisFitWindow): Canvasをブラウザ全面に表示するか否か
* [Canvas.removeEventListener()](#CanvasremoveEventListener): 指定したイベントのリスナーを解除する
* [Canvas.reload()](#Canvasreload): 問題回避（残像）用
* [Canvas.requestFullscreen()](#CanvasrequestFullscreen): Canvasを全画面表示する
* [Canvas.screenShot()](#CanvasscreenShot): Canvas全体のスクリーンショット
* [Canvas.setDepthIndex()](#CanvassetDepthIndex): 任意の表示オブジェクトの深度変更
* [Canvas.stopMouseDownEvent()](#CanvasstopMouseDownEvent): MouseDownイベント発生の伝達を防ぐ
* [Canvas.stopMouseUpEvent()](#CanvasstopMouseUpEvent): MouseUpイベント発生の伝達を防ぐ

### Properties（プロパティ）

* [Canvas.borderColor](#CanvasborderColor): Canvasの外枠の色
* [Canvas.borderWidth](#CanvasborderWidth): Canvasの外枠の線の太さ
* [Canvas.context2D](#Canvascontext2D): Canvasの2Dコンテキスト
* [Canvas.correctFPS](#CanvascorrectFPS): 内部的なフレームレート値
* [Canvas.cursor](#Canvascursor): マウスカーソルの形状
* [Canvas.fps](#Canvasfps): フレームレート
* [Canvas.height](#Canvasheight): Canvasの高さ
* [Canvas.mouseX](#CanvasmouseX): マウスポインタの水平座標
* [Canvas.mouseY](#CanvasmouseY): マウスポインタの垂直座標
* [Canvas.perspective](#Canvasperspective): Canvasの回転時のパースの度合い
* [Canvas.rotateX](#CanvasrotateX): X軸を中心にCanvas全体を回転
* [Canvas.rotateY](#CanvasrotateY): Y軸を中心にCanvas全体を回転
* [Canvas.width](#Canvaswidth): Canvasの幅

### Events（イベント）

* [Canvas.ENTER_FRAME](#CanvasENTER_FRAME): フレームが更新されたら
* [Canvas.KEY_DOWN](#CanvasKEY_DOWN): キーボードのキーを押したら
* [Canvas.KEY_UP](#CanvasKEY_UP): 押したキーを離したら
* [Canvas.MOUSE_DOWN](#CanvasMOUSE_DOWN): マウスボタンが押されたら（touchstart）
* [Canvas.MOUSE_MOVE](#CanvasMOUSE_MOVE): マウスボインタが動いたら（touchmove）
* [Canvas.MOUSE_UP](#CanvasMOUSE_UP): 押していたマウスボタンを離したら（touchend）

### Constructor（コンストラクタ）
①new toile.Canvas(arg)  
または  
②new toile.Canvas(arg1, arg2)

### Arguments（引数）
①の場合..
arg: HTMLドキュメントの\<canvas>要素のid属性を文字列で指定。

②の場合..
arg1: Canvasの幅（ピクセル）  
arg2: Canvasの高さ（ピクセル）

### Description（説明）
HTML Canvasを利用するために必須のクラスです。  
new Canvas(550, 400) のように指定する場合、HTMLドキュメントには\<canvas>要素が不要です。  
toile.jsを読み込む前、\<head>タグ内などに
```
<script>var toile = window;</script>
```
と記述すると「名前空間」を省いた参照方法、new Canvas(... といった記述が可能です。  
但しその場合、同じクラス名が他にも存在する場合、コンフリクトを起こしますので注意が必要です。

### Example（例）
【html】
```
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8">
        <script src="https://takashinishimura.github.io/ToileJS/toile.js"></script>
		<script src="main.js"></script>
	</head>
	<body>
		<canvas id="myCanvas" width="550" height="400"></canvas>
	</body>
</html>
```

【main.js】
```
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

<a name="CanvasaddChild"></a>
# Canvas.addChild()

### Syntax（構文）
canvasObject.addChild(arg)

### Arguments（引数）
arg: 表示オブジェクト（Bitmap/Circle/Container/Line/Rect/SpriteSheet/Text/Video）を指定。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。HTML Canvas上に表示したいオブジェクトを配置します。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
var _bitmap = new toile.Bitmap("sample.jpg");
_canvas.addChild(_bitmap);
```

### See Also（参照）
Canvas.deleteChild()


<a name="CanvasaddEventListener"></a>
# Canvas.addEventListener()

### Syntax（構文）
canvasObject.addEventListener(arg1, arg2)

### Arguments（引数）
arg1: ”enterframe”、"keydown"、"keyup"、"mousedown"、"mousemove"、"mouseup" の何れか。  
Canvas.ENTER_FRAME、Canvas.KEY_DOWN、Canvas.KEY_UP、Canvas.MOUSE_DOWN、Canvas.MOUSE_MOVE、Canvas.MOUSE_UP のクラス定数でも可能。

arg2: イベントが発生した際に呼び出す関数。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。指定したイベントのリスナーを加える。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousemove", mousemove_canvas);
	_canvas.enabledMouseMove(true);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mousemove_canvas = (_canvas, _evt) => { //第2引数はMouseEventオブジェクト
	console.log(_canvas.mouseX, _canvas.mouseY);
}
```

### See Also（参照）
Canvas.removeEventListener()、Canvas.ENTER_FRAME、Canvas.KEY_DOWN、Canvas.KEY_UP
Canvas.MOUSE_DOWN、Canvas.MOUSE_MOVE、Canvas.MOUSE_UP


<a name="CanvasborderColor"></a>
# Canvas.borderColor

### Syntax（構文）
canvaObject.borderColor

### Description（説明）
HTML Canvasの外枠（border）の色。  
初期値は、"rgb(0, 0, 0)"（黒）。  
設定は、RGB各色を0～255で指定する方法（例えば赤の場合 "rgb(255, 0, 0)"）か、16進数で指定する方法（赤の場合 "#ff0000"）どちらも有効です。  

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.isBorder(true);
_canvas.borderWidth = 5; //線幅5pxの場合
_canvas.borderColor = "#ff0000"; //赤の場合
```

### See Also（参照）
Canvas.borderWidth、Canvas.isBorder()


<a name="CanvasborderWidth"></a>
# Canvas.borderWidth

### Syntax（構文）
canvaObject.borderWidth

### Description（説明）
HTML Canvasの外枠（border）の線の太さ。  
初期値は"1px"。  
外枠が描画される位置は、外枠の左側および上側はCanvas領域のすぐ内側ですが、右側および下側はCanvas領域に外枠の幅（Canvas.borderWidth）を加えた位置のすぐ外側になるので、注意が必要です。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.isBorder(true);
_canvas.borderWidth = 5; //線幅5pxの場合
_canvas.borderColor = "#ff0000"; //赤の場合
```

### See Also（参照）
Canvas.borderColor、Canvas.isBorder()


<a name="Canvascontext2D"></a>
# Canvas.context2D

### Syntax（構文）
canvasObject.context2D

### Description（説明）
プロパティ（読み取り専用）。  
HTML Canvasの2Dコンテキスト（CanvasRenderingContext2Dオブジェクト）。  
2Dコンテキストを参照したい場合に使用します。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.isBorder(true);
}

enterframe_canvas = (_canvas) => {
    _canvas.rotateY -= 2;

    //裏面処理用
    var _theCount = Math.abs(_canvas.rotateY) % 360;
    if ((90 < _theCount ) && (_theCount < 270)) {
        _canvas.context2D.clearRect(0,0,_canvas.width,_canvas.height);
        _canvas.context2D.fillStyle = "rgba(86,82,82,1.0)";
        _canvas.context2D.fillRect(0,0,_canvas.width,_canvas.height);
        return;
    }

    _canvas.drawScreen();
}
```


<a name="CanvascorrectFPS"></a>
# Canvas.correctFPS

### Syntax（構文）
canvasObject.correctFPS

### Description（説明）
プロパティ（読み取り専用）。  
HTML Canvasを描画するフレームレート。  
Canvas.fpsで設定した値は、パフォーマンスを維持するために内部的には整数値で処理されます。  
そのため、設定した値と実際の値が異なる場合があります。  
このプロパティは、内部的に処理されている正確な設定値を調べる際に利用します。  
但しCanvas.fps同様、再生機器の処理能力等によって変動しますので、あくまで目安として考えてください。  
フレームレートの設定（あくまで目安）にはCanvas.fpsを利用して下さい。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.fps = 60;
	console.log(_canvas.fps); //=> 59
	console.log(_canvas.correctFPS); //=> 58.8235294117647
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Canvas.fps


<a name="Canvascursor"></a>
# Canvas.cursor

### Syntax（構文）
canvasObject.cursor

### Description（説明）
HTML Canvas上でのマウスカーソルの形状（初期設定は"default"）。"wait"で待機･処理中カーソル。  
.pngまたは.jpgファイルを指定するとオリジナルのカーソルに変更できます。  
不透明度が0％の画像は黒色で表現されてしまいますが、1％（ほぼ透明）以上の画像であればそのまま表示されます。  
したがってカーソルを消したい場合は、1x1pxの不透明度1％の.pngファイルを用意するとよいでしょう。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.cursor = "dummy.png";
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```


<a name="CanvasdeleteChild"></a>
# Canvas.deleteChild()

### Syntax（構文）
canvasObject.deleteChild(arg)

### Arguments（引数）
arg: 表示オブジェクト（Bitmap/Circle/Container/Line/Rect/SpriteSheet/Text/Video）を指定。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。Canvas.addChild()を使ってHTML Canvas上に表示したオブジェクトを削除します。  
削除後も画面の一部に残像がある場合、Canvas.reload() を使うと問題を回避できる場合もあります。  
表示オブジェクトをメモリ上からも削除する場合は、undefinedを代入します。  
Videoオブジェクトは、Container.deleteChilde()およびundefinedの代入後も、音が再生され続けることがあります。  
その場合、undefinedを代入する前に、Video.stop()で停止させる必要があります。  
※Container.deleteChild()参照。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_bitmap = new toile.Bitmap("sample.jpg");
	_bitmap.addEventListener("mousedown", mousedown_bitmap);
	_canvas.addChild(_bitmap);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mousedown_bitmap = (_bitmap) => {
	_canvas.deleteChild(_bitmap); //表示している画像を消す
}
```

### See Also（参照）
Canvas.addChild()、Canvas.reload()、Container.deleteChild()


<a name="CanvasdrawScreen"></a>
# Canvas.drawScreen()

### Syntax（構文）
canvasObject.drawScreen(arg)

### Arguments（引数）
arg: Canvasの背景色（"#ffcc00"など）を文字列で指定。省略可（初期値は"#ffffff"）。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。Canvasの画面描画を更新します。  
通常はcanvasObject.addEventListener("enterframe"...のリスナー関数内で実行します。  
HTML Canvasを扱う上で必須のメソッドです。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#ffcc00");
}
```

### See Also（参照）
Canvas.addEventListener()、Canvas.ENTER_FRAME


<a name="CanvasenabledContextMenu"></a>
# Canvas.enabledContextMenu()

### Syntax（構文）
canvasObject.enabledContextMenu(arg)

### Arguments（引数）
arg: Canvas上で右クリックの処理を有効にしたい場合true（初期値）。
無効にしたい場合はfalse。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。Canvas上で右クリックの処理を有効（初期値）にするか否かを指定します。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.enabledContextMenu(false);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```


<a name="CanvasenabledMouseMove"></a>
# Canvas.enabledMouseMove()

### Syntax（構文）
canvasObject.enabledMouseMove(arg)

### Arguments（引数）
arg: mousemoveイベント（モバイルの場合touchmove）を有効にしたい場合true。  
無効にしたい場合はfalse（初期値）。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。mousemoveイベント（モバイルの場合touchmove）を利用できるようにするか指定します。  
このイベントはパフォーマンスへの影響が大きい為、デフォルトでは利用不可になっています。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousemove", mousemove_canvas);
	_canvas.enabledMouseMove(true);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mousemove_canvas = (_canvas) => {
	console.log(_canvas.mouseX, _canvas.mouseY);
}
```

### See Also（参照）
Canvas.addEventListener()、Canvas.MOUSE_MOVE


<a name="CanvasENTER_FRAME"></a>
# Canvas.ENTER_FRAME

### Syntax（構文）
Canvas.ENTER_FRAME

### Description（説明）
クラス変数。  
フレームが更新された際に（フレームレートに依存）、任意の処理を実行したい場合に使用します。  
Canvas.addEventListener() でイベントを指定する際に使用します。  
toile.Canvas.ENTER_FRAMEの代わりに文字列で"enterframe"と指定しても同じ処理が行われます。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener(toile.Canvas.ENTER_FRAME, enterframe_canvas);
	//_canvas.addEventListener("enterframe", enterframe_canvas); //上記と同じ処理
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Canvas.addEventListener()


<a name="CanvasexitFullscreen"></a>
# Canvas.exitFullscreen()

### Syntax（構文）
canvasObject.exitFullscreen()

### Arguments（引数）
なし。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。Canvas.requestFullscreen()にる全画面表示を解除します。  
iOS、Androidには非対応。

### Example（例）
Canvas.requestFullscreen()参照。

### See Also（参照）
Canvas.requestFullscreen ()、Canvas.isFitWindow()


<a name="Canvasfps"></a>
# Canvas.fps

### Syntax（構文）
canvasObject.fps

### Description（説明）
プロパティ。HTML Canvasを描画するフレームレート。  
Canvas.addEventListener("enterframe",...で呼び出されるリスナー関数を実行する回数（fps＝フレーム/秒）を指定します。  
初期値は約30fps（30.303030...fps）。  
設定した値は、パフォーマンスを維持するために内部的には整数値で処理されます。  
そのため、設定した値と実際の値が異なる場合がありますので、あくまで「目安」として考えて下さい。  
例えば、30に設定した場合は30.3030...fpsとして、60に設定した場合は58.8235...fpsとして内部的に処理されますが、それも再生機器の処理能力等によって変動します。  
内部的な正確な設定値を調べる場合はCanvas.correnctFPS（読み取り専用）を使います。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.fps = 60;
	console.log(_canvas.fps); //=> 59
	console.log(_canvas.correctFPS); //=> 58.8235294117647
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Canvas.addEventListener()、Canvas.ENTER_FRAME、Canvas.correctFPS


<a name="CanvasgetDepthElement"></a>
# Canvas.getDepthElement()

### Syntax（構文）
canvasObject.getDepthElement(arg)

### Arguments（引数）
arg: 調べたい深度（数値）。最下位層は0。

### Returns（戻り値）
表示オブジェクト（Bitmap/Circle/Container/Line/Rect/SpriteSheet/Text/Video）のインスタンス。  
見つからない場合はundefinedが返ります。

### Description（説明）
メソッド。任意の深度（0～）の表示オブジェクトを調べる。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_bitmap1 = new toile.Bitmap("sample.png");
	_bitmap2 = new toile.Bitmap("sample.png");
	_bitmap3 = new toile.Bitmap("sample.png");
	_bitmap1.name = "sprite1";
	_bitmap2.name = "sprite2";
	_bitmap3.name = "sprite3";
	_canvas.addChild(_bitmap1);
	_canvas.addChild(_bitmap2);
	_canvas.addChild(_bitmap3);
	console.log(_canvas.getDepthElement(0).name); //=> "sprite1"
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Canvas.getDepthIndex()、Canvas.getDepthMax()、Canvas.setDepthIndex()


<a name="CanvasgetDepthIndex"></a>
# Canvas.getDepthIndex()

### Syntax（構文）
canvasObject.getDepthIndex(arg)

### Arguments（引数）
arg: 深度を調べたい表示オブジェクト。

### Returns（戻り値）
深度（最下位層は0）。

### Description（説明）
メソッド。任意の表示オブジェクトの深度（0〜）を調べる。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_bitmap1 = new toile.Bitmap("sample.png");
	_bitmap2 = new toile.Bitmap("sample.png");
	_bitmap3 = new toile.Bitmap("sample.png");
	_canvas.addChild(_bitmap1);
	_canvas.addChild(_bitmap2);
	_canvas.addChild(_bitmap3);
	console.log(_canvas.getDepthIndex(_bitmap1)); //=> 0
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Canvas.getDepthElement()、Canvas.getDepthMax()、Canvas.setDepthIndex()


<a name="CanvasgetDepthMax"></a>
# Canvas.getDepthMax()

### Syntax（構文）
canvasObject.getDepthMax()

### Arguments（引数）
なし。

### Returns（戻り値）
最上位層の深度。表示オブジェクトが無い場合-1。

### Description（説明）
メソッド。Canvas上の表示オブジェクトの最上位層（0〜）の深度を調べます。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_bitmap1 = new toile.Bitmap("sample.png");
	_bitmap2 = new toile.Bitmap("sample.png");
	_bitmap3 = new toile.Bitmap("sample.png");
	_canvas.addChild(_bitmap1);
	_canvas.addChild(_bitmap2);
	_canvas.addChild(_bitmap3);
	console.log(_canvas.getDepthMax()); //=> 2（表示オブジェクトが3つあることを意味する）
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Canvas.getDepthElement()、Canvas.getDepthIndex()、Canvas.setDepthIndex()


<a name="Canvasheight"></a>
# Canvas.height

### Syntax（構文）
canvasObject.height

### Description（説明）
プロパティ（読み取り専用）。Canvasの高さ（ピクセル）。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas(550,400);
	_canvas.addEventListener("enterframe", enterframe_canvas);
	console.log(_canvas.height); //=> 400
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Canvas.width

<a name="CanvasisBorder"></a>
# Canvas.isBorder()

### Syntax（構文）
canvasObject.isBorder(arg)

### Arguments（引数）
arg: Canvasの外枠を有効にするか否かを示すブール値。

### Description（説明）
メソッド。HTML Canvasの外枠（border）を有効にするか否かの設定。  
初期値はfalse状態（CSSで言えばcanvas.style.border = "none"）。  
trueの場合の初期値は、線幅1pxの黒（CSSで言えばcanvas.style.border = "solid 1px #000000"）。  
外枠が描画される位置は、外枠の左側および上側はCanvas領域のすぐ内側ですが、右側および下側はCanvas領域に外枠の幅（Canvas.borderWidth）を加えた位置のすぐ外側になるので、注意が必要です。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.isBorder(true);
_canvas.borderWidth = 5; //線幅5pxの場合
_canvas.borderColor = "#ff0000"; //赤の場合
```

### See Also（参照）
Canvas.borderColor、Canvas.borderWidth


<a name="CanvasisFitWindow"></a>
# Canvas.isFitWindow()

### Syntax（構文）
canvasObject.isFitWindow(arg)

### Arguments（引数）
arg: Canvasをブラウザ全面に表示するか否かのブール値。

### Description（説明）
メソッド。trueで設定するとCanvasはブラウザ内で全画面表示されます（縦または横サイズどちらかに最大でフィットする状態）。  
ブラウザをリサイズにも対応します。  
初期値はfalse状態。  
なお、現状ではCanvas.requestFullscreen()との併用はできません。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.isBorder(true);
	_isFullscreen = false;

	_fitScreenBtn = new toile.Bitmap("fitScreen.png");
	_fitScreenBtn.x = _canvas.width - 40;
	_fitScreenBtn.y = _canvas.height - 40;
	_fitScreenBtn.addEventListener("mousedown", mousedown_fullscreen);
	_canvas.addChild(_fitScreenBtn);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mousedown_fullscreen = (_bitmap) => {
	if (! _isFullscreen) {
		_canvas.isFitWindow(true);
	} else {
		_canvas.isFitWindow(false);
	}
	_isFullscreen = ! _isFullscreen;
}
```

### See Also（参照）
Canvas.requestFullscreen()、Canvas.exitFullscreen()


<a name="CanvasKEY_DOWN"></a>
# Canvas.KEY_DOWN

### Syntax（構文）
Canvas.KEY_DOWN

### Description（説明）
クラス変数。キーボードのキーを押した際に、任意の処理を実行したい場合に使用します。  
Canvas.addEventListener() でイベントを指定する際に使用します。  
toile.Canvas.KEY_DOWNの代わりに文字列で"keydown"と指定しても同じ処理が行われます。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener(toile.Canvas.KEY_DOWN, keydown_canvas);
	//_canvas.addEventListener("keydown", keydown_canvas); //上記と同じ処理
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

function keydown_canvas(_canvas, _keyEvent) { //第2引数はKeyboardEventオブジェクト
	console.log(_keyEvent.keyCode, _keyEvent.key);
}
```

### See Also（参照）
Canvas.addEventListener()


<a name="CanvasKEY_UP"></a>
# Canvas.KEY_UP

### Syntax（構文）
Canvas.KEY_UP

### Description（説明）
クラス変数。  
キーボードの押したキーを離した際に、任意の処理を実行したい場合に使用します。  
Canvas.addEventListener() でイベントを指定する際に使用します。  
toile.Canvas.KEY_UPの代わりに文字列で"keyup"と指定しても同じ処理が行われます。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener(toile.Canvas.KEY_UP, keyup_canvas);
	//_canvas.addEventListener("keyup", keyup_canvas); //上記と同じ処理
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

function keyup_canvas(_canvas, _keyEvent) { //第2引数はKeyboardEventオブジェクト
	console.log(_keyEvent.keyCode, _keyEvent.key);
}
```

### See Also（参照）
Canvas.addEventListener()


<a name="CanvasMOUSE_DOWN"></a>
# Canvas.MOUSE_DOWN

### Syntax（構文）
Canvas.MOUSE_DOWN

### Description（説明）
クラス定数。  
HTML Canvas上でマウスボタンを押した際に、任意の処理を実行したい場合に使用します。  
Canvas.addEventListener() でイベントを指定する際に使用します。  
Canvas.MOUSE_DOWNの代わりに文字列で"mousedown"と指定しても同じ処理が行われます。  
モバイルの場合、"touchstart"として内部処理されます。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener(toile.Canvas.MOUSE_DOWN, mousedown_canvas);
	//_canvas.addEventListener("mousedown", mousedown_canvas); //上記と同じ処理
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}

mousedown_canvas = (_canvas, _mouseEvent) => { //第2引数はMouseEventオブジェクト
	console.log("Canvas上でマウスボタンを押しました");
}
```

### See Also（参照）
Canvas.addEventListener()、Canvas.MOUSE_UP


<a name="CanvasMOUSE_MOVE"></a>
# Canvas.MOUSE_MOVE

### Syntax（構文）
Canvas.MOUSE_MOVE

### Description（説明）
クラス定数。  
マウスボインタが動い際に、任意の処理を実行したい場合に使用します。  
Canvas.addEventListener() でイベントを指定する際に使用します。  
Canvas.MOUSE_MOVEの代わりに文字列で"mousemove"と指定しても同じ処理が行われます。  
このイベントを使う場合、Canvas.enabledMouseMove(true)を記述する必要があります。  
モバイルの場合、"touchmove"として内部処理されます。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener(toile.Canvas.MOUSE_MOVE, mousemove_canvas);
	//_canvas.addEventListener("mousemove", mousemove_canvas); //上記と同じ処理
	_canvas.enabledMouseMove(true);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mousemove_canvas = (_canvas, _mouseEvent) => { //第2引数はMouseEventオブジェクト
	console.log(_canvas.mouseX, _canvas.mouseY);
}
```

### See Also（参照）
Canvas.addEventListener()、Canvas.enabledMouseMove()


<a name="CanvasMOUSE_UP"></a>
# Canvas.MOUSE_UP

### Syntax（構文）
Canvas.MOUSE_UP

### Description（説明）
クラス定数。  
HTML Canvas上で押していたマウスボタンを離した際に、任意の処理を実行したい場合に使用します。  
Canvas.addEventListener() でイベントを指定する際に使用します。  
Canvas.MOUSE_UPの代わりに文字列で"mouseup"と指定しても同じ処理が行われます。  
モバイルの場合、"touchend"として処理されます。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener(toile.Canvas.MOUSE_UP, mouseup_canvas);
	//_canvas.addEventListener("mouseup", mouseup_canvas); //上記と同じ処理
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}

mouseup_canvas = (_canvas, _mouseEvent) => { //第2引数はMouseEventオブジェクト
	console.log("Canvas上で押していたマウスボタンを離しました");
}
```

### See Also（参照）
Canvas.addEventListener()、Canvas.MOUSE_DOWN


<a name="CanvasmouseX"></a>
# Canvas.mouseX

### Syntax（構文）
canvasObject.mouseX

### Description（説明）
プロパティ（読み取り専用）。マウスポインタの水平座標。  
取得できる値は、Canvas左端が0。右端がCanvas.width-1になります。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousemove", mousemove_canvas);
	_canvas.enabledMouseMove(true);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mousemove_canvas = (_canvas, _evt) => { //第2引数はMouseEventオブジェクト
	console.log(_canvas.mouseX, _canvas.mouseY);
}
```

### See Also（参照）
Canvas.mouseY


<a name="CanvasmouseY"></a>
# Canvas.mouseY

### Syntax（構文）
canvasObject.mouseY

### Description（説明）
プロパティ（読み取り専用）。マウスポインタの垂直座標。  
取得できる値は、Canvas上端が0。下端がCanvas.height-1になります。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousemove", mousemove_canvas);
	_canvas.enabledMouseMove(true);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mousemove_canvas = (_canvas, _evt) => { //第2引数はMouseEventオブジェクト
	console.log(_canvas.mouseX, _canvas.mouseY);
}
```

### See Also（参照）
Canvas.mouseX


<a name="CanvasremoveEventListener"></a>
# Canvas.removeEventListener()

### Syntax（構文）
canvasObject.removeEventListener(arg)

### Arguments（引数）
arg: ”enterframe”、"keydown"、"keyup"、"mousedown"、"mousemove"、"mouseup" の何れか。  
Canvas.ENTER_FRAME、Canvas.KEY_DOWN、Canvas.KEY_UP、Canvas.MOUSE_DOWN、Canvas.MOUSE_MOVE、Canvas.MOUSE_UP のクラス定数でも可能。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。指定したイベントのイベントリスナーを解除する。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousedown", mousedown_canvas);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mousedown_canvas = (_canvas, _evt) => { //第2引数はMouseEventオブジェクト
	console.log("一度だけ実行したい内容をここに記述");
	_canvas.removeEventListener("mousedown");
}
```

### See Also（参照）
Canvas.removeEventListener()、Canvas.ENTER_FRAME、Canvas.KEY_DOWN、Canvas.KEY_UP
Canvas.MOUSE_DOWN、Canvas.MOUSE_MOVE、Canvas.MOUSE_UP


<a name="Canvasreload"></a>
# Canvas.reload()

### Syntax（構文）
canvasObject.reload()

### Arguments（引数）
なし。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。問題回避（残像）用。  
HTML Canvas上に表示されているオブジェクトを削除した時や、座標を変更した際に、画面の一部に残る予期せぬ画像を消したい場合などに利用します。

### Example（例）
```
_canvas.deleteChild(_bitmap);
_canvas.reload();
```

### See Also（参照）
Canvas.deleteChild()


<a name="CanvasrequestFullscreen"></a>
# Canvas.requestFullscreen()

### Syntax（構文）
canvasObject.requestFullscreen()

### Arguments（引数）
なし。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。Canvas（canvas要素）のみを簡易的に全画面表示します。  
Canvasのサイズはそのままで画面中央に表示され、Canvasの周囲は黒くなります（ブラウザによって異なります）。  
iOS、Androidには非対応。  
プレゼンテーションなどの利用に適したモードです。  
なお、現状ではCanvas.isFitWindow()との併用はできません。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousedown", mousedown_canvas);
	_canvas.isBorder(true);
	window._isFullscreen = false;
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mousedown_canvas = (_canvas) => {
	if (! _isFullscreen) {
		_canvas.requestFullscreen(); //全画面モードにする
	} else {
		_canvas.exitFullscreen(); //全画面モードを解除する
	}
	_isFullscreen = ! _isFullscreen;
}
```

### See Also（参照）
Canvas.exitFullscreen()、Canvas.isFitWindow()


<a name="CanvasscreenShot"></a>
# Canvas.screenShot()

### Syntax（構文）
canvasObject.screenShot([arg1,arg2,arg3,arg4,arg5])

### Arguments（引数）
arg1: 元画像中の表示させたい水平座標の開始位置。省略可能（初期値は0）。  
arg2: 元画像中の表示させたい垂直座標の開始位置。省略可能（初期値は0）。  
arg3: 元画像中の表示させたい水平座標の終了位置。省略可能。  
arg4: 元画像中の表示させたい垂直座標の終了位置。省略可能。  
arg5: "jpeg"または"png"。省略可能（初期値は"jpeg"）。

### Returns（戻り値）
Bitmapクラスのインスタンス。

### Description（説明）
メソッド。HTML Canvas全体のスクリーンショットを取り、Bitmapクラスのインスタンスを返します。  
第1～4引数を使って、クロップ（トリミング）することも可能。

### Example（例）
```
// main.js

// HTMLのロードが完了した際のイベントリスナーの定義
window.addEventListener("load", load_window, false);

// HTMLのロードが完了したら…
function load_window() {
	//Canvasの生成
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousedown", mousedown_canavas);

	//1つ目の画像
	_image1 = new toile.Bitmap("image1.jpg");
	_canvas.addChild(_image1);

	//２つ目の画像
	_image2 = new toile.Bitmap("image2.png");
	_canvas.addChild(_image2);
}

// Canvasの再描画（30fps毎）の際に実行したい処理…
function enterframe_canvas(_canvas) {
	if (window._screenShot != undefined) {
		window._screenShot.y += 10;
	}

	_canvas.drawScreen("#ffffff");
}

function mousedown_canavas(_canvas) {
	_screenShot = _canvas.screenShot(); //Canvas全体をスナップショット
	_canvas.addChild(_screenShot); //スナップショットした画像をCanvasに配置

	//元の画像を全て削除（オプション）
	_canvas.deleteChild(_image1);
	_canvas.deleteChild(_image2);
	_image1 = _image2 = undefined;
}
```

### See Also（参照）
Bitmap()クラス



<a name="CanvassetDepthIndex"></a>
# Canvas.setDepthIndex()

### Syntax（構文）
canvasObject.getDepthIndex(arg1, arg2)

### Arguments（引数）
arg1: 深度を変更したい表示オブジェクト。  
arg2: 指定したい深度。0～Canvas.getDepthMax()。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。任意の表示オブジェクトを指定した深度（0～Canvas.getDepthMax()）に変更します。

### Example（例）
```
//最上位層にしたい場合...
_canvas.setDepthIndex(_bitmap1, _canvas.getDepthMax());

//最下位層にしたい場合...
_canvas.setDepthIndex(_bitmap3, 0);

//任意の表示オブジェクトと深度を入れ替えたい場合...
_canvas.setDepthIndex(_bitmap1, _canvas.getDepthIndex(_bitmap2));
```

### See Also（参照）
Canvas.getDepthElement()、Canvas.getDepthIndex()、Canvas.getDepthMax()


<a name="CanvasstopMouseDownEvent"></a>
# Canvas.stopMouseDownEvent()

### Syntax（構文）
canvasObject.stopMouseDownEvent()

### Arguments（引数）
なし。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。MouseDownイベント発生の伝達を防ぐ。  
表示オブジェクトが重なっている場合などで、MouseDownイベントの伝達を防ぐことができます。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_bitmap1 = new toile.Bitmap("sample.png");
	_bitmap2 = new toile.Bitmap("sample.png");
	_bitmap3 = new toile.Bitmap("sample.png");
	_bitmap1.name = "sprite1";
	_bitmap2.name = "sprite2";
	_bitmap3.name = "sprite3";
	_canvas.addChild(_bitmap1);
	_canvas.addChild(_bitmap2);
	_canvas.addChild(_bitmap3);
	_bitmap2.x = _bitmap2.y = 25;
	_bitmap3.x = _bitmap3.y = 50;
	_bitmap1.addEventListener("mousedown", mousedown_bitmap);
	_bitmap2.addEventListener("mousedown", mousedown_bitmap);
	_bitmap3.addEventListener("mousedown", mousedown_bitmap);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mousedown_bitmap = (_bitmap) => {
	console.log(_bitmap.name);
	_canvas.stopMouseDownEvent();
}
```

### See Also（参照）
Canvas.addEventListener()、Bitmap.addEventListener()、SpriteSheet.addEventListener()
Bitmap.MOUSE_DOWN、SpriteSheet.MOUSE_DOWN


<a name="CanvasstopMouseUpEvent"></a>
# Canvas.stopMouseUpEvent()

### Syntax（構文）
canvasObject.stopMouseUpEvent()

### Arguments（引数）
なし。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。MouseUpイベント発生の伝達を防ぐ。  
表示オブジェクトが重なっている場合などで、MouseUpイベントの伝達を防ぐことができます。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_bitmap1 = new toile.Bitmap("sample.png");
	_bitmap2 = new toile.Bitmap("sample.png");
	_bitmap3 = new toile.Bitmap("sample.png");
	_bitmap1.name = "sprite1";
	_bitmap2.name = "sprite2";
	_bitmap3.name = "sprite3";
	_canvas.addChild(_bitmap1);
	_canvas.addChild(_bitmap2);
	_canvas.addChild(_bitmap3);
	_bitmap2.x = _bitmap2.y = 25;
	_bitmap3.x = _bitmap3.y = 50;
	_bitmap1.addEventListener("mouseup", mouseup_bitmap);
	_bitmap2.addEventListener("mouseup", mouseup_bitmap);
	_bitmap3.addEventListener("mouseup", mouseup_bitmap);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mouseup_bitmap = (_bitmap) => {
	console.log(_bitmap.name);
	_canvas.stopMouseUpEvent();
}
```

### See Also（参照）
Canvas.addEventListener()、Bitmap.addEventListener()、SpriteSheet.addEventListener()
Bitmap.MOUSE_UP、SpriteSheet.MOUSE_UP


<a name="Canvasperspective"></a>
# Canvas.perspective

### Syntax（構文）
canvasObject.perspective

### Description（説明）
Canvasの回転時のパースの度合い。初期値は5000。  
値が小さいと遠近感が強調されます（1000〜10000程度が適切）。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.isBorder(true);
    _canvas.perspective = 1000;
}

enterframe_canvas = (_canvas) => {
    _canvas.rotateY -=2;
    _canvas.drawScreen();
}
```

### See Also（参照）
Canvas.rotateX、Canvas.rotateY


<a name="CanvasrotateX"></a>
# Canvas.rotateX

### Syntax（構文）
canvasObject.rotateX

### Description（説明）
X軸を中心にCanvas全体を回転。初期値は0（度）。  
360（度）で1回転。マイナス値や360以上の値も扱えます。  
裏面処理をするには例文のような工夫が必要です。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.isBorder(true);
    _canvas.perspective = 1000;
}

enterframe_canvas = (_canvas) => {
    _canvas.rotateX -= 2;

    //裏面処理用（オプション）
    var _theCount = Math.abs(_canvas.rotateX) % 360;
    if ((90 < _theCount ) && (_theCount < 270)) {
        _canvas.context2D.clearRect(0,0,_canvas.width,_canvas.height);
        _canvas.context2D.fillStyle = "rgba(86,82,82,1.0)";
        _canvas.context2D.fillRect(0,0,_canvas.width,_canvas.height);
        return;
    }

    _canvas.drawScreen();
}
```

### See Also（参照）
Canvas.rotateY、Canvas.perspective


<a name="CanvasrotateY"></a>
# Canvas.rotateY

### Syntax（構文）
canvasObject.rotateY

### Description（説明）
Y軸を中心にCanvas全体を回転。初期値は0（度）。  
360（度）で1回転。マイナス値や360以上の値も扱えます。  
裏面処理をするには例文のような工夫が必要です。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.isBorder(true);
    _canvas.perspective = 1000;
}

enterframe_canvas = (_canvas) => {
    _canvas.rotateY -= 2;

    //裏面処理用（オプション）
    var _theCount = Math.abs(_canvas.rotateY) % 360;
    if ((90 < _theCount ) && (_theCount < 270)) {
        _canvas.context2D.clearRect(0,0,_canvas.width,_canvas.height);
        _canvas.context2D.fillStyle = "rgba(86,82,82,1.0)";
        _canvas.context2D.fillRect(0,0,_canvas.width,_canvas.height);
        return;
    }

    _canvas.drawScreen();
}
```

### See Also（参照）
Canvas.rotateX、Canvas.perspective


<a name="Canvaswidth"></a>
# Canvas.width

### Syntax（構文）
canvasObject.width

### Description（説明）
プロパティ（読み取り専用）。Canvasの幅（ピクセル）。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas(550,400);
	_canvas.addEventListener("enterframe", enterframe_canvas);
	console.log(_canvas.width); //=> 550
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Canvas.height


<a name="Circle"></a>
# Circle class

### Inheritance（継承）
Circle -> SuperDisplay

### Methods（メソッド）

* [Circle.hitTest()](#CirclehitTest): 指定したオブジェクトと重なっているか（矩形）
* [Circle.hitTestCircle()](#CirclehitTestCircle): 指定したオブジェクトと重なっているか（円形）
* [Circle.isFill()](#CircleisFill): 矩形の塗りを有効にするか否か

### Properties（プロパティ）

* [Circle.alpha](#Circlealpha): 表示オブジェクトの不透明度
* [Circle.centerX](#CirclecenterX): 中心の水平座標位置
* [Circle.centerY](#CirclecenterY): 中心の垂直座標位置
* [Circle.globalX](#CircleglobalX): グローバル水平座標位置
* [Circle.globalY](#CircleglobalY): グローバル垂直座標位置
* [Circle.fillAlpha](#CirclefillAlpha): 矩形の塗りの部分のアルファ値
* [Circle.fillColor](#CirclefillColor): 矩形の塗りの色
* [Circle.lineAlpha](#CirclelineAlpha): 矩形の線のアルファ値
* [Circle.lineColor](#CirclelineColor): 矩形の線の色
* [Circle.lineWidth](#CirclelineWidth): 矩形の線の太さ
* [Circle.name](#Circlename): Circleインスタンスのインスタンス名
* [Circle.parent](#Circleparent): Circleが配置されているコンテナを参照
* [Circle.radius](#Circleradius): 円の半径
* [Circle.scale](#Circlescale): 拡大･縮小率
* [Circle.x](#Circlex): 左上の水平座標位置
* [Circle.y](#Circley): 左上の垂直座標位置

### Constructor（コンストラクタ）
new toile.Circle(arg1, arg2, arg3)

### Arguments（引数）
arg1: 正円を囲む矩形の左上の水平座標（初期値0）  
arg2: 正円を囲む矩形の左上の垂直座標（初期値0）  
arg3: 正円の半径（ピクセル／初期値100）

### Description（説明）
HTML Canvas上に正円を描くためのクラス。  
正円を囲む矩形の左上の位置、半径を指定して正円を生成します。  
toile.jsを読み込む前、\<head>タグ内などに
```
<script>var toile = window;</script>
```
と記述すると「名前空間」を省いた参照方法、new Circle(... といった記述が可能です。  
但しその場合、同じクラス名が他にも存在する場合、コンフリクトを起こしますので注意が必要です。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_circle = new toile.Circle(100, 100, 50);
	_canvas.addChild(_circle);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
SuperDisplayクラス


<a name="Circlealpha"></a>
# Circle.alpha

### Syntax（構文）
circleObject.alpha

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
Circleオブジェクトの不透明度（0〜1.0）。初期値は1。  
0に設定すると完全に透明に、1で完全に不透明（全く透けていない）になります。  
Circle.fillAlphaやCircle.fillAlphaの値に加えて適用されます。

### Example（例）
```
// main.js
addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_circle = new toile.Circle(100,100,50);
	_canvas.addChild(_circle);
	_circle.isFill(true);
	_circle.fillColor = "255,0,0";
	_circle.lineWidth = 20;
	_circle.alpha = 0.5;
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Circle.isFill()、Circle.fillAlpha、Circle.lineAlpha


<a name="CirclecenterX"></a>
# Circle.centerX

### Syntax（構文）
circleObject.centerX

### Description（説明）
プロパティ。正円の中心の水平座標。  
Circle.x + Circle.radiusと同じ値です。初期値は100。  
正円を囲む矩形の左上の水平座標を示すプロパティはCircle.xです。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.isBorder(true);

	_circle = new toile.Circle(100, 100, 20);
	_canvas.addChild(_circle);

	_speedX = 10;
	_speedY = 10;
}

enterframe_canvas = (_canvas) => {
	//水平方向
	var _nextX = _circle.centerX + _speedX;

	if ((_nextX < _circle.radius) || (_nextX > (_canvas.width - _circle.radius))) {
		_speedX = - _speedX;
	} else {
		_circle.centerX = _nextX;
	}

	//垂直方向
	var _nextY = _circle.centerY + _speedY;

	if ((_nextY < _circle.radius) || (_nextY > (_canvas.height - _circle.radius))) {
		_speedY = - _speedY;
	} else {
		_circle.centerY = _nextY;
	}

	_canvas.drawScreen();
}
```

### See Also（参照）
Circle.centerY、Circle.x、Circle.y


<a name="CirclecenterY"></a>
# Circle.centerY

### Syntax（構文）
circleObject.centerY

### Description（説明）
プロパティ。正円の中心の垂直座標。  
Circle.y + Circle.radiusと同じ値です。初期値は100。  
正円を囲む矩形の左上の水平座標を示すプロパティはCircle.yです。

### Example（例）
Circle.centerX参照。

### See Also（参照）
Circle.centerX、Circle.x、Circle.y


<a name="CircleglobalX"></a>
# Circle.globalX

### Syntax（構文）
circleObject.globalX

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「水平」位置（ピクセル）。  
ネストしたContainer内にCircleを配置し、各Containerの角度（rotate）や回転させる際の中心座標（regX、regY）を変更した場合などでも取得が可能です。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container(); //Circleを収めるコンテナ
	_container.x = 50;
	_container.y = 50;
	_container.regX = 30;
	_container.regY = 30;
	_container.rotate = 30;
	_canvas.addChild(_container);

	var _circle = new toile.Circle(40,40,30);
	_container.addChild(_circle); //コンテナにCircleを収める

	console.log(_circle.globalX, _circle.globalY);
	//=> 83.66025403784438 93.66025403784438
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Circle.globalY、Containerクラス、Container.rotate、Container.regX、Container.regY


<a name="CircleglobalY"></a>
# Circle.globalY

### Syntax（構文）
circleObject.globalY

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「垂直」位置（ピクセル）。  
その他は、Circle.globalXと同じです。


<a name="CirclefillAlpha"></a>
# Circle.fillAlpha

### Syntax（構文）
circleObject.fillAlpha

### Description（説明）
プロパティ。  
Circleオブジェクトの「塗りの部分」の不透明度（0〜1.0）。初期値は1。  
0に設定すると完全に透明に、1で完全に不透明（全く透けていない）になります。  
Circle.Alphaの値は、このCircle.fillAlphaの値に加えて適用されます。

### Example（例）
```
// main.js
addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_circle = new toile.Circle(100,100,50);
	_canvas.addChild(_circle);
	_circle.isFill(true);
	_circle.fillColor = "255,0,0";
	_circle.fillAlpha = 0.5;
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Circle.isFill()、Circle.Alpha、Circle.lineAlpha


<a name="CirclefillColor"></a>
# Circle.fillColor

### Syntax（構文）
circleObject.fillColor

### Description（説明）
プロパティ。  
Circleオブジェクトの塗りの色。初期値は"255,255,255"（白）。  
RGB各色を0〜255で指定。例えば、赤の場合は"255,0,0"とします。

### Example（例）
```
// main.js
addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_circle = new toile.Circle(100,100,50);
	_canvas.addChild(_circle);
	_circle.isFill(true);
	_circle.fillColor = "255,0,0"; //赤
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Circle.isFill()、Circle.fillAlpha

<a name="CirclehitTest"></a>
# Circle.hitTest()

### Description（説明）
SuperDisplayクラスから継承するメソッド。  
このメソッドは、指定したオブジェクトと重なっているかを「矩形」領域同士で判定するため、正円であるCircleオブジェクトで利用することは通常ではないと思います。  
Circle.hitTestCircle()を利用して下さい。

### See Also（参照）
Circle.hitTestCircle()


<a name="CirclehitTestCircle"></a>
# Circle.hitTestCircle()

### Syntax（構文）
circleObject.hitTestCircle(arg)

### Arguments（引数）
arg: Circleオブジェクトと重なっているかを調べる「正円形」の表示オブジェクト。

### Returns（戻り値）
「正円形」同士の衝突判定の結果を示すブール値。

### Description（説明）
メソッド。SuperDisplayクラスからの継承。  
指定した表示オブジェクトと交差（正円形領域）しているかを調べます。

### Example（例）
```
// main.js
addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousemove", mousemove_canvas);
	_canvas.enabledMouseMove(true);

	//動く円
	_circleMove = new toile.Circle(0,0,30);
	_canvas.addChild(_circleMove);

	//静止した円（Circleオブジェクト）
	_circleFix = new toile.Circle(400,100,50);
	_canvas.addChild(_circleFix);

	//静止した円（Bitmapオブジェクト）
	_bitmapFix = new toile.Bitmap("circle.png");
	_bitmapFix.x = _bitmapFix.y = 50;
	_canvas.addChild(_bitmapFix);

    _mouseX = _mouseY = 0;
}

enterframe_canvas = (_canvas) => {
	_circleMove.x = _mouseX;
	_circleMove.y = _mouseY;

	if (_circleMove.hitTestCircle(_circleFix)) {
		console.log("CirleとCircle接触");
	}

	if (_circleMove.hitTestCircle(_bitmapFix)) {
		console.log("CirleとBitmap接触");
	}

	_canvas.drawScreen();
}

mousemove_canvas = (_canvas) => {
	_mouseX = _canvas.mouseX;
	_mouseY = _canvas.mouseY;
}
```

### See Also（参照）
Circle.hitTest()


<a name="CircleisFill"></a>
# Circle.isFill()

### Syntax（構文）
circleObject.isFill(arg)

### Arguments（引数）
arg: Circleオブジェクトの塗りを有効にするか否かを示すブール値。

### Description（説明）
メソッド。Circleオブジェクトの塗りを有効にするか（初期値はfalse）。  
trueにした場合の初期値の色は、"255,255,255"（白）。

### Example（例）
```
// main.js
addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_circle = new toile.Circle(100,100,50);
	_canvas.addChild(_circle);
	_circle.isFill(true);
	_circle.fillColor = "255,0,0"; //赤
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Circle.fillColor、Circle.fillAlpha


<a name="CirclelineAlpha"></a>
# Circle.lineAlpha

### Syntax（構文）
circleObject.lineAlpha

### Description（説明）
プロパティ。  
Circleオブジェクトの「線の部分」の不透明度（0〜1.0）。初期値は1。  
0に設定すると完全に透明に、1で完全に不透明（全く透けていない）になります。  
Circle.Alphaの値は、このCircle.lineAlphaの値に加えて適用されます。

### Example（例）
```
// main.js
addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_circle = new toile.Circle(100,100,50);
	_canvas.addChild(_circle);
	_circle.isFill(true);
	_circle.fillColor = "255,0,0";
	_circle.lineWidth = 20;
	_circle.lineAlpha = 0.5;
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Circle.Alpha、Circle.fillAlpha、Circle.lineWidth


<a name="CirclelineColor"></a>
# Circle.lineColor

### Syntax（構文）
circleObject.lineColor

### Description（説明）
プロパティ。  
Circleオブジェクトの線の色。初期値は"0,0,0"（黒）。  
RGB各色を0〜255で指定。例えば、赤の場合は"255,0,0"とします。

### Example（例）
```
// main.js
addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_circle = new toile.Circle(100,100,50);
	_canvas.addChild(_circle);
	_circle.lineColor = "255,0,0"; //赤
	_circle.lineWidth = 20;
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Circle.lineAlpha、Circle.lineWidth


<a name="CirclelineWidth"></a>
# Circle.lineWidth

### Syntax（構文）
circleObject.lineWidth

### Description（説明）
プロパティ。  
Circleオブジェクトの線の太さ（1.0〜）。初期値は1。  
線の太さを0にすることはできず、0未満に設定した場合は1として処理されます。  
線を無くしたい場合は、Circle.lineAlphaの値を0に設定するか、Circle.fillColorと同色の値に設定します。

### Example（例）
```
// main.js
addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_circle = new toile.Circle(100,100,50);
	_canvas.addChild(_circle);
	_circle.lineWidth = 20;
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Circle.lineColor、Circle.lineAlpha


<a name="Circlename"></a>
# Circle.name

### Syntax（構文）
circleObject.name

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
Circleインスタンスのインスタンス名。初期値はundefined。

### Example（例）
```
var _circle = new toile.Circle(100,100,50);
_circle.name = "circle01";
console.log(_circle.name); //=> "circle01"
```


<a name="Circleparent"></a>
# Circle.parent

### Syntax（構文）
circleObject.parent

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読み取り専用）。  
Circleオブジェクトが配置されているのコンテナを参照。最下層は"root"。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container01 = new toile.Container();
	_container01.name = "container01";
	_canvas.addChild(_container01);

	var _circle01 = new toile.Circle(100,100,50);
	_circle01.name = "circle01";
	_container01.addChild(_circle01);

	console.log(_circle01.parent.name); //=> "container01"
	console.log(_circle01.parent.parent.name); //=> "root"
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Containerクラス


<a name="Circleradius"></a>
# Circle.radius

### Syntax（構文）
circleObject.radius

### Description（説明）
プロパティ。正円の半径（ピクセル）。初期値は100。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_circle = new toile.Circle(_canvas.width/2, _canvas.height/2, 0); //半径0
	_canvas.addChild(_circle);
}

enterframe_canvas = (_canvas) => {
	_circle.radius += 1;
	_canvas.drawScreen();
}
```


<a name="Circlescale"></a>
# Circle.scale

### Syntax（構文）
circleObject.scaleX

### Description（説明）
プロパティ。拡大･縮小率。基準点はCircle.xおよびCircle.y。  
Circle.radius、Circle.lineWidthの値も変動します。  
Circle.radiusを変更した場合、その時点でCircle.scaleは1にリセットされます。

### Example（例）
```
var _circle = new toile.Circle(10,10,30);
_circle.scale = 3; //水平垂直方向ともに3倍にする
```

### See Also（参照）
Circle.radius、Circle.lineWidth


<a name="Circlex"></a>
# Circle.x

### Syntax（構文）
circleObject.x

### Description（説明）
プロパティ。正円を囲む矩形の左上の水平座標。初期値は0。  
正円の中心の水平座標を示すプロパティはCircle.centerXです。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.isBorder(true);

	_circle = new toile.Circle(100, 100, 20);
	_canvas.addChild(_circle);

	_speedX = 10;
	_speedY = 10;

    _mouseX = _mouseY = 0;
}

enterframe_canvas = (_canvas) => {
	//水平方向
	var _nextX = _circle.x + _speedX;

	if ((_nextX < 0) || (_nextX > (_canvas.width - _circle.radius*2))) {
		_speedX = - _speedX;
	} else {
		_circle.x = _nextX;
	}

	//垂直方向
	var _nextY = _circle.y + _speedY;

	if ((_nextY < 0) || (_nextY > (_canvas.height - _circle.radius*2))) {
		_speedY = - _speedY;
	} else {
		_circle.y = _nextY;
	}

	_canvas.drawScreen();
}
```

### See Also（参照）
Circle.y、Circle.centerX、Circle.centerY


<a name="Circley"></a>
# Circle.y

### Syntax（構文）
circleObject.y

### Description（説明）
プロパティ。正円を囲む矩形の左上の垂直座標。初期値は0。  
正円の中心の垂直座標を示すプロパティはCircle.centerYです。

### Example（例）
Circle.x参照。

### See Also（参照）
Circle.x、Circle.centerX、Circle.centerY


<a name="Container"></a>
# Container class

### Inheritance（継承）
Container -> SuperDisplay

### Methods（メソッド）

* [Container.addChild()](#ContaineraddChild): 入れ子をしたい表示オブジェクトを追加
* [Container.deleteChild()](#ContainerdeleteChild): 入れ子にしてある表示オブジェクトを削除
* [Container.getDepthElement()](#ContainergetDepthElement): 指定した深度の表示オブジェクトを調べる
* [Container.getDepthIndex()](#ContainergetDepthIndex): 指定した表示オブジェクトの深度を調べる
* [Container.getDepthMax()](#ContainergetDepthMax): 表示オブジェクトの最上位層の深度を調べる
* [Container.setDepthIndex()](#ContainersetDepthIndex): 任意の表示オブジェクトを指定した深度に変更する

### Properties（プロパティ）

* [Container.alpha](#Containeralpha): 表示オブジェクトの不透明度
* [Container.globalX](#ContainerglobalX): グローバル水平座標位置
* [Container.globalY](#ContainerglobalY): グローバル垂直座標位置
* [Container.name](#Containername): Containerインスタンスのインスタンス名
* [Container.parent](#Containerparent): 表示オブジェクトが配置されているコンテナを参照
* [Container.regX](#ContainerregX): 回転をさせる際の中心座標（水平座標）
* [Container.regY](#ContainerregY): 回転をさせる際の中心座標（垂直座標）
* [Container.rotate](#Containerrotate): 回転角度（単位は度）
* [Container.rotateRadian](#ContainerrotateRadian): 回転角度（単位はラジアン）
* [Container.x](#Containerx): 水平座標位置（単位はピクセル）
* [Container.y](#Containery): 垂直座標位置（単位はピクセル）

### Constructor（コンストラクタ）
new toile.Container()

### Arguments（引数）
なし。

### Description（説明）
HTML Canvas上に表示オブジェクト用のラッパを生成します。  
このクラスを使うと表示オブジェクトの入れ子を実現することが可能です。  
toile.jsを読み込む前、\<head>タグ内などに
```
<script>var toile = window;</script>
```
と記述すると「名前空間」を省いた参照方法、new Container(... といった記述が可能です。  
但しその場合、同じクラス名が他にも存在する場合、コンフリクトを起こしますので注意が必要です。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container(); //表示オブジェクトを収めるコンテナ
	_canvas.addChild(_container);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```


<a name="ContaineraddChild"></a>
# Container.addChild()

### Syntax（構文）
containerObject.addChild(arg)

### Arguments（引数）
arg: 表示オブジェクト（Bitmap/Circle/Container/Line/Rect/SpriteSheet/Text/Video）を指定。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。Containerに（入れ子をしたい）表示オブジェクトを追加します。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container(); //表示オブジェクトを収めるコンテナ
	_canvas.addChild(_container);

	var _bitmap = new toile.Bitmap("sample.jpg");
	var _circle = new toile.Circle(100,100,30);
	var _container2 = new toile.Container(); //コンテナの入れ子用
	var _line = new toile.Line(100,100,200,300);
	var _rect = new toile.Rect(50,50,100,300);
	var _spriteSheet = new toile.SpriteSheet("run.png");
	var _text = new toile.Text("テキスト");
	var _video = new toile.Video("sample.mp4", 720, 1280);

	_container.addChild(_bitmap);
	_container.addChild(_circle);
	_container.addChild(_container2);
	_container.addChild(_line);
	_container.addChild(_rect);
	_container.addChild(_spriteSheet);
	_container.addChild(_text);
	_container.addChild(_video);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Canvas.deleteChild()


<a name="Containeralpha"></a>
# Container.alpha

### Syntax（構文）
containerObject.alpha

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
Containerの不透明度（0〜1.0）。初期値は1。  
0に設定すると完全に透明に、1で完全に不透明（全く透けていない）になります。  
Container内の全ての表示オブジェクトに影響します。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container();
	_canvas.addChild(_container);

	_bitmap = new toile.Bitmap("sample.png");
	_bitmap.alpha = 0.5; //ここで50％の不透明度
	_container.addChild(_bitmap);

	_container.alpha = 0.5; //更にここで50％の不透明度（_bitmapは25％の不透明度になる）
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```


<a name="ContainerdeleteChild"></a>
# Container.deleteChild()

### Syntax（構文）
containerObject.deleteChild(arg)

### Arguments（引数）
arg: 表示オブジェクト（Bitmap/Circle/Container/Line/Rect/SpriteSheet/Text/Video）を指定。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。Containerに格納してある表示オブジェクトを削除します。  
削除後も画面に残像がある場合、Canvas.reload() を使うと問題を回避できる場合もあります。  
表示オブジェクトをメモリ上からも削除する場合は、undefinedを代入します。  
Videoオブジェクトは、Container.deleteChilde()およびundefinedの代入後も、音が再生され続けることがあります。  
その場合、undefinedを代入する前に、Video.stop()で停止させる必要があります。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_container = new toile.Container(); //表示オブジェクトを収めるコンテナ
	_canvas.addChild(_container);

	_video = new toile.Video("sample.mp4", 720, 1280);
	_container.addChild(_video);
}

enterframe_canvas = (_canvas) => {
    if (_video.currentTime == _video.duration) {
        _container.deleteChild(_video);
        _video.stop();
    }
	_canvas.drawScreen();
}
```

### See Also（参照）
Container.addChild()、Canvas.reload()


<a name="ContainergetDepthElement"></a>
# Container.getDepthElement()

### Syntax（構文）
containerObject.getDepthElement(arg)

### Arguments（引数）
arg: コンテナ内の表示オブジェクトの調べたい深度（数値）。  
最下位層は0。

### Returns（戻り値）
表示オブジェクト（Bitmap/Circle/Container/Line/Rect/SpriteSheet/Text/Video）のインスタンス。見つからない場合はundefinedが返ります。

### Description（説明）
メソッド。コンテナ内で、指定した深度（0～）の表示オブジェクトを調べる。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_bitmap1 = new toile.Bitmap("sample.png");
	_bitmap2 = new toile.Bitmap("sample.png");
	_bitmap3 = new toile.Bitmap("sample.png");
	_bitmap1.name = "sprite1";
	_bitmap2.name = "sprite2";
	_bitmap3.name = "sprite3";

	var _container = new toile.Container();
	_canvas.addChild(_container);

	_container.addChild(_bitmap1);
	_container.addChild(_bitmap2);
	_container.addChild(_bitmap3);

	console.log(_container.getDepthElement(0).name); //=> "sprite1"
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Container.getDepthIndex()、Container.getDepthMax()、Container.setDepthIndex()


<a name="ContainergetDepthIndex"></a>
# Container.getDepthIndex()

### Syntax（構文）
containerObject.getDepthIndex(arg)

### Arguments（引数）
arg: コンテナ内で、深度を調べたい表示オブジェクト。

### Returns（戻り値）
深度（最下位層は0）。最大値はContainer.getDepthMax()。  
見つからない場合は-1が返ります。

### Description（説明）
メソッド。コンテナ内で、指定した表示オブジェクトの深度を調べる。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	_canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_bitmap1 = new toile.Bitmap("sample.png");
	_bitmap2 = new toile.Bitmap("sample.png");
	_bitmap3 = new toile.Bitmap("sample.png");

	var _container = new toile.Container();
	_canvas.addChild(_container);

	_container.addChild(_bitmap1);
	_container.addChild(_bitmap2);
	_container.addChild(_bitmap3);

	console.log(_container.getDepthIndex(_bitmap1)); //=> 0
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Container.getDepthElement()、Container.getDepthMax()、Container.setDepthIndex()


<a name="ContainergetDepthMax"></a>
# Container.getDepthMax()

### Syntax（構文）
containerObject.getDepthMax()

### Arguments（引数）
なし。

### Returns（戻り値）
コンテナ内の最上位層の深度。表示オブジェクトが無い場合-1。

### Description（説明）
メソッド。コンテナ内で、表示オブジェクトの最上位層の深度を調べます。

### Example（例）
```
_canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

_bitmap1 = new toile.Bitmap("sample.png");
_bitmap2 = new toile.Bitmap("sample.png");
_bitmap3 = new toile.Bitmap("sample.png");

var _container = new toile.Container();
_canvas.addChild(_container);

_container.addChild(_bitmap1);
_container.addChild(_bitmap2);
_container.addChild(_bitmap3);

console.log(_container.getDepthMax()); //=> 2
```

### See Also（参照）
Container.getDepthElement()、Container.getDepthIndex()、Container.setDepthIndex()


<a name="ContainerglobalX"></a>
# Container.globalX

### Syntax（構文）
containerObject.globalX

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「水平」位置（ピクセル）。  
親のContainerの角度（rotate）や回転させる際の中心座標（regX、regY）を変更した場合などでも取得が可能です。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

var _container = new toile.Container();
_container.x = 100;
_container.y = 100;
_canvas.addChild(_container);

var _container2 = new toile.Container(); //入れ子用のContainer
_container.addChild(_container2);

console.log(_container2.x, _container2.y); //=> 0 0
console.log(_container2.globalX, _container2.globalY); //=> 100 100
```

### See Also（参照）
Container.globalY、Container.rotate、Container.regX、Container.regY


<a name="ContainerglobalY"></a>
# Container.globalY

### Syntax（構文）
containerObject.globalY

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「垂直」位置（ピクセル）。  
その他は、containerObject.globalXと同じです。


<a name="Containername"></a>
# Container.name

### Syntax（構文）
containerObject.name

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
containerObjectインスタンスのインスタンス名。初期値はundefined。

### Example（例）
```
var _container = new toile.Container();
_container.name = "container1";
_canvas.addChild(_container);
console.log(_container.name); //=> "container1"
```


<a name="Containerparent"></a>
# Container.parent

### Syntax（構文）
containerObject.parent

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読み取り専用）。  
Containerインスタンスが配置されているのコンテナを参照。最下層は"root"。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container();
	_container.name = "container1";
	_canvas.addChild(_container);

	var _container2 = new toile.Container(); //入れ子用のContainer
	_container2.name = "container2";
	_container.addChild(_container2);

	console.log(_container2.parent.name); //=> "container1"
	console.log(_container2.parent.parent.name); //=> "root"
	console.log(_container2.parent.parent.parent); //=> null
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```


<a name="ContainerregX"></a>
# Container.regX

### Syntax（構文）
containerObject.regX

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
Containerを回転させる際の中心座標（水平座標）。初期値は0。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_container = new toile.Container();
	_canvas.addChild(_container);

	_bitmap = new toile.Bitmap("sample.jpg");
	_bitmap.addEventListener("load", load_bitmap);
	_container.addChild(_bitmap);
}

enterframe_canvas = (_canvas) => {
	_container.rotate += 10;
	_canvas.drawScreen();
}

load_bitmap = (_bitmap) => {
	//コンテナの回転の中心をBitmapの中止に変更する
	_container.regX = _bitmap.width / 2;
	_container.regY = _bitmap.height / 2;
}
```

### See Also（参照）
Conteiner.regY、Conteiner.rotate、Conteiner.rotateRadian


<a name="ContainerregY"></a>
# Container.regY

### Syntax（構文）
containerObject.regY

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
Containerを回転させる際の中心座標（垂直座標）。初期値は0。  
その他は、containerObject.regXと同じです。


<a name="Containerrotate"></a>
# Container.rotate

### Syntax（構文）
containerObject.rotate

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転角度（単位は度）。初期値は0。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

_container = new toile.Container();
_canvas.addChild(_container);

_bitmap = new toile.Bitmap("sample.jpg");
_container.addChild(_bitmap);

_container.rotate = -15;
```

### See Also（参照）
Conteiner.regX、Container.regY、Container.rotateRadian


<a name="ContainerrotateRadian"></a>
# Container.rotateRadian

### Syntax（構文）
containerObject.rotateRadian

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転角度（単位はラジアン）。初期値は「0」。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

_container = new toile.Container();
_canvas.addChild(_container);

_container.rotateRadian = Math.PI/4;
console.log(_container.rotate); //=> 45
console.log(_container.rotateRadian); //=> 0.7853981633974483
```

### See Also（参照）
Conteiner.regX、Container.regY、Container.rotate


<a name="ContainersetDepthIndex"></a>
# Container.setDepthIndex()

### Syntax（構文）
containerObject.getDepthIndex(arg1, arg2)

### Arguments（引数）
arg1: コンテナ内で、深度を変更したい表示オブジェクト。  
arg2: コンテナ内で、指定したい深度。0～Container.getDepthMax()。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。コンテナ内で、任意の表示オブジェクトを指定した深度に変更します。

### Example（例）
```
//最上位層にしたい場合...
_container.setDepthIndex(_bitmap1, _container.getDepthMax());

//最下位層にしたい場合...
_container.setDepthIndex(_bitmap1, 0);

//任意の表示オブジェクトと深度を入れ替えたい場合...
_bitmap2_Depth = _container.getDepthIndex(_bitmap2);
_container.setDepthIndex(_bitmap1, _bitmap2_Depth);
```

### See Also（参照）
Container.getDepthElement()、Container.getDepthIndex()、Container.getDepthMax()


<a name="Containerx"></a>
# Container.x

### Syntax（構文）
containerObject.x

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
水平座標位置（単位はピクセル）。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

_container = new toile.Container();
_container.x = 100;
_container.y = 10;
_canvas.addChild(_container);
```

### See Also（参照）
Container.y


<a name="Containery"></a>
# Container.y

### Syntax（構文）
containerObject.y

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。
Containerを回転させる際の中心座標（水平座標）。初期値は0。
その他は、containerObject.xと同じです。


<a name="Line"></a>
# Line class

### Inheritance（継承）
Line -> SuperDisplay

### Methods（メソッド）

* [Line.hitTest()](#LinehitTest): 指定したオブジェクトと重なっているか（矩形）  

### Properties（プロパティ）

* [Line.alpha](#Linealpha): 表示オブジェクトの不透明度
* [Line.endX](#LineendX): 線の終点の水平座標
* [Line.endY](#LineendY): 線の終点の垂直座標
* [Line.globalX](#LineglobalX): グローバル水平座標位置
* [Line.globalY](#LineglobalY): グローバル垂直座標位置
* [Line.height](#Lineheight): Lineインスタンスの高さ
* [Line.lineAlpha](#LinelineAlpha): 線のアルファ値
* [Line.lineColor](#LinelineColor): 線の色
* [Line.lineWidth](#LinelineWidth): 線の太さ
* [Line.name](#Linename): Lineインスタンスのインスタンス名
* [Line.parent](#Lineparent): 表示オブジェクトが配置されているコンテナを参照
* [Line.regX](#LineregX): 回転させる際の中心座標（水平座標）
* [Line.regY](#LineregY): 回転させる際の中心座標（垂直座標）
* [Line.rotate](#Linerotate): 回転角度（単位は度）
* [Line.rotateRadian](#LinerotateRadian): 回転角度（単位はラジアン）
* [Line.scale](#Linescale): 拡大･縮小率
* [Line.startX](#LinestartX): 線の始点の水平座標
* [Line.startY](#LinestartY): 線の始点の垂直座標
* [Line.width](#Linewidth): Lineインスタンスの幅
* [Line.x](#Linex): 水平座標位置
* [Line.y](#Liney): 垂直座標位置

### Constructor（コンストラクタ）
new toile.Line(arg1, arg2, arg3, arg4)

### Arguments（引数）
arg1: 線を描画する開始点（水平座標位置）。初期値は0。  
arg2: 線を描画する開始点（垂直座標位置）。初期値は0。  
arg3: 線を描画する終了点（水平座標位置）。初期値は100。  
arg4: 線を描画する終了点（垂直座標位置）。初期値は100。

### Description（説明）
HTML Canvas上に「線」を表示するためのクラス。始点、終点を指定して線を生成します。  
toile.jsを読み込む前、\<head>タグ内などに
```
<script>var toile = window;</script>
```
と記述すると「名前空間」を省いた参照方法、new Line(... といった記述が可能です。  
但しその場合、同じクラス名が他にも存在する場合、コンフリクトを起こしますので注意が必要です。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

var _line = new toile.Line(5, 10, 100, 200);
_canvas.addChild(_line);
```

### See Also（参照）
Line.endX、Line.endY


<a name="Linealpha"></a>
# Line.alpha

### Syntax（構文）
lineObject.alpha

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
Lineオブジェクトの不透明度（0〜1.0）。初期値は1。  
0に設定すると完全に透明に、1で完全に不透明（全く透けていない）になります。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _line = new toile.Line(5, 5, 100, 100);
	_line.lineWidth = 10;
	_line.alpha = 0.5;
	_canvas.addChild(_line);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```


<a name="LineendX"></a>
# Line.endX

### Syntax（構文）
lineObject.endX

### Description（説明）
プロパティ。
HTML Canvas上に表示する線の、終点の「水平」座標（ピクセル）を指定します。  
初期値は100。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _line = new toile.Line(5, 5);
	_line.endX = 200;
	_line.endY = 200;
	_canvas.addChild(_line);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Line.endY


<a name="LineendY"></a>
# Line.endY

### Syntax（構文）
lineObject.endY

### Description（説明）
プロパティ。
HTML Canvas上に表示する線の、終点の「垂直」座標（ピクセル）を指定します。  
初期値は100。  
その他は、Line.endXと同じです。


<a name="LineglobalX"></a>
# Line.globalX

### Syntax（構文）
lineObject.globalX

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「水平」位置（ピクセル）。  
ネストしたContainer内にLineを配置し、各Containerの角度（rotate）や回転させる際の中心座標（regX、regY）を変更した場合などでも取得が可能です。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container(); //Lineを収めるコンテナ
	_container.x = 50;
	_container.y = 50;
	_container.regX = 10;
	_container.regY = 10;
	_container.rotate = 30;
	_canvas.addChild(_container);

   	var _line = new toile.Line(50,50,200,50);
	_container.addChild(_line);

	console.log(_line.globalX, _line.globalY);
	//=> 74.64101615137756 114.64101615137756
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Line.globalY、Container.rotate、Container.regX、Container.regY


<a name="LineglobalY"></a>
# Line.globalY

### Syntax（構文）
lineObject.globalY

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「垂直」位置（ピクセル）。  
その他は、Line.globalXと同じです。


<a name="LinehitTest"></a>
# Line.hitTest()

### Description（説明）
Lineクラスを継承するRectクラスで利用するためのもので、通常は使用しません。


<a name="Lineheight"></a>
# Line.height

### Syntax（構文）
lineObject.height

### Description（説明）
プロパティ。Line.endYからLine.startYを引いた値。  
Line.rotateや、Container.rotateなどの角度を変更しても値は変化しません。

### See Also（参照）
Line.width

<a name="LinelineAlpha"></a>
# Line.lineAlpha

### Syntax（構文）
lineObject.lineAlpha

### Description（説明）
プロパティ。 HTML Canvas上に表示する線のアルファ値（0～1.0）。  
初期値は1.0。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

var _line = new toile.Line(10,10,100,10);
_line.lineWidth = 10;
_line.lineAlpha = 0.5;
_canvas.addChild(_line);
```

### See Also（参照）
Rect.lineAlpha


<a name="LinelineColor"></a>
# Line.lineColor

### Syntax（構文）
lineObject.lineColor

### Description（説明）
プロパティ。HTML Canvas上に表示する線の色。  
初期値は、"0,0,0"（黒）。RGB各色を0～255で指定。  
例えば、赤の場合は "255,0,0" とします。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

var _line = new toile.Line(10,10,100,10);
_line.lineWidth = 10;
_line.lineColor = "255,0,0"; //赤の場合
_canvas.addChild(_line);
```

### See Also（参照）
Rect.lineColor


<a name="LinelineWidth"></a>
# Line.lineWidth

### Syntax（構文）
lineObject.lineWidth

### Description（説明）
プロパティ。HTML Canvas上に表示する線の太さ。初期値は1。  
0以下の値を設定した場合、値は1となります。  
0.5等の浮動小数点値の設定も可能。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

var _line = new toile.Line(10,10,100,10);
_line.lineWidth = 10;
_line.lineColor = "255,0,0";
_canvas.addChild(_line);
```

### See Also（参照）
Rect.lineWidth


<a name="Linename"></a>
# Line.name

### Syntax（構文）
lineObject.name

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
Lineインスタンスのインスタンス名。  
初期値は、undefined。

### Example（例）
```
var _line = new toile.Line(10,10,100,10);
_line.name = "line01";
console.log(_line.name); //=> "line01"
```


<a name="Lineparent"></a>
# Line.parent

### Syntax（構文）
lineObject.parent

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読み取り専用）。  
Lineオブジェクトが配置されているのコンテナを参照。最下層は"root"。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container01 = new toile.Container();
	_container01.name = "container01";
	_canvas.addChild(_container01);

	var _line01 = new toile.Line(10,10,100,10);
	_line01.name = "line01";
	_container01.addChild(_line01);

	console.log(_line01.parent.name); //=> "container01"
	console.log(_line01.parent.parent.name); //=> "root"
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```


<a name="LineregX"></a>
# Line.regX

### Syntax（構文）
lineObject.regX

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転させる際の中心座標（水平座標）。  
初期値は0。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_line = new toile.Line(100,100,200,100);
	_line.regX = 50; //回転の中心を線の中央にする
	_canvas.addChild(_line);
}

enterframe_canvas = (_canvas) => {
	_line.rotate += 5;
	_canvas.drawScreen();
}
```

### See Also（参照）
Line.regY、Line.rotate


<a name="LineregY"></a>
# Line.regY

### Syntax（構文）
lineObject.regY

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転させる際の中心座標（垂直座標）。  
初期値は0。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_line = new toile.Line(100,100,100,200);
	_line.regY = 50; //回転の中心を線の中央にする
	_canvas.addChild(_line);
}

enterframe_canvas = (_canvas) => {
	_line.rotate += 5;
	_canvas.drawScreen();
}
```

### See Also（参照）
Line.regX、Line.rotate


<a name="Linerotate"></a>
# Line.rotate

### Syntax（構文）
lineObject.rotate

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転角度（単位は度）。  
初期値は0。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_line = new toile.Line(100,100,200,100);
	_canvas.addChild(_line);
}

enterframe_canvas = (_canvas) => {
	window._line.rotate += 5;
	_canvas.drawScreen();
}
```

### See Also（参照）
Line.regX、Line.regY、Line.rotateRadian


<a name="LinerotateRadian"></a>
# Line.rotateRadian

### Syntax（構文）
lineObject.rotateRadian

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転角度（単位はラジアン）。  
初期値は0。

### Example（例）
```
var _line = new toile.Line(100,100,200,100);
_line.rotateRadian = Math.PI/4;
console.log(_line.rotate); //=> 45（度）
console.log(_line.rotateRadian); //=> 0.7853981633974483（ラジアン）
```

### See Also（参照）
Line.regX、Line.regY、Line.rotate


<a name="Linescale"></a>
# Line.scale

### Syntax（構文）
lineObject.scale

### Description（説明）
プロパティ。拡大･縮小率。初期値1.0。   
Line.lineWidth、Line.width、Line.heightも一緒に変動します。  
Line.x、Line.yは変動しません。  
Line.startX、Line.startY、Line.endX、Line.endY、Line.width、Line.heightのいずれかを変更すると、Line.scaleの値はnullになります。  
水平方向のみ拡大・縮小させたい場合はLine.startX、Line.endX、Line.widthの値を、垂直方向のみ拡大・縮小させたい場合はLine.startY、Line.endY、Line.heightの値を変更します。

### Example（例）
```
_line = new toile.Line(10,10,100,100);
_canvas.addChild(_line);
_line.scale = 3;
```

### See Also（参照）
Line.startX、Line.startY、Line.endX、Line.endY、Line.width、Line.height


<a name="LinestartX"></a>
# Line.startX

### Syntax（構文）
lineObject.startX

### Description（説明）
プロパティ。線の始点の水平座標。  
コンストラクタの第1引数と同じ値（初期値は0）。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_line = new toile.Line(_canvas.width, 5, _canvas.width ,5);
	_line.lineWidth = 2;
	console.log(_line.startX, _line.startY); //=> 550（Canvasの横幅） 50
	_canvas.addChild(_line);
}

enterframe_canvas = (_canvas) => {
	if (_line.startX > 0) {
		_line.startX -= 5;
	}
	_canvas.drawScreen();
}
```

### See Also（参照）
Line.startY、Line.endX、Line.endY


<a name="LinestartY"></a>
# Line.startY

### Syntax（構文）
lineObject.startY

### Description（説明）
プロパティ。線の始点の水平座標。
コンストラクタの第2引数と同じ値（初期値は0）。
その他は、Line.startXと同じです。


<a name="Linewidth"></a>
# Line.width

### Syntax（構文）
lineObject.width

### Description（説明）
プロパティ。Line.endXからLine.startXを引いた値。  
Line.rotateや、Container.rotateなどの角度を変更しても値は変化しません。

### See Also（参照）
Line.height


<a name="Linex"></a>
# Line.x

### Syntax（構文）
lineObject.x

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
水平座標位置（単位はピクセル）。  
Line.startXの変更は線の「開始点のみ」移動するのに対し、Line.xの変更は「線全体」を移動します。

### Example（例）
```
var _line = new toile.Line(5, 10, 100, 200);
_line.x = 100;
```

### See Also（参照）
Line.y


<a name="Liney"></a>
# Line.y

### Syntax（構文）
lineObject.y

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
垂直座標位置（単位はピクセル）。  
Line.startYの変更は線の「開始点のみ」移動するのに対し、Line.yの変更は「線全体」を移動します。

### Example（例）
```
var _line = new toile.Line(5, 10, 100, 200);
_line.y = 100;
```

### See Also（参照）
Line.x


<a name="Rect"></a>
# Rect class

### Inheritance（継承）
Rect -> Line -> SuperDisplay

### Methods（メソッド）

* [Rect.hitTest()](#RecthitTest): 指定したオブジェクトと重なっているか（矩形）  
* [Rect.isFill()](#RectisFill): 矩形の塗りを有効にするか否か  

### Properties（プロパティ）

* [Rect.alpha](#Rectalpha): 表示オブジェクトの不透明度
* [Rect.endX](#RectendX): 矩形の終点の水平座標を指定
* [Rect.endY](#RectendY): 矩形の終点の垂直座標を指定
* [Rect.fillAlpha](#RectfillAlpha): 矩形の塗りの部分のアルファ値
* [Rect.fillColor](#RectfillColor): 矩形の塗りの色
* [Rect.globalX](#RectglobalX): グローバル水平座標位置
* [Rect.globalY](#RectglobalY): グローバル垂直座標位置
* [Rect.height](#Rectheight): Rectインスタンスの高さ
* [Rect.lineAlpha](#RectlineAlpha): 矩形の線のアルファ値
* [Rect.lineColor](#RectlineColor): 矩形の線の色
* [Rect.lineWidth](#RectlineWidth): 矩形の線の太さ
* [Rect.name](#Rectname): Rectインスタンスのインスタンス名
* [Rect.parent](#Rectparent): 表示オブジェクトが配置されているコンテナを参照
* [Rect.regX](#RectregX): 回転させる際の中心座標（水平座標）
* [Rect.regY](#RectregY): 回転させる際の中心座標（垂直座標）
* [Rect.rotate](#Rectrotate): 回転角度（単位は度）
* [Rect.rotateRadian](#RectrotateRadian): 回転角度（単位はラジアン）
* [Rect.scale](#Rectscale): 拡大･縮小率
* [Rect.startX](#RectstartX): 矩形の始点の水平座標
* [Rect.startY](#RectstartY): 矩形の始点の垂直座標
* [Rect.width](#Rectwidth): Rectインスタンスの幅
* [Rect.x](#Rectx): 水平座標位置（単位はピクセル）
* [Rect.y](#Recty): 垂直座標位置（単位はピクセル）

### Constructor（コンストラクタ）
new toile.Rect(arg1, arg2, arg3, arg4)

### Arguments（引数）
arg1: 矩形を描画する開始点（水平座標位置）。初期値は0。  
arg2: 矩形を描画する開始点（垂直座標位置）。初期値は0。  
arg3: 矩形を描画する終了点（水平座標位置）。初期値は100。  
arg4: 矩形を描画する終了点（垂直座標位置）。初期値は100。

### Description（説明）
HTML Canvas上に「矩形」を表示するためのクラス。  
始点、終点を指定して矩形を生成します。  
toile.jsを読み込む前、\<head>タグ内などに
```
<script>var toile = window;</script>
```
と記述すると「名前空間」を省いた参照方法、new Rect(... といった記述が可能です。  
但しその場合、同じクラス名が他にも存在する場合、コンフリクトを起こしますので注意が必要です。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

var _rect = new toile.Rect(5, 10, 100, 200);
_canvas.addChild(_rect);
```

### See Also（参照）
Rect.endX、Rect.endY


<a name="Rectalpha"></a>
# Rect.alpha

### Syntax（構文）
rectObject.alpha

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
Rectオブジェクト全体の不透明度（0〜1.0）。初期値は1。  
0に設定すると完全に透明に、1で完全に不透明（全く透けていない）になります。  
見た目上は、Rect.lineAlphaやRect.fillAlphaの値に加算されて表示されます。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _rect = new toile.Rect(5, 5, 100, 100);
	_rect.isFill(true);
	_rect.lineWidth = 10;
	_rect.lineAlpha = 0.8;
	_rect.fillColor = "255,0,0";
	_rect.fillAlpha = 0.5;
	_rect.alpha = 0.5; //線は40％（0.8*0.5）、塗りは25％（0.5*0.5）の不透明度に見える
	_canvas.addChild(_rect);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Rect.lineAlpha、Rect.fillAlpha


<a name="RectendX"></a>
# Rect.endX

### Syntax（構文）
rectObject.endX

### Description（説明）
プロパティ。  
HTML Canvas上に表示する「矩形」の、終点の水平座標（単位はピクセル）を指定します。  
初期値は100。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _rect = new toile.Rect(5, 5); //第3、第4引数を省略すると共に100扱い
	_rect.endX = 200;
	_rect.endY = 200;
	_canvas.addChild(_rect);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Rect.endY


<a name="RectendY"></a>
# Rect.endY

### Syntax（構文）
rectObject.endY

### Description（説明）
プロパティ。 HTML Canvas上に表示する「矩形」の、終点の「垂直」座標（ピクセル）を指定します。  
初期値は100。その他は、Rect.endXと同じです。


<a name="RectfillAlpha"></a>
# Rect.fillAlpha

### Syntax（構文）
rectObject.fillAlpha

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
HTML Canvas上に表示する矩形の「塗り」の部分のアルファ値（0～1.0）。初期値は1.0。  
実際は、Rect.Alphaの値を加算して表示されます。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

var _rect = new toile.Rect(5, 5, 100, 100);
_rect.isFill(true);
_rect.lineWidth = 10;
_rect.lineAlpha = 0.8;
_rect.fillColor = "255,0,0";
_rect.fillAlpha = 0.5;
_rect.alpha = 0.5; //線は40％（0.8*0.5）、塗りは25％（0.5*0.5）の不透明度に見える
_canvas.addChild(_rect);
```

### See Also（参照）
Rect.alpha、Rect.lineAlpha


<a name="RectfillColor"></a>
# Rect.fillColor

### Syntax（構文）
rectObject.fillColor

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
HTML Canvas上に表示する矩形の「塗り」の色。初期値は、"255,255,255"（白）。  
RGB各色を0～255で指定。例えば、赤の場合は "255,0,0" とします。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

var _rect = new toile.Rect(5, 5, 100, 100);
_rect.isFill(true);
_rect.fillColor = "255,0,0";
_canvas.addChild(_rect);
```

### See Also（参照）
Rect.fillAlpha、Rect.isFill()


<a name="RectglobalX"></a>
# Rect.globalX

### Syntax（構文）
rectObject.globalX

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「水平」位置（ピクセル）。  
ネストしたContainer内にRectを配置し、各Containerの角度（rotate）や回転させる際の中心座標（regX、regY）を変更した場合などでも取得が可能です。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container(); //Rectを収めるコンテナ
	_container.x = 50;
	_container.y = 50;
	_container.regX = 10;
	_container.regY = 10;
	_container.rotate = 30;
	_canvas.addChild(_container);

   	var _rect = new toile.Rect(50,50,200,100);
	_container.addChild(_rect);

	console.log(_rect.globalX, _rect.globalY);
	//=> 74.64101615137756 114.64101615137756
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Rect.globalY、Containerクラス、Container.rotate、Container.regX、Container.regY


<a name="RectglobalY"></a>
# Rect.globalY

### Syntax（構文）
rectObject.globalY

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「垂直」位置（ピクセル）。  
その他は、Rect.globalXと同じです。


<a name="Rectheight"></a>
# Rect.height

### Syntax（構文）
rectObject.height

### Description（説明）
プロパティ。Rect.endYからRect.startYを引いた値。  
Rect.rotateや、Container.rotateなどの角度を変更しても値は変化しません。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

   	var _rect = new toile.Rect(50,50,200,100);
	_canvas.addChild(_rect);

	console.log(_rect.height, _rect.width); //=> 150 50
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Rect.width


<a name="RecthitTest"></a>
# Rect.hitTest()

### Syntax（構文）
rectObject.hitTest(arg)

### Arguments（引数）
arg: Rectオブジェクトと重なっているかを調べる「矩形」の表示オブジェクト。  
Rectインスタンスの他、BitmapやSpriteSheetインスタンスにも対応します。

### Returns（戻り値）
「矩形」同士の衝突判定の結果を示すブール値。

### Description（説明）
メソッド。SuperDisplayクラスからの継承。  
指定した表示オブジェクトと交差（矩形領域）しているかを調べます。

### Example（例）
```
// main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousemove", mousemove_canvas);
	_canvas.enabledMouseMove(true);

	_rect = new toile.Rect(0,0,50,50);
	_canvas.addChild(_rect);

	_bitmap = new toile.Bitmap("box.png");
	_bitmap.x = 300;
	_canvas.addChild(_bitmap);

	_spriteSheet = new toile.SpriteSheet("run.jpg");
	_canvas.addChild(_spriteSheet);
    
    _mouseX = _mouseY = 0;
}

enterframe_canvas = (_canvas) => {
	_rect.x = _mouseX;
	_rect.y = _mouseY;

	if (_rect.hitTest(_bitmap)) {
		console.log("Bitmapと接触中");
	}

	if (_rect.hitTest(_spriteSheet)) {
		console.log("SpriteSheetと接触中");
	}

	_canvas.drawScreen("#cccccc");
}

mousemove_canvas = (_canvas) => {
	_mouseX = _canvas.mouseX;
	_mouseY = _canvas.mouseY;
}
```


<a name="RectisFill"></a>
# Rect.isFill()

### Syntax（構文）
rectObject.isFill(arg)

### Arguments（引数）
arg: Rectオブジェクトの塗りを有効にするか否かを示すブール値。

### Description（説明）
メソッド。  
HTML Canvas上に表示する矩形の塗りを有効にするか否かの設定。初期値はfalse。  
trueにした場合の初期値の色は、白（"255,255,255"）。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

var _rect = new toile.Rect(5, 5, 100, 100);
_rect.isFill(true);
_rect.fillColor = "255,0,0";
_canvas.addChild(_rect);
```

### See Also（参照）
Rect.fillAlpha


<a name="RectlineAlpha"></a>
# Rect.lineAlpha

### Syntax（構文）
rectObject.fillAlpha

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
HTML Canvas上に表示する矩形の「線」の部分のアルファ値（0～1.0）。初期値は1.0。  
実際は、Rect.Alphaの値を加算して表示されます。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

var _rect = new toile.Rect(5, 5, 100, 100);
_rect.isFill(true);
_rect.lineWidth = 10;
_rect.lineAlpha = 0.8;
_rect.fillColor = "255,0,0";
_rect.fillAlpha = 0.5;
_rect.alpha = 0.5; //線は40％（0.8*0.5）、塗りは25％（0.5*0.5）の不透明度に見える
_canvas.addChild(_rect);
```

### See Also（参照）
Rect.alpha、Rect.fillAlpha、Rect.lineWidth


<a name="RectlineColor"></a>
# Rect.lineColor

### Syntax（構文）
rectObject.lineColor

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
HTML Canvas上に表示する矩形の線の色。  
初期値は、"0,0,0"（黒）。  
RGB各色を0～255で指定。  
例えば、赤の場合は "255,0,0" とします。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

var _rect = new toile.Rect(5, 5, 100, 100);
_rect.lineWidth = 10;
_rect.lineColor = "255,0,0"; //赤の場合
_canvas.addChild(_rect);
```

### See Also（参照）
Rect.lineAlpha、Rect.lineWidth


<a name="RectlineWidth"></a>
# Rect.lineWidth

### Syntax（構文）
rectObject.lineWidth

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
HTML Canvas上に表示する矩形の線の太さ。  
初期値は1。  
線の太さを0にすることはできず、線を無くしたい場合は、Rect.fillColorと同色の値に設定するなどします。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

var _rect = new toile.Rect(5, 5, 100, 100);
_rect.lineWidth = 10;
_rect.lineColor = "255,0,0";
_canvas.addChild(_rect);
```

### See Also（参照）
Rect.lineAlpha、Rect.lineColor


<a name="Rectname"></a>
# Rect.name

### Syntax（構文）
rectObject.name

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
Rectインスタンスのインスタンス名。  
初期値は、undefined。

### Example（例）
```
var _rect = new toile.Rect(10,10,100,10);
_rect.name = "rect01";
console.log(_rect.name); //=> "rect01"
```


<a name="Rectparent"></a>
# Rect.parent

### Syntax（構文）
rectObject.parent

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読み取り専用）。  
Rectオブジェクトが配置されているのコンテナを参照。最下層は"root"。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container01 = new toile.Container();
	_container01.name = "container01";
	_canvas.addChild(_container01);

	var _rect01 = new toile.Rect(10,10,100,10);
	_rect01.name = "rect01";
	_container01.addChild(_rect01);

	console.log(_rect01.parent.name); //=> "container01"
	console.log(_rect01.parent.parent.name); //=> "root"
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```


<a name="RectregX"></a>
# Rect.regX

### Syntax（構文）
rectObject.regX

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転させる際の中心座標（水平座標）。初期値は0。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_rect = new toile.Rect(100,100,200,200);
 	//回転の中心を線の中央にする
	_rect.regX = 50;
	_rect.regY = 50;
	_canvas.addChild(_rect);
}

enterframe_canvas = (_canvas) => {
	_rect.rotate += 5;
	_canvas.drawScreen();
}
```

### See Also（参照）
Rect.regY、Rect.rotate


<a name="RectregY"></a>
# Rect.regY

### Syntax（構文）
rectObject.regY

### Description（説明）
プロパティ。  
回転させる際の中心座標（垂直座標）。初期値は0。  
その他は、Rect.regXと同じです。


<a name="Rectrotate"></a>
# Rect.rotate

### Syntax（構文）
rectObject.rotate

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転角度（単位は度）。初期値は0。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_rect = new toile.Rect(100,100,200,200);
	_canvas.addChild(_rect);
}

enterframe_canvas = (_canvas) => {
	_rect.rotate += 5;
	_canvas.drawScreen();
}
```

### See Also（参照）
Rect.regX、Rect.regY、Rect.rotateRadian


<a name="RectrotateRadian"></a>
# Rect.rotateRadian

### Syntax（構文）
rectObject.rotateRadian

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転角度（単位はラジアン）。初期値は0。

### Example（例）
```
var _rect = new toile.Rect(100,100,200,200);
_rect.rotateRadian = Math.PI/4;
console.log(_rect.rotate); //=> 45（度）
console.log(_rect.rotateRadian); //=> 0.7853981633974483（ラジアン）
```


<a name="Rectscale"></a>
# Rect.scale

### Syntax（構文）
rectObject.scale

### Description（説明）
Line.scaleを継承するプロパティ。拡大･縮小率。初期値1.0。  
Rect.lineWidth、Rect.width、Rect.heightも一緒に変動します。  
Rect.x、Rect.yは変動しません。  
Rect.startX、Rect.startY、Rect.endX、Rect.endY、Rect.width、Rect.heightのいずれかを変更すると、Rect.scaleの値はnullになります。  
水平方向のみ拡大・縮小させたい場合はRect.startX、Rect.endX、Rect.widthの値を、垂直方向のみ拡大・縮小させたい場合はRect.startY、Rect.endY、Rect.heightの値を変更します。

### Example（例）
```
_rect = new toile.Rect(10,10,100,100);
_canvas.addChild(_rect);
_rect.scale = 3;
```

### See Also（参照）
Rect.startX、Rect.startY、Rect.endX、Rect.endY、Rect.width、Rect.height


<a name="RectstartX"></a>
# Rect.startX

### Syntax（構文）
rectObject.startX

### Description（説明）
プロパティ。線の始点の水平座標。  
コンストラクタの第1引数と同じ値（初期値は0）。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_rect = new toile.Rect(_canvas.width, 5, _canvas.width ,25);
	_rect.lineWidth = 2;
	console.log(_rect.startX, _rect.startY); //=> 550（Canvasの横幅） 50
	_canvas.addChild(_rect);
}

enterframe_canvas = (_canvas) => {
	if (_rect.startX > 0) {
		_rect.startX -= 5;
	}
	_canvas.drawScreen();
}
```

### See Also（参照）
Rect.startY、Rect.endX、Rect.endY


<a name="RectstartY"></a>
# Rect.startY

### Syntax（構文）
rectObject.startY

### Description（説明）
プロパティ。線の始点の水平座標。  
コンストラクタの第2引数と同じ値（初期値は0）。  
その他は、Rect.startXと同じです。


<a name="Rectwidth"></a>
# Rect.width

### Syntax（構文）
rectObject.width

### Description（説明）
プロパティ。Rect.endXからRect.startXを引いた値。  
Rect.rotateや、Container.rotateなどの角度を変更しても値は変化しません。

### See Also（参照）
Rect.height


<a name="Rectx"></a>
# Rect.x

### Syntax（構文）
rectObject.x

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
水平座標位置（単位はピクセル）。  
Rect.startXの変更は線の「開始点のみ」移動するのに対し、Rect.xの変更は「線全体」を移動します。

### Example（例）
```
var _rect = new toile.Rect(5, 10, 100, 200);
_rect.x = 100;
```

### See Also（参照）
Rect.y


<a name="Recty"></a>
# Rect.y

### Syntax（構文）
rectObject.y

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
垂直座標位置（単位はピクセル）。  
Rect.startYの変更は線の「開始点のみ」移動するのに対し、Rect.yの変更は「線全体」を移動します。

### Example（例）
```
var _rect = new toile.Rect(5, 10, 100, 200);
_rect.y = 100;
```

### See Also（参照）
Rect.x


<a name="Sound"></a>
# Sound classSound class

### Inheritance（継承）
なし。

### Methods（メソッド）

* [Sound.fadeOut()](#SoundfadeOut): 任意の時間をかけてフェードアウトさせる  
* [Sound.isLoaded()](#SoundisLoaded): ロードし終えているかを調べる  
* [Sound.isPaused()](#SoundisPaused): 停止中か調べる  
* [Sound.pause()](#Soundpause): 一時停止させる  
* [Sound.play()](#Soundplay): 再生する  
* [Sound.stop()](#Soundstop): 停止させる  

### Properties（プロパティ）

* [Sound.currentTime](#SoundcurrentTime): 再生しているサウンドの再生時間  
* [Sound.duration](#Soundduration): 再生しているサウンド全体の長さ  
* [Sound.loop](#Soundloop): ループさせるか否かを設定  
* [Sound.name](#Soundname): Soundインスタンスのインスタンス名  
* [Sound.volume](#Soundvolume): ボリュームを設定  

### Constructor（コンストラクタ）
new toile.Sound(arg)

### Arguments（引数）
arg: 再生するwav/mp3ファイルのパス（文字列）。

### Description（説明）
HTML5のAudioオブジェクトを使ってサウンドを再生します。  
toile.jsを読み込む前、\<head>タグ内などに
```
<script>var toile = window;</script>
```
と記述すると「名前空間」を省いた参照方法、new Sound(... といった記述が可能です。  
但しその場合、同じクラス名が他にも存在する場合、コンフリクトを起こしますので注意が必要です。

### Example（例）
```
var _se = new toile.Sound("me.wav");
console.log(_se.isLoaded()); //=> false（インスタンス生成直後はロードされていない）
_se.play(); //ロード終了次第、再生スタート
```


<a name="SoundcurrentTime"></a>
# Sound.currentTime

### Syntax（構文）
soundObject.currentTime

### Description（説明）
プロパティ。再生しているサウンドの再生時間（単位は秒）。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_se = new toile.Sound("me.wav");
	_se.play();
}

enterframe_canvas = (_canvas) => {
	console.log(Math.round(100 * _se.currentTime / _se.duration)); //=> 0〜100（％）
	_canvas.drawScreen();
}
```

### See Also（参照）
Sound.duration


<a name="Soundduration"></a>
# Sound.duration

### Syntax（構文）
soundObject.duration

### Description（説明）
プロパティ（読み取り専用）。  
再生しているサウンド全体の長さ（単位は秒）。

### Example（例）
Sound.currentTime参照。

### See Also（参照）
Sound.currentTime


<a name="SoundfadeOut"></a>
# Sound.fadeOut()

### Syntax（構文）
soundObject.fadeOut(arg)

### Arguments（引数）
arg: フェードアウトにかける時間（単位は秒）。初期値は1。浮動小数点数値も可能。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。再生しているサウンドを任意の時間をかけてフェードアウトさせます。  
音が聞こえなくなるとSound.stop()が実行され、Sound.volumeの値は1になります。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _stopBtn = new toile.Bitmap("box.png");
	_stopBtn.addEventListener("mouseup", mouseup_stopBtn);
	_stopBtn.x = _stopBtn.y = 10;
	_canvas.addChild(_stopBtn);

	_se = new toile.Sound("me.wav")
	_se.play();
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mouseup_stopBtn = (_bitmap) => {
	_se.fadeOut(2.5); //2.5秒かけてフェードアウト
}
```

### See Also（参照）
Sound.volume、Sound.stop()


<a name="SoundisLoaded"></a>
# Sound.isLoaded()

### Syntax（構文）
soundObject.isLoaded()

### Arguments（引数）
なし。

### Returns（戻り値）
サウンドがロードし終えていればtrue。そうでなければfalse。

### Description（説明）
メソッド。サウンドがロードし終えているかを調べる。  
Soundインスタンスの生成直後はfalseです。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_se = new toile.Sound("me.wav");
	_se.play();
}

enterframe_canvas = (_canvas) => {
	console.log(Math.round(100 * _se.currentTime / _se.duration)); //=> 0〜100（％）
	_canvas.drawScreen();
}
```

### See Also（参照）
Sound.play()


<a name="SoundisPaused"></a>
# Sound.isPaused()

### Syntax（構文）
soundObject.isPaused()

### Arguments（引数）
なし。

### Returns（戻り値）
サウンドが停止中であればtrue。そうでなければfalse。  

### Description（説明）
メソッド。サウンドが停止中か調べる。  
Soundオブジェクト生成直後はtrue。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_se = new toile.Sound("me.wav");
	console.log(_se.isPaused()); //=> true（注意）
	_se.play();
	console.log(_se.isPaused()); //=> false
	_se.pause();
	console.log(_se.isPaused()); //=> true <= pause()によって停止中
	_se.play();
	console.log(_se.isPaused()); //=> false
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Sound.play()、Sound.pause()


<a name="Soundloop"></a>
# Sound.loop

### Syntax（構文）
soundObject.loop

### Description（説明）
プロパティ。再生するサウンドをループさせるか否かを設定。初期値はfalse。

### Example（例）
```
var _se = new toile.Sound("me.wav");
_se.loop = true;
_se.play();
```

### See Also（参照）
Sound.play()


<a name="Soundname"></a>
# Sound.name

### Syntax（構文）
soundObject.name

### Description（説明）
プロパティ。Soundインスタンスのインスタンス名。  
初期値はundefined。

### Example（例）
```
var _se = new toile.Sound("me.wav");
_se.name = "se01";
console.log(_se.name); //=> "se01"
```


<a name="Soundpause"></a>
# Sound.pause()

### Syntax（構文）
soundObject.pause()

### Arguments（引数）
なし。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。再生しているサウンドを一時停止させる。  
その後、Sound.play()を実行すると、続きから再生されます。

### Example（例）
Sound.stop()を参照。

### See Also（参照）
Sound.play()、Sound.stop()


<a name="Soundplay"></a>
# Sound.play()

### Syntax（構文）
soundObject.play()

### Arguments（引数）
なし。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。ロードし終えたら自動的にサウンドファイルを再生します。  
Sound.pause()で一時停止したサウンドの続きを再生する場合もこのメソッドを使用します。

### Example（例）
```
var _se = new toile.Sound("me.wav");
console.log(_se.isLoaded()); //=> false（インスタンス生成直後はロードされていない）
_se.play(); //ロードし終えたら自動的に再生
```
※Sound.stop()を参照。

### See Also（参照）
Sound.pause()、Sound.stop()


<a name="Soundstop"></a>
# Sound.stop()

### Syntax（構文）
soundObject.stop()

### Arguments（引数）
なし。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。再生しているサウンドを停止させる。  
Sound.pause()と異なり、再生ヘッドは最初に戻ります。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _playBtn = new toile.Bitmap("box.png");
	_playBtn.addEventListener("mouseup", mouseup_playBtn);
	_playBtn.x = _playBtn.y = 10;
	_canvas.addChild(_playBtn);

	var _stopBtn = new toile.Bitmap("box.png");
	_stopBtn.addEventListener("mouseup", mouseup_stopBtn);
	_stopBtn.x = 70;
	_stopBtn.y = 10;
	_canvas.addChild(_stopBtn);

	var _pauseBtn = new toile.Bitmap("box.png");
	_pauseBtn.addEventListener("mouseup", mouseup_pauseBtn);
	_pauseBtn.x = 130;
	_pauseBtn.y = 10;
	_canvas.addChild(_pauseBtn);

	_se = new toile.Sound("me.wav");
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mouseup_playBtn = (_bitmap) => {
	_se.play(); //再生ヘッドの位置から再生
}

mouseup_stopBtn = (_bitmap) => {
	_se.stop(); //再生ヘッドを最初に戻し停止
}

mouseup_pauseBtn = (_bitmap) => {
	_se.pause(); //一時停止
}
```

### See Also（参照）
Sound.pause()、Sound.play()


<a name="Soundvolume"></a>
# Sound.volume

### Syntax（構文）
soundObject.volume

### Description（説明）
プロパティ。サウンドのボリュームを設定。  
値は0.0～1.0。初期値は1。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_se = new toile.Sound("me.wav");
	_se.volume = 0; //ボリュームを0にする
	_se.play();
}

enterframe_canvas = (_canvas) => {
	console.log(_se.volume); //=> 0 -> 1
	_se.volume += 0.02; //フェードインさせる
	_canvas.drawScreen();
}
```

### See Also（参照）
Sound.fadeOut()


<a name="SpriteSheet"></a>
# SpriteSheet class

### Inheritance（継承）
SpriteSheet -> Bitmap -> SuperDisplay

### Methods（メソッド）

* [SpriteSheet.addEventListener()](#SpriteSheetaddEventListener): 指定したイベントのリスナーを追加する
* [SpriteSheet.gotoAndPlay()](#SpriteSheetgotoAndPlay): 再生ヘッドを指定したフレームに移動して再生
* [SpriteSheet.gotoAndStop()](#SpriteSheetgotoAndStop): 再生ヘッドを指定したフレームに移動して停止
* [SpriteSheet.hitTest()](#SpriteSheethitTest): 指定したオブジェクトと重なっているか（矩形）
* [SpriteSheet.hitTestCircle()](#SpriteSheethitTestCircle): 指定したオブジェクトと重なっているか（円形）
* [SpriteSheet.isPlay()](#SpriteSheetisPlay): スタイルシートが再生中か否かを調べる
* [SpriteSheet.play()](#SpriteSheetplay): 停止しているフレームから再生
* [SpriteSheet.removeEventListener()](#SpriteSheetremoveEventListener): 指定したイベントのイベントリスナーを解除
* [SpriteSheet.stop()](#SpriteSheetstop): 再生中のスタイルシートを停止する

### Properties（プロパティ）

* [SpriteSheet.alpha](#SpriteSheetalpha): 不透明度
* [SpriteSheet.currentframe](#SpriteSheetcurrentframe): 現在表示しているフレーム数を調べる
* [SpriteSheet.fps](#SpriteSheetfps): スプライトシートアニメのフレームレート
* [SpriteSheet.globalX](#SpriteSheetglobalX): グローバル水平座標位置
* [SpriteSheet.globalY](#SpriteSheetglobalY): グローバル垂直座標位置
* [SpriteSheet.height](#SpriteSheetheight): スプライトシート全体の高さを調べる（読み取り専用）
* [SpriteSheet.image](#SpriteSheetimage): JavaScriptのImageオブジェクトが返ります（読み取り専用）
* [SpriteSheet.name](#SpriteSheetname): SpriteSheetインスタンスのインスタンス名
* [SpriteSheet.parent](#SpriteSheetparent): SpriteSheetが配置されているのコンテナを参照
* [SpriteSheet.regX](#SpriteSheetregX): 回転させる際の中心座標（水平座標）
* [SpriteSheet.regY](#SpriteSheetregY): 回転させる際の中心座標（垂直座標）
* [SpriteSheet.rotate](#SpriteSheetrotate): 回転角度（単位は度）
* [SpriteSheet.rotateRadian](#SpriteSheetrotateRadian): 回転角度（単位はラジアン）
* [SpriteSheet.scale](#SpriteSheetscale): 拡大･縮小率
* [SpriteSheet.scaleX](#SpriteSheetscaleX): 水平方向の拡大･縮小率
* [SpriteSheet.scaleY](#SpriteSheetscaleY): 垂直方向の拡大･縮小率
* [SpriteSheet.totalframes](#SpriteSheettotalframes): スプライトシートの全フレーム数を調べる
* [SpriteSheet.width](#SpriteSheetwidth): スプライトシート全体の幅を調べる（読み取り専用）
* [SpriteSheet.x](#SpriteSheetx): 水平座標位置（単位はピクセル）
* [SpriteSheet.y](#SpriteSheety): 垂直座標位置（単位はピクセル）

### Events（イベント）

* [SpriteSheet.LOAD](#SpriteSheetLOAD): PNGファイルがロードされたら
* [SpriteSheet.MOUSE_DOWN](#SpriteSheetMOUSE_DOWN): SpriteSheetインスタンスをマウスダウンしたら
* [SpriteSheet.MOUSE_UP](#SpriteSheetMOUSE_UP): SpriteSheetをマウスダウン後にマウスボタンを離したら
* [SpriteSheet.MOUSE_UP_OUTSIDE](#SpriteSheetMOUSE_UP_OUTSIDE): マウスダウン後に外でマウスボタンを離したら  

### Constructor（コンストラクタ）
new toile.SpriteSheet(arg1[, arg2])

### Arguments（引数）
arg1: PNG/JPEGファイルのパス（URL）を文字列で指定。
arg2: JSONファイル（メタデータ）のパス（URL）を文字列で指定（オプション）。

### Description（説明）
HTML Canvas上にスプライトシート（アニメーション）を表示するためのクラス。  
指定したPNG/JPEGファイル（XX.png/XX.jpg）とそのメタデータのjsonファイル（XX.json）を使った、SpriteSheetクラスを生成します。  
その際、スプライトシートアニメの各フレーム情報（位置、サイズ）を収めたJSONデータが必須です。  
JSONファイル（XX.json）をXX.pngと同階層に置く場合は、第2引数は省略できます。  
JSONファイルを任意のフォルダに置く場合は、第2引数でそのパスを指定する必要があります。  
toile.jsを読み込む前、\<head>タグ内などに
```
<script>var toile = window;</script>
```
と記述すると「名前空間」を省いた参照方法、new SpriteSheet(... といった記述が可能です。  
但しその場合、同じクラス名が他にも存在する場合、コンフリクトを起こしますので注意が必要です。

■JSONデータのサンプル（XX.json）
```
{"frames": [
	{"frame":  {"num": 1, "x": 0,   "y": 0,   "w": 255, "h": 423}},
	{"frame":  {"num": 2, "x": 255, "y": 0,   "w": 255, "h": 423}},
	{"frame":  {"num": 3, "x": 510, "y": 0,   "w": 255, "h": 423}},
	{"frame":  {"num": 4, "x": 765, "y": 0,   "w": 255, "h": 423}},
	{"frame":  {"num": 5, "x": 0,   "y": 423, "w": 255, "h": 423}},
	{"frame":  {"num": 6, "x": 255, "y": 423, "w": 255, "h": 423}}
]}
```

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _spriteSheet = new toile.SpriteSheet("run.png");
	_canvas.addChild(_spriteSheet);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```


<a name="SpriteSheetaddEventListener"></a>
# SpriteSheet.addEventListener()

### Syntax（構文）
spriteSheetObject.addEventListener(arg1, arg2, arg3)

### Arguments（引数）
arg1: ①"mousedown" ②"mouseup" ③"mouseupoutside" ④"load" の何れか。  
①SpriteSheet.MOUSE_DOWN ②SpriteSheet.MOUSE_UP ③SpriteSheet.MOUSE_UP_OUTSIDE ④SpriteSheet.LOADでも可。

arg2: イベントが発生した際に呼び出す関数。

arg3: オプション。衝突判定（ヒットテスト）を正円で行う場合はtrueに設定。初期値はfalse。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。指定したイベントのリスナーを加える。  
衝突判定（ヒットテスト）のエリアは、初期値は矩形。  
但しcanvasObject.drawScreen()の引数で指定した色（初期値 #ffffff）や透明は含まれません。  
第3引数をtrueにした場合の衝突判定エリアは、正円になります。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _spriteSheet = new toile.SpriteSheet("run.png");
	_spriteSheet.addEventListener("mousedown", mousedown_spriteSheet);
	_canvas.addChild(_spriteSheet);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}

mousedown_spriteSheet = (_spriteSheet) => {
	console.log(_spriteSheet); //=> SpriteSheetオブジェクト
}
```

### See Also（参照）
SpriteSheet.removeEventListener()
SpriteSheet.MOUSE_DOWN、SpriteSheet.MOUSE_UP、SpriteSheet.MOUSE_UP_OUTSIDE、SpriteSheet.LOAD


<a name="SpriteSheetalpha"></a>
# SpriteSheet.alpha

### Syntax（構文）
spriteSheetObject.alpha

### Description（説明）
Bitmapクラスから継承するプロパティ。  
スプライトシートの不透明度（0〜1.0）。初期値は1。  
0に設定すると完全に透明に、1で完全に不透明（全く透けていない）になります。

### Example（例）
```
var _spriteSheet = new toile.SpriteSheet("run.jpg");
_spriteSheet.alpha = 0.5;
```


<a name="SpriteSheetcurrentframe"></a>
# SpriteSheet.currentframe

### Syntax（構文）
spriteSheetObject.currentframe

### Description（説明）
プロパティ（読み取り専用）。  
スプライトシートの現在表示しているフレーム数（1～）を調べる。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_spriteSheet = new toile.SpriteSheet("run.jpg");
	_spriteSheet.addEventListener("mousedown", mousedown_spriteSheet);
	_canvas.addChild(_spriteSheet);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#ffcc00");
}

mousedown_spriteSheet = (_spriteSheet) => {
	console.log(_spriteSheet.currentframe);
}
```

### See Also（参照）
SpriteSheet.gotoAndPlay()、SpriteSheet.gotoAndStop()


<a name="SpriteSheetfps"></a>
# SpriteSheet.fps

### Syntax（構文）
spriteSheetObject.fps

### Description（説明）
プロパティ。  
スプライトシートアニメのおよそのフレームレート（fps）。  
Canvas.fpsとは別に独立したフレームレートを設定することが可能です。  
Canvas.fpsより大きな値を設定しても意味がありません。  
Canvas.addChild()を使ってSpriteSheetをHTML Canvas上に配置する前はNaNが返ります。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.fps = 60;
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _spriteSheet = new toile.SpriteSheet("run.png");
	_canvas.addChild(_spriteSheet);
	_spriteSheet.fps = 10;
	console.log(_spriteSheet.fps, _canvas.fps); //=> 10 59
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}
```

### See Also（参照）
Canvas.fps、Canvas.addChild()


<a name="SpriteSheetglobalX"></a>
# SpriteSheet.globalX

### Syntax（構文）
spriteSheetObject.globalX

### Description（説明）
Bitmapクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「水平」位置（ピクセル）。  
ネストしたContainer内にSpriteSheetを配置し、各Containerの角度（rotate）や回転させる際の中心座標（regX、regY）を変更した場合などでも取得が可能です。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container(); //ビットマップを収めるコンテナ
	_container.x = 100;
	_container.y = 100;
	_canvas.addChild(_container);

	var _spriteSheet = new toile.SpriteSheet("run.png");
	_spriteSheet.x = 50;
	_spriteSheet.y = 50;
	_container.addChild(_spriteSheet); //コンテナにスプライトシートを収める

	console.log(_spriteSheet.globalX, _spriteSheet.globalY); //=> 150 150
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}
```

### See Also（参照）
SpriteSheet.globalY、Containerクラス、Container.rotate、Container.regX、Container.regY


<a name="SpriteSheetglobalY"></a>
# SpriteSheet.globalY

### Syntax（構文）
spriteSheetObject.globalY

### Description（説明）
Bitmapクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「垂直」位置（ピクセル）。  
その他は、SpriteSheet.globalXと同じです。


<a name="SpriteSheetgotoAndPlay"></a>
# SpriteSheet.gotoAndPlay()

### Syntax（構文）
spriteSheetObject.gotoAndPlay(arg)

### Arguments（引数）
arg: スプライトシートの、フレームに移動＆再生したいフレーム番号（1～）を指定。

### Description（説明）
メソッド。スプライトシートの再生ヘッドを指定したフレームに移動して再生。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.fps = 60;
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _spriteSheet = new toile.SpriteSheet("run.png");
	_spriteSheet.addEventListener("mousedown", mousedown_spriteSheet);

	_canvas.addChild(_spriteSheet);
	_spriteSheet.fps = 1;
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}

mousedown_spriteSheet = (_spriteSheet) => {
	_spriteSheet.gotoAndPlay(1);
}
```

### See Also（参照）
SpriteSheet.currentframe、SpriteSheet.gotoAndStop()


<a name="SpriteSheetgotoAndStop"></a>
# SpriteSheet.gotoAndStop()

### Syntax（構文）
spriteSheetObject.gotoAndStop(arg)

### Arguments（引数）
arg: スプライトシートの、フレームに移動＆停止したいフレーム番号（1～）を指定。

### Description（説明）
メソッド。  
スプライトシートの再生ヘッドを指定したフレームに移動して停止。  
SpriteSheetインスタンスの生成直後は、ファイルのロードが完了していないため、想定した挙動をしません。  
ロードが完了してから実行する必要があります。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.fps = 60;
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _spriteSheet = new toile.SpriteSheet("run.png");
	_spriteSheet.addEventListener("load", load_spriteSheet);
	_canvas.addChild(_spriteSheet);
	//_spriteSheet.gotoAndStop(2); //ここではロードし終えていなのでフレーム2を表示できない
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}

function load_spriteSheet(_spriteSheet) {
	_spriteSheet.gotoAndStop(2);
}
```

### See Also（参照）
SpriteSheet.currentframe、SpriteSheet.gotoAndPlay()


<a name="SpriteSheetheight"></a>
# SpriteSheet.height

### Syntax（構文）
spriteSheetObject.height

### Description（説明）
プロパティ（読み取り専用）。  
表示しているフレームの高さ（ピクセル）。  
スプライトシートファイル（XX.json）がロードし終えていない場合は、NaNが返ります。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _spriteSheet = new toile.SpriteSheet("run.png");
	console.log(_spriteSheet.height, _spriteSheet.width); //=> NaN NaN
	_spriteSheet.addEventListener("load", load_spriteSheet);
	_canvas.addChild(_spriteSheet);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}

function load_spriteSheet(_spriteSheet) {
	console.log(_spriteSheet.height, _spriteSheet.width); //=> 423 255
}
```

### See Also（参照）
SpriteSheet.width、SpriteSheet.scaleY


# SpriteSheet.hitTest()

### Syntax（構文）
spriteSheetObject.hitTest(arg)

### Arguments（引数）
arg: スプライトシートとの衝突を調べる表示オブジェクト（矩形）。

### Returns（戻り値）
「矩形同士」の衝突判定の結果を示すブール値。

### Description（説明）
メソッド。Bitmapクラスからの継承。  
指定した表示オブジェクトと交差（矩形領域）しているかを調べます。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousemove", mousemove_canvas);
	_canvas.enabledMouseMove(true);

	_spriteSheet = new toile.SpriteSheet("run.jpg");
	_canvas.addChild(_spriteSheet);

	_bitmap = new toile.Bitmap("circle.png");
	_canvas.addChild(this._bitmap);

    _mouseX = _mouseY = 0;
}

enterframe_canvas = (_canvas) => {
	_bitmap.x = _mouseX;
	_bitmap.y = _mouseY;
	if (_spriteSheet.hitTest(_bitmap)) {
		console.log("接触しています");
	}
	_canvas.drawScreen("#cccccc");
}

mousemove_canvas = (_canvas) => {
	_mouseX = _canvas.mouseX;
	_mouseY = _canvas.mouseY;
}
```

### See Also（参照）
SpriteSheet.hitTestCircle()


<a name="SpriteSheethitTestCircle"></a>
# SpriteSheet.hitTestCircle()

### Syntax（構文）
spriteSheetObject.hitTestCircle(arg)

### Description（説明）
メソッド。Bitmapクラスからの継承。  
SpriteSheet.hitTest()メソッドが「矩形」同士の衝突判定を調べるに対し、このメソッドは「正円形」同士の衝突判定調べます。  
利用方法は、SpriteSheet.hitTest()と同じです。

### See Also（参照）
SpriteSheet.hitTest()


<a name="SpriteSheetimage"></a>
# SpriteSheet.image

### Syntax（構文）
spriteSheetObject.image

### Description（説明）
Bitmapクラスから継承するプロパティ（読み取り専用）。  
HTML CanvasのImageオブジェクト \<img src=​"run.png"> が返ります。

### Example（例）
```
var _spriteSheet = new toile.SpriteSheet("run.png");
console.log(_spriteSheet.image); //=> <img src=​"run.png">​
console.log(_spriteSheet.image.src); //=> http: //localhost/run.png
```


<a name="SpriteSheetisPlay"></a>
# SpriteSheet.isPlay()

### Syntax（構文）
spriteSheetObject.isPlay()

### Arguments（引数）
なし。

### Returns（戻り値）
ブール値。再生中ならばtrue。停止してればfalse。

### Description（説明）
メソッド。スプライトシートが再生中か否かを調べます。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_spriteSheet = new toile.SpriteSheet("run.jpg");
	_spriteSheet.addEventListener("mousedown", mousedown_spriteSheet);
	_canvas.addChild(_spriteSheet);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#ffcc00");
}

mousedown_spriteSheet = (_spriteSheet) => {
	//再生していれば停止、停止していれば再生する場合...。
	if (_spriteSheet.isPlay()) {
			_spriteSheet.stop();
	} else {
			_spriteSheet.play();
	}
}
```

### See Also（参照）
SpriteSheet.play()、SpriteSheet.stop()


<a name="SpriteSheetLOAD"></a>
# SpriteSheet.LOAD

### Syntax（構文）
SpriteSheet.LOAD

### Description（説明）
Bitmapクラスから継承するクラス変数。  
コンストラクタの呼び出し時に指定したスプライトシート（PNG/JPEG）ファイルがロードされたら...実行したい場合に使用します。  
SpriteSheet.addEventListener()でイベントを指定する際に使用します。  
toile.SpriteSheet.LOADの代わりに文字列で"load"と指定しても同じ処理が行われます。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _spriteSheet = new toile.SpriteSheet("run.jpg");
	//ロード完了前は取得できないプロパティ
	console.log(_spriteSheet.totalframes); //=> undefined
	console.log(_spriteSheet.height); //-=> NaN
	console.log(_spriteSheet.width); //-=> NaN
	_spriteSheet.addEventListener(toile.SpriteSheet.LOAD, load_spriteSheet);
	_canvas.addChild(_spriteSheet);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}

function load_spriteSheet(_spriteSheet) {
	//ロード完了後でなければ取得できないプロパティ
	console.log(_spriteSheet.totalframes);
	console.log(_spriteSheet.height);
	console.log(_spriteSheet.width);
}
```

### See Also（参照）
SpriteSheet.addEventListener()


<a name="SpriteSheetMOUSE_DOWN"></a>
# SpriteSheet.MOUSE_DOWN

### Syntax（構文）
SpriteSheet.MOUSE_DOWN

### Description（説明）
Bitmapクラスから継承するクラス変数。  
SpriteSheetインスタンスをマウスダウンした際に何かの処理を実行したい場合に使用します。  
toile.SpriteSheet.MOUSE_DOWNの代わりに"mousedown"と指定しても同じ処理が行われます。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _ss = new toile.SpriteSheet("run.jpg");
	_ss.addEventListener(toile.SpriteSheet.MOUSE_DOWN, mousedown_ss);
	_ss.addEventListener(toile.SpriteSheet.MOUSE_UP, mouseup_ss);
	_ss.addEventListener(toile.SpriteSheet.MOUSE_UP_OUTSIDE, mouseupoutside_ss);

	_canvas.addChild(_ss);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}

mousedown_ss = (_spriteSheet) => {
	console.log("MOUSE_DOWN");
}

mouseup_ss = (_spriteSheet) => {
	console.log("MOUSE_UP");
}

mouseupoutside_ss = (_spriteSheet) => {
	console.log("MOUSE_UP_OUTSIDE");
}
```

### See Also（参照）
SpriteSheet.addEventListener()、SpriteSheet.MOUSE_UP、SpriteSheet.MOUSE_UP_OUTSIDE


<a name="SpriteSheetMOUSE_UP"></a>
# SpriteSheet.MOUSE_UP

### Syntax（構文）
SpriteSheet.MOUSE_UP

### Description（説明）
Bitmapクラスから継承するクラス変数。  
SpriteSheetインスタンスをマウスダウン後に、同じSpriteSheet上でマウスアップした際に、何かの処理を実行したい場合に使用します。  
toile.SpriteSheet.MOUSE_UPの代わりに"mouseup"と指定しても同じ処理が行われます。

### Example（例）
SpriteSheet.MOUSE_DOWN参照。

### See Also（参照）
SpriteSheet.addEventListener()、SpriteSheet.MOUSE_DOWN、SpriteSheet.MOUSE_UP_OUTSIDE


<a name="SpriteSheetMOUSE_UP_OUTSIDE"></a>
# SpriteSheet.MOUSE_UP_OUTSIDE

### Syntax（構文）
SpriteSheet.MOUSE_UP_OUTSIDE

### Description（説明）
Bitmapクラスから継承するクラス変数。  
SpriteSheetインスタンスをマウスダウン後に、同じSpriteSheetの外でマウスアップした際に、何かの処理を実行したい場合に使用します。  
toile.SpriteSheet.MOUSE_UPの代わりに"mouseup"と指定しても同じ処理が行われます。

### Example（例）
SpriteSheet.MOUSE_DOWN参照。

### See Also（参照）
SpriteSheet.addEventListener()、SpriteSheet.MOUSE_DOWN、SpriteSheet.MOUSE_UP_OUTSIDE


<a name="SpriteSheetname"></a>
# SpriteSheet.name

### Syntax（構文）
spriteSheetObject.name

### Description（説明）
Bitmapクラスから継承するプロパティ。  
SpriteSheetインスタンスのインスタンス名。  
初期値はundefined。

### Example（例）
```
var _spriteSheet = new toile.SpriteSheet("run.png");
_spriteSheet.name = "spriteSheet01";
console.log(_spriteSheet.name); //=> "spriteSheet01"
```


<a name="SpriteSheetparent"></a>
# SpriteSheet.parent

### Syntax（構文）
spriteSheetObject.parent

### Description（説明）
Bitmapクラスから継承するプロパティ（読み取り専用）。  
SpriteSheetが配置されているのコンテナを参照。  
最下層は"root"。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container01 = new toile.Container();
	_container01.name = "container01";
	_canvas.addChild(_container01);

	var _spriteSeet01 = new toile.SpriteSheet("run.jpg");
	_spriteSeet01.name = "spriteSheet01";
	_container01.addChild(_spriteSeet01);

	console.log(_spriteSeet01.parent.name); //=> "container01"
	console.log(_spriteSeet01.parent.parent.name); //=> "root"
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}
```

### See Also（参照）
Containerクラス


<a name="SpriteSheetplay"></a>
# SpriteSheet.play()

### Syntax（構文）
spriteSheetObject.Play()

### Arguments（引数）
なし。

### Description（説明）
メソッド。  
SpriteSheet.gotoAndStop() または SpriteSheet.stop() で停止しているスタイルシートを停止しているフレームから再生します。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_spriteSheet = new toile.SpriteSheet("run.jpg");
	_spriteSheet.addEventListener("mousedown", mousedown_spriteSheet);
	_spriteSheet.stop();
	_canvas.addChild(_spriteSheet);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#ffcc00");
}

mousedown_spriteSheet = (_spriteSheet) => {
	_spriteSheet.play();
}
```

### See Also（参照）
SpriteSheet.isPlay()、SpriteSheet.stop()、SpriteSheet.gotoAndStop()


<a name="SpriteSheetregX"></a>
# SpriteSheet.regX

### Syntax（構文）
spriteSheetObject.regX

### Description（説明）
Bitmapクラスから継承するプロパティ。  
回転させる際の中心座標（水平座標）。  
初期値は0。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_spriteSheet = new toile.SpriteSheet("run.jpg");
	_spriteSheet.addEventListener("load", load_spriteSheet);
	_canvas.addChild(_spriteSheet);
}

enterframe_canvas = (_canvas) => {
	_spriteSheet.rotate += 5;
	_canvas.drawScreen("#cccccc");
}

function load_spriteSheet(_spriteSheet) {
	//スプライトシートの中心を軸に回転させる場合...
	_spriteSheet.regX = _spriteSheet.width / 2;
	_spriteSheet.regY = _spriteSheet.height / 2;
}
```

### See Also（参照）
SpriteSheet.regY、SpriteSheet.rotate


<a name="SpriteSheetregY"></a>
# SpriteSheet.regY

### Syntax（構文）
spriteSheetObject.regY

### Description（説明）
Bitmapクラスから継承するプロパティ。  
回転させる際の中心座標（垂直座標）。  
初期値は0。  
その他は、SpriteSheet.regXと同じです。


<a name="SpriteSheetremoveEventListener"></a>
# SpriteSheet.removeEventListener()

### Syntax（構文）
spriteSheetObject.removeEventListener(arg1)

### Arguments（引数）
arg: ①"mousedown" ②"mouseup" ③"mouseupoutside" ④"load" の何れか。  
①SpriteSheet.MOUSE_DOWN ②SpriteSheet.MOUSE_UP ③SpriteSheet.MOUSE_UP_OUTSIDE ④SpriteSheet.LOADでも可。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。指定したイベントのリスナーを解除する。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_spriteSheet = new toile.SpriteSheet("run.png");
	_spriteSheet.addEventListener("mousedown", mousedown_spriteSheet);
	_spriteSheet.stop();
	_canvas.addChild(_spriteSheet);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#ffcc00");
}

mousedown_spriteSheet = (_spriteSheet) => { //1回しか実行されません
	console.log("SpriteSheetが選択されました");
	_spriteSheet.gotoAndStop(2);
	_spriteSheet.removeEventListener("mousedown");
}
```

### See Also（参照）
SpriteSheet.addEventListener()
SpriteSheet.MOUSE_DOWN、SpriteSheet.MOUSE_UP、SpriteSheet.MOUSE_UP_OUTSIDE、SpriteSheet.LOAD


<a name="SpriteSheetrotate"></a>
# SpriteSheet.rotate

### Syntax（構文）
spriteSheetObject.rotate

### Description（説明）
Bitmapクラスから継承するプロパティ。  
回転角度（単位は度）。初期値は0。  
回転軸はSpriteSheet.regX、SpriteSheet.regYに依存します。  
初期設定ではSpriteSheetの左上を中心に回転します。

### Example（例）
```
var _spriteSheet = new toile.SpriteSheet("run.png");
_spriteSheet.regX = 25;
_spriteSheet.regY = 25;
_spriteSheet.rotate = 45;
```

### See Also（参照）
SpriteSheet.regX、SpriteSheet.regY、SpriteSheet.rotateRadian


<a name="SpriteSheetrotateRadian"></a>
# SpriteSheet.rotateRadian

### Syntax（構文）
spriteSheetObject.rotateRadian

### Description（説明）
Bitmapクラスから継承するプロパティ。  
回転角度（単位はラジアン）。初期値は0。  
回転軸はSpriteSheet.regX、SpriteSheet.regYに依存します。  
初期設定ではSpriteSheetの左上を中心に回転します。

### Example（例）
```
var _spriteSheet = new toile.SpriteSheet("run.png");
_spriteSheet.regX = 25;
_spriteSheet.regY = 25;
_spriteSheet.rotateRadian = - Math.PI/4;
console.log(_spriteSheet.rotate); //=> -45（度）
console.log(_spriteSheet.rotateRadian); //=> -0.7853981633974483（ラジアン）
```

### See Also（参照）
SpriteSheet.regX、SpriteSheet.regY、SpriteSheet.rotate


<a name="SpriteSheetscale"></a>
# SpriteSheet.scale

### Syntax（構文）
spriteSheetObject.scaleX

### Description（説明）
プロパティ。拡大･縮小率。  
基準点はSpriteSheet.xおよびSpriteSheet.y。  
SpriteSheet.widthおよびSpriteSheet.heightの値も変動します。  
SpriteSheet.scaleを変更するとSpriteSheet.scaleX、SpriteSheet.scaleYの値も同じになります。  
SpriteSheet.scaleを変更するとSpriteSheet.scaleXも同じ値になります。

### Example（例）
```
var _spriteSheet = new toile.SpriteSheet("sample.png");
_spriteSheet.scale = 2; //水平垂直方向ともに2倍にする
```

### See Also（参照）
SpriteSheet.scale、SpriteSheet.scaleY


<a name="SpriteSheetscaleX"></a>
# SpriteSheet.scaleX

### Syntax（構文）
spriteSheetObject.scaleX

### Description（説明）
プロパティ。水平方向の拡大･縮小率。  
基準点はSpriteSheet.xおよびSpriteSheet.y。  
SpriteSheet.widthの値も変動します。初期値は1。  
SpriteSheet.scaleを変更するとSpriteSheet.scaleXも同じ値になります。  
SpriteSheet.scaleXの値を変更するとSpriteSheet.scaleの値はnullになります。

### Example（例）
```
var _spriteSheet = new toile.SpriteSheet("run.png");
_spriteSheet.scaleX = 2; //水平方向のみ2倍に拡大
```

### See Also（参照）
SpriteSheet.scale、SpriteSheet.scaleY


<a name="SpriteSheetscaleY"></a>
# SpriteSheet.scaleY

### Syntax（構文）
spriteSheetObject.scaleY

### Description（説明）
プロパティ。垂直方向の拡大･縮小率。  
基準点はSpriteSheet.xおよびSpriteSheet.y。  
SpriteSheet.heightの値も変動します。初期値は1。  
SpriteSheet.scaleを変更するとSpriteSheet.scaleYも同じ値になります。  
SpriteSheet.scaleYの値を変更するとSpriteSheet.scaleの値はnullになります。

### Example（例）
```
var _spriteSheet = new toile.SpriteSheet("run.png");
_spriteSheet.scaleY = 2; //垂直方向のみ2倍に拡大。
```

### See Also（参照）
SpriteSheet.scale、SpriteSheet.scaleX


<a name="SpriteSheetstop"></a>
# SpriteSheet.stop()

### Syntax（構文）
spriteSheetObject.stop()

### Arguments（引数）
なし。

### Description（説明）
メソッド。再生中のスタイルシートを停止します。

### Example（例）
```
var _canvas = new toile.Canvas("myCanvas");
_canvas.addEventListener("enterframe", enterframe_canvas);

_spriteSheet = new toile.SpriteSheet("run.png");
_spriteSheet.stop();
_canvas.addChild(_spriteSheet);
```

### See Also（参照）
SpriteSheet.isPlay()、SpriteSheet.play()


<a name="SpriteSheettotalframes"></a>
# SpriteSheet.totalframes

### Syntax（構文）
spriteSheetObject.totalframes

### Description（説明）
プロパティ（読み取り専用）。  
スプライトシートの全フレーム数を調べます。  
SpriteSheetインスタンスの生成直後はundefinedが返ります。  
SpriteSheet関連のファイル（○.json）がロード終了後に利用して下さい。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _spriteSheet = new toile.SpriteSheet("run.jpg");
	_spriteSheet.stop();
	_spriteSheet.addEventListener("mousedown", mousedown_spriteSheet);
	_canvas.addChild(_spriteSheet);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}

mousedown_spriteSheet = (_spriteSheet) => {
	//SpriteSheetの現在のフレーム位置を調べる
	var _currentframe = _spriteSheet.currentframe;

	//SpriteSheetの現在のフレーム位置を調べる
	if (_currentframe < _spriteSheet.totalframes) {
		_spriteSheet.gotoAndStop(++ _currentframe);
	} else { //最終フレームの場合、最初に戻らせる場合...
		_spriteSheet.gotoAndStop(1);
	}
}
```

### See Also（参照）
SpriteSheet.currentframe


<a name="SpriteSheetwidth"></a>
# SpriteSheet.width

### Syntax（構文）
spriteSheetObject.height

### Description（説明）
表示しているフレームの幅（ピクセル）。  
スプライトシートファイル（XX.json）がロードし終えていない場合は、NaNが返ります。

### Example（例）
SpriteSheet.height参照。

### See Also（参照）
SpriteSheet.height、SpriteSheet.scaleX


<a name="SpriteSheetx"></a>
# SpriteSheet.x

### Syntax（構文）
spriteSheetObject.x

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
「水平」座標位置（単位はピクセル）。

### Example（例）
```
var _spriteSheet = new toile.SpriteSheet("run.jpg");
_spriteSheet.x = 10;
```

### See Also（参照）
SpriteSheet.y


<a name="SpriteSheety"></a>
# SpriteSheet.y

### Syntax（構文）
spriteSheetObject.y

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
「垂直」座標位置（単位はピクセル）。

### Example（例）
```
var _spriteSheet = new toile.SpriteSheet("run.jpg");
_spriteSheet.y = 10;
```

### See Also（参照）
SpriteSheet.x


<a name="Text"></a>
# Text class

### Inheritance（継承）
Text -> SuperDisplay

### Methods（メソッド）

* [Text.addWebFont()](#TextaddWebFont): Webフォントを追加する  

### Properties（プロパティ）

* [Text.align](#Textalign): テキストをどのように文字寄せさせるかを設定
* [Text.alpha](#Textalpha): 表示オブジェクトの不透明度
* [Text.baseline](#Textbaseline): テキストのベースラインを設定
* [Text.color](#Textcolor): テキストの色を設定
* [Text.font](#Textfont): テキストのフォントを指定
* [Text.globalX](#TextglobalX): グローバル水平座標位置
* [Text.globalY](#TextglobalY): グローバル垂直座標位置
* [Text.name](#Textname): Textインスタンスのインスタンス名
* [Text.parent](#Textparent): テキストが配置されているコンテナを参照
* [Text.regX](#TextregX): 回転させる際の中心座標（水平座標）
* [Text.regY](#TextregY): 回転させる際の中心座標（垂直座標）
* [Text.rotate](#Textrotate): 回転角度（単位は度）
* [Text.rotateRadian](#TextrotateRadian): 回転角度（単位はラジアン）
* [Text.scale](#Textscale): テキストの拡大･縮小率
* [Text.size](#Textsize): フォントサイズを指定
* [Text.text](#Texttext): 表示するテキストの文字列
* [Text.x](#Textx): 水平座標位置（単位はピクセル）
* [Text.y](#Texty): 垂直座標位置（単位はピクセル）

### Constructor（コンストラクタ）
new toile.Text(arg)

### Arguments（引数）
arg: 表示したいテキスト。

### Description（説明）
HTML Canvas上に「テキスト」を表示するためのクラス。  
日本語も利用可能です。  
toile.jsを読み込む前、\<head>タグ内などに
```
<script>var toile = window;</script>
```
と記述すると「名前空間」を省いた参照方法、new Text(... といった記述が可能です。  
但しその場合、同じクラス名が他にも存在する場合、コンフリクトを起こしますので注意が必要です。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _text = new toile.Text("SAMPLE");
	_canvas.addChild(_text);

}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```


<a name="TextaddWebFont"></a>
# Text.addWebFont()

### Syntax（構文）
textObject.addWebFont(arg1, arg2, arg3)

### Arguments（引数）
arg1: 任意の文字列（ただし先頭文字に数字を使うことはできません）。  
通常はWebフォント名（Text.fontで指定する際に使います）。

arg2: 文字列。Webフォント（.ttf .otf .eot）が置いてあるURL。

arg3: 文字列。Webフォントのフォーマット。"truetype"、"opentype"、"embedded-opentype"の何れか。

### Returns（戻り値）
なし。

### Description（説明）
Webフォント（サーバ上のフォント）を利用するためのメソッド。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");

	var _text = new toile.Text("toile.js by ECMAScript 6");
	//http://jp.ffonts.net/CabinSketch-Bold.font
	_text.addWebFont("CabinSketch-Bold", "CabinSketch-Bold.ttf", "truetype");
	_text.font = "CabinSketch-Bold";
	_text.size = 50;
	_canvas.addChild(_text);

	_canvas.addEventListener("enterframe", enterframe_canvas);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Text.font()


<a name="Textalign"></a>
# Text.align

### Syntax（構文）
textObject.align

### Description（説明）
プロパティ。テキストをどのように文字寄せさせるかを設定。  
"start"、"center"、"left"、"right"のいずれかを設定します。  
初期値は、"left"（Text.xを左端にして表示）。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
_text.align = "center";
```

### See Also（参照）
Text.baseline


<a name="Textalpha"></a>
# Text.alpha

### Syntax（構文）
textObject.alpha

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
テキストの不透明度（0〜1.0）。初期値は1。  
0に設定すると完全に透明に、1で完全に不透明（全く透けていない）になります。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
_text.alpha = 0.5;
```


<a name="Textbaseline"></a>
# Text.baseline

### Syntax（構文）
textObject.baseline

### Description（説明）
プロパティ。テキストのベースラインを設定。"top"、"middle"、"bottom"のいずれかを設定。
初期値は、"top"（Text.yを上端にして表示）。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
_text.baseline = "middle";
```

### See Also（参照）
Text.align


<a name="Textcolor"></a>
# Text.color

### Syntax（構文）
textObject.color

### Description（説明）
プロパティ。テキストの色を設定。  
RGBを16進数で設定します。  
例えば、赤の場合は"#ff0000"とします。  
プロパティ値を取得した値は、各色を0～255で表した値（赤の場合 "255,0,0"）になります。  
初期値は、"0,0,0"（黒）。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
_text.color = "#ff0000"; //赤の場合
```


<a name="Textfont"></a>
# Text.font

### Syntax（構文）
textObject.font

### Description（説明）
プロパティ。HTML Canvas上に表示するテキストのフォントを指定します。  
設定値は次の通り（Ubuntu 16.04 LTSの場合）。  
"serif": 日本語の明朝体のようなフォント。  
"san-serif": 日本語のゴシック体のようなフォント（初期値）。  
"cursive": "san-serif"と同じ（Windowsの場合Comic Sans MS）。  
"fantasy": "san-serif"と同じ（Windowsの場合Impact）。  
"monospace": 日本語の等幅ゴシック体（やや細め）のようなフォント。  
※OSによって異なりますので検証した上で利用して下さい。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
_text.size = 100;
_text.font = "serif";
```


<a name="TextglobalX"></a>
# Text.globalX

### Syntax（構文）
textObject.globalX

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「水平」位置（ピクセル）。  
ネストしたContainer内にTextを配置し、各Containerの角度（rotate）や回転させる際の中心座標（regX、regY）を変更した場合などでも取得が可能です。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container(); //テキストを収めるコンテナ
	_container.x = 100;
	_container.y = 100;
	_canvas.addChild(_container);

	var _text = new toile.Text("SAMPLE");
	_text.x = 50;
	_text.y = 50;
	_container.addChild(_text); //コンテナにテキストを収める

	console.log(_text.globalX, _text.globalY); //=> 150 150
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Text.globalY、Containerクラス、Container.rotate、Container.regX、Container.regY


<a name="TextglobalY"></a>
# Text.globalY

### Syntax（構文）
textObject.globalY

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「垂直」位置（ピクセル）。  
その他は、Text.globalXと同じです。


<a name="Textname"></a>
# Text.name

### Syntax（構文）
textObject.name

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
Textインスタンスのインスタンス名。  
初期値はundefined。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
_text.name = "text01";
console.log(_text.name); //=> "text01"
```


<a name="Textparent"></a>
# Text.parent

### Syntax（構文）
textObject.parent

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読み取り専用）。  
Textが配置されているのコンテナを参照。  
最下層は"root"。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container01 = new toile.Container();
	_container01.name = "container01";
	_canvas.addChild(_container01);

	var _text01 = new toile.Text("SAMPLE");
	_text01.name = "bitmap01";
	_container01.addChild(_text01);

	console.log(_text01.parent.name); //=> "container01"
	console.log(_text01.parent.parent.name); //=> "root"
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```


<a name="TextregX"></a>
# Text.regX

### Syntax（構文）
textObject.regX

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転させる際の中心座標（水平座標）。  
初期値は0。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
_text.regX = 100;
_text.regY = 25;
_text.rotate = -45;
```

### See Also（参照）
Text.regY、Text.rotate


<a name="TextregY"></a>
# Text.regY

### Syntax（構文）
textObject.regY

### Description（説明）
回転させる際の中心座標（垂直座標）。  
その他は、Text.regXと同じです。


<a name="Textrotate"></a>
# Text.rotate

### Syntax（構文）
textObject.rotate

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転角度（単位は度）。  
初期値は0。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
_text.regX = 25;
_text.regY = 25;
_text.rotate = -45;
```

### See Also（参照）
Text.regX、Text.regY、Text.rotateRadian


<a name="TextrotateRadian"></a>
# Text.rotateRadian

### Syntax（構文）
textObject.rotateRadian

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転角度（単位はラジアン）。  
初期値は0。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
_text.rotateRadian = Math.PI/4;
console.log(_text.rotate); //=> 45（度）
console.log(_text.rotateRadian); //=> 0.7853981633974483（ラジアン）
```

### See Also（参照）
Text.regX、Text.regY、Text.rotate


<a name="Textscale"></a>
# Text.scale

### Syntax（構文）
textObject.scale

### Description（説明）
プロパティ。テキストの拡大･縮小率。  
初期値は1.0。X方向とY方向を同時に設定します。  
Text.scaleを変更するとText.sizeも変動します。  
Text.sizeを変更した場合、その時点でText.scaleは1にリセットされます。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
console.log(_text.size); //=> 10（初期値）
_text.scale = 5; //縦横共に5倍にする場合
console.log(_text.size); //=> 50（Text.sizeも変動）
```

### See Also（参照）
Text.size


<a name="Textsize"></a>
# Text.size

### Syntax（構文）
textObject.size

### Description（説明）
プロパティ。テキストのフォントサイズを指定。初期値は10。  
Text.scaleを変更すると、それに比例してText.sizeも変動します。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
_text.size = 50;
```

### See Also（参照）
Text.scale


<a name="Texttext"></a>
# Text.text

### Syntax（構文）
textObject.text

### Description（説明）
プロパティ。HTML Canvas上に表示するテキストの文字列。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
console.log(_text.text); //=> "SAMPLE"
_text.text = "てきすと";
```

<a name="Textx"></a>
# Text.x

### Syntax（構文）
textObject.x

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
「水平」座標位置（単位はピクセル）。

### Example（例）
```
var _text = new toile.Text("SAMPLE");
_text.x = 10;
_text.y = 10;
```

### See Also（参照）
Text.y


<a name="Texty"></a>
# Text.y

### Syntax（構文）
_text.y

### Description（説明）
「垂直」座標位置（単位はピクセル）。  
その他は、Text.xと同じです。


<a name="Video"></a>
# Video class

### Inheritance（継承）
Video -> SuperDisplay

### Methods（メソッド）

* [Video.hitTest()](#VideohitTest): 指定したオブジェクトと重なっているか（矩形）
* [Video.isLoaded()](#VideoisLoaded): ビデオがロードし終えているかを調べる
* [Video.isLoop()](#VideoisLoop): ビデオを繰り返し再生するか
* [Video.pause()](#Videopause): ビデオを一時停止する
* [Video.play()](#Videoplay): 停止しているビデオを再生する
* [Video.stop()](#Videostop): 停止して再生ヘッドを1フレームに移動する

### Properties（プロパティ）

* [Video.alpha](#Videoalpha): 表示オブジェクトの不透明度
* [Video.currentTime](#VideocurrentTime): 再生しているビデオの再生時間
* [Video.duration](#Videoduration): 再生しているビデオ全体の長さ
* [Video.globalX](#VideoglobalX): グローバル水平座標位置
* [Video.globalY](#VideoglobalY): グローバル垂直座標位置
* [Video.height](#Videoheight): ビデオの表示サイズ（高さ）
* [Video.name](#Videoname): Videoインスタンスのインスタンス名
* [Video.parent](#Videoparent): ビデオが配置されているコンテナを参照
* [Video.regX](#VideoregX): 回転させる際の中心座標（水平座標）
* [Video.regY](#VideoregY): 回転させる際の中心座標（垂直座標）
* [Video.rotate](#Videorotate): 回転角度（単位は度）
* [Video.rotateRadian](#VideorotateRadian): 回転角度（単位はラジアン）
* [Video.scale](#Videoscale): 拡大･縮小率
* [Video.width](#Videowidth): ビデオの表示サイズ（幅）
* [Video.x](#Videox): 水平座標位置（単位はピクセル）
* [Video.y](#Videoy): 垂直座標位置（単位はピクセル）

### Constructor（コンストラクタ）
new toile.Video(arg1, arg2, arg3)

### Arguments（引数）
arg1: 読み込むビデオ（○.mp4）のパス（文字列）。  
arg2: 読み込むビデオの元サイズ（横、単位はピクセル）。  
arg3: 読み込むビデオの元サイズ（縦、単位はピクセル）。

### Description（説明）
HTML Canvas上に動画（MPEG4）を表示するためのクラス。
指定したMPEG4ファイルを使った、Videoクラスを生成します。
toile.jsを読み込む前、\<head>タグ内などに
```
<script>var toile = window;</script>
```
と記述すると「名前空間」を省いた参照方法、new Video(... といった記述が可能です。  
但しその場合、同じクラス名が他にも存在する場合、コンフリクトを起こしますので注意が必要です。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _video = new toile.Video("sample.mp4", 720, 1280);
	_canvas.addChild(_video);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen("#cccccc");
}
```


<a name="Videoalpha"></a>
# Video.alpha

### Syntax（構文）
videoObject.alpha

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
ビットマップの不透明度（0〜1.0）。初期値は1。  
0に設定すると完全に透明に、1で完全に不透明（全く透けていない）になります。

### Example（例）
```
var _video = new toile.Video("sample.mp4", 720, 1280);
_video.alpha = 0.5;
```


<a name="VideocurrentTime"></a>
# Video.currentTime

### Syntax（構文）
videoObject.currentTime

### Description（説明）
プロパティ。再生しているビデオの再生時間（単位は秒）。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_video = new toile.Video("sample.mp4", 720, 1280);
	_canvas.addChild(_video);
	_video.play();
}

enterframe_canvas = (_canvas) => {
	var _video = window._video;
	console.log(Math.round(100*_video.currentTime/_video.duration)); //=> 0〜100（％）
	_canvas.drawScreen();
}
```

### See Also（参照）
Video.duration


<a name="Videoduration"></a>
# Video.duration

### Syntax（構文）
videoObject.duration

### Description（説明）
プロパティ（読み取り専用）。  
再生しているビデオ全体の長さ（単位は秒）。

### Example（例）
Video.currentTime参照。

### See Also（参照）
Video.currentTime


<a name="VideoglobalX"></a>
# Video.globalX

### Syntax（構文）
videoObject.globalX

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「水平」位置（ピクセル）。  
ネストしたContainer内にVideoを配置し、各Containerの角度（rotate）や回転させる際の中心座標（regX、regY）を変更した場合などでも取得が可能です。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container(); //ビデオを収めるコンテナ
	_container.x = 100;
	_container.y = 100;
	_canvas.addChild(_container);

	var _video = new toile.Video("sample.mp4", 720, 1280);
	_video.x = 50;
	_video.y = 50;
	_container.addChild(_video); //コンテナにビデオを収める

	console.log(_video.globalX, _video.globalY); //=> 150 150
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Video.globalY、Containerクラス、Container.rotate、Container.regX、Container.regY


<a name="VideoglobalY"></a>
# Video.globalY

### Syntax（構文）
videoObject.globalY

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読取り専用）。  
キャンバスの左上を基準とした「垂直」位置（ピクセル）。  
その他は、Video.globalXと同じです。


<a name="Videoheight"></a>
# Video.height

### Syntax（構文）
videoObject.height

### Description（説明）
プロパティ。ビデオの表示サイズ（高さ）を設定。  
初期値はコンストラクタ（new Video()）で設定した高さ。  
Video.scaleによって値が変化します。

### Example（例）
```
var _video = new toile.Video("sample.mp4", 720, 1280);
_video.height = 256;
_video.width = 148;
```

### See Also（参照）
Video.width


<a name="VideohitTest"></a>
# Video.hitTest()

### Syntax（構文）
videoObject.hitTest(arg)

### Arguments（引数）
arg: ビデオとの衝突を調べる表示オブジェクト（矩形）。

### Returns（戻り値）
「矩形同士」の衝突判定の結果を示すブール値。

### Description（説明）
メソッド。SuperDisplayクラスからの継承。  
指定した表示オブジェクトと交差（矩形領域）しているかを調べます。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);
	_canvas.addEventListener("mousemove", mousemove_canvas);
	_canvas.enabledMouseMove(true);

	_bitmap = new toile.Bitmap("sample.jpg");
	_canvas.addChild(this._bitmap);

	_video = new toile.Video("sample.mp4", 720, 1280);
	_video.scale = 0.25;
	_canvas.addChild(_video);

    _mouseX = _mouseY = 0;
}

enterframe_canvas = (_canvas) => {
	_video.x = _mouseX;
	_video.y = _mouseY;
	if (_video.hitTest(_bitmap)) {
		console.log("接触しています");
	}
	_canvas.drawScreen();
}

mousemove_canvas = (_canvas) => {
	_mouseX = _canvas.mouseX;
	_mouseY = _canvas.mouseY;
}
```

<a name="VideoisLoaded"></a>
# Video.isLoaded()

### Syntax（構文）
videoObject.isLoaded()

### Arguments（引数）
なし。

### Returns（戻り値）
ビデオがロードし終えていればtrue。そうでなければfalse。

### Description（説明）
メソッド。ビデオがロードし終えているかを調べる。  
Videoインスタンスの生成直後はfalseです。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	_video = new toile.Video("sample.mp4", 720, 1280);
	_canvas.addChild(_video);
}

enterframe_canvas = (_canvas) => {
	console.log(_video.isLoaded()); //=> false -> true
	_canvas.drawScreen();
}
```

### See Also（参照）
Video.play()


<a name="VideoisLoop"></a>
# Video.isLoop()

### Syntax（構文）
videoObject.isLoop(arg)

### Arguments（引数）
arg: ビデオの再生を繰返す場合はtrue、繰り返さない場合はfalse。初期値はfalse。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。ビデオの再生を繰返すか否かの設定。

### Example（例）
```
var _video = new toile.Video("sample.mp4", 720, 1280);
_video.isLoop(true);
```


<a name="Videoname"></a>
# Video.name

### Syntax（構文）
videoObject.name

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
Videoインスタンスのインスタンス名。初期値はundefined。

### Example（例）
```
var _video = new toile.Video("sample.mp4", 720, 1280);
_video.name = "video01";
console.log(_video.name); //=> "video01"
```


<a name="Videoparent"></a>
# Video.parent

### Syntax（構文）
videoObject.parent

### Description（説明）
SuperDisplayクラスから継承するプロパティ（読み取り専用）。  
Videoが配置されているのコンテナを参照。最下層は"root"。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container();
	_container.name = "container01";
	_canvas.addChild(_container);

	var _video = new toile.Video("sample.mp4", 720, 1280);
	_video.name = "bitmap";
	_container.addChild(_video);

	console.log(_video.parent.name); //=> "container"
	console.log(_video.parent.parent.name); //=> "root"
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}
```

### See Also（参照）
Containerクラス


<a name="Videopause"></a>
# Video.pause()

### Syntax（構文）
videoObject.pause()

### Arguments（引数）
なし。

### Description（説明）
メソッド。ビデオを一時停止します。  
一時停止したフレームから、再生するには Video.play() を実行します。

### Example（例）
```
var _video = new toile.Video("sample.mp4", 720, 1280);
_video.pause(); //再生ヘッドは1フレーム目で停止
```
※Video.stop()参照。

### See Also（参照）
Video.play()、Video.stop()


<a name="Videoplay"></a>
# Video.play()

### Syntax（構文）
videoObject.play()

### Arguments（引数）
なし。

### Description（説明）
メソッド。Video.pause() や Video.stop() で停止しているビデオを再生します。

### Example（例）
Video.stop()参照。

### See Also（参照）
Video.pause()、Video.stop()


<a name="VideoregX"></a>
# Video.regX

### Syntax（構文）
videoObject.regX

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転させる際の中心座標（「水平」座標）。初期値は0。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _container = new toile.Container();
	_container.name = "container01";
	_canvas.addChild(_container);

	_video = new toile.Video("sample.mp4", 720, 1280);
	_video.width = 148;
	_video.height = 256;
	//ビデオの中心を基準に回転させる場合
	_video.regX = _video.width / 2;
	_video.regY = _video.height / 2;
	_container.addChild(_video);
}

enterframe_canvas = (_canvas) => {
	_video.rotate += 5;
	_canvas.drawScreen();
}
```

### See Also（参照）
Video.regY、Video.rotate


<a name="VideoregY"></a>
# Video.regY

### Syntax（構文）
videoObject.regY

### Description（説明）
回転させる際の中心座標（「垂直」座標）。  
他は、Video.regXと同じです。


<a name="Videorotate"></a>
# Video.rotate

### Syntax（構文）
videoObject.rotate

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転角度（単位は度）。  
初期値は0。

### Example（例）
```
var _video = new toile.Video("sample.mp4", 720, 1280);
_video.regX = 25;
_video.regY = 25;
_video.rotate = 45;
```

### See Also（参照）
Video.regX、Video.regY、Video.rotateRadian


<a name="VideorotateRadian"></a>
# Video.rotateRadian

### Syntax（構文）
videoObject.rotateRadian

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
回転角度（単位はラジアン）。  
初期値は0。

### Example（例）
```
var _video = new toile.Video("sample.mp4", 720, 1280);
_video.rotateRadian = Math.PI/4;
console.log(_video.rotate); //=> 45（度）
console.log(_video.rotateRadian); //=> 0.7853981633974483（ラジアン）
```

### See Also（参照）
Video.regX、Video.regY、Video.rotate


<a name="Videoscale"></a>
# Video.scale

### Syntax（構文）
videoObject.scale

### Description（説明）
プロパティ。ロードしたビデオの元サイズに対する拡大･縮小率。  
初期値は1。  
Video.widthまたはVideo.heightを変更するとnullになります。

### Example（例）
```
var _video = new toile.Video("sample.mp4", 720, 1280);
_video.scale = 2; //水平垂直方向ともに2倍にする
```

### See Also（参照）
Video.height、Video.width


<a name="Videostop"></a>
# Video.stop()

### Syntax（構文）
videoObject.stop()

### Arguments（引数）
なし。

### Returns（戻り値）
なし。

### Description（説明）
メソッド。  
再生しているビデオを停止し、再生ヘッドを1フレームに移動します。

### Example（例）
```
//main.js
window.addEventListener("load", load_window, false);

function load_window() {
	var _canvas = new toile.Canvas("myCanvas");
	_canvas.addEventListener("enterframe", enterframe_canvas);

	var _stopBtn = new toile.Bitmap("box.png");
	_stopBtn.addEventListener("mouseup", mouseup_stopBtn);
	_stopBtn.x = 5;
	_stopBtn.y = 10;
	_canvas.addChild(_stopBtn);

	var _pauseBtn = new toile.Bitmap("box.png");
	_pauseBtn.addEventListener("mouseup", mouseup_pauseBtn);
	_pauseBtn.x = 65;
	_pauseBtn.y = 10;
	_canvas.addChild(_pauseBtn);

	var _playBtn = new toile.Bitmap("box.png");
	_playBtn.addEventListener("mouseup", mouseup_playBtn);
	_playBtn.x = 125;
	_playBtn.y = 10;
	_canvas.addChild(_playBtn);

	_video = new toile.Video("sample.mp4", 720, 1280);
	_video.stop();
	_video.y = 100;
	_video.scale = 0.25;
	_canvas.addChild(_video);
}

enterframe_canvas = (_canvas) => {
	_canvas.drawScreen();
}

mouseup_playBtn = (_bitmap) => {
	console.log("PLAY");
	_video.play(); //再生ヘッドの位置から再生
}

mouseup_stopBtn = (_bitmap) => {
	console.log("STOP");
	_video.stop(); //再生ヘッドを最初に戻し停止
}

mouseup_pauseBtn = (_bitmap) => {
	console.log("PAUSE");
	_video.pause(); //一時停止
}
```

### See Also（参照）
Video.pause()、Video.play()


<a name="Videowidth"></a>
# Video.width

### Syntax（構文）
videoObject.width

### Description（説明）
プロパティ。ビデオの表示サイズ（幅）を設定。  
初期値はコンストラクタ（new Video()）で設定した高さ。  
Video.scaleによって値が変化します。

### Example（例）
```
var _video = new toile.Video("sample.mp4", 720, 1280);
_video.height = 256;
_video.width = 148;
```

### See Also（参照）
Video.height


<a name="Videox"></a>
# Video.x

### Syntax（構文）
videoObject.x

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
水平座標位置（単位はピクセル）。

### Example（例）
```
var _video = new toile.Video("sample.mp4", 720, 1280);
_video.x = 10;
```

### See Also（参照）
Video.y


<a name="Videoy"></a>
# Video.y

### Syntax（構文）
videoObject.y

### Description（説明）
SuperDisplayクラスから継承するプロパティ。  
水平座標位置（単位はピクセル）。

### Example（例）
```
var _video = new toile.Video("sample.mp4", 720, 1280);
_video.y = 10;
```

### See Also（参照）
Video.x
