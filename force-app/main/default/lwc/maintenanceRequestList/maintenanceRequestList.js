import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getMaintenanceRequests from '@salesforce/apex/MaintenanceRequestController.getMaintenanceRequests';
import getTotalMaintenanceRequestCount from '@salesforce/apex/MaintenanceRequestController.getTotalMaintenanceRequestCount';

export default class MaintenanceRequestList extends LightningElement {

    maintenanceRequests = [];
    error;

    pageSize = 10;
    pageNumber = 1;

    totalRecords = 0;
    totalPages = 0;

    searchKey = '';

    sortField = 'Name';
    sortDirection = 'ASC';

    isLoading = false;

    connectedCallback() {
        this.loadTotalRecords();
        this.loadMaintenanceRequests();
    }

    loadMaintenanceRequests() {

        this.isLoading = true;

        getMaintenanceRequests({
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            searchKey: this.searchKey,
            sortField: this.sortField,
            sortDirection: this.sortDirection
        })
        .then(result => {

            this.maintenanceRequests = result.map(record => {
                return {
                    ...record,
                    propertyName: record.Property__r ? record.Property__r.Name : '',
                    vendorName: record.Vendor__r ? record.Vendor__r.Name : ''
                };
            });
            this.error = undefined;

            if(result.length > 0){

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Maintenance Requests loaded successfully.',
                        variant: 'success'
                    })
                );

            }else{

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'No Records',
                        message: 'No Maintenance Requests found.',
                        variant: 'warning'
                    })
                );

            }

        })
        .catch(error => {

            console.error(error);

            this.error = error;
            this.maintenanceRequests = [];

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body ? error.body.message : 'Error loading maintenance requests.',
                    variant: 'error'
                })
            );

        })
        .finally(() => {
            this.isLoading = false;
        });

    }

    loadTotalRecords(){

        getTotalMaintenanceRequestCount({
            searchKey: this.searchKey
        })
        .then(result =>{

            this.totalRecords = result;
            this.totalPages = Math.ceil(result / this.pageSize);

        })
        .catch(error =>{
            console.error(error);
        });

    }

    handleSearch(event){

        this.searchKey = event.target.value;
        this.pageNumber = 1;

        this.loadTotalRecords();
        this.loadMaintenanceRequests();

    }

    handleSort(event){

        this.sortField = event.detail.value;
        this.pageNumber = 1;

        this.loadMaintenanceRequests();

    }

    handleSortDirection(event){

        this.sortDirection = event.detail.value;
        this.pageNumber = 1;

        this.loadMaintenanceRequests();

    }

    previousPage(){

        if(this.pageNumber > 1){

            this.pageNumber--;
            this.loadMaintenanceRequests();

        }

    }

    nextPage(){

        if(this.pageNumber < this.totalPages){

            this.pageNumber++;
            this.loadMaintenanceRequests();

        }

    }

    get disablePrevious(){

        return this.pageNumber === 1;

    }

    get disableNext(){

        return this.pageNumber >= this.totalPages;

    }

    get sortFieldOptions(){

        return [

            { label: 'Request Name', value: 'Name' },
            { label: 'Status', value: 'Status__c' }

        ];

    }

    get sortDirectionOptions(){

        return [

            { label: 'Ascending', value: 'ASC' },
            { label: 'Descending', value: 'DESC' }

        ];

    }

}