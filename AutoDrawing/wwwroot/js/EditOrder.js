var serviceIdx = $("#ServiceIdx").val();
var loading = $("#Loading");


$(window).on("load", function () {

    Initialize();
    LoadService(serviceIdx);

    // #region [Event]
    $(".collapse").on("show.bs.collapse", function () {
        $(this).parent().find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-up");
    });
    $(".collapse").on("hide.bs.collapse", function () {
        $(this).parent().find(".fa-caret-up").removeClass("fa-caret-up").addClass("fa-caret-down");
    });

    // DrawingType, version change
    $("#ServiceType").on("change", function () {
        // service type에 해당하는 version을 보여준다
        var serviceIdx = $("#ServiceIdx").val();
        var serviceType = $(this).val();

        $.getJSON("/DrawingOrders/LoadVersion", { serviceIdx: serviceIdx, serviceType: serviceType })
            .done(function (arrVersion) {

                var version = $("#Version");
                version.empty();

                $.each(arrVersion, function () {
                    var opt = $("<option>", { value: this["ServiceIdx"], text: this["Version"] + " (Request date: " + this["RequestDate"] + ")" });
                    version.append(opt);

                    version.val(this["ServiceIdx"]);
                });

                $("#Version").trigger("change");

                SelectLJH(version);
            }).fail(function (error) { console.log(error); });
    });
    $("#Version").on("change", function () {
        serviceIdx = $(this).val();
        $("#ServiceIdx").val(serviceIdx);
        LoadService(serviceIdx);
    });

    // Configuration
    $("#BtnEditOrder").click(function () {

        var serviceIdx = $("#ServiceIdx").val();

        if (this.value === "Edit")
            LoadEquipments(serviceIdx, null);
        else
            EditOrderEnd(serviceIdx);
    });

    // #region download
    $("#CheckAll").on("click", function () {
        var value = $(this).prop("checked");
        var checkboxes = $("#DownloadFileList tbody").find("input[type=\"checkbox\"]");

        $.each(checkboxes, function () {
            $(this).prop("checked", value);
        });
    });
    $("#DownloadFileModal").on("show.bs.modal", function () {
        // file list를 불러온다
        $.getJSON("/DrawingOrders/LoadFileList", { serviceIdx: serviceIdx })
            .done(function (arrEquip) {

                var tbody = $("#DownloadFileList tbody");
                tbody.empty();


                $.each(arrEquip, function () {
                    var id = this["Id"];
                    var name = this["Name"];
                    var model = this["Model"];
                    var files = this["Files"];

                    var tr = $("<tr>", { class: "align-items-center" });
                    tbody.append(tr);

                    for (var i = 0; i < 3; i++) {
                        var td = $("<td>");
                        tr.append(td);

                        if (i === 0) {
                            var checkGroup = $("<div>", { class: "form-group form-check pl-0 mb-0" });
                            td.append(checkGroup);

                            var checkbox = $("<input>", { type: "checkbox", value: id, id: "File" + id, class: "mr-2" });
                            checkGroup.append(checkbox);

                            var labelName = $("<label>", { class: "form-check-label", "for": "File" + id, text: name });
                            checkGroup.append(labelName);
                        } else if (i === 1) {
                            td.append(model);
                        } else if (i === 2) {
                            $.each(files, function () {
                                var a = $("<a>", { href: this["URL"], text: this["FileName"] });
                                td.append(a);
                            });
                        }

                    }
                });
            }).fail(function (error) { console.log(error); });
    });
    $("#DownloadAction").on("click", function () {
        var checkboxes = $("#DownloadFileList tbody input:checked");


        if (checkboxes.length === 0)
            toastr.warning("File을 선택해주세요.", "Download files", { positionClass: "toast-bottom-right" });
        else {


            var arrEquip = new Array();
            $.each(checkboxes, function () {
                var value = $(this).val();
                arrEquip.push(value);
            });

            var obj = {
                id: serviceIdx,
                arrEquip: arrEquip
            };

            $.ajax({
                url: "/DrawingOrders/DownloadFile",
                type: "POST",
                data: { obj: JSON.stringify(obj) },
                success: function (result) {

                    location.href = result;
                    //LoadLink();
                    //toastr.success("Success download link");
                },
                error: function (err) {
                    toastr.error(err.statusText);
                }
            });
        }


    });
    // #endregion download


    // upload
    $("#FindIns").on("change", function () {

        //e.preventDefault();

        if (window.FileReader)
            var filename = $(this)[0].files[0].name;
        else
            filename = $(this).val().split("/").pop().split("\\").pop();


        if (window.FormData !== undefined) {

            var fileData = new FormData();

            var fileUpload = $("#FindIns").get(0);
            var files = fileUpload.files;

            var arrFile = new Array();
            for (var i = 0; i < files.length; i++)
                fileData.append("files", files[i]);
                

            // 다른 전달내용
            var dwgEquipId = $("#DwgEquipId").val();
            fileData.append("Id", dwgEquipId);


            var input = $(this);

                $.ajax({
                    url: "/DrawingOrders/UploadInspection",
                    type: "POST",
                    contentType: false,
                    processData: false,
                    data: fileData,
                    success: function (result) {

                        if (result === "[]")
                            toastr.error(result);
                        else {

                            input.val("");

                            var id = $("#DwgEquipId").val();
                            LoadInspection(id);
                        }
                    },
                    error: function (err) {
                        toastr.error(err.statusText);
                    }
                });
        } else {
            console.log("FormData 없음");
        }
    });

    $("#FindDwgInfo").on("change", function () {
        if (window.FileReader)
            var filename = $(this)[0].files[0].name;
        else
            filename = $(this).val().split("/").pop().split("\\").pop();

        $(this).siblings(".upload-name").val(filename);
    });
    $("#FindID").on("change", function () {

        var strFiles = "";
        if (window.FileReader) {
            var files = $(this)[0].files;

            for (var i = 0; i < files.length; i++) {
                if (i > 0)
                    strFiles += ", ";

                strFiles += files[i].name;
            }
        }

        $(this).siblings(".upload-name").val(strFiles);
    });

    // create FD
    $("#BtnCreateFD").on("click", function () {

        var dwgEquipId = $("#DwgEquipId").val();
        var fileName = $("#DwgEquipFile").val();


        var arrInspection = new Array();
        var inspections = $("#InsList input:checked");

        $.each(inspections, function () {
            var hidden = $(this).parent().parent().parent().find("input[type=\"hidden\"]");
            arrInspection.push(hidden.val());
        });

        arrInspection = JSON.stringify(arrInspection);


        var arrManual = new Array();
        var manuals = $("#ManList input:checked");

        if (manuals.length === 0) {
            toastr.warning("선택된 Manual이 없습니다.");
            return false;
        }


        $.each(manuals, function () {
            var hidden = $(this).parent().parent().parent().find("input[type=\"hidden\"]");
            arrManual.push(hidden.val());
        });

        arrManual = JSON.stringify(arrManual);


        $.ajax({
            url: "/DrawingOrders/CreateFD",
            data: { dwgEquipId: dwgEquipId, fileName: fileName, arrInspection: arrInspection, arrManual: arrManual },
            success: function () {

                $("#DivFDrawing").modal("hide");
                toastr.success("Create FD", "Success create", { positionClass: "toast-bottom-right" });
            },
            error: function (request, status, error) {
                console.log(request.responseText);
            }
        });
    });
    $("#DivFDrawing").on("hide.bs.modal", function () {
        LoadEquipments(serviceIdx, "Load");
    });

    $(".underOverlay").on("click", function () {
        $(".under").removeClass("show");
        $(this).removeClass("show");
    });
    $(".under .form-check-input").on("change", function () {
        var label = $(this).siblings("label");
        var controls = $(this).parent().parent().siblings().find("select, input");

        if ($(this).prop("checked")) {
            label.removeClass("disabled");

            $.each(controls, function () {
                $(this).prop("disabled", false);

                if ($(this).is("select"))
                    SelectLJH($(this));
            });
        }
        else {
            label.addClass("disabled");

            $.each(controls, function () {
                $(this).prop("disabled", true);

                if ($(this).is("select"))
                    SelectLJH($(this));
            });
        }
    });
    // #endregion [Event]
});


function Initialize() {

    var menuBar = $("#MenuBar");

    // #region breadcrumb
    var ol = menuBar.find("ol.breadcrumb");

    var li = $("<li>", { class: "breadcrumb-item" });
    ol.append(li);

    var a = $("<a>", { href: "/DrawingOrders/List", text: "Drawings" });
    li.append(a);

    li = $("<li>", { class: "breadcrumb-item active", text: depth });
    ol.append(li);
    // #endregion breadcrumb


    // #region button group
    var btnGroup = menuBar.find("div.btn-group");

    var newGroup = $("<div>", { class: "btn-group mr-3" });
    btnGroup.before(newGroup);

    var btn = $("<button>", { id: "BtnEditOrder", type: "button", text: "EDIT", class: "btn primary-color text-white", value: "Edit" });
    newGroup.append(btn);
    // #endregion button group
}
function LoadService(serviceIdx) {

    $.ajax({
        url: '/DrawingOrders/ClearOrderItem',
        type: 'POST',
        data: { serviceIdx: serviceIdx },
        success: function (serviceIdx) {

            $.getJSON("/DrawingOrders/LoadService", { serviceIdx: serviceIdx })
                .done(function (json) {

                    var order = json["Order"];
                    var files = json["Files"];


                    // #region add option
                    for (var i = 0; i < 14; i++) {

                        var control, arr;

                        switch (i) {
                            case 0:
                                control = $("#YardId");
                                arr = order["arrYard"];
                                break;
                            case 1:
                                control = $("#ServiceType");
                                arr = order["arrType"];
                                break;
                            case 2:
                                control = $("#Version");
                                arr = order["arrVersion"];
                                break;
                            case 3:
                                control = $("#VesselType");
                                arr = order["arrVesselType"];
                                break;
                            case 4:
                                control = $("#Class");
                                arr = order["arrClass"];
                                break;
                            case 5:
                                control = $("#Notation");
                                arr = order["arrNotation"];
                                break;
                            case 6:
                                control = $("#Flag");
                                arr = order["arrFlag"];
                                break;
                            case 7:
                                control = $("#Contact");
                                arr = order["arrContact"];
                                break;
                            case 8:
                                control = $("#Engineer");
                                arr = order["arrEngineer"];
                                break;
                            case 9:
                                control = $("#Status");
                                arr = order["arrStatus"];
                                break;
                            case 10:
                                control = $("#PowerSource");
                                arr = order["arrPower"];
                                break;
                            case 11:
                                control = $("#RMS");
                                arr = order["arrRMS"];
                                break;
                            case 12:
                                control = $("#BAM");
                                arr = order["arrBAM"];
                                break;
                            case 13:
                                control = $("#GMDSS");
                                arr = order["arrGMDSS"];
                                break;
                        }

                        control.empty();

                        $.each(arr, function () {
                            var opt = $("<option>");
                            control.append(opt);

                            if (i === 1 || i === 9) {
                                opt.val(this["Value"]);
                                opt.text(this["Name"]);
                            } else if (i === 2) {
                                opt.val(this["ServiceIdx"]);
                                opt.text(this["Version"] + " (Request Date: " + this["RequestDate"] + ")");
                            } else {
                                opt.val(this["Id"]);
                                opt.text(this["Name"]);
                            }
                        });
                    }
                    // #endregion add option


                    // #region set value
                    var controls = $("#EditOrderBody").find("input, select");

                    $.each(controls, function () {
                        var name = $(this).prop("name");
                        var value = order[name];

                        if (!isEmpty(value))
                            $(this).val(value);

                        if (!(name === "ServiceType" || name === "Version"))
                            $(this).prop("disabled", true);

                        if ($(this).is("select"))
                            SelectLJH($(this));
                    });
                    // #endregion set value


                    // #region files
                    var divFiles = $("#OrderFiles");
                    divFiles.empty();


                    $.each(files, function () {
                        var category = this["Category"];
                        var fileName = this["FileName"];
                        var fileUrl = this["FileUrl"];

                        var headers = divFiles.find(".dropdown-header[data-fileName=\"" + category + "\"]");

                        if (headers.length === 0) {

                            var header = $("<span>", { class: "dropdown-header", text: category, "data-fileName": category });
                            divFiles.append(header);

                            headers = header;
                        }

                        var link = $("<a>", { class: "dropdown-item", href: fileUrl, text: fileName, target: "_blank" });
                        headers.after(link);
                    });
                    // #endregion files


                    LoadEquipments(serviceIdx, "Load");

                }).fail(function (error) { console.log(error); });
        },
        error: function (err) {
            toastr.error(err.statusText);
        }
    });
}
function LoadLink() {

    var serviceIdx = $("#ServiceIdx").val();

    $.ajax({
        url: "/DrawingOrders/LoadLink",
        data: { serviceIdx: serviceIdx },
        success: function (result) {

            result = JSON.parse(result);


            if (!isEmpty(result)) {

                var group = $("#BtnDownload");
                var a = group.parent().find("a");
                a.remove();


                a = $("<a>", {
                    href: result["Link"], text: result["FileName"] + " (" + result["CreateDate"] + ")", class: "btn text-capitalize", id: "zipLink"
                });
                group.parent().append(a);
            }
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        }
    });
}

function LoadFD(id) {

    loading.show();

    $("#DwgEquipId").val(id);

    // #region FD List
    var fdList = $("#FDList");
    fdList.empty();

    $.getJSON("/DrawingOrders/LoadFDList", { id: id }, function (json) {
        $.each(json, function () {

            var row = $("<div>", { class: "row mt-2 mb-2" });
            fdList.append(row);


            var col = $("<div>", { class: "col" });
            row.append(col);

            var formGroup = $("<div>", { class: "form-group form-check" });
            col.append(formGroup);


            var a = $("<a>", { href: this["FileLink"], target: "_blank", title: this["FileLink"], style: "margin:auto;" });
            formGroup.append(a);

            var text = $("<span>", { text: this["FileName"] });
            a.append(text);


            col = $("<div>", { class: "col-2", style: "text-align:right;" });
            row.append(col);

            var id = $("<input>", { type: "hidden", value: this["Id"] });
            col.append(id);

            var button = $("<button>", { type: "button", class: "btn btn-light" });
            col.append(button);

            var i = $("<i>", { class: "fa fa-minus" });
            button.append(i);
        });

        // Delete event
        $("#FDList button").click(function () {

            var id = $(this).siblings("input[type=\"hidden\"]").val();

            if (isEmpty(id)) {
                toastr.error("Empty id");
                return true;
            }


            $.ajax({
                url: "/DrawingOrders/DeleteDrawing",
                data: { id: id },
                success: function () {

                    var dwgEquipId = $("#DwgEquipId").val();
                    LoadFDList(dwgEquipId);
                },
                error: function (request, status, error) {
                    toastr.error("Delete Inspection", "code:" + request.status + "\n message::" + request.responseText + "\n error:" + error);
                }
            });
        });

    })
        .done(function () {

            var insList = $("#InsList");
            insList.empty();


            // #region inspection data
            $.getJSON("/DrawingOrders/FindInspection", { id: id }, function (json) {

                var modelName = json["ModelName"];
                $("#DwgEquipModel").val(modelName);

                var fileName = json["FDFileName"];
                $("#DwgEquipFile").val(fileName);


                var inspections = json["Inspection"];

                // Inspection data
                $.each(inspections, function () {

                    var row = $("<div>", { class: "row" });
                    insList.append(row);


                    var col = $("<div>", { class: "col" });
                    row.append(col);


                    var formGroup = $("<div>", { class: "form-group form-check" });
                    col.append(formGroup);

                    var checkbox = $("<input>", { type: "checkbox", class: "form-check-input" });
                    checkbox.prop("checked", true);
                    formGroup.append(checkbox);

                    var a = $("<a>", { href: this["FileLink"], target: "_blank", title: this["FileLink"], text: this["FileName"] });
                    formGroup.append(a);


                    col = $("<div>", { class: "col-2", style: "text-align:right;" });
                    row.append(col);

                    var id = $("<input>", { type: "hidden", value: this["Id"] });
                    col.append(id);

                    var button = $("<button>", { type: "button", class: "btn btn-light" });
                    col.append(button);

                    var i = $("<i>", { class: "fa fa-minus" });
                    button.append(i);
                });


                // Delete event
                $("#InsList button").click(function () {

                    var id = $(this).siblings("input[type=\"hidden\"]").val();

                    if (isEmpty(id)) {
                        toastr.error("Empty id");
                        return true;
                    }

                    $.ajax({
                        url: "/DrawingOrders/DeleteInspection",
                        data: { id: id },
                        success: function () {

                            var dwgEquipId = $("#DwgEquipId").val();
                            LoadInspection(dwgEquipId);
                        },
                        error: function (request, status, error) {
                            toastr.error("Delete Inspection", "code:" + request.status + "\n message::" + request.responseText + "\n error:" + error);
                        }
                    });
                });
            })
                .done(function () {

                    var manList = $("#ManList");
                    manList.empty();


                    // #region manual list
                    $.getJSON("/DrawingOrders/FindManual", { id: id }, function (json) {
                        $.each(json, function () {

                            var fileName = this["FileName"];

                            var row = $("<div>", { class: "row mt-2 mb-2" });
                            if (fileName.indexOf("CHART") > 0 || fileName.indexOf("TOKYO KEIKI") > 0)
                                manList.append(row);
                            else
                                manList.prepend(row);


                            var col = $("<div>", { class: "col" });
                            row.append(col);

                            var formGroup = $("<div>", { class: "form-group form-check" });
                            col.append(formGroup);

                            var checkbox = $("<input>", { type: "checkbox", class: "form-check-input" });
                            checkbox.prop("checked", fileName.indexOf("CHART") > 0 || fileName.indexOf("TOKYO KEIKI") > 0 ? false : true);
                            formGroup.append(checkbox);

                            var id = $("<input>", { type: "hidden", value: this["Id"] });
                            col.append(id);


                            var a = $("<a>", { href: this["FileLink"], target: "_blank", title: this["FileLink"] });
                            formGroup.append(a);

                            var text = $("<span>", { text: this["FileName"] });
                            a.append(text);


                            col = $("<div>", { class: "col-2 p-0" });
                            row.append(col);

                            col.append(this["Code"]);


                            col = $("<div>", { class: "col-1 p-0" });
                            row.append(col);

                            col.append(this["Version"]);


                            col = $("<div>", { class: "col-2", style: "text-align:right;" });
                            row.append(col);

                            col.append(this["Date"]);
                        });
                    })
                        .done(function () {
                            loading.hide();
                        })
                        .fail(function (jqxhr, textStatus, error) {
                            var err = textStatus + ", " + error;
                            toastr.error("Error", { positionClass: "toast-bottom-right" });
                        });
                    // #endregion manual list
                })
                .fail(function (jqxhr, textStatus, error) {
                    var err = textStatus + ", " + error;
                    toastr.error("Error", { positionClass: "toast-bottom-right" });
                });
            // #endregion inspection data
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            toastr.error("Error", { positionClass: "toast-bottom-right" });
        });
    // #endregion FD List
}
function LoadInspection(id) {

    var insList = $("#InsList");
    insList.empty();

    $.getJSON("/DrawingOrders/FindInspection", { id: id })
        .done(function (json) {

            var modelName = json["ModelName"];
            $("#DwgEquipModel").val(modelName);

            var fileName = json["FDFileName"];
            $("#DwgEquipFile").val(fileName);


            var inspections = json["Inspection"];

            // Inspection data
            $.each(inspections, function () {

                var row = $("<div>", { class: "row" });
                insList.append(row);


                var col = $("<div>", { class: "col" });
                row.append(col);


                var formGroup = $("<div>", { class: "form-group form-check" });
                col.append(formGroup);

                var checkbox = $("<input>", { type: "checkbox", class: "form-check-input" });
                checkbox.prop("checked", true);
                formGroup.append(checkbox);

                var a = $("<a>", { href: this["FileLink"], target: "_blank", title: this["FileLink"], text: this["FileName"] });
                formGroup.append(a);


                col = $("<div>", { class: "col-2", style: "text-align:right;" });
                row.append(col);

                var id = $("<input>", { type: "hidden", value: this["Id"] });
                col.append(id);

                var button = $("<button>", { type: "button", class: "btn btn-light" });
                col.append(button);

                var i = $("<i>", { class: "fa fa-minus" });
                button.append(i);
            });


            // Delete event
            $("#InsList button").click(function () {

                var id = $(this).siblings("input[type=\"hidden\"]").val();

                if (isEmpty(id)) {
                    toastr.error("Empty id");
                    return true;
                }


                $.ajax({
                    url: "/DrawingOrders/DeleteInspection",
                    data: { id: id },
                    success: function () {

                        var dwgEquipId = $("#DwgEquipId").val();
                        LoadInspection(dwgEquipId);
                    },
                    error: function (request, status, error) {
                        toastr.error("Delete Inspection", "code:" + request.status + "\n message::" + request.responseText + "\n error:" + error);
                    }
                });
            });
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            toastr.error("Error", { positionClass: "toast-bottom-right" });
        });
}

// configuration
function LoadEquipments(serviceIdx, action) {

    loading.show();

    // all clear
    $("#DivEquip .card-body .EquipmentGroup").empty();

    if (action === "Load") {

        // vessel equipment load -> service equipment load
        $.getJSON("/DrawingOrders/LoadVesselEquipments", { serviceIdx: serviceIdx })
            .done(function (arrEquip) {

                // #region vessel - equipments
                $.each(arrEquip, function () {

                    var group = this["Group"];
                    var productId = this["ProductId"];
                    var productModel = this["ProductModel"];


                    var div = $("#DivEquip div." + group.replace("/", "").replace(/ /g, ""));


                    var row = $("<div>", { class: "row align-items-center pl-3 pr-3" });
                    div.append(row);

                    var path = "/images/icon (128x128)/";
                    switch (group) {
                        case "MF/HF":
                            path += "icon_Radio_MHF.png";
                            break;
                        case "NAVTEX":
                            path += "icon_Radio_Navtex.png";
                            break;
                        case "SART":
                            path += "icon_Radio_Sart.png";
                            break;
                        case "EPIRB":
                            path += "icon_Radio_EPIRB.png";
                            break;
                        case "VHF":
                            path += "icon_Radio_VHF.png";
                            break;
                        case "TWO-WAY VHF":
                            path += "icon_Radio_Two-way.png";
                            break;
                        case "UHF":
                            path += "icon_Radio_UHF.png";
                            break;
                        case "WEATHER FAX":
                            path += "icon_Radio_WeatherFax.png";
                            break;
                        case "VDR":
                            path += "icon_Voyage_VDR.png";
                            break;
                        case "AIS":
                            path += "icon_Voyage_AIS.png";
                            break;
                        case "GPS":
                            path += "icon_Voyage_DGPS.png";
                            break;
                        case "BNWAS":
                            path += "icon_Voyage_BNWAS.png";
                            break;
                        case "SAT-LOG":
                            path += "icon_Voyage_SatLog.png";
                            break;
                        case "BRIDGE INTERFACE":
                            path += "icon_MFD_BIF.png";
                            break;
                        case "RADAR":
                            path += "icon_MFD_Radar.png";
                            break;
                        case "ECDIS":
                            path += "icon_MFD_Ecdis.png";
                            break;
                        case "CONNING DISPLAY":
                            path += "icon_MFD_Conning.png";
                            break;
                        case "RPS":
                            path += "icon_MFD_RoutePlanning.png";
                            break;
                        case "ECHO SOUNDER":
                            path += "icon_Bottom_EchoSounder.png";
                            break;
                        case "DOPPLER SONAR":
                            path += "icon_Bottom_SpeedLog.png";
                            break;
                        case "DOPPLER LOG":
                            path += "icon_Bottom_SpeedLog.png";
                            break;
                        case "INMARSAT-C":
                            path += "icon_Inmarsat_C.png";
                            break;
                        case "INMARSAT-FB":
                            path += "icon_Inmarsat_FBB.png";
                            break;
                        case "SSAS":
                            path += "icon_Inmarsat_SASS.png";
                            break;
                        case "LRIT":
                            path += "icon_Inmarsat_LRIT.png";
                            break;
                    }

                    var img = $("<img>", { src: path, width: "50" });
                    row.append(img);

                    var col = $("<div>", { class: "col pl-2 pr-2" });
                    row.append(col);

                    var btnGroup = $("<div>", { class: "btn-group w-100" });
                    col.append(btnGroup);

                    var btn = $("<button>", {
                        type: "button",
                        class: "btn disabled w-100 minfo",
                        "data-group": group,
                        "data-productId": productId,
                        text: productModel,
                        "data-check": 0
                    });
                    btnGroup.append(btn);
                });
                // #endregion vessel - equipments


                // #region load config equipments
                $.getJSON("/DrawingOrders/LoadConfigEquipments", { serviceIdx: serviceIdx, act: action })
                    .done(function (arrOrder) {

                        var serviceType = $("#ServiceType").val();

                        $.each(arrOrder, function () {

                            var serviceIdx = this["ServiceIdx"];
                            var serviceType = this["ServiceType"];
                            var version = this["Version"];
                            var diff = this["DiffVersion"];
                            var orderState = this["OrderState"];
                            var equipments = this["Equipments"];
                            var mergeFiles = this["MergeFile"];

                            var drawingType = "FD";
                            if (serviceType === 90)
                                drawingType = "AD";
                            else if (serviceType === 95)
                                drawingType = "WD";


                            $.each(equipments, function () {
                                var id = this["Id"];
                                var productId = this["ProductId"];
                                var name = this["Name"];
                                var group = this["Group"];
                                var modifier = this["Modifier"];
                                var link = this["Link"];
                                var haveChildren = this["HaveChildren"];
                                var productState = this["ProductState"];        // 등록 완료된 product인지,
                                var quantity = this["Quantity"];
                                var files = this["Files"];
                                var state = this["State"];      // model의 drawing state
                                var serviceItemIdx = this["ServiceItemIdx"];


                                // vessel - equipment에서 find product
                                var btns = $("#DivEquip button[data-productId=\"" + productId + "\"]");
                                if (btns === undefined || btns.length === 0)
                                    return true;


                                if (isEmpty(productState) && serviceType !== 99) {
                                    btns.prop("title", "아직 지원되지 않는 모델입니다.");
                                    return true;
                                }


                                $.each(btns, function () {
                                    var btn = $(this);
                                    var btnState = $(this).siblings(".state");

                                    if (btn.attr("data-check") === "0") {
                                        btn.attr("data-check", 1);
                                        btn.val(id);

                                        var btnGroup = $(btn).parent();

                                        // link
                                        var btnDetail = $("<button>", { type: "button", class: "btn btn-light cursor-pointer" });
                                        btnGroup.append(btnDetail);

                                        if (serviceType !== 99) {
                                            btnDetail.attr("onclick", "location.href=\"" + link + "\"");
                                        } else {
                                            btnDetail.on("click", function () {
                                                var id = $(this).siblings(".minfo").val();

                                                LoadFD(id);
                                                $("#DivFDrawing").modal("show");
                                            });
                                        }

                                        var detailIcon = $("<i>", { class: "fas fa-info" });
                                        btnDetail.append(detailIcon);

                                        var equipmentName = (isEmpty(modifier) ? "" : modifier + " ") + btn.text();
                                        btn.text(equipmentName);

                                        // badge
                                        var qtyBadge = $("<span>", { text: "Q:" + quantity, class: "float-right badge" });
                                        btn.append(qtyBadge);

                                        var verBadge = $("<span>", { text: drawingType + " " + version, class: "float-right badge" });
                                        btn.append(verBadge);

                                        // order state, equipment state -> button color
                                        if (!diff)
                                            check = 30;
                                        else if (orderState === "70")
                                            check = 20;
                                        else
                                            check = state === 0 ? 10 : state;

                                        if (check !== 0) {
                                            btn.removeClass("disabled");
                                            btn.addClass("cursor-default");
                                            btn.addClass("bg-white");

                                            btnState = $("<button>", { class: "state btn cursor-default", "data-state": check });
                                            btn.before(btnState);


                                            if (check === 10 || check === 20) {

                                                btnState.removeClass("cursor-default");
                                                btnState.prop("title", "toggle state");

                                                if (check === 10) {
                                                    btnState.addClass("warning-color");
                                                    btn.addClass("warning-color-font");
                                                    qtyBadge.addClass("warning-color");
                                                    verBadge.addClass("warning-color mr-1");

                                                } else if (check === 20) {
                                                    btnState.addClass("success-color");
                                                    btn.addClass("success-color-font");
                                                    qtyBadge.addClass("success-color");
                                                    verBadge.addClass("success-color mr-1");
                                                }


                                                btnState.on("click", function () {

                                                    loading.show();

                                                    var strState = $(this).attr("data-state");
                                                    var minfo = $(this).siblings(".minfo");

                                                    if (strState === "10") {
                                                        $(this).removeClass("warning-color");
                                                        $(this).addClass("success-color");

                                                        minfo.removeClass("warning-color-font");
                                                        minfo.addClass("success-color-font");

                                                        var badge = minfo.find(".badge");
                                                        $.each(badge, function () {
                                                            $(this).removeClass("warning-color");
                                                            $(this).addClass("success-color");
                                                        });

                                                        $(this).attr("data-state", 20);
                                                        strState = 20;
                                                    } else {
                                                        $(this).removeClass("success-color");
                                                        $(this).addClass("warning-color");

                                                        minfo.removeClass("success-color-font");
                                                        minfo.addClass("warning-color-font");

                                                        badge = minfo.find(".badge");
                                                        $.each(badge, function () {
                                                            $(this).removeClass("success-color");
                                                            $(this).addClass("warning-color");
                                                        });

                                                        $(this).attr("data-state", 10);
                                                        strState = 10;
                                                    }

                                                    $.ajax({
                                                        url: "/DrawingOrders/ChangeState",
                                                        type: "POST",
                                                        data: { strState: strState, dwgEquipId: minfo.val() },
                                                        success: function () {
                                                            loading.hide();
                                                        },
                                                        error: function (request, status, error) {
                                                            toastr.error("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
                                                        }
                                                    });

                                                });
                                            } else if (check === 30) {
                                                btnState.addClass("info-color");
                                                btn.addClass("info-color-font");
                                                qtyBadge.addClass("info-color");
                                                verBadge.addClass("info-color mr-1");
                                            }
                                        }


                                        // files
                                        if (files !== undefined && files.length !== 0) {
                                            btnGroup.addClass("dropright");

                                            // file icon
                                            var btnFile = $("<button>", { type: "button", class: "btn btn-light cursor-pointer", "data-toggle": "dropdown" });
                                            btnGroup.append(btnFile);

                                            var fileListIcon = $("<i>", { class: "far fa-file" });
                                            btnFile.append(fileListIcon);

                                            // file list
                                            var menu = $("<div>", { class: "dropdown-menu" });
                                            btnFile.before(menu);

                                            $.each(files, function () {
                                                var path = this["Path"];
                                                var fileName = this["FileName"];

                                                a = $("<a>", { class: "dropdown-item", href: this["Path"], target: "_blank" });

                                                if (fileName.indexOf("docx") > 0) {
                                                    var fileIcon = $("<i>", { class: "fas fa-file-word mr-2" });
                                                    a.append(fileIcon);
                                                    var spanName = $("<span>", { text: fileName });
                                                    a.append(spanName);
                                                } else if (fileName.indexOf("pdf") > 0) {
                                                    fileIcon = $("<i>", { class: "fas fa-file-pdf mr-2" });
                                                    a.append(fileIcon);

                                                    spanName = $("<span>", { text: fileName });
                                                    a.append(spanName);
                                                }
                                                menu.append(a);
                                            });
                                        }

                                        return false;
                                    }
                                });
                            });

                            $.each(mergeFiles, function () {
                                var group = this["Group"];
                                var id = this["Id"];
                                var path = this["Path"];

                                var mHeader = $("." + group);

                                var mergeButton = $("<button>", { type: "button", value: id, class: "btn btn-light cursor-pointer", onclick: "window.open(\"" + path + "\")" });
                                mHeader.append(mergeButton);

                                var mergeIcon = $("<i>", { class: "far fa-file" });
                                mergeButton.append(mergeIcon);
                            });
                        });

                        loading.hide();

                    }).fail(function (error) { console.log(error); });
                // #endregion load config equipments


                loading.hide();

            }).fail(function (error) { console.log(error); });
    } else {

        // #region all equipment
        $.getJSON("/DrawingOrders/LoadEquipments", function (arrEquip) {

            $.each(arrEquip, function () {

                var group = this["Group"];
                var products = this["Products"];

                var div = $("#DivEquip div." + group.replace("/", "").replace(/ /g, ""));


                var count = 1;

                if (group === "ECDIS" || group === "CONNING DISPLAY")
                    count = 2;
                else if (group === "RADAR")
                    count = 3;

                for (var i = 0; i < count; i++) {
                    var row = $("<div>", { class: "row align-items-center pl-3 pr-3" });
                    row.on("click", function (e) {
                        if ($(e.currentTarget).is("select") || $(e.currentTarget).is("input"))
                            return false;

                        var checkbox = $(this).find("input[type=\"checkbox\"]");
                        checkbox.prop("checked", !checkbox.prop("checked"));
                        checkbox.trigger("change");
                    });
                    div.append(row);

                    var checkbox = $("<input>", { type: "checkbox", class: "mr-1" });
                    checkbox.on("change", function () {
                        var row = $(this).parent();

                        if ($(this).prop("checked"))
                            row.addClass("light-blue lighten-4");
                        else
                            row.removeClass("light-blue lighten-4");
                    });
                    row.append(checkbox);

                    var path = "/lib/image/icon (128x128)/";
                    switch (group) {
                        case "MF/HF":
                            path += "icon_Radio_MHF.png";
                            break;
                        case "NAVTEX":
                            path += "icon_Radio_Navtex.png";
                            break;
                        case "SART":
                            path += "icon_Radio_Sart.png";
                            break;
                        case "EPIRB":
                            path += "icon_Radio_EPIRB.png";
                            break;
                        case "VHF":
                            path += "icon_Radio_VHF.png";
                            break;
                        case "TWO-WAY VHF":
                            path += "icon_Radio_Two-way.png";
                            break;
                        case "UHF":
                            path += "icon_Radio_UHF.png";
                            break;
                        case "WEATHER FAX":
                            path += "icon_Radio_WeatherFax.png";
                            break;
                        case "VDR":
                            path += "icon_Voyage_VDR.png";
                            break;
                        case "AIS":
                            path += "icon_Voyage_AIS.png";
                            break;
                        case "GPS":
                            path += "icon_Voyage_DGPS.png";
                            break;
                        case "BNWAS":
                            path += "icon_Voyage_BNWAS.png";
                            break;
                        case "SAT-LOG":
                            path += "icon_Voyage_SatLog.png";
                            break;
                        case "BRIDGE INTERFACE":
                            path += "icon_MFD_BIF.png";
                            break;
                        case "RADAR":
                            path += "icon_MFD_Radar.png";
                            break;
                        case "ECDIS":
                            path += "icon_MFD_Ecdis.png";
                            break;
                        case "CONNING DISPLAY":
                            path += "icon_MFD_Conning.png";
                            break;
                        case "RPS":
                            path += "icon_MFD_RoutePlanning.png";
                            break;
                        case "ECHO SOUNDER":
                            path += "icon_Bottom_EchoSounder.png";
                            break;
                        case "DOPPLER SONAR":
                            path += "icon_Bottom_SpeedLog.png";
                            break;
                        case "DOPPLER LOG":
                            path += "icon_Bottom_SpeedLog.png";
                            break;
                        case "INMARSAT-C":
                            path += "icon_Inmarsat_C.png";
                            break;
                        case "INMARSAT-FB":
                            path += "icon_Inmarsat_FBB.png";
                            break;
                        case "SSAS":
                            path += "icon_Inmarsat_SASS.png";
                            break;
                        case "LRIT":
                            path += "icon_Inmarsat_LRIT.png";
                            break;
                    }

                    var img = $("<img>", { src: path, width: "50" });
                    row.append(img);


                    var col = $("<div>", { class: "col pr-0" });
                    row.append(col);

                    var inputGroup = $("<div>", { class: "input-group" });
                    col.append(inputGroup);

                    var name = group.replace("/", "").replace(/ /g, "");
                    if (count > 1)
                        name += i + 1;

                    var select = $("<select>", { name: name });
                    inputGroup.append(select);

                    $.each(products, function () {
                        var id = this["Id"];
                        var model = this["Model"];

                        var opt = $("<option>", { value: id, text: model });
                        select.append(opt);
                    });

                    SelectLJH(select);

                    var inputGroupAppend = $("<div>", { class: "input-group-append" });
                    inputGroup.append(inputGroupAppend);

                    var quantity = $("<input>", { type: "number", class: "form-control", name: "quantity", value: group === "TWO-WAY VHF" ? 3 : 1 });
                    inputGroupAppend.append(quantity);
                }
            });


            // #region config
            $.getJSON("/DrawingOrders/LoadConfigEquipments", { serviceIdx: serviceIdx, action: null })
                .done(function (arrConfig) {

                    $.each(arrConfig[0]["Equipments"], function () {

                        var id = this["Id"];
                        var productId = this["ProductId"];
                        var name = this["Name"];
                        var quantity = this["Quantity"];
                        var serviceItemIdx = this["ServiceItemIdx"];


                        var select = $("#DivEquip select[name=\"" + name.replace("/", "").replace(/ /g, "") + "\"]");

                        select.val(productId);
                        SelectLJH(select, "prepend");

                        var row = select.parent().parent().parent();
                        row.addClass("light-blue lighten-4");

                        var checkbox = row.find("input[type=\"checkbox\"]");
                        checkbox.prop("checked", true);
                        checkbox.val(serviceItemIdx);

                        var inputId = $("<input>", { type: "hidden", value: id, name: "DrawingEquipId" });
                        checkbox.after(inputId);

                        var input_Quantity = row.find("input[name=\"quantity\"]");
                        input_Quantity.val(quantity);
                    });

                }).fail(function (error) { console.log(error); });

            var button = $("#BtnEditOrder");
            button.val("Save");
            button.text("Save");
            button.removeClass("primary-color");
            button.addClass("success-color");
            // #endregion config

            $("#Loading").hide();

        }).fail(function (error) { console.log(error); });
        // #endregion all equipment
    }
}
function EditOrderEnd(serviceIdx) {

    // file
    var fileData = new FormData();

    var dwgInfo = $("#FindDwgInfo").get(0).files;
    var inspection = $("#FindID").get(0).files;


    for (var i = 0; i < dwgInfo.length; i++)
        fileData.append("DwgInfoShtFile", dwgInfo[i]);

    for (i = 0; i < inspection.length; i++)
        fileData.append("InspectionFile", inspection[i]);

    fileData.append("serviceIdx", serviceIdx);


    // equipments
    var arrEquipments = new Array();


    var checkes = $("#DivEquip input[type=\"checkbox\"]");

    $.each(checkes, function () {

        var row = $(this).parent();

        var obEquip = {
            EquipName: row.find("select").attr("name"),
            Check: $(this).prop("checked"),
            ProductId: row.find("select").val(),
            Quantity: row.find("input[name=\"quantity\"]").val(),
            ServiceItemIdx: $(this).val(),
            DrawingEquipId: $(this).siblings("input[name=\"DrawingEquipId\"]").val()
        };

        arrEquipments.push(obEquip);
    });

    var obOrder = {
        ServiceIdx: serviceIdx,
        Equipments: arrEquipments
    };

    var json = JSON.stringify(obOrder);

    fileData.append("json", json);

    $.ajax({
        type: "POST",
        url: "/DrawingOrders/SaveEditOrder",
        contentType: false,
        processData: false,
        data: fileData,
        success: function (msg) {

            if (msg === "Success") {
                LoadEquipments(serviceIdx, "Load");

                var button = $("#BtnEditOrder");

                button.val("Edit");
                button.text("Edit");
                button.removeClass("btn-success");
                button.addClass("btn-primary");


                $("#FindDwgInfo").parent().css("display", "none");
                $("#FindID").parent().css("display", "none");

                toastr.success("Save equipments", "Success save", { positionClass: "toast-bottom-right" });

            } else
                toastr.error(msg);
        }
    });
}