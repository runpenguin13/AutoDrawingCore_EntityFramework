$(window).on('load', function () {
    Initialize();
    LoadShipyardList();
});


// #region [Function]
function Initialize() {
    var menuBar = $('#MenuBar');
    var ol = menuBar.find('ol.breadcrumb');

    var li = $('<li>', { class: 'breadcrumb-item active', text: 'Drawings' });
    ol.append(li);
}
function LoadShipyardList() {

    loading.show();

    $.getJSON('/DrawingOrders/ShipyardListPage/', function (json) {

        var div = $('#ShipyardListPage');

        $.each(json, function () {

            var companyIdx = this['CompanyIdx'];
            var entityName = this['Name'];
            var sName = this['SName'];
            var state = this['State'];


            // shipyard 만들어져 있는 지 확인, 없다면 생성
            var inputCompany = div.find('input.companyIdx[value="' + companyIdx + '"]');

            if (inputCompany.length === 0) {
                var col = $('<div>', { class: 'col-4 mb-3' });
                div.append(col);

                var card = $('<div>', { class: 'card h-100 card_shipyard' });
                col.append(card);

                var cardBody = $('<div>', { class: 'card-body' });
                card.append(cardBody);


                // button
                var btnJustify = $('<button>', { type: 'button', class: 'btn btn-light', title: '해당 조선소의 전체 Order 목록' });
                cardBody.append(btnJustify);

                btnJustify.on('click', function () {
                    var card = $(this).parent().parent();
                    LoadOrderList(card, 'All');
                });

                var icon = $('<i>', { class: 'fas fa-align-justify' });
                btnJustify.append(icon);
                

                // badge
                var badge_not = $('<span>', { class: 'badge float-right cursor-pointer badgeNot', 'data-count': 0, title: '미완료 Order 목록' });
                cardBody.append(badge_not);

                badge_not.on('click', function () {
                    var card = $(this).parent().parent();
                    LoadOrderList(card, 'NotCompleted');
                });

                inputCompany = $('<input>', { type: 'hidden', value: companyIdx, class: 'companyIdx' });
                cardBody.append(inputCompany);

                var title = $('<p>', { class: 'card-title text-center h5 mt-0', text: sName });
                cardBody.append(title);

                var p = $('<p>', { text: entityName, class: 'text-center' });
                cardBody.append(p);
            }


            if (state !== '70') {
                var badge = inputCompany.siblings('.badgeNot');
                var check = badge.hasClass('badge-pill');

                if (!check)
                    badge.addClass('badge-pill badge-danger');

                var count = badge.data('count');
                badge.data('count', count + 1);
                badge.text(badge.data('count'));
            }
        });

        loading.hide();
    })
        .fail(function (error) { console.log });
}
function LoadOrderList(card, method) {

    loading.show();

    var modal = $('#Modal_ServiceList');
    modal.modal('show');


    // title
    var title = card.find('p.card-title').text();
    var spanTitle = modal.find('.modal-title');
    spanTitle.text(title);


    // body
    var modal_body = modal.find('.modal-body');
    modal_body.empty();

    var row = $('<div>', { class: 'row mb-2' });
    modal_body.append(row);

    var col = $('<div>', { class: 'col text-right' });
    row.append(col);

    // request
    var color = $('<button>', { type: 'button', class: 'btn warning-color cursor-default mr-1', style: 'width:0.5rem;' });
    col.append(color);

    var txt = $('<span>', { text: 'Request', style: 'font-size:.8rem;' });
    col.append(txt);

    // completed
    color = $('<button>', { type: 'button', class: 'btn success-color cursor-default mr-1 ml-2', style: 'width:0.5rem;' });
    col.append(color);

    txt = $('<span>', { text: 'Complete', style: 'font-size:.8rem;' });
    col.append(txt);

    // badge
    color = $('<button>', { type: 'button', class: 'btn danger-color cursor-default mr-1 ml-2', style: 'width:0.5rem;' });
    col.append(color);

    txt = $('<span>', { text: 'Request count', style: 'font-size:.8rem;' });
    col.append(txt);


    // list
    var companyIdx = card.find('input.companyIdx').val();

    $.getJSON('/DrawingOrders/OrderList', { CompanyIdx: companyIdx, method: method })
        .done(function (json) {

            $.each(json, function () {
                var vesselIdx = this['Id'];
                var hullCode = this['HullCode'];

                var ad = this['AD'];
                var wd = this['WD'];
                var fd = this['FD'];

                var hullCard = $('<div>', { class: 'card p-2 card_hullCode mb-2 cursor-pointer' });
                modal_body.append(hullCard);

                hullCard.on('click', function () {
                    // 행 click시 페이지 이동
                    var id = $(this).find('input.vesselIdx').val();

                    if (!isEmpty(id))
                        MovePage_Order(id, 'VesselIdx');
                });

                var row_hull = $('<div>', { class: 'row' });
                hullCard.append(row_hull);

                var col_hull = $('<div>', { class: 'col-3' });
                row_hull.append(col_hull);


                var input_vesselIdx = $('<input>', { type: 'hidden', value: vesselIdx, class: 'vesselIdx' });
                col_hull.append(input_vesselIdx);

                var span_hullCode = $('<span>', { text: hullCode });
                col_hull.append(span_hullCode);


                col_hull = $('<div>', { class: 'col text-right' });
                row_hull.append(col_hull);

                var btnGroup = $('<div>', { class: 'btn-group mr-2' });
                col_hull.append(btnGroup);


                for (var n = 0; n < 3; n++) {

                    var btnDT = $('<button>', { type: 'button', class: 'btn disabled' });
                    btnGroup.append(btnDT);

                    var dwgType;

                    if (n === 0) {
                        btnDT.text('AD');
                        dwgType = ad;
                    } else if (n === 1) {
                        btnDT.text('WD');
                        dwgType = wd;
                    } else if (n === 2) {
                        btnDT.text('FD');
                        dwgType = fd;
                    }

                    if (!isEmpty(dwgType)) {
                        btnDT.removeClass('disabled');
                        btnDT.addClass('cursor-default');
                        btnDT.val(dwgType['Id']);

                        var version = $('<span>', { class: 'text-white ml-2', text: 'v' + dwgType['Version'], style: 'font-size:.7rem;' });
                        btnDT.append(version);

                        var state = dwgType['State'];

                        if (state === '70')
                            btnDT.addClass('success-color text-white');
                        else if (state === '60')
                            btnDT.addClass('warning-color text-white');

                        if (dwgType['Not'] !== 0) {
                            var notCount = $('<span>', { class: 'badge badge-danger text-white float-right', text: dwgType['Not'] });
                            btnDT.append(notCount);
                        }
                    }
                }
            });

            loading.hide();

        }).fail(function (error) { console.log(error) });
}
// #endregion [Function]