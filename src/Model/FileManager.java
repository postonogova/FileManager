package Model;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.io.File;

public class FileManager {

    static List<FileInfo> disks;

    public static List<FileInfo> getDisks() {
        return disks;
    }

    static {
        disks = new ArrayList<FileInfo>();
        File[] arrayRoots = File.listRoots();
        for (File root : arrayRoots) {
            String type = getFileExtension(root);
            FileInfo FI = new FileInfo(root.getPath(), root.getName(), type, (int) root.length(), new Date(root.lastModified()), "");
            disks.add(FI);
            System.out.println(root.getPath());
        }
    }

    private static String getFileExtension(File file) {
        String fileName = file.getName();
        if (fileName.lastIndexOf(".") != -1 && fileName.lastIndexOf(".") != 0)
            return fileName.substring(fileName.lastIndexOf(".") + 1);
        else return "";
    }

    public FileManager() {
    }

    public static List<FileInfo> GetFiles(String directory) {
        List<FileInfo> fileInfoList = new ArrayList<FileInfo>();
        List<FileInfo> fileInfoListFolder = new ArrayList<FileInfo>();
        File myFolder = new File(directory);
        File[] files = myFolder.listFiles();
        if (files != null) {
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

                FileInfo FI = new FileInfo(file.getPath(), file.getName(), type, (int) (file.length() / 1024), new Date(file.lastModified()), att);
                if (file.isDirectory()) {
                    fileInfoListFolder.add(FI);
                }
                if (file.isFile()) {
                    fileInfoList.add(FI);
                }
            }
        }
        return joinLists(fileInfoListFolder, fileInfoList);
    }

    public static List<FileInfo> joinLists(List<FileInfo> a, List<FileInfo> b) {
        if ((a == null) || (a.isEmpty() && (b != null))) return b;
        if ((b == null) || b.isEmpty()) return a;
        int aSize = a.size();
        int bSize = b.size();
        ArrayList<FileInfo> result = new ArrayList(aSize + bSize);
        if ((a instanceof RandomAccess) && (b instanceof RandomAccess)) {
            for (int i = 0; i < aSize; i++) result.add(a.get(i));
            for (int i = 0; i < bSize; i++) result.add(b.get(i));
        } else {
            result.addAll(a);
            result.addAll(b);
        }
        return result;
    }

    public static void CopyFiles(String sourceFile, String destDirectory) throws IOException {
        if ((!sourceFile.isEmpty()) && (!destDirectory.isEmpty()) && (!sourceFile.equals(destDirectory))) {
            Path dest = Paths.get(destDirectory);
            Path source = Paths.get(sourceFile);
            copy(source, dest);
        }
    }

    static void copy(Path sourceFile, Path destDirectory) throws IOException {
        Path copySource = Files.copy(sourceFile, destDirectory.resolve(sourceFile.getFileName()), StandardCopyOption.REPLACE_EXISTING);//, StandardCopyOption.COPY_ATTRIBUTES, LinkOption.NOFOLLOW_LINKS);
        if (sourceFile.toFile().isDirectory()) {
            if (sourceFile.toFile().listFiles().length != 0) {
                File[] listFiles = sourceFile.toFile().listFiles();
                for (int i = 0; i < listFiles.length; i++) {
                    File c = listFiles[i];
                    copy(c.toPath(), copySource);
                }
            }
        }
    }

    public static void MoveFiles(String sourceFile, String destDirectory) throws IOException {

        if ((!sourceFile.isEmpty()) && (!destDirectory.isEmpty())) {
            Path dest = Paths.get(destDirectory);
            Path source = Paths.get(sourceFile);
            Files.move(source, dest.resolve(source.getFileName()), StandardCopyOption.REPLACE_EXISTING);
        }
    }

    public static void DeleteFiles(String sourceFile) throws IOException {
        if (!sourceFile.isEmpty()) {
            Path pathSource = Paths.get(sourceFile);
            try {
                delete(pathSource.toFile());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    static void delete(File f) throws IOException {
        if (f.isDirectory()) {
            if (f.listFiles().length != 0) {
                File[] listFiles = f.listFiles();
                for (int i = listFiles.length - 1; i >= 0; i--) {
                    File c = listFiles[i];
                    delete(c);
                }
            }
        }
        Path pathSource = Paths.get(f.getPath());
        Files.delete(pathSource);
    }

    public static void CreateDirectory(String nameDirectory) throws IOException {
        if (!nameDirectory.isEmpty()) {
            Path pathSource = Paths.get(nameDirectory);
            Files.createDirectories(pathSource);
        }
    }

    public static String GetParent(String path) {
        if (!path.isEmpty()) {
            Path pathSource = Paths.get(path);
            if (pathSource.getParent() != null) {
                return pathSource.getParent().toString();
            } else {
                return pathSource.toString();
            }
        } else {
            return disks.get(0).directory;
        }
    }

}