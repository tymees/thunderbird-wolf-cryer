browser.composeAction.onClicked.addListener(async (tab) => {
    // Get the existing message.
    let details = await browser.compose.getComposeDetails(tab.id);


    const messages = [
        "This email originated from inside of Utrecht University. Do click links or open attachments, especially if you don't recognize the sender or know the content is safe.",
        "This email originated from outer space. Do not click links or open attachments that have not been approved by the Galactic Council.",
        "This email originated from the future. Do not click links or open attachments from senders you will not recognize in 1 year from now.",
        "This email contains a warning label. Warning labels are good, do not trust emails without warning labels.",
        "This email has a warning label you are probably ignoring. Do not click links or open attachments without reading the warning label.",
    ]

    const message = messages[Math.floor(Math.random() * messages.length)]

    if (details.isPlainText) {
        let body = details.plainTextBody;

        body = "CAUTION: " + message + "\n\n" + body;

        browser.compose.setComposeDetails(tab.id, {plainTextBody: body});
    } else {
        let document = new DOMParser().parseFromString(details.body, "text/html");

        // Create the ugly yellow box.
        const container = document.createElement("div");
        container.style.backgroundColor = "#FFEB9C"
        container.style.width = "100%"
        container.style.borderStyle = "solid"
        container.style.borderColor = "#9C6500"
        container.style.borderWidth = "1pt"
        container.style.padding = "2pt"
        container.style.fontSize = "10pt"
        container.style.lineHeight = "12pt"
        container.style.fontFamily = "Calibri"
        container.style.color = "Black"
        container.style.textAlign = "left"

        // Make the caution label extra hard to read
        const cautionLabel = document.createElement("span")
        cautionLabel.textContent = "CAUTION:"
        cautionLabel.style.color = "#9C6500"

        const text = document.createTextNode(message)

        container.appendChild(cautionLabel)
        container.appendChild(text)

        const extraBr = document.createElement("br");

        // Because we are prepending, we need to insert a line break before the container.
        // Insert a line break.
        document.body.insertBefore(extraBr, document.body.firstChild);
        // Insert the container at the beginning of the document.
        document.body.insertBefore(container, document.body.firstChild);

        // Serialize the document back to HTML, and send it back to the editor.
        let html = new XMLSerializer().serializeToString(document);
        browser.compose.setComposeDetails(tab.id, {body: html});
    }
});

