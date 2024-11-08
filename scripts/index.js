document.addEventListener("DOMContentLoaded", () => {
    const btnPost = document.getElementById("btnPost");
    const btnPut = document.getElementById("btnPut");
    const btnDelete = document.getElementById("btnDelete");
    const btnSendChanges = document.getElementById("btnSendChanges");

    const inputPostNombre = document.getElementById("inputPostNombre");
    const inputPostApellido = document.getElementById("inputPostApellido");
    const inputPutId = document.getElementById("inputPutId");
    const inputDelete = document.getElementById("inputDelete");

    const alertError = document.getElementById("alert-error");
    function showAlert(message) {
        alertError.textContent = message;
        alertError.classList.add("show");
        setTimeout(() => alertError.classList.remove("show"), 3000);
    }

    function toggleButtonState() {
        btnPost.disabled = !inputPostNombre.value || !inputPostApellido.value;
        btnPut.disabled = !inputPutId.value;
        btnDelete.disabled = !inputDelete.value;
    }

    inputPostNombre.addEventListener("input", toggleButtonState);
    inputPostApellido.addEventListener("input", toggleButtonState);
    inputPutId.addEventListener("input", toggleButtonState);
    inputDelete.addEventListener("input", toggleButtonState);

    toggleButtonState(); 

    document.getElementById("btnGet1").addEventListener("click", async () => {
        const inputId = document.getElementById("inputGet1Id").value;
        const url = `https://672ce712fd8979715640a3c1.mockapi.io/users${inputId ? `/${inputId}` : "/"}`;
        const results = document.getElementById("results");

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("No se encontró el registro");
            }
            const data = await response.json();
            results.innerHTML = ""; 
            (Array.isArray(data) ? data : [data]).forEach(user => {
                results.innerHTML += `
                    <li>
                        ID: ${user.id}<br>
                        Nombre: ${user.name}<br>
                        Apellido: ${user.lastname}<br>
                    </li><br>
                `;
            });
        } catch (error) {
            showAlert("Algo salió mal: " + error.message);
        }
    });
    btnPost.addEventListener("click", () => {
        if (!inputPostNombre.value || !inputPostApellido.value) return;

        fetch("https://672ce712fd8979715640a3c1.mockapi.io/users", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: inputPostNombre.value,
                lastname: inputPostApellido.value
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Usuario agregado:', data);
                alert('Usuario agregado con éxito');
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Algo salió mal al agregar el usuario');
            });
    });
    btnDelete.addEventListener("click", () => {
        if (!inputDelete.value) return;

        fetch(`https://672ce712fd8979715640a3c1.mockapi.io/users/${inputDelete.value}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo eliminar el usuario');
                }
                alert('Usuario eliminado con éxito');
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error al eliminar el usuario');
            });
    });
    btnPut.addEventListener("click", () => {
        if (!inputPutId.value.trim()) return;

        const url = `https://672ce712fd8979715640a3c1.mockapi.io/users/${inputPutId.value.trim()}`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`No se pudo encontrar el usuario con ID ${inputPutId.value}`);
                }
                return response.json();
            })
            .then(user => {
                const modal = new bootstrap.Modal(document.getElementById('dataModal'));
                const inputPutNombre = document.getElementById('inputPutNombre');
                const inputPutApellido = document.getElementById('inputPutApellido');

                inputPutNombre.value = user.name;
                inputPutApellido.value = user.lastname;

                modal.show();

                inputPutNombre.addEventListener("input", toggleModalButton);
                inputPutApellido.addEventListener("input", toggleModalButton);

                function toggleModalButton() {
                    btnSendChanges.disabled = !inputPutNombre.value || !inputPutApellido.value;
                }

                btnSendChanges.addEventListener('click', () => {
                    if (!inputPutNombre.value || !inputPutApellido.value) return;

                    fetch(url, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: inputPutNombre.value.trim(),
                            lastname: inputPutApellido.value.trim(),
                        })
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("No se pudo modificar el usuario");
                            }
                            return response.json();
                        })
                        .then(updatedUser => {
                            alert('Usuario modificado con éxito');
                            modal.hide();
                            const results = document.getElementById("results");
                            results.innerHTML = `<li>ID: ${updatedUser.id}, Nombre: ${updatedUser.name}, Apellido: ${updatedUser.lastname}</li>`;
                        })
                        .catch(error => {
                            console.error('Error al modificar el usuario:', error);
                            showAlert('Error al modificar el usuario: ' + error.message);
                        });
                });
            })
            .catch(error => {
                console.error('Error al obtener el usuario:', error);
                showAlert('No se pudo obtener el usuario');
            });
    });
});
