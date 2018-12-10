$(window).on('load', function () {

    initialize();
    Search();       // Page load시 전체 Product list 불러옴

    SelectLJH($('select'));


    // #region Search
    $('#SearchWord').keydown(function (e) {
        if (e.keyCode === 13)
            Search();
    });
    $('#Search').on('click', function () { Search(); });
    $('#CategoryList button').click(function (e) {

        var select = $(e.currentTarget);

        var hidden = $('#Category');
        hidden.val(select.val());


        var btn = select.parent().siblings('.dropdown-toggle');
        btn.find('span').text(select.val());

        Search();
    });
    // #endregion Search


    // #region  [Event]
    // Create
    $('#BtnSubmitCreate').click(function () {
        $.ajax({
            type: 'POST',
            url: '/Products/CreateProduct/',
            data: $('#FormCreate').serialize(),
            success: function () {
                $('#DivCreate').modal('toggle');
                Search();
            }
        });
    });

    // Edit
    $('#DivEdit').on('show.bs.modal', function () {

        var productId = $('#MainId').val();

        $.getJSON('/Products/LoadEditProduct', { proId: productId })
            .done(function (json) {

                var controls = $('#FormEdit input, #FormEdit select');

                $.each(controls, function () {
                    $(this).val(json[this.name]);

                    if ($(this).is('select'))
                        SelectLJH($(this));
                });
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ', ' + error;
                console.log(err);
            });
    });
    $('#BtnSubmitEdit').click(function () {
        $.ajax({
            url: '/Products/SaveEditProduct',
            data: $('#FormEdit').serialize(),
            success: function (response) {
                $('#DivEdit').modal('toggle');
                toastr.success('Success save');
                Search();
            }
        });
    });
    $('#FormEdit input').keydown(function (key) {
        if (key.keyCode === 13)
            $('#BtnSubmitEdit').trigger('click');
    });

    // Delete
    $('#BtnSubmitDelete').click(function () {
        var items = new Array();

        $.each($('#TbList input:checked'), function () {
            items.push($(this).val());
        });

        $.ajax({
            type: 'POST',
            url: '/Products/DeleteProduct/',
            data: { json: JSON.stringify(items) },
            success: function (response) {
                if (response === 'Success') {
                    $('#DivDelete').modal('toggle');
                    Search('', '');
                }
                else
                    alert(response);
            }
        });
    });

    // Copy
    $('#BtnSubmitCopy').click(function () {
        var items = new Array();

        $.each($('#TbList input:checked'), function () {
            items.push($(this).val());
        });

        $.ajax({
            type: 'POST',
            url: '/Products/CopyProducts/',
            data: { json: JSON.stringify(items) },
            success: function (response) {
                $('#DivCopy').modal('toggle');
                toastr.success('Success copy', 'Success', { positionClass: 'toast-bottom-right' });
                Search('', '');
            }
        });
    });

    $('#EditEquip').on('change', function () {

        var equipId = $(this).val();

        if (equipId === "7") {
            $('#EditXComponent').parent().parent().css('display', 'none');
            $('#EditXComponent').val('');
        }
        else {
            $('#EditXComponent').parent().parent().css('display', 'flex');
        }

    });
    $('#Equipment').on('change', function () {

        var equipId = $(this).val();

        if (equipId === "7") {
            $('#XComponent').parent().parent().css('display', 'none');
            $('#XComponent').val('');
        }
        else {
            $('#XComponent').parent().parent().css('display', 'flex');
        }
    });


    // List
    $('#TbList').delegate('tr', 'dblclick', function (e) {

        var type = $(e.currentTarget).data('type');
        var proId = $(e.currentTarget).data('id');

        if (type === 'PARTS') {
            $('#DivEdit #MainId').val(proId);
            $('#DivEdit').modal('toggle');
        } else {
            var href = '/Products/' + proId + '/Edit/';
            location.href = href;
        }
    });
    $('#TbList').delegate('tr', 'click', function (e) {

        if ($(e.target).prop('type') !== 'checkbox') {
            var checkbox = $(e.currentTarget).find('input[type="checkbox"]');
            checkbox.prop('checked', !checkbox.prop('checked'));
        }

        var tr = $(e.currentTarget);
        tr.toggleClass('table-active');
    });

    $('#ulCategory button').click(function (e) {

        var select = $(e.currentTarget);

        var hidden = $('#Category');
        hidden.val(select.val());


        var btn = select.parent().siblings('.dropdown-toggle');
        btn.find('span').text(select.val());


        Search();
    });
    // #endregion  [Event]
});


// #region  [Function]
function initialize() {
    var menuBar = $('#MenuBar');
    var ol = menuBar.find('ol.breadcrumb');

    var li = $('<li>', { class: 'breadcrumb-item active', text: 'Product' });
    ol.append(li);


    var btnGroup = menuBar.find('div.btn-group');

    var newGroup = $("<div>", { class: "btn-group mr-3" });
    btnGroup.before(newGroup);

    var btn = $('<button>', { id: 'BtnCreate', type: 'button', 'data-toggle': 'modal', 'data-target': '#DivCreate', text: 'CREATE', class: 'btn success-color text-white' });
    newGroup.append(btn);

    btn = $('<button>', { id: 'BtnCopy', type: 'button', 'data-toggle': 'modal', 'data-target': '#DivCopy', text: 'COPY', class: 'btn warning-color text-white' });
    newGroup.append(btn);

    btn = $('<button>', { id: 'BtnDelete', type: 'button', 'data-toggle': 'modal', 'data-target': '#DivDelete', text: 'DELETE', class: 'btn danger-color text-white' });
    newGroup.append(btn);
}
function Search() {

    loading.show();

    var category = $('#Category').val();
    var searchWord = $('#SearchWord').val();

    $.getJSON('/Products/LoadProducts', { search: searchWord, category: category })
        .done(function (json) {

            var tbody = $('#TbList > tbody');
            tbody.empty();


            $.each(json, function () {

                var tr = $('<tr>', { 'data-id': this['ProductId'], 'data-type': this['Completion'] });
                tbody.prepend(tr);

                for (var i = 0; i < 6; i++) {
                    var td = $('<td>');
                    tr.append(td);

                    switch (i) {
                        case 0:
                            var chk = $('<input>', { type: 'checkbox', value: this['ProductId'] });
                            td.append(chk);

                            if (this['Completion'] === 'GOODS')
                                var spanCompletion = $('<span>', { text: 'Model' });
                            else
                                spanCompletion = $('<span>', { text: 'Component' });

                            td.append(spanCompletion);
                            break;

                        case 1:
                            var spanEquipment = $('<span>', { text: this['EquipmentName'] });
                            td.append(spanEquipment);
                            break;

                        case 2:
                            if (this['Title'] !== null) {
                                var spanTitle = $('<span>', { text: this['Title'] });
                                td.append(spanTitle);
                            }
                            break;

                        case 3:
                            if (this['ProductModel'] !== null) {
                                var spanModel = $('<span>', { text: this['ProductModel'] });
                                td.append(spanModel);
                            }
                            break;

                        case 4:
                            if (this['Mass'] !== null) {
                                var spanMass = $('<span>', { text: this['Mass'] });
                                td.append(spanMass);
                            }
                            break;

                        case 5:
                            td.addClass('text-right');

                            var btnCopy = $('<button>', { class: 'btn btn-light', title: 'Copy', value: this['ProductId'] });
                            td.append(btnCopy);

                            var iconCopy = $('<i>', { class: 'far fa-copy' });
                            btnCopy.append(iconCopy);

                            btnCopy.on('click', function () {

                                var arrProId = new Array();
                                arrProId.push($(this).val());

                                $.ajax({
                                    type: 'POST',
                                    url: '/Products/CopyProducts',
                                    data: { json: JSON.stringify(arrProId) },
                                    success: function () {
                                        toastr.success('Success copy');
                                        Search();
                                    },
                                    error: function (error) {
                                        console.log(error);
                                    }
                                });
                            });
                            break;
                    }
                }
            });

            loading.hide();
        });
}
function CopyProduct() {
    var arrProId = new Array();

    $.each($('.table-active input'), function () {
        var proId = $(this).val();
        arrProId.push(proId);
    });

    $.ajax({
        type: 'POST',
        url: '/Products/CopyProducts',
        data: { json: JSON.stringify(arrProId) },
        success: function () {
            toastr.success('Success copy');
            Search();
        }
    });
}
    // #endregion  [Function]