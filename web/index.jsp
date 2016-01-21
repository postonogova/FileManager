<%--
  Created by IntelliJ IDEA.
  User: Serg
  Date: 09.01.2016
  Time: 22:35
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="UTF-8">
    <title>File Manager</title>
    <link href="style\FM.css" rel="stylesheet" type="text/css" />
</head>
<body>
<table class="FM" cellpadding="0" cellspacing="0">
    <tr>
        <td id="lDisk" class="Disk"></td>
        <td id="lPath" class="Path"></td>
        <td id="rDisk" class="Disk"></td>
        <td id="rPath" class="Path"></td>
    </tr>
    <tr>
        <td colspan="2" class="Panel"><div id="lTable" class="Table"></div></td>
        <td colspan="2" class="Panel"><div  id="rTable" class="Table"></div></td>
    </tr>
    <tr>
        <td colspan="4" id="ToolBar" class="ToolBar"></td>
    </tr>
</table>

<script src="js\jquery-2.2.0.js"></script>
<script src="js\FM.js"></script>
<script>
    $(document).ready(FM.init);
</script>

</body>
</html>
