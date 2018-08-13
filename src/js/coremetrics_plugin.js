window.bl = window.bl || {};

(function(ns, bl) {
  
    // private variables
    // whether or not connection to coremetrics library is succesful
    var libraryFound = false;

    // env either production or dev
    var env = window.ENV_CONFIG || "dev";

    // get current host
    var host = window.location.host;

    // production urls
    var PRODUCTION_URLS = [
        "fashion.bloomingdales.com",
        "www.bloomingdales.com",
        "m.bloomingdales.com"
    ];

    //plugin defaults
    var options = {
        // defeault cat id
        category_id: "",

        // default page id's for onLoad tags
        page_paths: {},
        
        // control whether or not onLoad page tags fire
        call_page_tags: true,

        // use html attributes for element tags
        use_attribute_tags: true,

        // the name of the attribute tags
        attribute_tag: "coremetricTag"
    };

    // init called when plugin instance is created 
    function init() {
        // check to see if coremetric library connected
        libraryFound = checkForLibrary();
        if(libraryFound) {
            bl.utils.log("Library Initiated");

            // intial coremetrics setup
            initEnvironment();

            // listen for html elements with coremetrics attribute tags
            initAttributeListener();

            // call on load page event
            initPageLoadCall();
        }
        else {
            // could not connect to coremetrics
            bl.utils.log("ERROR: Could not find coremetrics library (from init method)");
        }
    }

    // test connection to bloomies and  coremetrics
    function checkForLibrary() {
        try {
            if(window.BLOOMIES && window.BLOOMIES.coremetrics) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            bl.utils.log("ERROR: Could not find coremetrics library (from checkForCoremetrics method): " + e);
            return false;
        }
    }

    // setup dev or production environment
    function initEnvironment() {
        window.BLOOMIES.coremetrics.pageViewExploreAttributes = new window.BLOOMIES.coremetrics.exploreAttributes();
        if (env === "dev") {
            return cmSetTest();
        }
        else if (env === "production") {
            if (PRODUCTION_URLS.indexOf(path) >= 0) {
                return cmSetProduction();
            }
            else {
                return cmSetTest();
            }
        }
        else {
            throw "ERROR: Unidentified env variable (from initEnvironment method)";
        }
    }

    // setup
    function initAttributeListener() {
        if(options.use_attribute_tags) {
            var el = document.querySelectorAll("[" + options.attribute_tag + "]");

            window.bl.utils.forEach(el, function (index, value) {
                value.onclick = function(){
                    fireTag({
                        type: 'element',
                        id: value.getAttribute(options.attribute_tag),
                        cat: options.category_id
                    });
                };
            });
        }
        
    }

    // setup page id's firing on page load
    function initPageLoadCall() {
        if(options.page_paths != {} && options.call_page_tags) {
            var page = options.page_paths[path()];
            if(page !== undefined) {
               fireTag({
                    type: "page",
                    id: page,
                    cat: options.category_id
                });
            }
        }
    }

    // check the tags passed
    function checkTag(params) {
        if(!libraryFound) {
            bl.utils.log("ERROR: Coremetrics library not found");
            return false;
        }
        else if(params === undefined) {
            bl.utils.log("ERROR: Params not set");
            return false;
        }
        else if(params.id === undefined) {
            bl.utils.log("ERROR: ID not set");
            return false;
        }
        return true;
    }

    // method to fire tags (cat is optional)
    function fireTag(params) {
        if(checkTag(params)) {
            var cat = params.cat || options.category_id;
            var id = params.id;
            var type = params.type;
            if(id) {
                switch(type) {
                    case "element":
                        cmCreatePageElementTag(id, cat);
                    break;
                    default:
                        cmCreatePageviewTag(id, cat);
                }
            }
            else {
                bl.utils.log("ERROR: No id specified (from fireTag Method)");
            }
        }
    }

    // call page view tag 
    function cmCreatePageviewTag(id, cat) {
        try {
            window.BLOOMIES.coremetrics.cmCreatePageviewTag(id, cat, "", "");
            bl.utils.log("Coremetrics Page: Category: " + cat + " ID: " + id);
        } catch (e) {
            bl.utils.log("cmCreatePageviewTag Error: " + e);
        }
    }

    // call element tag
    function cmCreatePageElementTag(id, cat) {
        try {
            window.BLOOMIES.coremetrics.cmCreatePageElementTag(id, cat);
            bl.utils.log("Coremetrics Element: Category: " + cat + " ID: " + id);
        } catch (e) {
            bl.utils.log("cmCreatePageElementTag Error: " + e);
        }
    }

    // return current directory
    function path() {
        var urlArr = window.location.pathname.split("/");
        if( urlArr[urlArr.length - 1] === "" ) {
            return urlArr[urlArr.length - 2];
        }
        else {
            return urlArr[urlArr.length - 1];
        }
        return window.location.pathname;
    }

    // public methods
    ns.init = function(settings) {
        options = window.bl.utils.extend(options, settings);
        init();
    };
    ns.fireTag = function(params) {
        fireTag(params);
    };
    ns.path = function() {
        return path();
    };
    ns.category_id = function(val) {
        if(val) {
            options.category_id = val;
        }
        else {
            return options.category_id;
        }
    };
    ns.libraryFound = function () {
        return libraryFound;
    };
})(window.bl.coremetrics = window.bl.coremetrics || {}, window.bl);