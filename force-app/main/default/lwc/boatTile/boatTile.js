import { LightningElement, api, wire } from 'lwc';


// imports
export default class BoatTile extends LightningElement {

    @api boat;
    @api selectedBoatId;
    
    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() {
        return `background-image:url(${this.boat.Picture__c})`;
     }
    
    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() { 
        const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
        const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

        if(this.boat.Id === this.selectedBoatId)
        {
            return TILE_WRAPPER_SELECTED_CLASS;
        }
        else
        {
            TILE_WRAPPER_UNSELECTED_CLASS
        }
    }
    
    // Fires event with the Id of the boat that has been selected.
    selectBoat() { 
        //We create a new event, we call it search, and we pass the selected boatId on its detail
        const selectEvent = new CustomEvent('boatselect', { detail: {
            boatId: this.boat.Id
        }});
        this.dispatchEvent(selectEvent);
    }
  }
