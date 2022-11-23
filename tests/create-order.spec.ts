import { test, expect } from '@playwright/test'

test('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {
    /* go to the webpage */
    await page.goto('http://127.0.0.1:8096/customer/alice')
    
    /* creating an order with just one randomly chosen ingredient */
    let texts = await page.getByText(/Add/).allInnerTexts() //["Add Pineapple", "Add Apple", "Add Banana"]
    const ingredients: string[] = []
    for(var text of texts){
        ingredients.push(text.split(' ')[1])
    } // ingredient = ["Pineapple", "Apple", "Banana"]
    const randomSeed = Math.floor(3 * (Math.random())) //
    await page.click(`text='Add ${ingredients[randomSeed]}'`)

    /* click Save and Submit */
    await page.click(`text='Save'`)
    await page.click(`text='Submit'`)
    /* go to operator page and check if we have such ingredients */
    await page.goto('http://127.0.0.1:8096/operator/jim')
    await expect(page.locator("tbody tr:last-child")).toContainText(`${ingredients[randomSeed]}`)
});