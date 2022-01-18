public class catalogueData {   
   @AuraEnabled(cacheable=true)
   public static List<Product2> getVehicles(String searchKey) {    
      String key = '%' + searchKey + '%';         
      return [SELECT Id, Vehicle_Model__c, Vehicle_Image__c FROM Product2 WHERE Vehicle_Make__c LIKE :key];


}
}