@isTest
public class TestDataFactory {

    public static Property__c createProperty() {

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
            Rent__c = 25000
        );

        insert property;
        return property;
    }

    public static Tenant__c createTenant() {

        Tenant__c tenant = new Tenant__c(
            Name = 'John Smith',
            Phone__c = '9876543210',
            Email__c = 'john@example.com'
        );

        insert tenant;
        return tenant;
    }

    public static Vendor__c createVendor(String vendorName) {

        Vendor__c vendor = new Vendor__c(
            Name = vendorName,
            Phone__c = '9876543210',
            Email__c = vendorName.replace(' ','').toLowerCase() + '@example.com'
        );

        insert vendor;
        return vendor;
    }

    public static Lease_Agreement__c createLease(
        Id propertyId,
        Id tenantId
    ) {

        Lease_Agreement__c lease = new Lease_Agreement__c(
            Property__c = propertyId,
            Tenant__c = tenantId,
            Monthly_Rent__c = 25000,
            Start_Date__c = Date.today(),
            End_Date__c = Date.today().addMonths(12),
            Terms__c = 'Standard Lease'
        );

        insert lease;
        return lease;
    }

    public static Maintenance_Request__c createMaintenanceRequest(
        Id propertyId,
        Id vendorId
    ) {

        Maintenance_Request__c request = new Maintenance_Request__c(
            Property__c = propertyId,
            Vendor__c = vendorId,
            Status__c = REPMSConstants.STATUS_OPEN,
            Description__c = 'Water leakage in kitchen.'
        );

        insert request;
        return request;
    }

}