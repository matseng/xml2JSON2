// adapted from: http://wpquestions.com/question/showChrono/id/8737

function xmlFileLoader(xmlfile)
  {
  var xmlDoc;
  var xmlloaded = false;
    try
    {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", xmlfile, false);
    }
    catch (Exception)
    {
        var ie = (typeof window.ActiveXObject != 'undefined');

        if (ie)
        {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            while(xmlDoc.readyState != 4) {};
            xmlDoc.load(xmlfile);
            xmlloaded = true;
        }
        else
        {
            xmlDoc = document.implementation.createDocument("", "", null);
            xmlDoc.load(xmlfile);
            xmlloaded = true;
        }
    }

    if (!xmlloaded)
    {
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.send("");
        xmlDoc = xmlhttp.responseXML;
        xmlloaded = true;
    }
    return xmlDoc;
  }
