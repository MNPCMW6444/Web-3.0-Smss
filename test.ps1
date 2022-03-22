While ($true)

 { 
   python "C:\Users\Administrator\Desktop\test.py"
   C:\Users\Administrator\Desktop\curl.exe "https://aqueous-fjord-71548.herokuapp.com/getBorrowableMims"

   start-sleep -seconds 300

 }

