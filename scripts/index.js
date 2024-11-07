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
