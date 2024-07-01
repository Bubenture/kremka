document.addEventListener("DOMContentLoaded", function() {
    fetch('https://script.google.com/macros/s/AKfycbzkkKL6sSuc23oBw6JR50DH5m9ZgcDTkJ4FDMCUVGS47nRr5q5FOSR_qt5M2omS8_Hk3w/exec') 
        .then(response => response.json())
        .then(data => {
            var displayThree = document.querySelector('.table .table-container');
            var html = '<table>';

            html += '<tr><th>Дата и время</th><td><img src="img/candy.png" style="max-height: 2vw; max-width: 2vw;"></td></tr>';


            data.forEach(row => {
                html += '<tr>';
                row.forEach(cell => {
                    html += '<td>' + cell + '</td>';
                });
                html += '</tr>';
            });
            html += '</table>';
            displayThree.innerHTML = html;
            document.querySelector('.loading-image').style.display = 'none';
            document.querySelector('.display.three').style.display = 'none';
            displayThree.style.display = 'flex';
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.querySelector('.loading-image').src = 'img/candy.png'; 
        });
});