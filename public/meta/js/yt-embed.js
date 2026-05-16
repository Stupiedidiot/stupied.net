embed = document.querySelectorAll(".yt-embed.custom")
for (i = 0; i < embed.length ;i++){
    embedButton = document.createElement("button")
    embedButton.setAttribute("onclick", "revealEmbed()")
    embed[i].append(embedButton)
}

function revealEmbed() {
    target =  event.target
    target.style.opacity = 0
    target.style.pointerEvents = "none"
    setTimeout(function(){target.remove()}, 1000)
}