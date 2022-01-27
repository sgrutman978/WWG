let allPriceData = new Map()
let allData = new Map()
let finalData = new Map()
var totalTotalHNT = 0.0;
var totalTotalDollars = 0.0;
let hotspots = new Map();
var counter = 0;
var errorCount = 0;

// console.log(hotspots.size);

    function turnOffButton(){
        document.getElementById("submitter").disabled = true;
        document.getElementById("infoTable").style.display = 'none';
    }

	function calculator(hotspots2, mode){
        allPriceData = new Map();
        // console.log(hotspots2);
        document.getElementById("infoTable").innerHTML = "";
        totalTotalDollars = 0;
        totalTotalHNT = 0;
        hotspots = hotspots2;
        counter = hotspots.size;
        // console.log(hotspots);
        // console.log("herbaloo");
        var startDate = new Date(document.getElementById("startDate").value);
        endDate = new Date(document.getElementById("endDate").value);
        startDate.setDate(startDate.getDate()-1);
        console.log(startDate);
        endDate.setDate(endDate.getDate()+2);
        console.log(endDate);
		$.getJSON('https://api.coingecko.com/api/v3/coins/helium/market_chart/range?vs_currency=usd&from=' + startDate.getTime()/1000 + '&to=' + endDate.getTime()/1000, function(data){
    		data.prices.forEach((element) => {
    			allPriceData.set(element[0], element[1]);
                // console.log(element[1]);
    		});
    		console.log(allPriceData);
    	}).done(function(data){
    		hotspots.forEach((value,key)=>{
				allData.set(key, []);
			});
			hotspots.forEach((value,key)=>{
				finalData.set(key, []);
			});
			hotspots.forEach((value,key)=>{
				runCursor(key, mode);
			});	
    	});
	}

	function runCursor(key, mode, cursor){
		$.getJSON('https://api.helium.io/v1/hotspots/' + key + '/rewards?max_time=' + document.getElementById("endDate").value + '&min_time=' + document.getElementById("startDate").value + (cursor ? '&cursor=' + cursor: ''), function(data) {
    	allData.set(key, allData.get(key).concat(data.data));
		// console.log(allData);
    	}).done(function(data){
    		if(data.cursor){
    			runCursor(key, mode, data.cursor);
    		}else{
    			finishUp(key, mode);
    			counter = counter - 1;
    			// console.log(counter);
    			if (counter == 0) {
    				console.log("Total HNT: " + totalTotalHNT);	
					console.log("Total $: " + totalTotalDollars);
                    document.getElementById("infoTable").innerHTML = document.getElementById("infoTable").innerHTML + 
                        "<tr><th>TOTAL</th><th>TOTAL</th><th>" + totalTotalHNT.toFixed(8) + " HNT</th><th>" + totalTotalDollars.toFixed(3) + "</th></tr>";
                    document.getElementById("infoTable").style.display = 'block';
                    document.getElementById("submitter").disabled = false;
					counter = hotspots.size;
                    if(mode == 1){
                        // alert("Done: " + errorCount + " redo's");
                        errorCount = 0;
                    }
				}
    		}
    	}).fail(function(){
    		console.log("Experienced an error when loading data for " + hotspots.get(key).lessor);
            errorCount++;
            runCursor(key, mode, cursor);
    	});
	}

	function finishUp(key, mode){
		var totalHNT = 0;
		var totalDollars = 0;
		allData.get(key).reverse().forEach((value2) => {
    				let bestTime = findBestPrice(new Date(value2.timestamp).getTime());
    				let hnt = value2.amount/100000000.000000;
    				totalHNT = totalHNT + hnt;
    				totalDollars = totalDollars + allPriceData.get(bestTime)*(hnt);

    				finalData.get(key).push({
    					'block': value2.block,
    					'iso_time': value2.timestamp,
    					'miner_unix_time': new Date(value2.timestamp).getTime(),
    					'coingecko_unix_time': bestTime,
    					'amount_HNT_token': hnt,
    					'amount_$': allPriceData.get(bestTime)*hnt,
    					'price': allPriceData.get(bestTime),
    					'hash': value2.hash
    				});
    				// console.log(new Date(value2.timestamp).getTime()/1000);
    				//construct new final object
    			});
					finalData.get(key).push({
    					'block': "Total",
    					'iso_time': "Total",
    					'miner_unix_time': "Total",
    					'coingecko_unix_time': "Total",
    					'amount_HNT_token': totalHNT,
    					'amount_$': totalDollars,
    					'price': "Total",
    					'hash': "Total"
    				});
                    // console.log(finalData);
    			// alert("final data");
                addToTable(key, mode);
    			// console.log(hotspots.get(key).lessor + " ... $" + finalData.get(key)[finalData.get(key).length - 1].amount_$ + " ... " + finalData.get(key)[finalData.get(key).length - 1].amount_HNT_token + "HNT"); // * 0.2);
    			// JSONToCSVConvertor(finalData.get(key), document.getElementById("startDate").value + " to " + document.getElementById("endDate").value + ": Gateway " + key, true);
				totalTotalDollars = totalTotalDollars + finalData.get(key)[finalData.get(key).length - 1].amount_$;
				totalTotalHNT = totalTotalHNT + finalData.get(key)[finalData.get(key).length - 1].amount_HNT_token;
	}

    function addToTable(key, mode){

        var mapMeh = new Map(finalData);
        mapMeh.forEach((value4, key4) => {
            if(value4.length < 1){
                mapMeh.delete(key4);
            }
        });
        const mapSort2 = new Map([...mapMeh.entries()].sort((a, b) => b[1][b[1].length - 1].amount_HNT_token - a[1][a[1].length - 1].amount_HNT_token));
        
        var currDoc = document.getElementById("infoTable");
        if(mode == 1){
            currDoc.innerHTML = "<tr><th>"+
                "Name</th><th>"+
                "Lessor</th><th>"+
                "HNT</th><th>"+
                "$ PURT</th><th>"+
                "Hash</th><th>"+
                "% (HNT)</th><th>"+
                "% ($)</th><th>"+
                "Cost (% of HNT)</th><th>"+
                "Cost (% of $)</th><th>"+
                "Cost ($ Fee)</th><th>"+
                "Profit</th><th>"+
                "Method</th><th>"+
                "Payment Meta</th></tr>";
        }else{
            currDoc.innerHTML = "<tr><th>Name</th><th>Lessor</th><th>HNT</th><th>$ PURT</th><th>Hash</th></tr>";
        }
        mapSort2.forEach((value3, key3) => {
            // console.log(key3);
            let lessor = hotspots.get(key3).lessor;
            let name = hotspots.get(key3).name;
            let pcDollar = hotspots.get(key3).pcDollar ?? 0;
            let pcHNT = hotspots.get(key3).pcHNT ?? 0;
            let fee = 0;
            if(hotspots.get(key3).fee > 0){
                fee = +(hotspots.get(key3).fee);
            }
            // console.log(fee+8);
            let paymentMeta = hotspots.get(key3).paymentMeta;
            let method = hotspots.get(key3).method;
            let dollars = mapSort2.get(key3)[mapSort2.get(key3).length - 1].amount_$;
            let hnt = mapSort2.get(key3)[mapSort2.get(key3).length - 1].amount_HNT_token;
            let costDollar = dollars*(pcDollar/100.00);
            let costHNT = hnt*(pcHNT/100.00);
            let costOfHNTinDollars = ((costHNT/hnt)*dollars);
            let profit = dollars - costDollar - costOfHNTinDollars - fee;

            // console.log("lksl");
            // console.log(mapSort2.get(key3));
            // console.log(mapSort2.get(key3)[mapSort2.get(key3).length - 1]);
  

            if(mode == 1){
                currDoc.innerHTML = currDoc.innerHTML + "<tr><th>" + 
                    name + "</th><th>" + 
                    lessor + "</th><th>" + 
                    hnt.toFixed(8) + " HNT</th><th>" + 
                "$"+dollars.toFixed(3) + "</th><th><a target=\"_blank\" href=\"https://explorer.helium.com/hotspots/"+key3+"\">" + 
                    key3.slice(0,8) + "...</a></th><th>" + 
                    (pcHNT > 0? pcHNT + "%": "") + "</th><th>" + 
                    (pcDollar > 0? pcDollar  + "%": "") + "</th><th>" + 
                    (costHNT > 0? costHNT.toFixed(8) + " HNT" : "") + "</th><th>" + 
                    (costDollar > 0? "$"+costDollar.toFixed(3) : "") + "</th><th>" + 
                    (fee > 0? "$"+fee.toFixed(3) : "") + "</th><th>" + 
                "$<span style=\"color:" + (profit.toFixed(3) > 0? "green" : "red") + "\">" + profit.toFixed(3) + "</span></th><th>" + 
                    method + "</th><th>" + 
                    paymentMeta + "</th></tr>";
            }else{
                currDoc.innerHTML = currDoc.innerHTML + "<tr><th>" + 
                    name + "</th><th>" + 
                    lessor + "</th><th>" + 
                    hnt.toFixed(8) + "</th><th>" + 
                    dollars.toFixed(3) + "</th><th><a target=\"_blank\" href=\"https://explorer.helium.com/hotspots/"+key3+"\">" + 
                    key3.slice(0,8) + "...</a></th><th></tr>";
            }
        });


    }

	function findBestPrice(num){
		var arr = Array.from(allPriceData.keys());
		// console.log("arr");
		// console.log(arr);
				var mid;
                var lo = 0;
                var hi = arr.length - 1;
                while (hi - lo > 1) {
                    mid = Math.floor ((lo + hi) / 2);
                    if (arr[mid] < num) {
                        lo = mid;
                    } else {
                        hi = mid;
                    }
                }
                if (num - arr[lo] <= arr[hi] - num) {
                    return arr[lo];
                }
                return arr[hi];
	}

	function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    
    var CSV = '';    
    //Set Report title in first row or line

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        
        //append Label row with line break
        CSV += row + '\r\n';
    }
    
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row = row.slice(0, -1);
        
        //add a line break after each row
        CSV += row + '\r';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    
    
    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");    
    link.href = uri;
    
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


