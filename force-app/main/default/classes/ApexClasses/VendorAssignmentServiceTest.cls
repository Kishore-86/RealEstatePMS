@isTest
public class VendorAssignmentServiceTest {

    @isTest
    static void testVendorAutoAssignment() {

        Property__c property = TestDataFactory.createProperty();

        Vendor__c vendor1 = TestDataFactory.createVendor('ABC Plumbing');
        Vendor__c vendor2 = TestDataFactory.createVendor('Smart Electrical');

        Maintenance_Request__c existingRequest =
            TestDataFactory.createMaintenanceRequest(
                property.Id,
                vendor1.Id
            );

        Maintenance_Request__c newRequest =
            new Maintenance_Request__c(
                Property__c = property.Id,
                Status__c = REPMSConstants.STATUS_OPEN,
                Description__c = 'Power failure.'
            );

        Test.startTest();

        insert newRequest;

        Test.stopTest();

        Maintenance_Request__c insertedRequest = [
            SELECT Vendor__c
            FROM Maintenance_Request__c
            WHERE Id = :newRequest.Id
        ];

        System.assertNotEquals(
            null,
            insertedRequest.Vendor__c
        );

        System.assertEquals(
            vendor2.Id,
            insertedRequest.Vendor__c
        );

    }

}