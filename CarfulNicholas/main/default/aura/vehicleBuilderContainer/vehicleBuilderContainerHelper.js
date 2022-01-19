({
    initMethod: function(component) {
        console.log('reached here too');
        var action = component.get('c.getData');
        action.setCallback(this, function (response) {
            if (response.getState() == 'SUCCESS') {
                //component.set("v.acc", response.getReturnValue());
                console.log(response.getReturnValue());
                console.log('hai');
                component.set('v.orgData', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    }
})
