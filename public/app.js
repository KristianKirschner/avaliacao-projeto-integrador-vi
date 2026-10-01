const API = '/api/livros';
const $ = (id) => document.getElementById(id);

async function carregar() {
  const status = $('filtro').value;
  const res = await fetch(status ? `${API}?status=${encodeURIComponent(status)}` : API);
  const livros = await res.json();

  $('lista').innerHTML = '';
  $('vazio').hidden = livros.length > 0;

  livros.forEach((l) => {
    const tr = document.createElement('tr');
    const celulas = [l.titulo, l.autor, l.ano ?? '-'];
    celulas.forEach((texto) => {
      const td = document.createElement('td');
      td.textContent = texto;
      tr.appendChild(td);
    });

    const tdStatus = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `badge ${l.status === 'lido' ? 'lido' : l.status === 'lendo' ? 'lendo' : ''}`;
    badge.textContent = l.status;
    tdStatus.appendChild(badge);
    tr.appendChild(tdStatus);

    const tdAcoes = document.createElement('td');
    const editar = document.createElement('button');
    editar.textContent = 'Editar';
    editar.onclick = () => editarLivro(l);
    const excluir = document.createElement('button');
    excluir.textContent = 'Excluir';
    excluir.className = 'perigo';
    excluir.onclick = () => excluirLivro(l.id);
    tdAcoes.append(editar, excluir);
    tr.appendChild(tdAcoes);

    $('lista').appendChild(tr);
  });
}

function limparForm() {
  $('form-livro').reset();
  $('id').value = '';
  $('form-titulo').textContent = 'Adicionar livro';
  $('btn-cancelar').hidden = true;
  $('mensagem').textContent = '';
}

function editarLivro(l) {
  $('id').value = l.id;
  $('titulo').value = l.titulo;
  $('autor').value = l.autor;
  $('ano').value = l.ano ?? '';
  $('status').value = l.status;
  $('form-titulo').textContent = 'Editar livro';
  $('btn-cancelar').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function excluirLivro(id) {
  if (!confirm('Excluir este livro?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  carregar();
}

$('form-livro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = $('id').value;
  const dados = {
    titulo: $('titulo').value.trim(),
    autor: $('autor').value.trim(),
    ano: $('ano').value === '' ? null : Number($('ano').value),
    status: $('status').value,
  };

  const res = await fetch(id ? `${API}/${id}` : API, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  if (!res.ok) {
    const erro = await res.json();
    $('mensagem').textContent = [].concat(erro.erro).join(', ');
    return;
  }
  limparForm();
  carregar();
});

$('btn-cancelar').addEventListener('click', limparForm);
$('filtro').addEventListener('change', carregar);

carregar();
