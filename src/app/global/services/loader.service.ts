import {Inject, Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService
{
  show(){
    var el: any = document.querySelector("body #appLoader");
    el.style.display = 'block';
  }

  hide(){
    var el: any = document.querySelector("body #appLoader");
    el.style.display = 'none';
  }

  resolver = (setupSubscriber: any, cbSuccess: any, cbError: any) => {
    this.show();
    const promise = new Promise((resolve, reject) => {
      const success = (results: any) => {
        cbSuccess(results);
        this.hide();
        return resolve(results);
      };

      const failure = (err: any) => {
        cbError(err);
        this.hide();
        return reject(err);
      };

      setupSubscriber.subscribe(success, failure);
    });
    return promise;
  };
}
