import time


from selenium import webdriver

from bs4 import BeautifulSoup

# Establish chrome driver and go to report site URL
url = "https://reportdata.mytestsite.com/transactionSearch.jsp"
driver = webdriver.Chrome()



driver.get("https://app.anchorprotocol.com/")

print("waiting 10 seconds")


time.sleep(10)
soup = BeautifulSoup(driver.page_source, 'html.parser')
text = soup.prettify()

print(text[text.find("amount")+62:text.find("amount")+78])

driver.quit()