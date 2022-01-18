public with sharing class VBcontainerController {
    //@AuraEnabled
    public static List<Product2>getMake(){
    List<Product2> myList = [SELECT Name, Price__c, Make__c, Model__c, Year__c,
    (SELECT Name, Customization__r.Price__c, Customization__r.Name, Customization__r.Id FROM Customization_Catalogue_Entries__r),
    (SELECT Name, Color__r.Price__c, Color__r.Name, Color__r.Id FROM Color_Catalogue_Entries__r),
    (SELECT Name, Accessory__r.Price__c, Accessory__r.Name, Accessory__r.Id FROM Accessory_Catalogue_Entries__r)
    FROM Product2]; 
 
    //make root of tree
    Map<String, Map<String, Map<String, Map<String, Map<String, Map<String, String>>>>>> returnMap = new Map<String, Map<String, Map<String, Map<String, Map<String, Map<String, String>>>>>>();
 
    //make tree
    for (Product2 curProduct : myList) {
        //make root of tree
        if (returnMap.get(curProduct.Make__c))  {
            returnMap.put(curProduct.Make__c, new Map<String, Map<String, Map<String, Map<String, Map<String, String>>>>>());
        }
        
        if (returnMap.get(curProduct.Model__c)) {
            returnMap.get(curProduct.Make__c).put(curProduct.Model__c, new Map<String, Map<String, Map<String, Map<String, String>>>>());
        }
 
        Map<String, Map<String, String>> custInfo = new Map<String, Map<String, String>>();
        
        for (Customization_Catalogue_Entry__c cCatEntry : curProduct.Customization_Catalogue_Entries__r) {
            custInfo.put(cCatEntry.Customization__r.Name, new Map<String, String>());
 
            custInfo.get(cCatEntry.Customization__r.Name).put('Price', cCatEntry.Customization__r.Price__c);
            custInfo.get(cCatEntry.Customization__r.Name).put('Name', cCatEntry.Customization__r.Name);
            custInfo.get(cCatEntry.Customization__r.Name).put('Id', cCatEntry.Customization__r.Id);
            custInfo.get(cCatEntry.Customization__r.Name).put('ImgUrl', '');
        }
 
        Map<String, Map<String, String>> colorInfo = new Map<String, Map<String, String>>();
        
        for (Color_Catalogue_Entry__c colorCatEntry : curProduct.Color_Catalogue_Entries__r) {
            colorInfo.put(colorCatEntry.Color__r.Name, new Map<String, String>());
 
            colorInfo.get(colorCatEntry.Color__r.Name).put('Price', colorCatEntry.Color__r.Price__c);
            colorInfo.get(colorCatEntry.Color__r.Name).put('Name', colorCatEntry.Color__r.Name);
            colorInfo.get(colorCatEntry.Color__r.Name).put('Id', colorCatEntry.Color__r.Id);
            colorInfo.get(colorCatEntry.Color__r.Name).put('ImgUrl', '');
        }
 
        Map<String, Map<String, String>> accInfo = new Map<String, Map<String, String>>();
        
        for (Accessory_Catalogue_Entry__c accCatEntry : curProduct.Accessory_Catalogue_Entries__r) {
            accInfo.put(accCatEntry.Accessory__r.Name, new Map<String, String>());
 
            accInfo.get(accCatEntry.Accessory__r.Name).put('Price', accCatEntry.Accessory__r.Price__c);
            accInfo.get(accCatEntry.Accessory__r.Name).put('Name', accCatEntry.Accessory__r.Name);
            accInfo.get(accCatEntry.Accessory__r.Name).put('Id', accCatEntry.Accessory__r.Id);
            accInfo.get(accCatEntry.Accessory__r.Name).put('ImgUrl', '');
        }
 
        Map<String, Map<String, Map<String, String>>> yearInfo = new Map<String, Map<String, Map<String, String>>>();
        yearInfo.put('Accessories', accInfo);
        yearInfo.put('Colors', colorInfo);
        yearInfo.put('Customizations', custInfo);
 
        returnMap.get(curProduct.Make__c).get(curProduct.Model__c).put(curProduct.Year__c, yearInfo);
    }
 
 return returnMap;
    }
 }
