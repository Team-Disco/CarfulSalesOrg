import { LightningElement } from 'lwc';
import INSTAGRAM from '@salesforce/resourceUrl/instagramIcon';
import FACEBOOK from '@salesforce/resourceUrl/facebookIcon';
import TWITTER from '@salesforce/resourceUrl/twitterIcon';

export default class SocialMediaLinks extends LightningElement {
    instagram = INSTAGRAM;
    facebook = FACEBOOK;
    twitter = TWITTER;
}