$(function(){var e=$.coremetrics({category_id:"test",page_paths:{"":"landing-page",sample:"sample-page"},call_page_tags:!0,use_attribute_tags:!0});e.fire({type:"page",id:"test-page-id",cat:"another-category-id"}),e.fire({type:"element",id:"test-page-id"}),e.fire({id:"test-id-without-cat-or-type"}),e.fire({cat:"new-category"})});