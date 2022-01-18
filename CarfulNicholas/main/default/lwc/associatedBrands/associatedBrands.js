import { LightningElement, track } from 'lwc';
import DEFAULTBRAND from '@salesforce/resourceUrl/defaultBrandImg';
import getData from '@salesforce/apex/getBrands.getData';

export default class AssociatedBrands extends LightningElement {
    @track
    brands;
    defaultImg = DEFAULTBRAND;

    constructor() {
        super();
        this.handleData();

    }

    handleData() {
        getData()
        .then(result => {
            this.brands = result;
            console.log(JSON.stringify(result));
            console.log(result);
        }).catch(error => {
            console.log(error);
        });
    }
}