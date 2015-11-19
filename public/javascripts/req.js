function onRet(str) {
    var obj = JSON.parse(str);

    if (obj.hasOwnProperty('err')) {
        $('#htmlinfo').val(obj.err);

        return ;
    }

    if (obj.hasOwnProperty('htmlinfo')) {
        $('#htmlinfo').val(obj.htmlinfo);
        
        return ;
    }
}

function crawl_url() {
    var url = $("#inputurl").val();

    $.post('/ctrl/crawl/', {url: url}, function (data, status) {
        onRet(data);
    });
}

function parser_code() {
    var code = $("#inputcode").val();

    $.post('/ctrl/parser/', {code: code}, function (data, status) {
        onRet(data);
    });
}