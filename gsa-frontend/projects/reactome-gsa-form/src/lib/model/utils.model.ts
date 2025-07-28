import {EntityState} from "@ngrx/entity";

export type PartialRequired<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
export type Subset<T> = Pick<T, keyof T>;

export type EntityFetcher<T, S extends EntityState<T> = EntityState<T>> = (id: string | number, state: S) => T | undefined;
export type EntityUpdater<T, S extends EntityState<T> = EntityState<T>> = (id: string | number, state: S, updater: (entity: T) => Partial<T>) => S;
