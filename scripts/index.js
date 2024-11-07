document.getElementById("btnGet1").addEventListener("click", async () => {
    const inputId = document.getElementById("inputGet1Id").value;
    const url = `https://672ce712fd8979715640a3c1.mockapi.io/users${inputId ? `/${inputId}` : "/"}`;

    const results = document.getElementById("results");

    try {
        const response = await fetch(url);
        const data = await response.json();
        results.innerHTML = ""; //limpiar resultados anteriores

        //añade uno o varios resultados segun el caso
        (Array.isArray(data) ? data : [data]).forEach(user => {
            results.innerHTML += `<li>
                ID: ${user.id}, Nombre: ${user.name}, Apellido: ${user.lastname}
            </li>`;
        });
    } catch (error) {
        alert("algo salio mal: " );
    }
});

let agregarBtn = document.getElementById("btnPost");
agregarBtn.addEventListener("click", () => {

    let inputNombre = document.getElementById("inputPostNombre");
    let inputApellido = document.getElementById("inputPostApellido");

    fetch("https://672ce712fd8979715640a3c1.mockapi.io/users", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: inputNombre.value,
            lastname: inputApellido.value
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

})

let deleteButton = document.getElementById("btnDelete");
deleteButton.addEventListener("click", () => {

    let inputId = document.getElementById("inputDelete").value;

    fetch(`https://672ce712fd8979715640a3c1.mockapi.io/users/${inputId}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

});


