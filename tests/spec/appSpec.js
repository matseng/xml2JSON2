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
        // var xmlString = "<Root name-example='Root Name'><ChildExample name='test'>Child 1</ChildExample><ChildExample>Child 2</ChildExample></Root>";
        var xmlString = "<VAST> \
            <ChildExample type='A'>URL1</ChildExample> \
            <ChildExample type='A'>URL2</ChildExample> \
            <ChildExample type='B'>URL3</ChildExample> \
            <ChildExample type='B'>URL4</ChildExample> \
            <ChildExample type='C'>URL5</ChildExample> \
          </VAST>";
        
        var jsonObj = x2js.xml_str2json(xmlString);
        console.log(jsonObj);
        it('should convert VAST tag to lowercase vast (special case', function(){
          expect(jsonObj.vast).to.exist;
        });
        it('show convert the first letter all xml tags and attributes to lowercase json keys', function() {
          expect(jsonObj.VAST).to.not.exist;
          expect(jsonObj.vast.childexample).to.not.exist;
          expect(jsonObj.vast.childExample[1].__text).to.equal('URL2');
        });
      });

      describe('create a condensed json object', function() {
        var xmlString = "<VAST> \
            <ChildExamples> \
              <ChildExampleX id='A' attr='123'>URL1</ChildExampleX> \
              <ChildExampleX id='A' attr='123'>URL2</ChildExampleX> \
              <ChildExampleX id='B' attr='123'>URL3</ChildExampleX> \
              <ChildExampleX id='B' attr='123'>URL4</ChildExampleX> \
              <ChildExampleX id='C' attr='123'>URL5</ChildExampleX> \
            </ChildExamples> \
          </VAST>";
        // debugger
        var jsonObj = x2js.xml_str2json(xmlString);
        console.log(jsonObj);
        console.log(jsonObj.vast.childExamples);
        // debugger
        it('should condense child tags into array(s)', function() {
          expect(jsonObj).to.exist;
          // expect(jsonObj.vast.childExamples.a).to.equal(['URL1', 'URL2']);
          // expect(jsonObj.vast.childExamples.b).to.equal(['URL3', 'URL4']);
          expect(jsonObj.vast.childExamples.c).to.equal(['URL5']);
        });
      });

    	describe('parse VAST XML examples', function() {
    		var vastJson = x2js.xml2json(xmlDoc);  //xmlDoc is a global variable => Grunfile.js => testRunner.html => xmlFileLoader.js
        console.log(vastJson);  //logs in rendered HTML page
        xit('should load an XML document', function() {
          expect(xmlDoc).to.exist;  
        });
        
        xit('should have access to the version number', function() {
          expect(vastJson.VAST.version).to.equal("3.0");
    		})
    	});
    });

})();
