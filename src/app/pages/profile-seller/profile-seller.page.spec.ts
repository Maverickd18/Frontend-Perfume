import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSellerPage } from './profile-seller.page';

describe('ProfileSellerPage', () => {
  let component: ProfileSellerPage;
  let fixture: ComponentFixture<ProfileSellerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSellerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
