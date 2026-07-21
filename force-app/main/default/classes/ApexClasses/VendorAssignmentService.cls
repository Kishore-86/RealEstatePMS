public with sharing class VendorAssignmentService {

    public static void assignVendor(List<Maintenance_Request__c> maintenanceRequests) {

        if (maintenanceRequests == null || maintenanceRequests.isEmpty()) {
            return;
        }

        // Get all vendors
        List<Vendor__c> vendors = [
            SELECT Id, Name
            FROM Vendor__c
        ];

        if (vendors.isEmpty()) {
            return;
        }

        // Store current workload for each vendor
        Map<Id, Integer> vendorWorkload = new Map<Id, Integer>();

        for (Vendor__c vendor : vendors) {
            vendorWorkload.put(vendor.Id, 0);
        }

        // Count Open Maintenance Requests for each vendor
        for (AggregateResult ar : [
            SELECT Vendor__c vendorId, COUNT(Id) totalRequests
            FROM Maintenance_Request__c
            WHERE Vendor__c != NULL
            AND Status__c = :REPMSConstants.STATUS_OPEN
            GROUP BY Vendor__c
        ]) {

            vendorWorkload.put(
                (Id) ar.get('vendorId'),
                (Integer) ar.get('totalRequests')
            );
        }

        // Assign vendor with least workload
        for (Maintenance_Request__c request : maintenanceRequests) {

            if (request.Vendor__c != null) {
                continue;
            }

            Id selectedVendor;
            Integer minimumWorkload = 999999999;

            for (Id vendorId : vendorWorkload.keySet()) {

                Integer workload = vendorWorkload.get(vendorId);

                if (workload < minimumWorkload) {
                    minimumWorkload = workload;
                    selectedVendor = vendorId;
                }
            }

            if (selectedVendor != null) {

                request.Vendor__c = selectedVendor;

                // Increase workload so the next record is balanced
                vendorWorkload.put(
                    selectedVendor,
                    vendorWorkload.get(selectedVendor) + 1
                );
            }
        }
    }

}