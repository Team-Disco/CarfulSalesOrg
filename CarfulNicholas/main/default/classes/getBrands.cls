public with sharing class getBrands {
    @AuraEnabled
    public static List<AssociatedBrand__c> getData(){
        try {
            return [SELECT name FROM AssociatedBrand__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
