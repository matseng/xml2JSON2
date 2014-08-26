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
          expect(jsonObj.vast.childExample[1].value).to.equal('URL2');
        });
      });

      describe('create a condensed json object', function() {
        var xmlString = "<VAST> \
            <ChildExamples> \
              <ChildExampleX event='a1'>URL1</ChildExampleX> \
              <ChildExampleX event='a1'>URL2</ChildExampleX> \
              <ChildExampleX event='b1'>URL3</ChildExampleX> \
              <ChildExampleX event='b1'>URL4</ChildExampleX> \
              <ChildExampleX event='c1' attr='testing'>URL5</ChildExampleX> \
            </ChildExamples> \
          </VAST>";
        // debugger
        
        var jsonObj = x2js.xml_str2json(xmlString);

        console.log(jsonObj);
        // debugger
        it('should condense child tags into array(s) of object(s)', function() {
          expect(jsonObj).to.exist;
          expect(jsonObj.vast.childExamples.c1.value).to.equal('URL5');
          expect(jsonObj.vast.childExamples.c1.attr).to.equal('testing');
          expect(jsonObj.vast.childExamples.a1[0].value).to.equal('URL1');
          expect(jsonObj.vast.childExamples.b1[1].value).to.equal('URL4');
        });
      });

    	describe('parse VAST XML examples', function() {
    		var xmlDoc = xmlFileLoader("../tests/xmlExampleFiles/basicVastExample.xml");
        var vastJson = x2js.xml2json(xmlDoc);  //xmlDoc is a global variable => Grunfile.js => testRunner.html => xmlFileLoader.js
        console.log(vastJson);
        it('should load an XML document', function() {
          expect(xmlDoc).to.exist;  
        });
        it('should have access to the version number', function() {
          expect(vastJson.vast.version).to.equal("3.0");
    		});
        it('should have access to the second tracking event URL', function() {
          expect(vastJson.vast.ad.inLine.creatives[8].linear.trackingEvents.creativeView[1].value).to.equal('http://216.178.47.89/api/1.0/tag/8/event/creativeView?id=2'); 
        });
        it('should have access to the media file(s)', function() {
          expect(vastJson.vast.ad.inLine.creatives[8].linear.mediaFiles['f0d1ad4d-54c9-4d10-b485-7a88996c68b2'].bitrate).to.equal('1063');
        });
        //NOTE: 
    	});

      describe('parse another VAST example', function() {
        var xmlDoc = xmlFileLoader("../tests/xmlExampleFiles/BasicVAST_JCP.xml");
        var vastJson = x2js.xml2json(xmlDoc);
        console.log(vastJson);
        it('should have access to the media file(s)', function() {
          expect(vastJson.vast.ad.inLine.creatives[9].linear.mediaFiles.progressive.bitrate).to.equal('400');  //NOTE: there is no 'id' field, so 'progressive' become the key
        });
      });

    });

})();
