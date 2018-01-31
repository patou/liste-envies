import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss']
})
export class HtmlEditorComponent implements OnInit {
  
  @Input()  public content = '';
  @Input()  public placeholder = 'description';

  constructor() { }

  ngOnInit() {
  }

}
