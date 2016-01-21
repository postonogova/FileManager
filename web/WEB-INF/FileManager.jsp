<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--
  Created by IntelliJ IDEA.
  User: Serg
  Date: 10.01.2016
  Time: 1:09
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>File Manager</title>
    <style type="text/css">
        body { margin: 0; }
        #sidebar, #content, #header { position: absolute; }
        #sidebar, #content, #header { overflow: auto; }/*padding: 10px; }*/
        #header {
            width: 50%;
            height: 60px; /* Высота слоя */
            background: #FEDFC0; /*border-bottom: 2px solid #7B5427;*/
            top: 40px;
        }
        #header h1 { padding: 20px; margin: 0; }
        #sidebar {
            width: 50%; background: #ECF5E4;
            top: 100px; /* Расстояние от верхнего края */
            bottom: 0; /* Расстояние снизу  */
        }
        #content {
            width: 50%; background: #ECF5E4;
            top: 100px; /* Расстояние от верхнего края */
            left: 50%; /* Расстояние от левого края */
            bottom: 0; right: 0;
        }
        table {
            position: absolute;
            width: 98%; /* Ширина таблицы */
            border-collapse: collapse; /* Убираем двойные линии между ячейками */
            left: 1%;
            top: 1%;
        }
        td, thead td {
            padding: 3px; /* Поля вокруг содержимого таблицы */
            border: 1px solid #000; /* Параметры рамки */
        }
        thead td {
            background: #afd792; /* Цвет фона */
            color: #333;  /* Цвет текста */
        }
<%--tbody tr:hover {
    background: #f3bd48; /* Цвет фона при наведении */
    color: #fff; /* Цвет текста при наведении
}--%>
    tbody tr:focus {
        background: #ffe; /* Цвет фона */
        border: 1px solid #29B0D9; /* Параметры рамки */
    }
    </style>

    <script src="js\jquery-2.2.0.js"></script>

    <script>
        var Model = {

        };

    </script>

    <script>
        $(document).ready(function(){
            $('#Directory1').change(function(){
                var directory = $('#Directory1').val();
                $.ajax({
                    type:'POST',
                    data: {directory: directory},
                    url:'openDirectory',
                    success: function(result){
                        var files = result ? JSON.parse(result) : [];
                        renderFiles(document.getElementById("sidebar"), files);
                    }
                })
            });

        });
    </script>
    <script>

        function renderFiles(parentNode, files) {
            parentNode.innerHTML = "";

            var table = document.createElement("table");
            var header = table.createTHead();
            var hRow = header.insertRow(0);
            var hCell = hRow.insertCell(0);
            hCell.innerHTML = "<b>Name</b>";

            var body = table.createTBody();

            files.forEach(function(item, i, files) {
                var bRow = body.insertRow(i);
                var bCell = bRow.insertCell(0);
                bCell.innerHTML = item.directory;
            });
            parentNode.appendChild(table);
        }
    </script>

</head>
<body>

<%--<div id="header">
<fieldset>

<legend>File Manager</legend>
<select id="Directory1">
    <c:forEach items="${requestScope.files}" var="fileInfo">
        <option>${fileInfo.directory}</option>
    </c:forEach>
</select>

</fieldset>
</div>
<div id="sidebar">
</div>
<div id="content">
</div>--%>

<table class="FM">
    <tr>
        <td id="lDisk" class="Disk"></td>
        <td id="lPath" class="Path"></td>
        <td id="rDisk" class="Disk"></td>
        <td id="rPath" class="Path"></td>
    </tr>
    <tr>
        <td colspan="2" id="lTable" class="Table"></td>
        <td colspan="2" id="rTable" class="Table"></td>
    </tr>
    <tr>
        <td colspan="4" id="ToolBar" class="ToolBar"></td>
    </tr>
</table>


</body>
</html>
