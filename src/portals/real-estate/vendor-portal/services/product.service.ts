import {Injectable, Injector} from '@angular/core';
import { OrgResourceService } from "@app-global";
import {Product, ProductSerializer} from "../domains/product.serializer";
import {catchError, take, tap} from "rxjs/operators";

@Injectable()
export class ProductService extends OrgResourceService<Product>{
   constructor(public override injector: Injector) {
    super(injector, 'product', new ProductSerializer());
  }

mapProductToVendor(productId, data){
    return this.httpClient.put(`${this.viewUrl}/${productId}/map-vendor`, data, this.requestHeaders)
        .pipe(
            take(1),
            catchError(error=> this.handleError(error, () => this.mapProductToVendor(productId, data)))
        );
}

  createBrand(form: any)
  {
      return this.httpClient.post(this.viewUrl + "/brand/add", form, this.requestHeaders)
          .pipe(
              tap(
                  (resp: any) => console.log('read logged'),
                  (error)=>{ this.handleError(error, () => this.createBrand(form)) }
              )
          );
  }

    createVariant(prodId, form: any)
    {
        return this.httpClient.post(this.viewUrl + `/${prodId}/variant/add`, form, this.requestHeaders)
            .pipe(
                tap(
                    (resp: any) => console.log('read logged'),
                    (error)=>{ this.handleError(error, () => this.createVariant(prodId, form)) }
                )
            );
    }

    createVariantPrice(variantId, form: any)
    {
        return this.httpClient.post(this.viewUrl + `/variant/${variantId}/add`, form, this.requestHeaders)
            .pipe(
                tap(
                    (resp: any) => console.log('read logged'),
                    (error)=>{ this.handleError(error, () => this.createVariantPrice(variantId, form)) }
                )
            );
    }
}
