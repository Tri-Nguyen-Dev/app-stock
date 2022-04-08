module.exports = function(req, res) {
    const headers = res.getHeaders();
    const totalCount = headers['x-total-count'];
    if(req.originalMethod === 'GET' && totalCount) {
        const result = {
            data: {
                items: res.locals.data,
                total: Number.parseInt(totalCount)
            }
        };
        return res.jsonp(result);
    }
    res.jsonp(res.locals.data);
};
