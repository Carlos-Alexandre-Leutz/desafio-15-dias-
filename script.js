let url = "https://desafio-15-dias-default-rtdb.firebaseio.com";
let estaEditando = false;

function getLista() {
    let html = "";
    let listaDeTarefaSalvas = document.getElementById("listaDeTarefaSalvas");
    fetch(url + "/tarefas.json").then(response => {
        if (response.status === 200) {
            response.json().then(dados => {
                let arrayListarefas = Object.entries(dados);
                arrayListarefas.forEach(element => {
                    html += montarLista(element[1]);
                });
                listaDeTarefaSalvas.innerHTML = html;
            });
        }
    });
}

function montarLista(tarefa) {
    return `<li id="${tarefa.id}">
                <strong>${tarefa.titulo}</strong><br>
                ${tarefa.descricao}<br>
                <button onclick="editarTarefa('${tarefa.id}')">Editar</button>
                <button onclick="deletarTarefa('${tarefa.id}')">Deletar</button>
            </li>`;
}

function editarTarefa(id) {
    if (!estaEditando) {
        let liParaEditar = document.getElementById(id);
        const html = `<div>
            <div>
                <label>Editar título da tarefa</label><br>
                <input id="edit-titulo" type="text" placeholder="Título da tarefa">
            </div>
            <div>
                <label>Editar descrição da tarefa</label><br>
                <textarea id="edit-descricao" placeholder="Descrição da tarefa"></textarea>
            </div>
            <button onclick="salvarTarefa('${id}')" >Salvar</button>
        </div>`;
        liParaEditar.innerHTML = html;
        estaEditando = true;
    }
}

function salvarTarefa(id) {
    const titulo = document.getElementById("edit-titulo").value;
    const descricao = document.getElementById("edit-descricao").value;

    const tarefa = {
        titulo: titulo,
        descricao: descricao
    };

    fetch(`${url}/tarefas/${id}.json`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarefa)
    }).then(response => {
        if (response.ok) {
            estaEditando = false;
            getLista(); // Atualiza a lista
        }
    });
}

function deletarTarefa(id) {
    fetch(`${url}/tarefas/${id}.json`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            getLista(); // Atualiza a lista
        }
    });
}

function criarTarefa() {
    let titulo = document.getElementById("titulo").value;
    let descricao = document.getElementById("descricao").value;
    let mensagem = document.getElementById("mensagem");

    const id = new Date().toISOString(); // Define o ID
    const tarefa = {
        id: id,
        titulo: titulo,
        descricao: descricao
    };

    fetch(`${url}/tarefas/${id}.json`, {
        method: 'PUT', // Usamos PUT para gravar com id personalizado
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tarefa)
    }).then(response => {
        if (response.status === 200) {
            mensagem.innerHTML = "Salvo com sucesso";
            getLista();
        } else {
            mensagem.innerHTML = "Erro ao salvar";
        }
    }).catch(error => {
        console.log(error);
        mensagem.innerHTML = error;
    });
}
