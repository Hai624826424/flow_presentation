
$(document).ready(function () {
    init();
});

function init() {
    intiTree();
    document.onkeydown = checkKey;
}

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        move('up')
    } else if (e.keyCode == '40') {
        // down arrow
        move('down')
    }
}

function move($direction) {
    if ($direction == 'up') {
        $item = $("#tree .item.selected").prev();
    } else if ($direction == 'down') {
        $item = $("#tree .item.selected").next();
    }
    if ($item.length == 0) {
        return;
    }
    selectItem($item);
}

function selectItem(item) {
    $("#tree .item").removeClass('selected');

    item.addClass('selected');
    fillContent(item);
}

function fillContent(item) {
    contentEle = $("#content_info");
    content = item.clone();
    content.children(".item_page_number").remove();
    content.children(".item_title").css('font-size', "1.5em");
    contentEle.html(content.html());
    callAjax(item.children(".item_path").html());
}

function callAjax(path) {
    $.ajax({
        url: "http://localhost:8000/source_file.php?file=" + path,
        beforeSend: function (xhr) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
    })
        .done(function (data) {
            contentEle = $("#content_code");
            contentEle.html(data);
        });
}

function intiTree() {
    readData();
}

function readData() {
    $.getJSON("data.json", function (data) {
        fillData(data);
    });
}

function fillData(data) {
    data.forEach(function (value, index, array) {
        template = $("#tree_item_template").clone();

        template.children(".item_title").html(value["item_title"]);
        template.children(".item_path").html(value["item_path"]);
        template.children(".item_function").html(value["item_function"]);
        template.children(".item_page_number").html(index + 1);

        template.click(function () {
            selectItem($(this));
        });
        template.removeAttr('id');

        template.appendTo($("#tree"));

    });

    $("#tree_item_template").remove();
    selectItem($($("#tree .item")[0]));
}
