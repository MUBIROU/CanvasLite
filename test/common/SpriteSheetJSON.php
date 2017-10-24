<?php 
	$w = 580; //frameWidth
	$h = 593; //frameHeight
	$layerNum = 30; //layersNum(framesNum)
	$spalten = 7; //スプライトシートの横方向の画像数

	$frames = array(); 
	for ($i = 0; $i < $layerNum; $i++) { 
        $frame = array(); 
        $frame["num"] = $i + 1;
		$frame["x"] = $i % $spalten * $w; 
		$frame["y"] = floor($i / $spalten) * $h; 
		$frame["w"] = $w; 
		$frame["h"] = $h; 
		array_push($frames, array("frame"=>$frame)); 
	} 
	$result = array("frames"=>$frames); 
	echo json_encode($result); 
?>