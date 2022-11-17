import {ComponentFixture, TestBed} from '@angular/core/testing';


describe('AnnotateDatasetComponent', () => {
  let component: AnnotateDatasetComponentHandson;
  let fixture: ComponentFixture<AnnotateDatasetComponentHandson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotateDatasetComponentHandson ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotateDatasetComponentHandson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
