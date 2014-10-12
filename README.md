# Features:
  - continuous testing via grunt / mocha / chai
  - xml files are loaded via xmlFileLoader.js
  - xml files are parsed with customized xml2json.js parser

# Had to run "npm install" twice to avoid errors (not sure why)

# Run tests from the command prompt via:
  $ grunt test
  [or]
  $ grunt watch
  - NOTE: syntax errors in appSpec.js will be silent or misleading (e.g. 3 of 3 test will pass, when you expect 4 of 5 tests to pass). Run testRunner.html to debug your tests

# To view testRunner.html in the browser (useful for debugging):
  $ python -m SimpleHTTPServer
  - Within the browser, navigate to localhost:8000/tests/testRunner.html
  - add debugger statements in appSpec.js to set a breakpoint

# Vindico's Hawkeye API page for example VAST / VPAID data: http://216.178.47.89/api
