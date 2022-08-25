let toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

let criarNotaEditor = new Quill('#criarNotaEditor', {
    modules: {
      toolbar: toolbarOptions
    },
    theme: 'snow'
  });

let alterarNotaEditor = new Quill('#alterarNotaEditor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
});


function elementFromHtml(html){
  const template = document.createElement('template')

  template.innerHTML = html.trim()

  return template.content.firstElementChild
}

function salvarNota(){
  let num = localStorage.length

  const nomeNota = document.getElementById('criarNotaNome').value

  const corpoNota = criarNotaEditor.root.innerHTML

  let erro = document.querySelector('#erro-nota')

  if(nomeNota == '' || corpoNota == '<p><br></p>'){

    erro.appendChild(elementFromHtml(`
      <div class="alert alert-danger alert-dismissible" role="alert">
        *Um ou mais campos não foram preenchidos
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `));
    return
  }

  const nota = {
    nome: nomeNota,
    corpo: corpoNota
  }

  localStorage.setItem(num, JSON.stringify(nota))

  document.getElementById('criarNotaNome').value = ''

  criarNotaEditor.setContents([{ insert: '\n' }]);
  
  location.reload()
}

const listaDeNotas = document.querySelector('#lista-de-notas')

function allStorage(){
  let archive = [],
    keys = Object.keys(localStorage),
    i = keys.length
  
  while (i--){
    archive[keys[i]] = Object.values(JSON.parse(localStorage.getItem(keys[i])))
  }
  return archive
}

allStorage().forEach((note, index)=> {
  let titulo = note[0]

  listaDeNotas.appendChild(elementFromHtml(`
    <div class="card mt-4 ">
      <h5 class="card-header titulo">${titulo}</h5>
      <div class="card-body ">
          <p class="card-text padding-left-5">${note[1]}</p>
          <div >
            <a class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#editar-nota" onclick="edicaoNota(${index})" >Editar nota</a>
            <a href="" onclick="apagarNota(${index})" class="btn btn-sm btn-danger">Apagar nota</a>
          <div>
      </div>  
    </div>

    `))
});


function apagarNota(e){
  localStorage.removeItem(e)
}

const tituloNota = document.querySelector('#titulo-nota')

function edicaoNota(index){
  const nota = Object.values(JSON.parse(localStorage.getItem(index)))

  tituloNota.innerHTML = nota[0]

  alterarNotaEditor.root.innerHTML = nota[1]
  
  botao = document.querySelector('#alterar')

  botao.appendChild(elementFromHtml(`
        <button onclick="editarNota(${index})" id="editar" class="btn btn-primary btn-md" >
            Alterar
        </button>
  `))
}

function editarNota(index){
  const nota = Object.values(JSON.parse(localStorage.getItem(index)))

  novaNota = {
      nome: nota[0],
      corpo: alterarNotaEditor.root.innerHTML
  } 

  localStorage.setItem(index, JSON.stringify(novaNota))

  tituloNota.value = ''

  alterarNotaEditor.setContents([{ insert: '\n' }]);
  
  location.reload()
}


function fecharEditor(){
  document.querySelector('#editar').remove()

}

if(localStorage.length == 0){
  listaDeNotas.appendChild(elementFromHtml(`
  <div>
    <h6 class="text-muted">Nenhuma nota foi encontrada... </h6>
  </div>`))
  
}