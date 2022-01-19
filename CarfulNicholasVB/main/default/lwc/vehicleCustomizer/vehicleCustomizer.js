import { api, LightningElement, track } from 'lwc';
import HYUNDAIELANTRA from '@salesforce/resourceUrl/hyundaiElantra';
import submitOrder from '@salesforce/apex/submitOrderItem.submitOrder';

export default class VehicleCustomizer extends LightningElement {
    @api
    rawVehicleData;

    connectedCallback() {
        this.logRawData();
    }

    logRawData() {

        let setObj = {};

        this.rawVehicleData.forEach(function (obj) {
            
            if (setObj[obj.Vehicle_Make__c] == null) {
                setObj[obj.Vehicle_Make__c] = {};
            }

            if (setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c] == null) {
                setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c] = {};
            }

            setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c] = {};
            setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Accessories'] = {};
            setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Colors'] = {};
            setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Customizations'] = {};
            setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Price'] = obj.Price__c;
            setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Id'] = obj.Id;

            if (obj.Paint_Color_Catalogue_Entries__r != null) {
                obj.Paint_Color_Catalogue_Entries__r.forEach(function (nestedObj) {
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Colors'][nestedObj.Paint_Color__r.Name] = {};
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Colors'][nestedObj.Paint_Color__r.Name]['Price'] = nestedObj.Paint_Color__r.Price__c;
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Colors'][nestedObj.Paint_Color__r.Name]['Name'] = nestedObj.Paint_Color__r.Name;
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Colors'][nestedObj.Paint_Color__r.Name]['RecordId'] = nestedObj.Paint_Color__r.Id;
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Colors'][nestedObj.Paint_Color__r.Name]['Selected'] = false;
                });
            }

            if (obj.Accessory_Catalogue_Entries__r != null) {
                obj.Accessory_Catalogue_Entries__r.forEach(function (nestedObj) {
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Accessories'][nestedObj.Accessory__r.Name] = {};
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Accessories'][nestedObj.Accessory__r.Name]['Price'] = nestedObj.Accessory__r.Price__c;
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Accessories'][nestedObj.Accessory__r.Name]['Name'] = nestedObj.Accessory__r.Name;
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Accessories'][nestedObj.Accessory__r.Name]['RecordId'] = nestedObj.Accessory__r.Id;
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Accessories'][nestedObj.Accessory__r.Name]['Selected'] = false;
                });
            }

            if (obj.Customization_Catalogue_Entries__r != null) {
                obj.Customization_Catalogue_Entries__r.forEach(function (nestedObj) {
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Customizations'][nestedObj.Customization__r.Name] = {};
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Customizations'][nestedObj.Customization__r.Name]['Price'] = nestedObj.Customization__r.Price__c;
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Customizations'][nestedObj.Customization__r.Name]['Name'] = nestedObj.Customization__r.Name;
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Customizations'][nestedObj.Customization__r.Name]['RecordId'] = nestedObj.Customization__r.Id;
                    setObj[obj.Vehicle_Make__c][obj.Vehicle_Model__c][obj.Year__c]['Customizations'][nestedObj.Customization__r.Name]['Selected'] = false;
                });
            }

        });

        this.makeMap = setObj;
    }

    vehicleImgUrl = HYUNDAIELANTRA;

    //template render variables
    isMakeSelected = false;
    isModelSelected = false;
    isYearSelected = false;
    isOptionBarVisible = false;
    showAlert = false;
    showSuccessAlert = false;

    //dictates what options list to show
    optionBarState = '';
    optionBarStateEnums = {
        Colors: 'Colors',
        Accessories: 'Accessories',
        Customizations: 'Customizations'
    }
    
    //variables storing the current values selected
    selectedMake;
    selectedModel;
    selectedYear;

    //subtotal variables
    subtotal = 0;

    colorSubtotal = 0;
    accessoriesSubtotal = 0;
    customizationsSubtotal = 0;

    /*
    TODO:
        Implement next button
        Rerender option bar on color change
    */

    //variable denoting the current list of options shown in the option bar
    @track
    currentOptionsList = [
        {
            Name: 'acc1',
            ImgUrl: '',
            Price: '200',
            RecordId: '',
            Selected: false
        }
    ]

    //method to retrieve the list of all available makes
    get makeList() {
        
        return Object.getOwnPropertyNames(this.makeMap);
    }

    //variable containing the list of available models for the given make selected
    @track
    currentModelList;

    //variable containing the list of available years for the given make and model selected
    @track
    currentYearList;

    //fired on change of make. updates currentModelList to the list of available models with the given make selected.
    updateModels() {
        if (this.isYearSelected) {
            this.clearOptionSelections(false);
        }
        this.selectedMake = this.template.querySelector('.makeSelect').value;
        let modelSelect = this.template.querySelector('.modelSelect');
        if (this.selectedMake != '') {
            this.isMakeSelected = true;
            modelSelect.removeAttribute('disabled');
            this.currentModelList = Object.getOwnPropertyNames(this.makeMap[this.selectedMake]);
        } else {
            this.isMakeSelected = false;
        }
        this.isOptionBarVisible = false;
        if (this.isYearSelected) {
            this.template.querySelector('.modelSelect').selectedIndex = 1;
            this.selectedModel = this.currentModelList[0];
            this.updateBaseSubtotal();
            this.clearAddonSubtotals();
        }
    }

    //fired on change of model. updates currentYearList to the list of available years with the given make and model selected
    updateYears() {
        if (this.isYearSelected) {
            this.clearOptionSelections(false);
        }
        let modelSelect = this.template.querySelector('.modelSelect');
        this.selectedModel = modelSelect.value;
        if (this.selectedModel != '') {
            this.isModelSelected = true;
            this.template.querySelector('.yearSelect').removeAttribute('disabled');
            this.currentYearList = Object.getOwnPropertyNames(this.makeMap[this.selectedMake][this.selectedModel])
        } else {
            this.isModelSelected = false;
        }
        this.isOptionBarVisible = false;
        if (this.isYearSelected) {
            this.template.querySelector('.yearSelect').selectedIndex = 1;
            this.selectedYear = this.currentYearList[0];
            this.updateBaseSubtotal();
            this.clearAddonSubtotals();
        }
    }

    //fired on change of year.
    yearSelected() {
        if (this.isYearSelected) {
            this.clearOptionSelections(false);
        }
        this.isYearSelected = true;
        this.selectedYear = this.template.querySelector('.yearSelect').value;
        this.closeAlert();
        this.isOptionBarVisible = false;
        if (this.isYearSelected) {
            this.updateBaseSubtotal();
            this.clearAddonSubtotals();
        }
    }

    //closes the alert shown when make/model/year not selected and button is pressed
    closeAlert() {
        this.showAlert = false;
    }

    //updates options in options bar to those available with the given make, model, and year.
    updateOptionBar() {
        this.currentOptionsList = Object.values(this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarState]);
    }

    //actions fired on pressing option buttons
    updateOptionBarColors() {
        this.changeOptionBarState(this.optionBarStateEnums.Colors);
    }

    updateOptionBarCustomizations() {
        this.changeOptionBarState(this.optionBarStateEnums.Customizations);
    }

    updateOptionBarAccessories() {
        this.changeOptionBarState(this.optionBarStateEnums.Accessories);
    }

    //update options bar based on button pressed
    changeOptionBarState(category) {
        this.alertCheck();
        if (this.showAlert) {
            return;
        }

        if (this.isOptionBarVisible) {
            if (this.optionBarState == category) {
                this.isOptionBarVisible = false;
                return;
            }
        } else {
            this.isOptionBarVisible = true;
        }

        this.optionBarState = category;
        this.updateOptionBar();
    }

    //sets whether to show alert if not all 3 select inputs are set
    alertCheck() {
        if (this.isMakeSelected && this.isModelSelected && this.isYearSelected) {
            this.showAlert = false;
        } else {
            this.showAlert = true;
        }
    }

    //fired on press of Next button
    submitOrder() {
        this.alertCheck();
        
        if (this.isMakeSelected && this.isModelSelected && this.isYearSelected) {

            let accList = [];
            for (let x in this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Accessories]) {
                if (this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Accessories][x]['Selected'] = true) {
                    accList.push(this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Accessories][x]['RecordId']);
                }
            }

            let custList = [];
            for (let x in this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Customizations]) {
                if (this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Customizations][x]['Selected'] = true) {
                    custList.push(this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Customizations][x]['RecordId']);
                }
            }

            let selColorId = '';
            for (let x in this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Colors]) {
                if (this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Colors][x]['Selected'] = true) {
                    selColorId = this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Colors][x]['RecordId'];
                }
            }
            submitOrder({prodId: this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear]['Id'], colorId: selColorId, customList: custList, accessoryList: accList}).then({

            }).catch(error => {
                console.log(error);
            });
            this.showSuccessAlert = true;
        }
    }

    //event handler when an option node is clicked
    handleNodeClicked(event) {

        let clearingColor = false;
        if (this.optionBarState == this.optionBarStateEnums.Colors) {
            if (this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarState][event.detail]['Selected'] == false) {
                this.clearOptionSelections(true);
            } else {
                clearingColor = true;
            }
        }

        let optionPrice = this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarState][event.detail]['Price'];
        let selectedProperty = this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarState][event.detail]['Selected'];
        this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarState][event.detail]['Selected'] = !selectedProperty;

        if (selectedProperty && this.optionBarState != this.optionBarStateEnums.Colors) {
            optionPrice = parseInt(optionPrice) * -1;
        }

        switch(this.optionBarState) {
            case this.optionBarStateEnums.Accessories:
                this.accessoriesSubtotal += parseInt(optionPrice);
                break;
            
            case this.optionBarStateEnums.Colors:
                this.colorSubtotal = parseInt(optionPrice);
                break;

            case this.optionBarStateEnums.Customizations:
                this.customizationsSubtotal += parseInt(optionPrice);
                break;
        }
        if (clearingColor) this.colorSubtotal = 0;
        this.updateFullSubtotal();
    }

    //clear option selections
    clearOptionSelections(onlyColors) {
        if (onlyColors) {

            for (let x in this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Colors]) {
                this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Colors][x]['Selected'] = false;
            }

        } else {
            
            for (let x in this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Accessories]) {
                this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Accessories][x]['Selected'] = false;
            }

            for (let x in this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Colors]) {
                this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Colors][x]['Selected'] = false;
            }

            for (let x in this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Customizations]) {
                this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear][this.optionBarStateEnums.Customizations][x]['Selected'] = false;
            }

        }
    }

    updateBaseSubtotal() {
        this.subtotal = parseInt(this.makeMap[this.selectedMake][this.selectedModel][this.selectedYear]['Price']);
    }

    updateFullSubtotal() {
        this.updateBaseSubtotal();
        this.subtotal += (parseInt(this.colorSubtotal) + parseInt(this.accessoriesSubtotal) + parseInt(this.customizationsSubtotal));
    }

    clearAddonSubtotals() {
        this.colorSubtotal = 0;
        this.accessoriesSubtotal = 0;
        this.customizationsSubtotal = 0;
    }

        //default value to show structure
        @api
        makeMap = {
            Hyundai: {
                Elantra: {
                    2020: {
                        Accessories: {
                            Acc1: {
                                Name: 'Acc1',
                                ImgUrl: '',
                                Price: '200',
                                RecordId: '',
                                Selected: false
                            },
                            Acc2: {
                                Name: 'Acc2',
                                ImgUrl: '',
                                Price: '200',
                                RecordId: '',
                                Selected: false
                            },
                            Acc3: {
                                Name: 'Acc3',
                                ImgUrl: '',
                                Price: '200',
                                RecordId: '',
                                Selected: false
                            }
                        },
                        Customizations: {
                            Cust1: {
                                Name: 'Cust1',
                                ImgUrl: '',
                                Price: '200',
                                RecordId: '',
                                Selected: false
                            }
                        },
                        Colors: {
                            Red: {
                                Name: 'Red',
                                ImgUrl: '',
                                Price: '20',
                                RecordId: '',
                                Selected: false
                            },
                            White: {
                                Name: 'White',
                                ImgUrl: '',
                                Price: '20',
                                RecordId: '',
                                Selected: false
                            },
                            Silver: {
                                Name: 'Silver',
                                ImgUrl: '',
                                Price: '20',
                                RecordId: '',
                                Selected: false
                            }
                        },
                        Price: 25000
                    },
                    2021: {
                        Accessories: {
                            Acc1: {
                                Name: 'Acc1',
                                ImgUrl: '',
                                Price: '200',
                                RecordId: '',
                                Selected: false
                            }
                        },
                        Customizations: {
                            Cust1: {
                                Name: 'Cust1',
                                ImgUrl: '',
                                Price: '200',
                                RecordId: '',
                                Selected: false
                            }
                        },
                        Colors: {
                            Blue: {
                                Name: 'Blue',
                                ImgUrl: '',
                                Price: '20',
                                RecordId: '',
                                Selected: false
                            }
                        },
                        Price: 30000
                    }
                },
                Sonata: {
                    2020: {
                        Accessories: {
                            Acc1: {
                                Name: 'Acc1',
                                ImgUrl: '',
                                Price: '200',
                                RecordId: '',
                                Selected: false
                            },
                            Acc2: {
                                Name: 'Acc2',
                                ImgUrl: '',
                                Price: '200',
                                RecordId: '',
                                Selected: false
                            },
                            Acc3: {
                                Name: 'Acc3',
                                ImgUrl: '',
                                Price: '200',
                                RecordId: '',
                                Selected: false
                            }
                        },
                        Customizations: {
                            Cust1: {
                                Name: 'Cust1',
                                ImgUrl: '',
                                Price: '200',
                                RecordId: '',
                                Selected: false
                            }
                        },
                        Colors: {
                            Green: {
                                Name: 'Green',
                                ImgUrl: '',
                                Price: '20',
                                RecordId: '',
                                Selected: false
                            }
                        },
                        Price: 35000
                    },
                    2021: {
                        Accessories: {
                            Acc1: {
                                Name: 'Acc1',
                                ImgUrl: '',
                                Price: '200',
                                RecordId: '',
                                Selected: false
                            }
                        },
                        Customizations: {
                            Cust1: {
                                Name: 'Cust1',
                                ImgUrl: '',
                                Price: '200',
                                RecordId: '',
                                Selected: false
                            }
                        },
                        Colors: {
                            Blue: {
                                Name: 'Blue',
                                ImgUrl: '',
                                Price: '20',
                                RecordId: '',
                                Selected: false
                            }
                        },
                        Price: 40000
                    }
                }
            }
        }
}