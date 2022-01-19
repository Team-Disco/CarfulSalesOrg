public without sharing class submitOrderItem {
    @AuraEnabled
    public static void submitOrder(String prodId, String colorId, List<String> customList, List<String> accessoryList) {
        Order_Item__c newOrderItem = new Order_Item__c();
        newOrderItem.Name = 'Order Item';
        newOrderItem.Product__c = Id.valueOf(prodId);

        Database.insert(newOrderItem, false);
        
        if (colorId != '') {
            Paint_Color_Application__c appliedPaint = new Paint_Color_Application__c();
            appliedPaint.Order_Item__c = newOrderItem.Id;
            appliedPaint.Paint_Color__c = Id.valueOf(colorId);
    
            Database.insert(appliedPaint, false);
        }

        if (customList.size() > 0) {
            List<Customization_Application__c> cInsertList = new List<Customization_Application__c>();

            for (String item : customList) {
                Customization_Application__c appliedCustom = new Customization_Application__c();
                appliedCustom.Order_Item__c = newOrderItem.Id;
                appliedCustom.Customization__c = Id.valueOf(item);
                cInsertList.add(appliedCustom);
            }

            Database.insert(cInsertList, false);
        }
        
        if (accessoryList.size() > 0) {
            List<Accessory_Application__c> aInsertList = new List<Accessory_Application__c>();

            for (String item : accessoryList) {
                Accessory_Application__c appliedAcc = new Accessory_Application__c();
                appliedAcc.Order_Item__c = newOrderItem.Id;
                appliedAcc.Accessory__c = Id.valueOf(item);
                aInsertList.add(appliedAcc);
            }

            Database.insert(aInsertList, false);
        }
    }
}
