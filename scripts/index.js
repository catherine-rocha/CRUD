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
        results.innerHTML = ""; // Limpiar resultados anteriores
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
        alert("Algo salió mal: " + error.message);
    }
});

// Agregar nuevo registro (POST)
document.getElementById("btnPost").addEventListener("click", () => {
    let inputNombre = document.getElementById("inputPostNombre");
    let inputApellido = document.getElementById("inputPostApellido");

    if (!inputNombre.value || !inputApellido.value) {
        alert('Por favor, ingresa tanto el nombre como el apellido');
        return;
    }

    fetch("https://672ce712fd8979715640a3c1.mockapi.io/users", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: inputNombre.value,
            lastname: inputApellido.value
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Usuario agregado:', data);
            alert('Usuario agregado con éxito');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Algo salió mal al agregar el usuario');
        });
});

// Eliminar registro (DELETE)
document.getElementById("btnDelete").addEventListener("click", () => {
    let inputId = document.getElementById("inputDelete").value;

    if (!inputId) {
        alert('Por favor, ingresa un ID válido');
        return;
    }

    fetch(`https://672ce712fd8979715640a3c1.mockapi.io/users/${inputId}`, {
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
            alert('Error al eliminar el usuario');
        });
});

// Modificar registro (PUT)
document.getElementById("btnPut").addEventListener("click", () => {
    let inputPutId = document.getElementById("inputPutId");
    let userId = inputPutId.value.trim();

    if (!userId) {
        alert('Por favor, ingresa un ID de usuario válido');
        return;
    }

    const url = `https://672ce712fd8979715640a3c1.mockapi.io/users/${userId}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo encontrar el usuario con ID ${userId}`);
            }
            return response.json();
        })
        .then(user => {
            // Mostrar el modal con los datos actuales para editar
            const modal = new bootstrap.Modal(document.getElementById('dataModal'));
            const inputPutNombre = document.getElementById('inputPutNombre');
            const inputPutApellido = document.getElementById('inputPutApellido');

            inputPutNombre.value = user.name;
            inputPutApellido.value = user.lastname;

            modal.show();

            // Habilitar el botón de guardar solo si los campos no están vacíos
            document.getElementById("btnSendChanges").disabled = !inputPutNombre.value || !inputPutApellido.value;

            // Botón "Guardar cambios" en el modal
            document.getElementById("btnSendChanges").addEventListener('click', () => {
                const newName = inputPutNombre.value.trim();
                const newLastname = inputPutApellido.value.trim();

                if (newName && newLastname) {
                    fetch(url, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: newName,
                            lastname: newLastname,
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
                            modal.hide(); // Cerrar el modal
                            const results = document.getElementById("results");
                            results.innerHTML = `<li>ID: ${updatedUser.id}, Nombre: ${updatedUser.name}, Apellido: ${updatedUser.lastname}</li>`;
                        })
                        .catch(error => {
                            console.error('Error al modificar el usuario:', error);
                            alert('Error al modificar el usuario: ' + error.message);
                        });
                } else {
                    alert('Los campos no pueden estar vacíos');
                }
            });
        })
        .catch(error => {
            console.error('Error al obtener el usuario:', error);
            alert('No se pudo obtener el usuario');
        });
});
