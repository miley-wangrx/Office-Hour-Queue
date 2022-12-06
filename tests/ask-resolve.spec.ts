import { test, expect } from '@playwright/test'

test('homepage has Playwright in title and get started link linking to the intro page', async ({ page }) => {
    
    /* --- Test: student ask a question --- */
    /* 1. go to the student's webpage */
    await page.goto('http://127.0.0.1:8096/signup')
    await page.click(`text='Sign In / Sign Up'`)
    await page.fill('#username','harry.potter@duke.edu')
    await page.fill('#password','dec')
    await page.click(`text='Sign In'`)
    await page.click(`text='Submit'`)
    /* 2. go to the staff's webpage to validate */
    await page.goto('http://127.0.0.1:8096/staff/6386ec459ce7a8f1b56a177c')

    /* --- Test: staff mark all questions as resolved --- */
    /* 1. go to the staff's webpage */
    await page.click(`text='Mark as Solved'`)
    /* 2. go to the staff's webpage one more time to validate */
    await page.goto('http://127.0.0.1:8096/staff/6386ec459ce7a8f1b56a177c')
});