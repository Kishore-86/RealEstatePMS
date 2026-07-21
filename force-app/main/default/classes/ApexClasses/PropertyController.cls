public with sharing class PropertyController {

    @AuraEnabled(cacheable=true)
    public static List<Property__c> getProperties(
        Integer pageSize,
        Integer pageNumber,
        String searchKey,
        Decimal minPrice,
        Decimal maxPrice,
        String propertyStatus,
        String furnishingStatus,
        String sortField,
        String sortDirection
    ) {

        Integer offsetValue = (pageNumber - 1) * pageSize;

        if (pageSize == null || pageSize <= 0) {
            pageSize = 25;
        }

        if (pageNumber == null || pageNumber <= 0) {
            pageNumber = 1;
        }

        if (String.isBlank(searchKey)) {
            searchKey = '';
        }

        if (minPrice == null) {
            minPrice = 0;
        }

        if (maxPrice == null) {
            maxPrice = 999999999;
        }

        /* Allow sorting only on approved fields */
        if (String.isBlank(sortField)) {
            sortField = 'Name';
        }

        Set<String> allowedFields = new Set<String>{
            'Name',
            'City__c',
            'Rent__c'
        };

        if (!allowedFields.contains(sortField)) {
            sortField = 'Name';
        }

        if (sortDirection != 'DESC') {
            sortDirection = 'ASC';
        }

        String soql =
            'SELECT ' +
            'Id,' +
            'Name,' +
            'City__c,' +
            'Property_Type__c,' +
            'Property_Status__c,' +
            'Furnishing_Status__c,' +
            'Rent__c ' +
            'FROM Property__c ' +
            'WHERE Name LIKE :searchKey ' +
            'AND Rent__c >= :minPrice ' +
            'AND Rent__c <= :maxPrice ';

        if (!String.isBlank(propertyStatus)) {
            soql +=
                'AND Property_Status__c = :propertyStatus ';
        }

        if (!String.isBlank(furnishingStatus)) {
            soql +=
                'AND Furnishing_Status__c = :furnishingStatus ';
        }

        soql +=
            'ORDER BY ' +
            sortField +
            ' ' +
            sortDirection +
            ' LIMIT :pageSize OFFSET :offsetValue';

        searchKey = '%' + searchKey + '%';

        return Database.query(soql);
    }

    @AuraEnabled(cacheable=true)
    public static Integer getTotalPropertyCount(
        String searchKey,
        Decimal minPrice,
        Decimal maxPrice,
        String propertyStatus,
        String furnishingStatus
    ) {

        if (String.isBlank(searchKey)) {
            searchKey = '';
        }

        if (minPrice == null) {
            minPrice = 0;
        }

        if (maxPrice == null) {
            maxPrice = 999999999;
        }

        String soql =
            'SELECT COUNT() FROM Property__c ' +
            'WHERE Name LIKE :searchKey ' +
            'AND Rent__c >= :minPrice ' +
            'AND Rent__c <= :maxPrice ';

        if (!String.isBlank(propertyStatus)) {
            soql +=
                'AND Property_Status__c = :propertyStatus ';
        }

        if (!String.isBlank(furnishingStatus)) {
            soql +=
                'AND Furnishing_Status__c = :furnishingStatus ';
        }

        searchKey = '%' + searchKey + '%';

        return Database.countQuery(soql);
    }

}