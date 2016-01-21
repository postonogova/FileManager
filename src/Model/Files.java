package Model;

import javax.servlet.jsp.tagext.TagFileInfo;
import javax.swing.*;
import java.util.*;
import java.io.File;

/**
 * Created by Serg on 09.01.2016.
 */
public class Files {


    static List<FileInfo> disks;

    public static List<FileInfo> getDisks() {
        return disks;
    }

    static {
        disks = new ArrayList<FileInfo>();
        File[] arrayRoots =  File.listRoots();
        for (File root : arrayRoots) {
            String type = getFileExtension(root);
            FileInfo FI = new FileInfo(root.getPath(), root.getName(), type, (int) root.length(), new Date(root.lastModified()), "");
            disks.add(FI);
            System.out.println(root.getPath());
        }
    }

    private static String getFileExtension(File file) {
        String fileName = file.getName();
        if(fileName.lastIndexOf(".") != -1 && fileName.lastIndexOf(".") != 0)
            return fileName.substring(fileName.lastIndexOf(".")+1);
        else return "";
    }

    public Files() {
    }

    public static List<FileInfo> GetFiles(String directory) {
        List<FileInfo> fileInfoList = new ArrayList<FileInfo>();
        File myFolder = new File(directory);
        File[] files = myFolder.listFiles();
        if(files != null) {
            for (File file : files) {
                String att = "";
                if (!file.canExecute() && !file.canRead() && file.canWrite()) // только для чтения
                    att += "r";
                else
                    att += "-";
                if (file.isHidden()) //скрытый
                    att += "h";
                else
                    att += "-";
                String type = getFileExtension(file);
                FileInfo FI = new FileInfo(file.getPath(), file.getName(), type, (int) file.length(), new Date(file.lastModified()), att);
                fileInfoList.add(FI);
                System.out.println(file.getPath());
            }
        }
        return fileInfoList;
        //return fileInfoList;
    }
}
