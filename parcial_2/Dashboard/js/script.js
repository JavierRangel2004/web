document.addEventListener('DOMContentLoaded', function() {

    // Variables globales para almacenar los filtros seleccionados y las fechas
    let selectedAsesores = [];
    let selectedSedes = [];
    let selectedCategorias = [];
    let selectedFechaInicio = '';
    let selectedFechaFin = '';

    // Cargar asesores
    fetch('asesores.php')
    .then(response => response.json())
    .then(data => {
        var asesoresSelect = document.getElementById('asesores-select');
        data.forEach(function(asesor) {
            var option = document.createElement('option');
            option.value = asesor.ID;
            option.textContent = asesor.Nombres + ' ' + asesor.Apellidos;
            asesoresSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error al obtener asesores:', error));

    // Cargar sedes
    fetch('sedes.php')
    .then(response => response.json())
    .then(data => {
        var sedesSelect = document.getElementById('sedes-select');
        data.forEach(function(sede) {
            var option = document.createElement('option');
            option.value = sede.ID;
            option.textContent = sede.Nombre;
            sedesSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error al obtener sedes:', error));

    // Cargar categorías
    fetch('categorias.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // Enviar vacío inicialmente
    })
    .then(response => response.json())
    .then(data => {
        var categoriasSelect = document.getElementById('categorias-select');
        data.forEach(function(categoria) {
            var option = document.createElement('option');
            option.value = categoria.ID;
            option.textContent = `${categoria.Llave} - ${categoria.Nombre}`;
            categoriasSelect.appendChild(option);
        });
        console.log('Datos recibidos para la tabla de categorías:', data);
        updateCategoriaResultsTable(data);
    })
    .catch(error => console.error('Error al obtener categorías:', error));

    // Función para realizar la búsqueda
    function search() {
        // Construir el objeto de filtros
        const filters = {
            fechaInicio: selectedFechaInicio,
            fechaFin: selectedFechaFin,
            asesores: selectedAsesores.map(a => a.id),
            sedes: selectedSedes.map(s => s.id),
            categorias: selectedCategorias.map(c => c.id)
        };

        // Enviar los filtros al backend para Resultados
        fetch('buscar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Error en el servidor:', data.error);
                return;
            }
            // Actualizar la cinta
            updateCinta(data.summary);
            // Actualizar la tabla de resultados
            updateResultsTable(data.results);
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            alert('Hubo un error al obtener los datos del servidor. Por favor, intenta nuevamente más tarde.');
        });

        // Preparar los filtros para Categorías (excluir 'categorias')
        const filtrosCategorias = {
            fechaInicio: selectedFechaInicio,
            fechaFin: selectedFechaFin,
            asesores: selectedAsesores.map(a => a.id),
            sedes: selectedSedes.map(s => s.id)
        };

        // Enviar los filtros al backend para Categorías
        fetch('categorias.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filtrosCategorias)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor para categorías');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Error en el servidor al obtener categorías:', data.error);
                return;
            }
            // Actualizar la tabla de categorías
            updateCategoriaResultsTable(data);
        })
        .catch(error => {
            console.error('Error al obtener datos de categorías:', error);
            alert('Hubo un error al obtener los datos de categorías del servidor. Por favor, intenta nuevamente más tarde.');
        });

        // Enviar los filtros al backend para Asesores
        fetch('asesores_summary.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor para asesores');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Error en el servidor al obtener asesores:', data.error);
                return;
            }
            // Actualizar la tabla de asesores
            updateAsesoresResultsTable(data);
        })
        .catch(error => {
            console.error('Error al obtener datos de asesores:', error);
            alert('Hubo un error al obtener los datos de asesores del servidor. Por favor, intenta nuevamente más tarde.');
        });
    }

    // Ejecutar la búsqueda inicial al cargar la página
    search();

    // Manejar cambios en las fechas para búsqueda instantánea
    document.getElementById('datepicker-inicio').addEventListener('change', function() {
        selectedFechaInicio = this.value;
        updateFechaIntervalo();
        search();
    });

    document.getElementById('datepicker-fin').addEventListener('change', function() {
        selectedFechaFin = this.value;
        updateFechaIntervalo();
        search();
    });

    // Actualizar intervalo de fechas
    function updateFechaIntervalo() {
        const fechaIntervaloDiv = document.getElementById('fecha-intervalo');
        let intervaloTexto = 'Intervalo de Fechas: ';
        intervaloTexto += selectedFechaInicio ? `Desde: ${selectedFechaInicio} ` : 'Desde: Inicio ';
        intervaloTexto += selectedFechaFin ? `Hasta: ${selectedFechaFin}` : 'Hasta: Actualidad';
        fechaIntervaloDiv.textContent = intervaloTexto;
    }

    // Manejar selección de asesores
    document.getElementById('asesores-select').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const asesorId = selectedOption.value;
        const asesorNombre = selectedOption.textContent;

        // Evitar agregar "Seleccione un miembro"
        if (asesorId === '' || asesorId === null) {
            return;
        }

        // Verificar si el asesor ya está en la lista
        if (!selectedAsesores.some(a => a.id === asesorId)) {
            selectedAsesores.push({ id: asesorId, nombre: asesorNombre });
            updateFiltrosTags();
            // Ahora, la búsqueda no es automática al agregar asesores
        }

        // Resetear el selector
        this.selectedIndex = 0;
    });

    // Manejar selección de sedes
    document.getElementById('sedes-select').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const sedeId = selectedOption.value;
        const sedeNombre = selectedOption.textContent;

        // Evitar agregar "Seleccione una sede"
        if (sedeId === '' || sedeId === null) {
            return;
        }

        // Verificar si la sede ya está en la lista
        if (!selectedSedes.some(s => s.id === sedeId)) {
            selectedSedes.push({ id: sedeId, nombre: sedeNombre });
            updateFiltrosTags();
        }

        // Resetear el selector
        this.selectedIndex = 0;
    });

    // Manejar selección de categorías
    document.getElementById('categorias-select').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const categoriaId = selectedOption.value;
        const categoriaNombre = selectedOption.textContent;

        // Evitar agregar "Seleccione una categoría"
        if (categoriaId === '' || categoriaId === null) {
            return;
        }

        // Verificar si la categoría ya está en la lista
        if (!selectedCategorias.some(c => c.id === categoriaId)) {
            selectedCategorias.push({ id: categoriaId, nombre: categoriaNombre });
            updateFiltrosTags();
        }

        // Resetear el selector
        this.selectedIndex = 0;
    });

    // Actualizar los tags de filtros seleccionados
    function updateFiltrosTags() {
        const filtrosTagsDiv = document.getElementById('filtros-tags');
        filtrosTagsDiv.innerHTML = '';

        // Asesores
        selectedAsesores.forEach(asesor => {
            const tag = createTag(asesor.nombre, () => {
                selectedAsesores = selectedAsesores.filter(a => a.id !== asesor.id);
                updateFiltrosTags();
            });
            filtrosTagsDiv.appendChild(tag);
        });

        // Sedes
        selectedSedes.forEach(sede => {
            const tag = createTag(sede.nombre, () => {
                selectedSedes = selectedSedes.filter(s => s.id !== sede.id);
                updateFiltrosTags();
            });
            filtrosTagsDiv.appendChild(tag);
        });

        // Categorías
        selectedCategorias.forEach(categoria => {
            const tag = createTag(categoria.nombre, () => {
                selectedCategorias = selectedCategorias.filter(c => c.id !== categoria.id);
                updateFiltrosTags();
            });
            filtrosTagsDiv.appendChild(tag);
        });
    }

    // Función para crear un tag de filtro
    function createTag(text, onRemove) {
        const tag = document.createElement('div');
        tag.className = 'bg-secondary text-white px-3 py-1 rounded-pill d-flex align-items-center';
        tag.style.gap = '10px';

        const span = document.createElement('span');
        span.textContent = text;

        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-link text-white p-0 ms-2';
        removeButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
        removeButton.addEventListener('click', function() {
            onRemove();
        });

        tag.appendChild(span);
        tag.appendChild(removeButton);
        return tag;
    }

    // Manejar el envío del formulario
    const form = document.getElementById('filter-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío por defecto

        // Realizar la búsqueda con los filtros actuales
        search();
    });

    

    function updateCinta(summary) {
        const cintaElement = document.querySelector('.cinta-resumen');

        if (summary.totalSesiones === 0) {
            // Mostrar mensaje de alerta en la cinta
            cintaElement.innerHTML = `
                <div class="col-12 text-center">
                    <h4 class="text-white">No se encontraron resultados con los filtros seleccionados.</h4>
                </div>
            `;
        } else {
            // Restaurar la cinta con los datos
            cintaElement.innerHTML = `
                <div class="col-sm-2 d-flex flex-column align-items-center">
                    <h2 id="totalSesiones" class="text-white text-center">${summary.totalSesiones}</h2>
                    <span class="text-white text-center">Sesiones</span>
                </div>
                <div class="col-sm-2 d-flex flex-column align-items-center">
                    <h2 id="totalHorasProfesor" class="text-white text-center">${summary.totalHorasProfesor}</h2>
                    <span class="text-white text-center">Total Hrs. Profesor</span>
                </div>
                <div class="col-sm-2 d-flex flex-column align-items-center">
                    <h2 id="duracionMediaSesion" class="text-white text-center">${summary.duracionMediaSesion}</h2>
                    <span class="text-white text-center">Duración Media Sesión</span>
                </div>
                <div class="col-sm-2 d-flex flex-column align-items-center">
                    <h2 id="totalHorasTalent" class="text-white text-center">${summary.totalHorasTalent}</h2>
                    <span class="text-white text-center">Total Hrs. Talent</span>
                </div>
                <div class="col-sm-2 d-flex flex-column align-items-center">
                    <h2 id="profesoresUnicos" class="text-white text-center">${summary.profesoresUnicos}</h2>
                    <span class="text-white text-center">Profesores</span>
                </div>
            `;
        }
    }

    function updateResultsTable(results) {
        const tableBody = document.querySelector('#results-table tbody');
        // Limpiar la tabla
        tableBody.innerHTML = '';

        const alertContainer = document.querySelector('#resultados .alert-container');
        if (alertContainer) {
            alertContainer.remove();
        }
        const alertDiv = document.createElement('div');
        if (results.length === 0) {
            alertDiv.className = 'alert alert-warning mt-3';
            alertDiv.textContent = 'No se encontraron resultados con los filtros seleccionados.';
            const resultadosDiv = document.getElementById('resultados');
            resultadosDiv.appendChild(alertDiv);
        } else {
            //delete alert div if exists
            const alertDiv = document.querySelector('.alert');
            if (alertDiv) {
                alertDiv.remove();
            }
            results.forEach(asesoria => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = asesoria.ID;

                const correoCell = document.createElement('td');
                correoCell.textContent = asesoria.Correo;

                const fechaCell = document.createElement('td');
                fechaCell.textContent = asesoria.Fecha;

                const duracionCell = document.createElement('td');
                duracionCell.textContent = asesoria.Duracion;

                const categoriaCell = document.createElement('td');
                categoriaCell.textContent = asesoria.Categoria;

                const asesoresCell = document.createElement('td');
                asesoresCell.textContent = asesoria.Asesores;

                row.appendChild(idCell);
                row.appendChild(correoCell);
                row.appendChild(fechaCell);
                row.appendChild(duracionCell);
                row.appendChild(categoriaCell);
                row.appendChild(asesoresCell);

                tableBody.appendChild(row);
            });
        }
    }

    function updateCategoriaResultsTable(data) {
        const tableBody = document.querySelector('#categorias-results tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de actualizar

        const alertContainer = document.querySelector('#categorias .alert-container');
        if (alertContainer) {
            alertContainer.remove();
        }
        const alertDiv = document.createElement('div');
        if (data.length === 0) {
            alertDiv.className = 'alert alert-warning mt-3';
            alertDiv.textContent = 'No se encontraron resultados con los filtros seleccionados.';
            const categoriasDiv = document.getElementById('categorias');
            categoriasDiv.appendChild(alertDiv);
        } else {
            //delete alert div if exists
            const alertDiv = document.querySelector('.alert');
            if (alertDiv) {
                alertDiv.remove();
            }
            data.forEach(item => {
                const row = document.createElement('tr');

                const llaveCell = document.createElement('td');
                llaveCell.textContent = item.Llave || 'N/A';  // Usa 'N/A' si no hay valor

                const nombreCell = document.createElement('td');
                nombreCell.textContent = item.Nombre || 'N/A';

                const sesionesCell = document.createElement('td');
                sesionesCell.textContent = item.Sesiones || 'N/A';

                const profesoresCell = document.createElement('td');
                profesoresCell.textContent = item.Profesores || 'N/A';

                const totalHorasProfCell = document.createElement('td');
                totalHorasProfCell.textContent = item.TotalHorasProfesor || 'N/A';

                const totalHorasTalentCell = document.createElement('td');
                totalHorasTalentCell.textContent = item.TotalHorasTalent || 'N/A';

                const duracionMediaProfCell = document.createElement('td');
                duracionMediaProfCell.textContent = item.DuracionMediaProfesor || 'N/A';

                const duracionMediaTalentCell = document.createElement('td');
                duracionMediaTalentCell.textContent = item.DuracionMediaTalent || 'N/A';

                // Añadir todas las celdas a la fila
                row.appendChild(llaveCell);
                row.appendChild(nombreCell);
                row.appendChild(sesionesCell);
                row.appendChild(profesoresCell);
                row.appendChild(totalHorasProfCell);
                row.appendChild(totalHorasTalentCell);
                row.appendChild(duracionMediaProfCell);
                row.appendChild(duracionMediaTalentCell);

                // Añadir la fila a la tabla
                tableBody.appendChild(row);
            });
        }
    }

    function updateAsesoresResultsTable(data) {
        const tableBody = document.querySelector('#asesores-results tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de actualizar
        //delete alert div if exists
        const alertDiv = document.querySelector('.alert');
        if (alertDiv) {
            alertDiv.remove();
        }

        const alertContainer = document.querySelector('#asesores .alert-container');
        if (alertContainer) {
            alertContainer.remove();
        }
        if (data.length === 0) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-warning mt-3';
            alertDiv.textContent = 'No se encontraron resultados con los filtros seleccionados.';
            const asesoresDiv = document.getElementById('asesores');
            asesoresDiv.appendChild(alertDiv);
        } else {

            data.forEach(item => {
                const row = document.createElement('tr');

                const correoCell = document.createElement('td');
                correoCell.textContent = item.Correo || 'N/A';

                const nombresCell = document.createElement('td');
                nombresCell.textContent = item.Nombres || 'N/A';

                const apellidosCell = document.createElement('td');
                apellidosCell.textContent = item.Apellidos || 'N/A';

                const sesionesCell = document.createElement('td');
                sesionesCell.textContent = item.Sesiones || 'N/A';

                const totalHorasTalentCell = document.createElement('td');
                totalHorasTalentCell.textContent = item.TotalHorasTalent || 'N/A';

                const duracionMediaSesionCell = document.createElement('td');
                duracionMediaSesionCell.textContent = item.DuracionMediaSesion || 'N/A';

                const porcentajeHorasProfCell = document.createElement('td');
                porcentajeHorasProfCell.textContent = item.PorcentajeHorasProf || 'N/A';

                const porcentajeHorasTalentCell = document.createElement('td');
                porcentajeHorasTalentCell.textContent = item.PorcentajeHorasTalent || 'N/A';

                // Añadir todas las celdas a la fila
                row.appendChild(correoCell);
                row.appendChild(nombresCell);
                row.appendChild(apellidosCell);
                row.appendChild(sesionesCell);
                row.appendChild(totalHorasTalentCell);
                row.appendChild(duracionMediaSesionCell);
                row.appendChild(porcentajeHorasProfCell);
                row.appendChild(porcentajeHorasTalentCell);

                // Añadir la fila a la tabla
                tableBody.appendChild(row);
            });
        }
    }

    // Botón Limpiar
    document.getElementById('limpiar-button').addEventListener('click', function() {
        // Resetear los selectores
        document.getElementById('asesores-select').selectedIndex = 0;
        document.getElementById('sedes-select').selectedIndex = 0;
        document.getElementById('categorias-select').selectedIndex = 0;
        // Limpiar los campos de fecha
        document.getElementById('datepicker-inicio').value = '';
        document.getElementById('datepicker-fin').value = '';
        // Limpiar variables de selección
        selectedAsesores = [];
        selectedSedes = [];
        selectedCategorias = [];
        selectedFechaInicio = '';
        selectedFechaFin = '';
        //delete alert div if exists
        for (let i = 0; i < 3; i++) {
            const alertDiv3 = document.querySelector('.alert');
            if (alertDiv3) {
                alertDiv3.remove();
            }
        }
        // Actualizar los tags de filtros
        updateFiltrosTags();
        updateFechaIntervalo();
        // Realizar la búsqueda inicial
        search();
    });

    // Botones para limpiar fechas individuales
    document.getElementById('clear-date-inicio').addEventListener('click', function() {
        document.getElementById('datepicker-inicio').value = '';
        selectedFechaInicio = '';
        updateFechaIntervalo();
        search();
    });

    document.getElementById('clear-date-fin').addEventListener('click', function() {
        document.getElementById('datepicker-fin').value = '';
        selectedFechaFin = '';
        updateFechaIntervalo();
        search();
    });

});
