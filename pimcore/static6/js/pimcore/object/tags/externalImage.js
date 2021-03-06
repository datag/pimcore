/**
 * Pimcore
 *
 * This source file is subject to the GNU General Public License version 3 (GPLv3)
 * For the full copyright and license information, please view the LICENSE.md and gpl-3.0.txt
 * files that are distributed with this source code.
 *
 * @copyright  Copyright (c) 2009-2016 pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GNU General Public License version 3 (GPLv3)
 */

pimcore.registerNS("pimcore.object.tags.externalImage");
pimcore.object.tags.externalImage = Class.create(pimcore.object.tags.abstract, {

    type: "externalImage",
    dirty: false,

    initialize: function (data, fieldConfig) {
        //data = "http://cdn4.spiegel.de/images/image-929197-breitwandaufmacher-adrc-929197.jpg";

        if (data) {
            this.data = data;
        }
        this.fieldConfig = fieldConfig;
    },

    getGridColumnConfig: function(field) {

        return {header: ts(field.label), width: 100, sortable: false, dataIndex: field.key,
            renderer: function (key, value, metaData, record) {
                                    this.applyPermissionStyle(key, value, metaData, record);

                if(record.data.inheritedFields[key] && record.data.inheritedFields[key].inherited
                    == true) {
                    metaData.tdCls += " grid_value_inherited";
                }

                if (value && value.url) {
                    return '<img style="max-width:88px;max-height:88px" src="' + value.url  + '" />';
                }
            }.bind(this, field.key)};
    },

    getLayoutEdit: function () {

        if (intval(this.fieldConfig.previewWidth) < 1) {
            this.fieldConfig.previewWidth = 300;
        }
        if (intval(this.fieldConfig.previewHeight) < 1) {
            this.fieldConfig.previewHeight = 300;
        }

        if (intval(this.fieldConfig.inputWidth) < 1) {
            this.fieldConfig.inputWidth = 300;
        }


        var conf = {
            width: intval(this.fieldConfig.previewWidth),
            height: intval(this.fieldConfig.previewHeight),
            border: true,
            style: "padding-bottom: 10px",

            componentCls: "object_field",
            bodyCls: "pimcore_droptarget_image pimcore_externalimage_container pimcore_image_container"
        };

        this.inputField =  new Ext.form.field.Text({
            xtype: "textfield",
            fieldLabel: t("URL"),
            name: "icon",
            width: this.fieldConfig.inputWidth,
            value: this.data,
            enableKeyEvents: true,
            listeners: {
                "keyup": function (el) {
                    this.data = this.inputField.getValue();
                    this.updateImage();
                }.bind(this)
            }
        });

        this.deleteButton = new Ext.Button({
            xtype: "button",
            iconCls: "pimcore_icon_delete",
            handler: this.empty.bind(this),
            style: "margin-left: 5px",
        });

        this.composite = Ext.create('Ext.form.FieldContainer', {
            //fieldLabel: this.fieldConfig.title,
            layout: 'hbox',
            items: [
                this.inputField,
                {
                    xtype: "button",
                    iconCls: "pimcore_icon_edit",
                    handler: this.openImage.bind(this),
                    style: "margin-left: 5px",
                },
                this.deleteButton
            ],
            componentCls: "object_field",
            border: false,
            style: {
                padding: 0
            }
        });

        var panelConf = {
            border: true,
            style: "margin-bottom: 20px",
            title:  this.fieldConfig.title,
            //width: 800,
            viewConfig: {
                forceFit: true
            },
            items: [
                this.composite,
                conf
                ]
        };

        this.component = new Ext.form.FieldSet(panelConf);


        this.component.on("afterrender", function (el) {
            el.getEl().on("contextmenu", this.onContextMenu.bind(this));

            if (this.data) {
                this.updateImage();
            }

        }.bind(this));

        return this.component;
    },

    getLayoutShow: function () {

        this.component = this.getLayoutEdit();
        this.inputField.disable();
        this.deleteButton.disable();

        return this.component;
    },

    openImage: function () {
        window.open(this.inputField.getValue(), "_blank");
    },

    updateImage: function () {

        // 5px padding (-10)
        var body = this.getBody();
        var width = body.getWidth()-10;
        var height = body.getHeight()-10;

        var path = this.inputField.getValue();

        body = body.down('.x-autocontainer-innerCt');
        body.setStyle({
            backgroundSize: "contain",
            backgroundImage: "url(" + path + ")",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat"
        });
        body.repaint();
    },

    getBody: function () {
        // get the id from the body element of the panel because there is no method to set body's html
        // (only in configure)

        var elements = Ext.get(this.component.getEl().dom).query(".pimcore_externalimage_container");
        var bodyId = elements[0].getAttribute("id");
        var body = Ext.get(bodyId);
        return body;

    },

    onContextMenu: function (e) {

        var menu = new Ext.menu.Menu();

        if(this.data) {
            if (!this.fieldConfig.noteditable) {
                menu.add(new Ext.menu.Item({
                    text: t('empty'),
                    iconCls: "pimcore_icon_delete",
                    handler: function (item) {
                        this.inputField.setValue("");
                        this.updateImage();

                    }.bind(this)
                }));
            }

            menu.add(new Ext.menu.Item({
                text: t('open'),
                iconCls: "pimcore_icon_open",
                handler: function (item) {
                    //item.parentMenu.destroy();

                    this.openImage();
                }.bind(this)
            }));
        }

        menu.showAt(e.getXY());

        e.stopEvent();
    },

    empty: function () {

        this.inputField.setValue();
        this.updateImage();
    },

    getValue: function () {
        return this.inputField.getValue();
    },

    getName: function () {
        return this.fieldConfig.name;
    },

    isInvalidMandatory: function () {
        if (this.getValue()) {
            return false;
        }
        return true;
    }
    ,

    isDirty: function() {
        return this.inputField.isDirty();
    }
});