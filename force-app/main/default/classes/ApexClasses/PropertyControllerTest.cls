@isTest
public class PropertyControllerTest {

    @isTest
    static void testGetProperties() {

        Property__c property = new Property__c(
            Name = 'Green Villa',
            Address__c = '123 Beach Road',
            City__c = 'Chennai',
            State__c = 'Tamil Nadu',
            Postal_Code__c = '600001',
            Country__c = 'India',
            Property_Type__c = 'Residential',
            Furnishing_Status__c = 'Furnished',
            Property_Status__c = 'Available',
            Rent__c = 25000,
            Description__c = 'Luxury Villa'
        );

        insert property;

        Test.startTest();

        Decimal minPrice = null;
        Decimal maxPrice = null;

        List<Property__c> properties = PropertyController.getProperties(
            25,
            1,
            '',
            minPrice,
            maxPrice,
            '',
            '',
            'Name',
            'ASC'
        );

        Test.stopTest();

        System.assertEquals(1, properties.size());

        System.assertEquals(
            'Green Villa',
            properties[0].Name
        );

    }

}