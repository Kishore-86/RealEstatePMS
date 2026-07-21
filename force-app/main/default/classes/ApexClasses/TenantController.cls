public with sharing class TenantController {

    @AuraEnabled(cacheable=true)
    public static List<Tenant__c> getTenants(
        Integer pageSize,
        Integer pageNumber,
        String searchKey,
        String sortField,
        String sortDirection
    ) {

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
            'Phone__c',
            'Email__c'
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
            'Phone__c,' +
            'Email__c ' +
            'FROM Tenant__c ' +
            'WHERE Name LIKE :searchKey ' +
            'ORDER BY ' + sortField + ' ' + sortDirection +
            ' LIMIT :pageSize OFFSET :offsetValue';

        return Database.query(soql);
    }


    @AuraEnabled(cacheable=true)
    public static Integer getTotalTenantCount(String searchKey){

        if(String.isBlank(searchKey)){
            searchKey = '';
        }

        searchKey = '%' + searchKey + '%';

        return Database.countQuery(
            'SELECT COUNT() FROM Tenant__c WHERE Name LIKE :searchKey'
        );
    }

}