import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Method} from "../model/methods.model";
import {AnalysisMethodsService} from "../services/analysis-methods.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'gsa-analysis-methods',
  templateUrl: './analysis-methods.component.html',
  styleUrls: ['./analysis-methods.component.scss'],
  providers: [AnalysisMethodsService]
})
export class AnalysisMethodsComponent implements OnInit{
  methods$: Observable<Method[]>
  name: string;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, public methodService: AnalysisMethodsService) {

    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.form.get('name')?.valueChanges
      .subscribe(val => {
        this.name = val;
      });
    this.methods$ = this.methodService.getAnalysisMethods()
  }

}
