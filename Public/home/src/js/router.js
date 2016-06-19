var Router = Backbone.Router.extend({
    initialize: function() {
        console.log("Route initialize");
    },
    routes: {
        '': 'index',
        'choose': 'choose',
        'result/:index/:time/:rank': 'result',
        'game/:id': 'game',
        'personal': 'personal',
    }
});

var router = new Router();

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