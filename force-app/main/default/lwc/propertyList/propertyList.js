import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getProperties from '@salesforce/apex/PropertyController.getProperties';
import getTotalPropertyCount from '@salesforce/apex/PropertyController.getTotalPropertyCount';

export default class PropertyList extends LightningElement {

    properties = [];
    error;

    pageSize = 25;
    pageNumber = 1;

    totalRecords = 0;
    totalPages = 0;

    searchKey = '';

    minPrice = null;
    maxPrice = null;

    propertyStatus = '';
    furnishingStatus = '';

    sortField = 'Name';
    sortDirection = 'ASC';

    isLoading = false;

    connectedCallback() {
        this.loadTotalRecords();
        this.loadProperties();
    }

    loadProperties() {

        this.isLoading = true;

        getProperties({
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            searchKey: this.searchKey,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            propertyStatus: this.propertyStatus,
            furnishingStatus: this.furnishingStatus,
            sortField: this.sortField,
            sortDirection: this.sortDirection
        })
        .then(result => {

            this.properties = result;
            this.error = undefined;

            if (result.length > 0) {

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Properties Loaded',
                        variant: 'success'
                    })
                );

            } else {

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'No Records',
                        message: 'No Records Found',
                        variant: 'warning'
                    })
                );

            }

        })
        .catch(error => {

            this.error = error;
            this.properties = [];

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Error Loading Data',
                    variant: 'error'
                })
            );

        })
        .finally(() => {
            setTimeout(() => {
                this.isLoading = false;
            }, 2000);
        });

    }

    loadTotalRecords() {

        getTotalPropertyCount({
            searchKey: this.searchKey,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            propertyStatus: this.propertyStatus,
            furnishingStatus: this.furnishingStatus
        })
        .then(result => {

            this.totalRecords = result;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

        })
        .catch(error => {
            console.error(error);
        });


    }

        handleSearch(event) {

        this.searchKey = event.target.value;

        this.pageNumber = 1;

        this.loadTotalRecords();
        this.loadProperties();

    }

    handleMinPrice(event) {

        this.minPrice = event.target.value
            ? Number(event.target.value)
            : null;

        this.pageNumber = 1;

        this.loadTotalRecords();
        this.loadProperties();

    }

    handleMaxPrice(event) {

        this.maxPrice = event.target.value
            ? Number(event.target.value)
            : null;

        this.pageNumber = 1;

        this.loadTotalRecords();
        this.loadProperties();

    }

    handlePropertyStatus(event) {

        this.propertyStatus = event.target.value;

        this.pageNumber = 1;

        this.loadTotalRecords();
        this.loadProperties();

    }

    handleFurnishingStatus(event) {

        this.furnishingStatus = event.target.value;

        this.pageNumber = 1;

        this.loadTotalRecords();
        this.loadProperties();

    }

    handleSort(event) {

        this.sortField = event.target.value;

        this.pageNumber = 1;

        this.loadProperties();

    }

    handleSortDirection(event) {

        this.sortDirection = event.target.value;

        this.pageNumber = 1;

        this.loadProperties();

    }

    previousPage() {

        if (this.pageNumber > 1) {

            this.pageNumber--;

            this.loadProperties();

        }

    }

    nextPage() {

        if (this.pageNumber < this.totalPages) {

            this.pageNumber++;

            this.loadProperties();

        }

    }

        get disablePrevious() {
        return this.pageNumber === 1;
    }

    get disableNext() {
        return this.pageNumber >= this.totalPages;
    }

    get propertyStatusOptions() {
        return [
            { label: 'All', value: '' },
            { label: 'Available', value: 'Available' },
            { label: 'Occupied', value: 'Occupied' }
        ];
    }

    get furnishingStatusOptions() {
        return [
            { label: 'All', value: '' },
            { label: 'Furnished', value: 'Furnished' },
            { label: 'Semi-Furnished', value: 'Semi-Furnished' },
            { label: 'Unfurnished', value: 'Unfurnished' }
        ];
    }

    get sortFieldOptions() {
        return [
            { label: 'Property Name', value: 'Name' },
            { label: 'City', value: 'City__c' },
            { label: 'Rent', value: 'Rent__c' }
        ];
    }

    get sortDirectionOptions() {
        return [
            { label: 'Ascending', value: 'ASC' },
            { label: 'Descending', value: 'DESC' }
        ];
    }

}