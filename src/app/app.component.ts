import { Component } from '@angular/core';
import { Option } from './sm-popups/core/a-models/options';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';

  private onStateChange($ev) {
    console.log('app.component, onStateChange: ', $ev);
  }

  private tempOptions:Option[] = [
    {id: '1', text: 'Option 1'},
    {id: '2', text: 'Option 2'},
    {id: '3', text: 'Option 3'},
    {id: '4', text: 'Option 4'},
    {id: '5', text: 'Option 5'},
  ]

  private updateOptions():void {
    let id = Date.now().toString();
    this.tempOptions.push(new Option(id, 'Option ' + id));

    //this.tempOptions = Object.assign({}, this.tempOptions);

    console.log(this.tempOptions);
  }

  private tmpCss = 'someCss'
  private toggleInputData():void {
    this.tmpCss = 'css-' + Date.now().toString();
  }

  private selectModel;

  private optionSelected($ev):void {
    console.log('selected: ', $ev);
  }
}
