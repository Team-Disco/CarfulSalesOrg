trigger orderItemTrigger on Order_Item__c (after insert) {
    switch on trigger.operationType {
        when AFTER_INSERT {
            orderItemTriggerHandler.handleBeforeInsert(trigger.new);
        }
    }
}