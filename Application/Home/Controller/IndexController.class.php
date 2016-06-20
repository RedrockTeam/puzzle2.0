<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {

    private $time;
    private $code;
    private $openid;
    private $string;
    private $secret;
    private $jsapi_ticket;

    public function index(){

        $this->code = I('get.code'); 
        if ($this->code != null || $this->code != ''){ 
            $this->code = I('get.code');
            $this->info();
            $this->getOpenid();
            if (!$this->openid) {
                $this->error('没有openid','http://hongyan.cqupt.edu.cn/puzzle');
            }
            //$this->getVerify();
            $this->getTicket();
            $this->getName();
            $this->getStuid();
            $signature = $this->JSSDKSignature();
            $this->assign('openid', $this->openid);
            $this->assign('signature', $signature);
        }else{
            $qs = $_SERVER['QUERY_STRING'] ? '?'.$_SERVER['QUERY_STRING'] : $_SERVER['QUERY_STRING'];
            $baseUrl = urlencode('http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'].$qs);
            Header("Location: https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx81a4a4b77ec98ff4&redirect_uri=". $baseUrl ."&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect "); 
        }
        
        $this->display();
    }

    public function getRank() {

        $Game = M('game');

        $openid = '111';
        $mapId = I('post.mapIndex');
        $spendTime = I('post.spendTime');

        $microtime = explode(" ", microtime());
        $spendTime += substr($microtime[0], 0, 8);

        $gameInfo = $Game->where(array(
            'map_id' => $mapId,
            'openid' => $openid
        ))->find();

        $rankMap['spend_time'] = array('LT', $spendTime);
        $rankMap['map_id'] = $mapId;
        $thisRank = $Game->where($rankMap)->count() + 1;

        // 如果不是第一次玩这张地图
        if ($gameInfo) {
            if ($spendTime < $gameInfo['spend_time']) {
                $Game->where($map)->setField('spend_time', $spendTime);
            }
        } else {
            $gameId = $Game->add(array(
                'map_id' => $mapId,
                'openid' => $openid,
                'spend_time' => $spendTime
            ));
        }
    	$this->ajaxReturn(array(
    		"status" => 200,
    		"info" => 'ok',
    		"data" => array(
                'rank' => (string)$thisRank
            )
    	));


    }


    //jssdk-config
    public function JSSDKSignature(){
        $string = $this->string;
        $data['jsapi_ticket'] = $this->jsapi_ticket;
        $data['noncestr'] = $this->string;
        $data['timestamp'] = $this->time;
        $data['url'] = 'http://'.$_SERVER['HTTP_HOST'].__SELF__;//生成当前页面url
        $data['signature'] = sha1($this->ToUrlParams($data));
        return $data;
    }
    private function ToUrlParams($urlObj){
        $buff = "";
        foreach ($urlObj as $k => $v) {
            if($k != "signature") {
                $buff .= $k . "=" . $v . "&";
            }
        }
        $buff = trim($buff, "&");
        return $buff;
    }
    //时间戳；签名；随机数
    private function info()
    {
        $this->time = time();
        $str = 'abcdefghijklnmopqrstwvuxyz1234567890ABCDEFGHIJKLNMOPQRSTWVUXYZ';
        $this->string='';
        for($i = 0; $i < 16; $i++){
            $num = mt_rand(0,61);
            $this->string .= $str[$num];
        }
        $this->secret =sha1(sha1($this->time).md5($this->string)."redrock");
    }
    //判断关注
    private function getVerify(){
        $t = array(
            'string' => $this->string,
            'token' => 'gh_68f0a1ffc303',
            'timestamp' => $this->time,
            'secret' => $this->secret,
            'openid' => $this->openid,
        );
        $url = "http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/openidVerify";
        $result = $this->curl_api($url, $t);
        if ($result->info == 'subscribe') {
            session('verify', $result->info);
        }else{
            $this->error('没有关注小帮手');
        }
    }
    //获取学号
    private function getStuid(){
        $t = array(
            'string' => $this->string,
            'token' => 'gh_68f0a1ffc303',
            'timestamp' => $this->time,
            'secret' => $this->secret,
            'openid' => $this->openid,
        );
        $url = "http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/bindVerify";
        $result = $this->curl_api($url, $t);
        if ($result->stuId) {
            session('stuId', $result->stuId);
        }else{
            $this->error('没有绑定小帮手');
        }
    }
    //username获取
    private function getName(){
        $t = array(
            'string' => $this->string,
            'token' => 'gh_68f0a1ffc303',
            'timestamp' => $this->time,
            'secret' => $this->secret,
            'openid' => $this->openid,
        );
        $url = "http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/userInfo";
        $result = $this->curl_api($url, $t);
        session('username', $result->data->nickname);
    }
    private function getTicket(){
        $t = array(
        'string' => $this->string,
        'token' => 'gh_68f0a1ffc303',
        'timestamp' => $this->time,
        'secret' => $this->secret,
        'openid' => $this->openid,
        );
        $url = "http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/apiJsTicket";
        $result = $this->curl_api($url, $t);
        $this->jsapi_ticket = $result->data;
    }

    private function getOpenid(){
        $t = array(
            'string' => $this->string,
            'token' => 'gh_68f0a1ffc303',
            'timestamp' => $this->time,
            'secret' => $this->secret,
            'code' => $this->code,
        );
        $url = "http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/webOAuth";
        $result = $this->curl_api($url, $t);
        $this->openid = $result->data->openid;
    }

    /*curl通用函数*/
    private function curl_api($url, $data=''){
        // 初始化一个curl对象
        $ch = curl_init();
        curl_setopt ( $ch, CURLOPT_URL, $url );
        curl_setopt ( $ch, CURLOPT_POST, 1 );
        curl_setopt ( $ch, CURLOPT_HEADER, 0 );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt ( $ch, CURLOPT_POSTFIELDS, $data );
        // 运行curl，获取网页。
        $contents = json_decode(curl_exec($ch));
        // 关闭请求
        curl_close($ch);
        return $contents;
    }


    public function personal() {

        $openid = '111';


    }

}