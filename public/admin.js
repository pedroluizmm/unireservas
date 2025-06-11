function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 3000);
}

async function fetchJSON(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error('Erro na requisição');
    return res.json();
}

function buildTable(data, { title, onAdd, onEdit, onDelete }) {
    const table = document.createElement('table');
    table.className = 'data-table';
    const caption = document.createElement('caption');
    caption.textContent = title;
    if (onAdd) {
        const btn = document.createElement('button');
        btn.textContent = 'Adicionar';
        btn.style.marginLeft = '1rem';
        btn.addEventListener('click', onAdd);
        caption.appendChild(btn);
    }
    table.appendChild(caption);

    if (Array.isArray(data) && data.length) {
        const keys = Object.keys(data[0]);
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        keys.forEach(k => {
            const th = document.createElement('th');
            th.textContent = k;
            tr.appendChild(th);
        });
        if (onEdit || onDelete) {
            const th = document.createElement('th');
            th.textContent = 'Ações';
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data.forEach(row => {
            const tr = document.createElement('tr');
            keys.forEach(k => {
                const td = document.createElement('td');
                td.textContent = row[k];
                tr.appendChild(td);
            });
            if (onEdit || onDelete) {
                const td = document.createElement('td');
                if (onEdit) {
                    const eBtn = document.createElement('button');
                    eBtn.textContent = 'Editar';
                    eBtn.addEventListener('click', () => onEdit(row));
                    td.appendChild(eBtn);
                }
                if (onDelete) {
                    const dBtn = document.createElement('button');
                    dBtn.textContent = 'Excluir';
                    dBtn.style.marginLeft = '0.5rem';
                    dBtn.addEventListener('click', () => onDelete(row));
                    td.appendChild(dBtn);
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    }
    return table;
}

async function addCliente() {
    const nome = prompt('Nome:');
    if (!nome) return;
    const telefone = prompt('Telefone:');
    if (!telefone) return;
    const email = prompt('Email:');
    if (!email) return;
    try {
        await fetchJSON('/api/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, telefone, email })
        });
        toast('Cliente criado');
        init();
    } catch (e) {
        toast('Erro ao criar cliente');
    }
}

async function editCliente(row) {
    const nome = prompt('Nome:', row.nome);
    if (!nome) return;
    const telefone = prompt('Telefone:', row.telefone);
    if (!telefone) return;
    const email = prompt('Email:', row.email);
    if (!email) return;
    try {
        await fetchJSON(`/api/clientes/${row.id_cliente}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, telefone, email })
        });
        toast('Cliente atualizado');
        init();
    } catch (e) {
        toast('Erro ao atualizar');
    }
}

async function deleteCliente(row) {
    if (!confirm('Excluir cliente?')) return;
    try {
        await fetchJSON(`/api/clientes/${row.id_cliente}`, { method: 'DELETE' });
        toast('Cliente removido');
        init();
    } catch (e) {
        toast('Erro ao remover');
    }
}

async function addRestaurante() {
    const nome = prompt('Nome:');
    if (!nome) return;
    const endereco = prompt('Endereço:');
    if (!endereco) return;
    const horariosStr = prompt('Horários (ex 12:00,18:00):', '');
    const horarios = horariosStr ? horariosStr.split(',').map(h => h.trim()).filter(Boolean) : [];
    try {
        await fetchJSON('/api/restaurantes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, endereco, horarios })
        });
        toast('Restaurante criado');
        init();
    } catch (e) {
        toast('Erro ao criar restaurante');
    }
}

async function editRestaurante(row) {
    const nome = prompt('Nome:', row.nome);
    if (!nome) return;
    const endereco = prompt('Endereço:', row.endereco);
    if (!endereco) return;
    const horariosStr = prompt('Horários (ex 12:00,18:00):', '');
    const horarios = horariosStr ? horariosStr.split(',').map(h => h.trim()).filter(Boolean) : [];
    try {
        await fetchJSON(`/api/restaurantes/${row.id_restaurante}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, endereco, horarios })
        });
        toast('Restaurante atualizado');
        init();
    } catch (e) {
        toast('Erro ao atualizar restaurante');
    }
}

async function deleteRestaurante(row) {
    if (!confirm('Excluir restaurante?')) return;
    try {
        await fetchJSON(`/api/restaurantes/${row.id_restaurante}`, { method: 'DELETE' });
        toast('Restaurante removido');
        init();
    } catch (e) {
        toast('Erro ao remover restaurante');
    }
}

async function addMesa() {
    const restauranteId = prompt('ID do restaurante:');
    if (!restauranteId) return;
    const capacidade = prompt('Capacidade:');
    if (!capacidade) return;
    const localizacao = prompt('Localização (interna/externa):');
    if (!localizacao) return;
    try {
        await fetchJSON('/api/mesas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ restauranteId, capacidade, localizacao })
        });
        toast('Mesa criada');
        init();
    } catch (e) {
        toast('Erro ao criar mesa');
    }
}

async function editMesa(row) {
    const capacidade = prompt('Capacidade:', row.capacidade);
    if (!capacidade) return;
    const localizacao = prompt('Localização (interna/externa):', row.localizacao);
    if (!localizacao) return;
    try {
        await fetchJSON(`/api/mesas/${row.id_mesa}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ capacidade, localizacao })
        });
        toast('Mesa atualizada');
        init();
    } catch (e) {
        toast('Erro ao atualizar mesa');
    }
}

async function deleteMesa(row) {
    if (!confirm('Excluir mesa?')) return;
    try {
        await fetchJSON(`/api/mesas/${row.id_mesa}`, { method: 'DELETE' });
        toast('Mesa removida');
        init();
    } catch (e) {
        toast('Erro ao remover mesa');
    }
}

async function addReserva() {
    const clienteId = prompt('ID do cliente:');
    if (!clienteId) return;
    const restauranteId = prompt('ID do restaurante:');
    if (!restauranteId) return;
    const horario = prompt('Horário (HH:MM):');
    if (!horario) return;
    const numPessoas = prompt('Número de pessoas:');
    if (!numPessoas) return;
    const localizacao = prompt('Localização (interna/externa):');
    if (!localizacao) return;
    const valorTotal = prompt('Valor total:');
    if (valorTotal == null) return;
    const cartaoNumero = prompt('Número do cartão:');
    if (!cartaoNumero) return;
    const mesaId = prompt('ID da mesa (opcional):');
    const body = { clienteId, restauranteId, horario, numPessoas, localizacao, valorTotal, cartaoNumero };
    if (mesaId) body.mesaId = mesaId;
    try {
        await fetchJSON('/api/reservas/criar-reserva', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        toast('Reserva criada');
        init();
    } catch (e) {
        toast('Erro ao criar reserva');
    }
}

async function editReserva(row) {
    const horario = prompt('Horário:', row.horario);
    const numPessoas = prompt('Número de pessoas:', row.num_pessoas);
    const preferencia_localizacao = prompt('Preferência localizacao:', row.preferencia_localizacao || '');
    const status_pagamento = prompt('Status pagamento:', row.status_pagamento || '');
    try {
        await fetchJSON(`/api/reservas/${row.id_reserva}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ horario, numPessoas, preferencia_localizacao, status_pagamento })
        });
        toast('Reserva atualizada');
        init();
    } catch (e) {
        toast('Erro ao atualizar reserva');
    }
}

async function deleteReserva(row) {
    if (!confirm('Excluir reserva?')) return;
    try {
        await fetchJSON(`/api/reservas/${row.id_reserva}`, { method: 'DELETE' });
        toast('Reserva removida');
        init();
    } catch (e) {
        toast('Erro ao remover reserva');
    }
}

async function renderClientes(container) {
    const data = await fetchJSON('/api/clientes');
    container.appendChild(buildTable(data, {
        title: 'Clientes',
        onAdd: addCliente,
        onEdit: editCliente,
        onDelete: deleteCliente
    }));
}

async function renderRestaurantes(container) {
    const data = await fetchJSON('/api/restaurantes');
    container.appendChild(buildTable(data, {
        title: 'Restaurantes',
        onAdd: addRestaurante,
        onEdit: editRestaurante,
        onDelete: deleteRestaurante
    }));
}

async function renderMesas(container) {
    const data = await fetchJSON('/api/mesas');
    container.appendChild(buildTable(data, {
        title: 'Mesas',
        onAdd: addMesa,
        onEdit: editMesa,
        onDelete: deleteMesa
    }));
}

async function renderReservas(container) {
    const data = await fetchJSON('/api/reservas');
    container.appendChild(buildTable(data, {
        title: 'Reservas',
        onAdd: addReserva,
        onEdit: editReserva,
        onDelete: deleteReserva
    }));
}

async function renderPagamentos(container) {
    const data = await fetchJSON('/api/pagamentos');
    container.appendChild(buildTable(data, { title: 'Pagamentos' }));
}

async function init() {
    const c = document.getElementById('adminTables');
    c.innerHTML = '';
    await renderClientes(c);
    await renderRestaurantes(c);
    await renderMesas(c);
    await renderReservas(c);
    await renderPagamentos(c);
}

init();
