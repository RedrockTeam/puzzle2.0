var Router = Backbone.Router.extend({
    initialize: function() {
        console.log("Route initialize");
    },
    routes: {
        '': 'phone',      // 加需求了,要求先填电话号码 冯秋明 20160802
        'index': 'index',  // 加需求了,要求先填电话号码 冯秋明 20160802
        'choose': 'choose',
        'result/:index/:time/:rank': 'result',
        'game/:id': 'game',
        'personal': 'personal',
    }
});

var router = new Router();

// 加需求了,要求先填电话号码 冯秋明 20160802
router.on('route:phone', function() {
    new phoneView();
})



router.on('route:index', function() {
    new indexView();
});

router.on('route:choose', function() {
    new chooseView()
});


router.on('route:game', function(id) {
    id && new gameView(id);
});


router.on('route:personal', function() {
    new personalView() && (function() {
        $('.user-face').css({
            position: 'absolute',
            top: (62 * ($(window).height() / 1136) / $(window).height() * 100) + '%',
            left: (22 * ($(window).width() / 640) / $(window).width() * 100) + '%'
        });
    })();
});

router.on('route:result', function(index, time, rank) {
    new resultView(index, time, rank);
});