var auto = false

function changeText() {
let cb = document.getElementById("modo")
    cb.addEventListener("change", function() {
        if (cb.checked) {
            auto = true
            document.getElementById("mode").innerHTML = "Manual"
        } else {
            auto = false
            document.getElementById("mode").innerHTML = "Auto"
        }
    })
}