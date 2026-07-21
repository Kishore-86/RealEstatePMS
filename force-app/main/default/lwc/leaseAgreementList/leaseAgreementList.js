import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getLeaseAgreements from '@salesforce/apex/LeaseAgreementController.getLeaseAgreements';
import getTotalLeaseCount from '@salesforce/apex/LeaseAgreementController.getTotalLeaseCount';

export default class LeaseAgreementList extends LightningElement {

    leaseAgreements = [];
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
        this.loadLeaseAgreements();
    }

    loadLeaseAgreements() {

        this.isLoading = true;

        getLeaseAgreements({
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            searchKey: this.searchKey,
            sortField: this.sortField,
            sortDirection: this.sortDirection
        })
        .then(result => {

            this.leaseAgreements = result;
            this.error = undefined;

            if(result.length > 0){

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Lease Agreements loaded successfully.',
                        variant: 'success'
                    })
                );

            }else{

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'No Records',
                        message: 'No Lease Agreements found.',
                        variant: 'warning'
                    })
                );

            }

        })
        .catch(error => {

            console.error(error);

            this.error = error;
            this.leaseAgreements = [];

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body ? error.body.message : 'Error loading lease agreements.',
                    variant: 'error'
                })
            );

        })
        .finally(() => {
            this.isLoading = false;
        });

    }

    loadTotalRecords(){

        getTotalLeaseCount({
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
        this.loadLeaseAgreements();

    }

    handleSort(event){

        this.sortField = event.detail.value;
        this.pageNumber = 1;

        this.loadLeaseAgreements();

    }

    handleSortDirection(event){

        this.sortDirection = event.detail.value;
        this.pageNumber = 1;

        this.loadLeaseAgreements();

    }

    previousPage(){

        if(this.pageNumber > 1){

            this.pageNumber--;
            this.loadLeaseAgreements();

        }

    }

    nextPage(){

        if(this.pageNumber < this.totalPages){

            this.pageNumber++;
            this.loadLeaseAgreements();

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

            { label: 'Lease Name', value: 'Name' },
            { label: 'Monthly Rent', value: 'Monthly_Rent__c' },
            { label: 'Start Date', value: 'Start_Date__c' },
            { label: 'End Date', value: 'End_Date__c' },
            { label: 'Lease Status', value: 'Lease_Status__c' }

        ];

    }

    get sortDirectionOptions(){

        return [

            { label: 'Ascending', value: 'ASC' },
            { label: 'Descending', value: 'DESC' }

        ];

    }

}