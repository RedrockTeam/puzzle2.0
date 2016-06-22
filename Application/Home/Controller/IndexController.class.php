<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {

    private $time;
    private $code;
    private $stuId;
    private $openid;
    private $string;
    private $secret;
    private $jsapi_ticket;

    public function index(){

        $this->code = I('get.code'); 
        if ($this->code != null || $this->code != ''){
            $this->code = I('get.code');
            $this->info();
            $openid = $this->getOpenid();
            if (!$openid) {
                $this->error('没有openid','http://hongyan.cqupt.edu.cn/puzzle2');
            }
            $this->getTicket();
            $signature = $this->JSSDKSignature();
            $this->assign('openid', $openid);
            $this->assign('signature', $signature);
        }else{
            $qs = $_SERVER['QUERY_STRING'] ? '?'.$_SERVER['QUERY_STRING'] : $_SERVER['QUERY_STRING'];
            $baseUrl = urlencode('http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'].$qs);
            Header("Location: https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx81a4a4b77ec98ff4&redirect_uri=". $baseUrl ."&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect "); 
        }
        
        $this->display();
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
    private function info() {
        $this->time = time();
        $str = 'abcdefghijklnmopqrstwvuxyz1234567890ABCDEFGHIJKLNMOPQRSTWVUXYZ';
        $this->string = '';
        for ($i = 0; $i < 16; $i++) {
            $num = mt_rand(0,61);
            $this->string .= $str[$num];
        }
        $this->secret = sha1(sha1($this->time).md5($this->string)."redrock");
    }


    //判断关注
    private function getVerify(){
        $t = array(
            'string' => $this->string,
            'token' => 'gh_68f0a1ffc303',
            'timestamp' => $this->time,
            'secret' => $this->secret,
            'openid' => $this->getOpenid(),
        );
        $url = "http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/openidVerify";
        $result = $this->curl_api($url, $t);
        if ($result->info == 'subscribe') {
            session('verify', $result->info);
        }else{
            $this->error('没有关注小帮手');
        }
    }


    private function getTicket(){
        $t = array(
            'string' => $this->string,
            'token' => 'gh_68f0a1ffc303',
            'timestamp' => $this->time,
            'secret' => $this->secret,
            'openid' => $this->getOpenid(),
        );
        $url = "http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/apiJsTicket";
        $result = $this->curl_api($url, $t);
        $this->jsapi_ticket = $result->data;
    }

    //获取学号
    private function getUserInfo($openid){
        $time = time();
        $str = 'abcdefghijklnmopqrstwvuxyz1234567890ABCDEFGHIJKLNMOPQRSTWVUXYZ';
        $string = '';
        for ($i = 0; $i < 16; $i++) {
            $num = mt_rand(0, 61);
            $string .= $str[$num];
        }
        $secret = sha1(sha1($time).md5($string)."redrock");

        $verify = array(
            'string' => $string,
            'token' => 'gh_68f0a1ffc303',
            'timestamp' => $time,
            'secret' => $secret,
            'openid' => $openid,
        );
        $stuIdUrl = "http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/bindVerify";
        $userInfoUrl = "http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/userInfo";
        $userInfo = $this->curl_api($userInfoUrl, $verify);
        $stuInfo = $this->curl_api($stuIdUrl, $verify);

        if ($stuInfo['stuId']) {
            $userInfo['stuId'] = $stuInfo['stuId'];
        }

        if ($userInfo) {
            return $userInfo;
        } else {
            $this->error('你还有没有绑定重邮小帮手');
        }
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
        return  $result->data->openid;
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



    private function _arraySort ($array, $key, $order = "asc"){ //asc是升序 desc是降序
        $arr_nums = $arr = array();
        foreach($array as $k => $v){
            $arr_nums[$k] = $v[$key];
        }
        if ($order == 'asc'){
            asort($arr_nums);
        }else{
            arsort($arr_nums);
        }
        foreach($arr_nums as $k => $v){
            $arr[$k]=$array[$k];
        }
        return $arr;
    }

     public function getRank() {

        $Score = M('score');

        $openid = I('post.openid');
        $mapId = I('post.mapIndex');
        $spendTime = I('post.spendTime');
        $userInfo = $this->getUserInfo($openid);

        $microtime = explode(" ", microtime());
        $spendTime += substr($microtime[0], 0, 8);

        $gameInfo = $Score->where(array(
            'map_id' => $mapId,
            'openid' => $openid
        ))->find();

        if ($Score->where("map_id = '$mapId'")->find()) {
            $rankMap['spend_time'] = array('LT', $spendTime);
            $rankMap['map_id'] = $mapId;
            $thisRank = $Score->where($rankMap)->count() + 1;
        } else {
            $thisRank = 1;
        }

        // 如果不是第一次玩这张地图
        if ($gameInfo) {
            if ($spendTime < $gameInfo['spend_time']) {
                $Score->where(array(
                    'map_id' => $mapId,
                    'openid' => $openid
                ))->setField('spend_time', $spendTime);
            }
        } else {
            $gameId = $Score->add(array(
                'map_id' => $mapId,
                'openid' => $openid,
                'play_time' => time(),
                'username' => $userInfo['nickname'],
                'stuId' => $userInfo['stuId'],
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


    public function personal() {

        $openid = I('post.openid');

        $data = M('score')->where("openid = '$openid'")->select();

        foreach ($data as $index => $value) {
            unset($data[$index]['id']);
            unset($data[$index]['stuId']);
            unset($data[$index]['openid']);
            unset($data[$index]['username']);
            unset($data[$index]['play_time']);
            $data[$index]['time'] = implode(array_reverse(str_split((string)floor($data[$index]['spend_time']), 1)));
            $data[$index]['index'] = floor($data[$index]['map_id']);
            unset($data[$index]['spend_time']);
            unset($data[$index]['map_id']);
        }

        $userInfo = $this->getUserInfo($openid);

        $this->ajaxReturn(array(
            "status" => 200,
            "info" => 'ok',
            "data" => array(
                'list' => $data,
                'openid' => $openid,
                'face' => $userInfo['headimgurl']
            )
        ));

    }

}