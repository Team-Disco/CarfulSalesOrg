public class UpdateAccessory {
    //Apex class to add a default price when creating a new accessory
    
public void addAccessory(List<Accessory__c> newAccessory){
    
    Set<ID> accessoryID = new Set<ID>();
    // Assign task created to a list to be updated outside of for loop. 
     List<Task> ta =new List<Task>();
     List<Accessory__c> access = new List<Accessory__c>();
    //iterate through trigger 
    for (Accessory__c acc : newAccessory) {
        if(acc.Price__c == null){
        accessoryID.add(acc.id);   
        acc.Price__c = 100;
        //access.add(acc.Price__c);
        //Create a new task and assign it the variable t
    Task t = new Task();
    // Assign Values to the task t
    t.WhatID          = acc.Id;
    t.Ownerid         = acc.Ownerid;
    t.subject 	  = 'Price defaults to 100';
    t.Status	  = 'In Progress';
    t.Description = 'New Description Task created by Trigger';
    t.ActivityDate = date.today() + 3;
    ta.add(t) ;
        }
         insert ta;
    }
      
}
    
}