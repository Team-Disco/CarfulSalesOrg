import { LightningElement } from 'lwc';
import LOGO from '@salesforce/resourceUrl/caravanlogo';

export default class Header extends LightningElement {
    logoUrl = LOGO;

    goToHomePage() {
        this.sendEvent('Home');
    }

    goToCatalogue() {
        this.sendEvent('Catalogue');
    }

    goToBuilder() {
        this.sendEvent('Builder');
    }

    goToAbout() {
        this.sendEvent('About');
    }

    sendEvent(tabValue) {
        let myEvent = new CustomEvent('tabclicked', {detail: {eValue: tabValue}, bubbles: true, composed: true});
        this.dispatchEvent(myEvent);
    }
}