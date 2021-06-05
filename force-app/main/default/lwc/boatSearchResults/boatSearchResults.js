import { api, LightningElement, track, wire } from 'lwc';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';

import { publish, MessageContext } from 'lightning/messageService';
import BoatMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import Length__c from '@salesforce/schema/Boat__c.Length__c';
import Price__c from '@salesforce/schema/Boat__c.Price__c';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = [
    {label: 'Name', fieldName: 'Name', type: 'text', editable:true},
    {label:'Length', fieldName: 'Length__c', type: 'number' , editable:true},
    {label:'Price', fieldName: 'Price__c', type:'currency', editable:true},
    {label:'Description', fieldName: 'Description__c', type:'text', editable:true}
];

  boatTypeId = '';
  @track boats;
  isLoading = false;
  error;
  
  // wired message context
  @wire(MessageContext) messageContext;

  // wired getBoats method 
  @wire (getBoats, {boatTypeId:'$boatTypeId'})
  wiredBoats({error, data}) {
    if(data)
      {
          this.boats = data;
      }else if(error){
      }
      this.notifyLoading(false);
  }
    
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(publicBoatTypeId) {
    this.notifyLoading(true);
    this.boatTypeId = publicBoatTypeId;
    this.notifyLoading(false);
   }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  async refresh() {
    this.notifyLoading(true);
    refreshApex(this.boats); 
    this.notifyLoading(false);
  }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) { 
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(this.selectedBoatId);
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
      publish(this.messageContext, BoatMC,  {recordId:boatId});
  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
    this.notifyLoading(true);
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then((resultado) => {
      const toastEvent = new ShowToastEvent({
        title: SUCCESS_TITLE,
        message: MESSAGE_SHIP_IT,
        variant: SUCCESS_VARIANT
      });
      this.dispatchEvent(toastEvent);
      this.refresh();
    })
    .catch(error => {
      const toastEvent = new ShowToastEvent({
        title: ERROR_TITLE,
        variant: ERROR_VARIANT
      });
      this.dispatchEvent(toastEvent);
    })
    .finally(() => {});
  }

  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) { 
    this.isLoading = isLoading;
    if(this.isLoading){
      this.dispatchEvent(new CustomEvent('loading'));
    }
    else{
      this.dispatchEvent(new CustomEvent('doneloading'));
    }
  }
}
