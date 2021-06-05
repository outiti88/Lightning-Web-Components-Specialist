import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';


export default class BoatSearch extends NavigationMixin(LightningElement) {

    isLoading = false;
    error;
    
    // Handles loading event
    handleLoading() { 
        this.isLoading = true;
    }
    
    // Handles done loading event
    handleDoneLoading() { 
        this.isLoading = false;
    }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) { 
        let boatTypeId = event.detail.boatTypeId;
        this.template.querySelector('c-boat-search-results').searchBoats(boatTypeId);
    }
    
    createNewBoat() { 
        console.log('open new boat creation');
        // Generate a URL to a User record page
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new'
            }
        });
    }
  }
  