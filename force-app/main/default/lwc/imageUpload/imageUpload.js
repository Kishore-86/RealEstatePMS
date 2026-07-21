import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import uploadImage from '@salesforce/apex/ImageUploadController.uploadImage';

export default class ImageUpload extends LightningElement {

    @track propertyId = '';
    @track fileName = '';
    @track fileData;
    @track isLoading = false;


    handlePropertyId(event) {

        this.propertyId = event.target.value;

    }


    handleFileChange(event) {

        const file = event.target.files[0];

        if (file) {

            this.fileName = file.name;


            const reader = new FileReader();


            reader.onload = () => {

                let base64 = reader.result
                    .split(',')[1];

                this.fileData = {

                    fileName: file.name,
                    base64Data: base64

                };

            };


            reader.readAsDataURL(file);

        }

    }


    get isUploadDisabled() {

        return !this.propertyId ||
               !this.fileData;

    }


    handleUpload() {


        this.isLoading = true;


        uploadImage({

            propertyId: this.propertyId,

            fileName: this.fileData.fileName,

            base64Data: this.fileData.base64Data

        })


        .then(result => {


            this.dispatchEvent(

                new ShowToastEvent({

                    title: 'Success',

                    message: 'Image uploaded successfully.',

                    variant: 'success'

                })

            );


            this.fileName = '';

            this.fileData = null;


        })


        .catch(error => {


            let message = 'Image upload failed.';


            if(error.body && error.body.message){

                message = error.body.message;

            }


            this.dispatchEvent(

                new ShowToastEvent({

                    title: 'Error',

                    message: message,

                    variant: 'error'

                })

            );


        })


        .finally(() => {


            this.isLoading = false;


        });


    }

}