
try{
    resizeItemsInPage();   // Since this script gets loaded as a content script, this function gets executed whenever a website is loaded
}
catch(e){
    console.log(e);
}



// 
function resizeItemsInPage(){

    // Get domain of current page

    return false;

    /*
    // Fetch list of resized elements in current domain
    browser.storage.local.get(domain)
    .then(
        (elementsToResize) => {
            
            for (selector in elementsToResize.keys()){  // keys of the object are selectors (e.g. 'h2.title')
                
                // For each item in the list, find instances of it on the page
                elementsToResizeInDom = document.querySelectorAll(selector);

                sizeFactor = elementsToResize[selector]; // The size multiplier (1 = original size)

                for (e in elementsToResizeInDom){
                    ResizeElement(e, sizeFactor);
                }

            }

            
        } ,
        onStorageGetError
    )
    */

    

}



function ResizeElement(){
    return false;
}










// https://stackoverflow.com/questions/42184322/javascript-get-element-unique-selector
function generateQuerySelector(el) {

    if (el.tagName.toLowerCase() == "html")
        return "HTML";

    var str = el.tagName;
    
    str += (el.id != "") ? "#" + el.id : "";    // Add #id if there is one
    
    if (el.className) {                         // Add class or classes if there's any
        var classes = el.className.split(/\s/);
        for (var i=0; i<classes.length; i++) {
            str += "." + classes[i];
        }
    }

    return(generateQuerySelector(el.parentNode) + " > " + str);
}



function GetDomainOfCurrentPage(){
    return(window.location.hostname);
}




///////////////////////////////
//  REDECORATE ON TAG CHANGE //
///////////////////////////////

//When a tag is toggled, the link decoration only changes when reloading the page.
//However, with this code it also redecorates when user toggles a tag using the context menu.

browser.runtime.onMessage.addListener(
    (message) => {
        if (message == "cmd: update icons")
            decorateAllLinksInPage();
    }
);