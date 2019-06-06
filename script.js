$(document).ready(function(){
  //Url personalizzato
  var url_base = 'http://157.230.17.132:4013/sales';

  stampa_chart();

  $('.container').on('click', 'button', function() {
      var impiegato = $('.nomi').val();
      var data = $('.mesi').val();
      var data_select = moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY');

      var new_val =  $('.importo').val();

      input_dati(url_base, impiegato, data_select, new_val);
      stampa_chart(url_base);
    });
  //Creo una funzione che mi crea il grafico con i dati in get con una chiamata ajax
  function stampa_chart(){
    $('.myChart1').html('');
    $('.myChart2').html('');
    var mesi = {
      'January': 0,
      'February': 0,
      'March': 0,
      'April': 0,
      'May': 0,
      'June': 0,
      'July': 0,
      'August': 0,
      'September': 0,
      'October': 0,
      'November': 0,
      'December': 0
    }

    $.ajax({
      'url': url_base,
      'method': 'GET',
      'success': function(response){

        var vendite_mese = {}

        for (var i = 0; i < response.length; i++) {
          var data = response[i].date;
          var importo = response[i].amount;
          var data_changed = data.slice(3, 5);
          var mesi_trovati = Object.keys(vendite_mese);

          if (!mesi_trovati.includes(data_changed)) {
            vendite_mese[data_changed] = importo;
          } else {
            vendite_mese[data_changed] += importo;
          }
        }

        var label_mesi = Object.keys(mesi);
        var dati_mesi = Object.values(importo);

        for (var mese in mesi) {
          if (mese == moment_data)
          mesi[mese] += importo;
        }

        mese_singolo = [];
        for (var i = 0; i < label_mesi.length; i++) {
          var moment_data = moment([2017, 0, 31]).month(label_mesi[i]).format('MMMM');
          mese_singolo.push(moment_data);
        }

        //CHART-1: LINE
        var chart1 = document.getElementById('myChart1').getContext('2d');

        var myLineChart1 = new Chart(chart1, {
            'type': 'line',
            'data': {
                'labels': label_mesi,
                'datasets': [{
                    'label': 'Fatturato mensile',
                    'data': dati_mesi,
                    'backgroundColor': [
                        'rgba(0, 245, 216, 0.2)',
                    ],
                    'borderColor': [
                        'rgba(0, 245, 216, 1)',
                    ],
                    'borderWidth': 1
                }
              ]
            },
            'options': {
                'scales': {
                    'yAxes': [{
                        'ticks': {
                            'beginAtZero': true
                        }
                    }]
                }
            }
        });
//------------------------------------------------------------------------------
        //Faccio un ciclo for, per il chart2
        var vendite = {};

        for (var i = 0; i < response.length; i++) {
          var vendita = response[i];
          var venditore = response[i].salesman;
          var importo = response[i].amount;
          var venditori_inseriti = Object.keys(vendite);

          if (!venditori_inseriti.includes(venditore)) {
            vendite[venditore] = importo;
          } else {
            vendite[venditore] += importo;
          }
        }

        //Appendo i nomi degli impiegati nella select
        for (var i = 0; i < venditori_inseriti.length; i++) {
          var impiegato = venditori_inseriti[i];
          $('.nomi').append($('<option value="'+ impiegato +'">'+ impiegato +'</option>'));
        }

        //Appendo i mesi nella select
        for (var i = 0; i < label_mesi.length; i++) {
          var mese = label_mesi[i];
          $('.mesi').append($('<option value="'+ mese +'">'+ mese +'</option>'));
        }

        //Preparo le percentuali di vendita per ogni venditore
        for(var venditore in vendite){
          var totale_vendite = vendite[venditore];
          var percentuale = importo * 100 / totale_vendite;
          //Aggiorno il valore delle vendite con la percentuale
          vendite[venditore] = percentuale.toFixed(1);
        }
        var label_venditore = Object.keys(vendite);
        var label_vendite_per_venditore = Object.values(vendite);

        //CHART-2: PIE
        var chart2 = document.getElementById('myChart2').getContext('2d');

        var myPieChart = new Chart(chart2, {
          'type': 'pie',
            'data': {
                'labels': label_venditore,
                'datasets': [{
                    'data': label_vendite_per_venditore,
                    'text': 'Vendite per venditore',
                    'backgroundColor': [
                      'rgba(92, 235, 108, 0.2)',
                      'rgba(92, 194, 235, 0.2)',
                      'rgba(235, 92, 92, 0.2)',
                      'rgba(120, 92, 235, 0.2)',
                    ],
                    'borderWidth': 2
                }]
            },
            'options': {
              'scales': {
                'yAxes': [{
                  'ticks': {
                    'beginAtZero': true
                  }
                }]
              }
            }
        });
      },
      'error': function(){
        alert('errore')
      }
    });
  }


function input_dati(url, nome, giorno, valore) {
  $.ajax({
    'url': url,
    'method': 'POST',
    'data': {
      'salesman': nome,
      'date': giorno,
      'amount': valore
    },
    'success': function (response) {

    },
    'error': function () {
      alert('errore');
    }
  })
}
});
