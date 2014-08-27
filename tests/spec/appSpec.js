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
            <TrackingEvents> \
              <Tracking event='a1'>URL1</Tracking> \
              <Tracking event='a1'>URL2</Tracking> \
              <Tracking event='b1'>URL3</Tracking> \
              <Tracking event='b1'>URL4</Tracking> \
              <Tracking event='c1' attr='testing'>URL5</Tracking> \
            </TrackingEvents> \
          </VAST>";
        
        var jsonObj = x2js.xml_str2json(xmlString);

        console.log(jsonObj);
        it('should condense child tags into array(s) of object(s)', function() {
          expect(jsonObj).to.exist;
          expect(jsonObj.vast.trackingEvents.c1.value).to.equal('URL5');
          expect(jsonObj.vast.trackingEvents.c1.attr).to.equal('testing');
          expect(jsonObj.vast.trackingEvents.a1[0].value).to.equal('URL1');
          expect(jsonObj.vast.trackingEvents.b1[1].value).to.equal('URL4');
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
          expect(vastJson.vast.ad.inLine.creatives.creative.linear.trackingEvents.start.value).to.equal('http://216.178.47.89/api/1.0/tag/8/event/start'); 
          expect(vastJson.vast.ad.inLine.creatives.creative.linear.trackingEvents.creativeView[1].value).to.equal('http://216.178.47.89/api/1.0/tag/8/event/creativeView?id=2'); 
        });
        it('should have access to the media file(s)', function() {
          expect(vastJson.vast.ad.inLine.creatives.creative.linear.mediaFiles.mediaFile.bitrate).to.equal('1063');
        });
    	});

      describe('parse another VAST example', function() {
        var xmlDoc = xmlFileLoader("../tests/xmlExampleFiles/BasicVAST_JCP.xml");
        var vastJson = x2js.xml2json(xmlDoc);
        console.log(vastJson);
        it('should have access to the media file(s)', function() {
          expect(vastJson.vast.ad.inLine.creatives.creative.linear.mediaFiles.mediaFile.bitrate).to.equal('400');  
          expect(vastJson.vast.ad.inLine.creatives.creative.linear.duration).to.equal(16);  //NOTE: The value '00:00:16' has been converted to 16 integer seconds
        });
      });

      describe('Use an ajax call to HAWK API to test an example VAST xml file', function() {
        it('should have a companion ad', function(done) {
          var vastJson;
          var request = $.ajax({
            type: 'GET',
            url: 'http://216.178.47.89/api/1.0/tag/1',
            dataType: 'xml'
          })
          .done(function(xmlDoc) {
            vastJson = x2js.xml2json(xmlDoc);
            console.log(vastJson);
            expect(vastJson.vast.ad.inLine.creatives.creative[1].companionAds.companion).to.exist;
            done();
          })
          .error(function(jqXHR, textstatus, err) {
            console.log(jqXHR, textstatus, err);
          });
        });
      });

      describe("Download json object that contains id's for example vast xml files", function() {
        it('should have at least 16 different vast ids', function(done) {        
          var request = $.ajax({
            type: 'GET',
            url: 'http://216.178.47.89/api/1.0/tags?type=vast',
            dataType: 'json'
          })
          .done(function(data) {
            expect((data.tags.length >= 16)).to.equal(true);
            done();
          })
          .error(function(jqXHR, textstatus, err) {
            console.log(jqXHR, textstatus, err);
          })
        });
      });

      describe("Iterate over each vast xml file and test at least 1 field", function() {
        function getVastJsonFromId(id) {
          var url = 'http://216.178.47.89/api/1.0/tag/' + id;
          return $.ajax({
            type: 'GET',
            url: 'http://216.178.47.89/api/1.0/tag/1',
            dataType: 'xml'
          })
          .then(function(xmlDoc) {  //NOTE: Use '.then' instead of '.done'
            var vastJson = x2js.xml2json(xmlDoc);
            var dfd = new jQuery.Deferred();
            return dfd.resolve(vastJson);
          });
        }

        it('should have json lookups that correspond to correct xml values', function(done) { 
          this.timeout(10000);       
          var lookup = {
            1 : {str: 'vast.version',
                val: '2.0'},
            2 : {str: 'vast.ad.inLine.creatives.creative',  //TRYING TO WRITE BETTER TESTS HERE... more flexible tests
                val: 2,
                cb: function(obj) {return obj.length}},
            82 : {str: 'vast.ad.inLine.adTitle',
                val: "Colgate_Breaker_CLDC6258000take4_mp4_352x198_16-9.mp4"},
          };
          var request = $.ajax({
            type: 'GET',
            url: 'http://216.178.47.89/api/1.0/tags?type=vast',
            dataType: 'json'
          })
          .done(function(data) {
            for(var i = 0; i < data.tags.length; i++) {
              var vastJsonPromise = getVastJsonFromId(data.tags[i].id);
              vastJsonPromise.then(function(vastJson) {
                var urlId = this;
                console.log(urlId, vastJson);
                expect(vastJson.vast).to.exist;
                if(lookup[urlId]) {
                  try {
                    if(lookup[urlId].cb) {
                      var callback = lookup[urlId].cb;
                      expect(callback(Dottie.get(vastJson, lookup[urlId].str)) === lookup[urlId].val).to.equal(true); 
                    } else {
                      expect(Dottie.get(vastJson, lookup[urlId].str) === lookup[urlId].val).to.equal(true);
                    }
                  } catch(err) {
                    console.log("Error with url id:", urlId, err);
                    throw urlId;
                  }
                }
                if(urlId === data.tags[data.tags.length - 1].id) {
                  console.log('Completed testing of VAST examples');
                  done();
                }
              }.bind(data.tags[i].id));
            }
          })
          .error(function(jqXHR, textstatus, err) {
            console.log(jqXHR, textstatus, err);
          })
        });
      });

    });

})();
