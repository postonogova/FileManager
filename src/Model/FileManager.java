package Model;

import javax.servlet.jsp.tagext.TagFileInfo;
import javax.swing.*;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.*;
import java.io.File;

/**
 * Created by Serg on 09.01.2016.
 */
public class FileManager {


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

    public FileManager() {
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
                String type = "";
                if (file.isFile()) {
                    type = getFileExtension(file);
                }
                if (file.isDirectory()) {
                    type = "folder";
                }

                FileInfo FI = new FileInfo(file.getPath(), file.getName(), type, (int) (file.length()/1024), new Date(file.lastModified()), att);
                fileInfoList.add(FI);
                System.out.println(file.getPath());
            }
        }
        return fileInfoList;
    }

    public static void CopyFiles(String sourceFile, String destDirectory) throws IOException {
        if((!sourceFile.isEmpty()) && (!destDirectory.isEmpty())) {
            Path pathSource = Paths.get(sourceFile);
            Path pathDestination = Paths.get(destDirectory);
            try {
                Files.walkFileTree(pathSource, new MyFileCopyVisitor(pathSource, pathDestination));
                System.out.println("Files copied successfully!");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        /*if((!sourceFile.isEmpty()) && (!destDirectory.isEmpty())) {
            File dest = new File(destDirectory);
                File source = new File(sourceFile);
            if (source.listFiles() != null) {
                //переместить все дочерние
            }
                Files.copy(source.toPath(), dest.toPath().resolve(source.toPath().getFileName()), StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.COPY_ATTRIBUTES, LinkOption.NOFOLLOW_LINKS);
        }*/
    }

    public static void MoveFiles(String sourceFile, String destDirectory) throws IOException {

        if((!sourceFile.isEmpty()) && (!destDirectory.isEmpty())) {
            File dest = new File(destDirectory);
            File source = new File(sourceFile);
            Files.move(source.toPath(), dest.toPath().resolve(source.toPath().getFileName()), StandardCopyOption.REPLACE_EXISTING);
        }
    }

    public static void DeleteFiles(String sourceFile) throws IOException {
        if(!sourceFile.isEmpty()) {
            Path pathSource = Paths.get(sourceFile);
            try {
                delete(pathSource.toFile());
                Files.createDirectory(pathSource);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    static void delete(File f) throws IOException {
        if (f.isDirectory()) {
            if(f.listFiles().length != 0) {
                File[] listFiles = f.listFiles();
                int i;
                for (i = listFiles.length-1; i >= 0; i--) {
                    File c = listFiles[i];
                    delete(c);
                }
            }
        }
        Path pathSource = Paths.get(f.getPath());
        Files.delete(pathSource);
    }

    public static void CreateDirectory(String nameDirectory) throws IOException {
        if(!nameDirectory.isEmpty()) {
            Path pathSource = Paths.get(nameDirectory);
            Files.createDirectories(pathSource);
        }
    }

}

class MyFileCopyVisitor extends SimpleFileVisitor {
    private Path source, destination;

    public MyFileCopyVisitor(Path s, Path d) {
        source = s;
        destination = d;
    }

    public FileVisitResult visitFile(Path path,
                                     BasicFileAttributes fileAttributes) {
        Path newd = destination.resolve(source.relativize(path));
        try {
            Files.copy(path, newd, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return FileVisitResult.CONTINUE;
    }

    public FileVisitResult preVisitDirectory(Path path,
                                             BasicFileAttributes fileAttributes) {
        Path newd = destination.resolve(source.relativize(path));
        try {
            Files.copy(path, newd, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return FileVisitResult.CONTINUE;
    }
}