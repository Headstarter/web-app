let setCache = function (req, res, next) {
    // here you can define period in second, this one is 23.5 hours
    const period = 84600;
  
    // you only want to cache for GET requests
    if (req.method == 'GET') {
      res.set('Cache-control', `public, max-age=${period}`);
    } else {
      // for the other requests set strict no caching parameters
      res.set('Cache-control', `no-store`);
    }
  
    // remember to call next() to pass on the request
    next()
}

module.exports = {
    setCache: setCache
};