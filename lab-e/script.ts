const styles: string[] = ['styles/responsive.css', 'styles/alternative.css', 'styles/empty.css'];
const footer = document.getElementById('links') as HTMLDivElement;
const style= document.getElementById('currentStyle') as HTMLLinkElement;

function  initFunction(){
    for (let i = 0; i < styles.length; i++){
        const link = document.createElement('a');
        switch (i) {
            case 0:
                link.textContent = `Styl responsywny`;
                break;
            case 1:
                link.textContent = `Styl alternatywny`;
                break;
            case 2:
                link.textContent = `Bez CSS`;
        }
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

initFunction();