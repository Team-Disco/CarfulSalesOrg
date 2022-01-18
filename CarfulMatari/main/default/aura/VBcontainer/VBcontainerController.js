({
	myAction : function(component, event, helper) {
        
	var action = component.get("c.getMake");
    action.setParams({
    recordId: component.get("v.recordId")
});
    action.setCallback(this, function(data) {
    component.set("v.Make", data.getReturnValue());
});
    $A.enqueueAction(action);

	}
})

/*soql query for make model year price(product object is a catalogue of vehicles we offer)
that object has a relationship with junction objects

returning the junction object to colors
returning junction object to accessories
returning junction to customizations
go into junction object go into corresponding  children records
create constructor in js controller */

