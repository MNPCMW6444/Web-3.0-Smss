import time
import requests


from selenium import webdriver

from bs4 import BeautifulSoup


url = "https://reportdata.mytestsite.com/transactionSearch.jsp"
driver = webdriver.Chrome("/Library/Frameworks/Python.framework/Versions/3.10/bin/chromedriver")


driver.get("https://app.bean.money/")

print("waiting 60 seconds")


#time.sleep(60)
soup = BeautifulSoup(driver.page_source, 'html.parser')
text = soup.prettify()

print = text[text.find("$-")+2:text.find("$")+10].partition('\n')[0]

urlc = 'https://neuronbica-admin.herokuapp.com/'+print




resp = requests.get(urlc)

print(resp.status_code)




driver.quit()
