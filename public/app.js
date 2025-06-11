const steps = Array.from(document.querySelectorAll('.step'));
let stepIndex = 0;
let clientes = [];
let restaurantes = [];
let mesas = [];
let selectedCliente = null;
let selectedRestaurante = null;
let selectedHorario = null;
let selectedMesa = null;

function showStep(i) {
    steps[stepIndex].classList.remove('active');
    stepIndex = i;
    steps[stepIndex].classList.add('active');
    document.getElementById('progress').textContent = `Etapa ${i + 1} de 4`;
}

function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 3000);
}

async function carregarClientes() {
    try {
        const res = await fetch('/api/clientes-disponiveis');
        clientes = await res.json();
        const sel = document.getElementById('clienteSelect');
        sel.innerHTML = '<option value="">Selecione...</option>';
        clientes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id_cliente;
            opt.textContent = c.nome;
            sel.appendChild(opt);
        });
    } catch (e) {
        toast('Erro ao carregar clientes');
    }
}

async function carregarRestaurantes() {
    try {
        const res = await fetch('/api/restaurantes');
        restaurantes = await res.json();
        const grid = document.getElementById('restauranteGrid');
        grid.innerHTML = '';
        restaurantes.forEach(r => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<h3>${r.nome}</h3><p>${r.endereco}</p><button>Selecionar</button>`;
            card.querySelector('button').addEventListener('click', () => {
                document.querySelectorAll('#restauranteGrid .card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedRestaurante = r;
                document.getElementById('restauranteNext').disabled = false;
            });
            grid.appendChild(card);
        });
    } catch (e) {
        toast('Erro ao carregar restaurantes');
    }
}

async function carregarHorarios() {
    if (!selectedRestaurante) return;
    try {
        const res = await fetch(`/api/horarios?restauranteId=${selectedRestaurante.id_restaurante}`);
        const horarios = await res.json();
        const sel = document.getElementById('horarioSelect');
        sel.innerHTML = '<option value="">Selecione...</option>';
        horarios.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h.horario;
            opt.textContent = h.horario;
            sel.appendChild(opt);
        });
    } catch (e) {
        toast('Erro ao carregar horários');
    }
}

async function carregarLayout() {
    selectedHorario = document.getElementById('horarioSelect').value;
    if (!selectedHorario) return;
    try {
        const res = await fetch(`/api/mesas?restauranteId=${selectedRestaurante.id_restaurante}`);
        mesas = await res.json();
        const map = document.getElementById('layout-map');
        map.innerHTML = '';
        const areas = { interna: [], externa: [] };
        for (const m of mesas) {
            try {
                const dispRes = await fetch('/api/reservas/verificar-disponibilidade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ restauranteId: selectedRestaurante.id_restaurante, horario: selectedHorario, numPessoas: 1, mesaId: m.id_mesa })
                });
                const disp = await dispRes.json();
                if (!disp.disponivel) continue;
                areas[m.localizacao].push(m);
            } catch (_) { }
        }
        ['interna', 'externa'].forEach(loc => {
            const group = areas[loc];
            if (!group.length) return;
            const wrapper = document.createElement('div');
            wrapper.className = 'table-area';
            const title = document.createElement('div');
            title.className = 'area-title';
            title.textContent = loc === 'interna' ? 'Área Interna' : 'Área Externa';
            wrapper.appendChild(title);
            const grid = document.createElement('div');
            grid.className = 'table-group';
            group.forEach(m => {
                const btn = document.createElement('button');
                btn.className = 'table-btn available';
                btn.title = `Número ${m.id_mesa}`;
                btn.textContent = m.capacidade;
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.table-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    selectedMesa = m;
                    document.getElementById('horarioNext').disabled = false;
                });
                grid.appendChild(btn);
            });
            wrapper.appendChild(grid);
            map.appendChild(wrapper);
        });
    } catch (e) {
        toast('Erro ao carregar mesas');
    }
}

function preencherResumo() {
    const div = document.getElementById('resumo');
    div.innerHTML = `Cliente: <strong>${selectedCliente.nome}</strong><br>` +
        `Restaurante: <strong>${selectedRestaurante.nome}</strong><br>` +
        `Horário: <strong>${selectedHorario}</strong><br>` +
        `Mesa: <strong>${selectedMesa.id_mesa}</strong> (Cap ${selectedMesa.capacidade})`;
}

async function confirmarReserva() {
    if (!selectedMesa) return;
    const data = {
        clienteId: selectedCliente.id_cliente,
        restauranteId: selectedRestaurante.id_restaurante,
        horario: selectedHorario,
        numPessoas: 1,
        valorTotal: 0,
        cartaoNumero: document.getElementById('cartao').value,
        mesaId: selectedMesa.id_mesa
    };
    try {
        const res = await fetch('/api/reservas/criar-reserva', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        toast(result.sucesso ? 'Reserva criada com sucesso' : (result.mensagem || 'Erro'));
        if (result.sucesso) {
            showStep(0);
            await carregarClientes();
        }
    } catch (e) {
        toast('Erro ao criar reserva');
    }
}

// Listeners inicial
carregarClientes();

document.getElementById('clienteSelect').addEventListener('change', e => {
    const id = e.target.value;
    selectedCliente = clientes.find(c => String(c.id_cliente) === id);
    document.getElementById('clienteNext').disabled = !id;
});

document.getElementById('toggleNovoCliente').addEventListener('click', () => {
    const form = document.getElementById('cliente-form');
    form.classList.toggle('show');
});

document.getElementById('salvarCliente').addEventListener('click', async () => {
    const nome = document.getElementById('novoNome').value;
    const telefone = document.getElementById('novoTelefone').value;
    const email = document.getElementById('novoEmail').value;
    try {
        const res = await fetch('/api/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, telefone, email })
        });
        const c = await res.json();
        if (res.ok) {
            toast('Cliente cadastrado');
            await carregarClientes();
            document.getElementById('clienteSelect').value = c.id_cliente;
            selectedCliente = c;
            document.getElementById('clienteNext').disabled = false;
            document.getElementById('cliente-form').classList.remove('show');
        } else {
            toast(c.message || 'Erro ao cadastrar');
        }
    } catch (e) {
        toast('Erro ao cadastrar cliente');
    }
});

document.getElementById('clienteNext').addEventListener('click', () => {
    showStep(1);
    carregarRestaurantes();
});

document.getElementById('backRestaurante').addEventListener('click', () => showStep(0));
document.getElementById('restauranteNext').addEventListener('click', () => {
    showStep(2);
    carregarHorarios();
});

document.getElementById('backHorario').addEventListener('click', () => showStep(1));
document.getElementById('horarioSelect').addEventListener('change', () => {
    document.getElementById('horarioNext').disabled = true;
    carregarLayout();
});

document.getElementById('horarioNext').addEventListener('click', () => {
    preencherResumo();
    showStep(3);
});

document.getElementById('backPagamento').addEventListener('click', () => showStep(2));
document.getElementById('confirmarReserva').addEventListener('click', confirmarReserva);

document.getElementById('adminBtn').addEventListener('click', async () => {
    const pwd = prompt('Senha do administrador:');
    if (!pwd) return;
    try {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pwd })
        });
        if (res.ok) {
            window.location.href = 'admin.html';
        } else {
            toast('Senha incorreta');
        }
    } catch (e) {
        toast('Erro ao autenticar');
    }
});
