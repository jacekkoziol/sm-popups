import { Component } from '@angular/core';

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

  private tempOptions = [
    {id: 1, text: 'Option 1'},
    {id: 2, text: 'Option 2'},
    {id: 3, text: 'Option 3'},
    {id: 4, text: 'Option 4'},
    {id: 5, text: 'Option 5'},
  ]
}
