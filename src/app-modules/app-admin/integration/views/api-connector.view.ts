import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ConnectorService} from "../services/connector.service";

@Component({ templateUrl: './templates/api-connector.html' })
export class ApiConnectorView implements OnInit {
    constructor(public service: ConnectorService,
                public activatedRoute: ActivatedRoute){}
    ngOnInit(){}

    test(){
        this.service.getTest().subscribe(data => {});
    }

    generateFile(){
        this.service.getFile();
        /*const downloadFile1 = (data, fileName) => {
            const blob = new Blob([data], { type: 'text/pdf' });
            const url= window.URL.createObjectURL(blob);
            window.open(url);
        };

        const downloadFile = (blob, fileName) => {
            const link = document.createElement('a');
            // create a blobURI pointing to our Blob
            link.href = URL.createObjectURL(blob);
            link.download = "test";
            // some browser needs the anchor to be in the doc
            document.body.append(link);
            link.click();
            link.remove();
            // in case the Blob uses a lot of memory
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
        };

        this.service.getFile().subscribe(downloadFile);*/
    }

}