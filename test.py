import time
import requests


from selenium import webdriver

from bs4 import BeautifulSoup


url = "https://reportdata.mytestsite.com/transactionSearch.jsp"
driver = webdriver.Chrome("C:/Users/Administrator/Downloads/chromedriver_win32/chromedriver.exe")



driver.get("https://app.anchorprotocol.com/")

print("waiting 60 seconds")


time.sleep(60)
soup = BeautifulSoup(driver.page_source, 'html.parser')
text = soup.prettify()

urlc = 'https://aqueous-fjord-71548.herokuapp.com/anchor/'+text[text.find("amount")+727:text.find("amount")+742]




resp = requests.get(urlc)

print(resp.status_code)




driver.quit()
