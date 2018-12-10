var loading = $("#Loading").hide();


$(window).on("load", function () {
    initialize();
    LoadUserList();
});


function initialize() {

    var menu = $("#MenuBar");
    var ol = menu.find("ol.breadcrumb");

    var li = $("<li>", { class: "breadcrumb-item active", text: "권한 설정" });
    ol.append(li);


    var btnGroup = menu.find("div.btn-group");

    var newGroup = $("<div>", { class: "btn-group mr-3", id: "RoleDiv" });
    btnGroup.before(newGroup);

    var detailRole = $("<button>", { id: "DetailRole", type: "button", class: "btn btn-light rounded", text: "Role List" });
    newGroup.append(detailRole);

    detailRole.on("click", function () {

        LoadRoles();

        popup.fadeIn();
        overlay.fadeIn();
    });


    var popup = $("<div>", { class: "card popup", style: "display:none;" });
    detailRole.before(popup);

    // insert role
    var row = $("<div>", { class: "row" });
    popup.append(row);

    var col = $("<div>", { class: "col" });
    row.append(col);

    var inputGroup = $("<div>", { class: "input-group" });
    col.append(inputGroup);

    var input = $("<input>", { type: "text", "placeholder": "insert role", class: "form-control" });
    inputGroup.append(input);
    input.on("keydown", function (key) {
        if (key.keyCode === 13)
            $(this).siblings().find("button").trigger("click");
    });

    var groupAppend = $("<div>", { class: "input-group-append" });
    inputGroup.append(groupAppend);

    var btnAdd = $("<button>", { type: "button", class: "btn btn-light" });
    groupAppend.append(btnAdd);

    btnAdd.on("click", function () {
        var input = $(this).parent().siblings("input[type=\"text\"]");
        var word = input.val();

        if (isEmpty(word))
            return false;

        $.ajax({
            url: '/Manage/CreateRole',
            type: 'POST',
            data: { name: word },
            success: function () {
                input.val("");
                LoadRoles();
            },
            error: function (request, status, error) {
                toastr.error(error);
            }
        });
    });

    var icon = $("<i>", { class: "fas fa-plus" });
    btnAdd.append(icon);

    // role list
    var list = $("<div>", { id: "RoleList" });
    popup.append(list);


    // overlay
    var overlay = $("<div>", { class: "overlay" });
    popup.before(overlay);

    overlay.on("click", function () {
        var popup = $(this).siblings(".popup");
        var overlay = $(this);

        popup.fadeOut();
        overlay.fadeOut();
    });
}

function LoadUserList() {

    var tbody = $("#UserList > tbody");
    tbody.empty();


    $.getJSON("/Manage/LoadUserList", function (json) {

        $.each(json, function () {

            var tr = $("<tr>");
            tbody.append(tr);

            for (var i = 0; i < 3; i++) {

                var td = $("<td>");
                tr.append(td);

                var userId = this["Id"];

                switch (i) {
                    case 0:
                        var userName = $("<span>", { text: this["Email"] });
                        td.append(userName);
                        break;
                    case 1:
                        var arrRole = this["Roles"];

                        $.each(arrRole, function () {

                            var btnAuth = $("<button>", {
                                type: "button",
                                value: this,
                                text: this,
                                class: "btn btn-light",
                                "data-userId": userId
                            });

                            td.append(btnAuth);

                            var iconClose = $("<i>", { class: "fas fa-times ml-2" });
                            btnAuth.append(iconClose);

                            iconClose.on("click", function () {

                                var userId = $(this).parent().attr("data-userId");
                                var roleId = $(this).parent().val();

                                UnAssignAuthorize(userId, roleId);
                            });
                        });
                        break;
                    case 2:
                        td.css("text-align", "right");

                        var btnAddAuth = $("<button>", {
                            type: "button",
                            class: "btn btn-light font-size-7",
                            value: this["Id"]
                        });

                        td.append(btnAddAuth);

                        var iconAdd = $("<i>", { class: "fas fa-plus" });
                        btnAddAuth.append(iconAdd);
                        

                        btnAddAuth.on("click", function (e) {

                            $(this).siblings().remove();

                            var popup = $("<div>", { class: "card popup" });
                            $(this).before(popup);

                            var overlay = $("<div>", { class: "overlay" });
                            popup.before(overlay);

                            overlay.on("click", function () {
                                $(this).siblings(".popup").remove();
                                $(this).remove();
                            });

                            $.getJSON("/Manage/LoadRoles", function (json) {
                                $.each(json, function () {
                                    var item = $("<button>", { type: "button", class: "dropdown-item", value: this, text: this, "data-userId": userId });
                                    popup.append(item);

                                    item.on("click", function () {
                                        var roleId = $(this).val();
                                        var userId = $(this).attr("data-userId");

                                        AssignAuthorize(userId, roleId);
                                    });
                                });

                                popup.fadeIn();
                                overlay.fadeIn();
                            });

                        });

                        break;
                }
            }

        });

    });
}
function AssignAuthorize(userId, roleId) {
    $.ajax({
        url: '/Manage/AssignAuthorize',
        type: 'POST',
        data: { userId: userId, roleId: roleId },
        success: function () {
            LoadUserList();
        },
        error: function (error) {
            toastr.error(error);
        }
    });
}
function UnAssignAuthorize(userId, roleId) {
    $.ajax({
        url: '/Manage/UnAssignAuthorize',
        type: 'POST',
        data: { userId: userId, roleId: roleId },
        success: function () {
            LoadUserList();
        },
        error: function (error) {
            toastr.error(error);
        }
    });
}

function LoadRoles() {

    $.getJSON("/Manage/LoadRoles", function (json) {

        var roleList = $("#RoleList");
        roleList.empty();

        $.each(json, function () {
            var row = $("<div>", { class: "row mt-2" });
            roleList.append(row);

            var col = $("<div>", { class: "col" });
            row.append(col);

            var button = $("<button>", { type: "button", class: "btn btn-light w-100", value: this, text: this });
            col.append(button);

            var iconClose = $("<i>", { class: "fas fa-times ml-2" });
            button.append(iconClose);

            iconClose.on("click", function () {

                var id = $(this).parent().val();

                $.ajax({
                    url: '/Manage/DeleteRole',
                    type: 'POST',
                    data: { id: id },
                    success: function () {
                        LoadRoles();
                    },
                    error: function (request, status, error) {
                        toastr.error(error);
                    }
                });
            });
        });
    });
}