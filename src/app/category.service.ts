import { Injectable } from '@angular/core';
import {Http, HttpModule , Response, Headers, RequestOptions} from '@angular/http';
import {Category} from './variable/category';
import {pipe} from 'rxjs';
import {map} from 'rxjs/internal/operators';

@Injectable()
export class CategoryService {
  private _postUrl = '/amigosApi/cat/category';
  private _getUrl = '/amigosApi/cat/category';

  constructor(private _http: Http) { }
  viewCategory() {
    return this._http.get(this._getUrl)
      .pipe(map((responce: Response) => responce.json()));
  }
  addCategory(category: Category) {
    const headers = new Headers({'Content-Type': 'application/json'});
    const option = new RequestOptions({headers: headers});
    return this._http.post(this._postUrl, JSON.stringify(category), option)
      .pipe(map((responce: Response) => responce.json()));
  }
}