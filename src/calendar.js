/*
 Copyright (c) 2014, NASREDDINE SKANDRANI
 All rights reserved.
 
 Redistribution and use in source and binary forms, with 
 or without modification, are permitted provided that the 
 following conditions are met:
 * Redistributions of source code must retain the above 
 copyright notice, this list of conditions and the 
 following disclaimer.
 * Redistributions in binary form must reproduce the above
 copyright notice, this list of conditions and the 
 following disclaimer in the documentation and/or other 
 materials provided with the distribution.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND 
 CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED 
 WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR 
 PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT 
 HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, 
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var calendar = calendar || {};

function formatNumberWith2Decimals(input) {
  var output = parseInt(input, 10); // parse
  output += ""; // convert to string
  while (output.length<2) output = "0"+output; // prepend leading zeros
  return output;
}

function removeClass(el, removeClassName){
    var elClass = el.className;
    while(elClass.indexOf(removeClassName) != -1) {
        elClass = elClass.replace(removeClassName, '');
        elClass = elClass.trim();
    }
    el.className = elClass;
}

function addClass(el, className){
    el.className += (" " + className);
}

calendar.init = function() {

  calendar.root = document.getElementById("calendar");
  calendar.root.innerHTML = "<div id='container'></div>";
  calendar.container = document.getElementById("container");
  calendar.container.style.background = "black";
  calendar.row = {};
  var id = "row"+0;
  calendar.container.innerHTML += "<div id="+id+"></div>";
  calendar.row[i] = document.getElementById(id);

  calendar.dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  for (var j = 0; j < 7; ++j) {
    calendar.row[i].innerHTML += "<span class='dayName cell'><span>"+calendar.dayNames[j]+"</span></span>";
  }
  for (var i = 1; i < 7; ++i) {
    var id = "row"+i;
    calendar.container.innerHTML += "<div id="+id+"></div>";
    calendar.row[i] = document.getElementById(id);
    for (var j = 0; j < 7; ++j) {
      calendar.row[i].innerHTML += "<span class='dayNumber cell'><span>"+j+"</span></span>";
    }
  }

  calendar.elements = document.querySelectorAll("#row" + 0 + " .cell");
  for (var j = 0; j < calendar.elements.length; j = j + 2) {
    addClass(calendar.elements[j], "heading-color-1");
  }
  for (var j = 1; j < calendar.elements.length; j = j + 2) {
    addClass(calendar.elements[j], "heading-color-2");
  }

  for (var i = 1; i < 7; i = i + 2) { 
    calendar.elements = document.querySelectorAll("#row" + i + " .cell");
    for (var j = 0; j < calendar.elements.length; j = j + 2) {
      addClass(calendar.elements[j], "days-color-1");
    }
    for (var j = 1; j < calendar.elements.length; j = j + 2) {
      addClass(calendar.elements[j], "days-color-2");
    }
    calendar.elements = document.querySelectorAll("#row" + (i+1) + " .cell");
    for (var j = 0; j < calendar.elements.length; j = j + 2) {
      addClass(calendar.elements[j], "days-color-2");
    }
    for (var j = 1; j < calendar.elements.length; j = j + 2) {
      addClass(calendar.elements[j], "days-color-1");
    }
  }

  calendar.currentDate = moment();
  calendar.theCurrentDayElement = null;

  //Fill calender with correct current month days strings
  var firstDayOfCurrentMonth = moment().startOf('month');
  calendar.currentSelectedMonth = moment().startOf('month');
  calendar.fillCalendarWithMonth(firstDayOfCurrentMonth, calendar.currentDate, calendar.currentSelectedMonth);
}

calendar.fillCalendarWithMonth = function(_firstDayOfMonth, _currentDate, _currentSelectedMonth)
{
  var firstDayOfMonthIndex = _firstDayOfMonth.day();
  var offset = (firstDayOfMonthIndex == 0) ? 7 : firstDayOfMonthIndex;
  var tempFirstDayOfMonth = moment(_firstDayOfMonth);
  var currentDateCustomCalendar = tempFirstDayOfMonth.subtract("days",offset);
  
  for (var i = 1; i < 7; i++) //row index
  {
    calendar.elements = document.querySelectorAll("#row" + i + " .cell");
    calendar.contents = document.querySelectorAll("#row" + i + " .cell span");
    for (var j = 0; j < calendar.elements.length; ++j) {
      calendar.contents[j].innerHTML = parseInt(currentDateCustomCalendar.format('DD'),10);
      
      calendar.elements[j].setAttribute("date", 
        JSON.stringify({
          day:    calendar.getDayFromDate(currentDateCustomCalendar),
          month:  calendar.getMonthFromDate(currentDateCustomCalendar), 
          year:   calendar.getYearFromDate(currentDateCustomCalendar)
        })
      );
      
      //if not current month so change opacity
      if (parseInt(currentDateCustomCalendar.format('MM'),10) != parseInt(_currentSelectedMonth.format('MM'),10)) {
        calendar.elements[j].style.opacity = "0.7";
      }
      else {
        calendar.elements[j].style.opacity = "1";
      }
    
      if (_currentDate.format("MM-DD-YYYY") == currentDateCustomCalendar.format("MM-DD-YYYY")) {
        addClass(calendar.elements[j], "currentDay");
        calendar.theCurrentDayElement = calendar.elements[j];
      }
      else {
        removeClass(calendar.elements[j], "currentDay");
      }

      //go to next day
      currentDateCustomCalendar = currentDateCustomCalendar.add("days",1);
    }
  }
}

calendar.nextMonth = function() {
  calendar.currentSelectedMonth = calendar.currentSelectedMonth.add("month",1);
  var firstDayOfNextMonth = calendar.currentSelectedMonth.startOf('month');
  calendar.fillCalendarWithMonth(firstDayOfNextMonth, calendar.currentDate, calendar.currentSelectedMonth);
}

calendar.previousMonth = function() {
  calendar.currentSelectedMonth = calendar.currentSelectedMonth.subtract("month",1);
  var firstDayOfNextMonth = calendar.currentSelectedMonth.startOf('month');
  calendar.fillCalendarWithMonth(firstDayOfNextMonth, calendar.currentDate, calendar.currentSelectedMonth);
}

calendar.getDayFromDate = function(_date) {
  return parseInt(_date.format('DD'),10);
}

calendar.getMonthFromDate = function(_date) {
  return parseInt(_date.format('MM'),10);
}

calendar.getYearFromDate = function(_date) {
  return parseInt(_date.format('YYYY'),10);
}

//.day .month .year to access data
calendar.getDateFromCellElement = function(_element) {
  return JSON.parse(_element.getAttribute("date"))
}

//INIT the calendar
calendar.init();

