if (window.desktopApp)
    desktopApp.wins = {
        active: null,
        setActiveStyle: function (winId) {
            if (desktopApp.wins.active)
                webix.html.removeCss($$(desktopApp.wins.active).$view, "active_win");
            webix.html.addCss($$(winId).$view, "active_win", true);
            desktopApp.wins.active = winId;
        },
        forEachWindow: function (func) {
            var views = $$("toolbar").getChildViews();
            for (var i = 1; i < views.length; i++) {
                if (views[i].config.id.indexOf("_button") != -1) {
                    var id = views[i].config.id.replace("button", "win");
                    if ($$(id))
                        func.call(this, id);
                }
            }
        },
        hideAllWindows: function () {
            this.forEachWindow(function (id) {
                if ($$(id).isVisible()) {
                    $$(id).hide();
                    webix.html.removeCss($$(id.replace("_win", "_button")).$view, "active");
                }
            });
        },
        getVisibleWinCount: function () {
            var count = 0;
            this.forEachWindow(function (id) {
                if ($$(id).isVisible())
                    count++;
            });
            return count;
        },
        getPosition: function (state) {
            state.left = this.config.left;
            state.top = this.config.top;
            if (state.height + 40 >= state.maxHeight) {
                state.height = state.maxHeight - 40;
            }
            if (this.config.fullscreen) {
                if (!this.config.lastWindowPos)
                    this.config.lastWindowPos = {top: state.top, left: state.left};
                state.top = state.left = 0;
            } else {
                if (this.config.lastWindowPos) {
                    var last = this.config.lastWindowPos;
                    delete this.config.lastWindowPos;
                    state.top = last.top;
                    state.left = last.left;
                }
                if (state.left + state.width > state.maxWidth) {
                    state.left -= state.left + state.width - state.maxWidth;
                }
                if (state.top + state.height + 40 > state.maxHeight) {
                    state.top -= state.top + state.height + 40 - state.maxHeight;
                }
            }

        },
        showApp: function (name) {
            var winId = name + "_win";
            var c = desktopApp.wins.getVisibleWinCount();
            if (!$$(winId)) {
                var config = desktopApp.wins.ui[name];
                webix.ui({
                    view: "window",
                    id: winId,
                    css: "popup-window-custom app " + config.css || "",
                    position: desktopApp.wins.getPosition,
                    resize: true,
                    left: document.documentElement.clientWidth / 2 - 400 + 15 * c,
                    top: document.documentElement.clientHeight / 2 - 225 - 40 + 25 * c,
                    move: true,
                    toFront: true,
                    height: 450,
                    width: 800,
                    head: desktopApp.wins.ui.toolbar.apply(this, config.toolbar()),
                    body: config.body(),
                    on: config.events
                });

            }
            $$(winId).show();
            desktopApp.wins.setActiveStyle(winId);
        },
        ui: {
            toolbar: function (title, onHide, onMinMax, onClose) {
                return {
                    view: "toolbar",
                    height: 28,
                    css: "window-toolbar",
                    margin: 0,
                    padding: 0,
                    cols: [
                        {
                            view: "label",
                            label: "<img src='img/window-icon.png' class='header-window-icon'/> " + title
                        },
                        {
                            view: "button",
                            type: "image",
                            image: "img/hide_button.png",
                            width: 36,
                            height: 20,
                            css: "hide-button webix_transparent",
                            on: {
                                onItemClick: onHide
                            }
                        },
                        {
                            view: "button",
                            type: "image",
                            image: "img/close_button.png",
                            width: 36,
                            height: 20,
                            css: "close-button webix_transparent",
                            on: {
                                onItemClick: onClose
                            }
                        }
                    ]
                };
            },
            contacts: {
                css: "no_border ",
                toolbar: function () {
                    return [
                        "Contacts",
                        function () {
                            $$('contacts_win').hide();
                            webix.html.removeCss($$("contacts_button").$view, "active");
                        },
                        function () {
                            $$("contacts_win").config.fullscreen = !$$("contacts_win").config.fullscreen;
                            $$("contacts_win").resize();

                        }, function () {
                            $$("toolbar").removeView("contacts_button");
                            $$('contacts_win').hide();
                            desktopApp.buttonCount--;
                        }
                    ]
                },
                body: function () {
                    return {
                        id: "contacts",
                        rows: [
                            {
                                view: "datatable",
                                columns: [
                                    {id: "name", header: "Name", width: 200, editor: "text"},
                                    {id: "surname", header: "Surname", width: 200, editor: "text"},
                                    {id: "phone", header: "Phone", width: 200, editor: 'text'}
                                ],

                                select: "row", editable: true, editaction: "dblclick",
                                save: "server/datatable_save.php",
                                url: "server/datatable.php"
                            },
                            {
                                view: "toolbar", elements: [
                                    {
                                        view: "button", value: "Добавить", click: function () {
                                            $$('$datatable1').add({
                                                name: "",
                                                surname: "",
                                                phone: "+7",
                                            });
                                        }
                                    },
                                    {
                                        view: "button", value: "Удалить", click: function () {
                                            var id = $$('$datatable1').getSelectedId();
                                            if (id)
                                                $$('$datatable1').remove(id);
                                        }
                                    },
                                    {}
                                ]
                            },
                        ]
                    }
                },
                events: {
                    onBeforeShow: function () {
                        desktopApp.beforeWinShow("contacts");
                    }
                }
            },
            tablets: {
                css: "no_border ",
                toolbar: function () {
                    return [
                        "Tablets",
                        function () {
                            $$('tablets_win').hide();
                            webix.html.removeCss($$("tablets_button").$view, "active");
                        },
                        function () {
                            $$("tablets_win").config.fullscreen = !$$("tablets_win").config.fullscreen;
                            $$("tablets_win").resize();
                        }, function () {
                            $$("toolbar").removeView("tablets_button");
                            $$('tablets_win').hide();
                            desktopApp.buttonCount--;
                        }
                    ]
                },
                body: function () {
                    return {
                        id: "tablets",
                        rows: [
                            {
                                view: "datatable",
                                columns: [
                                    {id: "title", header: "Title", width: 250, editor: "text"},
                                    {id: "type", header: "Type", width: 200, editor: "text"},
                                    {id: "manufacturer", header: "Manufacturer", width: 200, editor: 'text'},
                                    {id: "price", header: "Price", width: 150, editor: 'text'}
                                ],
                                select: "row", editable: true, editaction: "dblclick",
                                save: "server/datatable_tablets_save.php",
                                url: "server/datatable_tablets.php"
                            },
                            {
                                view: "toolbar", elements: [
                                    {
                                        view: "button", value: "Добавить", click: function () {
                                            $$('$datatable2').add({
                                                title: "",
                                                type: "",
                                                manufacturer: "",
                                                price: "",
                                            });
                                        }
                                    },
                                    {
                                        view: "button", value: "Удалить", click: function () {
                                            var id = $$('$datatable2').getSelectedId();
                                            if (id)
                                                $$('$datatable2').remove(id);
                                        }
                                    },
                                    {}
                                ]
                            },
                        ]
                    }
                },
                events: {
                    onBeforeShow: function () {
                        desktopApp.beforeWinShow("tablets");
                    }
                }
            }
        }
    };
