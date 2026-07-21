import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getTenants from '@salesforce/apex/TenantController.getTenants';
import getTotalTenantCount from '@salesforce/apex/TenantController.getTotalTenantCount';

export default class TenantList extends LightningElement {

    tenants = [];
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
        this.loadTenants();
    }

    loadTenants() {

        this.isLoading = true;

        getTenants({
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            searchKey: this.searchKey,
            sortField: this.sortField,
            sortDirection: this.sortDirection
        })
        .then(result => {

            this.tenants = result;
            this.error = undefined;

            if(result.length > 0){

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Tenants loaded successfully.',
                        variant: 'success'
                    })
                );

            }else{

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'No Records',
                        message: 'No tenants found.',
                        variant: 'warning'
                    })
                );

            }

        })
        .catch(error => {

            console.log('Tenant Error:', JSON.stringify(error));
            this.error = error;
            this.tenants = [];

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Error loading tenants.',
                    variant: 'error'
                })
            );

        })
        .finally(() => {
            this.isLoading = false;
        });

    }

    loadTotalRecords(){

        getTotalTenantCount({
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
        this.loadTenants();

    }

    handleSort(event){

        this.sortField = event.detail.value;
        this.pageNumber = 1;

        this.loadTenants();

    }

    handleSortDirection(event){

        this.sortDirection = event.detail.value;
        this.pageNumber = 1;

        this.loadTenants();

    }

    previousPage(){

        if(this.pageNumber > 1){

            this.pageNumber--;

            this.loadTenants();

        }

    }

    nextPage(){

        if(this.pageNumber < this.totalPages){

            this.pageNumber++;

            this.loadTenants();

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
            { label: 'Tenant Name', value: 'Name' },
            { label: 'Phone', value: 'Phone__c' },
            { label: 'Email', value: 'Email__c' }
        ];

    }

    get sortDirectionOptions(){

        return [
            { label: 'Ascending', value: 'ASC' },
            { label: 'Descending', value: 'DESC' }
        ];

    }

}