public with sharing class PropertyCreateController {

    @AuraEnabled
    public static Id createProperty(Property__c propertyRecord) {

        if (propertyRecord == null) {
            throw new AuraHandledException('Property details are required.');
        }

        try {

            insert propertyRecord;

            return propertyRecord.Id;

        } catch (DmlException e) {

            throw new AuraHandledException(e.getDmlMessage(0));

        } catch (Exception e) {

            throw new AuraHandledException(e.getMessage());

        }
    }

}