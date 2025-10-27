import {Injectable, Injector} from '@angular/core';
import  { OrgResourceService } from "@app-global";
import {Product, ProductSerializer} from "../domains/product.serializer";
import {ProductToken, ProductTokenSerializer} from "../domains/product-token.serializer";
import {catchError, take, tap} from "rxjs/operators";
import {ProductCategory, ProductCategorySerializer} from "../domains/product-category.serializer";
import {
    ProductPriceVariant,
    ProductPriceVariantSerializer, ProductVariant,
    ProductVariantSerializer
} from "../domains/product-variant.serializer";

@Injectable()
export class ProductService extends OrgResourceService<Product>{
  constructor(public override injector: Injector) { super(injector, 'product', new ProductSerializer()); }

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
@Injectable()
export class ProductCategoryService extends OrgResourceService<ProductCategory>{
    constructor(public override injector: Injector) { super(injector, 'productCategory', new ProductCategorySerializer()); }
}
