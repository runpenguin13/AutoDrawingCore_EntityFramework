$(window).on('load', function () {

    Initialize();


    // #region Filter
    $('#FilterEquip').change(function () { LoadItem('Equipment', 'Filter'); });
    $('#FilterPro').change(function () { LoadItem('Product', 'Filter'); });
    $('#FilterFile').change(function () { LoadVisioMapList(); });
    // #endregion Filter    


    // #region Create modal
    $('#DivCreate').on('shown.bs.modal', function (e) {
        var selects = $(this).find('select');
        SelectLJH(selects);

        LoadItem('', 'Create');


        // #region Relations
        var tbody = $('#CreateRelation tbody');
        tbody.empty();

        // add button
        var tr = $('<tr>');
        tbody.append(tr);

        var td = $('<td>', { colspan: 9 });
        tr.append(td);

        var addbutton = $('<button>', { type: 'button', id: 'BtnAddRelation', class: 'btn btn-light', style: 'width:100%;' });
        addbutton.on('click', function () {
            AddRelation($(this), null);
            //AddRelation(tr, null, null, null, null, null, null, null, null, null, null, 'Before', 'Create', null);
        });
        td.append(addbutton);

        i = $('<i>', { class: 'fa fa-plus' });
        addbutton.append(i);
        // #endregion Relations

        $('#DivShape > .card-body').find('div.card').remove();
    });
    $('#FormCreate input').keydown(function (key) {
        if (key.keyCode === 13)
            $('#BtnSubmitCreate').trigger('click');
    });

    $('#CreateEquip').change(function () { LoadItem('Equipment', 'Create'); });
    $('#CreatePro').change(function () { LoadItem('Product', 'Create'); });

    $('#CreateGroup').change(function () { ChangeGroup('Create'); });

    // Create - Relation shape관련하여 Code 변경해야 함 (Edit modal 참고)
    $('#BtnSubmitCreate').click(function () {

        var rows = $('#DivCreate .rowShapes');
        var arrShape = new Array();

        $.each(rows, function () {

            var type = $(this).find('select[name="Type"]');
            var name = $(this).find('input[name="Name"]');
            var text = $(this).find('input[name="Text"]');
            var reShape = $(this).find('select[name="ReShape"]');

            if (isEmpty(reShape.val()))
                reShape = '';
            else
                reShape = reShape.val();

            var str = type.val() + ',' + name.val() + ',' + text.val() + ',' + reShape;
            arrShape.push(str);
        });


        // #region Relations
        rows = $('#CreateRelation tr.RelationRow');
        var arrRelation = new Array();

        $.each(rows, function () {

            var relationId = $(this).find('input[name="Id"]');
            var changeVal = $(this).find('input[name="ChangeVal"]');
            var relationType = $(this).find('select[name="RelationType"]');

            var method = $(this).find('input[name="Method"]');
            var value = $(this).find('input[name="Value"]');
            var intEquipmentId = $(this).find('input[name="IntEquipmentId"]');
            var intProductId = $(this).find('input[name="IntProductId"]');
            var reLayerId = $(this).find('input[name="ReLayerId"]');
            var reLayerValue = $(this).find('input[name="ReLayerValue"]');


            var obj = new Object();
            arrRelation.push(obj);

            obj.RelationId = relationId.val();
            obj.ChangeVal = changeVal.val();
            obj.RelationType = relationType.val();
            obj.Method = method.val();
            obj.Value = value.val();
            obj.IntEquipmentId = intEquipmentId.val();
            obj.IntProductId = intProductId.val();
            obj.ReLayerId = reLayerId.val();
            obj.ReLayerValue = reLayerValue.val();


            var variants = $(this).find('button[name="Variant"]');

            if (variants.length > 0) {
                var strVariantsIds = null;

                $.each(variants, function () {

                    if (strVariantsIds === null)
                        strVariantsIds = $(this).val();
                    else
                        strVariantsIds += ',' + $(this).val();
                });

                obj.VariantIds = strVariantsIds;
            }
        });
        // #endregion Relations


        $('#DivCreate input[name="strShapes"]').val(JSON.stringify(arrShape));
        $('#DivCreate input[name="strRelations"]').val(JSON.stringify(arrRelation));


        $.ajax({
            type: 'POST',
            url: '/VisioMaps/Create/',
            data: $('#FormCreate').serialize(),
            success: function () {
                $('#DivCreate').modal('toggle');
                LoadVisioMapList();
            }
        });
    });
    // #endregion Create modal


    // #region  Edit modal
    $('#FormEdit input').keydown(function (key) {
        if (key.keyCode === 13)
            $('#BtnSubmitEdit').trigger('click');
    });

    $('#EditEquip').change(function () { LoadItem('Equipment', 'Edit'); });
    $('#EditPro').change(function () { LoadItem('Product', 'Edit'); });

    $('#EditGroup').change(function () { ChangeGroup('Edit'); });

    $('#BtnSubmitEdit').click(function () {

        var form = $('#FormEdit');
        var objForm = objForm_Relation(form);

        var strRel = form.find('input[name="strRelations"]');
        strRel.val(JSON.stringify(objForm));

        $.ajax({
            type: 'POST',
            url: '/VisioMaps/Edit/',
            data: $('#FormEdit').serialize(),
            success: function (response) {
                $('#DivEdit').modal('toggle');
                LoadVisioMapList();
            }
        });
    });
    // #endregion  Edit modal


    // other submit
    $('#BtnSubmitDelete').on('click', function () {

        var rows = $('#List input:checked');

        var arrVsoId = Array();
        $.each(rows, function () {
            var id = $(this).siblings('input').val();
            arrVsoId.push(id);
        });


        $.ajax({
            type: 'POST',
            url: '/VisioMaps/Delete/',
            data: { json: JSON.stringify(arrVsoId) },
            success: function (msg) {

                if (msg === 'Success') {
                    $('#DivDelete').modal('hide');
                    LoadVisioMapList();

                    toastr.success('Success delete', '', { positionClass: 'toast-bottom-right' });
                } else
                    toastr.error(msg);
            }
        });
    });
    $('#BtnSubmitCopy').on('click', function () {

        var arrVisioMaps = new Array();

        var rows = $('#List input:checked');
        $.each(rows, function () {
            var value = $(this).siblings('input[type="hidden"]').val();
            arrVisioMaps.push(value);
        });

        $('#DivCopy').modal('hide');
        SubmitClone(arrVisioMaps);
    });

    // row
    $('#List').delegate('tr', 'click', function (e) {
        if ($(e.target).prop('type') !== 'checkbox') {
            var checkbox = $(e.currentTarget).find('input[type="checkbox"]');
            checkbox.prop('checked', !checkbox.prop('checked'));
        }

        $(e.currentTarget).toggleClass('table-active');
    });


    // Common
    $('.btnAllRemoveShape').on('click', function () {

        var body = $(this).parent().parent().parent().siblings();
        var rows = body.find('div.rowShapes');

        $.each(rows, function () {

            var id = $(this).find('input[name="Id"]').val();
            var changeVal = $(this).find('input[name="ChangeVal"]');

            if (isEmpty(id))
                $(this).parent().remove();
            else {
                $(this).parent().css('display', 'none');
                changeVal.val('D');
            }
        });
    });
    $('.btnAddShape').on('click', function () {

        var body = $(this).parent().parent().parent().siblings('ul.list-group');
        //var body = $('#DivEdit #DivShape .divShapes');
        AddShape(body, null, null, null, null, null);
    });
});


function Initialize() {

    var menuBar = $('#MenuBar');
    var ol = menuBar.find('ol.breadcrumb');

    li = $('<li>', { class: 'breadcrumb-item active', text: 'Visiomap' });
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


    var dnEquip = $('#FilterEquip');
    var dnPro = $('#FilterPro');
    var dnFile = $('#FilterFile');

    $.getJSON('/VisioMaps/LoadItem', { equipId: null, proId: null })
        .done(function (json) {

            var equipments = json['Equipments'];

            if (isEmpty(equipments))
                toastr('Equipments item이 없습니다.');


            dnEquip.empty();

            dnEquip.append($('<option>', {
                text: '-- Please select --',
                value: ''
            }));

            $.each(equipments, function () {
                var option = $('<option>', {
                    value: this['EquipmentId'],
                    text: this['EquipmentName']
                });
                dnEquip.append(option);
            });

            SelectLJH(dnEquip);
            SelectLJH(dnPro);
            SelectLJH(dnFile);

            LoadVisioMapList();
        });
}

// Equipment, Product, File 선택 시
function LoadItem(type, action) {

    var dnEquip = $('#' + action + 'Equip');
    var dnPro = $('#' + action + 'Pro');
    var dnFile = $('#' + action + 'File');

    if (type === 'Equipment') {
        dnPro.empty();
        dnFile.empty();
    } else if (type === 'Product') {
        dnFile.empty();
    }

    $.getJSON('/VisioMaps/LoadItem', { equipId: dnEquip.val(), proId: dnPro.val() })
        .done(function (json) {

            var equipments = json['Equipments'];
            var products = json['Products'];
            var files = json['Files'];

            for (var i = 0; i < 3; i++) {
                var obj;
                var control;

                if (i === 0) {
                    obj = equipments;
                    control = dnEquip;
                }
                else if (i === 1) {
                    obj = products;
                    control = dnPro;
                }
                else {
                    obj = files;
                    control = dnFile;
                }
                    

                if (!isEmpty(obj)) {
                    control.empty();

                    var opt = $("<option>", { text: "-- Please select --", value: "" });
                    control.append(opt);

                    $.each(obj, function () {
                        opt = $("<option>");

                        if (i === 0) {
                            opt.val(this["EquipmentId"]);
                            opt.text(this["EquipmentName"]);
                        } else if (i === 1) {
                            opt.val(this["ProductId"]);
                            opt.text(this["ProductModel"]);
                        } else {
                            opt.val(this["WordMapId"]);
                            opt.text(this["FileName"]);
                        }

                        control.append(opt);
                    });

                    SelectLJH(control);
                }
            }

            if (action === 'Filter')
                LoadVisioMapList();
            else if (type === 'Product')
                LoadVariantList(action);
        });
}


//VisioMaps 목록 불러오기
function LoadVisioMapList() {

    var equipId = $('#FilterEquip').val();
    var proId = $('#FilterPro').val();
    var file = $('#FilterFile').val();

    loading.show();

    $.getJSON('/VisioMaps/LoadVisioMapList/', { equipId: equipId, goodsId: proId, fileId: file })
        .done(function (json) {

            var tb = $('#List tbody');
            tb.empty();

            $.each(json, function () {

                var tr = $('<tr>', { id: this['VsoId'] });
                tb.prepend(tr);

                for (var i = 0; i < 7; i++) {
                    var td = $('<td>');
                    tr.append(td);

                    switch (i) {
                        case 0:
                            var hidden = $('<input>', { type: 'hidden', value: this['VsoId'] });
                            td.append(hidden);

                            var chk = $('<input>', { type: 'checkbox', class: 'mr-3' });
                            td.append(chk);

                            var spanGroup = $('<span>', { text: this['Group'].slice(0, 1), class: this['Group'].slice(0, 1) });
                            td.append(spanGroup);

                            break;

                        case 1:
                            var spanEquip = $('<span>', { text: this['EquipmentGroup'] });
                            td.append(spanEquip);

                            break;

                        case 2:
                            var spanPro = $('<span>', { text: this['ProductNumber'] });
                            td.append(spanPro);

                            break;

                        case 3:
                            var spanFile = $('<span>', { text: this['FileName'] });
                            td.append(spanFile);

                            break;

                        case 4:
                            if (this['VariantNumber'] !== null) {
                                var spanCompt = $('<span>', { text: this['VariantNumber'] });
                                td.append(spanCompt);
                            }
                            break;

                        case 5:
                            var spanTitle = $('<span>', { text: this['Title'] });
                            td.append(spanTitle);

                            break;

                        case 6:
                            td.css('text-align', 'right');

                            var btnCopy = $('<button>', { type: 'button', class: 'btn btn-light', value: this['VsoId'] });
                            btnCopy.on('click', function () {
                                var arrVisioMaps = new Array();
                                var visiomapId = $(this).val();

                                arrVisioMaps.push(visiomapId);

                                SubmitClone(arrVisioMaps);
                            });
                            td.append(btnCopy);

                            var iCopy = $('<i>', { class: 'far fa-copy' });
                            btnCopy.append(iCopy);
                            break;
                    }
                }

                tr.on('dblclick', function (e) {
                    if (e.target.type === 'checkbox')
                        return true;

                    var id = $(this).attr("Id");
                    Load_EditItem(id);                    
                });
            });

            loading.hide();
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ', ' + error;
            alert('Request Failed: ' + err);
        });
}


// row dbclick
function Load_EditItem(visioId) {

    // #region All clear
    var controls = $('#DivEdit input, #DivEdit select');

    $.each(controls, function () {

        var control = $(this);
        var name = $(this).prop('name');
        
        if (name === 'Group' || name === 'Default' || name === 'ReLayerVal')
            return true;

        if (control.is('input'))
            control.val('');
        else if (control.is('select'))
            control.empty();
    });
    // #endregion


    $('#EditId').val(visioId);

    // #region item information
    $.getJSON('/VisioMaps/LoadVisioMapItem', { visioId: visioId })
        .done(function (json) {

            var itemInfo = json['ItemInfo'];

            var equipmentId = itemInfo['EquipmentId'];
            var productId = itemInfo['ProductId'];
            var fileId = itemInfo['WordMapId'];


            // #region EquipmentList
            $.getJSON('/VisioMaps/EquipmentList', function (json_Equipments) {

                var dnEquipment = $('#EditEquip');
                dnEquipment.empty();

                $.each(json_Equipments, function () {
                    var option = $('<option>', { value: this['Id'], text: this['Name'] });
                    dnEquipment.append(option);
                });

                dnEquipment.val(equipmentId);
                SelectLJH(dnEquipment);
            });
            // #endregion EquipmentList


            // #region ProductList
            $.getJSON('/VisioMaps/ProductList', { equipmentId: equipmentId })
                .done(function (json_Products) {

                    var dnProduct = $('#EditPro');
                    dnProduct.empty();

                    $.each(json_Products, function () {
                        var option = $('<option>', { value: this['Id'], text: this['Model'] });
                        dnProduct.append(option);
                    });

                    if (!isEmpty(productId))
                        dnProduct.val(productId);

                    SelectLJH(dnProduct);
                })
                .fail(function (error) { console.log(error); });
            // #endregion ProductList


            // #region FileList
            $.getJSON('/VisioMaps/FileList', { productId: productId })
                .done(function (json_FileList) {
                    
                    var dnFileList = $('#EditFile');
                    dnFileList.empty();

                    $.each(json_FileList, function () {
                        var option = $('<option>', { value: this['Id'], text: this['FileName'] });
                        dnFileList.append(option);
                    });

                    if (!isEmpty(fileId))
                        dnFileList.val(fileId);

                    SelectLJH(dnFileList);
                })
                .fail(function (error) { console.log(error); });
            // #endregion FileList


            // #region Layer information
            var dnGroup = $('#EditGroup');
            var groupValue = itemInfo['Group'];
            dnGroup.val(groupValue).trigger("change");
            //SelectLJH(dnGroup);

            var dnDefault = $('#EditDef');
            var defaultValue = itemInfo['Default'];
            dnDefault.val(isEmpty(defaultValue) ? '' : defaultValue);
            SelectLJH(dnDefault);

            var txtTitle = $('#EditTitle');
            var titleValue = itemInfo['Title'];
            txtTitle.val(isEmpty(titleValue) ? '' : titleValue);

            var txtEnable = $('#EditEnable');
            var enableValue = itemInfo['EnableLayer'];
            txtEnable.val(isEmpty(enableValue) ? '' : enableValue);
            // #endregion Layer information


            // #region Shapes
            var divShape = $('#Edit_DivShape .list-group');
            divShape.empty();

            var arrShape = json['Shapes'];

            $.each(arrShape, function () {
                var visiomapId = this['VisioMapId'];
                var type = this['Type'];
                var name = this['Name'];
                var text = this['Text'];
                var reShape = this['ReShape'];

                AddShape(divShape, visiomapId, type, name, text, reShape);
            });
            // #endregion Shapes


            // #region Relations
            var relationBody = $('#EditRelation tbody');
            relationBody.empty();

            // bottom add button
            var tr = $('<tr>');
            relationBody.append(tr);

            var td = $('<td>', { colspan: 9 }); 
            tr.append(td);

            var addbutton = $('<button>', { type: 'button', id: 'BtnAddRelation', class: 'btn btn-white m-0', style: 'width:100%;' });
            addbutton.on('click', function () {
                var productId = $('#EditPro').val();
                AddRelation($(this), null);
            });
            td.append(addbutton);

            var fa = $('<i>', { class: 'fa fa-plus' });
            addbutton.append(fa);


            var relations = json['Relations'];

            for (var k = 0; k < relations.length; k++)
                AddRelation(addbutton, relations[k]);
            // #endregion Relations

            $("#DivEdit").modal("show");
            loading.hide();
        })
        .fail(function (error) { console.log(error); });
    // #endregion item information
}
function AddRelation(addButton, id) {

    $.getJSON('/VisioMaps/LoadRelation', { id: id })
        .done(function (json_Relation) {          

            var relationId, visiomapId, method, value, variantIds, intEquipmentId, intProductId, reLayerId, reLayerValue, productId;

            if (!isEmpty(id)) {
                visiomapId = json_Relation['VisiomapId'];
                method = json_Relation['Method'];
                value = json_Relation['Value'];
                variantIds = json_Relation['VariantIds'];
                intEquipmentId = json_Relation['IntEquipmentId'];
                intProductId = json_Relation['IntProductId'];
                reLayerId = json_Relation['ReLayerId'];
                reLayerValue = json_Relation['ReLayerValue'];
                productId = json_Relation['ProductId'];
            }

            // relation add button
            var tr_addButton = addButton.parent().parent();

            var tr = $('<tr>', { 'class': 'RelationRow' });
            tr_addButton.before(tr);
            tr.keydown(function (key) {
                if (key.keyCode === 13)
                    $('#BtnSubmitEdit').trigger('click');
            });


            for (var k = 0; k < 8; k++) {

                switch (k) {
                    case 0:
                        // #region id, change value
                        var input_id = $('<input>', { type: 'hidden', name: 'RelationId', value: isEmpty(id) ? '' : id });
                        tr.append(input_id);

                        var input_change = $('<input>', { type: 'hidden', name: 'ChangeVal', value: isEmpty(id) ? 'A' : '' });
                        tr.append(input_change);
                        // #endregion id, change value

                        // #region control
                        var td_intEquip = $('<td>', { class: 'IntEquip' });
                        tr.append(td_intEquip);

                        $.getJSON('/VisioMaps/EquipmentList', function (json_equipments) {

                            var dn_intEquip = $('<select>', { class: 'form-control', name: 'intEquip' });
                            td_intEquip.append(dn_intEquip);

                            var opt_intEquip = $('<option>', { text: '-- Please select --', value: '' });
                            dn_intEquip.append(opt_intEquip);

                            $.each(json_equipments, function () {
                                opt_intEquip = $('<option>', { value: this['Id'], text: this['Name'] });
                                dn_intEquip.append(opt_intEquip);
                            });

                            if (!isEmpty(intEquipmentId))
                                dn_intEquip.val(intEquipmentId);

                            SelectLJH(dn_intEquip);

                            
                            // #region event
                            dn_intEquip.on('change', function () {
                                ChangeRelation(this);
                            });
                            // #endregion event
                        });
                        // #endregion control
                        break;
                    case 1:
                        // #region control
                        var td_intPro = $('<td>', { class: 'IntPro' });
                        tr.append(td_intPro);

                        if (!isEmpty(intEquipmentId)) {
                            $.getJSON('/VisioMaps/ProductList', { equipmentId: intEquipmentId })
                                .done(function (json_products) {

                                    var dn_intProduct = $('<select>', { class: 'form-control', name: 'intProduct' });
                                    td_intPro.append(dn_intProduct);

                                    var opt_intProduct = $('<option>', { text: '-- Please select --', value: '' });
                                    dn_intProduct.append(opt_intProduct);

                                    $.each(json_products, function () {
                                        opt_intProduct = $('<option>', { value: this['Id'], text: this['Model'] });
                                        dn_intProduct.append(opt_intProduct);
                                    });

                                    if (!isEmpty(intProductId))
                                        intProduct.val(intProductId);

                                    SelectLJH(dn_intProduct);


                                    // #region event
                                    dn_intProduct.on('change', function () {
                                        ChangeRelation(this);
                                    });
                                    // #endregion event
                                })
                                .fail(function (error) { console.log(error); });
                        }
                        // #endregion control
                        break;
                    case 2:
                        // #region control
                        var td_component = $('<td>', { class: 'Component' });
                        tr.append(td_component);

                        if (isEmpty(productId)) {
                            productId = td_component.parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().find('select[name="ProductId"]').val();
                        }

                        $.getJSON('/VisioMaps/ComponentList', { productId: isEmpty(intEquipmentId) && isEmpty(intProductId) ? productId : intProductId })
                            .done(function (json_components) {

                                if (!isEmpty(json_components)) {

                                    var dn_component = $('<select>', { class: 'form-control', name: 'component' });
                                    td_component.append(dn_component);

                                    var opt_component = $('<option>', { text: '-- Please select --', value: '' });
                                    dn_component.append(opt_component);

                                    $.each(json_components, function () {

                                        var txt = this['Model'] + ' [' + this['Name'] + ']';

                                        opt_component = $('<option>', {
                                            value: this['Id'],
                                            text: txt,
                                            title: 'Component: ' + txt + '\x0AGroup: ' + this['Group'] + (isEmpty(this['Remark']) ? '' : '\x0ARemark: ' + this['Remark'])
                                        });
                                        dn_component.append(opt_component);
                                    });

                                    SelectLJH(dn_component);

                                    // #region event
                                    dn_component.on('change', function () {
                                        ChangeRelation(this);
                                    });
                                    // #endregion event

                                    if (!isEmpty(variantIds)) {
                                        for (var n = 0; n < variantIds.length; n++)
                                            dn_component.val(variantIds[n]).trigger('change');
                                    }
                                }
                            })
                            .fail(function (error) { console.log(error); });
                        // #endregion control
                        break;
                    case 3:
                        var td_method = $('<td>', { class: 'Method' });
                        tr.append(td_method);

                        var input_method = $('<input>', { type: 'text', class: 'form-control', name: 'Method', value: method });
                        td_method.append(input_method);
                        break;
                    case 4:
                        var td_value = $('<td>', { class: 'Value' });
                        tr.append(td_value);

                        var v = value === undefined ? '' : value.split(',')[0];
                        var c = value === undefined ? '' : value.split(',')[1];

                        var input_value = $('<input>', { type: 'text', class: 'form-control', name: 'Value', value: v });
                        td_value.append(input_value);

                        if (method === 'GA') {
                            $.getJSON('/VisioMaps/ComponentList', { productId: isEmpty(intEquipmentId) && isEmpty(intProductId) ? productId : intProductId })
                                .done(function (json_components) {

                                    if (!isEmpty(json_components)) {

                                        var dn_component = $('<select>', { class: 'form-control', name: 'GAVariant' });
                                        td_value.append(dn_component);

                                        var opt_component = $('<option>', { text: '-- Please select --', value: '' });
                                        dn_component.append(opt_component);

                                        $.each(json_components, function () {

                                            var txt = this['Model'] + ' [' + this['Name'] + ']';

                                            opt_component = $('<option>', {
                                                value: this['Id'],
                                                text: txt,
                                                title: 'Component: ' + txt + '\x0AGroup: ' + this['Group'] + (isEmpty(this['Remark']) ? '' : '\x0ARemark: ' + this['Remark'])
                                            });
                                            dn_component.append(opt_component);
                                        });

                                        SelectLJH(dn_component);

                                        // #region event
                                        dn_component.on('change', function () {
                                            ChangeLJH($(this));
                                        });
                                        // #endregion event

                                        if (!isEmpty(c)) {
                                            dn_component.val(c).trigger('change');
                                        }
                                    }
                                })
                                .fail(function (error) { console.log(error); });
                        }
                        
                        break;
                    case 5:
                        var td_layer = $('<td>', { class: 'Layer' });
                        tr.append(td_layer);

                        $.getJSON('/VisioMaps/LayerList', { productId: isEmpty(intProductId) ? productId : intProductId })
                            .done(function (json_layers) {

                                var dn_layer = $('<select>', { class: 'form-control', name: 'ReLayerId' });
                                td_layer.append(dn_layer);

                                var opt_layer = $('<option>', { text: '-- Please select --', value: '' });
                                dn_layer.append(opt_layer);

                                $.each(json_layers, function () {
                                    opt_layer = $('<option>', { value: this['Id'], text: this['Title'], title: this['Wordmap'] });
                                    dn_layer.append(opt_layer);
                                });

                                dn_layer.val(reLayerId);
                                SelectLJH(dn_layer);
                            })
                            .fail(function (error) { console.log(error); });
                        break;
                    case 6:
                        var td_layerVal = $('<td>', { class: 'LayerVal' });
                        tr.append(td_layerVal);

                        var input_layerVal = $('<input>', { type: 'text', class: 'form-control', name: 'ReLayerValue', value: reLayerValue });
                        td_layerVal.append(input_layerVal);
                        break;
                    case 7:
                        var td_remove = $('<td>', { class: 'RemoveButton' });
                        tr.append(td_remove);

                        var btn_remove = $('<button>', { type: 'button', class: 'btn btn-yellow btn-Remove-Relation' });
                        td_remove.append(btn_remove);

                        var fa = $('<i>', { class: 'fa fa-minus' });
                        btn_remove.append(fa);

                        btn_remove.on('click', function () {
                            var tr = $(this).parent().parent();
                            var input_change = tr.find('input[name="ChangeVal"]');

                            tr.css('display', 'none');

                            input_change.val() === 'A' ? tr.remove() : input_change.val('D');
                        });
                        break;
                }
            }
        })
        .fail(function (error) { console.log(error); });
}
function ChangeRelation(control) {

    switch ($(control).prop('name')) {

        case 'intEquip':

            var tr = $(control).parent().parent();
            var td_intProduct = tr.find('td.IntPro').empty();
            var td_component = tr.find('td.Component').empty();

            var equipmentId = $(control).val();

            if (!isEmpty(equipmentId)) {
                $.getJSON('/VisioMaps/ProductList', { equipmentId: equipmentId })
                    .done(function (json_products) {

                        var dn_intProduct = $('<select>', { class: 'form-control', name: 'intProduct' });
                        td_intProduct.append(dn_intProduct);

                        var opt_intProduct = $('<option>', { text: '-- Please select --', value: '' });
                        dn_intProduct.append(opt_intProduct);

                        $.each(json_products, function () {
                            opt_intProduct = $('<option>', { value: this['Id'], text: this['Model'] });
                            dn_intProduct.append(opt_intProduct);
                        });

                        SelectLJH(dn_intProduct);


                        dn_intProduct.on('change', function () {
                            ChangeRelation(this);
                        });
                    }).fail(function (error) { console.log(error); });
            }
            break;


        case 'intProduct':

            tr = $(control).parent().parent();
            td_component = tr.find('td.Component').empty();
            var td_layer = tr.find('td.Layer').empty();

            var productId = $(control).val();


            if (!isEmpty(productId)) {
                $.getJSON('/VisioMaps/ComponentList', { productId: productId })
                    .done(function (json_components) {

                        var dn_component = $('<select>', { class: 'form-control', name: 'component' });
                        td_component.append(dn_component);

                        var opt_component = $('<option>', { text: '-- Please select --', value: '' });
                        dn_component.append(opt_component);

                        $.each(json_components, function () {
                            opt_component = $('<option>', { value: this['Id'], text: this['Model'], title: ' [' + this['Name'] + ']' });
                            dn_component.append(opt_component);
                        });

                        SelectLJH(dn_component);

                        dn_component.on('change', function () {
                            ChangeRelation(this);
                        });

                    }).fail(function (error) { console.log(error); });

                $.getJSON('/VisioMaps/LayerList', { productId: productId })
                    .done(function (json_layers) {


                    }).fail(function (error) { console.log(error); });
            }
            break;


        case 'component':

            var btn_select = $('<button>', {
                type: 'button',
                name: 'Variant',
                class: 'btn btn-white',
                value: $(control).val(),
                text: $(control.selectedOptions).text(),
                title: $(control.selectedOptions).prop('title')
            });
            $(control).before(btn_select);

            $(control).val('');
            SelectLJH($(control));

            btn_select.on('click', function () {
                $(this).remove();
            });
            break;
    }
}


function SubmitClone(visioIds) {

    loading.show();

    $.ajax({
        type: 'POST',
        url: '/VisioMaps/CopyVisiomaps/',
        data: { json: JSON.stringify(visioIds) },
        success: function (response) {
            LoadVisioMapList();
            toastr.success('Success copy', '', { positionClass: 'toast-bottom-left' });
        },
        failure: function (response) {
            toastr.fail(response);
        },
        error: function (response) {
            toastr.error(response);
        }
    });
}
function LoadVariantList(strAct) {

    var proId = $('#' + strAct + 'Pro').val();

    $.getJSON('/VisioMaps/LoadVariantList/', { strAction: strAct, id: proId })
        .done(function (json) {

            var vat = $('#' + strAct + 'Vat');
            vat.empty();

            vat.append($('<option>', {
                text: '-- Please select --',
                value: ''
            }));

            $.each(json, function () {
                var group = $('<optGroup>', { label: this['Group'] });
                vat.append(group);

                $.each(this['Variants'], function () {
                    var variant = $('<option>', {
                        value: this['VariantId'],
                        text: this['ProductModel'] + ' [' + this['VariantName'] + ']',
                        'data-model': this['ProductModel']
                    });
                    group.append(variant);
                });
            });

            SelectLJH(vat);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            alert("Request Failed: " + err);
        });
}
//function AddVariant(selectItem, action) {

//    // 선택값이 있다면
//    if (selectItem.val() !== null) {

//        var hidden = $('#' + action + 'Variants');
//        var hiddenVal = hidden.val();

//        var arr = new Array();

//        // hidden에서 값을 가져와서, arr에 할당
//        if (hiddenVal.length > 0) {
//            if (hiddenVal.indexOf(',') === -1)
//                arr.push(hiddenVal);                   // 1ea
//            else
//                arr.push(hiddenVal.split(','));        // 1ea 이상
//        }

//        // 중복 값 체크 후 arr 추가
//        var chk = false;
//        $.each(arr, function () {
//            if (selectItem.val() === arr) {
//                chk = true;
//                return true;
//            }
//        });

//        if (chk === false) {
//            // hidden에 값 재입력
//            arr.push(selectItem.val());
//            hidden.val(arr.join(','));

//            // select list 추가
//            var dl = $('#' + action + 'Select');
//            var dt = $('<dt>');
//            dl.append(dt);

//            var button = $('<button>', {
//                type: 'button',
//                class: 'btn btn-outline-secondary',
//                value: selectItem.val(),
//                text: selectItem.data('model'),
//                style: 'width:100%;',
//                title: selectItem.text()
//            });
//            dt.append(button);
//        }
//        //selectItem.val('');
//        selectItem.parent().parent().val('');
//        SelectLJH(selectItem.parent().parent());
//    }
//}

// Group - Default => Component, Property : hide / Interface : show
function ChangeGroup(act) {

    var group = $('#' + act + 'Group');
    var groupVal = group.val();

    var def = $('#' + act + 'Def');
    def.empty();


    if (groupVal === 'INTERFACE') {
        def.parent().show();
        
        for (var i = 0; i < 3; i++) {
            if (i === 0)
                var opt = $("<option>", { text: "DISABLE" });
            else if (i === 1)
                opt = $("<option>", { text: "ENABLE" });
            else
                opt = $("<option>", { text: "MANDATORY" });

            def.append(opt);
        }

        SelectLJH(def);
    }
    else
        def.parent().hide();
}

function AddShape(body, id, type, name, text, reShape) {

    var liGroup = $('<li>', { class: 'list-group-item' });
    body.append(liGroup);


    // #region Shape
    var row = $('<div>', { class: 'row rowShapes mb-3' });
    liGroup.append(row);

    var inpId = $('<input>', { type: 'hidden', value: id, name: 'Id' });
    row.append(inpId);

    var changeVal = $('<input>', { type: 'hidden', name: 'ChangeVal' });
    if (isEmpty(id))
        changeVal.val('A');
    row.append(changeVal);


    for (i = 0; i < 4; i++) {

        var col = $('<div>');
        row.append(col);

        if (i < 3) {
            col.prop('class', 'col pr-0');

            var inpGroup = $('<div>', { class: 'input-group' });
            col.append(inpGroup);

            var pre = $('<div>', { class: 'input-group-prepend' });
            inpGroup.append(pre);

            var sp = $('<span>', { class: 'input-group-text' });
            pre.append(sp);
        }
        else {
            col.prop('class', 'text-right pl-3');
            col.css('display', 'inline-flex');
        }

        switch (i) {
            case 0:
                sp.append('Type');

                var secType = $('<select>', { name: 'Type' });
                inpGroup.append(secType);

                var opt = $('<option>', { text: 'CABLE' });
                secType.append(opt);

                opt = $('<option>', { text: 'YARD' });
                secType.append(opt);

                opt = $('<option>', { text: 'LOCATION' });
                secType.append(opt);

                if (!isEmpty(type))
                    secType.val(type);

                SelectLJH(secType);
                break;

            case 1:
                sp.append('Name');

                var inpName = $('<input>', { type: 'text', class: 'form-control', name: 'Name' });
                inpGroup.append(inpName);

                if (!isEmpty(name))
                    inpName.val(name);

                inpName.keydown(function (key) {
                    if (key.keyCode === 13)
                        $('#BtnSubmitEdit').trigger('click');
                });
                break;

            case 2:
                sp.append('Text');

                var inpText = $('<input>', { type: 'text', class: 'form-control', name: 'Text' });
                inpGroup.append(inpText);

                if (!isEmpty(text))
                    inpText.val(text);

                inpText.keydown(function (key) {
                    if (key.keyCode === 13)
                        $('#BtnSubmitEdit').trigger('click');
                });
                break;

            case 3:
                var btnRem = $('<button>', { type: 'button', class: 'btn btn-white btnRemoveShape', title: 'Remove Shape' });
                col.append(btnRem);

                var icRem = $('<i>', { class: 'fa fa-minus' });
                btnRem.append(icRem);

                btnRem.on('click', function (e) {
                    var thisBtn = $(e.currentTarget);

                    var rowShapes = thisBtn.parent().parent();
                    var inpId = rowShapes.find('input[name="ChangeVal"]');

                    if (inpId.val() === 'A')
                        rowShapes.remove();
                    else {
                        inpId.val('D');
                        rowShapes.parent().css('display', 'none');
                    }
                });
                break;
        }
    }
    // #endregion Shape


    // #region Relation Shape
    var rowReShape = $('<div>', { class: 'row rowReShapes' });
    liGroup.append(rowReShape);

    var colReShape = $('<div>', { class: 'col text-center' });
    rowReShape.append(colReShape);


    var btnAddReShape = $('<button>', { type: 'button', class: 'btn btn-white', style: 'width:90%;' });
    colReShape.append(btnAddReShape);

    var icAddReShape = $('<i>', { class: 'fa fa-plus' });
    btnAddReShape.append(icAddReShape);

    btnAddReShape.on('click', function (e) {
        var thisButton = $(e.currentTarget);
        AddRelationShape(thisButton, null);
    });


    if (!isEmpty(reShape))
        AddRelationShape(btnAddReShape, reShape);
    // #endregion Relation Shape
}
function AddRelationShape(btnAddReShape, reShapes) {

    var card = $('<div>', { class: 'card card-body' });
    btnAddReShape.before(card);


    if (isEmpty(reShapes)) {

        $.getJSON('/Visiomaps/LoadRelationData', { productId: null, layerId: null })
            .done(function (json) {

                var row = $('<div>', { class: 'row' });
                card.append(row);

                var changeVal = $('<input>', { type: 'hidden', name: 'ChangeVal', value: 'A' });
                row.prepend(changeVal);

                var reShapeId = $('<input>', { type: 'hidden', name: 'ReShapeId' });
                row.prepend(reShapeId);


                // #region Remove shape button
                var divButton = $('<div>', { class: 'text-right pl-3', style: 'display:inline-flex' });
                row.prepend(divButton);

                var btnRemReShape = $('<button>', { type: 'button', class: 'btn btn-white btnRemReShape' });
                divButton.append(btnRemReShape);

                var icRemReShape = $('<i>', { class: 'fa fa-minus' });
                btnRemReShape.append(icRemReShape);

                btnRemReShape.on('click', function (e) {
                    var thisButton = $(e.currentTarget);

                    var row = thisButton.parent().parent();
                    var changeVal = row.find('input[name="ChangeVal"]');

                    if (changeVal.val() === 'A')
                        row.parent().remove();
                    else {
                        row.parent().css('display', 'none');
                        changeVal.val('D');
                    }
                });
                // #region Remove shape button


                // #region Relation shape
                var divContent = $('<div>', { class: 'col' });
                row.prepend(divContent);

                for (var i = 0; i < 2; i++) {

                    var reShapeRow = $('<div>', { class: 'row' });
                    divContent.append(reShapeRow);


                    for (var k = 0; k < 3; k++) {

                        var col = $('<div>', { class: 'col' });
                        reShapeRow.append(col);

                        if (i === 0 || k < 2) {
                            var inpGroup = $('<div>', { class: 'input-group' });
                            col.append(inpGroup);

                            var pre = $('<div>', { class: 'input-group-prepend' });
                            inpGroup.append(pre);

                            var sp = $('<span>', { class: 'input-group-text' });
                            pre.append(sp);
                        }

                        if (i === 0) {
                            // ReProduct, ReLayer, ReShape
                            switch (k) {
                                case 0:
                                    sp.append('Re.Product');

                                    var secPro = $('<select>', { class: 'ReProduct', name: 'ReProduct' });
                                    inpGroup.append(secPro);

                                    var opt = $('<option>', { value: '', text: '-- Please Select --' });
                                    secPro.append(opt);

                                    var products = json['Products'];
                                    $.each(products, function () {
                                        opt = $('<option>', { value: this['Id'], text: this['Model'] });
                                        secPro.append(opt);
                                    });

                                    SelectLJH(secPro);

                                    secPro.on('change', function () {

                                        var thisSec = $(this);
                                        var productId = $(this).val();

                                        $.getJSON('/Visiomaps/LoadRelationData', { productId: productId, layerId: null })
                                            .done(function (json) {

                                                var layers = json['Layers'];

                                                var row = thisSec.parent().parent().parent();
                                                var secLayer = row.find('select[name="ReLayer"]');
                                                secLayer.empty();

                                                $.each(layers, function () {
                                                    var opt = $('<option>', { value: this['Id'], text: this['Name'], title: this['File'] });
                                                    secLayer.append(opt);
                                                });

                                                SelectLJH(secLayer);
                                            })
                                            .fail(function (error) {
                                                console.log(error);
                                            });
                                    });
                                    break;
                                case 1:
                                    sp.append('Re.Layer');

                                    var secLayer = $('<select>', { class: 'ReLayer', name: 'ReLayer' });
                                    inpGroup.append(secLayer);

                                    SelectLJH(secLayer);

                                    secLayer.on('change', function () {

                                        var thisSec = $(this);
                                        var row = thisSec.parent().parent().parent();
                                        var productId = row.find('select[name="ReProduct"]').val();
                                        var layerId = thisSec.val();


                                        $.getJSON('/Visiomaps/LoadRelationData', { productId: productId, layerId: layerId })
                                            .done(function (json) {

                                                var shapes = json['Shapes'];
                                                
                                                var secShape = row.find('select[name="ReShape"]');
                                                secShape.empty();

                                                $.each(shapes, function () {
                                                    var opt = $('<option>', { value: this['Id'], text: this['Name'] });
                                                    secShape.append(opt);
                                                });

                                                SelectLJH(secShape);
                                            })
                                            .fail(function (error) {
                                                console.log(error);
                                            });
                                    });
                                    break;
                                case 2:
                                    sp.append('Re.Shape');

                                    var secShape = $('<select>', { class: 'ReShape', name: 'ReShape' });
                                    inpGroup.append(secShape);

                                    SelectLJH(secShape);
                                    break;
                            }
                        } else {
                            // Method, Value
                            switch (k) {
                                case 0:
                                    sp.append('Method');

                                    var inpMethod = $('<input>', { type: 'text', class: 'form-control', name:'Method' });
                                    inpGroup.append(inpMethod);
                                    break;
                                case 1:
                                    sp.append('Value');

                                    var inpVal = $('<input>', { type: 'text', class: 'form-control', name: 'Value' });
                                    inpGroup.append(inpVal);
                            }
                        }
                    }
                }
                // #endregion Relation shape
            })
            .fail(function (error) {
                console.log(error);
            });

    } else {

        $.each(reShapes, function () {

            var reShape = this;


            var row = $('<div>', { class: 'row' });
            card.append(row);

            var changeVal = $('<input>', { type: 'hidden', name: 'ChangeVal' });
            row.append(changeVal);

            var reShapeId = $('<input>', { type: 'hidden', name: 'ReShapeId', value: reShape['ReShapeId'] });
            row.prepend(reShapeId);


            // #region Remove shape button
            var divButton = $('<div>', { class: 'text-right pl-3', style: 'display:inline-flex' });
            row.prepend(divButton);

            var btnRemReShape = $('<button>', { type: 'button', class: 'btn btn-white btnRemReShape' });
            divButton.append(btnRemReShape);

            var icRemReShape = $('<i>', { class: 'fa fa-minus' });
            btnRemReShape.append(icRemReShape);

            btnRemReShape.on('click', function (e) {
                var thisButton = $(e.currentTarget);

                var row = thisButton.parent().parent();
                var changeVal = row.find('input[name="ChangeVal"]');

                if (changeVal.val() === 'A')
                    row.parent().remove();
                else {
                    row.parent().css('display', 'none');
                    changeVal.val('D');
                }
            });
            // #region Remove shape button


            // #region Relation Shape
            var divContent = $('<div>', { class: 'col' });
            row.prepend(divContent);

            for (var i = 0; i < 2; i++) {

                var reShapeRow = $('<div>', { class: 'row' });
                divContent.append(reShapeRow);

                for (var k = 0; k < 3; k++) {

                    var col = $('<div>', { class: 'col' });
                    reShapeRow.append(col);

                    if (i === 0 || k < 2) {
                        var inpGroup = $('<div>', { class: 'input-group' });
                        col.append(inpGroup);

                        var pre = $('<div>', { class: 'input-group-prepend' });
                        inpGroup.append(pre);

                        var sp = $('<span>', { class: 'input-group-text' });
                        pre.append(sp);
                    }

                    if (i === 0) {
                        // ReProduct, ReLayer, ReShape
                        switch (k) {
                            case 0:
                                sp.append('Re.Product');

                                var secPro = $('<select>', { class: 'ReProduct', name: 'ReProduct' });
                                inpGroup.append(secPro);

                                var opt = $('<option>', { value: '', text: '-- Please Select --' });
                                secPro.append(opt);

                                var products = reShape['ReProducts'];
                                $.each(products, function () {
                                    opt = $('<option>', { value: this['Id'], text: this['Model'] });
                                    secPro.append(opt);
                                });

                                secPro.val(reShape['ReProduct']);
                                SelectLJH(secPro);

                                secPro.on('change', function () {

                                    var thisSec = $(this);
                                    var productId = thisSec.val();

                                    $.getJSON('/Visiomaps/LoadRelationData', { productId: productId, layerId: null })
                                        .done(function (json) {

                                            var layers = json['Layers'];

                                            var secLayer = thisSelect.parent().parent().parent().find('select[name="ReLayer"]');
                                            secLayer.empty();

                                            $.each(layers, function () {
                                                var option = $('<option>', { value: this['Id'], text: this['Name'], title: this['File'] });
                                                secLayer.append(option);
                                            });

                                            SelectLJH(secLayer);
                                        })
                                        .fail(function (jqxhr, textStatus, error) {
                                            alert('Request Failed: ' + textStatus);
                                        });
                                });
                                break;
                            case 1:
                                sp.append('Re.Layer');

                                var secLayer = $('<select>', { class: 'ReLayer', name: 'ReLayer' });
                                inpGroup.append(secLayer);

                                var reLayers = reShape['ReLayers'];
                                $.each(reLayers, function () {
                                    option = $('<option>', { value: this['Id'], text: this['Name'], title: this['title'] });
                                    secLayer.append(option);
                                });

                                secLayer.val(reShape['ReLayer']);
                                SelectLJH(secLayer);

                                secLayer.on('change', function () {

                                    var thisSec = $(this);
                                    var layerId = thisSec.val();
                                    var productId = thisSec.parent().parent().parent().find('select[name="ReProduct"]').val();


                                    $.getJSON('/Visiomaps/LoadRelationData', { productId: productId, layerId: layerId })
                                        .done(function (json) {

                                            var shapes = json['Shapes'];

                                            var secShape = thisSelect.parent().parent().parent().find('select[name="ReShape"]');
                                            secShape.empty();

                                            $.each(shapes, function () {
                                                var option = $('<option>', { value: this['Id'], text: this['Name'] });
                                                secShape.append(option);
                                            });

                                            SelectLJH(secShape);
                                        })
                                        .fail(function (jqxhr, textStatus, error) {
                                            alert('Request Failed: ' + textStatus);
                                        });
                                });
                                break;
                            case 2:
                                sp.append('Re.Shape');

                                var secShape = $('<select>', { class: 'ReShape', name: 'ReShape' });
                                inpGroup.append(secShape);

                                var reShapes = reShape['ReShapes'];
                                $.each(reShapes, function () {
                                    option = $('<option>', { value: this['Id'], text: this['Name'] });
                                    secShape.append(option);
                                });

                                secShape.val(reShape['ReShape']);
                                SelectLJH(secShape);
                                break;
                        }
                    } else {
                        // Method, Value
                        switch (k) {
                            case 0:
                                sp.append('Method');

                                var inpMethod = $('<input>', { type: 'text', class: 'form-control', name: 'Method', value: reShape['Method'] });
                                inpGroup.append(inpMethod);
                                break;
                            case 1:
                                sp.append('Value');

                                var inpVal = $('<input>', { type: 'text', class: 'form-control', name: 'Value', value: reShape['Value'] });
                                inpGroup.append(inpVal);
                        }
                    }
                }
            }
            // #endregion Relation Shape
        });
    }
}

function objForm_Relation(form) {

    var arrShape = new Array();

    // #region Shapes
    var rowShapes = $(form).find('.rowShapes');

    $.each(rowShapes, function () {

        // Shape 정보
        var id = $(this).find('input[name="Id"]');
        var changeVal = $(this).find('input[name="ChangeVal"]');

        var shapeType = $(this).find('select[name="Type"]');
        var shapeName = $(this).find('input[name="Name"]');
        var shapeText = $(this).find('input[name="Text"]');


        // RelationShape 정보
        var rowReShapes = $(this).siblings('div.rowReShapes').find('.card');
        var arrReShape = Array();

        $.each(rowReShapes, function () {

            var reId = $(this).find('input[name="ReShapeId"]');
            var reChangeVal = $(this).find('input[name="ChangeVal"]');
            var reProduct = $(this).find('select[name="ReProduct"]');
            var reLayer = $(this).find('select[name="ReLayer"]');
            var reShape = $(this).find('select[name="ReShape"]');
            var reMethod = $(this).find('input[name="Method"]');
            var reVal = $(this).find('input[name="Value"]');

            var obReShape = {
                'Id': reId.val(),
                'ChangeVal': reChangeVal.val(),
                'ProductId': reProduct.val(),
                'LayerId': reLayer.val(),
                'ShapeId': reShape.val(),
                'Method': reMethod.val(),
                'Value': reVal.val()
            };
            arrReShape.push(obReShape);
        });


        // 전달할 object
        var obj = {
            'Id': id.val(),
            'ChangeVal': changeVal.val(),
            'Type': shapeType.val(),
            'Name': shapeName.val(),
            'Text': shapeText.val(),
            'ReShapes': arrReShape
        };

        arrShape.push(obj);
    });
    // #endregion Shapes


    // #region Relations
    var trs = $(form).find('table.relations tr.RelationRow');

    var arrRelation = new Array();

    $.each(trs, function () {

        var relationId = $(this).find('input[name="RelationId"]');
        var changeVal = $(this).find('input[name="ChangeVal"]');
        //var relationType = $(this).find('select[name="RelationType"]');

        var intEquipmentId = $(this).find('select[name="IntEquipmentId"]');
        var intProductId = $(this).find('select[name="IntProductId"]');

        var method = $(this).find('input[name="Method"]');
        var value = $(this).find('input[name="Value"]');
        var gaVariant = $(this).find('select[name="GAVariant"]');
        
        var reLayerId = $(this).find('select[name="ReLayerId"]');
        var reLayerValue = $(this).find('input[name="ReLayerValue"]');


        var obj = new Object();
        arrRelation.push(obj);

        obj.RelationId = relationId.val();
        obj.ChangeVal = changeVal.val();

        obj.IntEquipmentId = intEquipmentId.val();
        obj.IntProductId = intProductId.val();

        obj.Method = method.val();
        obj.Value = value.val();
        obj.GAVariant = gaVariant.val();
        
        obj.ReLayerId = reLayerId.val();
        obj.ReLayerValue = reLayerValue.val();


        var variants = $(this).find('button[name="Variant"]');

        if (variants.length > 0) {
            var strVariantsIds = null;

            $.each(variants, function () {

                if (strVariantsIds === null)
                    strVariantsIds = $(this).val();
                else
                    strVariantsIds += ',' + $(this).val();
            });

            obj.VariantIds = strVariantsIds;
        }
    });
    // #endregion Relations

    var objForm = {
        'Shapes': arrShape,
        'Relations': arrRelation
    };

    return objForm;
}