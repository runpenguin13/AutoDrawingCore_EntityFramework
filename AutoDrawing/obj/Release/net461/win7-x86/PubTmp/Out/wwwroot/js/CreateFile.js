$(window).on('load', function () {
    loadInfo();
});


// This optional function html-encodes messages for display in the page.
function loadInfo() {

    var drawingId = $('#DrawingId').val();
    
    $.getJSON('/DrawingOrders/LoadCreateFile', { drawingId: drawingId })
        .done(function (json) {

            var depth = json['Depth'];
            var orderId = json['OrderId'];
            var model = json['Model'];
            var wordmapId = json['WordMapId'];
            var fileName = json['FileName'];
            var mergeGroup = json['MergeGroup'];

            initialize(depth, orderId, model, drawingId, wordmapId, fileName, mergeGroup);

        }).fail(function (error) { console.log(error); });
}
function initialize(depth, orderId, model, drawingId, wordmapId, fileName, mergeGroup) {

    var menuBar = $('#MenuBar');


    // #region navigator
    var ol = menuBar.find('ol.breadcrumb');

    for (var i = 0; i < 3; i++) {
        var li = $('<li>', { class: 'breadcrumb-item' });
        ol.append(li);

        switch (i) {
            case 0:
                var a = $('<a>', { href: '/DrawingOrders/List', text: 'Drawings' });
                li.append(a);
                break;
            case 1:
                var a = $('<a>', { href: '/drawings/orders/' + orderId + '/Edit', text: depth });
                li.append(a);
                break;
            case 2:
                li.addClass('active');
                li.text(model);
                break;
        }
    }
    // #endregion navigator


    // #region detail navigator
    var btnGroup = menuBar.find('div.btn-group');

    var newGroup = $('<div>', { class: 'btn-group mr-2' });
    btnGroup.parent().prepend(newGroup);

    a = $('<a>', { class: 'btn text-white', text: 'Component', href: '/drawings/orders/' + orderId + '/equipments/' + drawingId + '/Edit' });
    newGroup.append(a);

    if (!isEmpty(wordmapId)) {
        a = $('<a>', { class: 'btn text-white', text: 'Diagram', href: '/drawings/orders/' + orderId + '/equipments/' + drawingId + '/diagram/' + wordmapId + '/row/0' });
        newGroup.append(a);
    } else {
        btn = $('<button>', { type: 'button', class: 'btn btn-light-green', text: 'Diagram' });
        btn.css('cursor:not-allowed');
        btn.prop('disabled', true);

        newGroup.append(btn);
    }

    a = $('<a>', { class: 'btn text-white font-weight-bold', text: 'View', href: '/drawings/orders/' + orderId + '/equipments/' + drawingId + '/fileview' });
    newGroup.append(a);
    // #endregion detail navigator


    // #region detail information
    var divDetail = $('<div>', { class: 'float-left' });
    newGroup.before(divDetail);

    
    var btnDetail = $('<button>', { type: 'button', text: 'Detail', id: 'Detail', class: 'btn btn-light', 'data-toggle': 'collapse', 'data-target': '#DetailMenu' });
    divDetail.append(btnDetail);

    var menuDetail = $('<div>', { id: 'DetailMenu', class: 'dropdown-menu p-3', style: 'font-size:.9rem;' });
    divDetail.append(menuDetail);

    // Merge
    if (mergeGroup === "R1" || mergeGroup === "R2") {

        var formCheck = $('<div>', { class: 'form-group form-check' });
        menuDetail.append(formCheck);

        var mergeCheck = $('<input>', { type: 'checkbox', class: 'form-check-input', id: 'MergeCheck', name: 'mergeCheck' });
        mergeCheck.prop('checked', true);
        formCheck.append(mergeCheck);

        mergeCheck.on('change', function () {

            var checkbox = $(this);

            $.getJSON('/DrawingOrders/LoadFileName', { drawingId: drawingId, mergeCheck: checkbox.prop('checked') })
                .done(function (json) {

                    var fileName = json['FileName'];
                    var path = json['Path'];

                    var inpFileName = checkbox.parent().parent().find('input[name="fileName"]');
                    inpFileName.val(fileName);

                    if (isEmpty(path))
                        $('#Detail').trigger('click');
                    else
                        showPDF(path);

                }).fail(function (error) { console.log(error); });
        });

        var mergeLabel = $('<label>', { class: 'form-check-label', for: 'MergeCheck', text: 'Merge' });
        formCheck.append(mergeLabel);
    } else {
        $.getJSON('/DrawingOrders/LoadFileName', { drawingId: drawingId, mergeCheck: false })
            .done(function (json) {

                var path = json['Path'];
                
                if (isEmpty(path))
                    $('#Detail').trigger('click');
                else
                    showPDF(path);

            }).fail(function (error) { console.log(error); });
    }

    // file name
    var inputGroup = $('<div>', { class: 'form-group input-group', style: 'width:40rem;' });
    menuDetail.append(inputGroup);

    var pre = $('<div>', { class: 'input-group-prepend' });
    inputGroup.append(pre);

    var txt = $('<span>', { class: 'input-group-text', text: 'FILE NAME' });
    pre.append(txt);

    var inputText = $('<input>', { type: 'text', class: 'form-control', name: 'fileName', value: fileName });
    inputGroup.append(inputText);

    if (mergeGroup === 'R1' || mergeGroup === 'R2')
        $('#MergeCheck').trigger('change');

    // start creating
    var btnTask = $('<button>', { type: 'button', class: 'btn success-color text-white mt-2', id: 'tasker' });
    menuDetail.append(btnTask);

    btnTask.on('click', function () {
        $(this).prop('disabled', true);

        var fileName = $('input[name="fileName"]').val();
        var mergeCheck = $('#MergeCheck').prop('checked');

        $.ajax({
            url: '/drawings/orders/' + orderId + '/equipments/' + drawingId + '/produce?taskId=' + currentTask,
            type: 'POST',
            cache: false,
            data: { fileName: fileName, mergeCheck: mergeCheck === undefined ? false : mergeCheck },
            success: function (url) {
                showPDF(url);
            }
        });
    });

    var taskIcon = $('<i>', { class: 'fas fa-play mr-1' });
    btnTask.append(taskIcon);

    var spanTask = $('<span>', { text: 'Start Create Drawing' });
    btnTask.append(spanTask);

    var divProgress = $('<div>', { class: 'progress' });
    menuDetail.append(divProgress);

    var divProgressbar = $('<div>', {
        class: 'progress-bar progress-bar-striped progress-bar-animated bg-success',
        'role': 'progressbar',
        'aria-valuenow': '0',
        'aria-valuemin': '0',
        'aria-valuemax': '100'
    });
    divProgress.append(divProgressbar);

    var spanProgress = $('<span>', { class: 'sr-only', id: 'WorkDone' });
    divProgressbar.append(spanProgress);
    // #endregion detail information


    $.ajax('/DrawingOrders/CheckServiceItem', { data: { dwgEquipId: drawingId } })
        .done(function (result) {

            if (result === "1") {
                alert('삭제된 Equipment입니다. Equipment page로 이동합니다.');
                $(location).attr('href', '/drawings/orders/' + orderId + '/Edit');
            }
            else {

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

                        console.log(name);

                        if (name.substring(name.length - 3, name.length).toUpperCase() === 'PDF')
                            showPDF(uri);
                    }
                    else
                        console.log('failed to produce drawing');
                };

                hub.client.clearProgressBar = function (taskId) {
                    var percentage = '100';
                    $("#WorkDone").text('completed');
                    $('.progress-bar')
                        .css('width', percentage + '%')
                        .attr('aria-valuenow', percentage);
                    $("#tasker").removeAttr("disabled");
                    $('#DetailMenu').collapse('hide');
                    toastr.success('Success Create');
                };

                $.connection.hub.start().done(function () {
                    currentTask = $.connection.hub.id;
                    $("#tasker").removeAttr("disabled");
                });

                loading.hide();
            }
        });
}
function htmlEncode(value) {
    var encodedValue = $('<div />').text(value).html();
    return encodedValue;
}
function showPDF(pdfPath) {
    //var queryParams = window.ControlUtils.getQueryStringMap(false);
    //alert(queryParams);
    //var docType = queryParams.getString('doctype', 'xod');
    //alert(docType);
    // Instantiate WebViewer on viewerElement
    //var addr = window.location.href

    var viewerElement = document.getElementById('viewer');
    $(viewerElement).empty();


    var myWebViewer = new PDFTron.WebViewer({
        path: '/lib/WebViewer/lib',
        type: 'html5',
        l: 'demo:ycjung@kjeng.kr:721d08bd01901fed604df95c446daa7994f1b1ef80033a9e9f',
        documentType: 'pdf',
        //initialDoc: '/docs/S874/575_2DJ-2828s_INMARSAT-FB_JUE501_AD_V01.pdf'
        initialDoc: pdfPath,
        //documentId: 'test.xfdf',
        //config: '/lib/html5/server/a.js',
        //enableAnnotations: true
    }, viewerElement);


    // Instantiate server
    var server = new Server();

    $(viewerElement).on('documentLoaded', function () {
        myWebViewer.getInstance().showNotesPanel(true);

        var annotationManager = myWebViewer.getInstance().docViewer.getAnnotationManager();
        var authorId = null;

        // Bind server-side authorization state change to a callback function
        // The event is triggered in the beginning as well to check if author has already signed in
        server.bind('onAuthStateChanged', function (user) {
            // Author is logged in
            if (user) {
                // Using uid property from Firebase Database as an author id
                // It is also used as a reference for server-side permission
                authorId = user.uid; 
                // Check if author exists, and call appropriate callback functions
                server.checkAuthor(authorId, openReturningAuthorPopup, openNewAuthorPopup);
                // Bind server-side data events to callback functions
                // When loaded for the first time, onAnnotationCreated event will be triggered for all database entries
                server.bind('onAnnotationCreated', onAnnotationCreated);
                server.bind('onAnnotationUpdated', onAnnotationUpdated);
                server.bind('onAnnotationDeleted', onAnnotationDeleted);
            } else {
                // Author is not logged in
                server.signInAnonymously();
            }
        });

        // Bind annotation change events to a callback function
        annotationManager.on('annotationChanged', function (e, annotations, type) {
            // e.imported is true by default for annotations from pdf and annotations added by importAnnotCommand
            if (e.imported) {
                return;
            }
            // Iterate through all annotations and call appropriate server methods
            annotations.forEach(function (annotation) {
                var parentAuthorId = null;
                var xfdf = annotationManager.getAnnotCommand();
                if (type === 'add') {
                    // In case of replies, add extra field for server-side permission to be granted to the
                    // parent annotation's author
                    if (annotation.InReplyTo) {
                        parentAuthorId = annotationManager.getAnnotationById(annotation.InReplyTo).authorId || 'default';
                    }
                    server.createAnnotation(annotation.Id, {
                        authorId: authorId,
                        parentAuthorId: parentAuthorId,
                        xfdf: xfdf
                    });
                } else if (type === 'modify') {
                    // In case of replies, add extra field for server-side permission to be granted to the
                    // parent annotation's author
                    if (annotation.InReplyTo) {
                        parentAuthorId = annotationManager.getAnnotationById(annotation.InReplyTo).authorId || 'default';
                    }
                    server.updateAnnotation(annotation.Id, {
                        authorId: authorId,
                        parentAuthorId: parentAuthorId,
                        xfdf: xfdf
                    });
                } else if (type === 'delete') {
                    server.deleteAnnotation(annotation.Id);
                }
            });
        });

        // Overwrite client-side permission check method on the annotation manager
        // The default was set to compare the authorName
        // Instead of the authorName, we will compare authorId created from the server
        annotationManager.setPermissionCheckCallback(function (author, annotation) {
            return annotation.authorId === authorId;
        });

        function onAnnotationCreated(data) {
            // Import the annotation based on xfdf command
            var annotation = annotationManager.importAnnotCommand(data.val().xfdf)[0];
            // Set a custom field authorId to be used in client-side permission check
            annotation.authorId = data.val().authorId;
            annotationManager.redrawAnnotation(annotation);
            myWebViewer.getInstance().fireEvent('updateAnnotationPermission', [annotation]);
        }

        function onAnnotationUpdated(data) {
            // Import the annotation based on xfdf command
            var annotation = annotationManager.importAnnotCommand(data.val().xfdf)[0];
            // Set a custom field authorId to be used in client-side permission check
            annotation.authorId = data.val().authorId;
            annotationManager.redrawAnnotation(annotation);
        }

        function onAnnotationDeleted(data) {
            // data.key would return annotationId since our server method is designed as
            // annotationsRef.child(annotationId).set(annotationData)
            var command = '<delete><id>' + data.key + '</id></delete>';
            annotationManager.importAnnotCommand(command);
        }

        function openReturningAuthorPopup(authorName) {
            // The author name will be used for both WebViewer and annotations in PDF
            annotationManager.setCurrentUser(authorName);
            // Open popup for the returning author
            $('.returning-author .name').html(authorName);
            $('.returning-author').css('display', 'block').click(function (e) {
                e.stopPropagation();
            });
            $('.popup-container').click(function () {
                $('.popup-container').css('display', 'none');
            });
            $('.popup-container').keypress(function (e) {
                if (e.which === 13) {
                    $('.popup-container').css('display', 'none');
                }
            });
        }

        function openNewAuthorPopup() {
            // Open popup for a new author
            $('.new-author').css('display', 'block');
            $('.new-author .button').click(function () {
                var authorName = $('.new-author .name').get(0).value.trim();
                if (authorName) {
                    updateAuthor(authorName);
                }
            });
            $('.popup-container').keypress(function (e) {
                var authorName = $('.new-author .name').get(0).value.trim();
                if (e.which === 13 && authorName) {
                    updateAuthor(authorName);
                }
            });
        }

        function updateAuthor(authorName) {
            // The author name will be used for both WebViewer and annotations in PDF
            annotationManager.setCurrentUser(authorName);
            // Create/update author information in the server
            server.updateAuthor(authorId, { authorName: authorName });
            $('.popup-container').css('display', 'none');
        }
    });
}


function SearchService(control) {
    var word = $(control).parent().siblings('input[type="text"]').val();
    var arrOptions = new Array();


    var options = $('#SearchBox input[type="checkbox"]:checked');
    $.each(options, function () {
        var checkbox = $(this);

        var controls = checkbox.parent().parent().siblings().find('select, input');
        $.each(controls, function () {
            var objControl = {
                'name': $(this).prop('name'),
                'value': $(this).val()
            };
            arrOptions.push(objControl);
        });
    });


    var obj = {
        'Word': word,
        'Options': arrOptions
    };

    $.getJSON('/DrawingOrders/SearchService', { json: JSON.stringify(obj) })
        .done(function (arrService) {

            var result = $('#SearchResult');
            result.empty();
            result.css('font-size', '.9rem');

            var yardCount = 0;
            $.each(arrService, function () {

                var yardId = this['YardId'];
                var yardCode = this['Code'];
                var yardName = this['Name'];
                var arrVessel = this['arrVessel'];


                var cardShipyard = $('<div>', { class: 'ml-3 mt-3 mr-3' });
                result.append(cardShipyard);

                // shipyard
                yardCount += 1;
                var headerShipyard = $('<div>', { class: 'card-header special-color text-white rounded cursor-pointer' });
                cardShipyard.append(headerShipyard);
                headerShipyard.on('click', function () {
                    var icon = $(this).find('.fas');
                    var body = $(this).siblings();

                    if (icon.hasClass('fas fa-caret-down')) {
                        icon.removeClass('fas fa-caret-down');
                        icon.addClass('fas fa-caret-up');
                        body.hide();
                    } else {
                        icon.removeClass('fas fa-caret-up');
                        icon.addClass('fas fa-caret-down');
                        body.show();
                    }
                });

                var iconShipyard = $('<i>', { class: 'fas fa-caret-down mr-3' });
                headerShipyard.append(iconShipyard);

                var spanCode = $('<span>', { text: yardCode, class: 'mr-3' });
                headerShipyard.append(spanCode);

                var spanName = $('<span>', { text: '(' + yardName + ')' });
                spanCode.after(spanName);

                var bodyShipyard = $('<div>');
                cardShipyard.append(bodyShipyard);


                // vessel
                $.each(arrVessel, function () {

                    var hullCode = this['HullCode'];
                    var salesNo = this['SalesNo'];
                    var arrDrawingType = this['arrDrawingType'];


                    var cardVessel = $('<div>');
                    bodyShipyard.append(cardVessel);

                    var headerVessel = $('<div>', { class: 'card-header special-color text-white rounded ml-3 cursor-pointer' });
                    cardVessel.append(headerVessel);
                    headerVessel.on('click', function () {
                        var icon = $(this).find('.fas');
                        var body = $(this).siblings();

                        if (icon.hasClass('fas fa-caret-down')) {
                            icon.removeClass('fas fa-caret-down');
                            icon.addClass('fas fa-caret-up');
                            body.hide();
                        } else {
                            icon.removeClass('fas fa-caret-up');
                            icon.addClass('fas fa-caret-down');
                            body.show();
                        }
                    });

                    var iconVessel = $('<i>', { class: 'fas fa-caret-down mr-3' });
                    headerVessel.append(iconVessel);

                    var spanHullCode = $('<span>', { text: hullCode, class: 'mr-3' });
                    headerVessel.append(spanHullCode);

                    var spanSalesNo = $('<span>', { text: '(' + salesNo + ')' });
                    spanHullCode.after(spanSalesNo);

                    var bodyVessel = $('<div>', { class: 'ml-3' });
                    cardVessel.append(bodyVessel);


                    // drawing type
                    $.each(arrDrawingType, function () {
                        var serviceType = this['ServiceType'];
                        var codeName = this['CodeName'];
                        var arrService = this['arrService'];


                        var cardServiceType = $('<div>');
                        bodyVessel.append(cardServiceType);

                        var headerServiceType = $('<div>', { class: 'card-header special-color text-white rounded ml-3 cursor-pointer' });
                        cardServiceType.append(headerServiceType);
                        headerServiceType.on('click', function () {
                            var icon = $(this).find('.fas');
                            var body = $(this).siblings();

                            if (icon.hasClass('fas fa-caret-down')) {
                                icon.removeClass('fas fa-caret-down');
                                icon.addClass('fas fa-caret-up');
                                body.hide();
                            } else {
                                icon.removeClass('fas fa-caret-up');
                                icon.addClass('fas fa-caret-down');
                                body.show();
                            }
                        });

                        var iconServiceType = $('<i>', { class: 'fas fa-caret-down mr-3' });
                        headerServiceType.append(iconServiceType);

                        var spanServiceType = $('<span>', { text: codeName });
                        headerServiceType.append(spanServiceType);

                        var bodyServiceType = $('<div>', { class: 'ml-3' });
                        cardServiceType.append(bodyServiceType);


                        // version
                        $.each(arrService, function () {
                            var id = this['Id'];
                            var version = this['Version'];
                            var state = this['State'];
                            var requestDate = this['RequestDate'];

                            var cardVersion = $('<div>', { class: 'card-header rounded ml-3 cursor-pointer', text: version });
                            bodyServiceType.append(cardVersion);
                            cardVersion.on('click', function () {
                                var id = $(this).find('input[type="hidden"]').val();

                                MovePage_Order(id, 'ServiceIdx')
                            });

                            if (state !== '70') {
                                var badge = $('<span>', { class: 'badge float-right badge-pill badge-danger', text: 'Not completed' });
                                cardVersion.append(badge);
                            }

                            var spanReqeustDate = $('<span>', { class: 'ml-5', text: 'Request Date : ' + requestDate });
                            cardVersion.append(spanReqeustDate);

                            var inputId = $('<input>', { type: 'hidden', value: id });
                            cardVersion.append(inputId);

                        });
                    });

                });
            });

        }).fail(function (error) { console.log(error); });
}
function MovePage_Order(id, type) {
    $.getJSON('/DrawingOrders/FindOrderId', { id: id, type: type })
        .done(function (dwgOrderId) {

            if (dwgOrderId === 0) {
                toastr.error('등록된 Service가 없습니다.');
            } else {
                var href = '/drawings/orders/' + dwgOrderId + '/Edit/';
                location.href = href;
            }
        });
}