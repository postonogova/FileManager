package Model;

import java.util.Date;

/**
 * Created by Serg on 10.01.2016.
 */
public class FileInfo {
    String directory;
    String nameFile;
    String typeFile;
    int sizeFile;
    Date dateChange;
    String attributes;

    public FileInfo(){}

    public FileInfo(String _directory, String _nameFile, String _typeFile, int _sizeFile, Date _dateChange, String _attributes) {
        this.directory = _directory;
        this.nameFile = _nameFile;
        this.typeFile = _typeFile;
        this.sizeFile = _sizeFile;
        this.dateChange = _dateChange;
        this.attributes = _attributes;
    }

    public String getNameFile() {
        return nameFile;
    }

    public void setNameFile(String nameFile) {
        this.nameFile = nameFile;
    }

    public String getTypeFile() {
        return typeFile;
    }

    public void setTypeFile(String typeFile) {
        this.typeFile = typeFile;
    }

    public int getSizeFile() {
        return sizeFile;
    }

    public void setSizeFile(int sizeFile) {
        this.sizeFile = sizeFile;
    }

    public Date getDateChange() {
        return dateChange;
    }

    public void setDateChange(Date dateChange) {
        this.dateChange = dateChange;
    }

    public String getAttributes() {
        return attributes;
    }

    public void setAttributes(String attributes) {
        this.attributes = attributes;
    }

    public String getDirectory() {
        return directory;
    }

    public void setDirectory(String directory) {
        this.directory = directory;
    }
}
