import {LightningElement} from 'lwc';

export default class CompanyDetails extends LightningElement {

    name = 'Carful';
    details = 'Third party vehicle company that creates vehicles with customizations for customers';
    
    showDetails = true;
    //change the text on the button
    actionButtonLabel = 'Show Details';
     //hide and show details of the company info
    toggleDetails(){
        this.showDetails = !this.showDetails;
        this.actionButtonLabel = this.showDetails ? 'Hide Details':'Show Details';
        console.log(this.showDetails);
    }
}