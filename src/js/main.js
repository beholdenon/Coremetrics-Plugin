$(function() {
	// initiate and set defaults
	var c = $.coremetrics({
		category_id: "test",
		page_paths: {
			"": "landing-page",
			"sample": "sample-page"
		},
		call_page_tags: true,
		use_attribute_tags: true
	});
	
	// set category
	// c.category_id("New-Category-Name");

	// get category
	// c.category_id();

	// fire tag (type (page || element), id, cat)
	c.fire({
		type: "page",
		id: "test-page-id",
		cat: "another-category-id"
	});
	// (if cat is omitted it will use default)
	c.fire({
		type: "page", 
		id: "test-page-id"
	});
});