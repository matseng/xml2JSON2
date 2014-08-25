/* global describe, it */

(function () {
    'use strict';

    describe('xml2json parser', function() {
    	var x2js = new X2JS();
    	
    	describe('basic xml string to json examples', function() {
    		var xmlString0 = "<root>Root 0</root>";
    		var xmlString1 = "<root name-example='Root Name'><child name='test'>Child 1</child><child>Child 2</child></root>";
    		var myJsonObj = x2js.xml_str2json(xmlString1);
    		
    		it('should have access to a root property', function() {
    			expect(x2js.xml_str2json(xmlString0).root).to.equal('Root 0');
    		});

    		it('should have access to child properties', function() {
    			expect(myJsonObj.root.child[1]).to.equal('Child 2');
                console.log(myJsonObj);  //logs in rendered HTML page

    		});

    		it('should access to a named attribute', function() {
    			expect(myJsonObj.root['name-example']).to.equal('Root Name');
    		})
    	});

    	describe('parse VAST XML examples', function() {
    		
    		it('should load an XML document', function() {
    			expect(xmlDoc).to.exist;
    		});
    		
    		it('should have access to the version number', function() {
    			var vastJson = x2js.xml2json(xmlDoc);
    			expect(vastJson.VAST.version).to.equal("3.01");
                console.log(vastJson);  //logs in rendered HTML page
    		})
    	});
    });

})();
