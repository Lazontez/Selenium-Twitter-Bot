const { Builder, By, Key, until } = require("selenium-webdriver");
require('dotenv').config()
const chrome = require("selenium-webdriver/chrome");

// WILL NEED TO ADD SIGN IN CREDENTIALS
const signInData = {
    'username': process.env.TWITTER_USER,
    'password': process.env.TWITTER_PASSWORD

}
// Twitter Does Not Let You Post A Message That Contains THE SAME VALUE AS SOMETHING YOU HAVE PREVIOUSLY POSTED
const details = {
    'message': 'Twitter Let Me Post Please Jba Hajnd JJdhd'
}
// NPM SELENIUM-WEBDRIVER OPTION SETTINS
const options = new chrome.Options({ args: ['--window-size=1280,800', '--auto-open-devtools-for-tabs',] })

// SETTING UP MEMORY FOR WEBDRIVERS PROXY *OPTIONAL(NOT NEEDED FOR CURRENT FUNCTIONALITY OF SCRIPT)
const proxy = require("selenium-webdriver/proxy");


// FUNCTION TO SIGN IN TO TWITTER - TAKE A PARAM THAT EXPECTS WEB DRIVER INSTANCE TO BE PASSED THROUGH IT
signInTwitter = (driver) => {

    
    // WAITS UNTIL 'USERNAME' INPUT FIELD IS FOUND
    driver.wait(until.elementLocated(By.name("session[username_or_email]"))).then(res => {
        console.log('Here')
        try {

            console.log("Starting attempt at filling out sign up page")
            driver.findElement(By.name("session[username_or_email]")).sendKeys(signInData.username).then(response => {
                console.log(response)
            })
            driver.findElement(By.name("session[password]")).sendKeys(signInData.password)
            driver.sleep('10')
            driver.findElement(By.xpath('/html/body/div/div/div/div[2]/main/div/div/div[2]/form/div/div[3]/div')).sendKeys(Key.ENTER)
        }
        // **NEED TO ADD CATCH VALIDATIONS
        catch {
            console.log('Caught an error')
        }
        finally {
            
        }

    })
}

// FUNCTION THAT WILL MAKE A POST TO TWITTER(SHOULD ALREADY BE SIGNED IN BEFORE RUNNING THIS)
makePost = (driver) => {

    // XPATH OF THE POST FIELD & POSTBTN
    const xPathOfPostField = '/html/body/div/div/div/div[2]/main/div/div/div/div/div/div[2]/div/div[2]/div[1]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div/div/div/div[1]/div/div/div/div[2]/div/div/div/div/span/br'
    const xPathOfPostBtn = '/html/body/div/div/div/div[2]/main/div/div/div/div/div/div[2]/div/div[2]/div[1]/div/div/div/div[2]/div[4]/div/div/div[2]/div[3]'
    // WAITS UNTIL THE POST FIELD IS LOCATED ON THE PAGE
    driver.wait(until.elementLocated(By.className('public-DraftStyleDefault-block'))).then(response => {
        console.log('HI')
        try {
            // FINDS THE POST FIELD AND ENTERS THE DETAILS.MESSAGE VARIABLE
            driver.findElement(By.xpath(xPathOfPostField)).sendKeys(details.message)
            // WAITS UNTIL THE POST BUTTON IS FOUND(MEANING IT IS ENABLE) AND CLICKS BUTTON
            driver.wait(until.elementLocated(By.xpath(xPathOfPostBtn))).then(response => {
                console.log('Post button has been found')
                driver.findElement(By.xpath(xPathOfPostBtn)).sendKeys(Key.ENTER).then((res, element) => {


                }).catch(err =>{
                    console.log("There was an error found when attempting to click post button")
                })
            })
        }
        finally {
            console.log('Finally')
        }
    })


}

// ASYNC FUNCTION THAT SETS UP WEB DRIVER INSTANCE AND CALLS ACTIONS
async function postToTwitter() {

    const driver = new Builder()
        .setChromeOptions({ options: options })
        .setProxy(proxy.manual({ http: '206.189.145.178:8080' }))
        .forBrowser("chrome").build();


    await driver.get("https://twitter.com/login");

    await signInTwitter(driver);
    await makePost(driver)

    // THIS FUNCTION IS ONLY SO THAT THE BROWSER DOES NOT CLOSE *NEED TO FIND A WAY TO MAKE BROWSER STAY OPEN WITHOUT THE USE OF THIS
    driver.wait(until.elementLocated(By.name('xPathOfPostBtn')))



}

postToTwitter()
