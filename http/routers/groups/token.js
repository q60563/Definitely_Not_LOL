var Router = require('koa-router');
var token = require('../../controller/TokenController');
var router = new Router({prefix: '/token'});

router.put('/refresh',token.update);

module.exports = router;