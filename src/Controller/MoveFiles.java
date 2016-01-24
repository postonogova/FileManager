package Controller;

import Model.FileManager;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by Serg on 24.01.2016.
 */
@WebServlet("/MoveFiles")
public class MoveFiles extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/plain; charset=utf-8");
        response.setCharacterEncoding("UTF-8");
        String sourceFile = request.getParameter("sourceFile");
        String destDirectory = request.getParameter("destDirectory");
        FileManager.MoveFiles(sourceFile, destDirectory);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
