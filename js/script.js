// Selecionar primeiro os inputs individualmente
const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");
const fadeElement = document.querySelector("#fade");

//Validar CEP no input
cepInput.addEventListener("keypress", (e) => {
    const onlyNumber = /[0-9]/;
    const key = String.fromCharCode(e.keyCode);

//Validar para permitir apenas números
if(!onlyNumber.test(key)){
    e.preventDefault();
    return;
}
});

//Get address envent 
cepInput.addEventListener("keyup", (e) => {
    const inputValue = e.target.value;

// checar se tem a quantidade certa de numeros
    if(inputValue.length === 8){
    getAddress(inputValue);
    }
});

// get customer address from API

const getAddress = async (cep) => {
    toggleLoader();

    //nao vaipeermitir que o usuaria envie requisições
    cepInput.blur();

    //Api do CEP

    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
   
    //vai trazer os dados da requisição
    const response = await fetch(apiUrl);

    //Recebe os dados do endereço que queremos
    const data = await response.json();

    //cheacar por CEP errados e resetar o formulario

    if(data.erro === "true"){
        if(!addressInput.hasAttribute("disabled")){
            toggleDisabled();
        }

        addressForm.reset();
        toggleLoader();
        //exibir a mensagem de erro
        toggleMessage("CEP invalido, tente novamente.");
        return;
    }

    if(addressInput.value === ""){
        toggleDisabled();
    }

    addressInput.value = data.logradouro;
    cityInput.value = data.localidade;
    neighborhoodInput.value = data.bairro;
    regionInput.value = data.uf;

    toggleLoader();
};

//add or remove disabled attribute
const toggleDisabled = () =>{
    if (regionInput.hasAttribute("disabled")){
        formInputs.forEach((input) => {
            input.removeAttribute("disabled")
        });
    }else{
        formInputs.forEach((input) => {
            input.setAttribute("disabled", "disabled")
        });
    }
}
//show or hide loader
const toggleLoader = () => {
    const loaderElement = document.querySelector("#loader");

    fadeElement.classList.toggle("hide");
    loaderElement.classList.toggle("hide");
}

//exbir a mensagem de erro

const toggleMessage =(msg) => {

    const messageElement = document.querySelector("#message");
    
    const messageElementText = document.querySelector("#message p");

    messageElementText.innerText = msg;

    fadeElement.classList.toggle("hide");
    messageElement.classList.toggle("hide");
};

//fechar o modal de erro
closeButton.addEventListener("click", ()=> toggleMessage())

//salvar o endereço
addressForm.addEventListener("submit", (e)=>{
    
    e.preventDefault()

    toggleLoader();
    setTimeout(()=>{

        toggleLoader();
        toggleMessage("Endereço salvo com sucesso!");
        addressForm.reset();
        toggleDisabled();

    },1500)
})