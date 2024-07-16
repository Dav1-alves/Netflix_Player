const backPage = document.querySelectorAll(".back");
for (let i = 0; i < backPage.length; i++) {
    backPage[i].addEventListener('click', () => {
        document.body.style.transition = "all 259ms ease-in-out"
        document.body.style.opacity = "0"
    })
}
