<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
        $this->display();
    }

    public function getRank() {

    	$this->ajaxReturn(array(
    		"status" => 200,
    		"info" => 'ok',
    		"data" => array(
                'rank' => '335'
            )
    	));

    }

    public function personal() {

        
        

    }

}