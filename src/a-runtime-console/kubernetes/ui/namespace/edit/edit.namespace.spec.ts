/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {NamespaceEditComponent} from "./edit.namespace.component";
import {FormsModule} from "@angular/forms";

describe('NamespaceEditComponent', () => {
  let namespace: NamespaceEditComponent;
  let fixture: ComponentFixture<NamespaceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      declarations: [
        NamespaceEditComponent,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamespaceEditComponent);
    namespace = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(namespace).toBeTruthy();
  });
});
