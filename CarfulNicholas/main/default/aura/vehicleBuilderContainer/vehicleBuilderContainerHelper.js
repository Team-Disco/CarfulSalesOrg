({
    helperMethod: function() {

    },
    initMethod: function(component) {
        var action = component.get('c.getData');
        action.setCallback(this, function (response) {
            if (response.getState() == 'SUCCESS') {
                //component.set("v.acc", response.getReturnValue());
                console.log(response.getReturnValue());
                console.log('hai');
                component.set('v.orgData', response.getReturnValue());
            }
        });

    }
})
