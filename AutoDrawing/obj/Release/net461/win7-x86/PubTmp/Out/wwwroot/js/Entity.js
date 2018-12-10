$(window).on("load", function () {

    initialize();
    EntityList();

    SelectLJH($("select"));


    // #region Event
    // Create
    $("#FormCreate input").keydown(function (key) {
        if (key.keyCode === 13)
            $("#BtnSubmitCreate").trigger("click");
    });
    $("#BtnSubmitCreate").on("click", function () {
        $.ajax({
            type: "POST",
            url: "/Entities/CreateEntity/",
            data: $("#FormCreate").serialize(),
            success: function (result) {

                if (result === "Success") {

                    $("#DivCreate").modal("hide");
                    toastr.success("Success Create", "", { positionClass: "toast-bottom-right" });

                    EntityList();
                } else {
                    toastr.error(result, "", { positionClass: "toast-bottom-right" });
                }
            }
        });
    });

    // Edit
    $("#EntityTable").delegate("tr", "dblclick", function (e) {

        var id = $(e.currentTarget).find("input[type=\"hidden\"]").val();

        $.getJSON("/Entities/LoadItem", { id: id })
            .done(function (json) {

                $("#DivEdit").modal("show");

                var form = $("#FormEdit input, #FormEdit select");

                $.each(form, function () {
                    var name = $(this).prop("name");

                    if (!isEmpty(json[name])) {
                        $(this).val(json[name]);

                        $(this).is("select") && SelectLJH($(this));
                    }
                });
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                toastr.error("Load component", "Error", { positionClass: "toast-bottom-right" });
            });
    });
    $("#FormEdit input").keydown(function (key) {
        if (key.keyCode === 13)
            $("#BtnSubmitEdit").trigger("click");
    });
    $("#BtnSubmitEdit").on("click", function () {

        var formDate = $("#FormEdit").serialize();

        $.ajax({
            type: "POST",
            url: "/Entities/EditEntity/",
            data: formDate,
            success: function (result) {

                if (result === "Success") {

                    $("#DivEdit").modal("hide");
                    EntityList();
                    toastr.success("Success Edit", "", { positionClass: "toast-bottom-right" });

                } else {
                    toastr.error(result, "", { positionClass: "toast-bottom-right" });
                }
            }
        });
    });

    // Delete
    $("#BtnSubmitDelete").on("click", function () {
        var chkes = $("#EntityTable input:checked").siblings("input[type=\"hidden\"]");

        if (chkes.length === 0)
            toastr.error("삭제할 Item을 선택하세요.", "", { positionClass:"toast-bottom-right" });
        else {

            var arrId = new Array();

            $.each(chkes, function () {
                arrId.push(this.value);
            });

            $.ajax({
                type: "POST",
                url: "/Entities/DeleteEntity/",
                data: { arrId: arrId },
                success: function (result) {

                    if (result === "Success") {
                        $("#DivDelete").modal("hide");
                        EntityList();
                        toastr.success("Success Delete", "", { positionClass: "toast-bottom-right" });
                    } else {
                        toastr.error(result, "", { positionClass: "toast-bottom-right"});
                    }
                }
            });
        }
    });

    // Click
    $("#EntityTable").delegate("tr", "click", function (e) {

        var tr = $(this);
        var checkbox = $(this).find("input[type=\"checkbox\"]");


        if (!$(e.target).is("input[type=\"checkbox\"]"))
            checkbox.prop("checked", !checkbox.prop("checked"));

        checkbox.prop("checked") ? tr.addClass("table-info") : tr.removeClass("table-info");
        
    });
    // #endregion Event
});


// #region Function
function initialize() {
    var menuBar = $("#MenuBar");
    var ol = menuBar.find("ol.breadcrumb");

    li = $("<li>", { class: "breadcrumb-item active", text: "Entity" });
    ol.append(li);


    var btnGroup = menuBar.find("div.btn-group");

    var newGroup = $("<div>", { class: "btn-group mr-3" });
    btnGroup.before(newGroup);

    var btn = $("<button>", { id: "BtnCreate", type: "button", "data-toggle": "modal", "data-target": "#DivCreate", text: "CREATE", class: "btn success-color text-white" });
    newGroup.append(btn);

    btn = $("<button>", { id: "BtnDelete", type: "button", "data-toggle": "modal", "data-target": "#DivDelete", text: "DELETE", class: "btn danger-color text-white" });
    newGroup.append(btn);
}
function EntityList() {

    loading.show();

    $.getJSON("/Entities/EntityList", function (json) {
        var tbody = $("#EntityTable > tbody");
        tbody.empty();


        $.each(json, function () {

            var tr = $("<tr>");
            tbody.prepend(tr);


            for (var i = 0; i < 3; i++) {

                var td = $("<td>");
                tr.append(td);

                switch (i) {
                    case 0:
                        var id = $("<input>", { type: "hidden", value: this["Id"] });
                        td.append(id);

                        var chk = $("<input>", { type: "checkbox" });
                        td.append(chk);

                        var span = $("<span>", { text: this["Name"], class: "ml-3" });
                        td.append(span);
                        break;

                    case 1:
                        span = $("<span>", { text: this["Code"] });
                        td.append(span);
                        break;

                    case 2:
                        span = $("<span>", { text: this["CompanyIdx"] || " " });
                        td.append(span);
                        break;
                }
            }
        });

        loading.hide();
    })
        .done(function () {
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            toastr.error("Load component", "Error", { positionClass: "toast-bottom-right" });
        });
}
// #endregion