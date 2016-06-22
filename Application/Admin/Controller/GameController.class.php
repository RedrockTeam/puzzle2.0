<?php
namespace Admin\Controller;
use Think\Controller;
class GameController extends Controller {

	private $errorMsg = '';

    public function _before_index(){
        if (!session('username')) {
            redirect('../Index/login');
        }
    }

    public function index() {
    	$Game = M('game');
    	$data = $Game->select();
    	$this->assign('data', $data);
    	$this->display('list');
    }


    public function rank() {
        $games = M('game')->select();
        $this->assign('games', $games);
        $this->display();
    }

    public function detail($id) {
        $count = M('score')->where("map_id = '$id'")->count();
        $Page = new \Think\Page($count, 20);
        $data = M('score')->where("map_id = '$id'")->order("spend_time")->limit($Page->firstRow.','.$Page->listRows)->select();
        $this->assign('data', $data);
        $this->assign('page', $Page->show());
        $this->display();
    }

    public function add() {
    	if (IS_GET) {
    		$mapId = M('game')->max('map_id') + 1;
    		$this->assign('mapId', $mapId);
    		$this->display();
    	} else {
    		$mapId = I('post.map_id');
    		$gameName = I('post.game_name');
    		$files = $_FILES;
    		$files = $this->checkAndFormat($files, 'slider', 12, "滑块图片为12张!");
    		$files = $this->checkAndFormat($files, 'personal', 2, 'sdsd');
			echo "<pre>";
    		// print_r($files);
    		echo "</pre>";
    		// return;


    		$config = C('uploadConfig');
            $config['exts'] = array('png'); // 设置附件上传类
            $info = array();
    		foreach ($files as $key => $file) {
				$config['savePath'] = $key.'/';
    			if ($key == 'personal' || $key == 'slider') {
    				if (!is_dir('Public/home/build/images/'.$key.'/'.$mapId)) {
    					mkdir("Public/home/build/images/".$key.'/'.$mapId, 0755);
    				}
					$config['savePath'] .= $mapId.'/';
    			}
    			if ($key == 'personal') {
    				foreach ($file as $index => $value) {
    					switch ($index) {
    						case 0: $saveName = 'map'; break;
    						case 1: $saveName = 'name'; break;
    					}
    					$_config = $config;
    					$_config['saveName'] = $saveName;
    					$Upload = new \Think\Upload($_config);
						$uploadInfo = $Upload->uploadOne($value);
						if ($Upload->getError()) {
							$this->errorMsg = $Upload->getError();
							break;
						} else {
							if ($saveName == 'map') {
								$saveName = 'personal';
							}
							$info[$saveName.'_img'] = 'build/images/'.$uploadInfo['savepath'].$uploadInfo['savename'];
						}
    				}
    			} else if ($key == 'slider') {
    				foreach ($file as $index => $value) {
    					$Upload = new \Think\Upload($config);
						$uploadInfo = $Upload->uploadOne($value);
						if ($Upload->getError()) {
							$this->errorMsg = $Upload->getError();
							break;
						}
    				}
    			} else {
    				if (!$file['name'] || !$file['tmp_name']) {
    					$this->error("有部分图片未上传");
    				} else {
	    				$_config = $config;
	    				$_config['saveName'] = $mapId;
	    				$Upload = new \Think\Upload($_config);
						$uploadInfo = $Upload->uploadOne($file);
						if ($Upload->getError()) {
							$this->errorMsg = $Upload->getError();
							break;
						} else {
							$info[$key.'_img'] = 'build/images/'.$uploadInfo['savepath'].$uploadInfo['savename'];
						}
    				}
    			}
    			if ($this->errorMsg) {
    				break;
    			}
    		}

    		if ($this->errorMsg) {
    			$this->error($this->errorMsg);
    		} else {
    			$info['map_id'] = $mapId;
    			$info['game_name'] = $gameName;
    			if (M('game')->add($info)) {
    				$this->success('ok');
    			}
    		}

    	}

    }


    private function checkAndFormat($arr, $name, $length, $error) {
    	if (count($arr[$name]['name']) == $length) {
			$origin = $arr[$name];
			$temp = array();
			for ($i = 0; $i < $length; $i++) { 
				$_temp = array();
				$_temp['name'] = $origin['name'][$i];
				$_temp['type'] = $origin['type'][$i];
				$_temp['size'] = $origin['size'][$i];
				$_temp['error'] = $origin['error'][$i];
				$_temp['tmp_name'] = $origin['tmp_name'][$i];
				array_push($temp, $_temp);
			}
			unset($arr[$name]);
			$arr[$name] = $temp;
			return $arr;
		} else {
			$this->error($error);
		}
    }

}