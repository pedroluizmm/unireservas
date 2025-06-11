async function fetchAndRender(url, container, title) {
    const res = await fetch(url);
    const data = await res.json();
    const table = document.createElement('table');
    table.className = 'data-table';
    const caption = document.createElement('caption');
    caption.textContent = title;
    table.appendChild(caption);
    if (Array.isArray(data) && data.length) {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        Object.keys(data[0]).forEach(k => {
            const th = document.createElement('th');
            th.textContent = k;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        data.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(v => {
                const td = document.createElement('td');
                td.textContent = v;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    }
    container.appendChild(table);
}

async function init() {
    await fetchAndRender('/api/clientes', document.getElementById('adminTables'), 'Clientes');
    await fetchAndRender('/api/restaurantes', document.getElementById('adminTables'), 'Restaurantes');
    await fetchAndRender('/api/mesas', document.getElementById('adminTables'), 'Mesas');
    await fetchAndRender('/api/reservas', document.getElementById('adminTables'), 'Reservas');
    await fetchAndRender('/api/pagamentos', document.getElementById('adminTables'), 'Pagamentos');
}

init();
