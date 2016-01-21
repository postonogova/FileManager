package Controller;

import Model.FileInfo;
import Model.Files;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/getDisks")
public class getDisks extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<FileInfo> obj = Files.getDisks();
        Gson gson = new Gson();
        String json = gson.toJson(obj);
        response.getWriter().write(json);
    }
}
