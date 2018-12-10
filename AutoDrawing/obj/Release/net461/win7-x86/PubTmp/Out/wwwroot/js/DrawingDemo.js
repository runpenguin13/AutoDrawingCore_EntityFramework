var loading = $("#Loading");


$(window).on("load", function () {

    //PageSet();
    Event_TopMenu();
    Event_SearchOrder();
});

function PageSet(userId) {

    // Side menu
    var menu = $("#Menu .list-unstyled components");

    //$.getJSON("/Account/LoadUserRoles", { userId: userId })
    //    .done(function (json) {
    //        var cnt = 5;

    //        for (var i = 0; i < cnt; i++) {
    //            var li = $("<li>");
    //            menu.append(li);
    //        }
    //    });

    // Search order
    var d = new Date();
    var now = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

    $("#StartRequestDate").val(now);
    $("#FinishRequestDate").val(now);
}

function SearchService(control) {

    $("body").addClass("wait");

    var word = $(control).parent().siblings("input[type=\"text\"]").val();
    var arrOptions = new Array();


    var options = $("#SearchBox input[type=\"checkbox\"]:checked");
    $.each(options, function () {
        var checkbox = $(this);

        var controls = checkbox.parent().parent().siblings().find("select, input");
        $.each(controls, function () {
            var objControl = {
                "name": $(this).prop("name"),
                "value": $(this).val()
            };
            arrOptions.push(objControl);
        });
    });


    var obj = {
        "Word": word,
        "Options": arrOptions
    };

    $.getJSON("/DrawingOrders/SearchService", { json: JSON.stringify(obj) })
        .done(function (arrService) {

            var result = $("#SearchResult");
            result.empty();

            var yardCount = 0;
            $.each(arrService, function () {

                var yardId = this["YardId"];
                var yardCode = this["Code"];
                var yardName = this["Name"];
                var arrVessel = this["arrVessel"];

                // shipyard
                yardCount += 1;
                var headerShipyard = $("<div>", { class: "card-body special-color text-white rounded cursor-pointer p-1" });
                result.append(headerShipyard);
                
                headerShipyard.on("click", function () {
                    var icon = $(this).find(".fas");
                    var body = $(this).siblings();

                    if (icon.hasClass("fa-caret-down")) {
                        icon.removeClass("fa-caret-down");
                        icon.addClass("fa-caret-up");
                        body.hide();
                    } else {
                        icon.removeClass("fa-caret-up");
                        icon.addClass("fa-caret-down");
                        body.show();
                    }
                });

                var iconShipyard = $("<i>", { class: "fas fa-caret-down ml-2 mr-2" });
                headerShipyard.append(iconShipyard);

                var spanCode = $("<span>", { text: yardCode, class: "mr-3" });
                headerShipyard.append(spanCode);

                var spanName = $("<span>", { text: "(" + yardName + ")" });
                spanCode.after(spanName);

                var bodyShipyard = $("<div>");
                result.append(bodyShipyard);


                // vessel
                $.each(arrVessel, function () {

                    var hullCode = this["HullCode"];
                    var salesNo = this["SalesNo"];
                    var arrDrawingType = this["arrDrawingType"];


                    var cardVessel = $("<div>");
                    bodyShipyard.append(cardVessel);

                    var headerVessel = $("<div>", { class: "card-body special-color text-white rounded ml-3 cursor-pointer p-1" });
                    cardVessel.append(headerVessel);
                    headerVessel.on("click", function () {
                        var icon = $(this).find(".fas");
                        var body = $(this).siblings();

                        if (icon.hasClass("fa-caret-down")) {
                            icon.removeClass("fa-caret-down");
                            icon.addClass("fa-caret-up");
                            body.hide();
                        } else {
                            icon.removeClass("fa-caret-up");
                            icon.addClass("fa-caret-down");
                            body.show();
                        }
                    });

                    var iconVessel = $("<i>", { class: "fas fa-caret-down ml-2 mr-2" });
                    headerVessel.append(iconVessel);

                    var spanHullCode = $("<span>", { text: hullCode, class: "mr-2" });
                    headerVessel.append(spanHullCode);

                    var spanSalesNo = $("<span>", { text: "(" + salesNo + ")" });
                    spanHullCode.after(spanSalesNo);

                    var bodyVessel = $("<div>", { class: "ml-3" });
                    cardVessel.append(bodyVessel);


                    // drawing type
                    $.each(arrDrawingType, function () {
                        var serviceType = this["ServiceType"];
                        var codeName = this["CodeName"];
                        var arrService = this["arrService"];


                        var cardServiceType = $("<div>");
                        bodyVessel.append(cardServiceType);

                        var headerServiceType = $("<div>", { class: "card-body special-color text-white rounded ml-3 cursor-pointer p-1" });
                        cardServiceType.append(headerServiceType);
                        headerServiceType.on("click", function () {
                            var icon = $(this).find(".fas");
                            var body = $(this).siblings();

                            if (icon.hasClass("fa-caret-down")) {
                                icon.removeClass("fa-caret-down");
                                icon.addClass("fa-caret-up");
                                body.hide();
                            } else {
                                icon.removeClass("fa-caret-up");
                                icon.addClass("fa-caret-down");
                                body.show();
                            }
                        });

                        var iconServiceType = $("<i>", { class: "fas fa-caret-down ml-2 mr-2" });
                        headerServiceType.append(iconServiceType);

                        var spanServiceType = $("<span>", { text: codeName });
                        headerServiceType.append(spanServiceType);

                        var bodyServiceType = $("<div>", { class: "ml-3" });
                        cardServiceType.append(bodyServiceType);


                        // version
                        $.each(arrService, function () {
                            var id = this["Id"];
                            var version = this["Version"];
                            var state = this["State"];
                            var requestDate = this["RequestDate"];

                            var cardVersion = $("<div>", { class: "card-body rounded ml-3 cursor-pointer p-2", text: version });
                            bodyServiceType.append(cardVersion);
                            cardVersion.on("click", function () {
                                var id = $(this).find("input[type=\"hidden\"]").val();

                                MovePage_Order(id, "ServiceIdx");
                            });

                            if (state !== "70") {
                                var badge = $("<span>", { class: "badge float-right badge-pill badge-danger", text: "Not completed" });
                                cardVersion.append(badge);
                            }

                            var spanReqeustDate = $("<span>", { class: "ml-5", text: "Request Date : " + requestDate });
                            cardVersion.append(spanReqeustDate);

                            var inputId = $("<input>", { type: "hidden", value: id });
                            cardVersion.append(inputId);
                        });
                    });

                });
            });


            $("body").removeClass("wait");

        }).fail(function (error) { console.log(error); });
}
function MovePage_Order(id, type) {
    loading.show();

    $.getJSON('/DrawingOrders/FindOrderId', { id: id, type: type })
        .done(function (dwgOrderId) {

            if (dwgOrderId === 0) {
                toastr.error('등록된 Service가 없습니다.');
            } else {
                var href = '/drawings/orders/' + dwgOrderId + '/Edit/';
                location.href = href;
            }
        });
}

function Event_TopMenu() {
    $("#BtnMenu").on("click", function () {
        $("#Menu").addClass("active");
        $(".overlay").fadeIn();

        $(this).removeClass("Active").addClass("Inactive");
    });
    $("#dismiss, .overlay").on("click", function () {
        $("#Menu").removeClass("active");
        $(".overlay").fadeOut();

        $("#Menu").removeClass("Inactive").addClass("Active");
    });
}
function Event_SearchOrder() {
    $("#Search").on("focus", function () {
        $("#MenuBar .overlay").fadeIn();
        $("#SearchBox").fadeIn();
    });
    $("#Search").on("keydown", function (key) {
        if (key.keyCode === 13) {
            var btn = $(this).parent().find("#SearchButton");
            SearchService(btn);
        }
    });
    $("#SearchButton").on("click", function () {
        SearchService($(this));
    });
    $("#MenuBar .overlay").on("click", function () {
        $(".under").fadeOut();
        $(this).fadeOut();
    });
    $(".under .form-check-input").on("change", function () {
        var label = $(this).siblings("label");
        var controls = $(this).parent().parent().siblings().find("select, input");

        if ($(this).prop("checked")) {
            label.removeClass("disabled");

            $.each(controls, function () {
                $(this).prop("disabled", false);

                if ($(this).is("select"))
                    SelectLJH($(this));
            });
        } else {
            label.addClass("disabled");

            $.each(controls, function () {
                $(this).prop("disabled", true);

                if ($(this).is("select"))
                    SelectLJH($(this));
            });
        }
    });
}


var isEmpty = function (value) { if (value === "" || value === null || value === undefined || (value !== null && typeof value === "object" && !Object.keys(value).length)) { return true; } else { return false; } };

var ismousedown;
jQuery.fn.draggit = function (el) {
    var thisdiv = this;
    var thistarget = $(el);
    var relX;
    var relY;
    var targetw = thistarget.width();
    var targeth = thistarget.height();
    var docw;
    var doch;

    thistarget.css('position', 'absolute');


    thisdiv.bind('mousedown', function (e) {
        var pos = $(el).offset();
        var srcX = pos.left;
        var srcY = pos.top;

        docw = $('body').width();
        doch = $('body').height();

        relX = e.pageX - srcX;
        relY = e.pageY - srcY;

        ismousedown = true;
    });

    $(document).bind('mousemove', function (e) {
        if (ismousedown) {
            targetw = thistarget.width();
            targeth = thistarget.height();

            var maxX = docw - targetw - 10;
            var maxY = doch - targeth - 10;

            var mouseX = e.pageX;
            var mouseY = e.pageY;

            var diffX = mouseX - relX;
            var diffY = mouseY - relY;

            // check if we are beyond document bounds ...
            if (diffX < 0) diffX = 0;
            if (diffY < 0) diffY = 0;
            if (diffX > maxX) diffX = maxX;
            if (diffY > maxY) diffY = maxY;

            $(el).css('top', diffY + 'px');
            $(el).css('left', diffX + 'px');
        }
    });

    $(window).bind('mouseup', function (e) {
        ismousedown = false;
    });

    return this;
}; // end jQuery draggit function //