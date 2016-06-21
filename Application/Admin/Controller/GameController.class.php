<?php
namespace Admin\Controller;
use Think\Controller;
class GameController extends Controller {

    public function index() {
    	$Game = M('game');
    	$data = $Game->select();
    	$this->assign('data', $data);
    	$this->display('list');
    }

    public function add() {
    	

    }

}