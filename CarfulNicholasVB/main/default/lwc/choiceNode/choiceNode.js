import { api, LightningElement } from 'lwc';
import ARMOREDGLOVES from '@salesforce/resourceUrl/armoredGloves';

export default class ChoiceNode extends LightningElement {
    @api
    imgUrl = ARMOREDGLOVES;
    @api
    choiceName = 'defaultName';
    @api
    choicePrice = '200';

    @api
    selectedBool = false;

    renderedCallback() {
        if (this.selectedBool) {
            this.template.querySelector('.container').classList.add('selected');
        } else {
            this.template.querySelector('.container').classList.remove('selected');
        }
    }

    nodeClicked() {
        this.template.querySelector('.container').classList.toggle('selected');
        this.selectedBool = !this.selectedBool;
        let myEvent = new CustomEvent('choicenodeclicked', {detail: this.choiceName, bubbles: true, composed: true});
        this.dispatchEvent(myEvent);
    }
}