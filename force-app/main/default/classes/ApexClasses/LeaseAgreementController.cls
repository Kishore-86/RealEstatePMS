public with sharing class LeaseAgreementController {

    @AuraEnabled(cacheable=true)
    public static List<Lease_Agreement__c> getLeaseAgreements(
        Integer pageSize,
        Integer pageNumber,
        String searchKey,
        String sortField,
        String sortDirection
    ){

        if(pageSize == null || pageSize <= 0){
            pageSize = 10;
        }

        if(pageNumber == null || pageNumber <= 0){
            pageNumber = 1;
        }

        if(String.isBlank(searchKey)){
            searchKey = '';
        }

        if(String.isBlank(sortField)){
            sortField = 'Name';
        }

        Set<String> allowedFields = new Set<String>{
            'Name',
            'Monthly_Rent__c',
            'Start_Date__c',
            'End_Date__c',
            'Lease_Status__c'
        };

        if(!allowedFields.contains(sortField)){
            sortField = 'Name';
        }

        if(sortDirection != 'DESC'){
            sortDirection = 'ASC';
        }

        Integer offsetValue = (pageNumber - 1) * pageSize;

        searchKey = '%' + searchKey + '%';

        String soql =
            'SELECT ' +
            'Id,' +
            'Name,' +
            'Tenant__r.Name,' +
            'Property__r.Name,' +
            'Monthly_Rent__c,' +
            'Start_Date__c,' +
            'End_Date__c,' +
            'Lease_Status__c ' +
            'FROM Lease_Agreement__c ' +
            'WHERE Name LIKE :searchKey ' +
            'ORDER BY ' + sortField + ' ' + sortDirection +
            ' LIMIT :pageSize OFFSET :offsetValue';

        return Database.query(soql);
    }


    @AuraEnabled(cacheable=true)
    public static Integer getTotalLeaseCount(String searchKey){

        if(String.isBlank(searchKey)){
            searchKey = '';
        }

        searchKey = '%' + searchKey + '%';

        return Database.countQuery(
            'SELECT COUNT() FROM Lease_Agreement__c WHERE Name LIKE :searchKey'
        );
    }

}