import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleContainerComponent } from './toggle-container.component';

import { SmPositionDirective } from '../../directives/sm-position.directive';
import { SmToOverlayDirective } from '../../directives/sm-to-overlay.directive';

describe('ToggleContainerComponent', () => {
  let component: ToggleContainerComponent;
  let fixture: ComponentFixture<ToggleContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleContainerComponent, SmPositionDirective, SmToOverlayDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
