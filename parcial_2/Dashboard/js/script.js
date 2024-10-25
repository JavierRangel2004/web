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
            option.textContent = asesor.Nombre;
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
            body: JSON.stringify(filtrosCategorias)
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
        document.getElementById('totalSesiones').textContent = summary.totalSesiones;
        document.getElementById('totalHorasProfesor').textContent = summary.totalHorasProfesor;
        document.getElementById('duracionMediaSesion').textContent = summary.duracionMediaSesion;
        document.getElementById('totalHorasTalent').textContent = summary.totalHorasTalent;
        document.getElementById('profesoresUnicos').textContent = summary.profesoresUnicos;
    }

    function updateResultsTable(results) {
        const tableBody = document.querySelector('#results-table tbody');
        // Limpiar la tabla
        tableBody.innerHTML = '';

        // Agrupar asesores por ID de asesoría
        const asesoriasMap = {};
        results.forEach(result => {
            const id = result.ID;
            if (!asesoriasMap[id]) {
                asesoriasMap[id] = { ...result, Asesores: [] };
            }
            asesoriasMap[id].Asesores.push(result.Asesor);
        });

        // Recorrer las asesorías agrupadas y agregarlas a la tabla
        Object.values(asesoriasMap).forEach(asesoria => {
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
            asesoresCell.textContent = asesoria.Asesores.join(', ');

            row.appendChild(idCell);
            row.appendChild(correoCell);
            row.appendChild(fechaCell);
            row.appendChild(duracionCell);
            row.appendChild(categoriaCell);
            row.appendChild(asesoresCell);

            tableBody.appendChild(row);
        });
    }

    function updateCategoriaResultsTable(data) {
        const tableBody = document.querySelector('#categorias-results tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de actualizar

        console.log('Datos recibidos para la tabla de categorías:', data);

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

    function updateAsesoresResultsTable(data) {
        const tableBody = document.querySelector('#asesores-results tbody');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de actualizar

        console.log('Datos recibidos para la tabla de asesores:', data);

        data.forEach(item => {

            const row = document.createElement('tr');

            const nombreCell = document.createElement('td');
            nombreCell.textContent = item.Nombre || 'N/A';

            const sesionesCell = document.createElement('td');
            sesionesCell.textContent = item.Sesiones || 'N/A';

            const totalHorasProfCell = document.createElement('td');
            totalHorasProfCell.textContent = item.TotalHorasProfesor || 'N/A';

            const totalHorasTalentCell = document.createElement('td');
            totalHorasTalentCell.textContent = item.TotalHorasTalent || 'N/A';

            const duracionMediaProfCell = document.createElement('td');
            duracionMediaProfCell.textContent = item.DuracionMediaProfesor || 'N/A';

            const duracionMediaTalentCell = document.createElement('td');
            duracionMediaTalentCell.textContent = item.DuracionMediaTalent || 'N/A';

            // Añadir todas las celdas a la fila
            row.appendChild(nombreCell);
            row.appendChild(sesionesCell);
            row.appendChild(totalHorasProfCell);
            row.appendChild(totalHorasTalentCell);
            row.appendChild(duracionMediaProfCell);
            row.appendChild(duracionMediaTalentCell);

            // Añadir la fila a la tabla
            tableBody.appendChild(row);
        });
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
