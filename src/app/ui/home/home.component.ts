import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../service/api.service";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'explorer';
  jsonData;folders = [];
  parentFolderId = null;
  notesList = [];
  selectedNote = null;
  isView: boolean = false;
  activeDirectory:any = '/';
  showFolder:boolean = true;
  constructor(private dataService : ApiService){

  }

  ngOnInit(){
    this.getData();
  }

  getData(){
    this.dataService.getFolderDetails().subscribe(res => {
      this.jsonData = res;
      this.loadFolders();
    });
  }

  //load folder details
  loadFolders(){
    this.folders = [];
    this.notesList = [];
      this.selectedNote = null;
      if (this.jsonData && this.jsonData.folder) {
          if (this.parentFolderId) {
              this.folders = this.jsonData.folder.filter(item => item.parent == this.parentFolderId);
          } else {
              this.folders = this.jsonData.folder.filter(item => item.parent == null);
          }

          if (this.folders) {
              this.jsonData.folder.sort((a, b) => {
                  let nameA = a.name;
                  let nameB = b.name;
                  if (nameA < nameB)
                      return -1;
                  if (nameA > nameB)
                      return 1;
                  return 0;
              });
          } else {
              this.folders = [];
          }
      }
    this.loadNotes();
  }

  //folder click
  selectFolder(item){
    this.isView = false;
    this.activeDirectory = item ? '/' + item.name : '/';
    this.parentFolderId = item.id;
    this.loadFolders();
  }

  //back button click
  backToFolder(id:any){
    this.isView = false;
    if (id) {
      let par = this.jsonData.folder.filter(item => item.id == id);
      this.parentFolderId = par ? par[0].parent : '';
      if (this.parentFolderId) {
        let path = this.jsonData.folder.filter(item => item.id == this.parentFolderId);
        this.activeDirectory = path ? '/' + path[0].name : '/';
      } else {
        this.activeDirectory = '/';
      }
    } else {
      this.activeDirectory = '/';
    }
    this.loadFolders();
  }

  updateFolderView(item) {
    this.showFolder = item;
  }

  //add new folder
  createFolder(ev){
    var folderName = prompt("Folder Name", "");
    var newFolder = {
      id: Math.floor(100000000 + Math.random() * 900000000),
      name: folderName ? folderName : "New Folder " + (this.folders.length + 1),
      type : "folder",
      parent : this.parentFolderId
    }
      if (this.jsonData && this.jsonData.file && this.jsonData.file.length > 0) {
          this.jsonData.folder.push(newFolder);
      } else {
          let list = { "folder": [], "file": [] }
          list.folder.push(newFolder);
          this.jsonData = list;
      }
    this.dataService.addData(this.jsonData).subscribe(res => {
      this.jsonData = res;
      this.loadFolders();
    });
  }

  //current active path
  getFolderName(){
    var name = null;
    if(this.jsonData){
      let cFolder = this.jsonData.folder.filter(item => item.id == this.parentFolderId);
      this.activeDirectory =  "/" + (cFolder && cFolder.length > 0 ? cFolder[0].name : '');
      return this.activeDirectory;
    }

  }

  //load notes
  loadNotes(){
    this.isView = false;
    this.notesList = [];
      this.selectedNote = null;
      if (this.jsonData && this.jsonData.file) {
        this.notesList = this.jsonData.file.filter(item => item.parentID == this.parentFolderId);
        if(this.notesList){
          this.notesList.sort(function(a, b) {
            var dateA = new Date(a.date).getTime(); 
            var dateB = new Date(b.date).getTime(); 
            return dateA < dateB ? 1 : -1;  
          });
        } else{
          this.notesList = [];
        }
    }
  }  

  //update particular notes 
  updateNote(data){
    let isUpdate = false;
    for (var i in this.jsonData.file) {
      if (this.jsonData.file[i].id == data.id) {
        isUpdate = true;
        this.jsonData.file[i] = data;
        break; //Stop this loop, we found it!
      }
    }

    if(isUpdate){
      this.dataService.addData(this.jsonData).subscribe(res => {
        this.jsonData = res;
        this.loadFolders();
      });
      this.isView = false;
      this.selectedNote = null;
    }
  }

  //add new notes
  createNotes(ev){
    if(this.parentFolderId){
      var newNotes = {
        id : Math.floor(100000000 + Math.random() * 900000000),
        title : "New note " + (this.notesList.length + 1),
        description : "New note " + (this.notesList.length + 1),
        type : "file",
        date: new Date().toString(),
        parentID : this.parentFolderId
      }
        if (this.jsonData && this.jsonData.file && this.jsonData.file.length > 0) {
            this.jsonData.file.unshift(newNotes);
        } else {
            var file = []
            file.push(newNotes);
            this.jsonData.file = file;
        }        
      this.selectedNote = newNotes;
      this.isView = true;

      this.dataService.addData(this.jsonData).subscribe(res => {
        this.jsonData = res;
        this.notesList = this.jsonData.file.filter(item => item.parentID == this.parentFolderId);
        if(this.notesList){
          this.notesList.sort(function(a, b) {
            var dateA = new Date(a.date).getTime(); 
            var dateB = new Date(b.date).getTime(); 
            return dateA < dateB ? 1 : -1;  
          });
        } else{
          this.notesList = [];
        }
      });
    }
    else{
      alert("Please choose folder");
    }
  }

  //remove notes
  deleteNote(id){
    let ind = this.jsonData.file.findIndex(item => item.id == id);
    this.jsonData.file.splice(ind,1);
    this.dataService.updateData(this.jsonData).subscribe(res => {
      this.jsonData = res;
      this.notesList = this.jsonData.file.filter(item => item.parentID == this.parentFolderId);
      if(this.notesList){
        this.notesList.sort(function(a, b) {
          var dateA = new Date(a.date).getTime(); 
          var dateB = new Date(b.date).getTime(); 
          return dateA < dateB ? 1 : -1;  
        });
      } else{
        this.notesList = [];
      }
    });
    this.isView = false;
    this.selectedNote = null;
  }

  //search notes
  searchTerm(val) {
    this.notesList = [];
    if (this.jsonData && this.jsonData.file) {
        this.notesList = this.jsonData.file.filter(item => item.title.toLowerCase().indexOf(val.toLowerCase()) != -1 || item.description.toLowerCase().indexOf(val.toLowerCase()) != -1);
     }
  }


}
