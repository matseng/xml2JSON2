/* global describe, it */

(function () {
    'use strict';

    describe('xml2json parser', function() {
    	var x2js = new X2JS();
    	
    	describe('basic xml string to json examples', function() {
    		var xmlString0 = "<root>Root 0</root>";
    		var xmlString1 = "<root name-example='Root Name'><child name='test'>Child 1</child><child>Child 2</child></root>";
    		var myJsonObj = x2js.xml_str2json(xmlString1);
        console.log(myJsonObj);  //logs in rendered HTML page
        
        it('should have access to a root property', function() {
          expect(x2js.xml_str2json(xmlString0).root).to.equal('Root 0');
        });

        it('should have access to child properties', function() {
          expect(myJsonObj.root.child[1]).to.equal('Child 2');

    		});
    		it('should access to a named attribute', function() {
    			expect(myJsonObj.root['name-example']).to.equal('Root Name');
    		})
    	});

      describe('create lowercase strings as json keys', function() {
        // var xmlString1 = "<Root name-example='Root Name'><child name='test'>Child 1</child><child>Child 2</child></Root>";
        var xmlString = "<Root>Root 0</Root>";
        var jsonObj = x2js.xml_str2json(xmlString);
        it('show convert all xml tags and attributes to lowercase json keys', function() {
          expect(jsonObj.Root).to.not.exist;
          expect(jsonObj.root).to.equal('Root 0');
        });
      });

      describe('create a condensed json object', function() {
        var xmlString2 = "<root> \
            <child type='A'>URL1</child> \
            <child type='A'>URL2</child> \
            <child type='B'>URL3</child> \
            <child type='B'>URL4</child> \
            <child type='C'>URL5</child> \
          </root>";
        var jsonObj = x2js.xml_str2json(xmlString2);
        console.log(jsonObj);
        debugger
        it('should condense child tags into array(s)', function() {
          expect(jsonObj).to.exist;
          expect(jsonObj.root.a).to.equal([URL1, URL2]);
          expect(jsonObj.root.b).to.equal([URL3, URL4]);
          expect(jsonObj.root.c).to.equal([URL5]);
        });
      });

    	describe('parse VAST XML examples', function() {
    		it('should load an XML document', function() {
    			expect(xmlDoc).to.exist;  //xmlDoc is a global variable => Grunfile.js => testRunner.html => xmlFileLoader.js
    		});
    		
    		it('should have access to the version number', function() {
    			var vastJson = x2js.xml2json(xmlDoc);
          console.log(vastJson);  //logs in rendered HTML page
          expect(vastJson.VAST.version).to.equal("3.0");
    		})
    	});
    });

})();
