const Router = require('koa-router');
const jwtMiddleware = require('../../middlewares/JwtMiddleware');
const auth = require('../../controller/AuthController');
const router = new Router({prefix: '/auth'});

router.get('/login', function *() {
  yield this.render('login');
});
router.get('/register', function *() {
  yield this.render('signup');
});
router.get('/rename', function *() {
  yield this.render('rename');
});

router.post('/register',auth.register);
router.post('/login',auth.login);
router.post('/logout',auth.logout);
router.put('/rename',auth.rename);

module.exports = router;