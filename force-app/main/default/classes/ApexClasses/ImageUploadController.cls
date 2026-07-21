public with sharing class ImageUploadController {

    @AuraEnabled
    public static Id uploadImage(
        Id propertyId,
        String fileName,
        String base64Data
    ) {

        if (propertyId == null) {
            throw new AuraHandledException(
                'Property is required.'
            );
        }

        if (String.isBlank(fileName) || String.isBlank(base64Data)) {
            throw new AuraHandledException(
                'Image file is required.'
            );
        }

        try {

            Blob fileBody = EncodingUtil.base64Decode(base64Data);

            // File size validation (5 MB)
            if (fileBody.size() > 5242880) {

                throw new AuraHandledException(
                    'File size must be less than 5 MB.'
                );
            }


            ContentVersion contentVersion = new ContentVersion();

            contentVersion.Title = fileName;
            contentVersion.PathOnClient = fileName;
            contentVersion.VersionData = fileBody;

            insert contentVersion;


            ContentVersion insertedFile = [
                SELECT ContentDocumentId
                FROM ContentVersion
                WHERE Id = :contentVersion.Id
            ];


            ContentDocumentLink link = new ContentDocumentLink();

            link.ContentDocumentId =
                insertedFile.ContentDocumentId;

            link.LinkedEntityId = propertyId;

            link.ShareType = 'V';

            link.Visibility = 'AllUsers';


            insert link;


            return insertedFile.ContentDocumentId;


        } catch (DmlException e) {

            throw new AuraHandledException(
                e.getDmlMessage(0)
            );


        } catch (Exception e) {

            throw new AuraHandledException(
                e.getMessage()
            );

        }

    }

}