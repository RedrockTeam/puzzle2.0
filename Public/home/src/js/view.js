var rankImgPath = 'Public/home/build/images/rank/';
var clockImgPath = 'Public/home/build/images/clock/';
var sliderImgPath = 'Public/home/build/images/slider/';



// 计时器
var clock = (function() {
    // 计时器
    var timer, tempClockHand;
    // 游戏计时器指针
    var clockHand = {
        theUnit: 0, // 个位
        decade: 0, // 十位
        hundreds: 0, // 百位
        kilobit: 0 // 千位
    };

    // 游戏计时器
    var timeCounterStart = function() {
        _timeCounterShow();
        timer = setInterval(function() {
            if (clockHand.theUnit === 9) {
                // 个位置零
                clockHand.theUnit = 0;
                _timerCounterImgChange(0);
                if (clockHand.decade === 5) {
                    // 十位置零
                    clockHand.decade = 0;
                    _timerCounterImgChange(1);
                    if (clockHand.hundreds === 9) {
                        // 百位置零
                        clockHand.hundreds = 0;
                        _timerCounterImgChange(3);
                        if (clockHand.kilobit === 5) {
                            _timerCounterImgChange(4, 6);
                            timeCounterStop(true);
                        } else {
                            _timerCounterImgChange(4, ++clockHand.kilobit);
                        }
                    } else {
                        _timerCounterImgChange(3, ++clockHand.hundreds);
                    }
                } else {
                    _timerCounterImgChange(1, ++clockHand.decade);
                }
            } else {
                _timerCounterImgChange(0, ++clockHand.theUnit);
            }
        }, 1001);
    };

    var timeCounterStop = function(beyondMaxTime) {
        clearInterval(timer);
        timer = undefined;
        tempClockHand = clockHand;
        clockHand = {
            theUnit: 0, // 个位
            decade: 0, // 十位
            hundreds: 0, // 百位
            kilobit: 0 // 千位
        };
        if (beyondMaxTime) {
            location.reload();
        }
        return tempClockHand;
    };

    // 显示计时器
    var _timeCounterShow = function() {
        $.each($('.time-counter-container img'), function(index, item) {
            if (index != 2) {
                $(item).attr('src', clockImgPath + '0.png');
            }
        });
    };

    // 改变计时器的图片
    var _timerCounterImgChange = function(index, number) {
        !number ? number = 0 : number = number;
        $('.time-counter-container img').eq(index).attr({
            src: clockImgPath + number + '.png'
        });
    };

    return {
        start: timeCounterStart,
        stop: timeCounterStop
    };
})();

// 工具函数
var util = (function() {

    // 得到排名信息
    var getRankInfo = function(url, data, success) {
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            dataType: 'json',
            success: success,
            error: function(xhr, type) {
                alert('网络错误, 请重试!!');
            }
        });
    };

    var getSpendTimeInfo = function(spendTime, reverse) {
        var totalSecond = (spendTime.kilobit * 10 + spendTime.hundreds) * 60 + spendTime.decade * 10 + spendTime.theUnit;
        if (reverse) {
            // 字符串倒序
            return String(totalSecond).split("").reverse().join("");
        }
        return totalSecond;
    }

    // 设置cookie
    var setCookie = function(name, value) {
        document.cookie = name + "=" + escape(value);
    };

    // 获取cookie
    var getCookie = function(name) {
        if (document.cookie.length > 0) {
            start = document.cookie.indexOf(name + "=");
            if (start != -1) {
                start = start + name.length + 1;
                end = document.cookie.indexOf(";", start);
                if (end == -1) {
                    end = document.cookie.length;
                }
                return unescape(document.cookie.substring(start, end));
            }
            return undefined;
        }
    };

    var delCookie = function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    };

    return {
        setCookie: setCookie,
        getCookie: getCookie,
        delCookie: delCookie,
        getRankInfo: getRankInfo,
        getSpendTimeInfo: getSpendTimeInfo
    };
})();


/**
 * 输入电话的 view
 * 冯秋明 加于2016 08 02
 */
var phoneView = Backbone.View.extend({
    el: 'body',
    template: _.template($('#T_phone').html()),
    initialize: function() {
        this.$el.off();
        var that = this;
        this.isInputedPhone(function() {
            that.goToIndexView();
        }, function() {
            that.$el.html(that.template());
        });
    },
    events: {
        'submit #phone-form': 'submitForm',
    },
    submitForm: function(e) {
        var inputTel = $('#phone-input').val();

        if(this.verifyForm(inputTel)) {
            this.goToIndexView();
        } else {
            alert('请填写正确的手机号码哦~~');
            return false;
        };
    },
    goToIndexView: function() {
        router.navigate('/index', {
            trigger: true
        });
    },
    // 判断是否已经输入过手机号码, 是: cb1(), 否: cb2();
    isInputedPhone: function(cb1, cb2) {
        $.ajax({
            url: 'index.php?s=/Home/Index/searchPhone',
            type: 'POST',
            data: {
                openid: $('html').attr('data-openid')
            },
            success: function(data, status) {
                if(data.status === 200) {
                    cb1();
                } else if(data.status === 404) {
                    cb2();
                }
            },
        });
    },
    // 表单验证
    verifyForm: function(inputInfo) {
        var isAllNum = !/\D+/.test(inputInfo);     // 全部数字
        var isLength = inputInfo.length === 11;   // 长度要求是11

        return isAllNum && isLength;
    }
});
// end


<!-- 首页 -->
var indexView = Backbone.View.extend({
    el: 'body',
    template: _.template($('#T_index').html()),
    initialize: function() {
        this.$el.off();
        this.$el.html(this.template());
    },
    events: {
        'click .personal-btn': 'goToPersonalView', // 发表评论
        'click .choose-btn': 'goToChooseView' // 发表评论
    },
    goToPersonalView: function() {
        router.navigate('/personal', {
            trigger: true
        });
    },
    goToChooseView: function() {
        router.navigate('/choose', {
            trigger: true
        });
    }
});

<!-- 关卡选择页面 -->
var chooseView = Backbone.View.extend({
    el: 'body',
    template: _.template($('#T_choose').html()),
    initialize: function() {
        this.$el.off();
        this.currentMapindex = 2;
        var mapData = [{
            index: 1,
            class: 'left'
        }, {
            index: 2,
            class: 'middle'
        }, {
            index: 3,
            class: 'right'
        }];
        // }, {
        //     index: 'null',
        //     class: 'right'
        // }];
        this.$el.html(this.template({
            mapData: mapData
        }));
    },
    currentMapindex: '',
    events: {
        'click .back-btn': 'goToIndexView', // 返回首页
        'click .start-btn': 'startGame',
        'click .next-map': 'nextMap',
        'click .prev-map': 'prevMap'
    },
    goToIndexView: function() {
        $(this.el).undelegate('.next-map', 'click');
        $(this.el).undelegate('.prev-map', 'click');
        router.navigate('/', {
            trigger: true
        });
    },
    nextMap: function(evt) {
        if (this.currentMapindex == 1) {
            this.currentMapindex = 3;
        } else {
            this.currentMapindex--;
        }
        var $maps = $('.thumb-maps img');
        var firstSrc = $($maps[0]).attr('src');
        var middleSrc = $($maps[1]).attr('src');
        var lastSrc = $($maps[2]).attr('src');
        $($maps[0]).attr('src', lastSrc);
        $($maps[1]).attr('src', firstSrc);
        $($maps[2]).attr('src', middleSrc);
    },
    prevMap: function() {
        if (this.currentMapindex == 3) {
            this.currentMapindex = 1;
        } else {
            this.currentMapindex++;
        }
        var $maps = $('.thumb-maps img');
        var firstSrc = $($maps[0]).attr('src');
        var middleSrc = $($maps[1]).attr('src');
        var lastSrc = $($maps[2]).attr('src');
        $($maps[0]).attr('src', middleSrc);
        $($maps[1]).attr('src', lastSrc);
        $($maps[2]).attr('src', firstSrc);
    },
    startGame: function() {
        if (this.currentMapindex != 3) {
            $(this.el).undelegate('.next-map', 'click');
            $(this.el).undelegate('.prev-map', 'click');
            router.navigate('/game/' + this.currentMapindex, {
                trigger: true
            });
        }
    }
});

<!-- 个人中心页面 -->
var personalView = Backbone.View.extend({
    el: 'body',
    template: _.template($('#T_personal').html()),
    initialize: function() {
        this.$el.off();
        this.render();
    },
    render: function() {
        var self = this;
        $.ajax({
            url: 'index.php?s=/Home/Index/personal',
            type: 'POST',
            data: {
                openid: $('html').attr('data-openid')
            },
            dataType: 'json',
            success: function(res) {
                if (res.status === 200) {
                    self.$el.html(self.template({
                        face: res.data.face,
                        datas: res.data.list
                    }));
                    // hack
                    // 我也不知道为啥要写这段代码
                    // 反正不写样式会蹦
                    // 来不及了,先上车
                }
            },
            error: function(xhr, type) {
                alert('网络错误, 请重试!');
            }
        });

    },
    events: {
        'click .back-btn': 'goToIndexView', // 发表评论
        'click .choose-btn': 'goToChooseView' // 发表评论
    },
    goToIndexView: function() {
        router.navigate('/', {
            trigger: true
        });
    },
    goToChooseView: function() {
        router.navigate('/choose', {
            trigger: true
        });
    }
});

<!-- 游戏页 -->
var gameView = Backbone.View.extend({
    el: 'body',
    template: _.template($('#T_game').html()),
    initialize: function(mapIndex) {
        this.$el.off();
        this._initGame(mapIndex);
    },
    events: {
        'click .back-btn': 'goToChooseView',
        'click .refresh-container': 'rePlay',
        'click .view-origin-map-btn-contianer': 'viewOriginMap',
        'click .origin-map-close-btn-container': 'closeOriginMap',
        'click .goToChooseView': '_stop'
    },
    _initData: {
        mapIndex: '',
        prevIndex: undefined,
        tempValue: undefined,
        spendTime: '',
        trueCount: 0,
        randomArray: []
    },
    _initGame: function(mapIndex, refresh) {
        // 渲染当前页面模板
        this.$el.html(this.template());
        // 缓存下当前游戏索引
        // 刷新游戏时使用
        this._initData.mapIndex = mapIndex;
        // 先清空数据
        this._destroyGame(refresh);
        // 修正滑块容器位置
        this._sliderContainerFix();
        // 随机分布滑块 
        this._sliderRandomSort(mapIndex);
        // 计时器开始计时
        clock.start();
    },
    // 回收数据
    _destroyGame: function(refresh) {
        var self = this;
        $.each($('.one-pic'), function(index, element) {
            $(element).removeClass('selectedSlider').removeClass('unselectSlider');
            // 先解绑所有事件
            $(element).off('click');
            // 再绑定事件
            $(element).on('click', function(event) {
                self.play(event);
            });
        });
        // 数据回收
        this._initData.randomArray = [];
        this._initData.prevIndex = undefined;
        return clock.stop();
    },
    play: function(event) {
        this._sliderSelect(event.currentTarget);
        var nextIndex = $(event.currentTarget).find('img').data('index');
        if (this._initData.prevIndex == undefined || this._initData.prevIndex == nextIndex) {
            this._prevIndexChange(nextIndex, this._initData.prevIndex == nextIndex);
        } else {
            // 如果游戏结束,调用stop方法
            if (this._sliderExchange(this._initData.prevIndex, nextIndex)) {
                this._stop();
            } else {
                this._initData.prevIndex = undefined;
            }
        }
    },
    goToChooseView: function() {
        $(this.el).undelegate('.one-pic', 'click');
        router.navigate('/choose', {
            trigger: true
        });
    },
    rePlay: function(event) {
        this._initGame(this._initData.mapIndex, true);
    },
    // 结束游戏
    _stop: function() {
        // 滑块解绑click事件
        // backbone内部不会自动解绑事件
        // 并且写在events里的事件
        // 不能通过zepto/jquery中的off来解绑
        // 源码里面找的 详见1171行
        $(this.el).undelegate('.one-pic', 'click');
        var mapIndex = this._initData.mapIndex;
        var spendTime = util.getSpendTimeInfo(clock.stop());
        if (spendTime != 0) {
            util.getRankInfo('index.php?s=/Home/Index/getRank', {
                mapIndex: mapIndex,
                spendTime: spendTime,
                openid: $('html').attr('data-openid')
            }, function(res) {
                var data = res.data;
                if (res.status === 200) {
                    // 显示结果页面
                    router.navigate('/result/' + mapIndex + '/' + spendTime + '/' + data.rank, {
                        trigger: true
                    });
                } else {
                    console.log(res);
                }
            });
        }
        // var spendTime = util.getSpendTimeInfo(this._destroyGame());
        // 发起Ajax请求获得排名信息
    },
    viewOriginMap: function() {
        $('.origin-map').css('display', 'block');
        $('.origin-map').css('background-image', 'url(Public/home/build/images/origin/' + this._initData.mapIndex + '.png)');
    },
    closeOriginMap: function() {
        $('.origin-map').css('display', 'none');
    },
    _prevIndexChange: function(nextIndex, isSelf) {
        if (isSelf) {
            // 如果两次点击了一个滑块则重置索引
            this._initData.prevIndex = undefined;
        } else {
            this._initData.prevIndex = nextIndex;
        }
    },
    _sliderExchange: function(prevIndex, thisIndex) {

        var mapIndex = this._initData.mapIndex;

        $('.one-pic').eq(thisIndex).find('img').attr({
            src: sliderImgPath + mapIndex + '/' + this._initData.randomArray[prevIndex] + '.png'
        }).parent().removeClass('selectedSlider').addClass('unselectSlider');

        $('.one-pic').eq(prevIndex).find('img').attr({
            src: sliderImgPath + mapIndex + '/' + this._initData.randomArray[thisIndex] + '.png'
        }).parent().addClass('unselectSlider').removeClass('selectedSlider');

        // 交换两个滑块在数组中的值
        tempValue = this._initData.randomArray[prevIndex];
        this._initData.randomArray[prevIndex] = this._initData.randomArray[thisIndex];
        this._initData.randomArray[thisIndex] = tempValue;
        tempValue = undefined;


        if (this._gameOverCheck(this._initData.randomArray)) {
            // 游戏结束
            return true;
        } else {
            // 游戏继续
            return false;
        }
    },
    // 随机位置生成
    _randomGenerate: function() {
        var random = Math.floor(Math.random() * 12 + 1);
        if ($.inArray(random, this._initData.randomArray) == -1) {
            this._initData.randomArray.push(random);
            return random;
        } else {
            return this._randomGenerate();
        }
    },
    _sliderSelect: function(that) {
        $(that).removeClass('unselectSlider');
        if ($(that).hasClass('selectedSlider')) {
            $(that).addClass('unselectSlider').removeClass('selectedSlider');
            setTimeout(function() {
                $(that).removeClass('unselectSlider');
            }, 50)
        } else {
            $(that).addClass('selectedSlider');
        }
    },
    _sliderRandomSort: function(mapIndex) {
        var self = this;
        $('.one-pic').css({
            float: 'left',
            height: ($('.pic-container').height()) / 4,
            width: ($('.pic-container').width() - 1) / 3
        });

        $.each($('#game .one-pic'), function(index, item) {
            $(item).find('img').attr({
                src: sliderImgPath + mapIndex + '/' + self._randomGenerate() + '.png'
            }).data('index', index);
        });
    },
    _sliderContainerFix: function() {
        // 滑块容器的百分比定位
        var position = {
            top: 80 / 1136,
            bottom: 79 / 1136,
            left: 136 / 640,
            right: 63 / 640
        };
        $('.pic-container').css({
            height: ((1 - position.top - position.bottom) * 100) + '%',
            width: ((1 - position.left - position.right) * 100) + '%',
            position: 'absolute',
            top: position.top * 100 + '%',
            left: position.left * 100 + '%'
        });
    },

    _gameOverCheck: function(randomArray) {
        this._initData.trueCount = 0;
        for (var i = 0; i <= randomArray.length - 1; i++) {
            if (randomArray[i] - i != 1) {
                this._initData.trueCount++;
                break;
            }
        }
        if (this._initData.trueCount > 0) {
            // 游戏继续
            return false;
        } else {
            // 游戏结束
            return true;
        }
    }

});

<!-- 结果页面 -->
var resultView = Backbone.View.extend({
    el: 'body',
    mapIndex: '',
    template: _.template($('#T_result').html()),
    initialize: function(mapIndex, time, rank) {
        this.$el.off();
        this.mapIndex = mapIndex;
        this.$el.html(this.template());
        this._rankInfoShow(rank);
        this._spendTimeShow(time);
    },
    events: {
        'click .replay-btn': 'rePlayGame', // 发表评论
        'click .choose-btn': 'goToChooseView' // 发表评论
    },
    rePlayGame: function() {
        router.navigate('/game/' + this.mapIndex, {
            trigger: true
        });
    },
    // 结果页面排名显示
    _rankInfoShow: function(rankInfo) {
        rankInfo = String(rankInfo).split("").reverse().join("");
        for (var i = rankInfo.length - 1; i >= 0; i--) {
            $('.rank-info img').eq(i).attr('src', rankImgPath + rankInfo[i] + '.png').css('display', 'block');
        }
    },

    // 结果页面耗时显示
    _spendTimeShow: function(spendTime) {
        var spendTimeImg = $('.spend-time img');
        for (var i = 0; i <= spendTime.length - 1; i++) {
            spendTimeImg.eq(i).attr('src', rankImgPath + spendTime[i] + '.png').css('display', 'block');
        }
    }
});