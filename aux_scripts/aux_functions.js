
//This file contains functions used by other parts of the program.
//In the manifest, it must be loaded before any file that uses it.


function floatsAreEqual(f1, f2){
    return( Math.abs(f1 - f2) < 0.0001 )
}



function GetDomainOfCurrentPage(){
    return( normalizeUrl(window.location.hostname) );
}



function normalizeUrl(url){
    //Remove parts of the url such as "http//:", "www."... and make it lowercase
    //This ensures local stored info can be retrieved even if the url is slightly different than when data was saved.

    result = url.toLowerCase();
  
    result = deleteSubstringAtStart(result, "http://");
    result = deleteSubstringAtStart(result, "https://");
    result = deleteSubstringAtStart(result, "www.");    //This one must go AFTER http and https
    
    return(result);
}
  

function deleteSubstringAtStart(mainstring, substring){
    //Remove a substring from a bigger string, but only if it's at the beginning
    //(since that's all we need, and searching the whole string would be unnecesarily inneficient)
  
    if( mainstring.startsWith(substring) ){
        return(mainstring.slice(substring.length))    //Remove the substring from the beginning of mainstring, and return the remaining part
    }else{
        return(mainstring);
    }
}




// Given an element from a document, generates a CSS selector
// https://stackoverflow.com/questions/42184322/javascript-get-element-unique-selector
function generateQuerySelector(el){

    if (el.tagName.toLowerCase() == "html") return "HTML";

    let str = el.tagName;   // i.e.: DIV, H2, A, P, IMG...

    if (el.id != "")   str += ("#" + el.id);    // Add #id if there is one

    if (el.className) {                         // Add class or classes if there's any
        let classes = el.className.split(/\s/); // Split into a list using space as delimiters
        removeItemFromArray(classes, "");       // Remove empty strings caused by extra spaces (i.e. "htitle  redtext module3 " -> ["htitle", "", "redtext", "module3", ""])
        
        for (let i=0; i<classes.length; i++) {
            str += "." + classes[i];
        }
    }

    // Recursively do the same with the parent and concatenate selectors with > (child combinator)
    return(generateQuerySelector(el.parentNode) + " > " + str);
}



// Removes all instances of an item in an array. 
function removeItemFromArray(array, item) {
    let i = array.length;

    while (i--) {   // Loop backwards to prevent the problems of modifying an array while looping on it
        if (array[i] === item) {
            array.splice(i, 1);
        }
    }
}