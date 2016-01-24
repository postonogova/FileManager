/**
 * Created by postonogova on 18.01.2016.
 */
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
            viewModel.Right.SelectRow.forEach(function(item, i, seliction) {
                item.className = "";
            });
            model.Right.Selection.length = 0;
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

    FM.onSelectChanged = function (panel, row, file){
        if(panel.id == "Left") {
            var vModel = viewModel.Left;
        }
        if(panel.id == "Right") {
            var vModel = viewModel.Right;
        }
        if(!panel.active) {
            if(panel.id == "Left") {
                _changeFocus(model.Right, model.Left, viewModel.Right);
            }
            if(panel.id == "Right") {
                _changeFocus(model.Left, model.Right, viewModel.Left);
            }
        }
        if(row.className == "") {
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

    FM.onCopyFiles = function(sourceFile, destDirectory, panel) {
        return $.ajax({
            type: 'POST',
            url: 'CopyFiles',
            data: {sourceFile: sourceFile,
                destDirectory: destDirectory
            },
            success: function (result) {
                FM.onPathChanged(panel, panel.Path);
            }
        })
    };

    FM.onMoveFiles = function(sourceFile, destDirectory) {
        return $.ajax({
            type: 'POST',
            url: 'MoveFiles',
            data: {sourceFile: sourceFile,
                destDirectory: destDirectory
            },
            success: function (result) {
                FM.onPathChanged(model.Left, model.Left.Path);
                FM.onPathChanged(model.Right, model.Right.Path);
            }
        })
    };

    FM.onDeleteFiles = function(sourceFile, panel) {
        return $.ajax({
            type: 'POST',
            url: 'DeleteFiles',
            data: {sourceFile: sourceFile,
            },
            success: function (result) {
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
        hCell = hRow.insertCell(1);
        hCell.innerHTML = "<b>Тип</b>";
        hCell = hRow.insertCell(2);
        hCell.innerHTML = "<b>Размер</b>";
        hCell = hRow.insertCell(3);
        hCell.innerHTML = "<b>Дата измерения</b>";
        var body = tableNode.createTBody();
        panel.Files.forEach(function (item, i, files) {
            var bRow = body.insertRow(i);
            var bCell = bRow.insertCell(0);
            bCell.innerHTML = item.nameFile;
            bCell = bRow.insertCell(1);
            bCell.innerHTML = item.typeFile;
            bCell = bRow.insertCell(2);
            bCell.innerHTML = item.sizeFile;
            bCell = bRow.insertCell(3);
            var date = new Date(item.dateChange);
            bCell.innerHTML = date.toLocaleString();
            //if(item.typeFile == "folder") {
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
            $(bRow).click(
                function () {
                    FM.onSelectChanged(panel, bRow, item)
                }
            );
            // }
        });
        return tableNode;
    };

    FM.renderToolBar = function () {
        var btnCopy = _cresteButton("btnCopy", "Копирование");
        $(btnCopy).click(
            function() {
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
        var btnMove = _cresteButton("btnMove", "Перемещение");
        $(btnMove).click(
            function() {
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
        var btnFolder = _cresteButton("btnFolder", "Каталог");
        var btnDelete = _cresteButton("btnDelete", "Удаление");
        $(btnDelete).click(
            function() {
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

    function _cresteButton(idParent, name) {
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
        oldViewFocusPanel.SelectRow.forEach(function(item, i, seliction) {
            item.className = "";
        });
        oldFocusPanel.Selection.length = 0;
    }

})();