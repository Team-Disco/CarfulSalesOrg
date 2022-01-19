public without sharing class vehicleBuilderContainerController {

    @AuraEnabled
    public static List<Product2> getData(){
        try {
        return [SELECT Name, Price__c, Vehicle_Make__c, Vehicle_Model__c, Year__c,
        (SELECT Name, Customization__r.Price__c, Customization__r.Name, Customization__r.Id FROM Customization_Catalogue_Entries__r),
        (SELECT Name, Paint_Color__r.Price__c, Paint_Color__r.Name, Paint_Color__r.Id FROM Paint_Color_Catalogue_Entries__r),
        (SELECT Name, Accessory__r.Price__c, Accessory__r.Name, Accessory__r.Id FROM Accessory_Catalogue_Entries__r)
        FROM Product2]; 


            List<Product2> myList = [SELECT Name, Price__c, Vehicle_Make__c, Vehicle_Model__c, Year__c,
        (SELECT Name, Customization__r.Price__c, Customization__r.Name, Customization__r.Id FROM Customization_Catalogue_Entries__r),
        (SELECT Name, Paint_Color__r.Price__c, Paint_Color__r.Name, Paint_Color__r.Id FROM Paint_Color_Catalogue_Entries__r),
        (SELECT Name, Accessory__r.Price__c, Accessory__r.Name, Accessory__r.Id FROM Accessory_Catalogue_Entries__r)
        FROM Product2]; 


        //TESTING
        return myList;
        //END TESTING
        //make root of tree
        /*
        Map<String, Map<String, Map<String, Map<String, Map<String, Map<String, String>>>>>> returnMap = new Map<String, Map<String, Map<String, Map<String, Map<String, Map<String, String>>>>>>();

        //make tree
        for (Product2 curProduct : myList) {
            //make root of tree
            if (returnMap.get(curProduct.Vehicle_Make__c) == null)  {
                returnMap.put(curProduct.Vehicle_Make__c, new Map<String, Map<String, Map<String, Map<String, Map<String, String>>>>>());
            }
            
            if (returnMap.get(curProduct.Vehicle_Model__c) == null) {
                returnMap.get(curProduct.Vehicle_Make__c).put(curProduct.Vehicle_Model__c, new Map<String, Map<String, Map<String, Map<String, String>>>>());
            }

            Map<String, Map<String, String>> custInfo = new Map<String, Map<String, String>>();
            
            for (Customization_Catalogue_Entry__c cCatEntry : curProduct.Customization_Catalogue_Entries__r) {
                custInfo.put(cCatEntry.Customization__r.Name, new Map<String, String>());

                custInfo.get(cCatEntry.Customization__r.Name).put('Price', cCatEntry.Customization__r.Price__c + '');
                custInfo.get(cCatEntry.Customization__r.Name).put('Name', cCatEntry.Customization__r.Name);
                custInfo.get(cCatEntry.Customization__r.Name).put('Id', cCatEntry.Customization__r.Id);
                custInfo.get(cCatEntry.Customization__r.Name).put('ImgUrl', '');
            }

            Map<String, Map<String, String>> colorInfo = new Map<String, Map<String, String>>();
            
            for (Paint_Color_Catalogue_Entry__c colorCatEntry : curProduct.Paint_Color_Catalogue_Entries__r) {
                colorInfo.put(colorCatEntry.Paint_Color__r.Name, new Map<String, String>());

                colorInfo.get(colorCatEntry.Paint_Color__r.Name).put('Price', colorCatEntry.Paint_Color__r.Price__c + '');
                colorInfo.get(colorCatEntry.Paint_Color__r.Name).put('Name', colorCatEntry.Paint_Color__r.Name);
                colorInfo.get(colorCatEntry.Paint_Color__r.Name).put('Id', colorCatEntry.Paint_Color__r.Id);
                colorInfo.get(colorCatEntry.Paint_Color__r.Name).put('ImgUrl', '');
            }

            Map<String, Map<String, String>> accInfo = new Map<String, Map<String, String>>();
            
            for (Accessory_Catalogue_Entry__c accCatEntry : curProduct.Accessory_Catalogue_Entries__r) {
                accInfo.put(accCatEntry.Accessory__r.Name, new Map<String, String>());

                accInfo.get(accCatEntry.Accessory__r.Name).put('Price', accCatEntry.Accessory__r.Price__c + '');
                accInfo.get(accCatEntry.Accessory__r.Name).put('Name', accCatEntry.Accessory__r.Name);
                accInfo.get(accCatEntry.Accessory__r.Name).put('Id', accCatEntry.Accessory__r.Id);
                accInfo.get(accCatEntry.Accessory__r.Name).put('ImgUrl', '');
            }

            Map<String, Map<String, Map<String, String>>> yearInfo = new Map<String, Map<String, Map<String, String>>>();
            yearInfo.put('Accessories', accInfo);
            yearInfo.put('Colors', colorInfo);
            yearInfo.put('Customizations', custInfo);

            returnMap.get(curProduct.Vehicle_Make__c).get(curProduct.Vehicle_Model__c).put(curProduct.Year__c, yearInfo);
        }

        return returnMap;
        */
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}