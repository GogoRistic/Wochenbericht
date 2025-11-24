// navigation.js

//this ensures that all elements we want to access exist in the DOM
document.addEventListener("DOMContentLoaded", () => {

    // get references to the navigation links by their IDs
    // these are the buttons/links that the user clicks to go to previous, next, or home pages
    const prevLink = document.getElementById("prevLink"); // "Previous" button
    const nextLink = document.getElementById("nextLink"); // "Next" button
    const homeLink = document.getElementById("homeLink"); // "Home" button

    // function to check if a page exists
    // this uses an HTTP HEAD request to see if the URL is valid
    // HEAD requests are like GET requests but they only fetch the headers (not the whole page)
    // this to avoids the unnecessary loading of pages just to check if they exist
    const pageExists = async (url) => {
        try {
            // Fetch the URL with method "HEAD"
            const response = await fetch(url, { method: "HEAD" });
            // return true if the server responds
            return response.ok;
        } catch {
            // if there is any error return false
            return false;
        }
    };

    // extract the current file name from the URL
    // window.location.pathname gives the full path ("/folder/kw_46_2025.html")
    // split("/") breaks it into parts, pop() takes the last part (the actual file name)
    const currentFile = window.location.pathname.split("/").pop(); // for example "kw_46_2025.html"

    // use a RegEx to extract the week number (kw) and the year from the file name
    // (\d{1,2}) matches 1 or 2 numbers (week number)
    // (\d{4}) matches exactly 4 numbers (year)
    const kwMatch = currentFile.match(/kw_(\d{1,2})_(\d{4})\.html/);

    // function to find the first and last week dynamically
    // this is useful for the index page so that "Next" and "Previous" buttons know the valid range
    const findFirstAndLastWeek = async (year) => {
        let first = null; // will hold the first available week
        let last = null;  // will hold the last available week

        // loop through all possible week numbers from 1 to 53
        // note: most years have 52 weeks, but some rare years can have 53 weeks(all 4 years is 53 weeks)
        for (let kw = 1; kw <= 53; kw++) {
            const url = `kw_${kw}_${year}.html`; // construct the page URL
            if (await pageExists(url)) { // check if the page exists
                if (!first) first = kw; // the first existing page becomes "first"
                last = kw; // keep updating last to the most recent existing page
            }
        }

        // return an object with the first and last existing week numbers
        return { first, last };
    };

    // check if the current page is a week report (matches "kw_XX_YYYY.html")
    if (kwMatch) {
        // parse the current week and year as integers
        let currentKW = parseInt(kwMatch[1]); // current week
        let currentYear = parseInt(kwMatch[2]); // current year

        // calculate previous and next week numbers
        const prevKW = currentKW - 1;
        const nextKW = currentKW + 1;

        // construct URL's for previous and next week
        const prevURL = `kw_${prevKW}_${currentYear}.html`;
        const nextURL = `kw_${nextKW}_${currentYear}.html`;

        // add click listener for the "previous" button
        prevLink.addEventListener("click", async (e) => {
            e.preventDefault(); // prevent default link behavior
            if (await pageExists(prevURL)) { // if previous page exists
                window.location.href = prevURL; // navigate to it
            } else {
                window.location.href = "index.html"; // otherwise go to homepage
            }
        });

        // add click listener for the "Next" button
        nextLink.addEventListener("click", async (e) => {
            e.preventDefault(); // prevent default link behavior
            if (await pageExists(nextURL)) { // if next page exists
                window.location.href = nextURL; // navigate to it
            } else {
                window.location.href = "index.html"; // otherwise go to homepage
            }
        });

    } else if (currentFile === "index.html" || currentFile === "") {
        // if we are on the homepage (index.html or empty path)
        const year = 2025; // or automatically detect year if needed

        // find the first and last week dynamically
        findFirstAndLastWeek(year).then(({ first, last }) => {
            // setup "Previous" button to go to the last available week
            if (prevLink) {
                prevLink.addEventListener("click", () => {
                    if (last) window.location.href = `kw_${last}_${year}.html`;
                });
            }

            // setup "Next" button to go to the first available week
            if (nextLink) {
                nextLink.addEventListener("click", () => {
                    if (first) window.location.href = `kw_${first}_${year}.html`;
                });
            }
        });

    } else {
        // if we are on any other page that is not a week report or index
        // simply send both Previous and Next buttons back to the homepage
        prevLink.addEventListener("click", () => window.location.href = "index.html");
        nextLink.addEventListener("click", () => window.location.href = "index.html");
    }

    // add click listener for the "Home" button
    // always goes to the homepage
    homeLink.addEventListener("click", (e) => {
        e.preventDefault(); // prevent default link behavior
        window.location.href = "index.html"; // go to homepage
    });
});
