import { Injectable } from '@angular/core';
import {Http, HttpModule , Response, Headers, RequestOptions} from '@angular/http';
// import 'rxjs/add/operator/map';
import {Member} from './variable/member';
import {pipe} from 'rxjs';
import {map} from 'rxjs/internal/operators';


@Injectable ()
export class MemberService {
  private _postUrl = '/amigosApi/mem/';
  private _getUrl = '/amigosApi/mem/';

  constructor(private _http: Http) { }
  getMembbers() {
    return this._http.get(this._getUrl)
      .pipe(map((responce: Response) => responce.json()));
  }
  addmbers(formData) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    const options = new RequestOptions({headers: headers});
    return this._http.post(this._postUrl, formData , options)
      .pipe(map((response: Response) => response.json()));
  }
  getMember(_id) {
    return this._http.get(this._getUrl + '/' + _id)
      .pipe(map((response: Response) => response.json()));
  }
}
