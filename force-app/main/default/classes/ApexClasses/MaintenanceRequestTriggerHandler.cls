public with sharing class MaintenanceRequestTriggerHandler {

    public static void beforeInsert(List<Maintenance_Request__c> newRequests) {

        VendorAssignmentService.assignVendor(newRequests);

    }

}