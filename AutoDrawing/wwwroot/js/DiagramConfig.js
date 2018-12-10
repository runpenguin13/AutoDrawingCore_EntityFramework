$(window).on("load", function () {

    toastr.options = {
        "closeButton": true, "debug": false, "newestOnTop": false, "progressBar": true, "positionClass": "toast-top-center", "preventDuplicates": false, "onclick": null,
        "showDuration": "300", "hideDuration": "1000", "timeOut": "3000", "extendedTimeOut": "1000", "showEasing": "swing", "hideEasing": "linear", "showMethod": "fadeIn", "hideMethod": "fadeOut"
    };

    xmldoc = document.getElementById("diagram-element").getSVGDocument();

    if (xmldoc === null) {
        toastr.error("등록된 SVG file이 없습니다. 확인 바랍니다.");
        return true;
    }

    initialize();
    Embed_diagram(xmldoc);
    Register_toolbox_event();       // transform svg

    LoadDiagram();


    // #region [Event]
    $("#reload").click(function () {
        //var url = "@Url.Action("DiagramConfigGet", "DrawingOrders")" + "?DrawingId=" + obj.drawing.id + "&VisioId=" + obj.visio.id;
        $.getJSON(url, form_load) // equavalent below
            .done(function () {
                toastr.success("Succeed to refresh", "Diagram Config", { positionClass: "toast-bottom-right" });
            })
            .fail(function () {
                toastr.error("Failed to refresh", "Diagram Config", { positionClass: "toast-bottom-right" });
            });
    });
    $("#import").click(function (e) {
        //var url = "@Url.Action("DiagramConfigImport", "DrawingOrders")" + "?DrawingId=" + obj.drawing.id + "&VisioId=" + obj.visio.id;
        $.getJSON(url, form_load)
            .done(function () {
                toastr.success("Succeed to import", "Diagram Config", { positionClass: "toast-bottom-right" });
            })
            .fail(function () {
                toastr.error("Failed to import", "Diagram Config", { positionClass: "toast-bottom-right" });
            });
    });
    $("#update").click(function (e) {

        form_save();
        equipment.dwgEquipId = dwgEquipId;

        $.ajax({
            url: "/DrawingOrders/DiagramConfigSet",
            method: "POST",
            data: JSON.stringify(equipment),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function (response) {
                toastr.error("Failed to update", "Diagram Config", { positionClass: "toast-bottom-right" });
            },
            success: function (response) {
                toastr.success("Succeed to update", "Diagram Config", { positionClass: "toast-bottom-right" });
            }
        });
    });
    $("#export").click(function (e) {
        form_save();

        $.ajax({
            url: "@Url.Action(\"DiagramConfigExport\", \"DrawingOrders\")",
            type: "POST",
            data: JSON.stringify(equipment),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
            .done(function () {
                toastr.success("Succeed to export", "Diagram Config", { positionClass: "toast-bottom-right" });
            })
            .fail(function () {
                toastr.error("Failed to export", "Diagram Config", { positionClass: "toast-bottom-right" });
            });

    });

    $("#ShapeOverlay").on("click", function () {
        $("#ShapePopup").hide();
        $(this).hide();
    });
    $("#ShapePopup").draggit($("#ShapePopup"));
    // #endregion [Event]
});


function initialize() {

    // #region breadcrumb
    var menuBar = $("#MenuBar");
    var ol = menuBar.find("ol.breadcrumb");

    var li = $("<li>", { class: "breadcrumb-item" });
    ol.append(li);

    var a = $("<a>", { href: "/DrawingOrders/List", text: "Drawings" });
    li.append(a);


    li = $("<li>", { class: "breadcrumb-item" });
    ol.append(li);

    a = $("<a>", { href: "/drawings/orders/" + orderId + "/Edit", text: depth });
    li.append(a);


    li = $("<li>", { class: "breadcrumb-item active", text: model });
    ol.append(li);
    // #endregion breadcrumb


    
    var btnGroup = menuBar.find("div.btn-group");


    // component / diagram / view
    var detailGroup = $("<div>", { class: "btn-group mr-2" });
    btnGroup.before(detailGroup);

    var btnComponent = $("<a>", { class: "btn text-white", text: "Component", href: "/drawings/orders/" + orderId + "/equipments/" + dwgEquipId + "/Edit" });
    detailGroup.append(btnComponent);

    if (!isEmpty(wordmapId)) {
        var btnDiagram = $("<a>", { class: "btn text-white font-weight-bold", text: "Diagram", href: "/drawings/orders/" + orderId + "/equipments/" + dwgEquipId + "/diagram/" + wordmapId + "/row/0" });
        detailGroup.append(btnDiagram);
    } else {
        btnDiagram = $("<button>", { type: "button", class: "btn btn-light-green", text: "Diagram" });
        btnDiagram.css("cursor:not-allowed");
        btnDiagram.prop("disabled", true);

        detailGroup.append(btn);
    }

    var btnView = $("<a>", { class: "btn text-white", text: "View", href: "/drawings/orders/" + orderId + "/equipments/" + dwgEquipId + "/fileview" });
    detailGroup.append(btnView);


    // data group
    var dataGroup = $("<div>", { class: "btn-group mr-2" });
    detailGroup.before(dataGroup);

    var btn = $("<button>", { class: "btn btn-light", id: "reload", title: "Refresh", value: "새로고침" });
    dataGroup.append(btn);

    var i = $("<i>", { class: "fas fa-sync-alt", "aria-hidden": true });
    btn.append(i);

    btn = $("<button>", { class: "btn btn-light", id: "update", title: "Save to drawing", value: "저장하기" });
    dataGroup.append(btn);

    i = $("<i>", { class: "far fa-save", "aria-hidden": true });
    btn.append(i);

    btn = $("<button>", { class: "btn btn-light", id: "import", title: "Import from equipment", value: "가져오기" });
    dataGroup.append(btn);

    i = $("<i>", { class: "fa fa-download", "aria-hidden": true });
    btn.append(i);

    btn = $("<button>", { class: "btn btn-light", id: "export", title: "Export to equipment", value: "내보내기" });
    dataGroup.append(btn);

    i = $("<i>", { class: "fa fa-upload", "aria-hidden": true });
    btn.append(i);


    // svg group
    var svgGroup = $("<div>", { class: "btn-group mr-2" });
    dataGroup.before(svgGroup);

    btn = $("<button>", { class: "btn btn-light", id: "expand", "data-diagram-transform":"expand" });
    svgGroup.append(btn);

    i = $("<i>", { class: "fas fa-expand", "aria-hidden": true });
    btn.append(i);

    btn = $("<button>", { class: "btn btn-light", id: "rotate-left", "data-diagram-transform": "rotate(-90)" });
    svgGroup.append(btn);

    i = $("<i>", { class: "fas fa-undo-alt", "aria-hidden": true });
    btn.append(i);

    btn = $("<button>", { class: "btn btn-light", id: "rotate-right", "data-diagram-transform": "rotate(90)" });
    svgGroup.append(btn);

    i = $("<i>", { class: "fas fa-redo-alt", "aria-hidden": true });
    btn.append(i);


    // doc group
    var docGroup = $("<div>", { class: "btn-group mr-2" });
    svgGroup.before(docGroup);

    var select = $("<select>", { class: "form-control" });
    docGroup.append(select);

    $.each(items, function () {
        var opt = $("<option>", { value: this["Value"], text: this["Text"] });
        select.append(opt);
    });

    select.on("change", function () {
        window.location.href = $(this).val();
    });
}
function Embed_diagram(xmldoc) { // embed svg

    svgtag = xmldoc.documentElement;

    viewBox = svgtag.getAttribute("viewBox");
    svgtag.removeAttribute("viewBox");

    $(xmldoc).find("svg").attr("width", "100%");
    $(xmldoc).find("svg").attr("height", "100%");

    $(xmldoc).find("svg > g").attr("id", "viewport");

    extend(jQuery);

    $("#diagram-content").panzoom({
        svg: svgtag,
        viewBox: viewBox //viewBox: "0 0 0 0"	//viewBox: "0 0 461.198 807.885"
    }).removeClass("appear");
}
function Register_toolbox_event() {

    $("[data-diagram-transform]").on("click", function () {
        var transform = $(this).data("diagram-transform");

        if (transform === "expand") {
            $("#diagram-content").panzoom({
                svg: svgtag,//$("#drawing-element svg").get(0),
                viewBox: viewBox
            });
        }
        else {
            $("svg > g").attr("transform", $("svg > g").attr("transform") + " " + transform);
        }
    });
}

function LoadDiagram() {
    $.getJSON("/DrawingOrders/LoadDiagram", { dwgEquipId: dwgEquipId, wordmapId: wordmapId })
        .done(function (result) {

            var msg = result["Msg"];

            if (msg === "Success") {

                construct_form(result);
                $.getJSON(url, form_load);
            }
            else {
                alert(msg);

                if (msg === "Not Found Service Item")
                    $(location).attr("href", "/drawings/orders/" + data.drawingId + "/Edit");
            }
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            toastr.error("Load component", "Error", { positionClass: "toast-bottom-right" });
        });
}
function construct_form(result) { // append element

    var n = $("svg > g > layer"), //n = window.svgpublish || {},
        tb;


    // document click
    $("svg > g > g").on("click", function (e) {

        var g = $(e.currentTarget);
        var layerNo = g.attr("v:layerMember");

        // panel
        var targetCheckbox = $("#panel-layers input[type=\"checkbox\"]").filter(function () {
            return this.getAttribute("data-index") === String(layerNo);
        });

        var targetHeader = targetCheckbox.parent().parent().parent();


        var popup = $("#ShapePopup");
        var popupHeader = popup.find(".card-header");
        var popupBody = popup.find(".card-body");

        popupHeader.empty();
        popupBody.empty();

        // header
        var span = $("<span>", { text: targetHeader.children("span").text() });
        popupHeader.append(span);

        var divSwitch = $("<div>", { style: "display:inline-block;", class: "float-right" });
        popupHeader.append(divSwitch);

        var spanSwitch = $("<span>", { class: "switch" });
        divSwitch.append(spanSwitch);

        var cboxSwitch = $("<input>", {
            type: "checkbox",
            "data-index": targetCheckbox.attr("data-index"),
            class: "switch",
            id: "popupSwitch"
        });
        cboxSwitch.prop("checked", targetCheckbox.prop("checked"));
        spanSwitch.append(cboxSwitch);

        var labelSwitch = $("<label>", { "for": "popupSwitch", class: "ml-2" });
        spanSwitch.append(labelSwitch);

        cboxSwitch.on("change", function () {
            var index = $(this).attr("data-index");

            var targetLayer = $("#panel-layers input[type=\"checkbox\"]").filter(function () {
                return this.getAttribute("data-index") === String(layerNo);
            });
            targetLayer.prop("checked", $(this).prop("checked")).trigger("change");
        });

        // body
        var targetBody = targetHeader.siblings(".card-body");
        var tboxes = targetBody.children().clone(true).appendTo(popupBody);

        $.each(tboxes, function () {

            var tbox = $(this).find("input[type=\"text\"]");
            tbox.unbind("input");

            tbox.bind("input", function () {

                var layerName = $(this).attr("data-layer");
                var value = $(this).val();


                var layerNo = $("#ShapePopup").find("input[type=\"checkbox\"]").attr("data-index");

                var targetCheckbox = $("#panel-layers input[type=\"checkbox\"]").filter(function () {
                    return this.getAttribute("data-index") === String(layerNo);
                });

                var tboxes = targetCheckbox.parent().parent().parent().siblings().find("input[type=\"text\"]");
                var tbox = tboxes.filter(function () {
                    return this.getAttribute("data-layer") === String(layerName);
                });

                if (!isEmpty(tbox)) {
                    tbox.val(value);
                    tbox.trigger("input");
                }
            });
        });


        // open popup
        var x = e.clientX, y = e.clientY;
        popup.css("left", x);
        popup.css("top", y);
        popup.show();

        var overlay = $("#ShapeOverlay");
        overlay.show();
    });


    // 모든 Layer off
    $.each(n, function () {

        var index = $(this).attr("v:index");
        var layer = $(this).attr("v:name");

        var shapes = $("svg > g g").filter(function () {
            return this.getAttribute("v:layerMember") === String(index);
        });

        $.each(shapes, function () {
            var title = $(this).children("title");

            $(this).attr("v:shapeName", title.text());
            title.text("[" + layer + "] " + title.text());

            $(this).hide();
        });
    });


    // Layer 목록 만들기
    for (var i = 0; i < 3; i++) {

        var panel;

        if (i === 0)
            panel = $("#panel-interfaces");
        else if (i === 1)
            panel = $("#panel-components");
        else
            panel = $("#panel-properties");

        if (i === 0)
            construct_table(panel, result["Interface"]);
        else if (i === 1)
            construct_table(panel, result["Component"]);
        else
            construct_table(panel, result["Property"]);
    }
    $("td.collapse-column").click(function () {

        var fa = $(this).find("i");

        if ($(this).parent().next().attr("class") === "collapse") { // if collapsed
            fa.attr("class", "fas fa-caret-up");
            $(this).attr("rowspan", "2");
            $(this).parent().next().attr("class", "collapse show");
        }
        else if ($(this).parent().next().attr("class") === "collapse show") {
            fa.attr("class", "fas fa-caret-down");
            $(this).parent().find("td:first").removeAttr("rowspan");
            $(this).parent().next().attr("class", "collapse");
        }
    });
}
function construct_table(parent, collection) {

    $.each(collection, function (i, e) { // i:index, e:entity

        var u = $("svg > g > layer").filter(function () { return $(this).attr("v:name") === e["Layer"]; });
        var f = $("<span>", { class: "switch" });

        var input = $("<input>", {
            type: "checkbox",
            "data-layer": e["Layer"],
            "data-index": $(u).attr("v:index"),
            class: "switch",
            id: "switch" + $(u).attr("v:index"),
            "re-with": "",
            "re-reverse": "",
            "re-off": ""
        });

        var obj_relation = e["Relation"];

        if (!isEmpty(obj_relation)) {

            var reWith = input.attr("re-with");
            var reReverse = input.attr("re-reverse");
            var reOff = input.attr("re-off");

            $.each(obj_relation, function () {
                //var reLayerId = this["ReLayerId"];
                var reLayerValue = this["ReLayerValue"];
                var reLayerName = this["ReLayerName"];

                if (reLayerValue === "WITH")
                    input.attr("re-with", reWith + reLayerName);
                else if (reLayerValue === "REVERSE")
                    input.attr("re-reverse", reReverse + reLayerName);
                else if (reLayerValue === "OFF")
                    input.attr("re-off", reOff + reLayerName);
            });
        }
        f.append(input);

        var label = $("<label>", { "for": "switch" + $(u).attr("v:index") });
        f.append(label);

        // event listener
        input.on("change", function (t) {
            var r = $(t.target).data("index"); // r : layer index of svg at input element data-layer attribute value
            setShapeVisible(r, isLayerVisible(r));

            var reWith = $(this).attr("re-with");
            var reReverse = $(this).attr("re-reverse");
            var reOff = $(this).attr("re-off");

            if (!isEmpty(reWith)) {
                var arrWith = reWith.split(",");

                $.each(arrOff, function () {
                    var layerName = this;

                    var reLayer = $("input[data-layer=\"" + layerName + "\"]");
                    reLayer.prop("checked", $(t).prop("checked")).trigger("change");
                });
            }

            if (!isEmpty(reReverse)) {
                var arrReverse = reReverse.split(",");

                $.each(arrOff, function () {
                    var layerName = this;

                    var reLayer = $("input[data-layer=\"" + layerName + "\"]");
                    reLayer.prop("checked", !$(t).prop("checked")).trigger("change");
                });
            }

            if (!isEmpty(reOff)) {
                var arrOff = reOff.split(",");
                Relationlayer(arrOff, "off", t);
            }

            function Relationlayer(arr, fn, ctl) {

                $.each(arr, function () {
                    var layerName = this;
                    var reLayer = $("input[data-layer=\"" + layerName + "\"]");
                    var reIndex = reLayer.data("index");

                    if (fn === "with") {
                        reLayer.prop("checked", ctl.prop("checked"));
                        setShapeVisible(reIndex, ctl.prop("checked"));
                    }
                    else if (fn === "reverse") {
                        reLayer.prop("checked", !ctl.prop("checked"));
                        setShapeVisible(reIndex, !ctl.prop("checked"));
                    }
                    else if (fn === "off") {
                        reLayer.prop("checked", false);
                        setShapeVisible(reIndex, false);
                    }
                });
            }
        });

        // layer
        var card = $("<div>", { class: "card" });
        parent.append(card);

        var header = $("<div>", { class: "card-header p-1 pl-3 cursor-pointer" });
        card.append(header);
        header.on("click", function (e) {
            var target = $(e.target);

            if (!target.parent().hasClass("switch")) {
                var body = $(e.currentTarget).siblings();
                var display = body.css("display");

                display === "none" ? body.show() : body.hide();

                var icon = $(e.currentTarget).find("i");
                if (icon.hasClass("fa-caret-down")) {
                    icon.removeClass("fa-caret-down");
                    icon.addClass("fa-caret-up");
                } else {
                    icon.removeClass("fa-caret-up");
                    icon.addClass("fa-caret-down");
                }
            }
        });

        var collapseIcon = $("<i>", { class: "fas fa-caret-down mr-2" });
        header.append(collapseIcon);

        var layerTitle = $("<span>", { text: e["Title"] });
        header.append(layerTitle);

        var divSwitch = $("<div>", { style: "display:inline-block;", class: "float-right" });
        header.append(divSwitch);

        divSwitch.append(f);


        // notation
        var body = $("<div>", { class: "card-body pt-2 pb-2" });
        card.append(body);
        body.hide();
        
        if (e["Notation"] !== undefined)
            construct_notations_table(body, e["Notation"]);
    });
}
function construct_notations_table(parent, collection) {

    $.each(collection, function (i, e) {

        var row = $("<div>", { class: "row" });
        parent.append(row);

        var label = $("<label>", { class: "col-3 col-form-label", text: e["Title"] });
        row.append(label);

        var col = $("<div>", { class: "col" });
        row.append(col);

        var f = $("<input>", {
            type: "text",
            "data-type": "notation",
            "data-layer": e["Layer"],
            value: e["Value"],
            style: "width:100%;",
            class: "form-control"
        });
        f.on("input", function () { SetShapeText(e["Layer"], $(this).val()); });
        f.on("click", function () {
            var layer = $(this).data("layer");

            var c = $("svg > g g").filter(function () {
                return $(this).attr("v:shapeName") === layer;
            });

            var rec = c.children("rect");
            rec.attr("data-select", true);
        });
        f.on("focusout", function () {
            var layer = $(this).data("layer");

            var c = $("svg > g g").filter(function () {
                return $(this).attr("v:shapeName") === layer;
            });

            var rec = c.children("rect");
            rec.attr("data-select", false);
        });

        col.append(f);
    });
}
function setShapeVisible(index, show) { // t:layer index, i:show value
    //var index = $("svg > g > layer").filter(function () { return this.getAttribute("v:name") == layer; }).eq(0).attr("v:index");
    var shapes = $("svg > g g").filter(function () {
        return this.getAttribute("v:layerMember") === String(index);
    });

    shapes && $.each(shapes, function (n, e) {
        show ? $(e).attr("style", "display:\"\"") : $(e).attr("style", "display:none");
        //show ? $(e).show() : $(e).hide();
    });
}
function form_load(data) { // JSON 데이터 적용

    if (data.xServiceItem === 0) {
        alert("삭제된 Equipment입니다. Equipment page로 이동합니다.");
        $(location).attr("href", "/drawings/orders/" + data.drawingId + "/Edit");
    }
    else {
        loading.show();

        equipment = data;

        $.each(equipment.properties, function (i, e) { // i:index, e:entity
            var checkBox = $("#panel-layers input[type=\"checkbox\"][data-layer=\"" + e.layer + "\"]");
            if (e.value === "TRUE")
                checkBox.prop("checked", true);
            showLayer(e.layer, e.value === "TRUE");//setShapeVisible(r, !isLayerVisible(r))

            $.each(e.notations, function (i, e) { // i:index, e:entity
                $("#panel-layers input[type=\"text\"][data-layer=\"" + e.layer + "\"]").val(e.value);
                SetShapeText(e.layer, e.value);
            });
        });

        $.each(equipment.interfaces, function (i, e) { // i:index, e:entity
            var checkBox = $("#panel-layers input[type=\"checkbox\"][data-layer=\"" + e.layer + "\"]");
            if (e.value === "TRUE")
                checkBox.prop("checked", true);
            showLayer(e.layer, e.value === "TRUE");

            $.each(e.notations, function (i, e) { // i:index, e:entity
                $("#panel-layers input[type=\"text\"][data-layer=\"" + e.layer + "\"]").val(e.value);
                SetShapeText(e.layer, e.value);
            });
        });

        $.each(equipment.components, function (i, e) { // i:index, e:entity
            var checkBox = $("#panel-layers input[type=\"checkbox\"][data-layer=\"" + e.layer + "\"]");
            if (e.value === "TRUE")
                checkBox.prop("checked", true);

            showLayer(e.layer, e.value === "TRUE");

            $.each(e.notations, function (i, e) { // i:index, e:entity
                $("#panel-layers input[type=\"text\"][data-layer=\"" + e.layer + "\"]").val(e.value);
                SetShapeText(e.layer, e.value);
            });
        });

        loading.hide();
    }
}
function extend(n) {
    n.fn.extend({
        panzoom: function (n) {
            return this.each(function () {
                PanZoom(this, n);
            });
        }
    });
}
function form_save() { // HTML에서 데이터 가져와서 JSON에 적용

    $.each(equipment.properties, function (i, e) { // i:index, e:entity
        e.value = $("#panel-layers input[type=\"checkbox\"][data-layer=\"" + e.layer + "\"]").prop("checked");

        $.each(e.notations, function (i, e) { // i:index, e:entity
            e.value = $("#panel-layers input[type=\"text\"][data-layer=\"" + e.layer + "\"]").val();
        });
    });

    $.each(equipment.interfaces, function (i, e) { // i:index, e:entity
        e.value = $("#panel-layers input[type=\"checkbox\"][data-layer=\"" + e.layer + "\"]").prop("checked");

        $.each(e.notations, function (i, e) { // i:index, e:entity
            e.value = $("#panel-layers input[type=\"text\"][data-layer=\"" + e.layer + "\"]").val();
        });
    });

    $.each(equipment.components, function (i, e) { // i:index, e:entity
        e.value = $("#panel-layers input[type=\"checkbox\"][data-layer=\"" + e.layer + "\"]").prop("checked");

        $.each(e.notations, function (i, e) { // i:index, e:entity
            e.value = $("#panel-layers input[type=\"text\"][data-layer=\"" + e.layer + "\"]").val();
        });
    });
}

function SetShapeText(layer, value) {

    var c = $("svg > g g").filter(function () {
        return $(this).attr("v:shapeName") === layer;
    });
    //var x, y;

    var desc = c.find("desc");
    desc.remove();

    var tblock = c.find("v:textBlock");
    tblock.remove();


    // rect 없으면 생성
    var rect = c.find("rect");
    var path = c.find("path");

    if (rect.length === 0) {

        if (path.attr("d") === undefined)
            console.log("undefind attribute d " + layer);
        else {
            var arrPath = path.attr("d").split(" ");

            var h = Number(arrPath[5].replace("M", "").replace("L", "")) - Number(arrPath[1].replace("M", "").replace("L", ""));
            var w = Number(arrPath[0].replace("M", "").replace("L", "")) - Number(arrPath[2].replace("M", "").replace("L", ""));
            x = Number(arrPath[2].replace("M", "").replace("L", ""));
            y = Number(arrPath[1].replace("M", "").replace("L", ""));

            rect = $("<rect>", { "x": x, "y": y, class: path.attr("class"), "width": w, "height": h });
            c.append(rect);

            path.remove();
        }
    }


    // text 없으면 생성
    var tbox = c.find("text");

    if (tbox.length === 0) {
        var ref = $("svg > g  g text");

        var x = Number(rect.attr("width")) / 2;
        var y = Number(rect.attr("height")) / 2 + Number(rect.attr("y"));

        tbox = $("<text>", {
            "x": x,
            "y": y,
            "class": ref.attr("class"),
            "v:langID": ref.get(0).getAttribute("v:langID"),
            "text-anchor": "middle",
            "dominant-baseline": "middle"
        });
        tbox.append(value);
        c.append(tbox);
    }


    if (tbox.attr("y") !== "NaN") {

        x = (Number(rect.attr("width")) / 2) * Math.sign(tbox.attr("x"));
        y = (Number(rect.attr("height")) / 2 + Number(rect.attr("y"))) * Math.sign(tbox.attr("y"));

        tbox.text(value === null ? "" : value); // important

        if (isNaN(x) || isNaN(y)) {
            var d = path.attr("d");
            arrPath = d.split(" ");

            x = (Number(arrPath[5].replace("M", "").replace("L", "")) - Number(arrPath[1].replace("M", "").replace("L", ""))) / 2;
            y = (Number(arrPath[0].replace("M", "").replace("L", "")) - Number(arrPath[2].replace("M", "").replace("L", ""))) / 2;
        }

        tbox.attr("x", x);
        tbox.attr("y", y);
        tbox.attr("text-anchor", "middle");
        tbox.attr("dominant-baseline", "middle");

        c.html(c.html());
    }
}


// #region
var xmldoc;
var svgtag;
var viewBox;


var isLayerVisible = function (n) {
    return !!$("#panel-layers input[type=\"checkbox\"][data-index=\"" + n + "\"]").prop("checked");
};
function showLayer(layer, show) { // t:layer index, i:show value
    //var index = $($("svg > g > layer").filter(function () { return $(this).attr("v:name") == layer; })).attr("v:index");
    var list = $($("svg > g > layer").filter(function () { return $(this).attr("v:name") === layer; }));

    if (list.length !== 0) {
        var index = list && list.attr("v:index");
        if (0 <= index) {
            var shapes = $("svg > g g").filter(function () {
                return this.getAttribute("v:layerMember") === index;
            });
            shapes && $.each(shapes, function (n, e) {
                //show ? $(e).show() : $(e).hide();
                show ? $(e).attr("style", "display:\"\"") : $(e).attr("style", "display:none");
            });
        }
    }
}
// #endregion


var isEmpty = function (value) { if (value === "" || value === null || value === undefined || (value !== null && typeof value === "object" && !Object.keys(value).length)) { return true; } else { return false; } };