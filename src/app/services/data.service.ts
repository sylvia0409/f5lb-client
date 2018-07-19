import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs/index";


//todo: delete this
localStorage.setItem('DCE_TOKEN', 'eyJhbGciOiJIUzI1NiIsImV4cCI6MTUzMzY5NjY4NSwiaWF0IjoxNTMxMTA0Njg1fQ.eyJ1c2VybmFtZSI6ImFkbWluIn0.9KeEUwYDTIixQs3piRwt-HJiZY_zutlFLvyEMnR2lDk');
localStorage.setItem('DCE_TENANT', 'default');
const baseURL = 'http://192.168.100.86/';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  namespace = localStorage.getItem('DCE_TENANT');
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/yaml',
      'X-DCE-Access-Token': localStorage.getItem('DCE_TOKEN')
    })
  };
  private _configMapSource = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) { }

  getAllConfigMaps(): Observable<any[]> {
    this.http.get(baseURL + `api/v1/namespaces/${this.namespace}/configmaps`, this.options)
      .toPromise()
      .then((res: any) => {
        this._configMapSource.next(res.items)
      })
      .catch(this.handleError);
    return this._configMapSource.asObservable();
  }

  getOneConfigMap(cmName): Promise<any>{
    return this.http.get(baseURL + `api/v1/namespaces/${this.namespace}/configmaps/${cmName}`, this.options)
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  addConfigMap(configMap): Promise<any>{
    return this.http.post(baseURL + `api/v1/namespaces/${this.namespace}/configmaps`, configMap, this.options)
      .toPromise()
      .then(() => {
        this.getAllConfigMaps();
      })
      .catch(this.handleError);
  }

  changeConfigMap(configMap, cmName): Promise<any> {
    return this.http.put(baseURL + `api/v1/namespaces/${this.namespace}/configmaps/${cmName}`, configMap, this.options)
      .toPromise()
      .then(() => {
        this.getAllConfigMaps();
      })
      .catch(this.handleError);
  }

  deleteConfigMap(deviceName): Promise<any> {
    return this.http.delete(baseURL + `api/v1/namespaces/${this.namespace}/configmaps/${deviceName}`,this.options)
      .toPromise()
      .then((res) =>{
        this.getAllConfigMaps();
        return res;
      })
      .catch(this.handleError);
  }
  
  authentication(loginData): Promise<any> {
    return this.http.post('',loginData)
      .toPromise()
      .then((res:boolean) =>{
        return res;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error happened in service', error);
    return Promise.reject(error.body || error);
  }
}
