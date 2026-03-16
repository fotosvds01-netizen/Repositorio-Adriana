const api = '/api/livros';
let livrosCache = [];
let livroEditandoId = null;

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuNavegacao = document.querySelector('.menu-navegacao');
    const userStatus = document.getElementById('user-status');
    const loginMenuItem = document.getElementById('login-menu-item');
    const logoutMenuItem = document.getElementById('logout-menu-item');
    const logoutBtn = document.getElementById('logout-btn');

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('usuarioEmail');

    if (menuToggle && menuNavegacao) {
        menuToggle.addEventListener('click', function() {
            menuNavegacao.classList.toggle('ativo');
            menuToggle.classList.toggle('ativo');
        });
        const linksMenu = document.querySelectorAll('.lista-menu a');
        linksMenu.forEach(link => {
            link.addEventListener('click', function() {
                menuNavegacao.classList.remove('ativo');
                menuToggle.classList.remove('ativo');
            });
        });
    }

    // Atualiza status de usuário logado no cabeçalho
    if (userStatus && token && email) {
        userStatus.textContent = `${email} está conectado`;
    }

    if (loginMenuItem) {
        loginMenuItem.style.display = token ? 'none' : 'block';
    }

    if (logoutMenuItem) {
        logoutMenuItem.style.display = token ? 'block' : 'none';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioNome');
            localStorage.removeItem('usuarioPapel');
            localStorage.removeItem('usuarioEmail');
            window.location.href = 'index.html';
        });
    }

    if (document.getElementById('tabelaDeLivro')) {
        listarLivro();
    }
});
function cadastrarLivro() {

    const titulo = document.getElementById("titulo")?.value;
    const autor = document.getElementById("autor")?.value;
    const ano = document.getElementById("ano")?.value;
    const genero = document.getElementById("genero")?.value;

    if (!titulo || !autor || !ano || !genero) {
        alert("Preencha todos os campos!");
        return; 
    }

    const metodo = livroEditandoId ? 'PUT' : 'POST';
    const url = livroEditandoId ? `${api}/${livroEditandoId}` : api;

    fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ titulo, autor, ano, genero })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error();
        }
        return res.json();
    })
    .then(() => {
        listarLivro();
        limparCampos();
        if (livroEditandoId) {
            livroEditandoId = null;
            const btnSalvar = document.getElementById('btnSalvarLivro');
            const btnCancelar = document.getElementById('btnCancelarEdicao');
            if (btnSalvar) btnSalvar.textContent = 'Cadastrar livro';
            if (btnCancelar) btnCancelar.style.display = 'none';
            alert('Livro atualizado com sucesso!');
        } else {
            alert('Livro cadastrado com sucesso!');
        }
    })
    .catch(() => {
        alert('Erro ao salvar livro');
    });
}

function listarLivro() {

    fetch(api)
    .then(res => res.json()) 
    .then(livros => {
        livrosCache = livros;
        const papel = localStorage.getItem('usuarioPapel');
        const tabela = document.getElementById("tabelaDeLivro");
        tabela.innerHTML = "";

        livros.forEach(livro => {
            let acoesHtml = '';
            if (papel === 'admin') {
                acoesHtml = `
                    <button class="btn-tabela btn-editar" onclick="prepararEdicao(${livro.id})">Editar</button>
                    <button class="btn-tabela btn-excluir" onclick="deletarLivro(${livro.id})">Excluir</button>
                `;
            } else if (papel === 'usuario') {
                acoesHtml = `
                    <button class="btn-tabela btn-editar" onclick="prepararEdicao(${livro.id})">Editar</button>
                `;
            }
            tabela.innerHTML += `
                <tr>
                    <td title="${livro.id}">${livro.id}</td>
                    <td title="${livro.titulo}">${livro.titulo}</td>
                    <td title="${livro.autor}">${livro.autor}</td>
                    <td title="${livro.ano}">${livro.ano}</td>
                    <td title="${livro.genero}">${livro.genero}</td>
                    <td>${acoesHtml}</td>
                </tr>
            `;
        });
    })
    .catch(() => {
        alert('Erro ao listar livros');
    });
}

function deletarLivro(id) {
    if (!confirm('Tem certeza que deseja excluir este livro?')) {
        return;
    }
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Apenas administradores podem excluir livros. Faça login primeiro.');
        return;
    }

    fetch(`${api}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error();
        }
        return res.json();
      })
      .then(() => {
        listarLivro();
      })
      .catch(() => {
        alert('Erro ao deletar livro');
      });
}

function limparCampos() {
    if (document.getElementById("titulo")) document.getElementById("titulo").value = '';
    if (document.getElementById("autor")) document.getElementById("autor").value = '';
    if (document.getElementById("ano")) document.getElementById("ano").value = '';
    if (document.getElementById("genero")) document.getElementById("genero").value = '';
}

function prepararEdicao(id) {
    const livro = livrosCache.find(l => l.id === id);
    if (!livro) return;

    livroEditandoId = id;

    if (document.getElementById('titulo')) document.getElementById('titulo').value = livro.titulo;
    if (document.getElementById('autor')) document.getElementById('autor').value = livro.autor;
    if (document.getElementById('ano')) document.getElementById('ano').value = livro.ano;
    if (document.getElementById('genero')) document.getElementById('genero').value = livro.genero;

    const btnSalvar = document.getElementById('btnSalvarLivro');
    const btnCancelar = document.getElementById('btnCancelarEdicao');
    if (btnSalvar) btnSalvar.textContent = 'Salvar alterações';
    if (btnCancelar) btnCancelar.style.display = 'inline-block';
}

function cancelarEdicao() {
    livroEditandoId = null;
    limparCampos();
    const btnSalvar = document.getElementById('btnSalvarLivro');
    const btnCancelar = document.getElementById('btnCancelarEdicao');
    if (btnSalvar) btnSalvar.textContent = 'Cadastrar livro';
    if (btnCancelar) btnCancelar.style.display = 'none';
}