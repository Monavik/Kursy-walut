function httpGetAsync(theUrl, callback)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    }
    function loadCurrentExchangeRates()
    {
        var currentExhangeRatesTableBody = document.getElementById("currentExhangeRates").getElementsByTagName('tbody')[0];
        httpGetAsync('https://api.exchangeratesapi.io/latest?base=PLN', response =>{
            var currentExhangeRatesData = JSON.parse(response)['rates'];
            for(singleExchangeRate in currentExhangeRatesData){

                currentExhangeRow = currentExhangeRatesTableBody.insertRow();
                currentExhangeRow.setAttribute("data-ccy", singleExchangeRate);
                currentExhangeRow.onclick = function(){
                    return loadHistoricalExchangeRates(this.getAttribute("data-ccy"))
                }

                currentExhangeRowCCY = currentExhangeRow.insertCell();
                currentExhangeRowCCYText = document.createTextNode(singleExchangeRate);
                currentExhangeRowCCY.appendChild(currentExhangeRowCCYText);

                currentExhangeRowValue = currentExhangeRow.insertCell();
                currentExhangeRowValueText = document.createTextNode(1/currentExhangeRatesData[singleExchangeRate]); //Zamiana PLNXXX na XXXPLN
                currentExhangeRowValue.appendChild(currentExhangeRowValueText);


            }
        })
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    function loadHistoricalExchangeRates(ccy)
    {
        console.log(ccy)
        var endDate = new Date()
        var startDate = new Date()
        do
        {
            startDate.setDate(startDate.getDate() -1);
        }       
        while(startDate.getDay()!=1)
        var url = 'https://api.exchangeratesapi.io/history?start_at='+formatDate(startDate)+'&end_at='+formatDate(endDate)+'&symbols='+ccy+'&base=PLN'

        var historicalExhangeRatesTable = document.getElementById("historicalExhangeRates")
        var historicalExhangeRatesTableBody = historicalExhangeRatesTable.getElementsByTagName('tbody')[0];
        historicalExhangeRatesTable.removeChild(historicalExhangeRatesTableBody);
        historicalExhangeRatesTableBody = historicalExhangeRatesTable.createTBody()

        httpGetAsync(url, response =>{
            var historicalExhangeRatesData = JSON.parse(response)['rates'];
            for(singleExchangeRate in historicalExhangeRatesData){

                historicalExhangeRow =  historicalExhangeRatesTableBody.insertRow();

                historicalExhangeRowDate = historicalExhangeRow.insertCell();
                historicalExhangeRowDateText = document.createTextNode(singleExchangeRate);
                historicalExhangeRowDate.appendChild(historicalExhangeRowDateText);

                var firstKeys = Object.keys(historicalExhangeRatesData[singleExchangeRate])
                historicalExhangeRowValue = historicalExhangeRow.insertCell();
                historicalExhangeRowValueText = document.createTextNode(1/historicalExhangeRatesData[singleExchangeRate][firstKeys]); //Zamiana PLNXXX na XXXPLN
                historicalExhangeRowValue.appendChild(historicalExhangeRowValueText);

            }
        })
        document.getElementById("ccySymbol").innerHTML = ccy;
        document.getElementById("historicalExhangeRatesDiv").style.display = 'block';
    }


    function onLoad() 
    {
        loadCurrentExchangeRates()
    }
    window.onload = onLoad;
