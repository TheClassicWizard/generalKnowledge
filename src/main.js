var url = "https://opentdb.com/api.php?amount=1&type=multiple";
var url2 = "https://opentdb.com/api_token.php?command=request";
var url3 = "https://opentdb.com/api_token.php?command=reset";
var buttonRefresh = document.querySelector(".buttonRefresh");
var addOn = "&category="
var categoryArray = ["9", "10", "17", "18", "19", "20", "21", "22", "23", "24", "25", "30"];
var questionDiv = document.querySelectorAll(".questionCard");
var timerX = document.querySelector(".seconds");
var timerY = document.querySelector(".timer");
var question = document.querySelector(".question");
var option1 = document.querySelector("#option0");
var option2 = document.querySelector("#option1");
var option3 = document.querySelector("#option2");
var option4 = document.querySelector("#option3");
var difficulty = document.querySelector(".difficulty");
var category = document.querySelector(".category");
var correctAnswer = "option";
var random;
var seconds = 45;
var diff = "medium";
var totalQuestions = 0;
var correctAnswers = 0;
var clickedAnswer = -1;
var skippedQuestions = 0;
var wrongAnswers = 0;
var clockTimer;
var answer = 0;
var result = true;
var data = {};
var token = "&token=";

initiate();
function fetchToken(){
    fetch(url2)
    .then(function(request){
        if(!request.ok){
            throw Error(request.status);
        }
        return request.json();
    })
    .then(function(response){
        token = token + response.token;
        url = url + token;
    })
    .catch(function(error){
        alert(error);
    });
}

function resetToken(){
    url3 = url3 + token;
    token = "&token=";
    fetch(url3)
    .then(function(request){
        if(!request.ok){
            throw Error(request.status);
        }
        return request.json();
    })
    .then(function(response){
        token = token + response.token;
        url = url + token;
    })
    .catch(function(error){
        alert(error);
    });
}


function initiate(){
    result = false;
    fetchData();
    setTimeout(function(){
        questionDataInput();
        $(".questionContainer").slideDown(1000);
        totalQuestions++;
        clearInterval(clockTimer);
        seconds = 46;
        clockTimer = setInterval(timerFunction, 1000);
    }, 3000);
}

function correctAnswerF(){
    var str = "#option"+answer;
    $(str).css("background-color", "#138c0a");
    $(str).css("border-color", "#138c0a");
}

function wrongAnswerF(str){
    wrongAnswers++;
    $(str).css("background-color", "red");
    $(str).css("border-color", "red");
}


function questionDataInput(){
    $("#option0").removeAttr('style');
    $("#option1").removeAttr('style');
    $("#option2").removeAttr('style');
    $("#option3").removeAttr('style');
    dataInput();
}


function fetchData(){
    var typical = Math.random()*20;
    typical = Math.floor(typical);
    typical = typical % 12;
    url = url + addOn + categoryArray[typical];
    fetch(url)
    .then(function(request){
        if(!request.ok){
            throw Error(request.status);
        }
        return request.json();
    })
    .then(function(response){
        if(response.response_code == 4){
            resetToken();
            fetchData();
        }
        else
            data = response.results[0];
    })
    .catch(function(error){
        alert(error);
    });
}

function dataInput(){
    random = Math.random()*10;
    random = Math.floor(random);
    random = random%4;
    answer = random;
    category.innerHTML = data.category;
    question.innerHTML = "<h2>"+data.question+"</h2>";
    diff = data.difficulty;
    difficulty.innerHTML = diff;
    $(".difficulty").addClass(diff);
    $("#option"+random).html(data.correct_answer);
    random = (random+1)%4;
    $("#option"+random).html(data.incorrect_answers[0]);
    random = (random+1)%4;
    $("#option"+random).html(data.incorrect_answers[1]);
    random = (random+1)%4;
    $("#option"+random).html(data.incorrect_answers[2]);
}

$(".stopButton button").click(function(){
    clearInterval(clockTimer);
    if(seconds > 0){
        skippedQuestions = skippedQuestions + 31 - totalQuestions;
    }
    results();
})

function timerFunction(){
    seconds--;
    var x = "0";
    if(seconds>=10){
        timerX.innerHTML = seconds;
    }
    else{
        $(".timer").css("color", "red");
        timerX.innerHTML = x + seconds;
    }
    if(seconds==0){
        $(".timer").removeAttr("style");
        clearInterval(clockTimer);
        correctAnswerF();
        if(totalQuestions==30){
            skippedQuestions++;
        }
        if(totalQuestions < 30){
            skippedQuestions++;
            questionUpdate();
        }
        else{
            results();
        }
    }
}

function questionUpdate(){
    fetchData();
    $(".score").html(correctAnswers);
    clearInterval(clockTimer);
    setTimeout(function(){
        $(".questionContainer").slideUp(1000);
        setTimeout(function(){
            $(".difficulty").removeClass(diff);
            questionDataInput();
            $(".questionContainer").slideDown(1000);
            totalQuestions++;
            clearInterval(clockTimer);
            seconds = 46;
            clockTimer = setInterval(timerFunction, 1000);
        }, 1500);
    }, 3000);
}

buttonRefresh.addEventListener("click", function(){
    if(result === true){
        totalQuestions = 0;
        skippedQuestions = 0;
        correctAnswers = 0;
        wrongAnswers = 0;
        $(".score").html(correctAnswers);
        setTimeout(function(){
            $(".chart").slideUp(1000);
            setTimeout(function(){
                $(".refresh").html("Skip");
                $(".2").removeAttr("style");
                $(".1").css("display", "none");
            }, 1000);
            initiate();
        }, 3000);
    }
    clearInterval(clockTimer);
    correctAnswerF();
    if(totalQuestions==30){
        skippedQuestions++;
        results();
    }
    if(totalQuestions < 30){
        skippedQuestions++;
        questionUpdate();
    }
});

option1.addEventListener("click", function(){
    if(seconds>0){
        clickedAnswer =0;
        clearInterval(clockTimer);
        seconds = 0;
        correctAnswerF();
        if(answer==0){
            correctAnswers++;
        }
        else{
            wrongAnswerF("#option0");
        }
        if(totalQuestions < 30){
            questionUpdate();
        }
        else{
            results();
        }
    }
})

option2.addEventListener("click", function(){
    if(seconds>0){
        clickedAnswer =1;
        clearInterval(clockTimer);
        seconds = 0;
        correctAnswerF();
        if(answer==1){
            correctAnswers++;
        }
        else{
            wrongAnswerF("#option1");
        }
        if(totalQuestions < 30){
            questionUpdate();
        }
        else{
            results();
        }
    }
})

option3.addEventListener("click", function(){
    if(seconds>0){
        clickedAnswer =2;
        clearInterval(clockTimer);
        seconds = 0;
        correctAnswerF();
        if(answer==2){
            correctAnswers++;
        }
        else{
            wrongAnswerF("#option2");
        }
        if(totalQuestions < 30){
            questionUpdate();
        }
        else{
            results();
        }
    }
})

option4.addEventListener("click", function(){
    if(seconds>0){
        clickedAnswer =3;
        clearInterval(clockTimer);
        seconds = 0;
        correctAnswerF();
        if(answer==3){
            correctAnswers++;
        }
        else{
            wrongAnswerF("#option3");
        }
        if(totalQuestions < 30){
            questionUpdate();
        }
        else{
            results();
        }
    }
})


function results(){
    result = true;
    clearInterval(clockTimer);
    totalQuestions = 30;
    seconds = 0;
    timerX.innerHTML = "00";
    $(".score").html(correctAnswers);
    $(".unanswered").html(skippedQuestions);
    $(".wrongAnswers").html(wrongAnswers);
    clearInterval(clockTimer);
    showChart();
    setTimeout(function(){
        $(".questionContainer").slideUp(1000);
        setTimeout(function(){
            $(".refresh").html("Restart");
            $(".1").removeAttr("style");
            $(".2").css("display", "none");
            $(".chart").slideDown(1000);
        }, 1000);
    }, 3000);
}


function showChart(){
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {
  var data = google.visualization.arrayToDataTable([
        ['Questions', 'Count'],
        ['Correct Answers', correctAnswers],
        ['Unanswered', skippedQuestions],
        ['Wrong Answers', wrongAnswers]
    ]);
  var options = { 
      'width':400, 
      'height':400,
      'colors':["green", "orange", "red"],
      'is3D': true,
      'backgroundColor': { 'fill': "#000" },
      'legend': 'none'
    };

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
}
