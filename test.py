import time
import requests


from selenium import webdriver

from bs4 import BeautifulSoup


url = "https://reportdata.mytestsite.com/transactionSearch.jsp"
driver = webdriver.Chrome("C:/Users/Administrator/Desktop/chromedriver.exe")


driver.get("https://app.bean.money/")

print("waiting 50 seconds")


time.sleep(50)
soup = BeautifulSoup(driver.page_source, 'html.parser')
text = soup.prettify()

printa = text[text.find("$-")+2:text.find("$")+10].partition('\n')[0]
print2 = text[text.find("$")+1:text.find("$")+10].partition('\n')[0]

urlc = 'https://neuronbica-admin.herokuapp.com/'+printa
urlc = 'https://neuronbica-admin.herokuapp.com/'+print2




resp = requests.get(urlc)

#print(resp.status_code)




driver.quit()
