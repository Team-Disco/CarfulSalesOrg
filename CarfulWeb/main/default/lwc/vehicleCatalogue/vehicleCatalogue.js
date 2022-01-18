import { LightningElement, api, track, wire } from 'lwc';
import getVehicles from '@salesforce/apex/dataCatalogue.getVehicles';


export default class Catalogue extends LightningElement {
    searchKey = '';
    products;
    error;

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleSearch() {
        getVehicles({ searchKey: this.searchKey })
            .then((result) => {
                this.products = result;
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.products = undefined;
            });
    }


}
