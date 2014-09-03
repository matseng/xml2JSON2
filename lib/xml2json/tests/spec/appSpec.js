/* global describe, it */

(function () {
    'use strict';

    describe('xml2json parser', function() {
    	var x2js = new X2JS();

      describe('basic xml string to json examples', function() {
        var xmlString0 = "<root>Root 0</root>";
        var xmlString1 = "<root name-example='Root Name'><child name='test'>Child 1</child><child>Child 2</child></root>";
        var myJsonObj;

        try {
          myJsonObj = x2js.xml_str2json(xmlString1);
          console.log(myJsonObj);  //logs in rendered HTML page
        } catch(err) {}

        it('should have a functioning xml to json parser', function() {
          expect(myJsonObj).to.exist;
        });

        it('should have access to a root property', function() {
          expect(x2js.xml_str2json(xmlString0).root).to.equal('Root 0');
        });

        it('should have access to child properties', function() {
          expect(myJsonObj.root.child[1]).to.equal('Child 2');
    		});

    		it('should access to a named attribute', function() {
    			expect(myJsonObj.root['name-example']).to.equal('Root Name');
    		});
    	});

      describe('create lowercase strings as json keys (except for AdParameters)', function() {
        var xmlString = "<VAST> \
            <ChildExample type='A'>URL1</ChildExample> \
            <ChildExample type='A'>URL2</ChildExample> \
            <ChildExample Type='B'>URL3</ChildExample> \
            <ChildExample Type='B'>URL4</ChildExample> \
            <ChildExample type='C'>URL5</ChildExample> \
            <AdParameters xmlEncoded='true'> \
              <creativePath> \
              http://cdn456.telemetryverification.net/tv2n/content/telemetry/sample_generic_30_640_cdc_linear/r0003/sample_generic_30_640_cdc_linear_640x360 \
              </creativePath> \
              <spikeDom> \
              spc--cehhehbdjebfnegfeeeghhne--vast2js.telemetryverification.net \
              </spikeDom> \
              <creativeId>BFHmoQgCeQOU</creativeId> \
              <SrC>123</SrC> \
            </AdParameters> \
          </VAST>";
        
        var jsonObj = x2js.xml_str2json(xmlString);
        it('should convert VAST tag to lowercase vast (special case', function(){
          expect(jsonObj.vast).to.exist;
        });
        it('should convert most xml tags and attributes to lowercase json keys', function() {
          expect(jsonObj.VAST).to.not.exist;
          expect(jsonObj.vast.ChildExample).to.not.exist;
          expect(jsonObj.vast.childexample[1].value).to.equal('URL2');
        });
        it('should NOT convert "AdParameters" and its children to lowercase', function() {
          expect(jsonObj.vast.AdParameters.xmlEncoded).to.equal('true');
          expect(jsonObj.vast.AdParameters.SrC).to.equal('123');
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

        it('should condense child tags into array(s) of object(s)', function() {
          expect(jsonObj).to.exist;
          expect(jsonObj.vast.trackingevents.c1.value).to.equal('URL5');
          expect(jsonObj.vast.trackingevents.c1.attr).to.equal('testing');
          expect(jsonObj.vast.trackingevents.a1[0].value).to.equal('URL1');
          expect(jsonObj.vast.trackingevents.b1[1].value).to.equal('URL4');
        });
      });

    	describe('parse VAST XML examples', function() {
    		var xmlDoc = xmlFileLoader("../tests/xmlExampleFiles/basicVastExample.xml");
        var vastJson = x2js.xml2json(xmlDoc);
        it('should load an XML document', function() {
          expect(xmlDoc).to.exist;
        });
        it('should have access to the version number', function() {
          expect(vastJson.vast.version).to.equal("3.0");
    		});
        it('should have access to the second tracking event URL', function() {
          expect(vastJson.vast.ad.inline.creatives.creative.linear.trackingevents.start.value).to.equal('http://216.178.47.89/api/1.0/tag/8/event/start'); 
          expect(vastJson.vast.ad.inline.creatives.creative.linear.trackingevents.creativeview[1].value).to.equal('http://216.178.47.89/api/1.0/tag/8/event/creativeView?id=2'); 
        });
        it('should have access to the media file(s)', function() {
          expect(vastJson.vast.ad.inline.creatives.creative.linear.mediafiles.mediafile.bitrate).to.equal('1063');
        });
    	});

      describe('parse another VAST example', function() {
        var xmlDoc = xmlFileLoader("../tests/xmlExampleFiles/BasicVAST_JCP.xml");
        var vastJson = x2js.xml2json(xmlDoc);
        it('should have access to the media file(s)', function() {
          expect(vastJson.vast.ad.inline.creatives.creative.linear.mediafiles.mediafile.bitrate).to.equal('400');  
          expect(vastJson.vast.ad.inline.creatives.creative.linear.duration).to.equal(16);  //NOTE: The value '00:00:16' has been converted to 16 integer seconds
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
            expect(vastJson.vast.ad.inline.creatives.creative[1].companionads.companion).to.exist;
            done();
          })
          .error(function(jqXHR, textstatus, err) {
            console.log(jqXHR, textstatus, err);
          });
        });
      });

      describe("Download json object that contains id's for example vast xml files", function() {
        it('should have the stated number of tags (i.e. example vast xml files)', function(done) {
          var request = $.ajax({
            type: 'GET',
            url: 'http://216.178.47.89/api/1.0/tags?type=vast',
            dataType: 'json'
          })
          .done(function(data) {
            expect((data.tags.length)).to.equal(data.count);
            done();
          })
          .error(function(jqXHR, textstatus, err) {
            console.log(jqXHR, textstatus, err);
          })
        });
      });

      function getVastJsonFromId(id) {
        var url = 'http://216.178.47.89/api/1.0/tag/' + id;
        return $.ajax({
          type: 'GET',
          url: url,
          dataType: 'xml'
        })
        .then(function(xmlDoc) {  //NOTE: Use '.then' instead of '.done' in order to return a promise
          var vastJson = x2js.xml2json(xmlDoc);
          var dfd = new jQuery.Deferred();
          return dfd.resolve(vastJson);
        });
      };

      Function.prototype.myBind = function(context) {  //NOTE: Had to re-write as myBind because bind is NOT currently supported by PhantomJS
        var func = this;
        return function() {
          var args = Array.prototype.slice.call(arguments);
          return func.apply(context, args);
        }
      };

      function expectEachTag(jsonTags, testCases, done) {
        var arrOfPromises = [];
        $.whenall = function(arr) { return $.when.apply($, arr); };
        for(var i = 0; i < jsonTags.tags.length; i++) {
          arrOfPromises.push(
            getVastJsonFromId(jsonTags.tags[i].id)
            .then(function(vastJson) {
              var urlId = this;
              console.log(urlId, vastJson);
              var dfd = new jQuery.Deferred();
              if(expectTagJson(vastJson, testCases[urlId], urlId)) {
                return dfd.resolve(urlId);
              }
              return dfd.resolve("Missing tests for: " + urlId);
            }.myBind(jsonTags.tags[i].id))
          )
        }
        $.whenall(arrOfPromises).then(function(arrData) {
          done();
          console.log('Completed testing of VAST examples: ', Array.prototype.slice.apply(arguments));
        });
      };

      function expectTagJson(vastJson, test, urlId) {
        if(test) {
          var currTestArray = Array.isArray(test) ? test : [test];
          for(var key in currTestArray) {
            var test = currTestArray[key];
            try {
              expect(test.cb(vastJson)).to.equal(test.val);
              return true;
            } catch(err) {
              console.log("Error with url id:", urlId, err);
              throw err.message;
            }
          }
        }
        return false;
      };

      describe("Iterate over each vast xml file and apply tests", function() {
        it('should have json lookups that correspond to correct xml parameters and values', function(done) {
          this.timeout(10000);
          var testCases = {
            1: [{cb: function(obj) {return obj.vast.version;},
                val: '2.0'},
                {cb: function(obj) {return obj.vast.ad.inline.creatives.creative[0].linear.duration;},
                val: 15},
                {cb: function(obj) {return obj.vast.ad.inline.creatives.creative[0].linear.mediafiles.mediafile.bitrate;},
                val: '400'}],
            2: [{cb: function(obj) {return obj.vast.ad.wrapper.impression.length;},
                val: 5},
                {cb: function(obj) {return obj.vast.ad.id},
                val: "360674"}],
            3: [{cb: function(obj) {return obj.vast.ad.inline.creatives.creative[0].linear.duration;},
                val: 15},
                {cb: function(obj) {return obj.vast.ad.inline.creatives.creative[0].linear.mediafiles.mediafile.value;},
                val:'http://once.unicornmedia.com/now/od/auto/178a3ffa-cd8c-4317-a5d8-b3b48bffc475/f0d1ad4d-54c9-4d10-b485-7a88996c68b2/GolfDemo15/content.once'}],
            4: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative[1].companionads},
                val: ''},
            5: {cb: function(obj) {return obj.vast.ad.wrapper.creatives.creative.linear.videoclicks.clicktracking[0]},
              val: 'http://216.178.47.89/api/1.0/tag/5/event/clicktracking?sequence=1'},
            6: {cb: function(obj) {return obj.vast.ad[0].inline.creatives.creative.linear.trackingevents.creativeview.value},
              val: 'http://216.178.47.89/api/1.0/tag/6/event/creativeView?adid=1&sequence=1'},
            7: {cb: function(obj) {return obj.vast.ad[0].wrapper.creatives.creative.linear.trackingevents.start.value},
              val: 'http://216.178.47.89/api/1.0/tag/7/event/start?ad=8'},
            8: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.trackingevents.start.value},
              val: 'http://216.178.47.89/api/1.0/tag/8/event/start'},
            9: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.trackingevents.fullscreen.value},
              val: 'http://216.178.47.89/api/1.0/tag/9/event/fullscreen'},
            20: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.trackingevents.firstquartile.value},
              val: 'http://216.178.47.89/api/1.0/tag/20/event/firstQuartile'},
            21: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.trackingevents.pause.value},
              val: 'http://216.178.47.89/api/1.0/tag/21/event/pause'},
            37: {cb: function(obj) {return obj.vast.ad},
              val: undefined},  //empty xml test file
            38: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.mediafiles.mediafile.id},
                val: 'f0d1ad4d-54c9-4d10-b485-7a88996c68b2'},
            71: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative[0].linear.mediafiles.mediafile.delivery},
                val: 'progressive'},
            77: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative[0].linear.mediafiles.mediafile.type},
                val: 'video/mp4'},
            82: {cb: function(obj) { return obj.vast.ad.inline.creatives.creative[0].linear.duration;},
                val: 22},
          };
          var request = $.ajax({
            type: 'GET',
            url: 'http://216.178.47.89/api/1.0/tags?type=vast',
            dataType: 'json'
          })
          .done(function(vastJsonTags) {
            expectEachTag(vastJsonTags, testCases, done);
          })
          .fail(function(jqXHR, textstatus, err) {
            console.log(jqXHR, textstatus, err);
          });
        });
      });

      describe('Get list of example VPAID ads', function() {
        var vpaidList;
        var testCases = {
          13: [{cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.trackingevents.fullscreen.value;},
            val: 'http://216.178.47.89/api/1.0/tag/13/event/fullscreen'},
            {cb: function(obj) {return obj.vast.ad.id;},
            val: "ad-13"}],
          14: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.mediafiles.mediafile.scalable},
            val: 'true'},
          15: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.mediafiles.mediafile.value},
            val: 'http://216.178.47.89/files/ivory.js?v=0.2'},
          16: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.trackingevents.mute.value},
            val: 'http://216.178.47.89/api/1.0/tag/16/event/mute'},
          17: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.mediafiles.mediafile.value},
            val: 'http://216.178.47.89/files/selector.js'},
          18: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.mediafiles.mediafile.value},
            val: 'http://216.178.47.89/files/eventDebug.js'},
          19: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.mediafiles.mediafile.value},
            val: 'http://216.178.47.89/files/tweetBar.js'},
          45: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.videoclicks.clickthrough},
            val: 'http://216.178.47.89/api/1.0/tag/45/clickthrough'},
          60: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.mediafiles.mediafile.apiframework},
            val: 'VPAID'},
          63: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.mediafiles.mediafile.apiframework},
            val: 'VPAID'},  // 60 and 63 appear to be duplicate files
          64: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.AdParameters.split(',').length},
            val: 9},
          65: {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.mediafiles.mediafile.value},
            val: 'http://216.178.47.89/files/telemetry_test.js'},
          66: [{cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.AdParameters.xmlEncoded},
            val: 'true'},
            {cb: function(obj) {return obj.vast.ad.inline.creatives.creative.linear.AdParameters.spikeDom},
            val: 'spc--cehhehbdjebfnegfeeeghhne--vast2js.telemetryverification.net'}]
        };
        it('should have the stated number of VPAID tags', function(done) {
          vpaidList = $.ajax({
            type: 'GET',
            url: 'http://216.178.47.89/api/1.0/tags?cat=vpaid'
          });
          vpaidList.then(function(vpaidJsonTags){
            console.log(vpaidJsonTags);
            expect(vpaidJsonTags.tags.length).to.equal(vpaidJsonTags.count);
            done();
          })
          .fail(function(jqXHR, textstatus, err) {
            console.log(jqXHR, textstatus, err);
            done();
          });
        });
        it('should have json lookups that correspond to correct xml parameters and values', function(done) {
          vpaidList.then(function(vpaidJsonTags) {
            expectEachTag(vpaidJsonTags, testCases, done);
          })
          .fail(function(jqXHR, textstatus, err) {
            console.log(jqXHR, textstatus, err);
          });
        });
      });

    });

})();