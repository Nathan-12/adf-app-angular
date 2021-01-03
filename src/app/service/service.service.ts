import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CaixaModel } from '../model/caixa.model';
import { retry, catchError } from 'rxjs/operators';
import { _throw as throwError } from 'rxjs/observable/throw';

@Injectable()
export class ServiceService {

  apiURL = 'http://localhost:8090/caixa';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(
    private httpClient: HttpClient
  ) { }

  getCaixas(): Observable<CaixaModel[]> {
    return this.httpClient.get<CaixaModel[]>(this.apiURL + '/list')
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  saveCaixa(caixa: CaixaModel): Observable<CaixaModel> {
    return this.httpClient.post<CaixaModel>(this.apiURL + '/add', caixa, this.httpOptions)
  }

  deleteCaixas(caixa: CaixaModel) {
    return this.httpClient.delete<CaixaModel>(this.apiURL + '/delete/' + caixa.id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  updateCaixas(caixa: CaixaModel): Observable<CaixaModel> {
    return this.httpClient.put<CaixaModel>(this.apiURL + '/' + caixa.id, caixa, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  handleError(error: HttpErrorResponse){
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
      console.log('errorMessage1if: '+ errorMessage);
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
      console.log('errorMessage2if: '+ errorMessage);
    }
    console.log('errorMessage' + errorMessage);
    return throwError(errorMessage);
  };

}
