import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global";
import {ProductToken, ProductTokenSerializer} from "../domains/token.serializer";
import {catchError, take, tap} from "rxjs/operators";
import {
    ProductPriceVariant,
    ProductPriceVariantSerializer, ProductVariant,
    ProductVariantSerializer
} from "../domains/variant.serializer";
import {ProductById, ProductByIdSerializer} from "../domains/product-id.serializer";
import {ActivatedRouteSnapshot, Resolve} from "@angular/router";

@Injectable()
export class ProductByIdService extends OrgResourceService<ProductById> implements Resolve<any> {
  product: ProductById;
  constructor(public override injector: Injector) { super(injector, 'product', new ProductByIdSerializer()); }

    resolve(route: ActivatedRouteSnapshot) {
    const { productId } = route.params;
        const success = (results) => {
            this.product = results.data;
        };
        const failure = (err: any) => {};
        const endpoint = `${productId}`;
        const setup = this.read(endpoint);
        return this.performRouteResolver(route.data, setup, success, failure);
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

@Injectable()
export class ProductVariantService extends OrgResourceService<ProductVariant>{
    constructor(public override injector: Injector) { super(injector, 'ProductVariant', new ProductVariantSerializer()); }
}

@Injectable()
export class ProductPriceService extends OrgResourceService<ProductPriceVariant>{
    constructor(public override injector: Injector) { super(injector, 'ProductPrice', new ProductPriceVariantSerializer()); }
}

@Injectable()
export class ProductTokenService extends OrgResourceService<ProductToken>{
    constructor(public override injector: Injector) { super(injector, 'productToken', new ProductTokenSerializer()); }
}
