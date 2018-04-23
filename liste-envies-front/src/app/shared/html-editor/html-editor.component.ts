import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss']
})
export class HtmlEditorComponent implements OnInit {
  
  @Input()  public content = '';
  @Output() public contentChange = new EventEmitter<string>();
  @Input()  public placeholder = 'description';
  
  public modulesToolbar = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote', { 'list': 'ordered'}, { 'list': 'bullet' }, { 'color': [] }, 'clean']
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
