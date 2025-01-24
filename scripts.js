// Get form header elements
const formHeader = document.querySelector("div#form-wrapper header")
const headerH4 = formHeader.querySelector("h4")
const headerP = formHeader.querySelector("p")

// Get input area elements
const form = document.querySelector("form")
var totalToDraw = Number(document.getElementById("total-number").value)
var rangeMin = Number(document.getElementById("from-number").value)
var rangeMax = Number(document.getElementById("to-number").value)
const anyInputField = document.querySelector("input")

const results = document.getElementById("results")

const drawButton = document.querySelector("button[type='submit']")
const straightArrow = drawButton.querySelector("img")

// Utility variables
let firstDraw = true
let resultRoundIndex = 1
let drawnList = []
let delayMS = 2500 // 2500ms -> 2.5s between each draw
let repeatNumber = document.querySelector("input[type='checkbox']:checked")

// Include min and max values from user's input range
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// Generate a new random result from user inputs
function generateNumbers() {
    getValues()

    // Limits how many cards can be drawn
    let totalLimit = 0
    
    // Update to current input value
    totalToDraw = anyInputField.value

    while (totalLimit < totalToDraw) {
        // Create a new random number
        let newRandNum = getRandomNum(rangeMin, rangeMax)
        
        // Check if no-repeat switch is on
        if (!repeatNumber) {
            // Check if it's an impossible set to draw
            if (totalToDraw > rangeMax) {
                alert("Impossível não repetir um número neste intervalo. Atualize para novos valores.")
                return
            // Check if the number has already been drawn
            } else if (drawnList.includes(newRandNum)) {
                continue
            } else {
                // Insert new number in a result referrence array
                drawnList.push(newRandNum)
                totalLimit++
            }
        } else {
            drawnList.push(newRandNum)
            totalLimit++
        }
    } 
}

// Get current range input values
function getValues() {
    rangeMin = Number(document.getElementById("from-number").value)
    rangeMax = Number(document.getElementById("to-number").value)
}

// Format input values
anyInputField.oninput = () => {
    // Remove non-numerical characters
    let value = anyInputField.value.replace(/\D/g, "")

    // Update input value
    anyInputField.value = Number(value)
    getValues()
}

/*
<div class="result-wrapper flex">
    <span class="overline">...</span>
</div>
*/
// Build structure as shown in comment above 
function createResultElement(newDraw) {
    // Creates new pink square container for new number
    const newNumContainer = document.createElement("div")
    newNumContainer.classList.add("result-wrapper", "flex")

    // Add element in div#results
    results.appendChild(newNumContainer)

    // Create new text element that displays the new number value
    const newNum = document.createElement("span")
    newNum.classList.add("overline")
    newNum.textContent = String(newDraw)

    // Add element in new div.result-wrapper
    newNumContainer.appendChild(newNum)
}

// Callback a timed function for each generated number to be assigned to it's newly made DOM element
function drawListedNumbers() {
    for (let i = 0; i < drawnList.length; i++) {
        setTimeout(() => {
            // Create a new DOM element that will have the current listed number assigned to it
            createResultElement(drawnList[i])
            console.log(`resultado até então: ${drawnList}`)//!!!!!!!
        }, delayMS * i);
    }
}

// Clean result container for a new round
function updateResultContainer(resultRoundIndex) {
    // Change div#results header content
    formHeader.style.textAlign = "center"
    headerH4.innerText = "RESULTADO DO SORTEIO"
    headerP.style.font = "var(--overline)"
    headerP.innerText = `${resultRoundIndex}° RESULTADO`

    results.innerHTML = ""
}

// Update button text and display replay icon
function updateButton() {
/*
<button type="submit" class="flex">
    <span class="label-small">SORTEAR NOVAMENTE</span>
    <div class="replay">
        <img src="..." alt="...">
        <img src="..." alt="...">
    </div>
</button>
*/
    drawButton.querySelector("span").innerText = "SORTEAR NOVAMENTE"

    drawButton.removeChild(straightArrow)

    // Create new animated replay icon
    const iconContainer = document.createElement("div")
    iconContainer.classList.add("replay")
    drawButton.appendChild(iconContainer)

    const roundArrow = document.createElement("img")
    roundArrow.setAttribute("src", "assets/icons/round-arrow.png")
    roundArrow.setAttribute("alt", "Ícone de replay")
    iconContainer.appendChild(roundArrow)

    const playIcon = document.createElement("img")
    playIcon.setAttribute("src", "assets/icons/play.png")
    iconContainer.appendChild(playIcon)
}

// Trigger result interface when clicked on submit button
drawButton.addEventListener("click", () => {
    // Switch input area to div#results on first draw
    if (firstDraw) {
        form.classList.add("hidden")
        results.classList.remove("hidden")
        drawButton.style.marginTop = "1.7rem"

        // Fill drawnList[] with random number(s)
        generateNumbers()

        // Switch button icon for replay
        updateButton()

        firstDraw = false
    } else {
        // Empty result array each round
        if (resultRoundIndex > 1) {
            for (let i = drawnList.length; i >= 0; i--) {
                drawnList.pop(drawnList)
            }
        }
        generateNumbers()
    }
    // Create animated elements to display results
    drawListedNumbers()
    
    // Clean result container for a new round
    updateResultContainer(resultRoundIndex)
    
    // Save numbers drawn quantity so far
    resultRoundIndex += 1
})
