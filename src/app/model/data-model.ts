export class DataModel {
  folder: Array<FolderModel>;
  file: Array<FileModel>;
}

export class FolderModel {
  id: any;
  name: string;
  type: string;
  parent: any;
}
  
export class FileModel {
  id: any;
  title: string;
  description: string;
  type: string;
  date: string;
  parentID: string;
}

  