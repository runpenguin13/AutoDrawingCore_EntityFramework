$(window).on("load", function () {

    initialize();
    Search();


    // #region _Search
    $("#SearchWord").keydown(function (e) {
        if (e.keyCode === 13)
            Search();
    });
    $("#Search").on("click", function () { Search(); });
    $("#CategoryList button").click(function (e) {

        var select = $(e.currentTarget);

        var hidden = $("#Category");
        hidden.val(select.val());


        var btn = select.parent().siblings(".dropdown-toggle");
        btn.find("span").text(select.val());

        Search();
    });
    // #endregion _Search


    // #region _All check for checkbox
    $("#chkAll").click(function () {
        var chk = $("#chkAll").prop("checked");
        var row = $("#List input[type=\"checkbox\"]");

        $(row).each(function () {
            $(this).prop("checked", chk);
        });
    });
    // #endregion _All check for checkbox


    // #region _Create
    $("#DivCreate").on("show.bs.modal", function (e) {

        var dnProduct = $("#CreateProductId");

        // #region _Product
        if (dnProduct.children().length === 0) {
            $.getJSON("/WordMaps/LoadProductList", function (productList) {

                dnProduct.empty();

                var opt = $("<option>", { text: "-- Please select --", value: "" });
                dnProduct.append(opt);

                $.each(productList, function () {
                    dnProduct.append($("<option>", {
                        value: this["ProductId"],
                        text: this["ProductModel"],
                        "EquipmentName": this["EquipmentName"]
                    }));
                });

                SelectLJH(dnProduct, "prepend");
            });
        }
        // #endregion _Product
    });

    $("#CreateProductId").change(function () {
        RefControl("Product", "Create");
        ChangeProduct("Create");
    });
    $("#CreateVariantId").change(function () {
        RefControl("Variant", "Create");
        ChangeVariant("Create");
    });

    $("#BtnSubmitCreate").click(function () {

        var formData = $("#FormCreate").serialize();       // form data를 가져옴

        $.ajax({
            type: "POST",
            url: "/WordMaps/Create/",
            data: formData,
            success: function (response) {
                $("#DivCreate").modal("toggle");
                Search();
            },
            error: function (error) { console.log(error); }
        });
    });

    $("#CreateSelect").delegate("button", "click", function (e) {
        RemoveItem("Create", e);
    });
    $("#CreateComponentGroup").change(function () {
        RefControl("ComponentGroup", "Create");
    });
    $("#CreateElementType").change(function () {
        RefControl("ElementType", "Create");
    });
    // #endregion _Create


    // #region _Edit
    $("#EditProductId").change(function () {
        RefControl("Product", "Edit");
        ChangeProduct("Edit");
    });
    $("#EditVariantId").change(function () {
        RefControl("Variant", "Edit");
        ChangeVariant("Edit");
    });

    $("#FormEdit input").keydown(function (key) {
        if (key.keyCode === 13)
            $("#BtnSubmitEdit").trigger("click");
    });

    $("#BtnSubmitEdit").click(function () {

        var formData = $("#FormEdit").serialize();

        // variants
        var variantIds = "";
        var btns_variant = $("#EditVariantId").siblings("button");

        $.each(btns_variant.get().reverse(), function () {

            if (!isEmpty(variantIds))
                variantIds += ",";

            variantIds += $(this).val();
        });

        formData += "&Variants=" + variantIds;


        $.ajax({
            type: "POST",
            url: "/WordMaps/Edit/",
            data: formData,
            success: function (response) {
                $("#DivEdit").modal("toggle");
                Search();
            },
            error: function (response) { console.log(response); }
        });
    });

    $("#EditComponentGroup").change(function () {
        RefControl("ComponentGroup", "Edit");
    });
    $("#EditElementType").change(function () {
        RefControl("ElementType", "Edit");
    });
    // #endregion _Edit


    // #region _Delete
    $("#BtnDelete").click(function () {
        $("#DivDelete").modal();
    });

    $("#BtnSubmitDelete").click(function () {

        var inputs = $("#List input:checked");

        if (inputs.length === 0) {
            toastr.error("Please select item", null, { positionClass: "toast-bottom-right" });
        } else {
            var items = new Array();

            $.each(inputs, function () {
                var hidden = $(this).siblings("input[type=\"hidden\"]");
                items.push(hidden.val());
            });

            var json = JSON.stringify(items);

            $.ajax({
                type: "POST",
                url: "/WordMaps/SubmitDelete/",
                data: { json: json },
                success: function () {
                    $("#DivDelete").modal("toggle");
                    Search();
                },
                error: function (response) { console.log(response); }
            });
        }
    });
    // #endregion _Delete


    // #region _List
    $("#List").delegate("tr", "dblclick", function (e) {

        if (e.target.type === "checkbox")
            return true;

        // load edit modal
        loading.show();
        var form = $("#FormEdit");
        var id = $(this).find("#WordMapId").val();
        $("#EditWordMapId").val(id);


        // #region  all clear
        var controls = form.find("input[type=\"text\"], select");
        $.each(controls, function () {
            this.value = "";
        });
        // #endregion


        // #region load info
        $.getJSON("/WordMaps/LoadWordMapItem", { id: id })
            .done(function (json) {

                // Equipment, Product
                var equipmentName = json["EquipmentName"];
                var productID = json["ProductId"];
                var variantIDs = json["VariantIds"];

                $("#EditEquipmentGroup").val(equipmentName);

                
                $.getJSON("/WordMaps/LoadProductList", function (productList) {
                    var dnProduct = $("#EditProductId");
                    dnProduct.empty();

                    $.each(productList, function () {
                        var opt = $("<option>", { value: this["ProductId"], text: this["ProductModel"], "EquipmentName": this["EquipmentName"] });
                        dnProduct.append(opt);
                    });

                    dnProduct.val(productID);
                    SelectLJH(dnProduct);
                });


                // Parts
                $.getJSON("/WordMaps/LoadVariantList", { productId: productID })
                    .done(function (variantGroup) {

                        var dnVariant = $("#EditVariantId");
                        dnVariant.empty();
                        dnVariant.siblings().remove();

                        var opt = $("<option>", { text: "-- Please select --", value: "" });
                        dnVariant.append(opt);


                        $.each(variantGroup, function () {

                            var optGroup = $("<optGroup>", { label: this["Group"] });
                            dnVariant.append(optGroup);

                            var variants = this["Variants"];


                            $.each(variants, function () {

                                opt = $("<option>", {
                                    value: this["VariantId"],
                                    text: this["VariantModel"] + " [" + this["VariantName"] + "]",
                                    "data-name": this["VariantName"],
                                    title: "Group: " + this["VariantGroup"] + (isEmpty(this["VariantRemark"]) ? "" : "\x0ARemark: " + this["VariantRemark"])
                                });

                                dnVariant.append(opt);
                            });

                            SelectLJH(dnVariant, "prepend");
                        });

                        // Variant value set
                        if (!isEmpty(variantIDs)) {
                            var arrVariantId = variantIDs.split(",");

                            for (var n = 0; n < arrVariantId.length; n++) {
                                dnVariant.val(arrVariantId[n]).trigger("change");
                            }
                        }
                    }).fail(function (error) { console.log(error); });


                // info
                var wordmapInfo = $("#EditWordMapInfo");
                var controls = wordmapInfo.find("input, select");

                $.each(controls, function () {
                    var name = $(this).attr("name");
                    var x = json[name];

                    if (!isEmpty(x))
                        $(this).val(x);
                });

                $("#DivEdit").modal("show");
                loading.hide();

            }).fail(function (error) { console.log(error); });
        // #endregion load info
    });
    $("#List").delegate("tr", "click", function (e) {

        if ($(e.target).prop("type") !== "checkbox") {
            var checkbox = $(e.currentTarget).find("input[type=\"checkbox\"]");
            checkbox.prop("checked", !checkbox.prop("checked"));
        }

        $(e.currentTarget).toggleClass("table-active");
    });
    // #endregion _List 
});


function initialize() {
    var menuBar = $("#MenuBar");
    var ol = menuBar.find("ol.breadcrumb");

    li = $("<li>", { class: "breadcrumb-item active", text: "Wordmap" });
    ol.append(li);


    var btnGroup = menuBar.find("div.btn-group");

    var newGroup = $("<div>", { class: "btn-group mr-3" });
    btnGroup.before(newGroup);

    var btn = $("<button>", { id: "BtnCreate", type: "button", "data-toggle": "modal", "data-target": "#DivCreate", text: "CREATE", class: "btn success-color text-white" });
    newGroup.append(btn);

    btn = $("<button>", { id: "BtnDelete", type: "button", "data-toggle": "modal", "data-target": "#DivDelete", text: "DELETE", class: "btn danger-color text-white" });
    newGroup.append(btn);
}
function Search() {

    loading.show();


    var category = $("#Category").val();
    var searchWord = $("#SearchWord").val();

    $.getJSON("/WordMaps/LoadWordMaps", { filter: searchWord, category: category })
        .done(function (json) {

            var tbody = $("#List tbody");
            tbody.empty();


            $.each(json, function () {

                var tr = $("<tr>");
                tbody.prepend(tr);

                for (var i = 0; i < 5; i++) {

                    var td = $("<td>");
                    tr.append(td);

                    switch (i) {
                        case 0:
                            var wordmapId = $("<input>", {
                                type: "hidden",
                                id: "WordMapId",
                                value: this["WordMapId"],
                                "data-product": this["ProductId"],
                                "data-variant": this["VariantId"]
                            });
                            td.append(wordmapId);

                            var chk = $("<input>", { type: "checkbox" });
                            td.append(chk);

                            var spanProduct = $("<span>", { text: this["ProductNumber"], class: "ml-3" });
                            td.append(spanProduct);
                            break;

                        case 1:
                            var variantName = this["VariantName"];

                            var spanVariant = $("<span>", { text: variantName });
                            td.append(spanVariant);
                            break;

                        case 2:
                            var spanElementName = $("<span>", { text: this["ElementName"] });
                            td.append(spanElementName);
                            break;

                        case 3:
                            var spanElementType = $("<span>", { text: this["ElementType"] });
                            td.append(spanElementType);
                            break;

                        case 4:
                            td.css("text-align", "right");

                            var btnCopy = $("<button>", { type: "button", class: "btn btn-light", value: this["WordMapId"], title: "Copy" });
                            td.append(btnCopy);

                            var iCopy = $("<i>", { class: "far fa-copy" });
                            btnCopy.prepend(iCopy);

                            btnCopy.on("click", function (e) {
                                var wordMapId = $(e.currentTarget).val();
                                SubmitClone(wordMapId);
                            });
                            break;
                    }
                }
            });

            loading.hide();
        });
}
function ChangeProduct(action) {

    var product = $("#" + action + "ProductId option:selected");
    var productId = product.val();
    var equipmentName = $(product).attr("equipmentname");
    var equipmentGroup = $("#" + action + "EquipmentGroup").val(equipmentName);


    $.getJSON("/WordMaps/LoadVariantList", { productId: productId })
        .done(function (variantGroup) {

            var dnVariant = $("#" + action + "VariantId");
            dnVariant.empty();
            dnVariant.siblings().remove();


            var opt = $("<option>", { text: "-- Please select --", value: "" });
            dnVariant.append(opt);


            $.each(variantGroup, function () {

                var optGroup = $("<optGroup>", { label: this["Group"] });
                dnVariant.append(optGroup);

                var variants = this["Variants"];


                $.each(variants, function () {

                    opt = $("<option>", {
                        value: this["VariantId"],
                        text: this["VariantModel"] + " [" + this["VariantName"] + "]",
                        "data-name": this["VariantName"],
                        title: this["VariantRemark"]
                    });

                    dnVariant.append(opt);
                });
            });

            SelectLJH(dnVariant, "prepend");
        });
}
function ChangeVariant(action) {

    var dnVariant = $("#" + action + "VariantId");
    var optSec = $("#" + action + "VariantId option:selected");

    if (!isEmpty(dnVariant.val())) {
        var btn_variant = $("<button>", { type: "button", value: dnVariant.val(), text: optSec.text(), class: "btn btn-white", style: "width:100%", title: optSec.prop("title") });
        dnVariant.after(btn_variant);

        btn_variant.on("click", function () {
            $(this).remove();
        });
    }
}
function AddVariant(action) {

    // 선택값이 있다면
    var selectItem = $("#EditVariantId option:selected");
    if (selectItem.val() !== null) {

        var hidden = $("#" + action + "Variants");
        var hiddenVal = hidden.val();

        var arr = new Array();

        // hidden에서 값을 가져와서, arr에 할당
        if (hiddenVal.length > 0) {
            if (hiddenVal.indexOf(",") === -1)
                arr.push(hiddenVal);                   // 1ea
            else
                arr.push(hiddenVal.split(","));        // 1ea 이상
        }

        // 중복 값 체크 후 arr 추가
        var chk = false;
        $.each(arr, function () {
            if (selectItem.val() === arr) {
                chk = true;
                return true;
            }
        });

        if (chk === false) {
            // hidden에 값 재입력
            arr.push(selectItem.val());
            hidden.val(arr.join(","));

            // select list 추가
            var dl = $("#EditSelect");
            var dt = $("<dt>");
            dl.append(dt);

            var inputItem = $("<input>", {
                type: "text",
                value: selectItem.text(),
                class: "form-control",
                readonly: true,
                style: "width:13.5rem"
            });
            dt.append(inputItem);

            var btnIcon = $("<button>", { class: "btn btn-default", type: "button", value: selectItem.val() });
            dt.append(btnIcon);

            var iIcon = $("<i>", { class: "fa fa-minus-circle" });
            btnIcon.append(iIcon);
        }

        $("#EditVariantId").val("");
    }
}
function RemoveItem(action, e) {

    $(e.currentTarget).parent().remove();

    var list = $("#" + action + "Select");          // dl
    var option = $("#" + action + "Variants");      // hidden

    // set array
    var arr = new Array();
    arr = option.val().split(",");

    for (var i = arr.length; i >= 0; i--) {
        if (arr[i] === $(e.currentTarget).val())
            arr.splice(i, 1);
    }

    option.val(arr.join(","));
    option.length === 0 && list.parent().parent().css("display", "none");
}
function RefControl(type, action) {

    var productId = $("#" + action + "ProductId");
    var mass = $("#" + action + "Mass");
    var quantity = $("#" + action + "Qty");
    var componentGroup = $("#" + action + "ComponentGroup");
    var elementType = $("#" + action + "ElementType");
    var obj = $("#" + action + "Object");
    var desc = $("#" + action + "Desc");

    switch (type) {
        case "Product":
            var equipmentGroup = $("#" + action + "EquipmentGroup");
            equipmentGroup.empty();

            var variants = $("#EditVariantId").siblings().remove();
            break;

        case "Variant":
            quantity.prop("readonly", false);
            break;

        case "ComponentGroup":
            //if (componentGroup.val() !== "SYSTEM")
            //    obj.prop("readonly", true);
            break;

        case "ElementType":
            if (elementType.val() === "VISIO") {
                mass.prop("readonly", false);
                obj.prop("readonly", false);
                desc.prop("readonly", false);

                componentGroup.val("SYSTEM");

            } else {
                mass.prop("readonly", true);
                obj.prop("readonly", true);
                desc.prop("readonly", true);
            }
            break;
    }
}
function SubmitClone(id) {
    $.ajax({
        type: "POST",
        url: "/WordMaps/Clone/",
        data: { id: id },
        success: function (response) {
            Search();
            toastr.success("Success copy");
        },
        failure: function (response) { toastr.fail(response); },
        error: function (response) { toastr.error(response); }
    });
}