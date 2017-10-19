<?php 
    $w = 40; //frameWidth
    $h = 60; //frameHeight
    $layersNum = 8; //layersNum(framesNum)

    $frames = array();
    for ($i = 0; $i < $layersNum; $i++) {
        $frame = array();
        $frame["num"] = $i + 1;
        $frame["x"] = $i * $w;
        $frame["y"] = 0;
        $frame["w"] = $w;
        $frame["h"] = $h;
        array_push($frames, array("frame"=>$frame));
    } 
    $result = array("frames"=>$frames); 
    echo json_encode($result);
?>