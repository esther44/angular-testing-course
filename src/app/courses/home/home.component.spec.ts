import { ComponentFixture, TestBed, waitForAsync, fakeAsync, flush } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CoursesModule } from '../courses.module';

import { CoursesService } from '../services/courses.service';

import { HomeComponent } from './home.component';

import { setupCourses } from '../common/setup-test-data';
import { of } from 'rxjs';
import { click } from '../common/test-utils';


describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourses = setupCourses()
    .filter(course => course.category === 'BEGINNER');

  const advancedCourses = setupCourses()
    .filter(course => course.category === 'ADVANCED');

  beforeEach(waitForAsync(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesServices', ['findAllCourses'])

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });

  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should display only beginner courses', () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses)); // of : Create an Observable that take beginnerCourses value, immitate immediatly and then it complete

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');

  });


  it('should display only advanced courses', () => {

    coursesService.findAllCourses.and.returnValue(of(advancedCourses)); // of : Create an Observable that take advancedCourses value, immitate immediatly and then it complete

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');

  });


  it('should display both tabs', () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses())); // of : Create an Observable, immitate immediatly and then it complete

    fixture.detectChanges(); // update values

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2, 'Expected to find two tabs');
  });


  it('should display advanced courses when tab clicked', fakeAsync(() => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses())); // of : Create an Observable, immitate immediatly and then it complete

    fixture.detectChanges(); // update values

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);

    fixture.detectChanges(); // update the dom content

    flush(); // in order to wait that all tasks was completed in the test

    const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');

    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');

  }));

  it('should display advanced courses when tab clicked - waitForAsync', waitForAsync(() => {

    // waitForAsync support HTTP request

    coursesService.findAllCourses.and.returnValue(of(setupCourses())); // of : Create an Observable, immitate immediatly and then it complete

    fixture.detectChanges(); // update values

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);

    fixture.detectChanges(); // update the dom content

    fixture.whenStable().then(() => {
      console.log('called whenStable()');
      const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

      expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');

      expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
    }); // callback function who is returned when all asynchronous apparitions of the test zone are completed

  }));
});

