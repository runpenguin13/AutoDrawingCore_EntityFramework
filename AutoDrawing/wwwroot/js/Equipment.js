$(window).on('load', function () {

    initialize();
    Search();


    // #region Search
    $('#SearchWord').keydown(function (e) {
        if (e.keyCode === 13)
            Search();
    });
    $('#Search').on('click', function () { Search(); });
    // #endregion Search


    // #region  [Event]
    // Create
    $('#FormCreate input').keydown(function (key) {
        if (key.keyCode === 13)
            $('#BtnSubmitCreate').trigger('click');
    });
    $('#BtnSubmitCreate').click(function () {

        var form = $('#FormCreate').serialize();

        $.ajax({
            type: 'POST',
            url: '/Equipments/Create/',
            data: form,
            success: function (result) {

                if (result === 'Success') {
                    $('#DivCreate').modal();
                    toastr.success('Success Create', '', { positionClass: 'toast-bottom-right' });

                    Search();
                } else {
                    toastr.error(result, '', { positionClass: 'toast-bottom-right' });
                }
            },
            error: function (reponse) {
                alert('error');
            }
        });
    });

    // Edit
    $('#EquipmentTable').delegate('tr', 'dblclick', function (e) {

        var id = $(e.currentTarget).find('input[type="hidden"]').val();

        $.getJSON('/Equipments/LoadItem', { id: id })
            .done(function (json) {

                $('#DivEdit').modal('toggle');


                var form = $('#FormEdit input');

                $.each(form, function () {
                    var name = $(this).prop('name');

                    if (!isEmpty(json[name])) {
                        $(this).val(json[name]);
                    }
                });
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });

    });
    $('#FormEdit input').keydown(function (key) {
        if (key.keyCode === 13)
            $('#BtnSubmitEdit').trigger('click');
    });
    $('#BtnSubmitEdit').click(function () {
        var form = $('#FormEdit').serialize();
        $.ajax({
            type: 'POST',
            url: '/Equipments/Edit/',
            data: form,
            success: function () {
                $('#DivEdit').modal('toggle');
                Search();
            },
            error: function (reponse) {
                alert('error');
            }
        });
    });

    // Delete
    $('#BtnSubmitDelete').click(function () {

        var chkes = $('#EquipmentTable input:checked').siblings('input[type="hidden"]');

        if (chkes.length === 0)
            toastr.error('삭제할 Item을 선택하세요.', '', { positionClass: 'toast-bottom-right' });
        else {

            var arrId = new Array();

            $.each(chkes, function () {
                arrId.push(this.value);
            });
        }

        $.ajax({
            type: 'POST',
            url: '/Equipments/Delete/',
            data: { arrId: arrId },
            success: function () {

                $('#DivDelete').modal('hide');
                toastr.success('Success Delete', '', { positionClass: 'toast-bottom-right' });

                Search();
            },
            failure: function (response) {
                alert("fail");
            },
            error: function (response) {
                alert('error');
            }
        });
    });

    // #endregion  [Event]

});


// #region  [Function]
function initialize() {
    var menuBar = $('#MenuBar');
    var ol = menuBar.find('ol.breadcrumb');

    li = $('<li>', { class: 'breadcrumb-item active', text: 'Equipment' });
    ol.append(li);


    var btnGroup = menuBar.find('div.btn-group');

    var newGroup = $("<div>", { class: "btn-group mr-3" });
    btnGroup.before(newGroup);

    var btn = $('<button>', { id: 'BtnCreate', type: 'button', 'data-toggle': 'modal', 'data-target': '#DivCreate', text: 'CREATE', class: 'btn success-color text-white' });
    newGroup.append(btn);

    btn = $('<button>', { id: 'BtnDelete', type: 'button', 'data-toggle': 'modal', 'data-target': '#DivDelete', text: 'DELETE', class: 'btn danger-color text-white' });
    newGroup.append(btn);
}
function Search() {

    var strFilter = $('#SearchWord').val();
    loading.show();

    $.getJSON('/Equipments/List/', { filter: strFilter })
        .done(function (json) {
            var tb = $('#EquipmentTable > tbody');
            tb.empty();

            $(json).each(function () {
                var tr = $('<tr>');
                tb.prepend(tr);

                for (var i = 0; i < 4; i++) {
                    var td = $('<td>');
                    tr.append(td);

                    switch (i) {
                        case 0:
                            var hidden = $('<input>', { type: 'hidden', value: this['Id'] });
                            td.append(hidden);

                            var chk = $('<input>', { type: 'checkbox' });
                            td.append(chk);

                            var span = $('<span>', { text: this['Group'], class: 'ml-3' });
                            td.append(span);
                            break;

                        case 1:
                            span = $('<span>', { text: this['Name'] });
                            td.append(span);
                            break;

                        case 2:
                            if (!isEmpty(this['FormalName'])) {
                                span = $('<span>', { text: this['FormalName'] });
                                td.append(span);
                            }
                            break;

                        case 3:
                            if (!isEmpty(this['Desc'])) {
                                span = $('<span>', { text: this['Desc'] });
                                td.append(span);
                            }
                            break;
                    }
                }
            });

            loading.hide();
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        });
}
    // #endregion  [Function]