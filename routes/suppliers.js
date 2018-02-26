const router = require('express').Router();
const models = require('../models');

router.get('/', (req, res) => {
  let page = req.query.page || 1;
  let offset = 0;
  if (page > 1) {
     offset = ((page - 1) * 10)  + 1;
  }
  models.Supplier.findAndCountAll({
    limit : 10,
    offset: offset,
    order : [['id','DESC']],
  }).then((suppliers) => {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus};
    const totalPage = Math.ceil(suppliers.count / 10);
    const pagination = {totalPage : totalPage, currentPage: page};
    res.render('suppliers/index',{
      suppliers: suppliers.rows,
      alert: alert,
      pagination: pagination
    });
  });
});

router.get('/create', (req, res) => {
  const alertMessage = req.flash('alertMessage');
  const alertStatus = req.flash('alertStatus');
  const alert = { message: alertMessage, status: alertStatus};
  let data = {
    name: req.flash('name'),
    kota: req.flash('kota'),
  };
  res.render('suppliers/create',{
    alert: alert,
    data: data
  });
});
router.post('/create', (req, res) => {
  models.Supplier.build(req.body).save().then(() => {
    req.flash('alertMessage','Success Add New Supplier');
    req.flash('alertStatus', 'success');
    res.redirect('/suppliers');
  }).catch((err) => {
    req.flash('alertMessage', err.message);
    req.flash('alertStatus', 'danger');
    req.flash('name',req.body.name);
    req.flash('kota',req.body.kota);
    res.redirect('/suppliers/create');

  });

});
module.exports = router;
