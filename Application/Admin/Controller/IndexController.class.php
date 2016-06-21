<?php
namespace Admin\Controller;
use Think\Controller;
class IndexController extends Controller {

    public function index() {
        $this->display();
    }

    public function gameList() {

    	$Game = M('game');

    	$data = $Game->select();
    	$this->assign('data', $data);
    	$this->display('list');


    }

}