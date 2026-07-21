import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import uploadImage from '@salesforce/apex/ImageUploadController.uploadImage';

export default class PropertyCreate extends LightningElement {

    @track isLoading = false;

    @track fileName = '';
    @track fileData = null;

    handleSubmit() {
        this.isLoading = true;
    }

    handleFileChange(event) {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        this.fileName = file.name;

        const reader = new FileReader();

        reader.onload = () => {

            const base64 = reader.result.split(',')[1];

            this.fileData = {
                fileName: file.name,
                base64Data: base64
            };

        };

        reader.readAsDataURL(file);

    }

    async handleSuccess(event) {

        const propertyId = event.detail.id;

        try {

            if (this.fileData) {

                await uploadImage({
                    propertyId: propertyId,
                    fileName: this.fileData.fileName,
                    base64Data: this.fileData.base64Data
                });

            }

            const inputFields = this.template.querySelectorAll(
                'lightning-input-field'
            );

            if (inputFields) {
                inputFields.forEach(field => {
                    field.reset();
                });
            }

            this.fileName = '';
            this.fileData = null;

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Property and image saved successfully.',
                    variant: 'success'
                })
            );

        } catch (error) {

            console.error(JSON.stringify(error));

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body?.message || error.message,
                    variant: 'error'
                })
            );

        } finally {

            this.isLoading = false;

        }

    }

    handleError(event) {

        this.isLoading = false;

        let message = 'Unable to create property.';

        if (event.detail && event.detail.detail) {
            message = event.detail.detail;
        }

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: message,
                variant: 'error'
            })
        );

    }

}