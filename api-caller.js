const fettch = require('node-fetch');
const Google = require('google-trends-api');
const Crypto = require('cryptocompare');

const currencyNames = {
    'BTC' : 'Bitcoin',
    'BCH' : 'Bitcoin Cash',
    'ETH' : 'Ethereum',
    'LTC' : 'Litecoin',
    'XRP' : 'Ripple'
};

module.exports.GetJsonData = function(currencyId, startUTC, endUTC){
    return new Promise(function(resolve, reject){
        console.log('checking start and end dates');
        if(startUTC > endUTC){
            var temp = startUTC;
            startUTC = endUTC;
            endUTC = temp;
        }


        GetGoogleData(currencyId, startUTC, endUTC)
            .then(function (results) {
                    console.log('got google data');
                    let promises = [];
                    for (var i in results) {
                        console.log('loading promises');
                        if(results[i] && results[i].date)
                            promises.push(GetCurrencyPrice(currencyId, results[i].date));
                    }

                    Promise.all(promises)
                        .then(function(prices){
                            console.log('got results');
                            for(var i in results){
                                console.log('price' + prices[i]);
                                results[i].price = prices[i];
                            }

                            resolve(results);
                        })
                        .then(function(results){
                            console.log('sending json' + results);
                            resolve(JSON.stringify(results));
                        })
                        .catch(function(err){
                            console.log('err ' + err);
                            reject(err);
                        });
            })
            .catch(function(err){
                    console.log('err ' + err);
                    console.log(err);
            });

    });
};

const GetGoogleData = function(currencyId, startUTC, endUTC){
    return new Promise(function(resolve, reject){
        if(!currencyId in currencyNames)
            reject("currencyId not recognized");
        const currencyName = currencyNames[currencyId];
        const startDate = new Date(startUTC);
        const endDate = new Date(endUTC);

        Google.interestOverTime({keyword: currencyName, startTime: startDate, endTime: endDate, granularTimeResolution: false},
            function(err, data){
                if(err)
                    reject(err);
                else{
                    var object = JSON.parse(data).default.timelineData;
                    object = object.map(x =>
                        ({date: x.time, formattedDate: x.formattedAxisTime, googleActivity: x.value[0]}));

                    object = GetEvenDistSubSet(object, 15);
                    resolve(object);
                }
            });
    });
};

const GetEvenDistSubSet =  function(data, subsetSize){
    var elements = [data[0]];
    var totalItems = data.length - 2;
    var interval = Math.floor(totalItems/(subsetSize - 2));
    for (var i = 1; i < subsetSize - 1; i++) {
        elements.push(data[i * interval]);
    }
    elements.push(data[data.length - 1]);
    return elements;
};

const GetCurrencyPrice = function(currencyId, time){
    return new Promise(function(resolve, reject){
        const dateObj = new Date(time * 1000);

        Crypto.priceHistorical(currencyId, 'USD', dateObj)
            .then(results => {
                resolve(results.USD);
            }).catch( err =>{
                reject(err);
            });
    });
};