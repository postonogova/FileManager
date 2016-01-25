package Controller;

import Model.FileInfo;
import Model.FileManager;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.DataOutputStream;
import java.io.IOException;
import java.util.List;

@WebServlet("/getFiles")
public class getFiles extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/plain; charset=utf-8");
        response.setCharacterEncoding("UTF-8");
        String directory = request.getParameter("directory");
        List<FileInfo> obj = FileManager.GetFiles(directory);
        Gson gson = new Gson();
        String json = gson.toJson(obj);
        response.getWriter().write(json);
    }
}
