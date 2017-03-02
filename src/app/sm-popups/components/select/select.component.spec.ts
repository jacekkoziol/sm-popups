import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SelectComponent } from './select.component';
import { ToggleContainerComponent } from '../../core/toggle-container/toggle-container.component';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { OptionsListComponent } from '../options-list/options-list.component';
import { SmPositionDirective } from '../../directives/sm-position.directive';
import { SmToOverlayDirective } from '../../directives/sm-to-overlay.directive';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ SelectComponent, TooltipComponent, OptionsListComponent, SmPositionDirective, SmToOverlayDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
