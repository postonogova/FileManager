(function () {

    var FM = window.FM = {};
    var model = FM.Model = {
        Left: {
            id: "Left",
            active: true,
            Disk: null,
            Path: null,
            Disks: [],
            Files: [],
            Selection: []
        },
        Right: {
            id: "Right",
            active: false,
            Disk: null,
            Path: null,
            Disks: [],
            Files: [],
            Selection: []
        }
    };

    var viewModel = FM.viewModel = {
        Left: {
            SelectNode: null,
            TextNode: null,
            TableNode: null,
            SelectRow: []
        },
        Right: {
            SelectNode: null,
            TextNode: null,
            TableNode: null,
            SelectRow: []
        }
    }

    FM.init = function () {
        // Get disks
        $.ajax({
                type: 'GET',
                url: 'getDisks',
                success: function (result) {
                    var disks = result ? JSON.parse(result) : [];
                    model.Left.Disks = disks;
                    model.Right.Disks = disks;
                    model.Left.Disk = disks[0];
                    model.Right.Disk = disks[0];
                    model.Left.Path = disks[0].directory;
                    model.Right.Path = disks[0].directory;
                    //renderFiles(document.getElementById("sidebar"), files);
                }
            })
            // Get folders & files for each panel
            .then(function () {
                    // Get files
                    FM.getFiles(model.Left.Disk.directory, function (files) {
                        model.Left.Files = files;
                    }).then(
                        function () {
                            FM.getFiles(model.Right.Disk.directory, function (files) {
                                model.Right.Files = files;
                            }).then(
                                function () {
                                    FM.renderPage();
                                }
                            );
                        }
                    );
                }
            )
    };

    FM.getFiles = function (directory, callback) {
        return $.ajax({
            type: 'GET',
            url: 'getFiles',
            data: {directory: directory},
            success: function (result) {
                var files = result ? JSON.parse(result) : [];
                if (callback) {
                    callback(files);
                }
            }
        })
    };

    FM.renderPage = function () {
        var lSelectNode = FM.renderDisk(model.Left);
        viewModel.Left.SelectNode = lSelectNode;
        _appendChild("lDisk", lSelectNode);

        var rSelectNode = FM.renderDisk(model.Right);
        viewModel.Right.SelectNode = rSelectNode;
        _appendChild("rDisk", rSelectNode);

        FM.renderBtnRefresh("lBtnRefresh", model.Left);
        FM.renderBtnRefresh("rBtnRefresh", model.Right);
        FM.renderGoUp("lBtnUp", model.Left);
        FM.renderGoUp("rBtnUp", model.Right);

        var lTextNode = FM.renderPath(model.Left);
        viewModel.Left.TextNode = lTextNode;
        _appendChild("lPath", lTextNode);

        var rTextNode = FM.renderPath(model.Right);
        viewModel.Right.TextNode = rTextNode;
        _appendChild("rPath", rTextNode);

        var lTableNode = FM.renderTable(model.Left);
        viewModel.Left.TableNode = lTableNode;
        _appendChild("lTable", lTableNode);

        var rTableNode = FM.renderTable(model.Right);
        viewModel.Right.TableNode = rTableNode;
        _appendChild("rTable", rTableNode);

        FM.renderToolBar();
    };

    FM.onDiskChanged = function (panel, disk) {
        panel.Disk = disk;
        panel.Path = disk.directory;
        FM.onPathChanged(panel, panel.Path);
    };

    FM.onPathChanged = function (panel, path) {
        FM.getFiles(path, function (files) {
            panel.Files = files;
            panel.Path = path;
            viewModel.Right.SelectRow.forEach(function (item, i, seliction) {
                item.className = "";
            });
            model.Right.Selection.length = 0;
            viewModel.Left.SelectRow.forEach(function (item, i, seliction) {
                item.className = "";
            });
            model.Left.Selection.length = 0;
            FM.refreshPath(panel);
            var tableNode = FM.renderTable(panel);
            if (panel.id == "Left") {
                viewModel.Left.TableNode = tableNode;
                _appendChild("lTable", tableNode);
            }
            if (panel.id == "Right") {
                viewModel.Right.TableNode = tableNode;
                _appendChild("rTable", tableNode);
            }
        });
    }

    FM.onSelectChanged = function (panel, row, file) {
        if (panel.id == "Left") {
            var vModel = viewModel.Left;
        }
        if (panel.id == "Right") {
            var vModel = viewModel.Right;
        }
        if (!panel.active) {
            if (panel.id == "Left") {
                _changeFocus(model.Right, model.Left, viewModel.Right);
            }
            if (panel.id == "Right") {
                _changeFocus(model.Left, model.Right, viewModel.Left);
            }
        }
        if (row.className == "") {
            row.className = "clicked_Row";
            vModel.SelectRow[vModel.SelectRow.length] = row;
            panel.Selection[panel.Selection.length] = file;
        }
        else {
            row.className = "";
            var i = vModel.SelectRow.indexOf(row);
            vModel.SelectRow.splice(i, 1);
            i = panel.Selection.indexOf(file);
            panel.Selection.splice(i, 1);
        }
    };

    FM.onCopyFiles = function (sourceFile, destDirectory, panel) {
        return $.ajax({
            type: 'POST',
            url: 'CopyFiles',
            data: {
                sourceFile: sourceFile,
                destDirectory: destDirectory
            },
            success: function (result) {
                FM.onPathChanged(panel, panel.Path);
            }
        })
    };

    FM.onMoveFiles = function (sourceFile, destDirectory) {
        return $.ajax({
            type: 'POST',
            url: 'MoveFiles',
            data: {
                sourceFile: sourceFile,
                destDirectory: destDirectory
            },
            success: function (result) {
                FM.onPathChanged(model.Left, model.Left.Path);
                FM.onPathChanged(model.Right, model.Right.Path);
            }
        })
    };

    FM.onDeleteFiles = function (sourceFile, panel) {
        return $.ajax({
            type: 'POST',
            url: 'DeleteFiles',
            data: {
                sourceFile: sourceFile,
            },
            success: function (result) {
                FM.onPathChanged(panel, panel.Path);
            }
        })
    };

    FM.onCreateDirectory = function (nameDirectory, panel) {
        return $.ajax({
            type: 'POST',
            url: 'CreateDirectory',
            data: {
                nameDirectory: nameDirectory,
                path: panel.Path
            },
            success: function (result) {
                FM.onPathChanged(panel, panel.Path);
            }
        })
    };

    FM.onGoUp = function (panel) {
        return $.ajax({
            type: 'POST',
            url: 'GetParent',
            data: {
                path: panel.Path
            },
            success: function (result) {
                var newPath = (result == null) ? panel.Path : result;
                panel.Path = newPath;
                FM.onPathChanged(panel, panel.Path);
            }
        })
    };

    FM.renderDisk = function (panel) {
        var selectNode = document.createElement("select");
        for (var i = 0; i < panel.Disks.length; i++) {
            var optionNode = document.createElement("option");
            optionNode.innerHTML = panel.Disks[i].directory;
            selectNode.appendChild(optionNode);
            if (panel.Disks[i].directory == panel.Disk.directory) {
                optionNode.selected = "selected";
            }
        }
        $(selectNode).change(function () {
            var n = selectNode.selectedIndex;
            FM.onDiskChanged(panel, panel.Disks[n]);
        });
        return selectNode;
    };

    FM.renderPath = function (panel) {
        var textNode = document.createElement("input");
        textNode.type = "text";
        textNode.value = panel.Path;
        textNode.disabled = true;
        return textNode;
    };

    FM.renderTable = function (panel) {
        var tableNode = document.createElement("table");
        var header = tableNode.createTHead();
        var hRow = header.insertRow(0);

        var hCell = hRow.insertCell(0);
        hCell.innerHTML = "<b>Имя</b>";
        hCell.align = "center";

        hCell = hRow.insertCell(1);
        hCell.innerHTML = "<b>Размер</b>";
        hCell.align = "center";

        hCell = hRow.insertCell(2);
        hCell.innerHTML = "<b>Дата измерения</b>";
        hCell.align = "center";

        hCell = hRow.insertCell(3);
        hCell.innerHTML = "<b>Атрибуты</b>";
        hCell.align = "center";

        var body = tableNode.createTBody();
        panel.Files.forEach(function (item, i, files) {
            var bRow = body.insertRow(i);

            var bCell = bRow.insertCell(0);
            bCell.innerHTML = item.nameFile;
            _addIcon(bCell, item.typeFile);

            bCell = bRow.insertCell(1);
            bCell.align = "center";
            if (item.typeFile == "folder") {
                bCell.innerHTML = "<папка>";
            }
            else {
                bCell.innerHTML = item.sizeFile;
            }

            bCell = bRow.insertCell(2);
            bCell.align = "center";
            var date = new Date(item.dateChange);
            bCell.innerHTML = date.toLocaleString();

            bCell = bRow.insertCell(3);
            bCell.align = "center";
            bCell.innerHTML = item.attributes;
            if (item.typeFile == "folder") {
                $(bRow).dblclick(
                    // item - не изменится, т.к. он не меняется в родительском контексте
                    function () {
                        FM.onPathChanged(panel, item.directory);
                    }
                    // Для случая, когда item может измениться
                    /*(function (item) {
                     return function (){

                     };
                     })(item)*/
                );
            }
            $(bRow).click(
                function () {
                    FM.onSelectChanged(panel, bRow, item)
                }
            );
            // }
        })
        ;
        return tableNode;
    };

    FM.renderToolBar = function () {
        var btnCopy = _createButton("btnCopy", "Копирование");
        $(btnCopy).click(
            function () {
                if (model.Left.active) {
                    model.Left.Selection.forEach(function (item, i, seliction) {
                        FM.onCopyFiles(item.directory, model.Right.Path, model.Right);
                    });
                }
                if (model.Right.active) {
                    model.Right.Selection.forEach(function (item, i, seliction) {
                        FM.onCopyFiles(item.directory, model.Left.Path, model.Left);
                    });
                }

            }
        );

        var btnMove = _createButton("btnMove", "Перемещение");
        $(btnMove).click(
            function () {
                if (model.Left.active) {
                    model.Left.Selection.forEach(function (item, i, seliction) {
                        FM.onMoveFiles(item.directory, model.Right.Path);
                    });
                }
                if (model.Right.active) {
                    model.Right.Selection.forEach(function (item, i, seliction) {
                        FM.onMoveFiles(item.directory, model.Left.Path);
                    });
                }

            }
        );

        var btnFolder = _createButton("btnFolder", "Каталог");
        $(btnFolder).click(
            function () {
                var result = prompt("Создать новый каталог (папку)", "Новая папка");
                if (result != null) {
                    if (model.Left.active) {
                        FM.onCreateDirectory(result, model.Left);
                    }
                    if (model.Right.active) {
                        FM.onCreateDirectory(result, model.Right);
                    }
                }
            }
        );

        var btnDelete = _createButton("btnDelete", "Удаление");
        $(btnDelete).click(
            function () {
                var result = confirm("Удалить файлы?");
                if (result) {
                    if (model.Left.active) {
                        model.Left.Selection.forEach(function (item, i, seliction) {
                            FM.onDeleteFiles(item.directory, model.Left);
                        });
                    }
                    if (model.Right.active) {
                        model.Right.Selection.forEach(function (item, i, seliction) {
                            FM.onDeleteFiles(item.directory, model.Right);
                        });
                    }
                }
            }
        );
    }

    FM.renderBtnRefresh = function (idParent, panel) {
        var btnRefresh = document.createElement("button");
        btnRefresh.innerHTML = "<img src='images/refresh.png' style='vertical-align: middle' width='18' height='18'>";
        _appendChild(idParent, btnRefresh);
        $(btnRefresh).click(
            function () {
                FM.onPathChanged(panel, panel.Path);
            }
        );
    }

    FM.renderGoUp = function (idParent, panel) {
        var btnGoUp = document.createElement("button");
        btnGoUp.innerHTML = "<img src='images/go-up.png' style='vertical-align: middle' width='18' height='18'>";
        _appendChild(idParent, btnGoUp);
        $(btnGoUp).click(
            function () {
                FM.onGoUp(panel);
            }
        );
    }

    FM.refreshPath = function (panel) {
        if (panel.id == "Left") {
            viewModel.Left.TextNode.value = panel.Path;
        }
        if (panel.id == "Right") {
            viewModel.Right.TextNode.value = panel.Path;
        }
    }

    function _createButton(idParent, name) {
        var btnToolBar = document.createElement("input");
        btnToolBar.type = "button";
        btnToolBar.value = name;
        _appendChild(idParent, btnToolBar);
        return btnToolBar;
    }

    function _appendChild(id, node) {
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).appendChild(node);
    }

    function _changeFocus(oldFocusPanel, newFocusPanel, oldViewFocusPanel) {
        newFocusPanel.active = true;
        oldFocusPanel.active = false;
        oldViewFocusPanel.SelectRow.forEach(function (item, i, seliction) {
            item.className = "";
        });
        oldFocusPanel.Selection.length = 0;
    }

    function _addIcon(cell, typeFile) {
        var temp = cell.innerHTML;
        var str = "images/";
        switch (typeFile) {
            case "folder":
                str += "folder.png";
                break;
            case "acc":
            case "avi":
            case "bmp":
            case "cue":
            case "divx":
            case "doc":
            case "eps":
            case "flac":
            case "flv":
            case "gif":
            case "html":
            case "indd":
            case "inx":
            case "iso":
            case "jpg":
            case "mov":
            case "mp3":
            case "mpg":
            case "php":
            case "png":
            case "ppt":
            case "psd":
            case "qxd":
            case "qxp":
            case "raw":
            case "rtf":
            case "svg":
            case "txt":
            case "vcf":
            case "wav":
            case "wma":
            case "xls":
            case "xml":
                str += "file_" + typeFile + ".png";
                break;
            default:
                str += "document.png";
        }

        cell.innerHTML = "<img src=" + str + " width='25' height='25' align='left'>" + temp;
    }

})();