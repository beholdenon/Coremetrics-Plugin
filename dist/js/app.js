(function($) {
    var coremetrics = false;
    var env = window.ENV_CONFIG || 'dev';
    $.extend($, {
        coremetrics: function(options) {
            options = $.extend({
                category_id: '',
                page_paths: {},
                call_page_tags: true
            }, options);
            function init() {
                coremetrics = checkForCoremetrics();
                if(coremetrics) {
                    log("Coremetrics Initiated");

                    // intial coremetrics setup
                    initEnvironment();

                    // listen for html elements with coremetrics attribute tags
                    initAttributeListener();

                    // call on load page event
                    initPageLoadCall();
                }
                else {
                    log("Coremetrics Not Found");
                }
            }
            function checkForCoremetrics() {
                try {
                    if(window.BLOOMIES && window.BLOOMIES.coremetrics) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                catch (e) {
                    return false;
                }
            }
            function initEnvironment() {
                if (env === 'dev') {
                    return cmSetTest();
                }
                else if (env === 'production') {
                    if (window.location.host === 'www.bloomingdales.com') {
                        return cmSetProduction();
                    }
                    else {
                        return cmSetTest();
                    }
                }
                else {
                    throw 'ERROR: unidentified env variable';
                }
            }
            function initAttributeListener() {
                $('[coremetricTag]').click(function() {
                    fireTag('element', $( this ).attr( "coremetricTag" ), options.category_id);
                });
            }
            function initPageLoadCall() {
                if(options.page_paths != {} && options.call_page_tags) {
                    var page = options.page_paths[path()];
                    if(page != undefined) {
                       fireTag("page", page, options.category_id);
                    }
                }
            }
            function log(msg) {
                if (window.console) {
                    console.log(msg);
                }
            }
            function fireTag(type, id, cat) {
                if(coremetrics) {
                    switch(type) {
                        case "page":
                            cmCreatePageviewTag(id, cat || options.category_id);
                        break;
                        case "element":
                            cmCreatePageElementTag(id, cat || options.category_id);
                        break;
                    }
                }
                else {
                    log("Cannot fire " + type + " because coremetrics not found: " + id);
                }
            }
            function cmCreatePageviewTag(id, cat) {
                try {
                    window.BLOOMIES.coremetrics.cmCreatePageviewTag(id, cat, '', '');
                    log("Coremetrics Page: Category: " + cat + " ID: " + id);
                } catch (e) {
                    log("cmCreatePageviewTag Error: " + e);
                }
            }
            function cmCreatePageElementTag(id, cat) {
                try {
                    window.BLOOMIES.coremetrics.cmCreatePageElementTag(id, cat);
                    log("Coremetrics Element: Category: " + cat + " ID: " + id);
                } catch (e) {
                    log("cmCreatePageElementTag Error: " + e);
                }
            }
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
            init();
            return {
                init: function() {
                    init();
                },
                fire: function(type, tag, cat) {
                    fireTag(type, tag, cat);
                },
                path: function() {
                    return path();
                },
                category_id: function(val) {
                    if(val) {
                        options.category_id = val;
                    }
                    else {
                        return options.category_id;
                    }
                },
                checkForCormetrics: function () {
                    return coremetrics();
                }
            };
        }
    });
})(jQuery);
$(function() {
	// initiate and set defaults
	var c = $.coremetrics({
		category_id: "test",
		page_paths: {
			"": "landing-page",
			"sample": "sample-page"
		},
		call_page_tags: false
	});
	
	// set category
	// c.category_id("New-Category-Name");

	// get category
	// c.category_id();

	// fire tag (type (page || element), id, cat)
	// (if cat is omitted it will use default)
	c.fire("page", "test-page-id");
});