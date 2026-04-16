import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgAdminLayout } from './ng-admin-layout';

describe('NgAdminLayout', () => {
  let component: NgAdminLayout;
  let fixture: ComponentFixture<NgAdminLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgAdminLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgAdminLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
