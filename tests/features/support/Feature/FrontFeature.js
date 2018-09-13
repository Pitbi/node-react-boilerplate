const { By } = require('selenium-webdriver')

class FrontFeature {
  constructor(world) {
    this.world = world
    this.driver = world.driver
  }

  async visit(url) {
    await this.driver.get(`${this.world.CONFIG.frontHost}${url}`)
  }

  async wait(delay = 1000) {
    return new Promise((resolve) => 
      setTimeout(() => resolve(), delay)
    )
  }

  async waitUrlChange(delay = 3000) {
    const currentUrl = await this.driver.getCurrentUrl()
    await this.driver.wait(async () => {
      const url = await this.driver.getCurrentUrl()
      return url !== currentUrl
    }, delay)
  }

  async waitElement(selector, timeout = 2000) {
    let data
    await this.driver.wait(async () => {
      try {
        data = await this.driver.findElement(selector)
        return true
      } catch (err) {
        return false
      }
    }, timeout)
    return data
  }

  async elementExist(selector) {
    try {
      await this.driver.findElement(selector)
      return true
    } catch (err) {
      return false
    }
  }

  testIdSelector(testId) {
    return By.css(`[data-testid='${testId}']`)
  }

  async findByTestId(testId) {
    return await this.driver.findElement(this.testIdSelector(testId))
  }

  async waitElementByTestId(testId) {
    return await this.waitElement(this.testIdSelector(testId))
  }

  async elementExistByTestId(testId) {
    return await this.elementExist(this.testIdSelector(testId))
  }
}

module.exports = FrontFeature