function onRet(str) {
    var obj = JSON.parse(str);

    if (obj.hasOwnProperty('htmlinfo')) {
        $('#htmlinfo').val(obj.htmlinfo);
        
        return ;
    }
}

function crawl_url() {
    var url = $("#inputurl").val();

    $.post('/ctrl/', {url: url}, function (data, status) {
        onRet(data);
    });
}