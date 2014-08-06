    var xmlDoc;
    var xmlloaded = false;
    initLibrary();

    function initLibrary()
    {
        importXML("../tests/xmlExampleFiles/basicVastExample.xml");
    }

    function importXML(xmlfile)
    {
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
    }