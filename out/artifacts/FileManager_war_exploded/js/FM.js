/**
 * Created by postonogova on 18.01.2016.
 */
(function(){

    var FM = window.FM = {};
    var model = FM.Model = {
        Left: {
            id: "Left",
            Disk: null,
            Path: null,
            Disks: [],
            Files: []
        },
        Right: {
            id: "Right",
            Disk: null,
            Path: null,
            Disks: [],
            Files: []
        }
    };

    var viewMosel = FM.viewModel = {
        Left: {
            SelectNode: null,
            TextNode: null,
            TableNode: null
        },
        Right: {
            SelectNode: null,
            TextNode: null,
            TableNode: null
        }
    }


    FM.init = function(){
        // Get disks
        $.ajax({
                type:'GET',
                url:'getDisks',
                success: function(result){
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
        .then(function() {
                // Get files
                FM.getFiles(model.Left.Disk.directory, function (files) {
                    model.Left.Files = files;
                }).then(
                    function () {
                        FM.getFiles(model.Right.Disk.directory, function (files) {
                            model.Right.Files = files;
                        }).then(
                            function ()
                            {
                                FM.renderPage();
                            }
                        );
                    }
                );
            }
        )
    };

    FM.getFiles = function(directory, callback){
        return $.ajax({
            type:'GET',
            url:'getFiles',
            data: {directory: directory},
            success: function(result){
                var files = result ? JSON.parse(result) : [];
                if (callback) {
                    callback(files);
                }
            }
        })
    };

    FM.renderPage = function(){
        var lSelectNode = FM.renderDisk(model.Left);
        viewMosel.Left.SelectNode = lSelectNode;
        _appendChild("lDisk", lSelectNode);

        var rSelectNode = FM.renderDisk(model.Right);
        viewMosel.Right.SelectNode = rSelectNode;
        _appendChild("rDisk", rSelectNode);

        var lTextNode = FM.renderPath(model.Left);
        viewMosel.Left.TextNode = lTextNode;
        _appendChild("lPath", lTextNode);

        var rTextNode = FM.renderPath(model.Right);
        viewMosel.Right.TextNode = rTextNode;
        _appendChild("rPath", rTextNode);

        var lTableNode = FM.renderTable(model.Left);
        viewMosel.Left.TableNode = lTableNode;
        _appendChild("lTable", lTableNode);

        var rTableNode = FM.renderTable(model.Right);
        viewMosel.Right.TableNode = rTableNode;
        _appendChild("rTable", rTableNode);

        FM.renderToolBar();
    };

    FM.onDiskChanged = function(panel, disk){
        panel.Disk = disk;
        panel.Path = disk.directory;
        FM.onPathChanged(panel, panel.Path);
    };

    FM.onPathChanged = function(panel, path) {
        FM.getFiles(path, function (files) {
            panel.Files = files;
            panel.Path = path;
            FM.refreshPath(panel);
            var tableNode = FM.renderTable(panel);
            if (panel.id == "Left") {
                viewMosel.Left.TableNode = tableNode;
                _appendChild("lTable", tableNode);
            }
            if (panel.id == "Right") {
                viewMosel.Right.TableNode = tableNode;
                _appendChild("rTable", tableNode);
            }
        });
    }

    FM.renderDisk = function(panel) {
        var selectNode = document.createElement("select");
        for (var i = 0; i < panel.Disks.length; i++)
        {
            var optionNode = document.createElement("option");
            optionNode.innerHTML = panel.Disks[i].directory;
            selectNode.appendChild(optionNode);
            if(panel.Disks[i].directory == panel.Disk.directory)
            {
                optionNode.selected = "selected";
            }
        }
        $(selectNode).change(function(){
            var n = selectNode.selectedIndex;
            FM.onDiskChanged(panel, panel.Disks[n]);
        });
        return selectNode;
    };

    FM.renderPath = function(panel) {
        var textNode = document.createElement("input");
        textNode.type = "text";
        textNode.value = panel.Path;
        textNode.disabled = true;
        return textNode;
    };

    FM.renderTable = function(panel) {
        var tableNode = document.createElement("table");
        var header = tableNode.createTHead();
        var hRow = header.insertRow(0);
        var hCell = hRow.insertCell(0);
        hCell.innerHTML = "<b>Name</b>";
        hCell = hRow.insertCell(1);
        hCell.innerHTML = "<b>Type</b>";
        hCell = hRow.insertCell(2);
        hCell.innerHTML = "<b>Size</b>";
        hCell = hRow.insertCell(3);
        hCell.innerHTML = "<b>Date Changed</b>";
        var body = tableNode.createTBody();
        panel.Files.forEach(function(item, i, files) {
            var bRow = body.insertRow(i);
            var bCell = bRow.insertCell(0);
            bCell.innerHTML = item.nameFile;
            bCell = bRow.insertCell(1);
            bCell.innerHTML = item.typeFile;
            bCell = bRow.insertCell(2);
            bCell.innerHTML = item.sizeFile;
            bCell = bRow.insertCell(3);
            bCell.innerHTML = item.dateChange;

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
           // }
        });
        return tableNode;
    };

    FM.renderToolBar = function() {
        var btnCopy = document.createElement("input");
        btnCopy.type = "button";
        btnCopy.class = "btnToolBar";
        btnCopy.value = "Копирование";
        var btnMove = document.createElement("input");
        btnMove.type = "button";
        btnMove.value = "Копирование";
        document.getElementById("ToolBar").innerHTML = "";
        document.getElementById("ToolBar").appendChild(btnCopy);
        document.getElementById("ToolBar").appendChild(btnMove);
        //textNode.disabled = true;
    }

    FM.refreshPath = function(panel) {
        if (panel.id == "Left") {
            viewMosel.Left.TextNode.value = panel.Path;
        }
        if (panel.id == "Right") {
            viewMosel.Right.TextNode.value = panel.Path;
        }
    }

    function _appendChild(id, node){
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).appendChild(node);
    }

})();