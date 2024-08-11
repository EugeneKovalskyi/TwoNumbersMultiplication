# App parts:
  - Main
  - Minor

## Main part
  - Random expression
  - Answer field, limited by 6-digits number
  - Check button

## Minor part
  - Settings
  - Log
  - Stopwatch
  - 
### Settings
> Closing settings window applies range changes
> Opening settings window dispatch stop-event
  - Range selection, limited by 3-digits number in each field
  - Stopwatch toggle (hide/show)
  - Autocheck toggle (on/off). "On"-selection hide Check-button.
    Autocheck has 3 delay length:
      1. Slow === 700 ms
      2. Medium === 500 ms (default)
      3. Quick === 300 ms
  - Sound toggle for correct and wrong answer (on/off)
  - Theme toggle (dark/light)
  - 
### Log
  - History of answers in table, that have next fields:
    - correct/wrong answer sign
    - math expression
    - time, that was spend on answer
    - received result from user
    - expected (correct) result
  - Button for clean answers history
  - 
### Stopwatch
  - Count seconds and centi-seconds, which were spend on each answer. 
  - After each answer starts from 0. 
  - Click on stopwatch stops time and breaks possibility to answer.
