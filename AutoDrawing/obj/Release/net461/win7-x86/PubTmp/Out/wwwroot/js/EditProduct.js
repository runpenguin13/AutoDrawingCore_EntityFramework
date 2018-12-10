var loading = $("#Loading");
var vatGroupList;


$(window).on("load", function () {

    initialize();
    LoadComponent("");

    SelectLJH($("select"));

    // #region  [Event]
    $("#FormProduct input, #FormProduct select").on("change", function () {

        var productId = $("#ProductId").val();
        var name = $(this).attr("name");
        var value = $(this).val();

        $.ajax({
            type: "POST",
            url: "/Products/SaveProduct",
            data: { productId: productId, name: name, value: value },
            success: function () {
            }
        });
    });

    // edit component
    $("#DivEditPart").on("show.bs.modal", function () {
        var variantId = $("#EditVariantId").val();

        $.getJSON("/Products/LoadEditModel/", { variantId: variantId })
            .done(function (json) {

                var products = json["ProductsList"];
                var groups = json["GroupList"];
                var selectItem = json["SelectItem"];

                // Product list 추가
                var model = $("#EditProduct");
                model.empty();

                $.each(products, function () {
                    var option = $("<option>", { value: this["Id"], text: this["Model"] + " [" + this["Title"] + "]", "data-title": this["Title"] });
                    model.append(option);
                });
                model.on("change", function () {
                    var title = $(this.selectedOptions).attr("data-title");
                    $("#EditName").val(title);
                });

                // variant groups
                var secGroup = $("#EditGroup");
                secGroup.empty();

                $.each(groups, function () {
                    var option = $("<option>", { value: this["Id"], text: this["Name"] });
                    secGroup.append(option);
                });


                // select item
                var inputs = $("#FormEditPart input, #FormEditPart select");
                $.each(inputs, function () {
                    $(this).val(selectItem[this.name]);

                    if ($(this).is("select"))
                        SelectLJH($(this));
                    else
                        $(this).trigger("change");
                });

                SelectLJH(model);
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                toastr.error("Load component", "Error", { positionClass: "toast-bottom-right" });
            });
    });
    $("#BtnSubmitEdit").click(function () {

        $.ajax({
            url: "/Products/SubmitEditPart/",
            data: $("#FormEditPart").serialize(),
            success: function () {
                $("#DivEditPart").modal("toggle");
                LoadComponent("");
            },
            error: function (request, status, error) {
                toastr.error("Save edit component", "code:" + request.status + "\n message::" + request.responseText + "\n error:" + error);
            }
        });
    });

    $("#chkAll").click(function () {
        var chk = $("#chkAll").prop("checked");
        var row = $("#TbComponent > tbody > tr > td > input");

        $(row).each(function () {
            $(this).prop("checked", chk);
        });
    });

    $("#TbComponent").delegate("tr", "click", function (e) {

        if ($(e.target).prop("type") !== "checkbox") {
            var checkbox = $(e.currentTarget).find("input[type=\"checkbox\"]");
            checkbox.prop("checked", !checkbox.prop("checked"));
        }

        $(e.currentTarget).toggleClass("table-active");
    });
    $("#TbSearchParts").delegate("button", "click", function (e) {
        var id = $(this).parent().parent().children().children("input[type=\"hidden\"]").val();
        var name = $(this).parent().parent().children().children("span[data-type=\"name\"]").text();
        var model = $(this).parent().parent().children().children("span[data-type=\"model\"]").text();
        AddPart(id, name, model);
    });
    $("#TbAddParts").delegate("button", "click", function (e) {
        var tr = $(this).parent().parent();
        tr.remove();
    });

    $("#DivEditPart input").keydown(function (key) {
        if (key.keyCode === 13) {
            $("#BtnSubmitEdit").trigger("click");
        }
    });
    $(".filebox .upload-hidden").on("change", function () {

        $(this)[0].files[0] === undefined && true;


        //if (($(this)[0].files[0]) === undefined)
        //    return true;

        if (window.FileReader)
            var filename = $(this)[0].files[0].name;
        else
            filename = $(this).val().split("/").pop().split("\\").pop();

        var tbox = $(this).siblings(".upload-name");
        tbox.val(filename);
        tbox.attr("title", filename);
    });

    // Manual
    $("#ManualList").delegate("tr", "click", function (e) {
        if ($(e.target).prop("type") !== "checkbox") {
            var checkbox = $(e.currentTarget).find("input[type=\"checkbox\"]");
            checkbox.prop("checked", !checkbox.prop("checked"));

            $(e.currentTarget).toggleClass("table-active");
        }
    });

    // variant group
    $("#DivVariantGroup").on("show.bs.modal", function () { LoadVariantGroup(); });
    $("#BtnAddGroup").on("click", function () {

        var groupName = $("#AddGroup").val();

        $.ajax({
            url: "/Products/AddVariantGroup",
            type: "POST",
            data: { groupName: groupName },
            success: function () {
                toastr.success("Success add");
                LoadVariantGroup();
            },
            error: function (error) {
                toastr.error(error);
            }
        });
    });
    $("#AddGroup").keydown(function (k) {
        if (k.keyCode === 13)
            $("#BtnAddGroup").trigger("click");
    });

    // add part list
    $("#DivAddParts").on("show.bs.modal", function () {
        SearchParts();

        $.getJSON("/Products/LoadVariantGroup", function (arrJson) {
            vatGroupList = arrJson;
        });
    });
    $("#SearchPart").on("input", function () { SearchParts(); });
    $("#BtnSubmitAddParts").click(function () {
        loading.show();

        var components = new Array();
        var selectParts = $("#SelectParts .form-group.row");

        $.each(selectParts, function () {
            var group = $(this).find(".vatGroup").val();
            var productId = $(this).find(".component").val();

            var item = {
                Group: group,
                Id: productId
            };
            components.push(item);
        });

        var obj = {
            MainId: $("#ProductId").val(),      // product ID (JObject)
            Component: components               // 추가해야되는 components (JArray)
        };

        var json = JSON.stringify(obj);

        $.ajax({
            type: "POST",
            url: "/Products/SaveComponent/",
            data: { json: json },
            success: function (response) {
                $("#DivAddParts").modal("toggle");
                LoadComponent("");
                loading.hide();

                selectParts.remove();
            }
        });
    });

    // component delete
    $("#BtnDeleteParts").click(function () {

        loading.show();

        var items = new Array();
        $.each($("#TbComponent input:checked"), function () {
            items.push(this.value);
        });

        var productId = $("#ProductId").val();

        $.ajax({
            url: "/Products/DeleteComponents",
            type: "POST",
            data: { json: JSON.stringify(items), productId: productId },
            success: function () {
                $("#DivDeletePart").modal("hide");
                LoadComponent("");

                loading.hide();
            },
            error: function (error) {
                toastr.error(error);
            }
        });
    });

    // new part
    $("#DivNewPart input").keydown(function (k) {
        if (k.keyCode === 13)
            $("#SubmitNewPart").trigger("click");
    });
    $("#SubmitNewPart").on("click", function () {

        var model = $("#NewPart").val();
        var desc = $("#NewDesc").val();
        var mass = $("#NewMass").val();

        $.ajax({
            url: "/Products/NewPart",
            type: "POST",
            data: { model: model, desc: desc, mass: mass },
            success: function () {
                $("#DivNewPart").modal("hide");
                SearchParts();
            },
            error: function (request, status, error) {
                toastr.error("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            }
        });

    });

    // #endregion  [Event]
});

function initialize() {
    var menuBar = $("#MenuBar");
    var ol = menuBar.find("ol.breadcrumb");

    // navigator
    var li = $("<li>", { class: "breadcrumb-item" });
    ol.append(li);

    var a = $("<a>", { href: "/Products/Index", text: "Product" });
    li.append(a);

    var model = $("#Model").val();
    li = $("<li>", { class: "breadcrumb-item active", text: model });
    ol.append(li);

    // delete button
    var btnGroup = menuBar.find(".btn-group");

    var newGroup = $("<div>", { class: "btn-group mr-3" });
    btnGroup.before(newGroup);

    var btnDel = $("<button>", { type: "button", class: "btn danger-color text-white", "data-toggle": "modal", "data-target": "#DivDeleteParts", text: "DELETE" });
    newGroup.append(btnDel);

    btnDel.on("click", function () {
        var items = new Array();
        items.push($("#ProductId").val());

        $.ajax({
            type: "POST",
            url: "/Products/DeleteProduct",
            data: { json: JSON.stringify(items) },
            success: function (response) {
                if (response === "Success")
                    location.href = "/Products";
                else
                    alert(response);
            }
        });
    });
}

// component list
function LoadComponent(option) {

    var id = $("#ProductId").val();

    $.getJSON("/Products/LoadComponent", { id: id })
        .done(function (json) {

            var componentList = $("#ComponentList");
            componentList.empty();

            $.each(json, function () {

                var groupId = this["Id"];
                var groupName = this["Name"];
                var variants = this["Variants"];

                var card = $("<div>", { class: "card" });
                componentList.append(card);

                // header
                var cardHeader = $("<div>", { class: "card-header", text: groupName });
                card.append(cardHeader);

                var inputGroupId = $("<input>", { type: "hidden", value: groupId, class: "variantGroup" });
                cardHeader.append(inputGroupId);

                // body
                var cardBody = $("<div>", { class: "card-body p-0" });
                card.append(cardBody);

                // table
                var table = $("<table>", { class: "table table-hover" });
                cardBody.append(table);

                // thead
                var thead = $("<thead>");
                table.append(thead);

                var hRow = $("<tr>");
                thead.append(hRow);

                for (var i = 0; i < 6; i++) {
                    var th = $("<th>");
                    hRow.append(th);

                    switch (i) {
                        case 0:
                            var checkbox = $("<input>", { type: "checkbox", class: "mr-3" });
                            th.append(checkbox);

                            var thSpan = $("<span>", { text: "Def." });
                            th.append(thSpan);
                            break;
                        case 1:
                            thSpan = $("<span>", { text: "Name" });
                            th.append(thSpan);
                            break;
                        case 2:
                            thSpan = $("<span>", { text: "Type" });
                            th.append(thSpan);
                            break;
                        case 3:
                            thSpan = $("<span>", { text: "Q'ty" });
                            th.append(thSpan);
                            break;
                        case 4:
                            thSpan = $("<span>", { text: "Mass" });
                            th.append(thSpan);
                            break;
                        case 5:
                            thSpan = $("<span>", { text: "Remark" });
                            th.append(thSpan);
                            break;
                    }
                }

                // tbody
                var tbody = $("<tbody>");
                table.append(tbody);

                $.each(variants, function () {
                    var bRow = $("<tr>", {
                        "data-id": this["Id"],
                        class: "cursor-default",
                        "draggable": true,
                        "ondragstart": "DragStart(event)",
                        "ondragover": "DragOver(event)",
                        "ondragleave": "DragLeave(event)",
                        "ondrop": "Drop(event)"
                    });
                    tbody.append(bRow);
                    bRow.on("dblclick", function () {
                        var variantId = $(this).attr("data-id");
                        $("#EditVariantId").val(variantId);
                        $("#DivEditPart").modal();
                    });

                    for (var i = 0; i < 6; i++) {
                        var td = $("<td>");
                        bRow.append(td);

                        switch (i) {
                            case 0:
                                var checkbox = $("<input>", { type: "checkbox", value: this["Id"], class: "mr-3" });
                                td.append(checkbox);

                                var def = this["Default"];

                                if (!isEmpty(def)) {
                                    var tdSpan = $("<span>", { text: def, class: "default" });
                                    td.append(tdSpan);
                                }
                                break;
                            case 1:
                                var name = this["VariantName"];

                                tdSpan = $("<span>", { text: name });
                                td.append(tdSpan);
                                break;
                            case 2:
                                var model = this["ProductModel"];

                                tdSpan = $("<span>", { text: model });
                                td.append(tdSpan);
                                break;
                            case 3:
                                var qty = isEmpty(this["Qty"]) ? "" : this["Qty"];
                                var unit = this["Unit"];

                                if (unit === "Meter")
                                    qty += " m";

                                tdSpan = $("<span>", { text: qty });
                                td.append(tdSpan);
                                break;
                            case 4:
                                var mass = this["Mass"];

                                if (!isEmpty(mass)) {
                                    tdSpan = $("<span>", { text: mass });
                                    td.append(tdSpan);
                                }
                                break;
                            case 5:
                                var remark = this["Remark"];

                                if (!isEmpty(remark)) {
                                    tdSpan = $("<span   >", { text: remark });
                                    td.append(tdSpan);
                                }
                                break;
                        }
                    }
                });

            });

            if (option !== null) {
                $.each(option, function () {
                    var checkes = $("#TbComponent > tbody > tr[data-id=\"" + this + "\"] > td > input[type=\"checkbox\"]");
                    $(checkes).trigger("click");
                });
            }

            LoadManual();
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        });
}

// add parts
function SearchParts() {

    var strFilter = $("#SearchPart").val();

    $.getJSON("/Products/SearchPart", { strFilter: strFilter })
        .done(function (json) {

            var list = $("#SearchPartList");
            list.empty();

            $.each(json, function () {

                var id = this["Id"];
                var model = this["Model"];
                var name = this["Name"];

                var title = model + " [" + name + "]";

                var item = $("<button>", { type: "button", class: "btn btn-light w-100 component", value: id, text: title, title: title });
                list.prepend(item);

                item.on("click", function () {
                    AddPart($(this));
                });
            });

            setTimeout(function () {
                $("#SearchPart").focus();
            }, 0);
        });
}
function AddPart(t) {

    var list = $("#SelectParts");

    // row
    var row = $("<div>", { class: "form-group row" });
    list.prepend(row);

    // group
    var divGroup = $("<div>", { class: "col pr-0" });
    row.append(divGroup);

    var secGroup = $("<select>", { class: "vatGroup" });
    divGroup.append(secGroup);

    $.each(vatGroupList, function () {
        var option = $("<option>", { value: this["Id"], text: this["Name"] });
        secGroup.append(option);
    });

    SelectLJH(secGroup);

    // item
    var divPart = $("<div>", { class: "col pl-0" });
    row.append(divPart);

    var c = $(t).clone().appendTo(divPart);

    c.on("click", function () {
        $(this).parent().parent().remove();
    });
}

// variant group
function LoadVariantGroup() {

    $.getJSON("/Products/LoadVariantGroup", function (arrJson) {

        var t = $("#VariantGroupList");

        $.each(arrJson, function () {
            var id = this["Id"];
            var name = this["Name"];

            var r = $("<button>", { type: "button", value: id, text: name, class: "btn btn-light w-100" });
            t.prepend(r);

            r.on("click", function () {

                var id = $(this).val();

                $.ajax({
                    url: "/Products/RemoveVariantGroup",
                    type: "POST",
                    data: { id: id },
                    success: function () {
                        toastr.success("Success remove");
                        LoadVariantGroup();
                    },
                    error: function (error) {
                        toastr.error(error);
                    }
                });
            });
        });
    });
}

// manual list
function LoadManual() {

    var id = $("#ProductId").val();

    $.getJSON("/Products/LoadManual", { id: id })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            toastr.error("Request Failed: " + err);
        });
}


// #region drag and drop
var dndMoveItem;

function DragStart(e) {
    dndMoveItem = $(e.currentTarget);
}
function DragOver(e) {
    if (e.preventDefault)
        e.preventDefault();

    dndTargetItem = $(e.currentTarget);
    dndTargetItem.addClass("dragOver");
}
function DragLeave(e) {
    dndTargetItem.removeClass("dragOver");
}
function Drop(e) {
    dndTargetItem.before(dndMoveItem);
    dndTargetItem.removeClass("dragOver");

    var tables = $("#ComponentList table");
    var arrGroup = new Array();

    $.each(tables, function () {

        var groupId = $(this).parent().siblings().find("input[type=\"hidden\"]").val();
        var trs = $(this).find("tbody").find("tr");

        var arrComponent = new Array();
        $.each(trs, function () {
            var id = $(this).attr("data-id");
            arrComponent.push(id);
        });

        var obj = {
            GroupId: groupId,
            Components: arrComponent
        };
        arrGroup.push(obj);
    });

    var productId = $("#ProductId").val();

    $.ajax({
        url: "/Products/ChangePriority",
        type: "POST",
        data: { productId: productId, variantGroups: JSON.stringify(arrGroup) },
        success: function () {
            LoadComponent("");
        },
        error: function (error) {
            toastr.error(error);
        }
    });
}
// #endregion drag and drop