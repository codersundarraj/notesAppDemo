import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileModel } from 'src/app/model/data-model';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  @Input() notesList:Array<FileModel>;
  @Input() showFolder:any;
  @Input() isView:any;  
  @Input() selectedNote:any;
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() add = new EventEmitter<any>();
  @Output() search = new EventEmitter<any>();
  @Output() hideFolderView = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    
  }

  updateNote(data){
    this.update.emit(data);
    this.isView = false;
  }

  deleteNote(id){
    this.delete.emit(id);
    this.isView = false;
  }
  createNotes(ev){
    this.add.emit(ev);
  }
  searchTerm(text){
    this.search.emit(text);
  }

  //selected note
  selectNote(note){
    this.selectedNote = note;
    this.isView = true;
  }

  setFolderVew(data) {
    this.hideFolderView.emit(data);
  }

}
