import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FolderModel } from 'src/app/model/data-model';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit {
  @Input() folders:any;
  @Input() parentId:any;
  @Input() updateContent:any;
  @Input() showFolder: any;
  @Output() moveBack = new EventEmitter<any>();
  @Output() activeFolder = new EventEmitter<any>();
  @Output() addFolder = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log(this.folders);
  }

  backToFolder():void{
    this.moveBack.emit(this.parentId);
  }

  selectFolder(data):void{
    this.activeFolder.emit(data);
  }

  createFolder(ev):void{
    this.addFolder.emit(ev);
  }

}
