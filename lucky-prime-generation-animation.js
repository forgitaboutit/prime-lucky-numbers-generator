/*
 * Execute this function only after page has been loaded.
 *
 * Having variables/functions declared inside of this function
 * keeps them out of the global scope.
 *
 * Here is a guide to understanding scope in JavaScript:
 * https://css-tricks.com/javascript-scope-closures/
*/
$(function() {

  // Show prime/lucky numbers up to but not including this default value
  var exclusiveUpperLimitDefaultValue = 1000;
  var exclusiveUpperLimitMaximumValue = 100000;

  $('#exclusiveUpperLimitMaximumValue').html(exclusiveUpperLimitMaximumValue);
  var exclusiveUpperLimitInput = $('input[name=exclusiveUpperLimit]');
  exclusiveUpperLimitInput.val(exclusiveUpperLimitDefaultValue);

  // Milliseconds between rounds of elimination
  var msBetweenPasses = 1000;

  // Milliseconds it takes to fade out eliminated numbers
  var msForFadeout = 1000;

  // Text colors
  var primeNumbersColor = '#39FF14';
  var luckyNumbersColor = 'aqua';
  var luckyPrimeNumbersColor = 'white';

  // To handle restarts by users
  var restartFlag = false;
  var primeNumberGeneratorHalted = false;
  var primeNumberGeneratorFinished = false;
  var luckyNumberGeneratorHalted = false;
  var luckyNumberGeneratorFinished = false;

  var controlPanelMessageCtr = $('#controlPanelMessage');
  var listGenerationRestartButton = $('#listGenerationRestartButton');

  function prepareForRestart(primeOrLucky) {

    console.log('prepareForRestart: ' + primeOrLucky);

    // Update status
    var statusText = 'restarting...';
    console.log(primeOrLucky + ' number generator status: ' + statusText);
    $('#' + primeOrLucky + 'NumbersGeneratorStatus').html('status: ' + statusText);

    // Set new exclusive upper limit
    var newExclusiveUpperLimit = parseInt(exclusiveUpperLimitInput.val());
    $('#' + primeOrLucky + 'ExclusiveUpperLimit').html(newExclusiveUpperLimit);

    $('#' + primeOrLucky + 'NumbersGeneratorTitlePrefix').html('generating list of ' + primeOrLucky + ' numbers less than ');

    $('.' + primeOrLucky + 'NumberCandidate').css('color', luckyPrimeNumbersColor);

    var candidates = $('.' + primeOrLucky + 'NumberCandidate');

    var ctr;

    if(newExclusiveUpperLimit < candidates.length) {

      for(ctr = newExclusiveUpperLimit; ctr <= candidates.length; ctr++) {
        $('#' + primeOrLucky + 'NumberCandidate-' + ctr).remove();
      }
    }

    if(newExclusiveUpperLimit > candidates.length) {

      var candidatesContainer = $('#' + primeOrLucky + 'NumberCandidatesContainer');
      var candidate;

      for(ctr = candidates.length + 1; ctr < newExclusiveUpperLimit; ctr++) {

        candidate = $('<div>' + ctr + '</div>');
        candidate.prop('id', primeOrLucky + 'NumberCandidate-' + ctr);
        candidate.addClass(primeOrLucky + 'NumberCandidate');
        candidate.data('visible', true);
        candidatesContainer.append(candidate);
      }
    }

    $('#primeNumbersGeneratorContainer').css('height', $('#luckyNumbersGeneratorContainer').css('height'));

    candidates.data('visible', true);
    candidates.css('opacity', '1');
    candidates.css('visibility', 'visible')

    // Set dots to original color
    $('#' + primeOrLucky + 'NumbersEllipsesDot1').css('color', primeOrLucky == 'prime' ? primeNumbersColor : luckyNumbersColor);
    $('#' + primeOrLucky + 'NumbersEllipsesDot2').css('color', primeOrLucky == 'prime' ? primeNumbersColor : luckyNumbersColor);
    $('#' + primeOrLucky + 'NumbersEllipsesDot3').css('color', primeOrLucky == 'prime' ? primeNumbersColor : luckyNumbersColor);
    $('.' + primeOrLucky + 'NumbersEllipsesDot').show();
  }

  function clickedRestartButton(restartButton) {

    var newExclusiveUpperLimit = parseInt(exclusiveUpperLimitInput.val());

    if(newExclusiveUpperLimit <= 2) {
      controlPanelMessageCtr.html('Exclusive upper limit must be greater than 2.');
      return false;
    }
    else if(newExclusiveUpperLimit == exclusiveUpperLimitInput.data('lastExclusiveUpperLimit')) {
      controlPanelMessageCtr.html('Exclusive upper limit is already ' + newExclusiveUpperLimit + '.');
      return false;
    }
    else {
      console.log('new exclusive upper limit: ' + newExclusiveUpperLimit);
      exclusiveUpperLimitInput.data('lastExclusiveUpperLimit', newExclusiveUpperLimit);
    }
    controlPanelMessageCtr.html('');

    // Disable restart button until restart is complete
    $(restartButton).prop('disabled', true);

    if(primeNumberGeneratorFinished && luckyNumberGeneratorFinished) {

      prepareForRestart('prime');
      prepareForRestart('lucky');

      primeNumberGeneratorFinished = false;
      luckyNumberGeneratorFinished = false;

      setTimeout(function() {

        filterListToPrimeNumbers();
        filterListToLuckyNumbers();
        $(restartButton).prop('disabled', false);

      }, 1000);
    }
    else {
      restartFlag = true;
    }
  }

  listGenerationRestartButton.bind('click', function() {
    clickedRestartButton(this);
  });

  function validateExclusiveUpperLimitInput(value) {

    if(value.match(/^[0-9]{0,6}$/) === null) {
      return false;
    }
    else if(value !== '' && parseInt(value) > exclusiveUpperLimitMaximumValue) {
      return false;
    }
    return true;
  }

  // See js/inputFilter.js
  setInputFilter(exclusiveUpperLimitInput[0], validateExclusiveUpperLimitInput);

  function addPrimeNumberCandidates() {

    var primeNumberCandidatesContainer = $('#primeNumberCandidatesContainer');
    var primeNumberCandidate;

    for(var ctr = 1; ctr < exclusiveUpperLimitInput.data('lastExclusiveUpperLimit'); ctr++) {

      primeNumberCandidate = $('<div>' + ctr + '</div>');
      primeNumberCandidate.prop('id', 'primeNumberCandidate-' + ctr);
      primeNumberCandidate.addClass('primeNumberCandidate');
      primeNumberCandidate.data('visible', true);
      primeNumberCandidatesContainer.append(primeNumberCandidate);
    }
  }

  function addLuckyNumberCandidates() {

    var luckyNumberCandidatesContainer = $('#luckyNumberCandidatesContainer');
    var luckyNumberCandidate;

    for(var c = 1; c < exclusiveUpperLimitInput.data('lastExclusiveUpperLimit'); c++) {

      luckyNumberCandidate = $('<div>' + c + '</div>');
      luckyNumberCandidate.prop('id', 'luckyNumberCandidate-' + c);
      luckyNumberCandidate.addClass('luckyNumberCandidate');
      luckyNumberCandidate.data('visible', true);
      luckyNumberCandidatesContainer.append(luckyNumberCandidate);
    }
  };

  // Highlights all numbers in common between sets
  function highlightLuckyPrimeIntersection() {

    var primeNumberCandidate, luckyNumberCandidate;

    for(var i = 1; i < exclusiveUpperLimitInput.data('lastExclusiveUpperLimit'); i++) {

      primeNumberCandidate = $('#primeNumberCandidate-' + i);
      luckyNumberCandidate = $('#luckyNumberCandidate-' + i);

      if(primeNumberCandidate.data('visible') == true &&
         luckyNumberCandidate.data('visible') == true) {

        primeNumberCandidate.css('color', luckyPrimeNumbersColor);
        luckyNumberCandidate.css('color', luckyPrimeNumbersColor);
      }
    }
  };

  function getSuffix(number) {

    if(number > 10 && number < 20) {
      return 'th';
    }

    if(number % 10 == 1) {
      return 'st';
    }
    else if (number % 10 == 2) {
      return 'nd';
    }
    else if(number % 10 == 3) {
      return 'rd';
    }
    else {
      return 'th';
    }
  };

  function filterListToPrimeNumbers() {

    // Declare variables and assign values for prime number generator
    var primeNumbersGeneratorTitle = $('#primeNumbersGeneratorTitle');
    primeNumbersGeneratorTitle.css('color', primeNumbersColor);
    var primeNumbersGeneratorTitlePrefix = $('#primeNumbersGeneratorTitlePrefix');
    var primeNumbersEllipsesDot1 = $('#primeNumbersEllipsesDot1');
    var primeNumbersEllipsesDot2 = $('#primeNumbersEllipsesDot2');
    var primeNumbersEllipsesDot3 = $('#primeNumbersEllipsesDot3');
    var primeNumbersGeneratorStatus = $('#primeNumbersGeneratorStatus');
    primeNumbersGeneratorStatus.css('color', primeNumbersColor);
    var primeNumberCandidates = $('.primeNumberCandidate');
    var squareRootOfSizeOfList = Math.sqrt(exclusiveUpperLimitInput.data('lastExclusiveUpperLimit') - 1);

    // Use these to animate ellipses during list generation
    var ellipsesHighlightedDot = 1;

    var divisor = 2;

    // Execute this function every msBetweenPasses milliseconds
    var primeNumbersIntervalID = setInterval(function() {

      if(restartFlag === false) {

        var statusText = 'hiding every multiple of ' + divisor;
        console.log('prime number generator status: ' + statusText);
        primeNumbersGeneratorStatus.html('status: ' + statusText);

        // Highlight one dot the opposite color
        primeNumbersEllipsesDot1.css('color', ellipsesHighlightedDot == 1 ? luckyNumbersColor : primeNumbersColor);
        primeNumbersEllipsesDot2.css('color', ellipsesHighlightedDot == 2 ? luckyNumbersColor : primeNumbersColor);
        primeNumbersEllipsesDot3.css('color', ellipsesHighlightedDot == 3 ? luckyNumbersColor : primeNumbersColor);

        // Advance highlighted dot number (1, 2, 3, 1, 2, 3, 1...)
        ellipsesHighlightedDot = (ellipsesHighlightedDot % 3) + 1;

        // Hide all candidates divisible by the current divisor
        primeNumberCandidates.each(function() {

          var candidate = parseInt($(this).html());

          // Ignore numbers that have already been eliminated
          if($(this).data('visible') == true) {

            if(candidate % divisor == 0 && candidate != divisor) {

              var slf = $(this);
              slf.data('visible', false);

              slf.fadeTo(msForFadeout, 0, function() {

                // Restart sets 'visible' to true so only hide if still false
                if(slf.data('visible') == false) {
                  slf.css('visibility', 'hidden');
                }
                else {
                  slf.css('opacity', '1');
                }
              });
            }
          }
        });

        // Advance divisor to next integer
        divisor++;

        /*
          If potential divisor has already been eliminated from list
          then there's no need to use it as a divisor (e.g. all even
          numbers after first round of elimination).
        */
        while($('#primeNumberCandidate-' + divisor).data('visible') == false) {
          divisor++;
        }

        /*
          If potential divisor is greater than the square root of the
          original size of the list then there's no need to process any further.
        */
        if(divisor > squareRootOfSizeOfList) {

          clearInterval(primeNumbersIntervalID);
          primeNumberGeneratorFinished = true;

          $('.primeNumbersEllipsesDot').hide();

          setTimeout(function() {

            primeNumbersGeneratorTitlePrefix.html('prime numbers less than ');

            primeNumbersGeneratorStatus.html('');
            $('#primeNumbersGeneratorContainer').css('height', $('#luckyNumbersGeneratorContainer').css('height'));

            primeNumberCandidates.css('color', primeNumbersColor);

            statusText = 'finished...no need to hide multiples of any number beyond the square root of the original size of the list ' +
                         '(divisor=' + divisor + ', originalSize=' + (exclusiveUpperLimitInput.data('lastExclusiveUpperLimit') - 1) +
                         ', squareRoot=' + squareRootOfSizeOfList + ')';

            console.log('prime number generator status: ' + statusText);

          }, msForFadeout);
        }
      }
      else {

        // Prevent another iteration from happening
        clearInterval(primeNumbersIntervalID);
        primeNumberGeneratorHalted = true;

        prepareForRestart('prime');

        if(luckyNumberGeneratorHalted) {

          console.log('lucky number generator was halted...restarting from prime number generator function...');

          restartFlag = false;
          primeNumberGeneratorHalted = false;
          luckyNumberGeneratorHalted = false;

          setTimeout(function() {

            filterListToPrimeNumbers();
            filterListToLuckyNumbers();
            listGenerationRestartButton.prop('disabled', false);

          }, 1000);
        }
      }
    }, msBetweenPasses);
  }

  function filterListToLuckyNumbers() {

    // Declare variables and assign values for lucky number generator
    var luckyNumberCandidates = $('.luckyNumberCandidate');
    var luckyNumbersGeneratorTitle = $('#luckyNumbersGeneratorTitle');
    luckyNumbersGeneratorTitle.css('color', luckyNumbersColor);
    var luckyNumbersGeneratorTitlePrefix = $('#luckyNumbersGeneratorTitlePrefix');
    var luckyNumbersEllipsesDot1 = $('#luckyNumbersEllipsesDot1');
    var luckyNumbersEllipsesDot2 = $('#luckyNumbersEllipsesDot2');
    var luckyNumbersEllipsesDot3 = $('#luckyNumbersEllipsesDot3');
    var luckyNumbersGeneratorStatus = $('#luckyNumbersGeneratorStatus');
    luckyNumbersGeneratorStatus.css('color', luckyNumbersColor);
    var numValuesRemainingInList = exclusiveUpperLimitInput.data('lastExclusiveUpperLimit') - 1;

    // Use these to animate ellipses during list generation
    var ellipsesHighlightedDot = 1;

    // to hide every nth number
    var n = 2;

    // to take the value of the mth number after 1 in the list to get next n value
    var m = 1;

    // to count to m
    var o;

    var position;

    // Schedule this function to repeat every msBetweenPasses milliseconds
    var luckyNumbersIntervalID = setInterval(function() {

      if(restartFlag === false) {

        position = 1;

        var statusText = 'hiding every ' + n + getSuffix(n) + ' number with ' + numValuesRemainingInList + ' values remaining in list';
        luckyNumbersGeneratorStatus.html('status: ' + statusText);
        console.log('lucky number generator status: ' + statusText);

        // Highlight one dot the opposite color
        luckyNumbersEllipsesDot1.css('color', ellipsesHighlightedDot == 1 ? primeNumbersColor : luckyNumbersColor);
        luckyNumbersEllipsesDot2.css('color', ellipsesHighlightedDot == 2 ? primeNumbersColor : luckyNumbersColor);
        luckyNumbersEllipsesDot3.css('color', ellipsesHighlightedDot == 3 ? primeNumbersColor : luckyNumbersColor);

        // Advance highlighted dot number (1, 2, 3, 1, 2, 3, 1...)
        ellipsesHighlightedDot = (ellipsesHighlightedDot % 3) + 1;

        // Hide every nth number remaining in the list
        luckyNumberCandidates.each(function() {

          // Ignore numbers that have already been eliminated
          if($(this).data('visible') == true) {

            if(position++ % n == 0) {

              var slf = $(this);
              slf.data('visible', false);

              slf.fadeTo(msForFadeout, 0, function() {

                // Restart sets 'visible' to true so only hide if still false
                if(slf.data('visible') == false) {
                  slf.css('visibility', 'hidden');
                }
                else {
                  slf.css('opacity', '1');
                }
              });

              numValuesRemainingInList--;
            }
          }
        });

        // to count down from m to get next n value
        o = m;

        // Determine next value for n
        luckyNumberCandidates.each(function() {

          // Ignore 1 and numbers that have already been eliminated
          if($(this).html() != '1' && $(this).data('visible') == true) {

            if(o-- == 1) {

              // Store new n
              n = parseInt($(this).html());

              // Advance m
              m++;

              // Stop looping
              return false;
            }
          }
        });

        /*
          If n is greater than the number of values remaining in the list
          then there's no need to process any further.
        */
        if(n > numValuesRemainingInList) {

          clearInterval(luckyNumbersIntervalID);
          luckyNumberGeneratorFinished = true;

          $('.luckyNumbersEllipsesDot').hide();

          setTimeout(function() {

            luckyNumbersGeneratorTitlePrefix.html('lucky numbers less than ');

            luckyNumbersGeneratorStatus.html('');
            $('#primeNumbersGeneratorContainer').css('height', $('#luckyNumbersGeneratorContainer').css('height'));

            luckyNumberCandidates.css('color', luckyNumbersColor);

            statusText = 'finished...no need to hide every nth number when n exceeds the number of values remaining in the list ' +
                         '(n=' + n + ', numValuesRemaining=' + numValuesRemainingInList + ')';

            console.log('lucky number generator status: ' + statusText);

            setTimeout(function() {

              console.log('highlighting lucky/prime intersection ' + luckyPrimeNumbersColor + '...');

              highlightLuckyPrimeIntersection();

            }, msForFadeout);

          }, msForFadeout);

        }

      }
      else {

        // Prevent another iteration from happening
        clearInterval(luckyNumbersIntervalID);

        prepareForRestart('lucky');

        luckyNumberGeneratorHalted = true;

        if(primeNumberGeneratorHalted || primeNumberGeneratorFinished) {

          if(primeNumberGeneratorFinished) {
            prepareForRestart('prime');
          }

          console.log('prime number generator was ' +
                      (primeNumberGeneratorHalted ? 'halted' : 'finished') +
                      '...restarting from lucky number generator function...');

          restartFlag = false;
          primeNumberGeneratorHalted = false;
          luckyNumberGeneratorHalted = false;
          primeNumberGeneratorFinished = false;

          setTimeout(function() {

            filterListToPrimeNumbers();
            filterListToLuckyNumbers();
            listGenerationRestartButton.prop('disabled', false);

          }, 1000);
        }
      }
    }, msBetweenPasses);
  }

  // Set exclusive upper limit in title text
  $('#primeExclusiveUpperLimit').html(exclusiveUpperLimitInput.val());
  $('#luckyExclusiveUpperLimit').html(exclusiveUpperLimitInput.val());
  exclusiveUpperLimitInput.data('lastExclusiveUpperLimit', exclusiveUpperLimitInput.val());

  // Generate HTML container for each number and append to main containers
  addPrimeNumberCandidates();
  addLuckyNumberCandidates();

  // Fade in content
  $('#luckyPrimeGeneratorMainContainer').fadeIn(1000, function() {
    filterListToPrimeNumbers();
    filterListToLuckyNumbers();
  });

});
