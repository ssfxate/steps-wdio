import { Then } from '@cucumber/cucumber';
import { conditionWait, conditionValidations } from './conditionWait';
import {
    getValue,
    getElement,
    getConditionWait
} from './transformers';
import { getValidation } from '@qavajs/validation';
import { isImmediate, checkIfCollection } from './utils';

/**
 * Verify element condition
 * @param {string} alias - element to wait condition
 * @param {string} condition - wait condition
 * @example I expect 'Header' to be visible
 * @example I expect 'Loading' not to be present
 * @example I expect 'Search Bar > Submit Button' to be clickable
 */
Then('I expect {string} {wdioConditionWait}', async function (alias: string, condition: string) {
    const element = await getElement(alias, { immediate: isImmediate(condition) }) as WebdriverIO.Element;
    const wait = getConditionWait(condition);
    await wait(element, config.browser.timeout.page);
});

/**
 * Verify that text of element satisfies condition
 * @param {string} alias - element to get text
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect text of '#1 of Search Results' equals to 'google'
 * @example I expect text of '#2 of Search Results' does not contain 'yandex'
 */
Then(
    'I expect text of {string} {wdioValidation} {string}',
    async function (alias: string, validationType: string, value: any) {
        const expectedValue = await getValue(value);
        const element = await getElement(alias) as WebdriverIO.Element;
        const validation = getValidation(validationType);
        await conditionWait(element, conditionValidations.VISIBLE, config.browser.timeout.visible);
        const elementText: string = await element.getText();
        this.log(`AR: ${elementText}`);
        this.log(`ER: ${expectedValue}`);
        validation(elementText, expectedValue);
    }
);

/**
 * Verify that number of element in collection satisfies condition
 * @param {string} alias - collection to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect number of elements in 'Search Results' collection to be equal '50'
 * @example I expect number of elements in 'Search Results' collection to be above '49'
 * @example I expect number of elements in 'Search Results' collection to be below '51'
 */
Then(
    'I expect number of elements in {string} collection {wdioValidation} {string}',
    async function (alias: string, validationType: string, value: string) {
        const expectedValue = await getValue(value);
        const collection = await getElement(alias) as WebdriverIO.Element[];
        const validation = getValidation(validationType);
        this.log(`AR: ${collection.length}`);
        this.log(`ER: ${expectedValue}`);
        validation(collection.length, expectedValue);
    }
);

/**
 * Verify that property of element satisfies condition
 * @param {string} property - property to verify
 * @param {string} alias - element to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect 'value' property of 'Search Input' to be equal 'text'
 * @example I expect 'innerHTML' property of 'Label' to contain '<b>'
 */
Then(
    'I expect {string} property of {string} {wdioValidation} {string}',
    async function (property: string, alias: string, validationType: string, value: string) {
        const propertyName = await getValue(property);
        const expectedValue = await getValue(value);
        const element = await getElement(alias) as WebdriverIO.Element;
        const validation = getValidation(validationType);
        await conditionWait(element, conditionValidations.PRESENT, config.browser.timeout.present);
        const actualValue = await element.getProperty(propertyName);
        this.log(`AR: ${actualValue}`);
        this.log(`ER: ${expectedValue}`);
        validation(actualValue, expectedValue);
    }
);

/**
 * Verify that attribute of element satisfies condition
 * @param {string} attribute - attribute to verify
 * @param {string} alias - element to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect 'href' attribute of 'Home Link' to contain '/home'
 */
Then(
    'I expect {string} attribute of {string} {wdioValidation} {string}',
    async function (attribute: string, alias: string, validationType: string, value: string) {
        const attributeName = await getValue(attribute);
        const expectedValue = await getValue(value);
        const element = await getElement(alias) as WebdriverIO.Element;
        const validation = getValidation(validationType);
        await conditionWait(element, conditionValidations.PRESENT, config.browser.timeout.present);
        const actualValue = await element.getAttribute(attributeName);
        this.log(`AR: ${actualValue}`);
        this.log(`ER: ${expectedValue}`);
        validation(actualValue, expectedValue);
    }
);

/**
 * Verify that current url satisfies condition
 * @param {string} validationType - validation
 * @param {string} expected - expected value
 * @example I expect current url contains 'wikipedia'
 * @example I expect current url equals 'https://wikipedia.org'
 */
Then(
    'I expect current url {wdioValidation} {string}',
    async function (validationType: string, expected: string) {
        const validation = getValidation(validationType);
        const expectedUrl = await getValue(expected);
        const actualUrl = await browser.getUrl();
        this.log(`AR: ${actualUrl}`);
        this.log(`ER: ${expectedUrl}`);
        validation(actualUrl, expectedUrl);
    }
);

/**
 * Verify that page title satisfies condition
 * @param {string} validationType - validation
 * @param {string} expected - expected value
 * @example I expect page title equals 'Wikipedia'
 */
Then(
    'I expect page title {wdioValidation} {string}',
    async function (validationType: string, expected: string) {
        const validation = getValidation(validationType);
        const expectedTitle = await getValue(expected);
        const actualTitle = await browser.getTitle();
        this.log(`AR: ${actualTitle}`);
        this.log(`ER: ${expectedTitle}`);
        validation(actualTitle, expectedTitle);
    }
);

/**
 * Verify that all texts in collection satisfy condition
 * @param {string} alias - collection to get texts
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect text of every element in 'Search Results' collection equals to 'google'
 * @example I expect text of every element in 'Search Results' collection does not contain 'yandex'
 */
Then(
    'I expect text of every element in {string} collection {wdioValidation} {string}',
    async function (alias: string, validationType: string, value: string) {
        const expectedValue = await getValue(value);
        const collection = await getElement(alias) as WebdriverIO.Element[];
        checkIfCollection(alias, collection);
        const validation = getValidation(validationType);
        for (const element of collection) {
            await conditionWait(await element, conditionValidations.PRESENT, config.browser.timeout.present);
            const elementText: string = await (await element).getText();
            validation(elementText, expectedValue);
        }
    }
);

/**
 * Verify collection condition
 * @param {string} alias - collection to wait condition
 * @param {string} condition - wait condition
 * @example I expect every element in 'Header > Links' collection to be visible
 * @example I expect every element in 'Loading Bars' collection not to be present
 */
Then('I expect every element in {string} collection {wdioConditionWait}', async function (alias: string, condition: string) {
    const collection = await getElement(alias) as WebdriverIO.Element[];
    checkIfCollection(alias, collection);
    const wait = getConditionWait(condition);
    const conditionWait = (element: WebdriverIO.Element) => wait(element, config.browser.timeout.page);
    await Promise.all(collection.map(conditionWait))
});

/**
 * Verify that all particular attributes in collection satisfy condition
 * @param {string} alias - collection to get attrs
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect 'href' attribute of every element in 'Search Results' collection to contain 'google'
 */
Then(
    'I expect {string} attribute of every element in {string} collection {wdioValidation} {string}',
    async function (attribute: string, alias: string, validationType: string, value: string) {
        const expectedValue = await getValue(value);
        const collection = await getElement(alias) as WebdriverIO.Element[];
        checkIfCollection(alias, collection);
        const validation = getValidation(validationType);
        for (const element of collection) {
            await conditionWait(await element, conditionValidations.PRESENT, config.browser.timeout.present);
            const value: string = await (await element).getAttribute(attribute);
            validation(value, expectedValue);
        }
    }
);

/**
 * Verify that all particular properties in collection satisfy condition
 * @param {string} alias - collection to get props
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect 'href' property of every element in 'Search Results' collection to contain 'google'
 */
Then(
    'I expect {string} property of every element in {string} collection {wdioValidation} {string}',
    async function (property: string, alias: string, validationType: string, value: string) {
        const expectedValue = await getValue(value);
        const collection = await getElement(alias) as WebdriverIO.Element[];
        checkIfCollection(alias, collection);
        const validation = getValidation(validationType);
        for (const element of collection) {
            await conditionWait(await element, conditionValidations.PRESENT, config.browser.timeout.present);
            const value: string = await (await element).getProperty(property) as string;
            validation(value, expectedValue);
        }
    }
);

/**
 * Verify that css property of element satisfies condition
 * @param {string} property - property to verify
 * @param {string} alias - element to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect 'color' css property of 'Search Input' to be equal 'rgb(42, 42, 42)'
 * @example I expect 'font-family' css property of 'Label' to contain 'Fira'
 */
Then(
    'I expect {string} css property of {string} {wdioValidation} {string}',
    async function (property: string, alias: string, validationType: string, value: string) {
        const propertyName = await getValue(property);
        const expectedValue = await getValue(value);
        const element = await getElement(alias) as WebdriverIO.Element;
        const validation = getValidation(validationType);
        await conditionWait(element, conditionValidations.PRESENT, config.browser.timeout.present);
        const actualValue = await browser.execute(function (element: WebdriverIO.Element, propertyName: string) {
            return getComputedStyle(element as any).getPropertyValue(propertyName)
        }, element as any, propertyName);
        this.log(`AR: ${actualValue}`);
        this.log(`ER: ${expectedValue}`);
        validation(actualValue, expectedValue);
    }
);

/**
 * Verify that text of an alert meets expectation
 * Should be used afterwards the step 'I wait for alert'
 * @param {string} validationType - validation
 * @param {string} value - expected text value
 * @example I expect text of alert does not contain 'coffee'
 */
Then('I expect text of alert {wdioValidation} {string}', async function (validationType: string, expectedValue: string) {
    const alertText = await browser.getAlertText();
    const expected = await getValue(expectedValue);
    const validation = getValidation(validationType);
    this.log(`AR: ${alertText}`);
    this.log(`ER: ${expected}`);
    validation(alertText, expected);
});
