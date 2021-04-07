document.addEventListener('DOMContentLoaded', function(){
    document.getElementById("city_button").addEventListener("click", addCity);
    document.getElementById("dellete_button").addEventListener("click", delCity);
    document.getElementById("send_button").addEventListener("click", send);}, false);

var errors = "";
// This function checks the integrity of the data
function validation(x, y, z){
    errors = "";
    if(!x)
        errors += "<p>city location is missing</p>";
    if(!y)
        errors += "<p>longitude is missing</p>";
    else if(y<-90 || y>90 || check(y))
        errors += "<p>longitude is not valid</p>";
    if(!z)
        errors += "<p>latitude is missing</p>";
    else if(z<-180 || z>180 || check(z))
        errors += "<p>latitude is not valid</p>";
    if(errors)
        return false;
    return true;
}

// This function checks whether the numbers obtained are float
function check(num){
    for(let i=0; i<num.length; i++)
        if(num[i]==".")
            return false;
    return true;
}

// This function adds the city data to the array
function addCity() {
    //city is an array that holds the city names
    city = [];
    //errors is an array that holds the errors
    errors = "";
    val1 = document.getElementById("massageg0").value;
    val2 = document.getElementById("massageg1").value;
    val3 = document.getElementById("massageg2").value;
    if (!validation(val1, val2, val3)) {
        document.getElementById("error").style.display = "block";
        document.getElementById("errors").innerHTML = errors;
    } else {
        city[document.getElementById("massageg0").value] = [document.getElementById("massageg1").value, document.getElementById("massageg2").value];
        addRow();
        document.getElementById("errors").innerHTML = "";
        document.getElementById("error").style.display = "none";
    }
}

// This function adds the city data to the page view
function addRow(){
    let list = document.getElementById("add");
    let location = document.getElementById("massageg0").value;
    let labelValue = document.createElement('label');
    labelValue.innerHTML = "&emsp;"+location;
    labelValue.id = location + 1;
    let inputValue = document.createElement('input');
    inputValue.type = "radio";
    inputValue.name = "radioButton";
    inputValue.id = location;
    list.appendChild(inputValue);
    list.appendChild(labelValue);
    list.appendChild((document.createElement("br")));
    document.getElementById("table").style.display="block";
}

// This function deletes the city data from the page view
function delCity(){
    let list = document.getElementById("add");
    for(i=0; i<list.childNodes.length; i++){
        if(list.childNodes[i].checked) {
            list.removeChild(list.childNodes[i]);
            list.removeChild(list.childNodes[i]);
            list.removeChild(list.childNodes[i]);
        }
    }
    if(!list.childNodes.length)
        document.getElementById("table").style.display="none";
}

// This function checks if the wind is more than 1
function checkWin(win){
    if(win <= 1)
        return "";
    return win;
}

// This function displays the data of the requested city
function send(){
    let list = document.getElementsByName("radioButton");
    for(i=0; i<list.length; i++){
        if(list[i].checked) {
            var nameCity = list[i].id;
            var long = city[list[i].id][0];
            var lat = city[list[i].id][1];
        }
    }
    fetch('http://www.7timer.info/bin/api.pl?lon='+long+'&lat='+lat+'&product=civillight&output=json')
        .then(function (response)
            {
                if (response.status !== 200)
                {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function (data)
                {
                    var html = "";
                    document.getElementById("Name_Of_City").innerHTML = nameCity;
                    let day = 1;
                    document.getElementById("show_the_weather").style.display = "block";
                    for(item of data.dataseries)
                    {
                        var curDate = item.date.toString();
                        curDate = curDate.slice(0, 4)+"/"+curDate.slice(4, 6)+"/"+curDate.slice(6, 9);
                        html = '<th scope="row">'+'Day'+day+'</th>'+
                            "<td>"+curDate+"</td>"+
                            "<td>"+item.weather+"</td>"+
                            "<td>"+item.temp2m.max+"</td>"+
                            "<td>"+item.temp2m.min+"</td>"+
                            "<td>"+checkWin(item.wind10m_max)+"</td>";
                        document.getElementById("Day"+day++).innerHTML = html;
                    }
                });
            }
        )
        .catch(function (err) {
            document.getElementById("errorServer").style.display = "block";
            document.getElementById("err").innerHTML = "Error server";
        });

    fetch('http://www.7timer.info/bin/astro.php?lon='+long+'&lat='+lat+'&ac=0&lang=en&unit=metric&output=internal&tzshift=0')
        .then(function (response)
            {
                if (response.status !== 200) {
                    console.log('The Status Code of problem is: ' + response.status);
                    return;
                }
                response.blob()
                    .then(function(myBlob) {
                        var objectURL = URL.createObjectURL(myBlob);
                        document.querySelector("img").src = objectURL;
                        document.getElementById("image").style.display = "block";
                    });
            }
        )
        .catch(function (err) {
            document.querySelector("img").src = "my_image.jpg";
            document.getElementById("image").style.display = "block";
            console.log('Fetch Error:', err);
        });
}
