public class orderTriggerController {
    public static void beginOrder(List<Opportunity> opportunityList) {
                List<Order> orderList = new List<Order>(); 
                for(Opportunity op : opportunityList) {
                    Order newOrder = new Order();
                    newOrder.Name = 'Default';
                    orderList.add(newOrder);
    
                    
                    
                    }
                    
                    INSERT orderList;
            }
        }
        
        

    

