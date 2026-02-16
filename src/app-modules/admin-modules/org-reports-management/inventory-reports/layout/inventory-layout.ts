import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {InventoryAPIResolver} from "../services/api.resolver";
import {LayoutExtension} from "../../layout-extension";

@Component({
  standalone: false,
  templateUrl: './templates/layout.html'
})
export class InventoryLayout extends LayoutExtension implements OnInit {
    constructor(public activatedRoute: ActivatedRoute, public apiResolver: InventoryAPIResolver){
        super();
        this.layout = this.activatedRoute.snapshot.data;
    }

    asideData: any = {
        title: 'Finance',
        navList: [
            {
                name: "Accounting",
                children:[
                    { routeTo: ['transaction'], icon:"", code:"FIN_DAY", name: "Transactions" },
                    { routeTo: ['by-product'], icon:"", code:"FIN_CASH", name: "By Product" },
                    { routeTo: ['by-product-price'], icon:"", code:"FIN_ACB", name: "By Product Price" }
                ]
            }
        ]
    };

    ngOnInit(){}
}
