const styles: string[] = ['styles/responsive.css', 'styles/alternative.css', 'styles/empty.css'];
const footer = document.getElementById('links') as HTMLDivElement;
const style= document.getElementById('currentStyle') as HTMLLinkElement;

function  addStyles(){
    for (let i = 0; i < styles.length; i++){
        const link = document.createElement('a');
        link.textContent = `Styl nr ${i + 1}`;
        link.href = styles[i];
        link.addEventListener("click", (event) => {
            event.preventDefault();
            style.setAttribute("href", link.href);
            console.log("Style: ", link.href);
        });
        footer.appendChild(link);

        if (i < styles.length - 1) {
            const space = document.createElement('span');
            space.innerHTML = '&emsp;';
            footer.appendChild(space);
        }
    }
}

addStyles();