<?php
namespace Admin\Controller;
use Think\Controller;
class IndexController extends Controller {

    public function index() {

        if (!session('username')) {
            $this->redirect('Index/login');
        } else {
            $this->redirect('Game/index');
        }
    }


    public function login() {
    	if (IS_GET) {
    		layout(false);
    		$this->display();
    	} else {
    		$password = I('post.password');
    		$map['username'] = I('post.username');
    		$map['password'] = md5(sha1($password));
    		$userInfo = M('admin')->where($map)->find();
    		if ($userInfo) {
    			session('username', $userInfo['username']);
    			$this->redirect('Game/index');
    		} else {
    			$this->error('用户名或密码错误', 'login', 1);
    		}
    	}
    }

    public function logout() {
    	session('username', null);
    	$this->redirect('Index/login');
    }
    
    
}