$(window).on('load', function () {
    $(function () {
        var hub = $.connection.progressHub;
        hub.client.initProgressBar = function (taskId) {
            var percentage = '0';
            $("#workDone").text(percentage);
            $('.progress-bar')
                .css('width', percentage + '%')
                .attr('aria-valuenow', percentage);
        };
        hub.client.updateProgressBar = function (taskId, percentage) {
            if (taskId == currentTask) {
                $("#workDone").text(percentage);
                $('.progress-bar')
                    .css('width', percentage + '%')
                    .attr('aria-valuenow', percentage);
            }
        };

        hub.client.notifyProduce = function (taskId, success, name, uri) {
            if (success) {
                if (uri == '#') {
                    $('#produce-result').prepend('<li><span>' + name + '</span></li>');
                }
                else {

                    $('#produce-result').prepend('<li><a href="' + uri + '" target="_blank">' + name + '</a></li>');


                    if (name.substring(name.length - 3, name.length).toUpperCase() === 'PDF') {
                        $('#PDFContent').prop('data', uri);
                        $('#DivPDF').attr('class', 'collapse show');
                        $('#CreateDrawing').attr('class', 'collapse');
                    }
                }
            }
            else {
                alert("failed to produce drawing");
            }
        }

        hub.client.clearProgressBar = function (taskId) {
            var percentage = '100';
            $("#workDone").text('completed');
            $('.progress-bar')
                .css('width', percentage + '%')
                .attr('aria-valuenow', percentage);
            $("#tasker").removeAttr("disabled");
        };

        $.connection.hub.start().done(function () {
            currentTask = $.connection.hub.id;
            $("#tasker").removeAttr("disabled");
        });
    });

    // #region  [Event]
    $('#tasker').click(function () {
        $("#tasker").attr({ "disabled": "disabled" });
        $('#produce-result').empty();
        $.post('/drawings/orders/' + orderId + '/equipments/' + dwgEquipId + '/produce?taskId=' + currentTask);
    });

    $('.AT__bottom-bar--CHAT').on('click', function () {

        $(this).toggleClass('svg-button--active');

        if ($(this).hasClass('svg-button--active')) {
            $('.sidebar--chat').css('display', 'flex');
            $('.board-toolbar').css('left', '348px');
            $('.bottom-bar').css('left', '348px');
        }
        else {
            $('.sidebar--chat').css('display', 'none');
            $('.board-toolbar').css('left', '8px');
            $('.bottom-bar').css('left', '8px');
        }
    });
    $('.AT__bottom-bar--COMMENTS').on('click', function () {

        $(this).toggleClass('svg-button--active');

        if ($(this).hasClass('svg-button--active')) {

            $('.board-toolbar').css('display', 'block');

            if ($('.AT__bottom-bar--CHAT').hasClass('svg-button--active')){
                $('.board-toolbar').css('left', '348px');
                $('.bottom-bar').css('left', '348px');
            } else {
                $('.board-toolbar').css('left', '8px');
                $('.bottom-bar').css('left', '8px');
            }
        }
        else {
            $('.board-toolbar').css('display', 'none');

            if ($('.AT__bottom-bar--CHAT').hasClass('svg-button--active')) {
                $('.board-toolbar').css('left', '348px');
                $('.bottom-bar').css('left', '348px');
            } else {
                $('.board-toolbar').css('left', '8px');
                $('.bottom-bar').css('left', '8px');
            }
        }
    });
    $('.left-sidebar__close').on('click', function () {
        
        $('.AT__bottom-bar--CHAT').removeClass('svg-button--active');

        $('.sidebar--chat').css('display', 'none');
        $('.board-toolbar').css('left', '8px');
        $('.bottom-bar').css('left', '8px');
    });
    // #endregion   [Event]

    // #region  [Function]
    // This optional function html-encodes messages for display in the page.
    function htmlEncode(value) {
        var encodedValue = $('<div />').text(value).html();
        return encodedValue;
    }
    // #endregion   [Function]
});