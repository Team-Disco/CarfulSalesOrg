trigger orderTrigger on Opportunity (after insert) {
    switch on trigger.operationType {
        when AFTER_INSERT{
            orderTriggerController.beginOrder(trigger.new);
        }
    }

}