import { LightningElement, track, wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {
    //We defined the variables to use on the picklist 
    selectedBoatTypeId = '';
    error = undefined;
    @track searchOptions;

    //Obtaining Search opctions calling getBoatTypes Apex
    @wire(getBoatTypes)
    boatTypes({ error, data }) {
        //if apex return a values list
        if (data) {
            //for every value on data, we are adding it into a new array
          this.searchOptions = data.map(type => {
            return { label:type.Name, value:type.Id };
        });
          //and we unshift a the All Types vaulue, at the beginning of the list
          this.searchOptions.unshift({ label: 'All Types', value: '' });
        }
        //If error found, we save it 
        else if (error) {
          this.searchOptions = undefined;
          this.error = error;
        }
    }    

    handleSearchOptionChange(event) {
        //recieving the new id value
        this.selectedBoatTypeId = event.target.value;
        //We create a new event, we call it search, and we pass the boatTypeId on its detail
        const searchEvent = new CustomEvent('search', { detail: {
          boatTypeId: this.selectedBoatTypeId
        }});
        this.dispatchEvent(searchEvent);
    }
}