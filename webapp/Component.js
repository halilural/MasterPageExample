sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"MasterPageExample/model/models",
	"MasterPageExample/MyRouter"
], function(UIComponent, Device, models, MyRouter) {
	"use strict";

	return UIComponent.extend("MasterPageExample.Component", {

		metadata: {
			name: "TDG Demo App",
			version: "1.0",
			includes: [],
			dependencies: {
				libs: ["sap.m", "sap.ui.layout"],
				components: []
			},
			rootView: "MasterPageExample.view.App",
			config: {
				resourceBundle: "i18n/messageBundle.properties",
				serviceConfig: {
					name: "Northwind",
					serviceUrl: "http://services.odata.org/V2/(S(sapuidemotdg))/OData/OData.svc/"
				}
			},
			routing: {
				config: {
					routerClass: MyRouter,
					viewType: "XML",
					viewPath: "MasterPageExample.view",
					targetAggregation: "detailPages",
					clearTarget: false
						//clearTarget = When using a sap.ui.ux3.Shell this should be true. For a sap.m.NavContainer it should be false.
				},
				routes: [{
					pattern: "",
					name: "main",
					view: "Master",
					targetAggregation: "masterPages",
					targetControl: "idAppControl",
					subroutes: [{
						pattern: "{product}/:tab:",
						name: "product",
						view: "Detail"
					}]
				}, {
					name: "catchallMaster",
					view: "Master",
					targetAggregation: "masterPages",
					targetControl: "idAppControl",
					subroutes: [{
						pattern: ":all*:",
						name: "catchallDetail",
						view: "NotFound"
					}]
				}]
			}
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			var mConfig = this.getMetadata().getConfig();

			// always use absolute paths relative to our own component
			// (relative paths will fail if running in the Fiori Launchpad)

			var rootPath = jQuery.sap.getModulePath("MasterPageExample");

			// set i18n model

			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: [rootPath, mConfig.resourceBundle].join("/")
			});

			this.setModel(i18nModel, "i18n");

			// Create and set domain model to the component

			var sServiceUrl = mConfig.serviceConfig.serviceUrl;
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
			this.setModel(oModel);

			// set device model
			var deviceModel = new sap.ui.model.json.JSONModel({
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: sap.ui.Device.system.phone,
				isNoPhone: !sap.ui.Device.system.phone,
				listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
				listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
			});

			deviceModel.setDefaultBindingMode("OneWay");
			this.setModel(deviceModel, "device");

			this.getRouter().initialize();

		}
	});

});