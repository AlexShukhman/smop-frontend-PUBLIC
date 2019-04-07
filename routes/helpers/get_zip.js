var get_zip = function (req, res, hostname, port, http, fs) {
    var ssn = req.cookies.ssn;
    if (!ssn) res.redirect('/');
    var options = {
        "method": "GET",
        "hostname": hostname,
        "port": port,
        "path": "/api/get_zip",
        "headers": {
            "x-access-token": ssn.token,
            "x-access-name": ssn.name,
            "path": req.query['path']
        }
    }
    var reqInner = http.request(options, (result) => {
        var pipe = result.pipe(res);
        pipe.on('finish', () => {
            res.end();
        });
    });
    reqInner.end();
}
module.exports = get_zip;