import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs/index";

//todo: delete setItem
localStorage.setItem('DCE_TOKEN', 'eyJhbGciOiJIUzI1NiIsImV4cCI6MTUzMzY5NjY4NSwiaWF0IjoxNTMxMTA0Njg1fQ.eyJ1c2VybmFtZSI6ImFkbWluIn0.9KeEUwYDTIixQs3piRwt-HJiZY_zutlFLvyEMnR2lDk');

const options = {
  headers: new HttpHeaders({
    'Content-Type': 'application/yaml',
    'X-DCE-Access-Token': localStorage.getItem('DCE_TOKEN')
  })
};

@Injectable({
  providedIn: 'root'
})

//todo: change url
export class DataService {

  private _deviceSource = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {

  }

  getAllConfigMaps(namespace): Observable<any[]> {
    this.http.get(`http://192.168.100.86/api/v1/namespaces/${namespace}/configmaps`, options)
      .toPromise()
      .then((res: any) => {
        this._deviceSource.next(res.items)
      })
      .catch(this.handleError);
    return this._deviceSource.asObservable();
  }

  getOneConfigMap(namespace, deviceName): Promise<any>{
    return this.http.get(`http://192.168.100.86/api/v1/namespaces/${namespace}/configmaps/${deviceName}`, options)
      .toPromise()
      .then((res) => {
        return res;
      })
      .catch(this.handleError);
  }

  addConfigMap(namespace, configMap, type): Promise<any>{
    if(type == 'file'){
      const formData: FormData = new FormData();
      formData.append('fileKey', configMap, configMap.name);
      configMap = formData;
    }
    return this.http.post(`http://192.168.100.86/api/v1/namespaces/${namespace}/configmaps`, configMap, options)
      .toPromise()
      .then()
      .catch(this.handleError);
  }

  changeConfigMap(namespace, configMap, deviceName): Promise<any> {
    return this.http.put(`http://192.168.100.86/api/v1/namespaces/${namespace}/configmaps/${deviceName}`, configMap, options)
      .toPromise()
      .then()
      .catch(this.handleError);
  }

  deleteConfigMap(namespace, deviceName): Promise<any> {
    return this.http.delete(`http://192.168.100.86/api/v1/namespaces/${namespace}/configmaps/${deviceName}`, options)
      .toPromise()
      .then((res) =>{
        console.log('delete: ', res);
        return res;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error happened in service', error);
    return Promise.reject(error.body || error);
  }
}
