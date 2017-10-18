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
}

enterframe_canvas = (_canvas) => {
    _canvas.drawScreen("#ffcc00");
}

mouseup_canvas = (_canvas) => {
    location.href = "index.html";
}