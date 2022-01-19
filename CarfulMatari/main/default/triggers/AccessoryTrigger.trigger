trigger AccessoryTrigger on Accessory__c (before insert) {
    UpdateAccessory.addAccessory(trigger.new);
}