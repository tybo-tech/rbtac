import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import * as COLUMN_CONFIGS from './column-settings'; // barrel file
import { ITableView } from '../models/TableColumn';
import { CollectionDataService } from './collection.data.service';
import { ICollectionData } from '../models/ICollection';

@Injectable({ providedIn: 'root' })
export class ColumnService {
  private columns$ = new BehaviorSubject<ICollectionData<ITableView>[]>([]);
  private loadedViews: { [key: string]: boolean } = {};

  constructor(private dataService: CollectionDataService<ITableView>) {}

  /**
   * Load and resolve columns from DB or fallback to static config
   */
  load(tableKey: string): Observable<ICollectionData<ITableView>[]> {
    // Prevent redundant loads
    if (this.loadedViews[tableKey]) {
      return this.columns$.asObservable();
    }

    return this.dataService.getByCollectionAndParent('views', tableKey);
  }

  /**
   * Returns current visible columns (must be called after load or subscribed to)
   */
  getColumns(): Observable<ICollectionData<ITableView>[]> {
    return this.columns$.asObservable();
  }
}
