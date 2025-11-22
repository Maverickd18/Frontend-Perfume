import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellerProfilePage } from './seller-profile.page';

describe('SellerProfilePage', () => {
  let component: SellerProfilePage;
  let fixture: ComponentFixture<SellerProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
