$(window).on("load", function () {

    initialize();
    LoadConfigs("LoadConfig", null);

    // #region [Event]
    $("#BtnEditConfig").click(function () {

        var btn = $(this);

        if (btn.val() === "Edit")
            LoadConfigs("LoadComponents", btn);
        else {
            var arrInput = new Array();
            var inputs = $("input[name=\"Items\"]");

            $.each(inputs, function () {

                var changeVal = $(this).siblings("input[name=\"ChangeVal\"]");

                if (changeVal.val() === "E") {

                    var variantId = $(this).val();
                    var checked = $(this).prop("checked");
                    var qty = $("#Qty" + variantId).val();

                    var obInput = {
                        "VariantId": variantId,
                        "Checked": checked,
                        "Qty": qty
                    };

                    arrInput.push(obInput);
                }
            });

            var json = JSON.stringify(arrInput);
            var dwgEquipId = $("#Id").val();

            $.ajax({
                type: "POST",
                url: "/DrawingOrders/EditComponent/",
                data: { json: json, dwgEquipId: dwgEquipId },
                success: function (msg) {

                    if (msg === "Success")
                        LoadConfigs("LoadConfig", btn);
                    else
                        toastr.warning(msg, "", { positionClass: "toast-bottom-right" });
                }
            });
        }
    });
    $("#TbComponents tbody").delegate("tr", "click", function (e) {

        if ($(e.target).is("input"))
            return true;

        if ($("#BtnEditConfig").val() === "Save") {
            var checkbox = $(e.currentTarget).find("input[type=\"checkbox\"]");
            checkbox.prop("checked", !checkbox.prop("checked"));
            checkbox.trigger("change");
        }
    });

    // All Check
    $("#TbComponents thead input[type=\"checkbox\"]").on("change", function () {

        var chekced = $(this).prop("checked");
        $("#TbComponents tbody input[type=\"checkbox\"]").prop("checked", chekced);
    });
// #endregion [Event]
});


function initialize() {

    loading.show();

    var menuBar = $("#MenuBar");

    // #region breadcrumb
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


    // #region button group
    var btnGroup = menuBar.find("div.btn-group");

    var newGroup = $("<div>", { class: "btn-group mr-2" });
    btnGroup.before(newGroup);

    var btnEdit = $("<button>", { id: "BtnEditConfig", type: "button", text: "EDIT", class: "btn btn-primary", value: "Edit" });
    newGroup.append(btnEdit);


    var detailGroup = $("<div>", { class: "btn-group mr-2" });
    newGroup.before(detailGroup);

    var btnComponent = $("<a>", { class: "btn text-white font-weight-bold", text: "Component", href: "/drawings/orders/" + orderId + "/equipments/" + dwgEquipId + "/Edit" });
    detailGroup.append(btnComponent);

    if (!isEmpty(wordmapId)) {
        var btnDiagram = $("<a>", { class: "btn text-white", text: "Diagram", href: "/drawings/orders/" + orderId + "/equipments/" + dwgEquipId + "/diagram/" + wordmapId + "/row/0" });
        detailGroup.append(btnDiagram);
    } else {
        btnDiagram = $("<button>", { type: "button", class: "btn text-white", text: "Diagram" });
        btnDiagram.css("cursor:not-allowed");
        btnDiagram.prop("disabled", true);

        detailGroup.append(btnDiagram);
    }

    var btnView = $("<a>", { class: "btn text-white", text: "View", href: "/drawings/orders/" + orderId + "/equipments/" + dwgEquipId + "/fileview" });
    detailGroup.append(btnView);
    // #endregion button group


    loading.hide();
}
function LoadConfigs(act, btn) {

    loading.show();

    var id = $("#Id").val();

    $.getJSON("/DrawingOrders/LoadConfigs/", { id: id, action: act })
        .done(function (json) {

            if (json["Msg"] === "Deleted item") {

                alert("이미 삭제된 Item입니다. Equipment page로 돌아갑니다.");

                var returnId = json["DrawingId"];
                $(location).attr("href", "/drawings/orders/" + returnId + "/Edit");
                return false;
            }


            var tbody = $("#TbComponents > tbody");
            tbody.empty();


            $.each(json, function (group) {

                if (this.length === 0)
                    return true;


                if (group === "Diagrams") {

                    var divDiagram = $("#DiagramList > div");
                    divDiagram.empty();

                    $.each(this, function () {
                        divDiagram.append($("<a>", {
                            class: "list-group-item",
                            href: "/drawings/orders/" + orderId + "/equipments/" + dwgEquipId + "/diagram/" + this["Id"] + "/row/0",
                            text: this["Desc"]
                        }));
                    });
                }
                else {
                    var trGroup = $("<tr>", { class: "cursor-pointer", "data-toggle": "collapse", "data-target": "." + group.replace(/ /g, "") });
                    tbody.append(trGroup);

                    trGroup.on("click", function () {
                        var i = $(this).find(".fa");

                        if (i.hasClass("fa-caret-up")) {
                            i.removeClass("fa-caret-up");
                            i.addClass("fa-caret-down");
                        } else {
                            i.removeClass("fa-caret-down");
                            i.addClass("fa-caret-up");
                        }
                    });


                    // #region _Group
                    var td = $("<td>", { "colspan": 6 });
                    trGroup.append(td);

                    var lbGroup = $("<label>", { text: group, class: "font-weight-bold mb-0" });
                    td.append(lbGroup);

                    var icon = $("<i>", { class: "fa fa-caret-down float-right" });
                    td.append(icon);
                    // #endregion _Group


                    // component
                    $.each(this, function () {

                        if (act === "LoadConfig" && this["Have"] === 0)
                            return true;

                        // trVat
                        var trVat = $("<tr>", { class: group.replace(/ /g, "") + " collapse show" });
                        tbody.append(trVat);

                        // td - Name
                        for (var k = 0; k < 6; k++) {
                            var td = $("<td>");
                            trVat.append(td);

                            switch (k) {
                                case 0:
                                    var inputId = $("<input>", { type: "hidden", value: this["VariantId"], name: "Id" });
                                    td.append(inputId);

                                    var changeVal = $("<input>", { type: "hidden", name: "ChangeVal" });
                                    td.append(changeVal);

                                    if (act === "LoadComponents") {
                                        var inputChk = $("<input>", { type: "checkbox", name: "Items", value: this["VariantId"], id: this["VariantId"] });
                                        td.append(inputChk);

                                        inputChk.on("change", function () {
                                            var tr = $(this).parent().parent();

                                            if ($(this).prop("checked"))
                                                tr.addClass("table-info");
                                            else
                                                tr.removeClass("table-info");

                                            var changeVal = $(this).siblings("input[name=\"ChangeVal\"]");
                                            changeVal.val("E");
                                        });

                                        var have = this["Have"];
                                        have === 0 ? inputChk.prop("checked", false) : inputChk.prop("checked", true);
                                        inputChk.trigger("change");
                                    }

                                    var spanName = $("<span>", { text: this["VariantName"], style: "margin-left: 2rem;" });
                                    td.append(spanName);
                                    break;

                                case 1:
                                    var spanModel = $("<span>", { text: this["ProductModel"] });
                                    td.append(spanModel);
                                    break;

                                case 2:
                                    if (act === "LoadComponents") {
                                        var inputQty = $("<input>", {
                                            type: "number",
                                            value: this["Qty"],
                                            class: "form-control inputQty",
                                            id: "Qty" + this["VariantId"],
                                            name: "quantity"
                                            //style: "display:inline"
                                        });
                                        td.append(inputQty);

                                        inputQty.on("change", function () {
                                            var changeVal = $(this).parent().parent().find("input[name=\"ChangeVal\"]");
                                            changeVal.val("E");
                                        });

                                        var spanQty;

                                        if (this["Unit"] === "Meter")
                                            spanQty = $("<span>", { text: " m" });
                                        else if (this["Unit"] === "Set")
                                            spanQty = $("<span>", { text: " set" });

                                        td.append(spanQty);

                                    } else {
                                        if (this["Unit"] === "Meter")
                                            spanQty = $("<span>", { text: this["Qty"] + " m" });
                                        else if (this["Unit"] === "Set")
                                            spanQty = $("<span>", { text: this["Qty"] + " set" });
                                        else
                                            spanQty = $("<span>", { text: this["Qty"] });

                                        td.append(spanQty);
                                    }
                                    break;

                                case 3:
                                    if (!isEmpty(this["Mass"])) {
                                        var spanMass = $("<span>", { text: this["Mass"] });
                                        td.append(spanMass);
                                    }
                                    break;

                                case 4:
                                    td.prop("style", "min-width:10rem;");

                                    if (!isEmpty(this["Remark"])) {
                                        var txt = this["Remark"].replace(/\r\n|\r|\n/g, "<br/>");
                                        td.append(txt);
                                    }
                                    break;
                            }
                        }
                    });
                }
            });

            if (act === "LoadComponents") {
                $("#AllCheck").attr("hidden", false);
            } else {
                $("#AllCheck").attr("hidden", true);
            }


            if (btn !== null) {
                if (btn.val() === "Edit") {
                    btn.val("Save");
                    btn.text("Save");
                    btn.attr("Class", "btn btn-success");
                } else {

                    btn.val("Edit");
                    btn.text("Edit");
                    btn.attr("Class", "btn btn-primary");

                    toastr.success("Edit component", "Success save", { positionClass: "toast-bottom-right" });
                }
            }

            loading.hide();
            return true;
        });
}