public with sharing class orderItemTriggerHandler {
    public static void handleBeforeInsert(List<Order_Item__c> orderList) {
        //create set of Ids of orders inserted
        Set<Id> orderIdSet = new Set<Id>();
        for (Order_Item__c ord : orderList) {
            orderIdSet.add(ord.Id);
        }

        //select all needed information from orders in orderIdSet
        List<Order_Item__c> detailedOrderList = [SELECT Name, Product__r.Vehicle_Make__c, Product__r.Vehicle_Model__c, Product__r.Year__c FROM Order_Item__c WHERE Id IN :orderIdSet];

        //select email and make of all associated brands
        List<AssociatedBrand__c> aBrandList = [SELECT Manufacture_Email__c, Make__c FROM AssociatedBrand__c];

        //create map of make to email body
        Map<String, List<String>> makeToEmailBodyMap = new Map<String, List<String>>();
        
        //instantiate map with keys and empty string list value
        for (AssociatedBrand__c aBrand: aBrandList) {
            //TEST
            System.debug(aBrand.Make__c);
            makeToEmailBodyMap.put(aBrand.Make__c, new List<String>());
        }

        //for every order item add their info to string list
        
        for (Order_Item__c ordItem : detailedOrderList) {
            makeToEmailBodyMap.get(ordItem.Product__r.Vehicle_Make__c).add(
                '\nOrder Item Id: ' + ordItem.Id +
                '\nMake: ' + ordItem.Product__r.Vehicle_Make__c +
                '\nModel: ' + ordItem.Product__r.Vehicle_Model__c + 
                '\nYear: ' + ordItem.Product__r.Year__c + 
                '\n\n'
            );
            System.debug(makeToEmailBodyMap.get(ordItem.Product__r.Vehicle_Make__c));
        }

        List<Messaging.SingleEmailMessage> mailList = new List<Messaging.SingleEmailMessage>();

        //send emails to brands
        for (AssociatedBrand__c aBrand : aBrandList) {
            //skips brand if no cars of the brand are ordered
            if (makeToEmailBodyMap.get(aBrand.Make__c).size() == 0) continue;

            System.debug('reached here');

            //setup email to be sent
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            List<String> toAddresses = new List<String>();
            //toAddresses.add(aBrand.Manufacture_Email__c);
            toAddresses.add('nyoon8360@gmail.com');
            mail.setToAddresses(toAddresses);
            mail.setReplyTo('support@carful.com');
            mail.setSenderDisplayName('Carful Order Handling Department');
            mail.setSubject('New Order');
            mail.setBccSender(false);
            mail.setUseSignature(false);

            //set email body
            String buildingString = 'Items Ordered: \n\n';
            for (String ordItemString : makeToEmailBodyMap.get(aBrand.Make__c)) {
                buildingString += ordItemString;
            }
            mail.setPlainTextBody(buildingString);
            
            mailList.add(mail);

            //send email
            
        }

        Messaging.SendEmailResult[] results = Messaging.sendEmail(mailList);
        
    }
}
