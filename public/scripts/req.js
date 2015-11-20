let getReq = function(url, func, verb, params, content) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status === 200) {
                func(req);
            }
        }
    };
    req.open(verb, url);
    req.setRequestHeader("Content-Type", content);
    req.send(params);
};

export default getReq;
