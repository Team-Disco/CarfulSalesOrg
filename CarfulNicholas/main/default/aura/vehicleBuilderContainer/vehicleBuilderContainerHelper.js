({
    initMethod: function(component) {
        var action = component.get('c.getData');
        action.setCallback(this, function (response) {
            if (response.getState() == 'SUCCESS') {
                component.set('v.orgData', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    }
})
