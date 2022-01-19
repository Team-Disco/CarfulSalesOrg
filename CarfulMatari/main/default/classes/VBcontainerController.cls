public with sharing class VBcontainerController {
    //@AuraEnabled
    public static List<Product2> getMake(){
    return [SELECT Name, Price__c, Vehicle_Make__c, Vehicle_Model__c, Year__c,
    (SELECT Name, Customization__r.Price__c, Customization__r.Name, Customization__r.Id FROM Customization_Catalogue_Entries__r),
    (SELECT Name, Color__r.Price__c, Color__r.Name, Color__r.Id FROM Paint_Color_Catalogue_Entries__r),
    (SELECT Name, Accessory__r.Price__c, Accessory__r.Name, Accessory__r.Id FROM Accessory_Catalogue_Entries__r)
    FROM Product2];
    }
 }
