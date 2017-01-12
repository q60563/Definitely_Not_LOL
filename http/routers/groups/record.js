var Router = require('koa-router');
var record = require('../../controller/RecordController');
var router = new Router({prefix: '/record'});

router.get('/', function *() {
  yield this.render('record');
});

router.get('/search',record.search);
router.delete('/delete',record.delete);
router.post('/insert',record.insert);

module.exports = router;