import {EntityState, Update} from "@ngrx/entity";
import {EntityStateAdapter} from "@ngrx/entity/src/models";
import {EntityFetcher, EntityUpdater} from "../model/utils.model";
import {HttpErrorResponse} from "@angular/common/http";

export function isDefined<T>(o: T | undefined | null): o is T {
  return o !== undefined && o !== null
}

export function extractErrorMessage(err: HttpErrorResponse) {
  return err.error?.detail || JSON.parse(err.error)?.detail || err.message;
}

export class EntityHelper<T, S extends EntityState<T> = EntityState<T>> {

  constructor(public readonly adapter: EntityStateAdapter<T>) {
  }

  fetch: EntityFetcher<T, S> = (id, state) => state.entities[id]
  update: EntityUpdater<T, S> = (id, state, updater) => {
    const e = this.fetch(id, state)
    return !e ? state : this.adapter.updateOne({id, changes: updater(e)} as Update<T>, state)
  };
}

