import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {searchResultFeature} from "../../../../../../state/search-result/search-result.selector";
import {SearchResult} from "../../../../../../state/search-result/search-result.state";
import {searchResultActions} from "../../../../../../state/search-result/search-result.action";
import {datasetActions} from "../../../../../../state/dataset/dataset.actions";

@Component({
  selector: 'gsa-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() datasetId: number;

  searchForm = this.builder.group({
    species: [''],
    keywords: ['']
  }, {
    validators: (group) => {
      return group.value.species || group.value.keywords ? null : {noInput: true}
    }
  })

  searchStatus$: Observable<'pending' | 'finished' | 'waiting'> = this.store.select(searchResultFeature.selectSearchStatus);
  species$: Observable<string[]> = this.store.select(searchResultFeature.selectSpeciesList);
  results$: Observable<SearchResult[]> = this.store.select(searchResultFeature.selectAll);

  constructor(private store: Store, private builder: FormBuilder) {

  }

  ngOnInit(): void {
    this.store.dispatch(searchResultActions.loadSpecies());
    this.searchForm.get('species')?.setValue('Homo sapiens')
  }

  search() {
    this.store.dispatch(searchResultActions.search({
      species: this.searchForm.value.species,
      keywords: this.searchForm.value.keywords as string
    }))
  }

  select(result: SearchResult): void {
    this.store.dispatch(datasetActions.load({
      id: this.datasetId, resourceId: result.resource_loading_id, parameters: result.loading_parameters
    }))
  }

}
