// Content script -> Runs in the background, in the context of the browser, not any particular tab

"use strict";


//////////////////////////////////
//  CREATE CONTEXT MENU ITEMS   //
//////////////////////////////////

//Note: there can only be one context menu item per extension. If we have more than one tag, they appear in a submenu.

// Code related to context menu -> Reset size
// https://stackoverflow.com/a/7704392

browser.contextMenus.create(
    {
        id: "reset-size",
        title: "Reset size",
        contexts: ["all"],
        type: "normal",
        onclick: mycallback
    }
);

function mycallback(info, tab) {
    browser.tabs.sendMessage(tab.id, "getClickedEl", {frameId: info.frameId});
}
