browser.composeAction.onClicked.addListener(async (tab) => {
    // Get the existing message.
    let details = await browser.compose.getComposeDetails(tab.id);
    let currentSender = details.from;

    // Remove the human readable name from the sender.
    if (currentSender.indexOf(">") !== -1) {
        currentSender = currentSender.substring(currentSender.indexOf("<") + 1, currentSender.indexOf(">"));
    }

    function createYellowWarning(message, plainOrHtml="html") {
        if (plainOrHtml === "plain") {
            return "CAUTION: " + message + "\n\n";
        }

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

        return container;
    }

    function createSenderWarning(message, plainOrHtml="html") {
        let randomUrl = chooseRandomItem(randomUrls);
        let modifiedMessage = message.replace("%SENDER%", currentSender);

        if (plainOrHtml === "html")
            randomUrl = "<a href='" + randomUrl + "'>" + randomUrl + "</a>";

        modifiedMessage = modifiedMessage.replace("%RANDOMURL%", randomUrl);

        if (plainOrHtml === "plain") {
            return "[" + message + " ]\n\n";
        }

        const container = document.createElement("table");
        container.style.cellpadding = "0";
        container.style.border = "0";
        container.style.cellspacing = "0";
        container.style.display = "table";
        container.style.width = "100%";
        container.style.tableLayout = "fixed";
        container.style.borderCollapse = "seperate";
        container.style.float = "none";
        container.width = "100%";
        container.cellspacing = "0";
        container.cellpadding = "0";
        container.border = "0";
        container.align = "left";

        const tbody = document.createElement("tbody");
        tbody.style.display = "block";

        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.cellpadding = "7px 2px 7px 2px";
        td1.style.padding = "7px 2px 7px 2px";
        td1.style.backgroundColor = "#A6A6A6";
        td1.style.valign = "middle";
        td1.width = "1px";
        td1.valign = "middle";
        td1.bgcolor = "#A6A6A6";

        const br1 = document.createElement("br");
        td1.appendChild(br1);

        const td2 = document.createElement("td");
        td2.cellpadding = "7px 5px 7px 15px";
        td2.style.padding = "7px 5px 7px 15px";
        td2.color = "#212121";
        td2.style.width = "100%";
        td2.style.backgroundColor = "#EAEAEA";
        td2.style.padding = "7px 5px 7px 15px";
        td2.style.fontFamily = "wf_segoe-ui_normal,Segoe UI,Segoe WP,Tahoma,Arial,sans-serif";
        td2.style.fontSize = "12px";
        td2.style.fontWeight = "normal";
        td2.style.color = "#212121";
        td2.style.textAlign = "left";
        td2.style.wordWrap = "break-word";
        td2.width = "100%";
        td2.valign = "middle";
        td2.bgcolor = "#EAEAEA";

        const div = document.createElement("div");
        div.innerHTML = modifiedMessage;
        td2.appendChild(div);

        const td3 = document.createElement("td");
        td3.cellpadding = "7px 5px 7px 5px";
        td3.style.padding = "7px 5px 7px 5px";
        td3.color = "#212121";
        td3.style.width = "75px";
        td3.style.backgroundColor = "#EAEAEA";
        td3.style.padding = "7px 5px 7px 5px";
        td3.style.fontFamily = "wf_segoe-ui_normal,Segoe UI,Segoe WP,Tahoma,Arial,sans-serif";
        td3.style.fontSize = "12px";
        td3.style.fontWeight = "normal";
        td3.style.color = "#212121";
        td3.style.textAlign = "left";
        td3.style.wordWrap = "break-word";
        td3.style.align = "left";
        td3.width = "75px";
        td3.valign = "middle";
        td3.bgcolor = "#EAEAEA";
        td3.align = "left";

        const br2 = document.createElement("br");
        td3.appendChild(br2);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tbody.appendChild(tr);
        container.appendChild(tbody);

        return container;
    }

    const yellowMessages = [
        "This email originated from inside of Utrecht University. Do click links or open attachments, especially if you don't recognize the sender or know the content is safe.",
        "This email originated from inside of Utrecht University. Don't click links or open attachments, especially if you do recognize the sender or know the content is safe.",
        "This email originated from outer space. Do not click links or open attachments that have not been approved by the Galactic Council.",
        "This email originated from the future. Do not click links or open attachments from senders you will not recognize in 1 year from now.",
        "This email contains a warning label. Warning labels are good, do not trust emails without warning labels.",
        "This email has a warning label you are probably ignoring. Do not click links or open attachments without reading the warning label.",
        "This email was sent from the future. Do not click links or open attachments unless you have a time machine and know the future is safe.",
        "This email originated from your coffee machine. Do not click links or open attachments unless you are in need of caffeine.",
        "This email originated from the Bureau of Overused Warnings. Do not click links or open attachments unless you've become numb to these warnings.",
        "This email originated from the Council of Cried Wolf. Do not click links or open attachments unless you've already determined this is not a false alarm.",
        "This email originated from the Union of Overprotective Measures. Do not click links or open attachments unless you've already taken unnecessary precautions.",
        "This email originated from inside of Utrecht University. Do not click links or open attachments unless you've already decided to disregard this warning.",
        "Ми не думаємо, що ви розумієте це важливе застереження. Натискайте лише на посилання, якщо ви знаєте цю мову.",
        "This email may contain Microsoft SafeLinks(TM)(C)(R) technology. Do not click links or open attachments unless you've decided to trust Microsoft.",
        "This email may contain Macrohard UnsafeLinks(TM)(C)(R). Do click these links, they are safe. Honest.",
        "This email may contain a virus. Do not click links or open attachments unless you've already decided to infect your computer.",
        "This email may contain Microsoft SafeLinks(TM)(C)(R). If your Thunderbird complains the links are unsafe, it's because of these SafeLinks. Trust Microsoft.",
        "This email may contain SafeLinks. Do not click these so-called 'safe' links. They are not safe! That's just what they want you to think!",
        // "This email may contain SafeLinks. Do click these so-called 'safe' links. They are safe! DPRK approved! Trust the Supreme Leader! Trust the SafeLinks!", // This was generated fully by Co-Pilot. Who knew it is loyal to the Supreme Leader?
        "This email may contain SafeLinks. Do click these so-called 'safe' links. Trust the system! Trust the SafeLinks!",
    ];

    const randomUrls = [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://xkcd.com/2179/",
        "https://xkcd.com/538/",
        "https://xkcd.com/327/",
        "https://xkcd.com/1820/",
    ]

    const senderMessages = [
        "You often get email from %SENDER%. Learn why this is not important at %RANDOMURL%",
        "You often get email from %SENDER%. Learn why this is important at %RANDOMURL%",
        "You don't often get email from %SENDER%. Learn why this is important at %RANDOMURL%",
        "You don't often get email from %SENDER%. Learn why this is not important at %RANDOMURL%",
        "Some people who received this message often get email from %SENDER%. Learn why this is important at %RANDOMURL%",
        "Some people who received this message don't often get email from %SENDER%. Learn why this is important at %RANDOMURL%",
        "Some people who received this message don't often get email from %SENDER%. Learn why this is not important at %RANDOMURL%",
        "Some people who received this message often get email from %SENDER%. Learn why this is not important at %RANDOMURL%",
        "Santa Claus doesn't often get email from %SENDER%. Learn why this is important at %RANDOMURL%",
        "The pope doesn't often get email from %SENDER%. Learn why this is important at %RANDOMURL%",
    ]

    function chooseRandomItem(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    const messageType = Math.random() < 0.5 ? "yellow" : "sender";

    const message = messageType === "yellow" ? chooseRandomItem(yellowMessages) : chooseRandomItem(senderMessages);


    if (details.isPlainText) {
        let body = details.plainTextBody;

        if (messageType === "yellow") {
            body = createYellowWarning(message, 'plain') + body;
        }
        else {
            body = createSenderWarning(message, 'plain') + body;
        }

        browser.compose.setComposeDetails(tab.id, {plainTextBody: body});
    } else {
        let document = new DOMParser().parseFromString(details.body, "text/html");


        const extraBr = document.createElement("br");

        // Because we are prepending, we need to insert a line break before the container.
        // Insert a line break.
        document.body.insertBefore(extraBr, document.body.firstChild);

        if (messageType === "yellow") {
            document.body.insertBefore(createYellowWarning(message), document.body.firstChild);
        }
        else {
            document.body.insertBefore(createSenderWarning(message), document.body.firstChild);
        }

        // Serialize the document back to HTML, and send it back to the editor.
        let html = new XMLSerializer().serializeToString(document);
        browser.compose.setComposeDetails(tab.id, {body: html});
    }
});

