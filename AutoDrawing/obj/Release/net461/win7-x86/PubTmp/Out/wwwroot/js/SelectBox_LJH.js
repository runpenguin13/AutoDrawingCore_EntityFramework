// #region  Selectbox
function SelectLJH(control, position) {

    $.each(control, function () {

        $(this).hide();

        // 기존 dropdown 삭제
        $(this).siblings('.dropdown.custom-file').remove();


        var dropdown = $('<div>', { class: 'dropdown custom-file' });
        dropdown.on('shown.bs.dropdown', function () {
            $(this).find('input[type="search"]').focus();
        });

        if (position === 'prepend')
            $(this).parent().prepend(dropdown);
        else
            $(this).parent().append(dropdown);


        var button = $('<button>', {
            class: 'btn btn-white dropdown-toggle custom-dropdown-toggle', type: 'button', 'data-toggle': 'dropdown', 'aria-haspopup': true,
            'aria-expanded': false, id: 's' + this.id
        });

        button.prop('disabled', $(this).prop('disabled'));            
        dropdown.append(button);


        var menu = $('<div>', { class: 'dropdown-menu p-2', 'aria-labelledby': 's' + this.id });
        dropdown.append(menu);

        var input = $('<input>', { type: 'search', class: 'form-control' });
        input.on('input', function () {
            var value = this.value;
            var dropdownItems = $(this).siblings('div.items').children('.dropdown-item');

            filter(dropdownItems, value);
        });
        menu.append(input);

        var items = $('<div>', { class: 'items' });
        menu.append(items);

        var header = $('<div>', { class: 'dropdown-header empty', text: 'Not Found' });
        menu.append(header);


        $.each(this.options, function () {

            var item = $('<button>', { type: 'button', class: 'dropdown-item', value: this.value, text: this.text, title: this.title });
            item.on('click', function () {
                var value = this.value;
                var text = $(this).text();

                var btn = $(this).parent().parent().siblings('button');
                btn.text(text);
                btn.attr('title', text);


                // select box에 반영
                var select = btn.parent().siblings('select');
                var options = select.find('option');

                $.each(options, function () {
                    if (this.value === String(value))
                        $(this).prop('selected', true);
                    else
                        $(this).prop('selected', false);
                });

                select.change();
            });
            items.append(item);


            header.hide();


            if ($(this).prop('selected')) {
                if (this.value === this.text)
                    button.text(this.value);
                else
                    button.text(this.text);
            }
        });
    });

    function filter(dropdownItems, word) {

        var length = dropdownItems.length;
        var collection = [];
        var hidden = 0;

        word = word.toLowerCase();

        for (var i = 0; i < length; i++) {
            if (dropdownItems[i].value.toLowerCase().indexOf(word) !== -1 || $(dropdownItems[i]).text().toLowerCase().indexOf(word) !== -1)
                $(dropdownItems[i]).show();
            else {
                $(dropdownItems[i]).hide();
                hidden++;
            }
        }
    }
}

function ChangeLJH(control) {

    var value = control.val();
    var text = control.find('option:selected').text();
    var title = control.find('option:selected').prop('title');

    var btn = control.siblings().find('.custom-dropdown-toggle');
    btn.text(text);
    btn.attr('title', title);
}
// #endregion  Selectbox


// #region date picker
function DatePicker(control) {

    var control = $(control);
    var thisDate = control.val().split('-');

    var thisYear = Number(thisDate[0]);     // 2018
    var thisMonth = Number(thisDate[1]);    // 9
    var thisDay = Number(thisDate[2]);      // 11

    
    var dayofweek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // picker icon
    var divAppend = $('<div>', { class: 'input-group-append' });
    control.after(divAppend);

    var btnIcon = $('<button>', { class: 'btn btn-light' });
    divAppend.append(btnIcon);
    btnIcon.on('click', function () {

        var divUnder = $(this).parent().siblings('.under');

        if (divUnder.hasClass('show'))
            divUnder.removeClass('show');
        else
            divUnder.addClass('show');
    });
    

    var icon = $('<i>', { class: 'far fa-calendar-alt' });
    btnIcon.append(icon);

    // picker under
    var divUnder = $('<div>', { class: 'under', type: 'month' });
    divAppend.after(divUnder);

    // navigator
    var divNavigator = $('<div>', { class: 'navigator d-flex justify-content-between' });
    divUnder.append(divNavigator);

    var btnLeft = $('<button>', { class: 'btn btn-light p-1 preMonth'/*, 'data-month': thisMonth - 1, 'data-year': thisYear*/ });
    divNavigator.append(btnLeft);
    btnLeft.on('click', function () {
        var divUnder = $(this).parent().parent();
        var thisYear = Number($(this).attr('data-year'));
        var thisMonth = Number($(this).attr('data-month'));

        var thisDay = divUnder.find('.today').parent().data('day');

        var day = new Date(thisYear, thisMonth - 1, thisDay);
        LoadMonth(divUnder, day);
    });

    var iLeft = $('<i>', { class: 'fas fa-chevron-left fa-xs' });
    btnLeft.append(iLeft);

    var spanMonth = $('<span>', { class: 'calenderTitle'});
    divNavigator.append(spanMonth);

    var btnRight = $('<button>', { class: 'btn btn-light p-1 nextMonth'/*, 'data-month': Number(thisMonth) + 1, 'data-year': Number(thisYear)*/ });
    divNavigator.append(btnRight);
    btnRight.on('click', function () {
        var divUnder = $(this).parent().parent();
        var thisYear = Number($(this).attr('data-year'));
        var thisMonth = Number($(this).attr('data-month'));

        var thisDay = divUnder.find('.today').parent().data('day');

        var day = new Date(thisYear, thisMonth - 1, thisDay);
        LoadMonth(divUnder, day);
    });

    var iRight = $('<i>', { class: 'fas fa-chevron-right fa-xs' });
    btnRight.append(iRight);


    // table
    var table = $('<table>', { class: 'table calenderTable mt-2 mb-0' });
    divUnder.append(table);

    // thead
    var thead = $('<thead>');
    table.append(thead);

    var tr = $('<tr>');
    thead.append(tr);

    for (var n = 0; n < 7; n++) {
        var th = $('<th>', { text: dayofweek[n].substr(0, 1) });

        if (n === 0)
            th.css('color', 'red');
        else if (n === 6)
            th.css('color', 'blue');
        tr.append(th);
    }

    // tbody
    var tbody = $('<tbody>');
    table.append(tbody);

    var today = new Date(thisYear, thisMonth - 1, thisDay);
    LoadMonth(divUnder, today);
    
}
function LoadMonth(divUnder, today /*thisYear, thisMonth, thisDay*/) {

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var title = divUnder.find('.calenderTitle');
    title.text(monthNames[Number(today.getMonth())] + ' ' + today.getFullYear());

    var tbody = divUnder.find('tbody');
    tbody.empty();

    // day
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1); // 2018-09-01
    var startDay = firstDay.cal(firstDay.getDay(), false);              // 2018-08-26
    var lastDay = new Date(today.getFullYear(), today.getMonth(), new Date(today.getFullYear(), today.getMonth(), 0).getDate());
    lastDay = lastDay.cal(6 - lastDay.getDay(), true);
    var day = startDay;

    var tr;

    while (day <= lastDay) {

        if (day.getDay() === 0) {
            tr = $('<tr>');
            tbody.append(tr);
        }

        var td = $('<td>');
        tr.append(td);

        if (day.getDay() === 0)
            td.css('color', 'red');
        else if (day.getDay() === 6)
            td.css('color', 'blue');

        td.attr('data-day', day.getDate());
        td.attr('data-month', day.getMonth() + 1);
        td.attr('data-year', day.getFullYear());

        td.on('click', function () {
            var td = $(this);
            var day = pad(td.data('year'), 2) + '-' + pad(td.data('month'), 2) + '-' + pad(td.data('day'), 2);
            var inputDate = $(this).parent().parent().parent().parent().siblings('input[type="date"]');
            inputDate.val(day);
        });


        var spanDay = $('<div>', { text: day.getDate() });
        td.append(spanDay);
        
        if (day.getMonth() === today.getMonth()) {
            if (day.getFullYear() === today.getFullYear() && day.getMonth() === today.getMonth() && day.getDate() === today.getDate()) {
                spanDay.addClass('today');
            }
        } else {
            spanDay.addClass('other-month');
        }

        day = day.cal(1, true);
    }

    var btnLeft = divUnder.find('.preMonth');
    var btnRight = divUnder.find('.nextMonth');

    btnLeft.attr('data-year', today.cal(30, false).getFullYear());
    btnLeft.attr('data-month', today.cal(30, false).getMonth() + 1);

    btnRight.attr('data-year', today.cal(30, true).getFullYear());
    btnRight.attr('data-month', today.cal(30, true).getMonth() + 1);
}

function pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}


Date.prototype.cal = function (days, bool) {
    var date = new Date(this.valueOf());

    if (bool)
        date.setDate(date.getDate() + days);
    else
        date.setDate(date.getDate() - days);
    return date;
}
// #endregion date picker